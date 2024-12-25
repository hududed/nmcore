import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from '$lib/secrets';
import { error, json } from '@sveltejs/kit';
import { v2 as cloudinary } from 'cloudinary';

// Validate and configure Cloudinary
if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  throw new Error(
    'Missing Cloudinary environment variables. Ensure PUBLIC_CLOUDINARY_CLOUD_NAME, PUBLIC_CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set.'
  );
}

// Configure Cloudinary using secrets
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export const POST = async ({ request }) => {
  try {
    const { paramsToSign } = await request.json();

    if (!paramsToSign || !paramsToSign.public_id) {
      throw error(400, 'Invalid request payload. Ensure "paramsToSign" includes a "public_id".');
    }

    const signature = cloudinary.utils.api_sign_request(paramsToSign, CLOUDINARY_API_SECRET);

    return json({ signature });
  } catch (e) {
    console.error('Error generating Cloudinary signature:', e);
    throw error(500, (e as Error).message || 'Internal Server Error');
  }
};
