import { adminAuth } from '$lib/firebase-admin';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

// Firebase session cookie expiry (14 days in seconds)
const COOKIE_EXPIRES_IN = 60 * 60 * 24 * 14;

export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    const { token } = await request.json();
    
    if (!token) {
      return json({ success: false, message: 'Missing token' }, { status: 400 });
    }
    
    // Create a session cookie
    const sessionCookie = await adminAuth.createSessionCookie(token, { 
      expiresIn: COOKIE_EXPIRES_IN * 1000 // Firebase wants milliseconds
    });
    
    // Set the cookie
    cookies.set('firebase_session', sessionCookie, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: COOKIE_EXPIRES_IN,
      sameSite: 'strict'
    });
    
    return json({ success: true });
  } catch (error) {
    console.error('Session creation error:', error);
    return json(
      { success: false, message: error instanceof Error ? error.message : 'Failed to create session' },
      { status: 401 }
    );
  }
};