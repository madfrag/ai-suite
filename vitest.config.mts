import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  test: {
    projects: [
      {
        extends: true,
        // `server-only`'s guard isn't a browser/node check — it's a custom
        // "react-server" package export condition that only Next.js's own
        // bundler sets for the server-component module graph (see
        // node_modules/server-only/package.json). Outside that bundler
        // (Vitest included) it always resolves to the throwing index.js.
        // These tests exercise legitimately server-side code (API routes,
        // rate-limit logic) directly, not through Next's RSC pipeline, so
        // alias just this one package to its own no-op empty.js — safer
        // than changing global resolve conditions, which could also flip
        // other packages' conditional exports in ways we don't want here.
        resolve: {
          alias: {
            'server-only': path.resolve(import.meta.dirname, 'node_modules/server-only/empty.js'),
          },
        },
        test: {
          environment: 'jsdom',
          pool: 'vmThreads',
          setupFiles: ['./vitest.setup.ts'],
          exclude: [
            '**/node_modules/**',
            '**/dist/**',
            '**/.{idea,git,cache,output,temp}/**',
            '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
            '**/e2e/**',
            '**/e2e-visual/**',
          ],
          env: {
            OPENAI_API_KEY: 'test-key',
          },
        },
      },
      {
        extends: true,
        plugins: [
          // Runs every *.stories.tsx as a test, including its a11y checks
          // (preview.tsx sets a11y.test = 'error') — this is what caught the
          // Switch stories missing an aria-label before it became a real bug.
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(import.meta.dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
