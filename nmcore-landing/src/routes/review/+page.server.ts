// filepath: /nmcore-landing/src/routes/review/+page.server.ts
import { adminDb as db } from '$lib/firebase-admin';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  const token = url.searchParams.get('token');

  console.log('📌 Received token:', token);

  if (!token) {
    return { validToken: false, productId: null };
  }

  try {
    const tokenRef = db.collection('reviewTokens').doc(token);
    const tokenSnapshot = await tokenRef.get();

    if (!tokenSnapshot.exists || tokenSnapshot.data().used) {
      console.log('❌ Token NOT found or already used.');
      return { validToken: false, productId: null };
    }
    console.log('✅ Returning Data:', { validToken: true, productId: tokenSnapshot.data().productId });
    return {
        validToken: true,
        productId: tokenSnapshot.data().productId,
        reviewToken: token
    };
  } catch (error) {
    console.error('🔥 Firestore Error:', error);
    return { validToken: false, productId: null };
  }
};

// ✅ Add a form action
export const actions: Actions = {
  submitReview: async ({ request }) => {
    const formData = await request.formData();
    const productId = formData.get('productId');
    const rating = Number(formData.get('rating'));
    const review = formData.get('review');
    const reviewToken = formData.get('reviewToken');
  
    console.log("✅ Form Data Received:", { productId, rating, review, reviewToken });


    if (!productId || !rating || typeof review !== 'string' || !review.trim()) {
      console.error("❌ Invalid Request:", { productId, rating, review, reviewToken });
      return fail(400, { error: 'Invalid request' });
    }

    const productRef = db.collection('products').doc(productId as string);
    const productSnapshot = await productRef.get();

    if (!productSnapshot.exists) {
      console.error("❌ Product Not Found:", productId);
      return fail(404, { error: 'Product not found' });
    }

    const product = productSnapshot.data();
    const newRating = (product.rating * product.reviews.length + rating) / (product.reviews.length + 1);

    await productRef.update({
      reviews: [{ rating, review }, ...product.reviews],
      rating: newRating
    });

    // Mark the review token as used
    const tokenRef = db.collection('reviewTokens').doc(reviewToken as string);
    await tokenRef.update({ used: true });


    return { success: true };
  }
};
