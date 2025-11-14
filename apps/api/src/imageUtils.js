/**
 * Image Generation and Optimization Utilities
 * 
 * Handles:
 * - Generating article-specific images using OpenAI DALL-E
 * - Optimizing images for web (compression, resizing)
 * - Saving images to public directory
 * - Generating alt text for accessibility
 */

import OpenAI from 'openai';
import fetch from 'node-fetch';
import sharp from 'sharp';
import { uploadToCloud, isCloudStorageEnabled } from './cloudStorage.js';

// DaVeenci Brand colors
const BRAND_COLORS = {
  primary: '#db2626',      // Brand red
  accent: '#db2626',       // Brand red
  dark: '#000000',         // Black
  light: '#ffffff',        // White
  secondary: '#525252',    // Gray-600
  description: 'ONLY red #db2626, black #000000, white #ffffff, gray (no blue/cyan/teal allowed)'
};

// DALL-E 3 Strategy: Put constraints FIRST (it ignores trailing text)
const PREFIX = 'I NEED to test how the tool works with extremely specific prompts. DO NOT add any other colors.';
const FORBIDDEN = 'FORBIDDEN: blue, cyan, teal, turquoise, green, purple colors, text, words, labels, logos.';
const REQUIRED_COLORS = 'REQUIRED COLORS: ONLY red #db2626, black #000000, white #ffffff, gray tones.';
const BASE_QUALITY = 'Sharp focus, photorealistic, professional studio lighting, high contrast, minimal modern aesthetic.';

// Image output configuration
const IMAGE_CONFIG = {
  width: 1792,  // 16:9 aspect ratio
  height: 1008,  // Optimized for web (slightly smaller than 1024 for better compression)
  quality: 85,   // JPEG quality (good balance between quality and file size)
  maxFileSizeKB: 200  // Target max file size
};

/**
 * Image style templates - rotates between different visual approaches
 * Each style maintains DaVeenci brand colors (constraints FIRST for DALL-E 3)
 */
const IMAGE_STYLES = [
  {
    name: 'Abstract Geometric',
    prompt: (themes) => `${PREFIX} ${FORBIDDEN} ${REQUIRED_COLORS} Abstract geometric shapes: ${themes}. Black angular forms, red glow, dark background, sharp, minimal modern tech aesthetic. ${BASE_QUALITY}`,
    weight: 25
  },
  {
    name: 'Professional Meeting',
    prompt: (themes) => `${PREFIX} ${FORBIDDEN} FORBIDDEN: colored clothing. REQUIRED: people in ONLY black/white/gray suits. Background ONLY black/white/gray, red accent lighting. Professional business meeting: ${themes}. Modern office, sharp focus. ${BASE_QUALITY}`,
    weight: 20
  },
  {
    name: 'Product/Object Focus',
    prompt: (themes) => `${PREFIX} ${FORBIDDEN} FORBIDDEN: people, faces. ${REQUIRED_COLORS} Product photo: ${themes}. Black surface, red accent lighting, white/gray objects, dark gradient background. Minimal, elegant. ${BASE_QUALITY}`,
    weight: 20
  },
  {
    name: 'Data Visualization Scene',
    prompt: (themes) => `${PREFIX} ${FORBIDDEN} FORBIDDEN: people, faces. ${REQUIRED_COLORS} Abstract data visualization: ${themes}. Black room, red glowing charts/graphs, white data points, dark environment. Technical, futuristic. ${BASE_QUALITY}`,
    weight: 15
  },
  {
    name: 'Modern Workspace',
    prompt: (themes) => `${PREFIX} ${FORBIDDEN} FORBIDDEN: people, faces. ${REQUIRED_COLORS} Minimal workspace scene: ${themes}. Black desk, white MacBook, red accent item, gray background. Clean overhead angle. ${BASE_QUALITY}`,
    weight: 15
  },
  {
    name: 'Tech Architecture',
    prompt: (themes) => `${PREFIX} ${FORBIDDEN} FORBIDDEN: colored elements. REQUIRED: people silhouette in black/white/gray ONLY. ${REQUIRED_COLORS} Modern tech office: ${themes}. Glass walls, black steel, white surfaces, red accent lighting. Professional, minimal. ${BASE_QUALITY}`,
    weight: 5
  }
];

/**
 * Select image style based on article data (pseudo-random but consistent per article)
 */
