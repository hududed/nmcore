//filepath: /functions/src/index.js
import { installPolyfills } from '@sveltejs/kit/node/polyfills';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import crypto from 'crypto';
import express from 'express';
import { getAuth } from 'firebase-admin/auth';
import { defineSecret } from 'firebase-functions/params';
import { onRequest } from 'firebase-functions/v2/https';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { Server } from '../server/index.js';
import { manifest, prerendered } from '../server/manifest.js';
import { createCloudinaryHandler } from './api-handlers/cloudinary.js';
import { db } from './firestore.js';

installPolyfills();

// Define Cloudinary secrets
const CLOUDINARY_API_SECRET = defineSecret('CLOUDINARY_API_SECRET');
const CLOUDINARY_API_KEY = defineSecret('CLOUDINARY_API_KEY');
const CLOUDINARY_CLOUD_NAME = defineSecret('CLOUDINARY_CLOUD_NAME');

// Helper function to convert Express request to SvelteKit request
function toSvelteKitRequest(request) {
  const protocol = request.headers['x-forwarded-proto'] || 'http';
  const host = `${protocol}://${request.headers['x-forwarded-host']}`;
  const { href } = new URL(request.url || '', host);
  return new Request(href, {
    method: request.method,
    headers: toSvelteKitHeaders(request.headers),
    body: request.rawBody ? request.rawBody : null,
  });
}

// Helper function to convert headers
function toSvelteKitHeaders(headers) {
  const finalHeaders = {};

  for (const [key, value] of Object.entries(headers)) {
    if (value) {
      finalHeaders[key] = Array.isArray(value) ? value.join(',') : value;
    }
  }

  return new Headers(finalHeaders);
}

// Create an Express app
const expressApp = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

expressApp.use(cors({ origin: true }));
expressApp.use(express.json()); // Parse JSON body
expressApp.use(cookieParser()); 

expressApp.use(express.static(join(__dirname, '../static'))); // Add this line

// Serve pre-rendered HTML files
expressApp.use(express.static(join(__dirname, '../prerendered')));

// Serve client-side assets
expressApp.use(express.static(join(__dirname, '../client')));

