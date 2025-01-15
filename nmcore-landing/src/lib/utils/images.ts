//filepath: /nmcore-landing/src/lib/utils/images.ts
import { PUBLIC_CLOUDINARY_API_KEY, PUBLIC_CLOUDINARY_CLOUD_NAME } from '$env/static/public';

console.log('Loaded Public ENV:', { PUBLIC_CLOUDINARY_CLOUD_NAME, PUBLIC_CLOUDINARY_API_KEY });

export async function fetchImageURL(
  image: { cloudinaryId: string },
  transformations: Record<string, string> = {},
  fetch: typeof globalThis.fetch
): Promise<string> {
  if (!image.cloudinaryId) {
    console.error('Missing Cloudinary ID for image:', image);
    return '';
  }

  const paramsToSign = {
    public_id: image.cloudinaryId,
    ...transformations,
  };

  try {
    console.log('Fetching signature for image:', image.cloudinaryId);
    const response = await fetch('/api/cloudinary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paramsToSign }),
    });

    if (!response.ok) {
      console.error('API Response Status:', response.status);
      console.error('API Response Text:', await response.text());
      throw new Error('Failed to fetch Cloudinary signature');
    }

    const { signature } = await response.json();

    const transformationString = Object.entries(transformations)
      .map(([key, value]) => `${key}_${value}`)
      .join(',');

    const imageUrl = `https://res.cloudinary.com/${PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${transformationString ? `${transformationString}/` : ''}${image.cloudinaryId}?signature=${signature}&api_key=${PUBLIC_CLOUDINARY_API_KEY}`;

    return imageUrl;
  } catch (e) {
    console.error('Error fetching signed Cloudinary URL:', e);
    return '';
  }
}

/**
 * Fetch Cloudinary URLs for multiple images with optional transformations
 * @param {Array<object>} images - Array of Cloudinary image objects
 * @param {object} transformations - Optional Cloudinary transformations
 * @param {function} fetch - Fetch function
 * @returns {Promise<Array<string>>} - Array of signed Cloudinary URLs
 */
export async function fetchImageURLs(
  images: { cloudinaryId: string }[],
  transformations: Record<string, string> = {},
  fetch: typeof globalThis.fetch
): Promise<string[]> {
  return Promise.all(images.map((image) => fetchImageURL(image, transformations, fetch)));
}

export function getCloudinaryId(cloudinaryId: string): string {
  if (!cloudinaryId) {
    console.warn('Invalid Cloudinary ID:', cloudinaryId);
    return '';
  }
  return cloudinaryId;
}
