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
    const productId = formData.get('productId') as string;
    const reviewToken = formData.get('reviewToken') as string;
    const rating = Number(formData.get('rating'));
    const reviewText = (formData.get('review') as string).trim();
    const useCase = formData.get('useCase') as string;
    const imagesRaw = formData.get('images') as string;

    let images = [];
    try {
      images = JSON.parse(imagesRaw);
    } catch (e) {
      console.error('❌ Failed to parse images JSON:', e);
    }
    console.log("✅ Form Data Received:", { productId, rating, reviewText, reviewToken, useCase, images });


    if (!productId || !rating || !reviewText || !reviewToken) {
      console.error("❌ Invalid Request:", { productId, rating, reviewText, reviewToken });
      return fail(400, { error: 'Invalid request' });
    }

    // Get current date as ISO string
    const date = new Date().toISOString();

    // Update the reviewTokens document with the new review data
    const tokenRef = db.collection('reviewTokens').doc(reviewToken);
    const tokenSnapshot = await tokenRef.get();
    if (!tokenSnapshot.exists || tokenSnapshot.data().used) {
      console.error("❌ Invalid or already used token");
      return fail(400, { error: 'Invalid or already used token.' });
    }
    
    const productRef = db.collection('products').doc(productId);
    const productSnapshot = await productRef.get();

    if (!productSnapshot.exists) {
      console.error("❌ Product Not Found:", productId);
      return fail(404, { error: 'Product not found' });
    }
    
    const product = productSnapshot.data();
    const newRating = (product.rating * product.reviews.length + rating) / (product.reviews.length + 1);

    await productRef.update({
      reviews: [{ date, rating, review: reviewText, images }, ...product.reviews],
      rating: newRating,
      useCases: [useCase, ...product.useCases]
    });
    
    // Mark the review token as used
    await tokenRef.update({ used: true });

    return { success: true };
  }
};
