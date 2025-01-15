//filepath: nmcore-landing/svelte.config.js
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import dotenv from 'dotenv';

// Load environment variables based on NODE_ENV
const envFile =
  process.env.NODE_ENV === 'production'
    ? '.env.production'
    : process.env.NODE_ENV === 'staging'
    ? '.env.staging'
    : '.env';

dotenv.config({ path: envFile });

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),

    kit: {
        adapter: adapter({
            // out: 'build',
            pages: 'build',
            assets: 'build',
            fallback: 'index.html',
            precompress: false,
            strict: true
        }),
        paths: {
        base: '', // If hosted under a subpath, set it (e.g., '/staging')
        assets: '', // Prefix for asset paths
        relative: true, // Use relative paths
        },
        prerender: {
            entries: ['*'], // Ensure all routes are prerendered
        },
    }
};

export default config;