import dotenv from 'dotenv';
import crypto from 'crypto';
import path from 'path';

dotenv.config();

// Note: You need to install @aws-sdk/client-s3 separately
// npm install @aws-sdk/client-s3

let S3Client, PutObjectCommand, DeleteObjectCommand;

try {
  const awsSdk = await import('@aws-sdk/client-s3');
  S3Client = awsSdk.S3Client;
  PutObjectCommand = awsSdk.PutObjectCommand;
  DeleteObjectCommand = awsSdk.DeleteObjectCommand;
} catch (error) {
  console.warn('AWS SDK not installed. File upload features will not work.');
  console.warn('Install with: npm install @aws-sdk/client-s3');
}

const r2Client = S3Client ? new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
  },
}) : null;

const BUCKET_NAME = process.env.CLOUDFLARE_BUCKET_NAME;
const PUBLIC_URL = process.env.CLOUDFLARE_PUBLIC_URL;

/**
 * Upload file to Cloudflare R2
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} originalName - Original filename
 * @param {string} folder - Folder name (e.g., 'profiles', 'signatures')
 * @returns {Promise<string>} - Public URL of uploaded file
 */
export const uploadToR2 = async (fileBuffer, originalName, folder = 'uploads') => {
  try {
    if (!r2Client || !PutObjectCommand) {
      throw new Error('Storage service not configured. Please install @aws-sdk/client-s3');
    }

    const fileExtension = path.extname(originalName);
    const fileName = `${folder}/${crypto.randomUUID()}${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
      ContentType: getMimeType(fileExtension),
    });

    await r2Client.send(command);

    return `${PUBLIC_URL}/${fileName}`;
  } catch (error) {
    console.error('Error uploading to R2:', error);
    throw new Error('Failed to upload file');
  }
};

/**
 * Delete file from Cloudflare R2
 * @param {string} fileUrl - Full URL of the file
 * @returns {Promise<boolean>}
 */
export const deleteFromR2 = async (fileUrl) => {
  try {
    if (!r2Client || !DeleteObjectCommand) {
      console.warn('Storage service not configured');
      return false;
    }

    // Extract the key from the URL
    const fileName = fileUrl.replace(`${PUBLIC_URL}/`, '');

    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
    });

    await r2Client.send(command);
    return true;
  } catch (error) {
    console.error('Error deleting from R2:', error);
    return false;
  }
};

/**
 * Get MIME type based on file extension
 * @param {string} extension - File extension
 * @returns {string} - MIME type
 */
const getMimeType = (extension) => {
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
  };

  return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
};