import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';

// storybook-static/index.json is Storybook's own build manifest — reading it
// (rather than hand-listing story IDs here) means every *.stories.tsx file
// automatically gets a screenshot test with no extra wiring, and a story
// that's renamed/removed can't leave a stale, silently-skipped test behind.
type StorybookIndex = {
  entries: Record<string, { type: string; id: string; title: string; name: string }>;
};

let stories: { id: string; title: string; name: string }[] = [];
try {
  const index: StorybookIndex = JSON.parse(readFileSync('storybook-static/index.json', 'utf8'));
  stories = Object.values(index.entries)
    .filter((entry) => entry.type === 'story')
    .map(({ id, title, name }) => ({ id, title, name }));
} catch {
  // Left empty on purpose (rather than throwing here): a missing/unbuilt
  // storybook-static/ should fail loudly as a real test below, not as an
  // opaque error during Playwright's test-collection phase.
}

test.describe('storybook visual regression', () => {
  test('storybook-static/index.json exists and lists at least one story', () => {
    expect(
      stories.length,
      'No stories found — did `npm run build-storybook` run before this suite?'
    ).toBeGreaterThan(0);
  });

  for (const theme of ['light', 'dark'] as const) {
    for (const story of stories) {
      test(`${theme}: ${story.title} — ${story.name}`, async ({ page }) => {
        await page.goto(`/iframe.html?id=${story.id}&viewMode=story&globals=theme:${theme}`);
        const root = page.locator('#storybook-root');
        await root.waitFor({ state: 'attached' });
        // Let any entrance transition/animation settle before the pixel diff.
        await page.waitForTimeout(300);

        // Screenshot the component's own bounding box, not the full page:
        // these components render small against a mostly-empty viewport, so
        // a full-page screenshot with any nonzero maxDiffPixelRatio lets a
        // real, visible color change hide under the ratio (verified this the
        // hard way — a full-page shot at 1% tolerance let a switch's entire
        // track color change from orange to green pass silently, since 1% of
        // 1280x720 pixels dwarfs the ~150px the switch actually occupies).
        await expect(root).toHaveScreenshot(`${theme}-${story.id}.png`);
      });
    }
  }
});
