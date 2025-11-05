#!/usr/bin/env node

/**
 * Test script for OpenAI DALL-E Image Generation API
 * 
 * Usage:
 *   node scripts/test-image-generation.js
 *   node scripts/test-image-generation.js "a futuristic city at sunset"
 *   node scripts/test-image-generation.js "abstract art" --size 512x512 --quality standard
 */

import OpenAI from 'openai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from root .env
dotenv.config({ path: join(__dirname, '..', '.env') });

// Configuration
const DEFAULT_PROMPT = 'A professional logo for a venture capital firm, minimalist design, modern aesthetic';
const DEFAULT_SIZE = '1024x1024'; // Options: '256x256', '512x512', '1024x1024', '1792x1024', '1024x1792'
const DEFAULT_QUALITY = 'auto'; // Options: gpt-image-1-mini: 'low'|'medium'|'high'|'auto', dall-e: 'standard'|'hd'
const DEFAULT_MODEL = 'gpt-image-1-mini'; // Options: 'dall-e-2', 'dall-e-3', 'gpt-image-1-mini'
const DEFAULT_N = 1; // Number of images
const OUTPUT_DIR = join(__dirname, '..', 'generated-images');

// Parse command line arguments
const args = process.argv.slice(2);
const prompt = args.find(arg => !arg.startsWith('--')) || DEFAULT_PROMPT;
const size = args.find(arg => arg.startsWith('--size'))?.split('=')[1] || DEFAULT_SIZE;
const quality = args.find(arg => arg.startsWith('--quality'))?.split('=')[1] || DEFAULT_QUALITY;
const model = args.find(arg => arg.startsWith('--model'))?.split('=')[1] || DEFAULT_MODEL;
const n = parseInt(args.find(arg => arg.startsWith('--n'))?.split('=')[1] || DEFAULT_N);
const useR2 = args.includes('--r2'); // Enable R2 upload with --r2 flag

/**
 * Validates environment and configuration
 */
function validateConfig() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Error: OPENAI_API_KEY is not set in .env file');
    console.error('Please add OPENAI_API_KEY=your-key-here to your .env file');
    process.exit(1);
  }
  
  const validSizes = ['256x256', '512x512', '1024x1024', '1792x1024', '1024x1792'];
  if (!validSizes.includes(size)) {
    console.error(`❌ Error: Invalid size "${size}". Valid options: ${validSizes.join(', ')}`);
    process.exit(1);
  }
  
  // Validate quality based on model
  if (model === 'gpt-image-1-mini') {
    const validQualities = ['low', 'medium', 'high', 'auto'];
    if (!validQualities.includes(quality)) {
      console.error(`❌ Error: Invalid quality "${quality}" for gpt-image-1-mini. Valid options: ${validQualities.join(', ')}`);
      process.exit(1);
    }
  } else {
    const validQualities = ['standard', 'hd'];
    if (!validQualities.includes(quality)) {
      console.error(`❌ Error: Invalid quality "${quality}" for ${model}. Valid options: ${validQualities.join(', ')}`);
      process.exit(1);
    }
  }
  
  const validModels = ['dall-e-2', 'dall-e-3', 'gpt-image-1-mini'];
  if (!validModels.includes(model)) {
    console.error(`❌ Error: Invalid model "${model}". Valid options: ${validModels.join(', ')}`);
    process.exit(1);
  }
  
  if ((model === 'dall-e-3' || model === 'gpt-image-1-mini') && n !== 1) {
    console.warn(`⚠️  Warning: ${model} only supports n=1, adjusting...`);
  }
}

/**
 * Creates output directory if it doesn't exist
 */
function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`📁 Created output directory: ${OUTPUT_DIR}`);
  }
}

/**
 * Downloads image from URL and saves to file
 */
async function downloadImage(url, filename) {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const filepath = join(OUTPUT_DIR, filename);
    fs.writeFileSync(filepath, buffer);
    
    return filepath;
  } catch (error) {
    console.error('❌ Error downloading image:', error.message);
    throw error;
  }
}

/**
 * Generates a filename based on timestamp
 */
function generateFilename(index = 0) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `dalle-${timestamp}-${index}.png`;
}

/**
 * Check if R2 cloud storage is configured
 */
function isR2Enabled() {
  return !!(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME
  );
}

/**
 * Upload image buffer to Cloudflare R2
 */
