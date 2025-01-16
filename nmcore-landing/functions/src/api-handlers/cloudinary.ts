//file: nmcore-landing/functions/src/api-handlers/cloudinary.ts
import { Request, Response } from 'express';
import { configureCloudinary, signCloudinaryRequest } from '../shared/cloudinary';

// Factory function to create Cloudinary handlers
export const createCloudinaryHandler = (config: {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}) => {
  return async (req: Request, res: Response) => {
    try {
      const { paramsToSign } = req.body;

      if (!paramsToSign || !paramsToSign.public_id) {
        return res.status(400).json({
          error: 'Invalid request payload. Ensure "paramsToSign" includes a "public_id".',
        });
      }

      // Configure Cloudinary
      configureCloudinary({
        cloudName: config.cloudName,
        apiKey: config.apiKey,
        apiSecret: config.apiSecret,
      });

      // Generate the signature
      const signature = signCloudinaryRequest(paramsToSign, config.apiSecret);

      return res.json({ signature });
    } catch (err) {
      console.error('Error generating Cloudinary signature:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
};

