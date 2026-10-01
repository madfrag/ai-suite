import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const ROUTES = ['/', '/summarizer', '/chatbot', '/about', '/impressum', '/datenschutz'];
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

// Theme here is our app's own cookie-driven `.dark` class, not the OS
// `prefers-color-scheme` — the app ignores that media query entirely.
for (const theme of ['light', 'dark'] as const) {
  test.describe(`axe scan — ${theme} theme`, () => {
    for (const route of ROUTES) {
      test(`${route || '/'} has no WCAG 2.1 AA violations`, async ({ page, context }, testInfo) => {
        // Scan the tool pages themselves, not the consent gate (scanned below).
        await page.addInitScript(() => {
          window.localStorage.setItem('ai-suite-consent', JSON.stringify({ v: 1 }));
        });

        if (theme === 'dark') {
          await context.addCookies([
            { name: 'theme', value: 'dark', url: 'http://localhost:3000' },
          ]);
        }

        await page.goto(route, { waitUntil: 'networkidle' });
        // For dynamic routes, Next can briefly swap the <head> metadata
        // (including <title>) during hydration, which axe's document-title
        // check can catch mid-race. Title is always set once hydration
        // settles (inherited from the root layout at minimum), but the
        // value isn't monotonic during the swap, so confirm it twice.
        await page.waitForFunction(() => document.title.length > 0);
        await page.waitForTimeout(150);
        await page.waitForFunction(() => document.title.length > 0);

        if (route === '/about') {
          // The hero fades its text in via GSAP (opacity 0 -> 1, ~1s). Scanning
          // mid-fade makes axe read a semi-transparent color as low-contrast —
          // a real pixel at that instant, but not a contrast bug: text content
          // is already in the a11y tree regardless of visual opacity, and the
          // steady-state (post-animation) color is what WCAG conformance
          // actually turns on. Wait for the fade to settle before scanning.
          await page.waitForFunction(() =>
            Array.from(document.querySelectorAll('.hero-text')).every(
              (el) => parseFloat(getComputedStyle(el).opacity) > 0.99
            )
          );
        }

        const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

        // Attached on every run (pass or fail) so the CI artifact is a full
        // WCAG 2.1 AA conformance report, not just a record of failures.
        await testInfo.attach(`axe-results-${theme}-${route.replace(/\//g, '') || 'home'}`, {
          body: JSON.stringify(
            {
              url: results.url,
              violations: results.violations,
              passes: results.passes.map((p) => ({ id: p.id, description: p.description })),
              incomplete: results.incomplete,
            },
            null,
            2
          ),
          contentType: 'application/json',
        });

        expect(results.violations, formatViolations(results.violations)).toEqual([]);
      });
    }
  });
}

test.describe('consent dialog', () => {
  test('has no WCAG 2.1 AA violations while open', async ({ page }) => {
    await page.goto('/summarizer', { waitUntil: 'networkidle' });
    await expect(page.getByRole('dialog')).toBeVisible();

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
    expect(results.violations, formatViolations(results.violations)).toEqual([]);
  });
});

test.describe('consent dialog — updated-policy notice', () => {
  test('has no WCAG 2.1 AA violations with the notice shown', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('ai-suite-consent', JSON.stringify({ v: 0 }));
    });
    await page.goto('/summarizer', { waitUntil: 'networkidle' });
    await expect(page.getByRole('note')).toBeVisible();

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
    expect(results.violations, formatViolations(results.violations)).toEqual([]);
  });
});

test.describe('keyboard navigation', () => {
  test('skip link becomes visible on focus and moves focus to main content', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skipLink = page.getByRole('link', { name: 'Skip to main content' });
    await expect(skipLink).toBeFocused();

    await page.keyboard.press('Enter');
    // #main-content has tabIndex={-1} specifically so the skip link moves
    // keyboard focus there (not just scroll position) — see WCAG technique G1.
    await expect(page.locator('#main-content')).toBeFocused();
  });

  test('dialog opens and closes via keyboard, returning focus to the trigger', async ({ page }) => {
    await page.goto('/');
    const trigger = page.getByRole('button', { name: 'How it works' }).first();
    await trigger.focus();
    await page.keyboard.press('Enter');

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('theme toggle is operable via keyboard and reports pressed state', async ({ page }) => {
    await page.goto('/');
    const toggle = page.getByRole('button', { name: /Switch to (dark|light) theme/ });
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');

    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  });
});

function formatViolations(violations: import('axe-core').Result[]): string {
  if (violations.length === 0) return '';
  return violations
    .map((v) => {
      const targets = v.nodes.map((n) => `    - ${n.target.join(' ')}`).join('\n');
      return `[${v.impact}] ${v.id}: ${v.description}\n${targets}`;
    })
    .join('\n\n');
}