// Add this standalone login route
expressApp.get('/login', (req, res) => {
  console.log(`Serving standalone login page`);
  
  return res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>NMCore Admin Login</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/webp" href="/favicon.webp" />
        <!-- Add Tailwind via CDN for styling -->
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-zinc-100">
        <div class="flex min-h-screen items-center justify-center">
          <div class="w-full max-w-md">
            <div class="bg-white p-8 rounded-lg shadow-md">
              <div class="text-center mb-6">
                <img src="/images/nmcore_logo_onwhite.png" alt="NMCore Logo" class="w-48 mx-auto mb-6">
                <h1 class="text-2xl font-bold mb-2">Admin Login</h1>
                <p class="text-zinc-500">Sign in to access the admin dashboard</p>
              </div>
              <form id="loginForm" class="space-y-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" id="email" name="email" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Password</label>
                  <input type="password" id="password" name="password" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                  <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#39B54A] hover:bg-[#2d9d3c] focus:outline-none">
                    Sign In
                  </button>
                </div>
                <div id="errorMessage" class="text-red-500 text-sm hidden text-center"></div>
              </form>
            </div>
          </div>
        </div>
        
        <script type="module">
          // Import Firebase modules from CDN
          import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js';
          import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js';
          
          // Replace this block in your login page HTML
          const firebaseConfig = {
            apiKey: "AIzaSyBNp3ux3xXp6J_MKTtBvGjw0JKMDmujfa8",
            authDomain: "nanogrowtech-staging.firebaseapp.com",
            projectId: "nanogrowtech-staging",
            storageBucket: "nanogrowtech-staging.firebasestorage.app",
            messagingSenderId: "829337404329",
            appId: "1:829337404329:web:ce36a20b404a497a047ab8",
            measurementId: "G-MQ6L4CVH5F"
          };
          
          const app = initializeApp(firebaseConfig);
          const auth = getAuth(app);
          
          // Handle form submission
          document.getElementById('loginForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorElement = document.getElementById('errorMessage');
            const submitButton = this.querySelector('button[type="submit"]');
            
            try {
              // Reset error state
              errorElement.classList.add('hidden');
              submitButton.disabled = true;
              submitButton.textContent = 'Signing in...';
              
              // Sign in with Firebase
              const userCredential = await signInWithEmailAndPassword(auth, email, password);
              
              // Get ID token
              const token = await userCredential.user.getIdToken();
              
              // Send token to backend to create session cookie
              const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token })
              });
              
              const data = await response.json();
              
              if (data.success) {
                // Get redirect URL from query params or use default
                const params = new URLSearchParams(window.location.search);
                const redirectTo = params.get('redirectTo') || '/admin';
                window.location.href = redirectTo;
              } else {
                errorElement.textContent = data.message || 'Authentication failed';
                errorElement.classList.remove('hidden');
                submitButton.disabled = false;
                submitButton.textContent = 'Sign In';
              }
            } catch (error) {
              console.error('Login error:', error);
              errorElement.textContent = error.message || 'Authentication failed';
              errorElement.classList.remove('hidden');
              submitButton.disabled = false;
              submitButton.textContent = 'Sign In';
            }
          });
        </script>
      </body>
    </html>
  `);
});

// Update your /admin route handler
expressApp.get('/admin', (req, res) => {
  // Only handle the admin routes if the user is authenticated
  const sessionCookie = req.cookies?.__session;
  
  if (!sessionCookie) {
    return res.redirect('/login?redirectTo=/admin');
  }
  
  getAuth().verifySessionCookie(sessionCookie, true)
    .then(() => {
      // Send the complete admin dashboard HTML
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>NMCore Admin</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width,initial-scale=1">
            <link rel="icon" type="image/webp" href="/favicon.webp" />
            <script src="https://cdn.tailwindcss.com"></script>
          </head>
          <body>
            <div id="app">
              <div class="flex min-h-screen items-center justify-center p-6">
                <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl">
                  <h1 class="text-2xl font-bold mb-6 text-center">NMCore Admin Dashboard</h1>
                  
                  <div class="mb-6" id="userInfo">
                    <p class="text-center text-gray-600">Loading user information...</p>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a href="/admin/products" class="block bg-gray-50 hover:bg-gray-100 p-4 rounded-lg border border-gray-200">
                      <h3 class="font-medium text-lg">Products</h3>
                      <p class="text-gray-600">Manage product catalog</p>
                    </a>
                    <a href="/admin/users" class="block bg-gray-50 hover:bg-gray-100 p-4 rounded-lg border border-gray-200">
                      <h3 class="font-medium text-lg">Users</h3>
                      <p class="text-gray-600">Manage system users</p>
                    </a>
                    <a href="/admin/email-logs" class="block bg-gray-50 hover:bg-gray-100 p-4 rounded-lg border border-gray-200">
                      <h3 class="font-medium text-lg">Email Logs</h3>
                      <p class="text-gray-600">Monitor and resend emails</p>
                    </a>
                    <a href="/admin/settings" class="block bg-gray-50 hover:bg-gray-100 p-4 rounded-lg border border-gray-200">
                      <h3 class="font-medium text-lg">Settings</h3>
                      <p class="text-gray-600">System configuration</p>
                    </a>
                  </div>
                  
                  <div class="mt-6 flex justify-end">
                    <button id="logoutBtn" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <script>
              // Load user info on page load
              fetch('/api/auth/verify')
                .then(response => response.json())
                .then(data => {
                  if (data.authenticated) {
                    // User is authenticated, show user information
                    const userInfo = document.getElementById('userInfo');
                    userInfo.innerHTML = \`
                      <div class="text-center">
                        <p class="font-medium">\${data.user.email}</p>
                        <p class="text-gray-600 text-sm">User ID: \${data.user.uid}</p>
                      </div>
                    \`;
                    
                    // Set up logout button
                    document.getElementById('logoutBtn').addEventListener('click', async () => {
                      await fetch('/api/logout', { method: 'POST' });
                      window.location.href = '/login';
                    });
                  } else {
                    // Not authenticated, redirect to login
                    window.location.href = '/login?redirectTo=/admin';
                  }
                })
                .catch((error) => {
                  console.error('Error checking authentication:', error);
                  const userInfo = document.getElementById('userInfo');
                  userInfo.innerHTML = '<p class="text-red-500 text-center">Error loading user information</p>';
                });
            </script>
          </body>
        </html>
      `);
    })
    .catch(() => {
      return res.redirect('/login?redirectTo=/admin');
    });
});

