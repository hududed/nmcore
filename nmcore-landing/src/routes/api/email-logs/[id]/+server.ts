import { adminDb } from '$lib/firebase-admin';
import sgMail from '@sendgrid/mail';
import type { RequestEvent } from '@sveltejs/kit';
import { error, json } from '@sveltejs/kit';

// Set SendGrid API key
const sendgridApiKey = process.env.SENDGRID_FB_API_KEY;
if (sendgridApiKey) {
  sgMail.setApiKey(sendgridApiKey);
}

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

// GET endpoint to fetch a single email log
export const GET = async ({ params, cookies }: RequestEvent) => {
  try {
    // Verify the user is authenticated
    await verifyAuth(cookies);
    
    const { id } = params;
    
    const doc = await adminDb
      .collection('email_logs')
      .doc(id)
      .get();
      
    if (!doc.exists) {
      throw error(404, 'Email log not found');
    }
    
    return json({
      id: doc.id,
      ...doc.data()
    });
  } catch (err: any) {
    console.error('Error fetching email log:', err);
    if (err.status && err.body) {
      throw err; // Re-throw SvelteKit errors
    }
    throw error(500, 'Failed to fetch email log');
  }
};

// POST endpoint to resend a failed email
export const POST = async ({ params, cookies, request }: RequestEvent) => {
  try {
    // Verify the user is authenticated
    await verifyAuth(cookies);
    
    const { id } = params;
    
    // Get the email log
    const doc = await adminDb
      .collection('email_logs')
      .doc(id)
      .get();
      
    if (!doc.exists) {
      throw error(404, 'Email log not found');
    }
    
    const emailLog = doc.data();
    
    // Only allow resending of failed emails
    if (emailLog.status !== 'failed') {
      throw error(400, 'Can only resend failed emails');
    }
    
    if (!sendgridApiKey) {
      throw error(500, 'SendGrid API key not configured');
    }
    
    try {
      // Resend via SendGrid using the saved HTML
      const response = await sgMail.send({
        to: emailLog.to,
        from: emailLog.from,
        subject: emailLog.subject,
        html: emailLog.html,
        bcc: emailLog.bcc || 'hello@nmcore.com',
      });
      
      // Extract the message ID from the SendGrid response
      let messageId = null;
      if (response && response[0] && response[0].headers) {
        messageId = response[0].headers['x-message-id'];
      }
      
      console.log('SendGrid response:', response);
      console.log('Extracted message ID:', messageId);
      
      // Update the email log status
      await adminDb
        .collection('email_logs')
        .doc(id)
        .update({
          status: 'pending',
          sentAt: new Date(),
          provider: 'sendgrid',
          attempts: (emailLog.attempts || 0) + 1,
          lastResendAt: new Date(),
          messageId: messageId // Store the message ID for webhook matching
        });
      
      return json({ success: true, message: 'Email resent successfully' });
    } catch (err: any) {
      // Convert error to string safely regardless of error type
      const errorMessage = err instanceof Error ? err.message : String(err);
      const errorDetails = err instanceof Error 
        ? JSON.stringify({ 
            message: err.message, 
            name: err.name, 
            stack: err.stack 
          }) 
        : JSON.stringify(err);
      
      // Log failure
      await adminDb
        .collection('email_logs')
        .doc(id)
        .update({
          status: 'failed',
          errorMessage,
          errorDetails,
          lastAttemptAt: new Date(),
          attempts: (emailLog.attempts || 0) + 1
        });
      
      throw error(500, `Failed to resend email: ${errorMessage}`);
    }
  } catch (err: any) {
    console.error('Error resending email:', err);
    if (err.status && err.body) {
      throw err; // Re-throw SvelteKit errors
    }
    throw error(500, 'Failed to process resend request');
  }
};