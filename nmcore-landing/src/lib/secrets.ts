//filepath: /nmcore-landing/src/lib/secrets.ts
import { config } from 'dotenv';

if (typeof window === 'undefined') {
  // Load .env contents into process.env only in the server environment
  config();
}

// Client-accessible public secrets
export const CLOUDINARY_CLOUD_NAME = process.env.PUBLIC_CLOUDINARY_CLOUD_NAME || '';
export const CLOUDINARY_API_KEY = process.env.PUBLIC_CLOUDINARY_API_KEY || '';

// Server-only secrets
export const getServerSecret = async (key: string): Promise<string> => {
  if (typeof window !== 'undefined') {
    throw new Error(`Cannot access secrets on the client: ${key}`);
  }

  // Dynamically import server-only modules
  const { defineSecret } = await import('firebase-functions/params');
  const secret = defineSecret(key);

  return secret.value();
};