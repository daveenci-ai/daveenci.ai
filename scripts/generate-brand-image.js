#!/usr/bin/env node

/**
 * Quick Brand Image Generator for DaVeenci
 * 
 * Usage:
 *   node scripts/generate-brand-image.js hero
 *   node scripts/generate-brand-image.js network --quality=hd
 *   node scripts/generate-brand-image.js growth
 */

import { PROMPTS, listPrompts } from './brand-image-prompts.js';
import { execSync } from 'child_process';

const args = process.argv.slice(2);
const themeName = args.find(arg => !arg.startsWith('--')) || 'hero';
const quality = args.find(arg => arg.startsWith('--quality'))?.split('=')[1] || 'hd';
const model = args.find(arg => arg.startsWith('--model'))?.split('=')[1] || 'dall-e-3';
const size = args.find(arg => arg.startsWith('--size'))?.split('=')[1] || '1792x1024'; // 16:9 aspect ratio

// Validate theme
const availableThemes = listPrompts();
if (!availableThemes.includes(themeName)) {
  console.error(`\n❌ Error: Unknown theme "${themeName}"\n`);
  console.log('Available themes:');
  availableThemes.forEach(theme => console.log(`  - ${theme}`));
  console.log('\nUsage: node scripts/generate-brand-image.js [theme] [--quality=hd] [--model=dall-e-3]\n');
  process.exit(1);
}

const prompt = PROMPTS[themeName];

console.log('\n🎨 DaVeenci Brand Image Generator\n');
console.log('═══════════════════════════════════════════════════════════\n');
console.log(`Theme: ${themeName.toUpperCase()}`);
console.log(`Model: ${model}`);
console.log(`Size: ${size} (16:9 aspect ratio)`);
console.log(`Quality: ${quality}`);
console.log('\nPrompt:');
console.log(`  ${prompt.substring(0, 120)}...`);
console.log('\n═══════════════════════════════════════════════════════════\n');

// Run the test-image-generation script with the brand prompt
try {
  const command = `node scripts/test-image-generation.js "${prompt}" --model=${model} --quality=${quality} --size=${size}`;
  execSync(command, { stdio: 'inherit' });
} catch (error) {
  console.error('Error generating image:', error.message);
  process.exit(1);
}

