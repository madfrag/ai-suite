import { test, expect } from '@playwright/test';

// These flows mock the API layer with page.route() rather than hitting real
// providers — CI only has placeholder OPENAI_API_KEY / SUPABASE creds (see
// ci.yml), so this is what makes the flows deterministic and secret-free
// while still exercising real client code (streaming parser, DOM updates,
// the a11y labels wired up in e2e/a11y.spec.ts's companion fixes).

// The tool pages are gated behind a consent dialog (see ConsentGate). Every
// flow below is about the tools themselves, so start from "already agreed";
// e2e/consent.spec.ts covers the dialog.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('ai-suite-consent', JSON.stringify({ v: 1 }));
  });
});

test.describe('homepage navigation', () => {
  test('Try Now links route to the right tool', async ({ page }) => {
    await page.goto('/');
    await page
      .getByRole('link', { name: /Try Now/ })
      .first()
      .click();
    await expect(page).toHaveURL(/\/summarizer$/);
  });

  // /chatbot redirects to a fresh /chatbot/<uuid>. Regression: a redirect()
  // inside the streamed render was swallowed by the client router, so the
  // first click on the card did nothing and a second click was needed.
  test('a single click on the chatbot Try Now lands in a chat session', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page
      .getByRole('link', { name: /Try Now/ })
      .nth(1)
      .click();
    await expect(page).toHaveURL(/\/chatbot\/[0-9a-f-]{36}$/, { timeout: 3000 });
  });
});

test.describe('summarizer flow', () => {
  test('submitting text renders the mocked summary', async ({ page }) => {
    await page.route('**/api/summarize', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ summaryText: 'This is a mocked summary.' }),
      })
    );

    await page.goto('/summarizer');
    await page.getByLabel('Input Text').fill('Some long article text to summarize.');
    await page.getByRole('button', { name: 'Summarize' }).click();

    await expect(page.getByText('This is a mocked summary.')).toBeVisible();
  });

  test('shows the API error message on failure', async ({ page }) => {
    await page.route('**/api/summarize', (route) =>
      route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Daily summary limit reached (20/day). Try again tomorrow.',
        }),
      })
    );

    await page.goto('/summarizer');
    await page.getByLabel('Input Text').fill('Some long article text to summarize.');
    await page.getByRole('button', { name: 'Summarize' }).click();

    // Next's own route-announcer div also has role="alert" (empty, for its own
    // purposes), so scope to the app's error message by text.
    await expect(
      page.getByRole('alert').filter({ hasText: 'Daily summary limit reached' })
    ).toBeVisible();
  });
});

test.describe('chatbot flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/chat/history*', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ messages: [] }),
      })
    );
  });

  test('sending a message renders the streamed reply', async ({ page }) => {
    await page.route('**/api/chat/send', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/x-ndjson',
        body: [
          JSON.stringify({ type: 'response.output_text.delta', delta: 'Hello ' }),
          JSON.stringify({ type: 'response.output_text.delta', delta: 'there!' }),
          JSON.stringify({ type: 'response.completed' }),
        ].join('\n'),
      })
    );

    await page.goto('/chatbot');
    // exact: true — otherwise this substring-matches the log region's
    // aria-label="Chat messages" too ("messages" contains "message").
    await page.getByLabel('Message', { exact: true }).fill('Hi assistant');
    await page.getByRole('button', { name: 'Send' }).click();

    await expect(page.getByText('Hello there!')).toBeVisible();
  });

  test('New Chat starts a fresh session URL', async ({ page }) => {
    await page.goto('/chatbot');
    await expect(page).toHaveURL(/\/chatbot\/[0-9a-f-]{36}$/);
    const firstUrl = page.url();

    await page.getByRole('button', { name: 'New Chat' }).click();
    await expect(page).not.toHaveURL(firstUrl);
    await expect(page).toHaveURL(/\/chatbot\/[0-9a-f-]{36}$/);
  });

  test('private mode hides history and sends the conversation without a session id', async ({
    page,
  }) => {
    let sentBody: Record<string, unknown> | null = null;
    await page.route('**/api/chat/send', (route) => {
      sentBody = route.request().postDataJSON();
      return route.fulfill({
        status: 200,
        contentType: 'application/x-ndjson',
        body: [
          JSON.stringify({ type: 'response.output_text.delta', delta: 'Secret reply' }),
          JSON.stringify({ type: 'response.completed' }),
        ].join('\n'),
      });
    });

    await page.goto('/chatbot');
    await expect(page.getByText('Previous Chat Sessions')).toBeVisible();

    await page.getByRole('switch', { name: 'Private mode' }).click();
    await expect(page.getByText('Previous Chat Sessions')).toBeHidden();
    await expect(page.getByText('Private chat. Nothing is saved.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Clear chat' })).toBeVisible();

    await page.getByLabel('Message', { exact: true }).fill('Hi privately');
    await page.getByRole('button', { name: 'Send' }).click();
    await expect(page.getByText('Secret reply')).toBeVisible();
    await expect(page.getByText('Private chat. Nothing is saved.')).toBeHidden();

    await page.getByRole('button', { name: 'Clear chat' }).click();
    await expect(page.getByText('Secret reply')).toBeHidden();
    await expect(page.getByText('Private chat. Nothing is saved.')).toBeVisible();

    expect(sentBody).toEqual({
      private: true,
      messages: [{ role: 'user', content: 'Hi privately' }],
    });
  });

  test('only the message list scrolls, not the page', async ({ page }) => {
    await page.route('**/api/chat/history*', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          messages: Array.from({ length: 40 }, (_, i) => ({
            role: i % 2 ? 'assistant' : 'user',
            content: `Message number ${i} with some filler text`,
          })),
        }),
      })
    );

    await page.goto('/chatbot');
    const log = page.getByRole('log', { name: 'Chat messages' });
    await expect(log.getByText('Message number 39')).toBeVisible();

    const { pageOverflow, logOverflow } = await page.evaluate(() => ({
      pageOverflow: document.documentElement.scrollHeight - document.documentElement.clientHeight,
      logOverflow: (() => {
        const el = document.querySelector('[role="log"]')!;
        return el.scrollHeight - el.clientHeight;
      })(),
    }));
    expect(pageOverflow).toBeLessThanOrEqual(0);
    expect(logOverflow).toBeGreaterThan(0);
  });
});
