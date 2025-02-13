import { defineConfig } from 'astro/config';
import 'dotenv/config'; // Load .env variables
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  server: {
    host: true,
    port: process.env.APP_PORT || 3000
  },
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [
    tailwind(),
    react({
      include: ['**/react/*'],
      experimentalReactChildren: true
    })
  ],
  vite: {
    define: {
      'process.env.BUILD_TIMESTAMP': JSON.stringify(process.env.BUILD_TIMESTAMP)
    },
    build: {
      rollupOptions: {
        input: {
          main: 'src/pages/index.astro',
          docs: 'src/docs/**/*.md'
        }
      }
    }
  }
});