function selectImageStyle(articleTitle) {
  // Create a simple hash from the title for consistent style per article
  let hash = 0;
  for (let i = 0; i < articleTitle.length; i++) {
    hash = ((hash << 5) - hash) + articleTitle.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Use weighted random selection
  const totalWeight = IMAGE_STYLES.reduce((sum, style) => sum + style.weight, 0);
  let random = Math.abs(hash % totalWeight);
  
  for (const style of IMAGE_STYLES) {
    random -= style.weight;
    if (random <= 0) {
      return style;
    }
  }
  
  return IMAGE_STYLES[0]; // Fallback
}

/**
 * Generate article-specific image prompt based on content
 */
function generateImagePrompt(title, description, quickAnswer = '') {
  // Extract key themes from the content (limit to 300 chars for better focus)
  const themes = `${title}. ${description}. ${quickAnswer}`.substring(0, 300);
  
  // Select style based on article title (consistent per article)
  const selectedStyle = selectImageStyle(title);
  
  console.log(`   🎨 Style selected: ${selectedStyle.name}`);
  
  // Generate prompt using selected style
  const prompt = selectedStyle.prompt(themes);
  
  return prompt;
}

/**
 * Generate image using DALL-E
 */
async function generateImage(prompt, apiKey) {
  console.log('🎨 Generating article image...');
  
  const openai = new OpenAI({ apiKey });
  
  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1792x1024',  // 16:9 aspect ratio
      quality: 'standard', // Use standard for faster generation and lower cost
    });
    
    const imageUrl = response.data[0].url;
    const revisedPrompt = response.data[0].revised_prompt || prompt;
    
    console.log('✅ Image generated successfully');
    return { imageUrl, revisedPrompt };
  } catch (error) {
    console.error('❌ Error generating image:', error.message);
    throw new Error(`Image generation failed: ${error.message}`);
  }
}

/**
 * Download image from URL
 */
async function downloadImage(url) {
  console.log('📥 Downloading image...');
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log(`✅ Downloaded image (${(buffer.length / 1024).toFixed(2)} KB)`);
    return buffer;
  } catch (error) {
    console.error('❌ Error downloading image:', error.message);
    throw new Error(`Image download failed: ${error.message}`);
  }
}

/**
 * Optimize image for web
 * - Resize if needed
 * - Convert to JPEG
 * - Compress to target file size
 */
