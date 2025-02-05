//filepath: nmcore-landing/svelte.config.js
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import dotenv from 'dotenv';

// Load environment variables from the correct .env file
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envFile });

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),

    kit: {
      adapter: adapter({
          out: "functions/build",
      }),
      csrf: {
        checkOrigin: false,
      }
    }
};

export default config;