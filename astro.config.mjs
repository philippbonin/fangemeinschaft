import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
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
      // Copy docs to output directory
      rollupOptions: {
        input: {
          main: 'src/pages/index.astro',
          docs: 'src/docs/**/*.md'
        }
      }
    }
  }
});