//filepath: /Users/hfox/Developments/nmcore/nmcore-landing/src/routes/products/[id]/+page.server.ts
import { adminDb } from '$lib/firebase-admin';
import type { Product } from '$lib/types';
import { error } from '@sveltejs/kit';

export async function load({ params }: { params: { id: string } }) {
  console.log('Received product ID:', params.id);

  try {
    const { id } = params;
    if (!id) {
      console.error('❌ No product ID in params');
      throw error(400, 'Product ID is missing from the URL');
    }
    const productSnapshot = await adminDb.collection('products').where('id', '==', id).get();

    if (productSnapshot.empty) {
      console.error(`❌ Product not found for ID: ${id}`);
      throw error(404, `Product not found for ID: ${id}`);
    }

    const productDoc = productSnapshot.docs[0];
    const product = productDoc.data() as Product;
    return {
      product: {
        ...product,
        images: product.images.map((img) => ({
          cloudinaryId: img.cloudinaryId, // Keep it simple
        })),
        productSizes: product.productSizes.map((size) => ({
          ...size,
          mainImage: {
            cloudinaryId: size.mainImage.cloudinaryId, // Ensure this is passed as-is
          },
        })),
        reviews: product.reviews
      },
    };
  } catch (err) {
    console.error('Error in +page.server.ts load function:', err);
    throw error(500, 'Internal Server Error');
  }
}