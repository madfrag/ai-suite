import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    // A production build, not `next dev` — dev mode's floating Dev Tools
    // overlay physically covers fixed/sticky controls (e.g. the chatbot's
    // sticky Send button), causing real but misleading click-actionability
    // failures. This also matches how the lighthouse CI job already tests.
    command: 'npm run build && npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? 'ci-placeholder',
      HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY ?? 'ci-placeholder',
      SUPABASE_URL: process.env.SUPABASE_URL ?? 'https://example.supabase.co',
      SUPABASE_PUBLISHABLE_KEY: process.env.SUPABASE_PUBLISHABLE_KEY ?? 'ci-placeholder',
    },
  },
});
