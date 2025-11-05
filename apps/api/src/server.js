import express from 'express';
import pg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { google } from 'googleapis';
import ArticleScheduler from './scheduler.js';
import { getRichContentSections, buildBrandContext, getLengthGuidance, getFormattingPrompt } from './prompts.js';
import { generateArticleImage, generateWebinarImage } from './imageUtils.js';
import { getAvailableSlots, createCalendarEvent, cancelCalendarEvent } from './googleCalendar.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from the root directory (three levels up from apps/api/src/)
dotenv.config({ path: join(__dirname, '..', '..', '..', '.env') });

const { Pool } = pg;
const app = express();
const port = process.env.PORT || 3001;

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error connecting to PostgreSQL:', err.stack);
    process.exit(1);
  }
  console.log('✅ PostgreSQL connected successfully');
  release();
});

// Initialize Article Scheduler (after database is connected)
let articleScheduler = null;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:8080',
    'http://localhost:8081',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
}));
app.use(express.json());

// ==================== MODEL CONFIGURATION ====================
// All AI models loaded from environment variables with defaults
const CONTENT_MODEL = process.env.CONTENT_MODEL || 'gpt-4o';
const CONTENT_MODEL_FALLBACK = process.env.CONTENT_MODEL_FALLBACK || 'gpt-4o-mini';
const FORMATTER_MODEL = process.env.FORMATTER_MODEL || 'gpt-4o-mini';
const FORMATTER_MODEL_FALLBACK = process.env.FORMATTER_MODEL_FALLBACK || 'gpt-4o-mini';

console.log('🤖 AI Model Configuration:');
console.log(`   Content Model: ${CONTENT_MODEL} (fallback: ${CONTENT_MODEL_FALLBACK})`);
console.log(`   Formatter Model: ${FORMATTER_MODEL} (fallback: ${FORMATTER_MODEL_FALLBACK})`);

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Enforce max 2 featured articles limit
 * If adding a new featured article would exceed limit, unfeature the oldest one
 * @param {number|null} excludeId - ID of article to exclude from count (when updating existing article)
 */
async function enforceFeaturedLimit(excludeId = null) {
  try {
    // Get all currently featured articles, excluding the one being updated
    const query = excludeId
      ? 'SELECT id FROM articles WHERE featured = true AND id != $1 ORDER BY date_created ASC'
      : 'SELECT id FROM articles WHERE featured = true ORDER BY date_created ASC';
    
    const params = excludeId ? [excludeId] : [];
    const result = await pool.query(query, params);
    
    // If we have 2 or more featured articles, unfeature the oldest one(s)
    if (result.rows.length >= 2) {
      const oldestId = result.rows[0].id;
      await pool.query('UPDATE articles SET featured = false WHERE id = $1', [oldestId]);
      console.log(`✅ Auto-unfeatured oldest article (ID: ${oldestId}) to maintain 2-article limit`);
    }
  } catch (err) {
    console.error('❌ Error enforcing featured limit:', err);
    // Don't throw - this is a non-critical operation
  }
}

// ============================================================
// API ROUTES
// ============================================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend API is running' });
});

// OpenAI connection check endpoint
app.get('/api/openai/status', (req, res) => {
  const hasApiKey = !!process.env.OPENAI_API_KEY;
  const hasModels = !!(CONTENT_MODEL && FORMATTER_MODEL);
  
  res.json({ 
    connected: hasApiKey && hasModels,
    hasApiKey,
    hasModels,
    contentModel: CONTENT_MODEL,
    formatterModel: FORMATTER_MODEL
  });
});

// ==================== SETTINGS ENDPOINTS ====================

// GET /api/scheduler/status - Get scheduler status
app.get('/api/scheduler/status', (req, res) => {
  if (!articleScheduler) {
    return res.json({
      initialized: false,
      active: false,
      schedule: null,
      nextRun: 'Scheduler not initialized'
    });
  }
  
  res.json(articleScheduler.getStatus());
});

// POST /api/scheduler/trigger - Manually trigger scheduled generation
app.post('/api/scheduler/trigger', async (req, res) => {
  if (!articleScheduler) {
    return res.status(503).json({ error: 'Scheduler not initialized' });
  }
  
  try {
    // Trigger in background
    articleScheduler.triggerManual();
    res.json({ 
      success: true, 
      message: 'Manual generation triggered. Check articles in a few minutes.' 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to trigger manual generation', details: error.message });
  }
});

app.get('/api/settings', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, topics, schedule, auto, positioning, tone, brand_pillars, updated_at FROM articles_settings ORDER BY id LIMIT 1'
    );
    
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.json({
        topics: ['Startup Strategy', 'Product Development', 'Fundraising', 'Market Analysis', 'Growth Tactics', 'Founder Mindset', 'Team Building', 'Customer Discovery'],
        schedule: '0 9 * * 1',
        auto: false,
        positioning: '',
        tone: '',
        brand_pillars: ''
      });
    }
  } catch (err) {
    console.error('Error loading settings:', err);
    res.status(500).json({ error: 'Failed to load settings', details: err.message });
  }
});

