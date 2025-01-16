//filepath: nmc-core-landing/vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite';
import dotenv from 'dotenv';
import { defineConfig } from 'vite';

// Ensure the correct environment file is loaded
const envFile = `.env.${process.env.NODE_ENV || 'production'}`;
dotenv.config({ path: envFile });

export default defineConfig({
    plugins: [sveltekit()],
    define: {
        'process.env': process.env, // Ensure environment variables are included in the build
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:5001', // Firebase Functions emulator
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '/nmcore-landing/us-central1/app') // Replace this with your function's URL structure
            }
        }
    },
    build: {
        rollupOptions: {
            external: ['firebase-functions'], // Exclude firebase-functions from the client-side bundle
        },
    },
});
