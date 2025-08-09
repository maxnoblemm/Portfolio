import path from 'path';
// vite.config.ts
import { defineConfig, loadEnv } from 'vite';
import path from 'node:path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    // 👇 set to your repo name (for https://username.github.io/interactive-portfolio/)
    base: '/interactive-portfolio/',

    build: {
      outDir: 'docs', // GitHub Pages → Settings → Pages → main /docs
    },

    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
