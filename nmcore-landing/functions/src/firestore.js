// /functions/src/firestore.js
import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK if not already initialized
if (!getApps().length) {
  initializeApp();
}

const db = getFirestore();

// **Configure Firestore to Use Emulator If Running**
if (process.env.FIRESTORE_EMULATOR_HOST) {
  const [host, port] = process.env.FIRESTORE_EMULATOR_HOST.split(':');
  db.settings({
    host: `${host}:${port}`,
    ssl: false,
  });
  console.log(`Firestore Emulator detected at ${host}:${port}`);
}

export { db };
