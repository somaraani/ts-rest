import path from 'path';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  server: {
    port: 5006,
  },
  build: {
    outDir: '../../../dist/apps/example-microservice/web-app-svelte',
    target: 'esnext',
  },
  resolve: {
    alias: {
      '@ts-rest/core': path.resolve(
        __dirname,
        '../../../libs/ts-rest/core/src/index.ts'
      ),
      '@ts-rest/svelte-query': path.resolve(
        __dirname,
        '../../../libs/ts-rest/svelte-query/src/index.ts'
      ),
      '@ts-rest/example-microservice/util-posts-api': path.resolve(
        __dirname,
        '../../../libs/example-microservice/util-posts-api/src/index.ts'
      ),
      '@ts-rest/example-contracts': path.resolve(
        __dirname,
        '../../../libs/example-contracts/src/index.ts'
      ),
    },
  },
});
