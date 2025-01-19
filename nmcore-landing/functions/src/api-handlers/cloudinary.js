//file: nmcore-landing/functions/src/api-handlers/cloudinary.ts
import { configureCloudinary, signCloudinaryRequest } from '../shared/cloudinary.js';

// Factory function to create Cloudinary handlers
export const createCloudinaryHandler = (config) => {
  return async (req, res) => {
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

