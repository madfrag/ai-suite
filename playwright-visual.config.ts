import { defineConfig, devices } from '@playwright/test';

// Separate from playwright.config.ts on purpose: this suite screenshots a
// built Storybook (storybook-static/), a completely different server/target
// than the Next.js app the main e2e suite drives, so it gets its own
// webServer and its own baseline-image directory.
export default defineConfig({
  testDir: './e2e-visual',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never', outputFolder: 'playwright-visual-report' }]]
    : 'list',
  snapshotPathTemplate: '{testDir}/__screenshots__/{arg}{ext}',
  use: {
    baseURL: 'http://localhost:6007',
    trace: 'on-first-retry',
  },
  expect: {
    toHaveScreenshot: {
      // Storybook renders stories inside an iframe with animated/transient UI
      // (e.g. the SummarizeButton's spinner) — a small pixel-diff threshold
      // absorbs anti-aliasing noise without masking real visual regressions.
      maxDiffPixelRatio: 0.01,
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    // Not `serve` — its default "clean URLs" behavior 301-redirects
    // /iframe.html to /iframe and drops the query string in the process,
    // silently discarding which story to render (every screenshot ends up
    // being Storybook's own "No Preview" error page). Verified by hand
    // before switching: http-server serves the file as-is, no rewriting.
    command: 'npx http-server storybook-static -p 6007 -c-1',
    url: 'http://localhost:6007',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