app.put('/api/settings', async (req, res) => {
  const { topics, schedule, auto, positioning, tone, brand_pillars } = req.body;
  
  if (!topics || !schedule || auto === undefined) {
    return res.status(400).json({ error: 'Missing required fields: topics, schedule, auto' });
  }

  try {
    const query = `
      INSERT INTO articles_settings (id, topics, schedule, auto, positioning, tone, brand_pillars, updated_at)
      VALUES (1, $1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
      ON CONFLICT (id) DO UPDATE SET
        topics = $1,
        schedule = $2,
        auto = $3,
        positioning = $4,
        tone = $5,
        brand_pillars = $6,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    
    const result = await pool.query(query, [topics, schedule, auto, positioning || '', tone || '', brand_pillars || '']);
    
    // Reload scheduler with new settings
    if (articleScheduler) {
      await articleScheduler.reloadSettings();
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error saving settings:', err);
    res.status(500).json({ error: 'Failed to save settings', details: err.message });
  }
});

// ==================== ARTICLES ENDPOINTS ====================

// POST /api/articles/generate - Generate article in background (2-step AI process)
app.post('/api/articles/generate', async (req, res) => {
  try {
    const { topic, inputType, customBrief, keywordList, model, featured } = req.body;
    
    const jobId = Date.now().toString();
    
    // Immediately respond to client with jobId
    res.status(202).json({ 
      message: 'Your article will be published within the next 5-10 minutes',
      status: 'processing',
      jobId: jobId
    });
    
    // Generate article in background (don't await)
    generateArticleInBackground({ topic, inputType, customBrief, keywordList, model, featured }, jobId);
    
  } catch (err) {
    console.error('Error initiating article generation:', err);
    res.status(500).json({ error: 'Failed to initiate article generation', details: err.message });
  }
});

// GET /api/articles/status/:jobId - Get generation status
app.get('/api/articles/status/:jobId', (req, res) => {
  const { jobId } = req.params;
  const status = generationStatus.get(jobId);
  
  if (!status) {
    return res.status(404).json({ error: 'Job not found or completed' });
  }
  
  res.json(status);
});

// Store generation status in memory (simple approach)
const generationStatus = new Map();

// Background article generation function (2-step AI process)
async function generateArticleInBackground(params, jobId) {
  generationStatus.set(jobId, { step: 'generating', message: 'Generating raw content...' });
  
  try {
    console.log('🚀 Starting 2-step background article generation:', params);
    
    // Load Brand Essence settings from database
    let brandEssence = {
      positioning: '',
      tone: '',
      brand_pillars: ''
    };
    
    try {
      const settingsResult = await pool.query(
        'SELECT positioning, tone, brand_pillars FROM articles_settings ORDER BY id LIMIT 1'
      );
      if (settingsResult.rows.length > 0) {
        brandEssence = {
          positioning: settingsResult.rows[0].positioning || '',
          tone: settingsResult.rows[0].tone || '',
          brand_pillars: settingsResult.rows[0].brand_pillars || ''
        };
        console.log('✅ Loaded Brand Essence from database');
      }
    } catch (err) {
      console.warn('⚠️ Could not load Brand Essence, using defaults:', err.message);
    }
    
    // Import OpenAI
    const OpenAI = (await import('openai')).default;
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    // Get current date for context
    const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    
    // ========== RANDOMLY SELECT 2 RICH CONTENT SECTIONS ==========
    const availableSections = getRichContentSections();
    
    // Randomly select 2 sections
    const shuffled = availableSections.sort(() => Math.random() - 0.5);
    const selectedSections = shuffled.slice(0, 2);
    console.log(`🎲 Randomly selected sections: ${selectedSections.map(s => s.name).join(', ')}`);
    
    // Build the instructions for selected sections
    const selectedContentInstructions = selectedSections.map(s => s.contentInstructions).join('\n\n   ');
    const selectedFormatInstructions = selectedSections.map(s => s.formatInstructions).join('\n\n   ');
    
    // Build Brand Essence context for system prompt
    const brandContext = buildBrandContext(brandEssence, currentDate);
    
    // ========== STEP 1: CONTENT GENERATION ==========
    generationStatus.set(jobId, { step: 'generating', message: 'Step 1: Generating raw content...' });
    console.log(`📝 Step 1: Generating raw content with ${CONTENT_MODEL}...`);
    
    // Calculate target word count for 9-15 min read time (200 words per minute)
    const targetReadTime = Math.floor(Math.random() * 7) + 9; // Random between 9-15
    const targetWordCount = targetReadTime * 200; // e.g., 9 min = 1800 words, 15 min = 3000 words
    console.log(`🎯 Target article length: ${targetReadTime} min read (${targetWordCount} words)`);
    
    let contentPrompt = '';
    const lengthGuidance = getLengthGuidance(targetWordCount, targetReadTime, selectedContentInstructions);
    
    if (params.inputType === 'brief') {
      contentPrompt = `Write a comprehensive, in-depth blog article based on this brief:\n\n${params.customBrief}\n\nFocus on the latest, most up-to-date information (${currentDate}). Provide the raw content with clear structure but no HTML formatting.${lengthGuidance}`;
    } else if (params.inputType === 'keywords') {
      contentPrompt = `Write a comprehensive, in-depth blog article incorporating these keywords:\n\n${params.keywordList}\n\nFocus on the latest, most up-to-date information (${currentDate}). Provide the raw content with clear structure but no HTML formatting.${lengthGuidance}`;
    } else {
      contentPrompt = `Write a comprehensive, in-depth blog article about: ${params.topic}\n\nFocus on the latest, most up-to-date information (${currentDate}). Provide the raw content with clear structure but no HTML formatting.${lengthGuidance}`;
    }
    
    // Try primary content model first, fallback if it fails
    let contentCompletion;
    let actualContentModel = CONTENT_MODEL;
    
    try {
      contentCompletion = await openai.chat.completions.create({
        model: CONTENT_MODEL,
        messages: [
          { 
            role: 'system', 
            content: brandContext
          },
          { role: 'user', content: contentPrompt }
        ],
        max_completion_tokens: 8000
      });
      console.log(`✅ Successfully used ${CONTENT_MODEL} for content generation`);
    } catch (error) {
      console.warn(`⚠️ ${CONTENT_MODEL} failed, falling back to ${CONTENT_MODEL_FALLBACK}:`, error.message);
      actualContentModel = CONTENT_MODEL_FALLBACK;
      
      contentCompletion = await openai.chat.completions.create({
        model: CONTENT_MODEL_FALLBACK,
        messages: [
          { 
            role: 'system', 
            content: brandContext
          },
          { role: 'user', content: contentPrompt }
        ],
        max_completion_tokens: 8000
      });
      console.log(`✅ Successfully used ${CONTENT_MODEL_FALLBACK} as fallback`);
    }
    
    const rawContent = contentCompletion.choices[0].message.content;
    console.log(`✅ Step 1 complete: Generated ${rawContent.length} characters of raw content with ${actualContentModel}`);
    
    // ========== STEP 2: HTML/CSS FORMATTING ==========
    generationStatus.set(jobId, { step: 'formatting', message: 'Step 2: Formatting content...' });
    console.log(`🎨 Step 2: Formatting content with ${FORMATTER_MODEL}...`);
    
    const formattingPrompt = getFormattingPrompt(rawContent, selectedFormatInstructions);
    
    // Try primary formatter model first, fallback if it fails
    let formattingCompletion;
    let actualFormatterModel = FORMATTER_MODEL;
    
    try {
      formattingCompletion = await openai.chat.completions.create({
        model: FORMATTER_MODEL,
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert HTML/CSS formatter. You take raw content and format it into clean, semantic HTML that matches specific design system requirements. Always follow the exact CSS classes provided.'
          },
          { role: 'user', content: formattingPrompt }
        ],
        max_completion_tokens: 10000
      });
      console.log(`✅ Successfully used ${FORMATTER_MODEL} for formatting`);
    } catch (error) {
      console.warn(`⚠️ ${FORMATTER_MODEL} failed, falling back to ${FORMATTER_MODEL_FALLBACK}:`, error.message);
      actualFormatterModel = FORMATTER_MODEL_FALLBACK;
      
      formattingCompletion = await openai.chat.completions.create({
        model: FORMATTER_MODEL_FALLBACK,
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert HTML/CSS formatter. You take raw content and format it into clean, semantic HTML that matches specific design system requirements. Always follow the exact CSS classes provided.'
          },
          { role: 'user', content: formattingPrompt }
        ],
        max_completion_tokens: 10000
      });
      console.log(`✅ Successfully used ${FORMATTER_MODEL_FALLBACK} as fallback`);
    }
    
    let formattedContent = formattingCompletion.choices[0].message.content;
    formattedContent = formattedContent.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();
    console.log(`✅ Step 2 complete: Formatted into HTML with ${actualFormatterModel}`);
    
    // ========== STEP 3: GENERATE METADATA ==========
    generationStatus.set(jobId, { step: 'metadata', message: 'Step 3: Generating title and metadata...' });
    console.log('📌 Step 3: Generating title and metadata...');
    
    // Generate title
    const titleCompletion = await openai.chat.completions.create({
      model: FORMATTER_MODEL,
      messages: [
        { role: 'system', content: 'You are a headline expert. Create compelling, SEO-friendly titles.' },
        { role: 'user', content: `Generate ONE compelling title (50-70 characters) for an article about: ${params.topic || 'startup strategy'}. Return ONLY the title, nothing else.` }
      ],
      max_completion_tokens: 100
    });
    
    const title = titleCompletion.choices[0].message.content.replace(/^["']|["']$/g, '').trim() || 'Untitled Article';
    
    // Generate slug
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    
    // Check for duplicate URL before continuing (saves API costs)
    console.log('🔍 Checking for duplicate URL:', slug);
    const duplicateCheck = await pool.query('SELECT id FROM articles WHERE url = $1', [slug]);
    if (duplicateCheck.rows.length > 0) {
      const errorMessage = `Article with URL "${slug}" already exists. Please delete the existing article or choose a different topic.`;
      console.error('❌', errorMessage);
      generationStatus.set(jobId, { 
        step: 'error', 
        message: errorMessage,
        error: 'DUPLICATE_URL'
      });
      throw new Error(errorMessage);
    }
    console.log('✅ URL is unique, continuing...');
    
    // Generate excerpt
    const excerptCompletion = await openai.chat.completions.create({
      model: FORMATTER_MODEL,
      messages: [
        { role: 'system', content: 'You are an expert at writing compelling meta descriptions.' },
        { role: 'user', content: `Create a 2-3 sentence excerpt (120-160 characters) for: "${title}". Return ONLY the excerpt, nothing else.` }
      ],
      max_completion_tokens: 150
    });
    
    const excerpt = excerptCompletion.choices[0].message.content.replace(/^["']|["']$/g, '');
    
    // Calculate read time
    const wordCount = formattedContent.split(/\s+/).length;
    const readTime = `${Math.ceil(wordCount / 200)} min read`;
    
    console.log(`✅ Step 3 complete: Title: "${title}"`);
    
    // ========== STEP 4: GENERATE HERO IMAGE ==========
    generationStatus.set(jobId, { step: 'image', message: 'Step 4: Generating hero image...' });
    console.log('🎨 Step 4: Generating article hero image...');
    
    let imageUrl = null;
    let imageAlt = null;
    
    try {
      const imageResult = await generateArticleImage({
        title,
        description: excerpt,
        slug,
        quickAnswer: excerpt  // Use excerpt as quick answer
      }, process.env.OPENAI_API_KEY);
      
      imageUrl = imageResult.imageUrl;
      imageAlt = imageResult.imageAlt;
      
      console.log('✅ Step 4 complete: Hero image generated');
    } catch (error) {
      console.warn('⚠️ Image generation failed, continuing without image:', error.message);
      // Continue without image - not critical
    }
    
    // ========== STEP 5: SAVE TO DATABASE ==========
    console.log('💾 Step 5: Saving to database...');
    const query = `
      INSERT INTO articles (
        title, description, article, url, meta_description, topic, 
        author, publisher, status, featured, read_time, date_published, 
        image_url, image_alt, date_created, date_modified
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *;
    `;
    
    await pool.query(query, [
      title.substring(0, 255),
      excerpt,
      formattedContent,
      slug.substring(0, 255),
      excerpt,
      params.topic?.substring(0, 255) || 'General',
      'DaVeenci Team',
      'DaVeenci',
      'published',
      params.featured || false,
      readTime,
      new Date().toISOString(),
      imageUrl,
      imageAlt
    ]);
    
    console.log('✅ Article published successfully:', title);
    if (imageUrl) {
      console.log(`📸 With hero image: ${imageUrl}`);
    }
    console.log('🎉 Full article generation process complete!');
    
    // Mark as complete
    generationStatus.set(jobId, { step: 'complete', message: 'Article published!' });
    
    // Clean up after 5 minutes
    setTimeout(() => generationStatus.delete(jobId), 300000);
    
  } catch (err) {
    console.error('❌ Error in background article generation:', err);
    generationStatus.set(jobId, { step: 'error', message: 'Generation failed' });
  }
}

app.get('/api/articles', async (req, res) => {
  try {
    const { status, search, limit = 100 } = req.query;
    
    let query = 'SELECT * FROM articles WHERE 1=1';
    const params = [];
    let paramCount = 1;
    
    if (status && status !== 'all') {
      query += ` AND status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }
    
    if (search) {
      query += ` AND (title ILIKE $${paramCount} OR description ILIKE $${paramCount} OR topic ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }
    
    query += ' ORDER BY date_created DESC';
    query += ` LIMIT $${paramCount}`;
    params.push(limit);
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching articles:', err);
    res.status(500).json({ error: 'Failed to fetch articles', details: err.message });
  }
});

app.get('/api/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM articles WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching article:', err);
    res.status(500).json({ error: 'Failed to fetch article', details: err.message });
  }
});

app.post('/api/articles', async (req, res) => {
  try {
    const {
      title,
      description,
      article,
      url,
      meta_description,
      topic,
      author = 'DaVeenci Team',
      publisher = 'DaVeenci',
      status = 'draft',
      featured = false,
      read_time,
      date_published
    } = req.body;
    
    if (!title || !description || !article || !url) {
      return res.status(400).json({ error: 'Missing required fields: title, description, article, url' });
    }
    
    // If marking as featured, enforce the 2-article limit
    if (featured === true) {
      await enforceFeaturedLimit();
    }
    
    const query = `
      INSERT INTO articles (
        title, description, article, url, meta_description, topic, 
        author, publisher, status, featured, read_time, date_published, date_created, date_modified
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *;
    `;
    
    const result = await pool.query(query, [
      title, description, article, url, meta_description, topic,
      author, publisher, status, featured, read_time, date_published
    ]);
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating article:', err);
    res.status(500).json({ error: 'Failed to create article', details: err.message });
  }
});

app.patch('/api/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, date_published } = req.body;
    
    const query = `
      UPDATE articles SET
        status = COALESCE($1, status),
        date_published = COALESCE($2, date_published),
        date_modified = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *;
    `;
    
    const result = await pool.query(query, [status, date_published, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating article:', err);
    res.status(500).json({ error: 'Failed to update article', details: err.message });
  }
});

app.put('/api/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      article,
      url,
      meta_description,
      topic,
      author,
      publisher,
      status,
      featured
    } = req.body;
    
    // If marking as featured, enforce the 2-article limit (excluding this article)
    if (featured === true) {
      await enforceFeaturedLimit(id);
    }
    
    const query = `
      UPDATE articles SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        article = COALESCE($3, article),
        url = COALESCE($4, url),
        meta_description = COALESCE($5, meta_description),
        topic = COALESCE($6, topic),
        author = COALESCE($7, author),
        publisher = COALESCE($8, publisher),
        status = COALESCE($9, status),
        featured = COALESCE($10, featured),
        date_modified = CURRENT_TIMESTAMP,
        date_published = CASE WHEN $9 = 'published' AND date_published IS NULL THEN CURRENT_TIMESTAMP ELSE date_published END
      WHERE id = $11
      RETURNING *;
    `;
    
    const result = await pool.query(query, [
      title, description, article, url, meta_description, topic,
      author, publisher, status, featured, id
    ]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating article:', err);
    res.status(500).json({ error: 'Failed to update article', details: err.message });
  }
});

app.delete('/api/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM articles WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    res.json({ success: true, message: 'Article deleted successfully' });
  } catch (err) {
    console.error('Error deleting article:', err);
    res.status(500).json({ error: 'Failed to delete article', details: err.message });
  }
});

// ==================== BOOKING ENDPOINTS ====================

// Get available time slots
app.get('/api/bookings/availability', async (req, res) => {
  try {
    const { startDate, endDate, timezone = 'America/Chicago' } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }
    
    const slots = await getAvailableSlots(startDate, endDate, timezone);
    res.json({ slots });
  } catch (err) {
    console.error('Error fetching availability:', err);
    res.status(500).json({ error: 'Failed to fetch availability', details: err.message });
  }
});

// Create a new booking
app.post('/api/bookings', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      meetingType,
      startTime,
      endTime,
      timezone,
      notes
    } = req.body;
    
    // Validation
    if (!name || !email || !meetingType || !startTime) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, email, meetingType, startTime' 
      });
    }
    
    // Calculate correct end time based on meeting type
    const start = new Date(startTime);
    const durationMinutes = meetingType === '30min-fit-check' ? 30 : 90; // 30 min or 90 min
    const calculatedEndTime = new Date(start.getTime() + durationMinutes * 60000).toISOString();
    
    // Create Google Calendar event
    const calendarEvent = await createCalendarEvent({
      name,
      email,
      phone,
      company,
      meetingType,
      startTime,
      endTime: calculatedEndTime,
      timezone: timezone || 'America/Chicago',
      notes
    });
    
    // Store booking in database
    const query = `
      INSERT INTO bookings (
        name, email, phone, company, meeting_type, meeting_title,
        start_time, end_time, timezone, google_event_id, google_meet_link,
        status, notes, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, CURRENT_TIMESTAMP)
      RETURNING *;
    `;
    
    const meetingTitle = meetingType === '30min-fit-check' 
      ? '30-Minute AI Strategy Call - DaVeenci'
      : '90-Minute AI Consultation Call - DaVeenci';
    
    const result = await pool.query(query, [
      name,
      email,
      phone || null,
      company || null,
      meetingType,
      meetingTitle,
      startTime,
      calculatedEndTime,
      timezone || 'America/Chicago',
      calendarEvent.eventId,
      calendarEvent.meetLink,
      'confirmed',
      notes || null
    ]);
    
    res.status(201).json({
      success: true,
      booking: result.rows[0],
      meetLink: calendarEvent.meetLink,
      message: 'Booking confirmed! Check your email for the calendar invite.'
    });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ error: 'Failed to create booking', details: err.message });
  }
});

// Get all bookings (admin only - add auth later)
app.get('/api/bookings', async (req, res) => {
  try {
    const { status, email, startDate, endDate } = req.query;
    
    let query = 'SELECT * FROM bookings WHERE 1=1';
    const params = [];
    
    if (status) {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }
    
    if (email) {
      params.push(email);
      query += ` AND email = $${params.length}`;
    }
    
    if (startDate) {
      params.push(startDate);
      query += ` AND start_time >= $${params.length}`;
    }
    
    if (endDate) {
      params.push(endDate);
      query += ` AND start_time <= $${params.length}`;
    }
    
    query += ' ORDER BY start_time ASC';
    
    const result = await pool.query(query, params);
    res.json({ bookings: result.rows });
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ error: 'Failed to fetch bookings', details: err.message });
  }
});

// Cancel a booking
app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    // Get booking details
    const booking = await pool.query('SELECT * FROM bookings WHERE id = $1', [id]);
    
    if (booking.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    const bookingData = booking.rows[0];
    
    // Cancel in Google Calendar
    if (bookingData.google_event_id) {
      await cancelCalendarEvent(bookingData.google_event_id);
    }
    
    // Update database
    await pool.query(
      `UPDATE bookings 
       SET status = 'cancelled', cancelled_at = CURRENT_TIMESTAMP, cancellation_reason = $1
       WHERE id = $2`,
      [reason || null, id]
    );
    
    res.json({ success: true, message: 'Booking cancelled successfully' });
  } catch (err) {
    console.error('Error cancelling booking:', err);
    res.status(500).json({ error: 'Failed to cancel booking', details: err.message });
  }
});

// ==================== EVENTS ENDPOINTS ====================

// Get all events
app.get('/api/events', async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = 'SELECT * FROM webinar_events';
    const params = [];
    
    if (status) {
      query += ' WHERE status = $1';
      params.push(status);
    }
    
    query += ' ORDER BY event_date ASC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ error: 'Failed to fetch events', details: err.message });
  }
});

// Get single event
app.get('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM webinar_events WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching event:', err);
    res.status(500).json({ error: 'Failed to fetch event', details: err.message });
  }
});

// Create new event (with Google Calendar integration + image generation)
app.post('/api/events', async (req, res) => {
  try {
    const {
      title,
      description,
      event_date,
      duration_minutes = 60,
      max_attendees = 100,
      registration_link = null
    } = req.body;

    // Validation
    if (!title || !description || !event_date) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['title', 'description', 'event_date']
      });
    }

    console.log('📅 Creating new event:', title);

    // Step 1: Generate webinar-specific image with business professionals
    console.log('🎨 Generating webinar event image...');
    let imageUrl = null;
    let imageAlt = null;
    
    try {
      const imageResult = await generateWebinarImage(
        { title, description, slug: title }, 
        process.env.OPENAI_API_KEY
      );
      imageUrl = imageResult.imageUrl;
      imageAlt = imageResult.imageAlt || `${title} webinar image`;
      console.log('✅ Webinar image generated:', imageUrl);
    } catch (imgErr) {
      console.error('⚠️  Image generation failed, continuing without image:', imgErr.message);
    }

    // Step 2: Create Google Calendar event
    console.log('📆 Creating Google Calendar event...');
    let calendarEventId = null;
    let meetLink = null;
    
    try {
      // Parse date as CST timezone
      // event_date format: "2024-12-15T10:00:00"
      // We need to append CST offset to ensure correct timezone
      const eventDateTimeCST = `${event_date}-06:00`; // CST is UTC-6
      const eventDateTime = new Date(eventDateTimeCST);
      const endDateTime = new Date(eventDateTime.getTime() + duration_minutes * 60000);
      
      const calendarEvent = await createCalendarEvent({
        summary: title,
        description: description,
        startTime: eventDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        timezone: 'America/Chicago', // CST/CDT timezone
        attendeeEmail: null, // Webinar, not a 1-on-1
        attendeeName: null,
        meetingType: 'webinar'
      });
      
      calendarEventId = calendarEvent.id;
      meetLink = calendarEvent.hangoutLink;
      console.log('✅ Google Calendar event created:', calendarEventId);
      console.log('   Event ID:', calendarEventId);
      console.log('   Meet Link:', meetLink);
    } catch (calErr) {
      console.error('⚠️  Calendar creation failed, continuing without calendar:', calErr.message);
      console.error('   Full error:', calErr);
    }

    // Step 3: Insert event into database (with CST timezone)
    // Store as timestamptz with CST offset
    const eventDateCST = `${event_date}-06:00`;
    
    const result = await pool.query(
      `INSERT INTO webinar_events (
        title, description, event_date, duration_minutes, 
        image_url, image_alt, google_calendar_event_id, 
        google_meet_link, max_attendees, registration_link, status
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
      RETURNING *`,
      [
        title, 
        description, 
        eventDateCST, 
        duration_minutes,
        imageUrl,
        imageAlt,
        calendarEventId,
        meetLink,
        max_attendees,
        registration_link,
        'upcoming'
      ]
    );

    console.log('✅ Event created successfully:', result.rows[0].id);

    res.json({
      success: true,
      event: result.rows[0]
    });

  } catch (err) {
    console.error('❌ Error creating event:', err);
    res.status(500).json({ 
      error: 'Failed to create event', 
      details: err.message 
    });
  }
});

// Update event
app.put('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      event_date,
      duration_minutes,
      status,
      max_attendees,
      registration_link
    } = req.body;

    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (title !== undefined) {
      updates.push(`title = $${paramCount}`);
      values.push(title);
      paramCount++;
    }
    if (description !== undefined) {
      updates.push(`description = $${paramCount}`);
      values.push(description);
      paramCount++;
    }
    if (event_date !== undefined) {
      updates.push(`event_date = $${paramCount}`);
      values.push(event_date);
      paramCount++;
    }
    if (duration_minutes !== undefined) {
      updates.push(`duration_minutes = $${paramCount}`);
      values.push(duration_minutes);
      paramCount++;
    }
    if (status !== undefined) {
      updates.push(`status = $${paramCount}`);
      values.push(status);
      paramCount++;
    }
    if (max_attendees !== undefined) {
      updates.push(`max_attendees = $${paramCount}`);
      values.push(max_attendees);
      paramCount++;
    }
    if (registration_link !== undefined) {
      updates.push(`registration_link = $${paramCount}`);
      values.push(registration_link);
      paramCount++;
    }

    updates.push(`date_updated = CURRENT_TIMESTAMP`);

    if (updates.length === 1) { // Only date_updated
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);
    const query = `UPDATE webinar_events SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({
      success: true,
      event: result.rows[0]
    });

  } catch (err) {
    console.error('Error updating event:', err);
    res.status(500).json({ 
      error: 'Failed to update event', 
      details: err.message 
    });
  }
});

// Delete event
app.delete('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get event details for calendar deletion
    const event = await pool.query('SELECT * FROM webinar_events WHERE id = $1', [id]);
    
    if (event.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const eventData = event.rows[0];

    // Delete from Google Calendar if event ID exists
    if (eventData.google_calendar_event_id) {
      try {
        await cancelCalendarEvent(eventData.google_calendar_event_id);
        console.log('✅ Google Calendar event deleted:', eventData.google_calendar_event_id);
      } catch (calErr) {
        console.error('⚠️  Failed to delete calendar event:', calErr.message);
      }
    }

    // Delete from database
    await pool.query('DELETE FROM webinar_events WHERE id = $1', [id]);

    console.log('✅ Event deleted successfully:', id);

    res.json({ 
      success: true, 
      message: 'Event deleted successfully' 
    });

  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).json({ 
      error: 'Failed to delete event', 
      details: err.message 
    });
  }
});

// Register for event (send calendar invite)
app.post('/api/events/:id/register', async (req, res) => {
  try {
    const { id } = req.params;
    const { email, event_id, event_title, event_date, google_meet_link } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Get event details
    const event = await pool.query('SELECT * FROM webinar_events WHERE id = $1', [id]);
    
    if (event.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const eventData = event.rows[0];

    console.log('📧 Registering participant for event:', eventData.title);
    console.log('   Email:', email);

    // Step 1: Store registration in database
    try {
      await pool.query(
        `INSERT INTO webinar_participants (event_id, email) 
         VALUES ($1, $2)
         ON CONFLICT (event_id, email) DO NOTHING`,
        [id, email]
      );
      console.log('✅ Participant registered in database');
    } catch (dbErr) {
      console.error('⚠️  Failed to store registration:', dbErr.message);
      // Continue anyway - don't fail the entire request
    }

    // Step 2: Send calendar invite via Google Calendar
    try {
      if (!eventData.google_calendar_event_id) {
        console.log('⚠️  Event has no Google Calendar ID, skipping invite');
        return res.json({
          success: true,
          message: 'Registration received. You will receive event details soon.',
        });
      }

      console.log('📆 Adding attendee to Google Calendar event...');
      console.log('   Calendar Event ID:', eventData.google_calendar_event_id);

      const calendar = google.calendar({ version: 'v3', auth: new google.auth.JWT({
        email: process.env.GOOGLE_CLIENT_EMAIL,
        key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        scopes: ['https://www.googleapis.com/auth/calendar'],
        subject: process.env.GOOGLE_CALENDAR_ID || 'anton.osipov@daveenci.com',
      })});

      const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

      // Get existing event
      const existingEvent = await calendar.events.get({
        calendarId,
        eventId: eventData.google_calendar_event_id,
      });

      // Check if attendee already exists
      const attendees = existingEvent.data.attendees || [];
      const alreadyRegistered = attendees.some(a => a.email === email);

      if (alreadyRegistered) {
        console.log('ℹ️  Attendee already registered, skipping duplicate');
        return res.json({
          success: true,
          message: 'You are already registered for this event',
        });
      }

      // Add new attendee
      attendees.push({ 
        email, 
        displayName: email,
        responseStatus: 'needsAction' // User needs to accept/decline
      });

      // Update event with new attendee
      await calendar.events.update({
        calendarId,
        eventId: eventData.google_calendar_event_id,
        sendUpdates: 'all', // Send email invite to new attendee only
        resource: {
          ...existingEvent.data,
          attendees,
        },
      });

      console.log('✅ Successfully added attendee to Google Calendar event');
      console.log('✅ Calendar invite sent to:', email);
      console.log('   Meet Link:', existingEvent.data.hangoutLink || 'N/A');

      res.json({
        success: true,
        message: 'Calendar invite sent! Check your email for the event details.',
        meet_link: existingEvent.data.hangoutLink,
      });

    } catch (calErr) {
      console.error('❌ Failed to send calendar invite:', calErr.message);
      console.error('   Error details:', calErr);
      
      // Still return success to user so they don't see an error
      res.json({
        success: true,
        message: 'Registration received. You will receive event details soon.',
      });
    }

  } catch (err) {
    console.error('Error registering for event:', err);
    res.status(500).json({ 
      error: 'Failed to register for event', 
      details: err.message 
    });
  }
});

// Get participants for an event (admin)
app.get('/api/events/:id/participants', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT 
        wp.id,
        wp.email,
        wp.registered_at,
        we.title as event_title,
        we.event_date
       FROM webinar_participants wp
       JOIN webinar_events we ON wp.event_id = we.id
       WHERE wp.event_id = $1
       ORDER BY wp.registered_at DESC`,
      [id]
    );

    res.json({
      success: true,
      count: result.rows.length,
      participants: result.rows
    });

  } catch (err) {
    console.error('Error fetching participants:', err);
    res.status(500).json({ 
      error: 'Failed to fetch participants', 
      details: err.message 
    });
  }
});


// ==================== NEWSLETTER SUBSCRIPTIONS ====================

// Subscribe to newsletter
app.post('/api/newsletter/subscribe', async (req, res) => {
  try {
    const { name, email, interests } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ 
        error: 'Name and email are required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format' 
      });
    }

    // Check if email already exists
    const existing = await pool.query(
      'SELECT id, status FROM newsletter_subscribers WHERE email = $1',
      [email]
    );

    if (existing.rows.length > 0) {
      const subscriber = existing.rows[0];
      
      // If unsubscribed, resubscribe them
      if (subscriber.status === 'unsubscribed') {
        await pool.query(
          `UPDATE newsletter_subscribers 
           SET status = 'active', 
               name = $1, 
               interests = $2,
               subscribed_at = CURRENT_TIMESTAMP,
               unsubscribed_at = NULL,
               updated_at = CURRENT_TIMESTAMP
           WHERE email = $3`,
          [name, interests || null, email]
        );
        
        return res.json({ 
          success: true, 
          message: 'Successfully resubscribed!',
          subscriber: { id: subscriber.id, email, name, interests, status: 'active' }
        });
      }
      
      // Already subscribed
      return res.status(409).json({ 
        error: 'This email is already subscribed to the newsletter' 
      });
    }

    // Insert new subscriber
    const result = await pool.query(
      `INSERT INTO newsletter_subscribers (name, email, interests) 
       VALUES ($1, $2, $3) 
       RETURNING id, name, email, interests, status, subscribed_at`,
      [name, email, interests || null]
    );

    res.json({ 
      success: true, 
      message: 'Successfully subscribed to newsletter!',
      subscriber: result.rows[0]
    });

  } catch (err) {
    console.error('Error subscribing to newsletter:', err);
    res.status(500).json({ 
      error: 'Failed to subscribe to newsletter', 
      details: err.message 
    });
  }
});

// Get all newsletter subscribers (admin only - you might want to add auth)
app.get('/api/newsletter/subscribers', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, interests, status, subscribed_at, unsubscribed_at
       FROM newsletter_subscribers 
       ORDER BY subscribed_at DESC`
    );

    res.json({ 
      success: true,
      total: result.rows.length,
      subscribers: result.rows 
    });

  } catch (err) {
    console.error('Error fetching subscribers:', err);
    res.status(500).json({ 
      error: 'Failed to fetch subscribers', 
      details: err.message 
    });
  }
});

