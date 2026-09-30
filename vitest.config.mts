import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    pool: 'vmThreads',
    setupFiles: ['./vitest.setup.ts'],
    // Playwright's own e2e/a11y specs live alongside the unit tests but use
    // @playwright/test's own test runner, not Vitest's — without this,
    // Vitest tries to collect them too and crashes (playwright-core isn't
    // meant to run inside Vitest's Node/jsdom worker).
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
      '**/e2e/**',
    ],
    env: {
      OPENAI_API_KEY: 'test-key',
    },
  },
});
