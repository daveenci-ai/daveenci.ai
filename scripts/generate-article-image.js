#!/usr/bin/env node

/**
 * Article-Specific Image Generator for DaVeenci
 * 
 * Generates branded images that resonate with specific article content
 * while maintaining DaVeenci brand identity.
 * 
 * Usage:
 *   node scripts/generate-article-image.js "article summary or key themes"
 *   node scripts/generate-article-image.js "AI, data analytics, growth" --quality=hd
 */

import { execSync } from 'child_process';

const args = process.argv.slice(2);
const articleThemes = args.find(arg => !arg.startsWith('--'));
const quality = args.find(arg => arg.startsWith('--quality'))?.split('=')[1] || 'hd';
const model = args.find(arg => arg.startsWith('--model'))?.split('=')[1] || 'dall-e-3';
const size = args.find(arg => arg.startsWith('--size'))?.split('=')[1] || '1792x1024';

if (!articleThemes) {
  console.error('\n❌ Error: Please provide article themes or summary\n');
  console.log('Usage:');
  console.log('  node scripts/generate-article-image.js "your article themes or summary"\n');
  console.log('Examples:');
  console.log('  node scripts/generate-article-image.js "AI automation, productivity, efficiency"');
  console.log('  node scripts/generate-article-image.js "startup funding, venture capital, growth"');
  console.log('  node scripts/generate-article-image.js "data analytics, insights, decision making" --quality=hd\n');
  process.exit(1);
}

// DALL-E 3 STRATEGY: Put constraints FIRST (it ignores trailing text)
const PREFIX = `I NEED to test how the tool works with extremely specific prompts. DO NOT add any other colors.`;

// Check if theme suggests people/realistic (contains words like: team, people, meeting, office, collaboration, etc.)
const needsRealistic = /team|people|meeting|office|collab|work|professional|business|executive|startup/i.test(articleThemes);

// Construct prompt with CONSTRAINTS FIRST
const articlePrompt = needsRealistic 
  ? `${PREFIX} FORBIDDEN: text, words, blue, cyan, teal, turquoise colors. REQUIRED: people ONLY black/white/gray suits, NO colored clothing. Background ONLY black/white/gray, red accents only. Business scene: ${articleThemes}. Modern minimalist office, professional, red accent lighting.`
  : `${PREFIX} FORBIDDEN: people, faces, humans, text, words, blue, cyan, teal, turquoise, green, purple. REQUIRED COLORS: ONLY red #db2626, black, white, gray. Abstract geometric shapes: ${articleThemes}. Black forms, red glow, dark background, technical minimal.`;

console.log('\n🎨 DaVeenci Article Image Generator\n');
console.log('═══════════════════════════════════════════════════════════\n');
console.log('Article Themes:', articleThemes);
console.log(`Image Type: ${needsRealistic ? 'REALISTIC (with people)' : 'ABSTRACT (geometric)'}`);
console.log(`Model: ${model}`);
console.log(`Size: ${size} (16:9)`);
console.log(`Quality: ${quality}`);
console.log('\nGenerating branded image aligned with article content...');
console.log('\n═══════════════════════════════════════════════════════════\n');

// Run the test-image-generation script
try {
  const command = `node scripts/test-image-generation.js "${articlePrompt}" --model=${model} --quality=${quality} --size=${size}`;
  execSync(command, { stdio: 'inherit' });
} catch (error) {
  console.error('Error generating image:', error.message);
  process.exit(1);
}

