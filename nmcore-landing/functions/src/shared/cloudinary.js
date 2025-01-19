import { v2 as cloudinary } from 'cloudinary';

/**
 * Configure Cloudinary with given parameters.
 */
export const configureCloudinary = ({ cloudName, apiKey, apiSecret }) => {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
};

/**
 * Generate a Cloudinary signature for secure requests.
 */
export const signCloudinaryRequest = (
  paramsToSign,
  apiSecret
) => {
  return cloudinary.utils.api_sign_request(paramsToSign, apiSecret);
};
