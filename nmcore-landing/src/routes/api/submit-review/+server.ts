// filepath: src/routes/api/submit-review/%2Bserver.ts
import { adminDb as db } from '$lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST({ request }) {
  const { orderId, rating, review } = await request.json();

  if (!orderId || !rating || !review.trim()) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 });
  }

  const productRef = db.collection('products').doc(orderId);
  const productSnapshot = await productRef.get();

  if (!productSnapshot.exists) {
    return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 });
  }

  const product = productSnapshot.data();

  // Calculate the new rating
  const newRating = (product.rating * product.reviews.length + rating) / (product.reviews.length + 1);

  // Update the product document with the new review and rating
  await productRef.update({
    reviews: FieldValue.arrayUnion({ rating, review }),
    rating: newRating
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