// Update the /admin/* route handler to bypass specific admin routes
expressApp.get('/admin/*', (req, res, next) => {
  console.log(`Admin route accessed: ${req.url}`);
  
  // List of admin paths that should be handled by SvelteKit
  const svelteKitAdminRoutes = [
    '/admin/email-logs',
    '/admin/email-logs/'
  ];
  
  // Check if this is a path that should be handled by SvelteKit
  if (req.path.startsWith('/admin/email-logs')) {
    console.log(`Passing ${req.url} to SvelteKit`);
    return next(); // Skip to SvelteKit handler
  }
  
  // First, check authentication
  const sessionCookie = req.cookies?.__session;
  
  if (!sessionCookie) {
    return res.redirect('/login?redirectTo=' + encodeURIComponent(req.url));
  }
  
  // Verify session cookie
  getAuth().verifySessionCookie(sessionCookie, true)
    .then(() => {
      // User is authenticated, serve the admin page
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>NMCore Admin</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width,initial-scale=1">
            <link rel="icon" type="image/webp" href="/favicon.webp" />
            <script src="https://cdn.tailwindcss.com"></script>
          </head>
          <body>
            <div id="app">
              <div class="flex min-h-screen items-center justify-center p-6">
                <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl">
                  <h1 class="text-2xl font-bold mb-6 text-center">NMCore Admin Dashboard</h1>
                  
                  <div class="mb-6" id="userInfo">
                    <p class="text-center text-gray-600">Loading user information...</p>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a href="/admin/products" class="block bg-gray-50 hover:bg-gray-100 p-4 rounded-lg border border-gray-200">
                      <h3 class="font-medium text-lg">Products</h3>
                      <p class="text-gray-600">Manage product catalog</p>
                    </a>
                    <a href="/admin/users" class="block bg-gray-50 hover:bg-gray-100 p-4 rounded-lg border border-gray-200">
                      <h3 class="font-medium text-lg">Users</h3>
                      <p class="text-gray-600">Manage system users</p>
                    </a>
                    <a href="/admin/email-logs" class="block bg-gray-50 hover:bg-gray-100 p-4 rounded-lg border border-gray-200">
                      <h3 class="font-medium text-lg">Email Logs</h3>
                      <p class="text-gray-600">Monitor and resend emails</p>
                    </a>
                    <a href="/admin/settings" class="block bg-gray-50 hover:bg-gray-100 p-4 rounded-lg border border-gray-200">
                      <h3 class="font-medium text-lg">Settings</h3>
                      <p class="text-gray-600">System configuration</p>
                    </a>
                  </div>
                  
                  <div class="mt-6 flex justify-end">
                    <button id="logoutBtn" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <script>
              // Load user info on page load
              fetch('/api/auth/verify')
                .then(response => response.json())
                .then(data => {
                  if (data.authenticated) {
                    // User is authenticated, show user information
                    const userInfo = document.getElementById('userInfo');
                    userInfo.innerHTML = \`
                      <div class="text-center">
                        <p class="font-medium">\${data.user.email}</p>
                        <p class="text-gray-600 text-sm">User ID: \${data.user.uid}</p>
                      </div>
                    \`;
                    
                    // Set up logout button
                    document.getElementById('logoutBtn').addEventListener('click', async () => {
                      await fetch('/api/logout', { method: 'POST' });
                      window.location.href = '/login';
                    });
                  }
                })
                .catch((error) => {
                  console.error('Error checking authentication:', error);
                  const userInfo = document.getElementById('userInfo');
                  userInfo.innerHTML = '<p class="text-red-500 text-center">Error loading user information</p>';
                });
            </script>
          </body>
        </html>
      `);
    })
    .catch(() => {
      return res.redirect('/login?redirectTo=' + encodeURIComponent(req.url));
    });
});

// Define /api/cloudinary route
expressApp.post('/api/cloudinary', async (req, res) => {
  try {
    const cloudinaryHandler = createCloudinaryHandler({
      cloudName: CLOUDINARY_CLOUD_NAME.value(),
      apiKey: CLOUDINARY_API_KEY.value(),
      apiSecret: CLOUDINARY_API_SECRET.value(),
    });

    return cloudinaryHandler(req, res);
  } catch (err) {
    console.error('Error in /api/cloudinary route:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Define /api/products route (get all products)
expressApp.get('/api/products', async (req, res) => {
  console.log('[DEBUG] Route hit: /api/products');
  try {
    const productsSnapshot = await db.collection('products').get();
    
    if (productsSnapshot.empty) {
      console.log('[DEBUG] No products found');
      return res.status(404).json({ message: 'No products found' });
    }

    const products = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    // console.log('[DEBUG] Products fetched:', products);

    return res.status(200).json(products);
  } catch (err) {
    console.error('[DEBUG] Error fetching products:', err);
    return res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// 1. Login endpoint to create session cookie
expressApp.post('/api/login', async (req, res) => {
  console.log('Login endpoint accessed');
  const { token } = req.body;
  
  if (!token) {
    console.error('No token provided');
    return res.status(400).json({ success: false, message: 'No token provided' });
  }
  
  try {
    // Verify the ID token
    const decodedToken = await getAuth().verifyIdToken(token);
    
    // Create a session cookie
    const expiresIn = 60 * 60 * 24 * 14 * 1000; // 2 weeks
    const sessionCookie = await getAuth().createSessionCookie(token, { expiresIn });
    
    // Set the cookie
    const options = {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    };
    
    res.cookie('__session', sessionCookie, options);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error creating session:', error);
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

// 2. Logout endpoint
expressApp.post('/api/logout', (req, res) => {
  res.clearCookie('__session');
  return res.status(200).json({ success: true });
});

// 3. Verify authentication endpoint
expressApp.get('/api/auth/verify', async (req, res) => {
  const sessionCookie = req.cookies?.__session;
  
  if (!sessionCookie) {
    return res.status(200).json({ authenticated: false });
  }
  
  try {
    const decodedClaims = await getAuth().verifySessionCookie(sessionCookie, true);
    return res.status(200).json({ 
      authenticated: true,
      user: {
        uid: decodedClaims.uid,
        email: decodedClaims.email,
        emailVerified: decodedClaims.email_verified,
      } 
    });
  } catch (error) {
    console.error('Error verifying session:', error);
    return res.status(200).json({ authenticated: false });
  }
});

// Endpoint to manually update email log status
expressApp.post('/api/email-logs/:id/status', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['sent', 'failed', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be sent, failed, or pending' });
    }
    
    // Get the current document
    const doc = await db.collection('email_logs').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Email log not found' });
    }
    
    // Prepare update data
    const updateData = {
      status,
      updatedAt: new Date(),
      manuallyUpdated: true
    };
    
    // Add status-specific fields
    if (status === 'sent') {
      updateData.deliveredAt = new Date();
    } else if (status === 'failed') {
      updateData.failedAt = new Date();
      updateData.failureReason = 'Manually marked as failed';
    }
    
    // Update the document
    await db.collection('email_logs').doc(id).update(updateData);
    
    return res.json({ 
      success: true, 
      message: `Email status updated to ${status}` 
    });
  } catch (error) {
    console.error('Error updating email status:', error);
    return res.status(500).json({ error: 'Failed to update status' });
  }
});


// Add SendGrid webhook handler to update email status
expressApp.post('/api/webhooks/sendgrid', express.raw({type: 'application/json'}), async (req, res) => {
  try {
    // Verify webhook signature if webhook key is provided
    const signature = req.headers['x-twilio-email-event-webhook-signature'];
    const timestamp = req.headers['x-twilio-email-event-webhook-timestamp'];
    const webhookKey = process.env.SENDGRID_WEBHOOK_KEY;
    
    // Parse the raw body
    const payload = JSON.parse(req.body.toString());
    
    if (webhookKey) {
      if (!signature || !timestamp) {
        console.error('Missing signature or timestamp headers');
        return res.status(401).send('Invalid signature headers');
      }
      
      try {
        const hmac = crypto.createHmac('sha256', webhookKey);
        const digest = hmac.update(timestamp + JSON.stringify(payload)).digest('hex');
        
        if (signature !== digest) {
          console.error('Invalid webhook signature');
          return res.status(401).send('Invalid signature');
        }
      } catch (error) {
        console.error('Error verifying signature:', error);
        return res.status(500).send('Error verifying signature');
      }
    }
    
    console.log('Received SendGrid webhook', payload);
    
    // SendGrid sends an array of events
    const events = payload;
    
    for (const event of events) {
      // Extract message ID (this will be in your email_logs document)
      const messageId = event.sg_message_id;
      if (!messageId) {
        console.log('No message ID found in event:', event);
        continue;
      }
      
      // Map SendGrid event types to your status values
      let status = null;
      switch (event.event) {
        case 'delivered':
          status = 'sent';
          break;
        case 'bounce':
        case 'dropped':
          status = 'failed';
          break;
        case 'processed':
        case 'deferred':
          status = 'pending';
          break;
        default:
          // For other event types like 'open', 'click', etc.
          // We don't change the status but still log the event
          console.log(`Received event type: ${event.event} for message: ${messageId}`);
          continue;
      }
      
      if (!status) continue;
      
      // Find the email log by message ID
      const snapshot = await db.collection('email_logs')
        .where('messageId', '==', messageId)
        .get();
        
      if (snapshot.empty) {
        console.log(`No email log found for message ID: ${messageId}`);
        continue;
      }
      
      // Update the status and add event information
      const docId = snapshot.docs[0].id;
      const docData = snapshot.docs[0].data();
      
      // Prepare update payload
      const updateData = {
        status: status,
        updatedAt: new Date()
      };
      
      // Add specific fields based on event type
      if (event.event === 'delivered') {
        updateData.deliveredAt = new Date();
      } else if (event.event === 'bounce' || event.event === 'dropped') {
        updateData.failedAt = new Date();
        updateData.failureReason = event.reason || event.status;
      }
      
      // Track all events in an array
      const events = docData.events || [];
      events.push({
        type: event.event,
        timestamp: new Date(),
        details: event
      });
      updateData.events = events;
      
      // Update the document
      await db.collection('email_logs').doc(docId).update(updateData);
      
      console.log(`Updated email log ${docId} to status: ${status} based on event: ${event.event}`);
    }
    
    res.status(200).send('Webhook processed successfully');
  } catch (error) {
    console.error('Error processing SendGrid webhook:', error);
    res.status(500).send('Error processing webhook');
  }
});


// Optional: Add middleware to protect admin routes
function requireAuth(req, res, next) {
  const sessionCookie = req.cookies?.__session;
  
  if (!sessionCookie) {
    return res.redirect('/login');
  }

  getAuth().verifySessionCookie(sessionCookie, true)
    .then(() => {
      next();
    })
    .catch(() => {
      res.redirect('/login');
    });
}


// Middleware to handle SvelteKit requests - for all routes not handled above
async function handleSvelteKitRequest(req, res, next) {
  console.log(`Processing with SvelteKit: ${req.url}`);

  // Skip directly to next middleware if this is a prerendered route
  if (prerendered.has(req.url)) {
    console.log(`Prerendered route found for ${req.url}`);
    return next();
  }

  const server = new Server(manifest);
  await server.init({ env: process.env });
  
  const sveltekitRequest = toSvelteKitRequest(req);

  try {
    const rendered = await server.respond(sveltekitRequest);
    
    if (!rendered) {
      console.log(`SvelteKit returned no response for ${req.url}`);
      return res.writeHead(404, 'Not Found').end();
    }
    
    /** @type {ArrayBuffer} */
    const body = await rendered.arrayBuffer();
    return res
      .writeHead(rendered.status, Object.fromEntries(rendered.headers))
      .end(Buffer.from(body));
  } catch (error) {
    console.error(`Error handling ${req.url}:`, error);
    return res.writeHead(500, 'Internal Server Error').end();
  }
}

// Handle all other routes with SvelteKit
expressApp.use(handleSvelteKitRequest);

// Export the Express app as a Cloud Function
export const app = onRequest(
  {
    secrets: [
      CLOUDINARY_API_SECRET,
      CLOUDINARY_API_KEY,
      CLOUDINARY_CLOUD_NAME,
    ],
    region: 'us-west1'
  },
  expressApp
);