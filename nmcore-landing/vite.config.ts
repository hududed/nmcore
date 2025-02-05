//filepath: nmcore-landing/vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite';
import dotenv from 'dotenv';
import { defineConfig } from 'vite';

// Ensure the correct environment file is loaded
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envFile });

export default defineConfig({
    plugins: [sveltekit()],
    define: {
        'process.env': process.env, // Ensure environment variables are included in the build
    },
    // build: {
    //     rollupOptions: {
    //         input: {
    //             main: resolve(__dirname, 'functions/src/index.js'),
    //             cloudinary: resolve(__dirname, 'functions/src/api-handlers/cloudinary.js'),
    //             stripeWebhookHandler: resolve(__dirname, 'functions/src/stripeWebhookHandler.js')
    //         },
    //         output: {
    //             dir: resolve(__dirname, 'functions/build'),
    //             format: 'esm'
    //         }
    //     }
    // }
});
