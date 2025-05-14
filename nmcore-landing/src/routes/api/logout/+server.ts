// src/routes/api/logout/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ cookies }) => {
  // Clear the firebase session cookie
  cookies.delete('firebase_session', { path: '/' });
  
  return json({ success: true });
};