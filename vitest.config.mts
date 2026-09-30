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