async function uploadToR2(buffer, filename) {
  if (!isR2Enabled()) {
    console.log('⚠️  R2 not configured, skipping cloud upload');
    return null;
  }
  
  try {
    const s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });
    
    const storageKey = `generated/${filename}`;
    
    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: storageKey,
      Body: buffer,
      ContentType: 'image/png',
    }));
    
    const publicUrl = process.env.R2_PUBLIC_URL
      ? `${process.env.R2_PUBLIC_URL}/${storageKey}`
      : `https://${process.env.R2_BUCKET_NAME}.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${storageKey}`;
    
    return publicUrl;
  } catch (error) {
    console.error('❌ R2 upload failed:', error.message);
    return null;
  }
}

/**
 * Main function to generate images
 */
async function generateImages() {
  console.log('\n🎨 OpenAI DALL-E Image Generation Test\n');
  console.log('Configuration:');
  console.log(`  Model: ${model}`);
  console.log(`  Prompt: "${prompt}"`);
  console.log(`  Size: ${size}`);
  console.log(`  Quality: ${quality}`);
  console.log(`  Number of images: ${(model === 'dall-e-3' || model === 'gpt-image-1-mini') ? 1 : n}`);
  console.log('');
  
  validateConfig();
  ensureOutputDir();
  
  const openai = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY 
  });
  
  try {
    console.log('🚀 Generating image(s)...\n');
    
    const startTime = Date.now();
    
    // Generate images
    const requestParams = {
      model: model,
      prompt: prompt,
      n: (model === 'dall-e-3' || model === 'gpt-image-1-mini') ? 1 : n,
      size: size
    };
    
    // response_format parameter only supported in dall-e models
    if (model === 'dall-e-2' || model === 'dall-e-3') {
      requestParams.response_format = 'url'; // Can be 'url' or 'b64_json'
    }
    
    // Quality parameter only supported in dall-e-3 and gpt-image-1-mini
    if (model === 'dall-e-3' || model === 'gpt-image-1-mini') {
      requestParams.quality = quality;
    }
    
    const response = await openai.images.generate(requestParams);
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log(`✅ Generation complete in ${duration}s\n`);
    console.log(`Generated ${response.data.length} image(s):\n`);
    
    // Download and save images
    const savedFiles = [];
    const cloudUrls = [];
    
    for (let i = 0; i < response.data.length; i++) {
      const imageData = response.data[i];
      const filename = generateFilename(i);
      
      console.log(`📥 Downloading image ${i + 1}/${response.data.length}...`);
      console.log(`   URL: ${imageData.url}`);
      
      if (imageData.revised_prompt) {
        console.log(`   Revised Prompt: "${imageData.revised_prompt}"`);
      }
      
      // Download image
      const response2 = await fetch(imageData.url);
      const arrayBuffer = await response2.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Save locally
      const filepath = join(OUTPUT_DIR, filename);
      fs.writeFileSync(filepath, buffer);
      savedFiles.push(filepath);
      console.log(`   ✅ Saved locally: ${filepath}`);
      
      // Upload to R2 if enabled
      if (useR2) {
        console.log(`   ☁️  Uploading to R2...`);
        const cloudUrl = await uploadToR2(buffer, filename);
        if (cloudUrl) {
          cloudUrls.push(cloudUrl);
          console.log(`   ✅ Uploaded to R2: ${cloudUrl}`);
        }
      }
      
      console.log('');
    }
    
    // Summary
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🎉 Image Generation Test Complete!\n');
    console.log('Summary:');
    console.log(`  Total images: ${savedFiles.length}`);
    console.log(`  Generation time: ${duration}s`);
    console.log(`  Output directory: ${OUTPUT_DIR}`);
    console.log('\nLocal files:');
    savedFiles.forEach((file, i) => {
      console.log(`  ${i + 1}. ${file}`);
    });
    
    if (cloudUrls.length > 0) {
      console.log('\n☁️  Cloud URLs (R2):');
      cloudUrls.forEach((url, i) => {
        console.log(`  ${i + 1}. ${url}`);
      });
    }
    console.log('═══════════════════════════════════════════════════════════\n');
    
  } catch (error) {
    console.error('\n❌ Error generating images:');
    console.error(`   ${error.message}`);
    
    if (error.response) {
      console.error('\nAPI Response:');
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    
    process.exit(1);
  }
}

// Run the script
console.log('\n═══════════════════════════════════════════════════════════');
generateImages().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});

