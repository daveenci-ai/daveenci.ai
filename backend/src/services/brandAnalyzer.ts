import { query } from '../db';
import crypto from 'crypto';

// --- Types ---

interface BrandAnalyzeRequest {
  names: string[];
  context: string;
  stage: 'bootstrap' | 'seed' | 'growth' | 'scale';
}

interface DimensionScore {
  score: number;
  reason: string;
}

interface BrandResult {
  [dimension: string]: DimensionScore;
}

interface AnalyzeResponse {
  scores: { [brandName: string]: BrandResult };
  weightedScores: { [brandName: string]: number };
  verdict: { [brandName: string]: string };
}

// --- Weights ---

const WEIGHTS: Record<string, number> = {
  clarity: 1.8,
  relevance: 1.6,
  industryFit: 1.2,
  memorability: 1.1,
  uniqueness: 1.0,
  scalability: 0.9,
  pronounceability: 0.8,
  visualIdentity: 0.7,
  emotionalAppeal: 0.7,
  negativeRisk: 0.7,
};

const DIMENSION_LABELS: Record<string, string> = {
  clarity: 'Clarity',
  relevance: 'Relevance',
  industryFit: 'Industry Fit',
  memorability: 'Memorability',
  uniqueness: 'Uniqueness',
  scalability: 'Scalability',
  pronounceability: 'Pronounceability',
  visualIdentity: 'Visual Identity',
  emotionalAppeal: 'Emotional Appeal',
  negativeRisk: 'Negative Risk',
};

const STAGE_DESCRIPTIONS: Record<string, string> = {
  bootstrap: 'Bootstrap / Pre-Revenue ($0–$50K). Budget is zero. Name must work immediately with no marketing spend.',
  seed: 'Seed / Early Traction. Credibility and trust signals matter. Name should feel professional and established.',
  growth: 'Growth Stage. Distinctiveness and memorability drive market share. Name must stand out in a crowded space.',
  scale: 'Scale / Enterprise ($5M+). Category ownership and long-term brand equity are paramount. Name must be unique and defensible.',
};

// --- Rate Limiting ---

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 24 * 60 * 60 * 1000 });
    return true;
  }

  if (entry.count >= 10) {
    return false;
  }

  entry.count++;
  return true;
}

// --- Claude API Call ---

async function callClaude(names: string[], context: string, stage: string): Promise<any> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not configured');
  }

  const stageDescription = STAGE_DESCRIPTIONS[stage] || STAGE_DESCRIPTIONS.bootstrap;
  const dimensionList = Object.entries(DIMENSION_LABELS)
    .map(([key, label]) => `- ${label} (${key}): Weight ${WEIGHTS[key]}`)
    .join('\n');

  const prompt = `You are a senior brand strategist specializing in B2B SaaS and tech-enabled businesses. Evaluate the following brand name(s) for a company at the "${stage}" stage.

Stage context: ${stageDescription}

Product/business context: ${context}

Brand names to evaluate: ${names.join(', ')}

Score each brand name across these 10 dimensions (0-100 scale):
${dimensionList}

Rules:
- ONLY output valid JSON, no markdown, no explanation outside JSON
- negativeRisk is INVERSE scored: a LOW score means HIGH risk (bad associations, offensive in other languages, trademark conflicts). A HIGH score means the name is SAFE.
- Be calibrated: don't cluster all scores between 60-80. Use the FULL 0-100 range.
- Each score must include a one-sentence "reason" explaining the rating.

Return ONLY this JSON structure:
{
  "scores": {
    "<BrandName>": {
      "clarity": { "score": <0-100>, "reason": "<one sentence>" },
      "relevance": { "score": <0-100>, "reason": "<one sentence>" },
      "industryFit": { "score": <0-100>, "reason": "<one sentence>" },
      "memorability": { "score": <0-100>, "reason": "<one sentence>" },
      "uniqueness": { "score": <0-100>, "reason": "<one sentence>" },
      "scalability": { "score": <0-100>, "reason": "<one sentence>" },
      "pronounceability": { "score": <0-100>, "reason": "<one sentence>" },
      "visualIdentity": { "score": <0-100>, "reason": "<one sentence>" },
      "emotionalAppeal": { "score": <0-100>, "reason": "<one sentence>" },
      "negativeRisk": { "score": <0-100>, "reason": "<one sentence>" }
    }
  },
  "verdict": {
    "<BrandName>": "<2-3 sentence overall assessment with top strength and biggest weakness>"
  }
}`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Claude API error:', response.status, errorText);
    throw new Error(`Claude API returned ${response.status}`);
  }

  const data = await response.json();
  const textContent = data.content?.find((c: any) => c.type === 'text');
  if (!textContent) {
    throw new Error('No text content in Claude response');
  }

  // Parse JSON from response (strip any accidental markdown fences)
  let jsonStr = textContent.text.trim();
  if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  return JSON.parse(jsonStr);
}

