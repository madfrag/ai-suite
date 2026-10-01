import { test, expect } from '@playwright/test';

const STORAGE_KEY = 'ai-suite-consent';

for (const route of ['/summarizer', '/chatbot']) {
  test.describe(`consent gate — ${route}`, () => {
    test('asks first, and sets no session before the visitor agrees', async ({ page }) => {
      const sessionRequests: string[] = [];
      page.on('request', (req) => {
        if (req.url().includes('/api/auth/anonymous')) sessionRequests.push(req.url());
      });
      await page.route('**/api/auth/anonymous', (r) =>
        r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' })
      );
      await page.route('**/api/chat/history*', (r) =>
        r.fulfill({ status: 200, contentType: 'application/json', body: '{"messages":[]}' })
      );

      await page.goto(route, { waitUntil: 'networkidle' });
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      await expect(dialog.getByRole('link', { name: /privacy policy/i })).toHaveAttribute(
        'href',
        '/datenschutz#english'
      );
      expect(sessionRequests).toHaveLength(0);

      // Not dismissible without choosing.
      await page.keyboard.press('Escape');
      await expect(dialog).toBeVisible();

      await dialog.getByRole('button', { name: /agree/i }).click();
      await expect(dialog).toBeHidden();
      expect(sessionRequests).toHaveLength(1);

      // Remembered on reload.
      await page.reload({ waitUntil: 'networkidle' });
      await expect(page.getByRole('dialog')).toHaveCount(0);
    });

    test('declining returns home and stores nothing', async ({ page }) => {
      await page.goto(route);
      await page.getByRole('button', { name: /decline/i }).click();
      await expect(page).toHaveURL('/');
      expect(await page.evaluate((k) => localStorage.getItem(k), STORAGE_KEY)).toBeNull();
    });
  });
}

test('the home page sets no session cookie', async ({ page, context }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  const names = (await context.cookies()).map((c) => c.name);
  expect(names.filter((n) => n.startsWith('sb-'))).toEqual([]);
});
