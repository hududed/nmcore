import { config } from 'dotenv';

// Load .env contents into process.env
config();

export const getSecret = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required secret: ${key}`);
  }

  return value;
};

// Export individual secrets for use
export const CLOUDINARY_CLOUD_NAME = getSecret('PUBLIC_CLOUDINARY_CLOUD_NAME');
export const CLOUDINARY_API_KEY = getSecret('PUBLIC_CLOUDINARY_API_KEY');
export const CLOUDINARY_API_SECRET = getSecret('CLOUDINARY_API_SECRET');