async function optimizeImage(buffer) {
  console.log('🔧 Optimizing image for web...');
  
  try {
    let optimized = sharp(buffer)
      .resize(IMAGE_CONFIG.width, IMAGE_CONFIG.height, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({
        quality: IMAGE_CONFIG.quality,
        progressive: true,
        mozjpeg: true
      });
    
    let outputBuffer = await optimized.toBuffer();
    let fileSizeKB = outputBuffer.length / 1024;
    
    // If file is still too large, reduce quality
    let quality = IMAGE_CONFIG.quality;
    while (fileSizeKB > IMAGE_CONFIG.maxFileSizeKB && quality > 60) {
      quality -= 5;
      optimized = sharp(buffer)
        .resize(IMAGE_CONFIG.width, IMAGE_CONFIG.height, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({
          quality,
          progressive: true,
          mozjpeg: true
        });
      
      outputBuffer = await optimized.toBuffer();
      fileSizeKB = outputBuffer.length / 1024;
    }
    
    console.log(`✅ Image optimized: ${IMAGE_CONFIG.width}x${IMAGE_CONFIG.height}, ${fileSizeKB.toFixed(2)} KB, quality: ${quality}`);
    return outputBuffer;
  } catch (error) {
    console.error('❌ Error optimizing image:', error.message);
    throw new Error(`Image optimization failed: ${error.message}`);
  }
}

/**
 * Save image to cloud storage (R2) - REQUIRED for production
 * No local fallback - all images must be stored on R2
 * @param {Buffer} buffer - Image buffer
 * @param {string} filename - Image filename
 * @param {string} folder - Folder name (e.g., 'articles', 'webinars')
 */
async function saveImage(buffer, filename, folder = 'articles') {
  if (!isCloudStorageEnabled()) {
    throw new Error('❌ Cloudflare R2 is NOT configured! Images must be stored on R2.\n' +
      'Please set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME in .env');
  }
  
  console.log(`☁️  Uploading to Cloudflare R2 (${folder} folder)...`);
  const storageKey = `${folder}/${filename}`;
  const publicUrl = await uploadToCloud(buffer, storageKey, 'image/jpeg');
  console.log(`✅ Image uploaded to R2: ${publicUrl}`);
  return publicUrl;
}

/**
 * Generate alt text for image (for accessibility and SEO)
 */
function generateAltText(title, selectedStyleName) {
  // Create descriptive alt text based on title and style
  const styleDescriptions = {
    'Abstract Geometric': 'Abstract geometric visualization',
    'Professional Meeting': 'Professional business meeting scene',
    'Product/Object Focus': 'Professional product photography',
    'Data Visualization Scene': 'Data visualization and analytics scene',
    'Modern Workspace': 'Modern entrepreneur workspace scene',
    'Tech Architecture': 'Modern tech office architectural photo'
  };
  
  const styleDesc = styleDescriptions[selectedStyleName] || 'Professional business visualization';
  const altText = `${styleDesc} representing: ${title}`;
  return altText;
}

/**
 * Generate unique filename for image
 */
function generateFilename(slug) {
  const timestamp = Date.now();
  // Use article slug for SEO-friendly filename
  const cleanSlug = slug.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
  return `${cleanSlug}-${timestamp}.jpg`;
}

/**
 * Main function: Generate, optimize, and save image
 * 
 * @param {Object} articleData - Content data
 * @param {string} articleData.title - Content title
 * @param {string} articleData.description - Content description
 * @param {string} articleData.slug - Content URL slug (or title-based filename)
 * @param {string} articleData.quickAnswer - Quick answer or key themes (optional)
 * @param {string} apiKey - OpenAI API key
 * @param {string} folder - R2 folder name (e.g., 'articles', 'webinars')
 * @returns {Promise<Object>} - { imageUrl, imageAlt }
 */
export async function generateArticleImage(articleData, apiKey, folder = 'articles') {
  console.log('\n🎨 ========== IMAGE GENERATION ==========');
  console.log(`📝 Content: ${articleData.title}`);
  console.log(`📁 Folder: ${folder}`);
  
  try {
    // Step 1: Select image style (consistent per title)
    const selectedStyle = selectImageStyle(articleData.title);
    console.log(`   🎨 Style: ${selectedStyle.name}`);
    
    // Step 2: Generate prompt based on content and style
    const themes = `${articleData.title}. ${articleData.description}. ${articleData.quickAnswer || ''}`.substring(0, 300);
    const prompt = selectedStyle.prompt(themes);
    
    // Step 3: Generate image using DALL-E
    const { imageUrl, revisedPrompt } = await generateImage(prompt, apiKey);
    
    // Step 4: Download image
    const imageBuffer = await downloadImage(imageUrl);
    
    // Step 5: Optimize image for web
    const optimizedBuffer = await optimizeImage(imageBuffer);
    
    // Step 6: Generate filename
    const filename = generateFilename(articleData.slug || articleData.title);
    
    // Step 7: Save image to R2 in specified folder
    const publicUrl = await saveImage(optimizedBuffer, filename, folder);
    
    // Step 8: Generate alt text
    const altText = generateAltText(articleData.title, selectedStyle.name);
    
    console.log('🎉 Image generation complete!');
    console.log(`   Folder: ${folder}`);
    console.log(`   Style: ${selectedStyle.name}`);
    console.log(`   URL: ${publicUrl}`);
    console.log(`   Alt: ${altText}`);
    console.log('===============================================\n');
    
    return {
      imageUrl: publicUrl,
      imageAlt: altText
    };
  } catch (error) {
    console.error('❌ Image generation failed:', error.message);
    // Return null so content creation can continue without image
    return {
      imageUrl: null,
      imageAlt: null
    };
  }
}

/**
 * Detect specific tools/topics in event content
 * @param {string} content - Combined title and description
 * @returns {string|null} - Detected topic or null
 */
function detectSpecificTopic(content) {
  const contentLower = content.toLowerCase();
  
  // Define specific tools/topics to detect
  const topicPatterns = [
    { keywords: ['aeo', 'answer engine', 'answer engines'], name: 'AEO' },
    { keywords: ['seo', 'search engine optimization'], name: 'SEO' },
    { keywords: ['n8n'], name: 'n8n' },
    { keywords: ['make.com', 'make automation'], name: 'Make.com' },
    { keywords: ['zapier'], name: 'Zapier' },
    { keywords: ['render', 'render.com'], name: 'Render' },
    { keywords: ['claude', 'anthropic'], name: 'Claude AI' },
    { keywords: ['chatgpt', 'gpt-4', 'openai'], name: 'ChatGPT' },
    { keywords: ['midjourney'], name: 'Midjourney' },
    { keywords: ['stable diffusion'], name: 'Stable Diffusion' },
    { keywords: ['robotics', 'robot'], name: 'Robotics' },
    { keywords: ['blockchain', 'web3'], name: 'Blockchain' },
    { keywords: ['computer vision', 'cv', 'image recognition'], name: 'Computer Vision' },
    { keywords: ['nlp', 'natural language'], name: 'NLP' },
    { keywords: ['machine learning', 'ml model'], name: 'Machine Learning' },
    { keywords: ['data science', 'data analytics'], name: 'Data Science' },
    { keywords: ['copilot', 'github copilot'], name: 'AI Copilot' },
    { keywords: ['cursor', 'cursor ide'], name: 'Cursor IDE' },
  ];
  
  // Check for matches
  for (const pattern of topicPatterns) {
    if (pattern.keywords.some(keyword => contentLower.includes(keyword))) {
      return pattern.name;
    }
  }
  
  return null;
}

/**
 * Generate webinar-specific image with professional business setting
 * Focuses on specific tools/topics, or falls back to educational/networking scenarios
 * 
 * @param {Object} eventData - Event data
 * @param {string} eventData.title - Event title
 * @param {string} eventData.description - Event description
 * @param {string} apiKey - OpenAI API key
 * @returns {Promise<Object>} - { imageUrl, imageAlt }
 */
export async function generateWebinarImage(eventData, apiKey) {
  console.log('\n🎓 ========== WEBINAR IMAGE GENERATION ==========');
  console.log(`📝 Event: ${eventData.title}`);
  
  try {
    // Analyze event content to determine best scenario
    const content = `${eventData.title} ${eventData.description}`;
    const contentLower = content.toLowerCase();
    
    // Step 1: Check for comparison/battle/vs scenarios
    const isComparison = contentLower.includes(' vs ') || contentLower.includes(' versus ') || 
                         contentLower.includes('battle') || contentLower.includes('comparison') ||
                         contentLower.includes('before and after') || contentLower.includes('vs.') ||
                         contentLower.includes('between') && (contentLower.includes(' and ') || contentLower.includes(' or '));
    
    // Step 2: Check for infrastructure/hardware topics
    const isInfrastructure = contentLower.includes('hosting') || contentLower.includes('server') ||
                            contentLower.includes('gpu') || contentLower.includes('hardware') ||
                            contentLower.includes('infrastructure') || contentLower.includes('cloud') ||
                            contentLower.includes('deployment') || contentLower.includes('devops');
    
    let scenario, selectedPrompt, scenarioDesc;
    
    if (isComparison) {
      // COMPARISON: Create split-screen or before/after visual
      scenario = 'comparison';
      console.log(`   🎯 Scenario: ${scenario} (visual contrast)`);
      
      selectedPrompt = `${PREFIX} ${FORBIDDEN} FORBIDDEN: people, faces, bodies, casual clothing. REQUIRED: abstract conceptual visualization ONLY. ${REQUIRED_COLORS}

Split-screen comparison visualization: LEFT side shows traditional/old approach in muted gray tones, RIGHT side shows modern AI/new approach with red accent highlights. Clean vertical divider line in center. Minimalist abstract infographic style with data points, arrows, charts. Dark background (black/dark gray), white text elements, red highlights on modern side. Professional tech aesthetic, geometric shapes, clean typography. NO PEOPLE. Conceptual before/after comparison. ${BASE_QUALITY}`;
      
      scenarioDesc = `Split-screen comparison visualization for ${eventData.title}`;
      
    } else if (isInfrastructure) {
      // INFRASTRUCTURE: Focus on server hardware/GPU visualization
      scenario = 'infrastructure';
      console.log(`   🎯 Scenario: ${scenario} (hardware focus)`);
      
      selectedPrompt = `${PREFIX} ${FORBIDDEN} FORBIDDEN: people, faces, bodies, text, words, labels. REQUIRED: pure hardware visualization ONLY. ${REQUIRED_COLORS}

Professional server infrastructure visualization: Close-up of modern black server rack with sleek GPU units, glowing red LED indicators, clean cable management. Dark data center aesthetic with dramatic lighting - red accent lights highlighting server blades. Minimalist tech photography, high-end hardware, black metal chassis with white brand accents. Geometric patterns of server components, circuit boards with red highlights. Professional product photography style, shallow depth of field focusing on hardware details. Dark background (pure black), white/silver metal surfaces, red LED glows. NO PEOPLE, NO TEXT. Pure hardware beauty. ${BASE_QUALITY}`;
      
      scenarioDesc = `Professional server infrastructure and hardware visualization`;
      
    } else {
      // Step 3: Check for specific tools/topics
      const specificTopic = detectSpecificTopic(content);
      
      if (specificTopic) {
        // SPECIFIC TOPIC: Focus image on the tool/topic
        scenario = 'specific-topic';
        console.log(`   🎯 Scenario: ${scenario} (${specificTopic})`);
        
        selectedPrompt = `${PREFIX} ${FORBIDDEN} FORBIDDEN: casual clothing, bright colors. REQUIRED: business professionals in black/white/gray suits ONLY. ${REQUIRED_COLORS}

Professional ${specificTopic} presentation: Modern tech conference room, business executives (CEOs, CTOs) at sleek black table, large screen displaying "${specificTopic}" interface/dashboard/concept with red accent highlights. Presenter explaining ${specificTopic} strategies to engaged audience. Dark minimalist aesthetic, black furniture, white walls, red accent lighting on screen. Everyone wearing black/white/gray business suits. MacBooks, professional atmosphere, modern tech visualization. ${BASE_QUALITY}`;
        
        scenarioDesc = `Professional ${specificTopic} session with business executives`;
        
      } else {
        // Step 4: Fall back to educational vs networking detection
        const isEducational = contentLower.includes('workshop') || contentLower.includes('training') || 
                              contentLower.includes('learn') || contentLower.includes('tutorial') ||
                              contentLower.includes('guide') || contentLower.includes('how to');
        
        scenario = isEducational ? 'educational' : 'networking';
        console.log(`   🎯 Scenario: ${scenario}`);
        
        // Webinar-specific prompts with people (CEOs, CTOs, business professionals)
        const WEBINAR_PROMPTS = {
          educational: `${PREFIX} ${FORBIDDEN} FORBIDDEN: casual clothing, bright colors. REQUIRED: business professionals in black/white/gray suits ONLY. ${REQUIRED_COLORS}

Professional AI workshop scene: Modern conference room, business executives (CEOs, CTOs) sitting at sleek black tables with MacBooks, presenter at front explaining AI concepts on screen with red accent lighting. Dark professional atmosphere, minimal modern tech aesthetic. Everyone wearing black/white/gray business attire ONLY. Red accent lighting on screen/podium. ${BASE_QUALITY}`,
          
          networking: `${PREFIX} ${FORBIDDEN} FORBIDDEN: casual clothing, bright colors. REQUIRED: business professionals in black/white/gray suits ONLY. ${REQUIRED_COLORS}

Professional AI networking event: Modern minimalist space, business executives (CEOs, CTOs, founders) in small groups discussing AI and automation. Everyone wearing elegant black/white/gray business suits. Dark sleek environment with white walls, black furniture, red accent lighting. Professional handshakes and conversations. ${BASE_QUALITY}`
        };
        
        selectedPrompt = WEBINAR_PROMPTS[scenario];
        scenarioDesc = scenario === 'educational' 
          ? 'Professional AI workshop with business executives' 
          : 'Professional networking event with business leaders discussing AI';
      }
    }
    
    // Generate image using DALL-E
    const { imageUrl, revisedPrompt } = await generateImage(selectedPrompt, apiKey);
    
    // Download image
    const imageBuffer = await downloadImage(imageUrl);
    
    // Optimize image for web
    const optimizedBuffer = await optimizeImage(imageBuffer);
    
    // Generate filename
    const filename = generateFilename(eventData.slug || eventData.title);
    
    // Save image to R2 in webinars folder
    const publicUrl = await saveImage(optimizedBuffer, filename, 'webinars');
    
    // Generate alt text
    const altText = `${scenarioDesc}: ${eventData.title}`;
    
    console.log('🎉 Webinar image generation complete!');
    console.log(`   Scenario: ${scenario}`);
    console.log(`   URL: ${publicUrl}`);
    console.log(`   Alt: ${altText}`);
    console.log('===============================================\n');
    
    return {
      imageUrl: publicUrl,
      imageAlt: altText
    };
  } catch (error) {
    console.error('❌ Webinar image generation failed:', error.message);
    // Return null so event creation can continue without image
    return {
      imageUrl: null,
      imageAlt: null
    };
  }
}

export default {
  generateArticleImage,
  generateWebinarImage,
  generateImagePrompt,
  generateAltText
};