// Unsubscribe from newsletter
app.post('/api/newsletter/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const result = await pool.query(
      `UPDATE newsletter_subscribers 
       SET status = 'unsubscribed', 
           unsubscribed_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE email = $1 AND status = 'active'
       RETURNING id`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Subscriber not found or already unsubscribed' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Successfully unsubscribed from newsletter' 
    });

  } catch (err) {
    console.error('Error unsubscribing from newsletter:', err);
    res.status(500).json({ 
      error: 'Failed to unsubscribe', 
      details: err.message 
    });
  }
});


// ==================== ERROR HANDLING ====================

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// ==================== START SERVER ====================

app.listen(port, async () => {
  console.log(`🚀 Backend API server running on http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/api/health`);
  console.log(`⚙️  Settings API: http://localhost:${port}/api/settings`);
  console.log(`📝 Articles API: http://localhost:${port}/api/articles`);
  console.log(`✨ Generate API (2-step): http://localhost:${port}/api/articles/generate`);
  console.log(`🕐 Scheduler API: http://localhost:${port}/api/scheduler/status`);
  console.log(`📅 Bookings API: http://localhost:${port}/api/bookings`);
  console.log(`🎉 Events API: http://localhost:${port}/api/events`);
  console.log(`✉️  Newsletter API: http://localhost:${port}/api/newsletter/subscribe`);
  
  // Initialize scheduler after server starts
  articleScheduler = new ArticleScheduler(pool, generateArticleInBackground);
  await articleScheduler.initialize();
});
