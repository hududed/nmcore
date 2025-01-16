//filepath: /nmc-core-landing/src/lib/firebase-admin.ts
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';

// Load service account key file
const serviceAccountKeyPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH;

if (!serviceAccountKeyPath) {
  throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_KEY_PATH environment variable');
}

const serviceAccount = JSON.parse(readFileSync(serviceAccountKeyPath, 'utf8'));

// Initialize Firebase Admin SDK
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

export const adminDb = getFirestore();