// --- Weighted Score Calculation ---

function calculateWeightedScore(brandScores: BrandResult): number {
  const totalWeight = Object.values(WEIGHTS).reduce((sum, w) => sum + w, 0);
  let weightedSum = 0;

  for (const [dim, weight] of Object.entries(WEIGHTS)) {
    const score = brandScores[dim]?.score ?? 0;
    weightedSum += score * weight;
  }

  return Math.round(weightedSum / totalWeight);
}

// --- Supabase Logging ---

async function logAnalysis(
  stage: string,
  names: string[],
  topScore: number,
  resultCount: number,
  ip: string,
  userAgent: string
): Promise<void> {
  try {
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex');
    const trimmedNames = names.map(n => n.slice(0, 500));

    await query(
      `INSERT INTO brand_analyzer_logs (stage, names, top_score, result_count, ip_hash, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [stage, trimmedNames, topScore, resultCount, ipHash, userAgent?.slice(0, 500)]
    );
  } catch (err) {
    // Log but don't fail the request
    console.error('Failed to log brand analysis:', err);
  }
}

// --- Main Handler ---

export async function analyzeBrands(
  body: BrandAnalyzeRequest,
  ip: string,
  userAgent: string
): Promise<AnalyzeResponse> {
  // Validate input
  if (!body.names || !Array.isArray(body.names) || body.names.length === 0) {
    throw { status: 400, message: 'At least one brand name is required' };
  }

  if (body.names.length > 5) {
    throw { status: 400, message: 'Maximum 5 brand names allowed per request' };
  }

  const validStages = ['bootstrap', 'seed', 'growth', 'scale'];
  if (!body.stage || !validStages.includes(body.stage)) {
    throw { status: 400, message: 'Invalid stage. Must be one of: bootstrap, seed, growth, scale' };
  }

  if (!body.context || body.context.trim().length === 0) {
    throw { status: 400, message: 'Product context is required' };
  }

  // Clean names
  const cleanedNames = body.names
    .map(n => n.trim())
    .filter(n => n.length > 0)
    .slice(0, 5);

  // Rate limit check
  if (!checkRateLimit(ip)) {
    throw { status: 429, message: 'Rate limit exceeded. Maximum 10 analyses per day.' };
  }

  // Call Claude
  const claudeResult = await callClaude(cleanedNames, body.context.trim(), body.stage);

  // Calculate weighted scores
  const weightedScores: { [brandName: string]: number } = {};
  for (const [name, scores] of Object.entries(claudeResult.scores)) {
    weightedScores[name] = calculateWeightedScore(scores as BrandResult);
  }

  // Find top score for logging
  const topScore = Math.max(...Object.values(weightedScores));

  // Log to database (non-blocking)
  logAnalysis(body.stage, cleanedNames, topScore, cleanedNames.length, ip, userAgent);

  return {
    scores: claudeResult.scores,
    weightedScores,
    verdict: claudeResult.verdict || {},
  };
}

export { WEIGHTS, DIMENSION_LABELS, STAGE_DESCRIPTIONS };
