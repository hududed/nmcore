import { adminDb } from '$lib/firebase-admin';
import type { RequestEvent } from '@sveltejs/kit';
import { error, json } from '@sveltejs/kit';

// Verify authentication
async function verifyAuth(cookies: {get(name: string): string | undefined}) {
  const sessionCookie = cookies.get('__session');
  if (!sessionCookie) {
    throw error(401, 'Unauthorized');
  }
  
  try {
    // Import dynamically to avoid server/client mismatch
    const { getAuth } = await import('firebase-admin/auth');
    await getAuth().verifySessionCookie(sessionCookie, true);
    return true;
  } catch (err) {
    throw error(401, 'Unauthorized');
  }
}

export const GET = async ({ url, cookies }: RequestEvent) => {
  try {
    // Verify the user is authenticated
    await verifyAuth(cookies);
    
    // Get query parameters
    const status = url.searchParams.get('status');
    const limitParam = url.searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam) : 100;
    
    // Build the query
    let query = adminDb
      .collection('email_logs')
      .orderBy('createdAt', 'desc')
      .limit(limit);
      
    // Add status filter if provided
    if (status && status !== 'all') {
      query = query.where('status', '==', status);
    }
    
    // Execute the query
    const snapshot = await query.get();
    
    // Transform the results
    const logs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return json(logs);
  } catch (err: any) {
    console.error('Error fetching email logs:', err);
    if (err.status && err.body) {
      throw err; // Re-throw SvelteKit errors
    }
    throw error(500, 'Failed to fetch email logs');
  }
};