// filepath: /nmcore-landing/src/routes/review/+page.server.ts
import { adminDb as db } from '$lib/firebase-admin';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  const token = url.searchParams.get('token');

  console.log('📌 Received token:', token);

  if (!token) {
    return { validToken: false, orderId: null };
  }

  try {
    const tokenRef = db.collection('reviewTokens').doc(token);
    const tokenSnapshot = await tokenRef.get();

    if (!tokenSnapshot.exists || tokenSnapshot.data().used) {
      console.log('❌ Token NOT found or already used.');
      return { validToken: false, orderId: null };
    }
    console.log('✅ Returning Data:', { validToken: true, orderId: tokenSnapshot.data().orderId });
    return {
        validToken: true,
        orderId: tokenSnapshot.data().orderId,
    };
  } catch (error) {
    console.error('🔥 Firestore Error:', error);
    return { validToken: false, orderId: null };
  }
};

// ✅ Add a form action
export const actions: Actions = {
  submitReview: async ({ request }) => {
    const formData = await request.formData();
    const orderId = formData.get('orderId');
    const rating = Number(formData.get('rating'));
    const review = formData.get('review');
  
    console.log("✅ Form Data Received:", { orderId, rating, review });


    if (!orderId || !rating || typeof review !== 'string' || !review.trim()) {
      console.error("❌ Invalid Request:", { orderId, rating, review });
      return fail(400, { error: 'Invalid request' });
    }

    const productRef = db.collection('products').doc(orderId as string);
    const productSnapshot = await productRef.get();

    if (!productSnapshot.exists) {
      console.error("❌ Product Not Found:", orderId);
      return fail(404, { error: 'Product not found' });
    }

    const product = productSnapshot.data();
    const newRating = (product.rating * product.reviews.length + rating) / (product.reviews.length + 1);

    await productRef.update({
      reviews: [{ rating, review }, ...product.reviews],
      rating: newRating
    });

    return { success: true };
  }
};
