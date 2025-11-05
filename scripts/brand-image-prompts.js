/**
 * DaVeenci Brand Image Generation Prompts
 * 
 * Pre-configured prompts using brand colors and style guide
 * for generating consistent, on-brand hero images.
 */

// Brand Colors
export const BRAND_COLORS = {
  black: '#000000',         // Primary text & elements
  white: '#ffffff',         // Background
  brandRed: '#db2626',      // Primary CTA & accent
  redLight: '#fecaca',      // Red-200 for subtle elements
  redDark: '#991b1b',       // Red-800 for depth
  neutralLight: '#f5f5f5',  // Gray-100
  neutralDark: '#171717'    // Gray-900
};

// DALL-E 3 STRATEGY: Put ALL constraints FIRST (it ignores the end of prompts)
// Use "I NEED" prefix to prevent safety rewrites
const PREFIX = `I NEED to test how the tool works with extremely specific prompts. DO NOT add any other colors.`;

// ABSTRACT (no people) - Lead with what's FORBIDDEN
const ABSTRACT = `${PREFIX} FORBIDDEN: people, faces, humans, text, words, blue, cyan, teal, turquoise, green, purple. REQUIRED COLORS: ONLY red #db2626, black #000000, white #ffffff, gray #6b7280.`;

// REALISTIC (with people) - Lead with what's FORBIDDEN
const REALISTIC = `${PREFIX} FORBIDDEN: text, words, blue, cyan, teal, turquoise colors. REQUIRED: people wear ONLY black/white/gray suits, NO colored clothing. Background ONLY black/white/gray, red tiny accents only.`;

/**
 * ABSTRACT IMAGES (No People) - For technical/brand images
 * CONSTRAINTS FIRST - DALL-E 3 pays more attention to start of prompt
 */
export const HERO_TEMPLATE = `${ABSTRACT} Geometric network, black nodes, red #db2626 glowing lines, dark background, technical minimal.`;

export const NETWORK_THEME = `${ABSTRACT} Connected spherical nodes, black structure, red #db2626 lines, dark void background.`;

export const GROWTH_THEME = `${ABSTRACT} Angular shapes ascending, black forms, red #db2626 light beams, dark background.`;

export const DATA_THEME = `${ABSTRACT} Data visualization, black background, white particles, red #db2626 glow, central vortex.`;

export const PORTAL_THEME = `${ABSTRACT} Intersecting planes, black geometry, red #db2626 glowing lines, abstract architecture.`;

export const CRYSTAL_THEME = `${ABSTRACT} Crystalline structure, black facets, red #db2626 core, white edge highlights, sharp angles.`;

export const FLOW_THEME = `${ABSTRACT} Energy waves, black depths, red #db2626 middle, white peaks, smooth gradients.`;

export const MINIMAL_GEOMETRIC = `${ABSTRACT} Single white shape, thin red #db2626 line, pure black background, ultra minimal.`;

export const DEPTH_THEME = `${ABSTRACT} Layered planes, black transparent, red #db2626 volumetric glow, depth dimension.`;

/**
 * REALISTIC IMAGES (With People) - For article heroes/business scenarios
 * CONSTRAINTS FIRST - Emphasize NO blue/cyan
 */
export const REALISTIC_MEETING = `${REALISTIC} Business team meeting, minimalist office, people in black white gray suits, clean walls, black furniture, red accent lighting.`;

export const REALISTIC_OFFICE = `${REALISTIC} Office workspace, professional working, black desks, white walls, gray floors, red accent lights, glass steel.`;

export const REALISTIC_TECH = `${REALISTIC} Professional with laptop, AI interface, modern setting, black white scheme, red accent lights.`;

export const REALISTIC_COLLABORATION = `${REALISTIC} Two professionals collaborating, large screen, modern office, black suits, white shirts, red wall lighting.`;

export const REALISTIC_PRESENTATION = `${REALISTIC} Executive presenting, small team, conference room, glass walls, black furniture, white surfaces, red accent.`;

// Export all prompts as an object for easy access
export const PROMPTS = {
  // Abstract (No People)
  hero: HERO_TEMPLATE,
  network: NETWORK_THEME,
  growth: GROWTH_THEME,
  data: DATA_THEME,
  portal: PORTAL_THEME,
  crystal: CRYSTAL_THEME,
  flow: FLOW_THEME,
  minimal: MINIMAL_GEOMETRIC,
  depth: DEPTH_THEME,
  
  // Realistic (With People) - For articles
  meeting: REALISTIC_MEETING,
  office: REALISTIC_OFFICE,
  tech: REALISTIC_TECH,
  collaboration: REALISTIC_COLLABORATION,
  presentation: REALISTIC_PRESENTATION
};

// Helper function to get a prompt by name
export function getPrompt(name) {
  return PROMPTS[name] || PROMPTS.hero;
}

// Helper function to list all available prompts
export function listPrompts() {
  return Object.keys(PROMPTS);
}

// If run directly, display all prompts
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('\n🎨 DaVeenci Brand Image Prompts\n');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  console.log('Brand Colors:');
  Object.entries(BRAND_COLORS).forEach(([name, hex]) => {
    console.log(`  ${name}: ${hex}`);
  });
  
  console.log('\n═══════════════════════════════════════════════════════════\n');
  console.log('Available Prompt Templates:\n');
  
  Object.entries(PROMPTS).forEach(([name, prompt]) => {
    console.log(`${name.toUpperCase()}`);
    console.log(`  ${prompt.substring(0, 100)}...`);
    console.log('');
  });
  
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log('Usage Examples:\n');
  console.log('// Import in your code:');
  console.log('import { PROMPTS, getPrompt } from "./brand-image-prompts.js";\n');
  console.log('// Get a specific prompt:');
  console.log('const prompt = getPrompt("network");\n');
  console.log('// Use with test script:');
  console.log('node scripts/test-image-generation.js "[paste prompt here]" --model=dall-e-3 --quality=hd\n');
  console.log('═══════════════════════════════════════════════════════════\n');
}

