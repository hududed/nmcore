import { sveltekit } from '@sveltejs/kit/vite';
import dotenv from 'dotenv';
import { defineConfig } from 'vite';

// Ensure the correct environment file is loaded
const envFile = `.env.${process.env.NODE_ENV || 'production'}`;
dotenv.config({ path: envFile });

// Debug loaded environment variables
// console.log('Loaded ENV:', process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH);

export default defineConfig({
    plugins: [sveltekit()],
    define: {
        'process.env': process.env, // Ensure environment variables are included in the build
    },
    build: {
        rollupOptions: {
            external: ['firebase-functions'], // Exclude firebase-functions from the client-side bundle
        },
    },
});