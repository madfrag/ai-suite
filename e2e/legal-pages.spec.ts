import { test, expect } from '@playwright/test';

for (const [route, germanH1, englishH2] of [
  ['/impressum', 'Impressum', 'Legal Notice'],
  ['/datenschutz', 'Datenschutzerklärung', 'Privacy Policy'],
] as const) {
  test.describe(`${route} — bilingual`, () => {
    test('German and English blocks carry the right lang attributes', async ({ page }) => {
      await page.goto(route);
      await expect(page.locator('main [lang="de"]').first()).toContainText(germanH1);
      await expect(page.locator('#english')).toHaveAttribute('lang', 'en');
      await expect(page.locator('#english').getByRole('heading', { level: 2 })).toHaveText(
        englishH2
      );
    });

    test('"English version below" jumps to the English section, and back', async ({ page }) => {
      await page.goto(route);
      await page.getByRole('link', { name: /English version below/ }).click();
      await expect(page).toHaveURL(new RegExp(`${route}#english$`));

      const heading = page.locator('#english').getByRole('heading', { level: 2 });
      await expect(heading).toBeInViewport();
      // scroll-mt-16 keeps the heading clear of the fixed 3rem header.
      const top = await heading.evaluate((el) => el.getBoundingClientRect().top);
      expect(top).toBeGreaterThanOrEqual(48);

      await page.getByRole('link', { name: 'Zur deutschen Fassung' }).click();
      await expect(page.getByRole('heading', { level: 1 })).toBeInViewport();
    });
  });
}
