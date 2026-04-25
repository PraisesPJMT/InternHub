import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

// 1. Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload file buffer to Cloudinary
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<string>} - The secure URL of the uploaded asset
 */
export const uploadToCloudinary = async (fileBuffer, folder = 'uploads') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'auto', // Automatically detects image, video, or raw (pdf)
        public_id: crypto.randomUUID(), // Optional: if you want custom naming
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary Upload Error:', error);
          return reject(new Error('Failed to upload file to Cloudinary'));
        }
        resolve(result.secure_url);
      }
    );

    // Write the buffer to the stream
    uploadStream.end(fileBuffer);
  });
};

/**
 * Delete file from Cloudinary using its Public ID
 * @param {string} publicId - The public ID (e.g., 'uploads/random-uuid')
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Cloudinary Delete Error:', error);
    return false;
  }
};