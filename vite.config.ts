import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

/**
 * Shared Vite and Vitest configuration.
 *
 * Vite builds and serves the React app. Vitest reuses the same config file so
 * tests can run in a browser-like jsdom environment.
 */
export default defineConfig({
  /** Enables React Fast Refresh during development and JSX transformation. */
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        /**
         * Stable asset names make the small handcrafted service worker easier to
         * understand because it can cache known paths.
         */
        assetFileNames: 'assets/[name][extname]',
        chunkFileNames: 'assets/[name].js',
        entryFileNames: 'assets/[name].js'
      }
    }
  },
  test: {
    /** jsdom provides DOM APIs such as localStorage for component tests. */
    environment: 'jsdom',

    /** Allows using describe/it/expect without importing them in every file. */
    globals: true,

    /** Loads jest-dom matchers such as toBeInTheDocument. */
    setupFiles: './src/test/setup.ts',

    /** Lets Vitest process imported CSS from React components. */
    css: true
  }
});
