/// <reference types='vitest' />
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  cacheDir: '../../../node_modules/.vite/ts-rest-svelte-query',

  plugins: [svelte(), nxViteTsPaths()],

  // Uncomment this if you areing workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  build: {
    rollupOptions: {
      input: {
        index: 'libs/ts-rest/svelte-query/src/index.ts',
      }
    }
  },

  test: {
    globals: true,
    cache: {
      dir: '../../../node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
});
