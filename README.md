# AI Suite

![CI](https://github.com/madfrag/ai-suite/actions/workflows/ci.yml/badge.svg)

A collection of AI-powered tools built with Next.js 16, React 19, and TypeScript. Currently ships a streaming chatbot with persistent history and a multi-provider text summarizer.

**Live demo:** not deployed yet.

---

## Features

### AI Chatbot

- Streaming responses via the OpenAI Responses API
- Persistent chat history stored in Supabase, scoped per anonymous user via RLS
- Multiple chat sessions, with a "New Chat" button and a previous-sessions list that lazy-loads only when you open it (no fetching your entire history up front)
- Anonymous user identification, no sign-up required

### Text Summarizer

- Dual-provider support: OpenAI and HuggingFace (`facebook/bart-large-cnn`)
- Toggle between providers to compare outputs
- Save summaries to Supabase for later reference

> HuggingFace's BART model has a hard 1024-token context window, so input is
> truncated to ~3000 characters before it's sent. Long articles get summarized
> from an excerpt, not the full text. The OpenAI provider has no such limit.

### Infrastructure

- Subdomain-based routing via Next.js middleware
- Server-side Supabase client with SSR support
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

Fill in `.env.local`. Everything except the Supabase and OpenAI values is optional:

- `OPENAI_CHAT_MODEL` / `OPENAI_SUMMARY_MODEL` — override the model used for chat vs. summarization independently. Both fall back to `gpt-5-nano` if unset (and log a warning saying so).
- `NEXT_PUBLIC_DB_PROVIDER` — defaults to `supabase`.

### Database

Schema lives in `supabase/migrations/`. If you're running Supabase locally:

```bash
supabase start
supabase migration up
```

That gets you `chatbot_messages`, `articles_summary`, and `chat_session_summary`, all with RLS policies scoping rows to the authenticated (anonymous) user. If you're pointing at a hosted Supabase project instead, push the same migrations with `supabase db push`.

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
│   │   ├── chat/          # Chat send, history, and session-preview endpoints
│   │   ├── summarize/     # Multi-provider summarization
│   │   └── save-summary/  # Persist summaries to Supabase
│   ├── chatbot/           # Chat UI with dynamic sessions
│   ├── summarizer/        # Summarizer page
│   └── layout.tsx
├── components/            # UI components (ChatUI, SummaryTabs, etc.)
├── lib/
│   ├── db/                # Database abstraction layer
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
