// filepath: /Users/hfox/Developments/nmcore/nmcore-landing/functions/src/index.ts
import { initializeApp } from 'firebase-admin/app';

initializeApp();

// export { sendEmail } from './sendEmail';
export { stripeWebhook } from './stripeWebhook';

