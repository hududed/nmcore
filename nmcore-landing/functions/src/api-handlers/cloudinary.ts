import { Request, Response } from 'express';
import { defineSecret } from 'firebase-functions/params';
import { configureCloudinary, signCloudinaryRequest } from '../shared/cloudinary';

// Define secrets
export const CLOUDINARY_API_SECRET = defineSecret('CLOUDINARY_API_SECRET');
export const PUBLIC_CLOUDINARY_API_KEY = defineSecret('PUBLIC_CLOUDINARY_API_KEY');
export const PUBLIC_CLOUDINARY_CLOUD_NAME = defineSecret('PUBLIC_CLOUDINARY_CLOUD_NAME');

// Cloudinary Handler Function
export const cloudinaryHandler = async (req: Request, res: Response) => {
  try {
    const { paramsToSign } = req.body;

    if (!paramsToSign || !paramsToSign.public_id) {
      return res.status(400).json({
        error: 'Invalid request payload. Ensure "paramsToSign" includes a "public_id".',
      });
    }

    // Configure Cloudinary
    configureCloudinary({
      cloudName: PUBLIC_CLOUDINARY_CLOUD_NAME.value(),
      apiKey: PUBLIC_CLOUDINARY_API_KEY.value(),
      apiSecret: CLOUDINARY_API_SECRET.value(),
    });

    // Generate the signature
    const signature = signCloudinaryRequest(paramsToSign, CLOUDINARY_API_SECRET.value());

    return res.json({ signature });
  } catch (err) {
    console.error('Error generating Cloudinary signature:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
