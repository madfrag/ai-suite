# AI Suite

![CI](https://github.com/madfrag/ai-suite/actions/workflows/ci.yml/badge.svg)

A collection of AI-powered tools built with Next.js 16, React 19, and TypeScript. Currently ships a streaming chatbot with persistent history and a multi-provider text summarizer.

**Live demo:** <https://ai-suite-seven.vercel.app>

---

## Features

### AI Chatbot

- Streaming responses via the OpenAI Responses API
- Persistent chat history stored in Supabase, scoped per anonymous user via RLS
- Multiple chat sessions, with a "New Chat" button and a previous-sessions list that lazy-loads only when you open it (no fetching your entire history up front)
- Long sessions get compressed automatically: past a message threshold, older messages are folded into a rolling summary (stored in Supabase, refreshed periodically) instead of resending the full history on every turn
- Anonymous user identification, no sign-up required
- Per-IP daily message limit, to keep hosting costs bounded on a public demo

### Text Summarizer

- Dual-provider support: OpenAI and HuggingFace (`facebook/bart-large-cnn`)
- Toggle between providers to compare outputs — both stay visible once generated
- Save summaries to Supabase (tagged with which provider produced them) and browse previously saved ones in a read-only view later
- Per-IP daily limit on the OpenAI provider; HuggingFace has no limit here but is a free-tier API and may throttle on its own, in which case the UI surfaces a clear message rather than a generic error

> HuggingFace's BART model has a hard 1024-token context window, so input is
> truncated to ~3000 characters before it's sent. Long articles get summarized
> from an excerpt, not the full text. The OpenAI provider has no such limit.

### Infrastructure

- Subdomain-based routing via Next.js middleware
- The browser never talks to Supabase directly — every request goes through this app's own API routes using a server-side Supabase client bound to the visitor's session (RLS still applies); a separate service-role client is used only for the IP-keyed rate limiter, which isn't scoped to a user
- Dark/light theme, no flash of the wrong theme on load
- CI on every push/PR: lint, format check, type check, tests, then a build

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, Tailwind CSS v4, Radix UI
- **Language:** TypeScript
- **AI:** OpenAI API, HuggingFace Inference API (model names configurable, see below)
- **Database:** Supabase (PostgreSQL)
- **Testing:** Vitest, React Testing Library
- **CI/CD:** GitHub Actions
- **Animation:** Framer Motion, GSAP
- **Deployment:** Vercel

---

## Getting Started

### Prerequisites

- Node.js 26+ (see `.nvmrc`)
- OpenAI API key
- Supabase project (for chat persistence and saved summaries) — or run Supabase locally, see below
- HuggingFace API key (optional, only needed for the HuggingFace summarizer provider)

### Setup

```bash
git clone https://github.com/madfrag/ai-suite.git
cd ai-suite
npm install
cp .env.example .env.local
```

Fill in `.env.local`. Required: `OPENAI_API_KEY`, and all three Supabase values —
`SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` (the last
one is easy to miss since it's a separate key from the other two — without it the
rate limiter fails with `supabaseKey is required`). Everything else is optional:

- `OPENAI_CHAT_MODEL` / `OPENAI_SUMMARY_MODEL` — override the model used for chat vs. summarization independently. Both fall back to `gpt-5-nano` if unset (and log a warning saying so).
- `CHAT_DAILY_LIMIT` / `SUMMARIZE_DAILY_LIMIT` — per-IP daily caps, default to 30 and 20.
- `NEXT_PUBLIC_DB_PROVIDER` — defaults to `supabase`.

### Database

Schema lives in `supabase/migrations/`. If you're running Supabase locally:

```bash
supabase start
supabase migration up
```

That gets you `chatbot_messages`, `articles_summary`, `chat_session_summary`, and
`api_rate_limits`, all with RLS policies scoping rows to the authenticated
(anonymous) user — except `api_rate_limits`, which isn't user-owned and is only
ever written by the service-role client. If you're pointing at a hosted Supabase
project instead, push the same migrations with `supabase db push`.

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other scripts

```bash
npm run lint          # eslint
npm run format        # prettier --write
npm run format:check  # prettier --check
npm run type-check    # tsc --noEmit
npm run test          # vitest run
npm run build         # production build
```

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/          # Server-side anonymous sign-in (browser never calls Supabase)
│   │   ├── chat/          # Chat send, history, and session-preview endpoints
│   │   ├── summarize/     # Multi-provider summarization
│   │   ├── summaries/     # List previously saved summaries
│   │   └── save-summary/  # Persist summaries to Supabase
│   ├── chatbot/           # Chat UI with dynamic sessions
│   ├── summarizer/        # Summarizer page
│   └── layout.tsx
├── components/            # UI components (ChatUI, SummaryTabs, etc.)
├── lib/
│   ├── db/                # Server-only database abstraction layer
│   ├── supabase/          # Server-only Supabase clients (RLS-scoped + admin)
│   └── chatbot/           # Chat message service
└── middleware.ts          # Subdomain routing
```

---

## Roadmap

- [ ] Resume analyzer
- [ ] Image caption generator

---

## License

MIT
