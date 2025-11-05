/**
 * Cloud Storage Utility for Cloudflare R2 / AWS S3
 * 
 * Supports:
 * - Cloudflare R2 (S3-compatible, no egress fees, free tier)
 * - AWS S3
 * - Any S3-compatible storage
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Check if cloud storage is configured
const isCloudStorageEnabled = () => {
  return !!(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME
  );
};

// Lazy initialization: S3 client created only when first needed
let s3Client = null;
let s3ClientInitialized = false;

function getS3Client() {
  if (s3ClientInitialized) {
    return s3Client;
  }
  
  s3ClientInitialized = true;
  
  if (isCloudStorageEnabled()) {
    s3Client = new S3Client({
      region: 'auto', // R2 uses 'auto', S3 uses actual region
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });
    
    console.log('✅ Cloudflare R2 storage configured');
  } else {
    console.log('⚠️  Cloud storage not configured - images will be saved locally (ephemeral on Render)');
    console.log('   Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME to enable');
  }
  
  return s3Client;
}

/**
 * Upload a buffer directly to cloud storage (no temp files needed!)
 * @param {Buffer} buffer - Image buffer to upload
 * @param {string} storageKey - Key (path) in the cloud storage (e.g., 'articles/image.jpg')
 * @param {string} contentType - MIME type (e.g., 'image/jpeg')
 * @returns {Promise<string>} Public URL of the uploaded file
 */
export async function uploadToCloud(buffer, storageKey, contentType = 'image/jpeg') {
  if (!isCloudStorageEnabled()) {
    throw new Error('Cloud storage is not configured. Set R2_* environment variables.');
  }

  // Get S3 client (lazy initialization)
  const client = getS3Client();
  
  if (!client) {
    throw new Error('S3 client initialization failed. Check R2 environment variables.');
  }

  try {
    // Upload buffer directly to R2/S3 (no temp file needed!)
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: storageKey,
      Body: buffer,
      ContentType: contentType,
    });

    await client.send(command);

    // Construct public URL
    // Option 1: R2 public bucket URL (if bucket is public)
    // const publicUrl = `https://pub-${process.env.R2_ACCOUNT_ID}.r2.dev/${storageKey}`;
    
    // Option 2: Custom domain (recommended)
    const publicUrl = process.env.R2_PUBLIC_URL
      ? `${process.env.R2_PUBLIC_URL}/${storageKey}`
      : `https://${process.env.R2_PUBLIC_URL || process.env.R2_BUCKET_NAME}.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${storageKey}`;

    console.log(`✅ Uploaded to cloud: ${storageKey}`);
    return publicUrl;
  } catch (error) {
    console.error('❌ Error uploading to cloud storage:', error);
    throw error;
  }
}

/**
 * Check if cloud storage is available
 */
export { isCloudStorageEnabled };

