import { db } from '$lib/firebase';
import type { Product } from '$lib/types';
import { error } from '@sveltejs/kit';
import { collection, getDocs, query, where } from 'firebase/firestore';

export async function load({ params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    throw error(400, 'Product ID is missing from the URL');
  }

  const productsCollection = collection(db, 'products');
  const productQuery = query(productsCollection, where('id', '==', id));
  const productSnapshot = await getDocs(productQuery);

  if (productSnapshot.empty) {
    throw error(404, `Product not found for ID: ${id}`);
  }

  const productDoc = productSnapshot.docs[0];
  const product = productDoc.data() as Product;

  // No need for fetchImageURL; pass plain cloudinaryId
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
    },
  };
}
