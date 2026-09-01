# AI Suite

A collection of AI-powered tools built with Next.js 15, React 19, and TypeScript. Features a chatbot with persistent conversation history and a multi-provider text summarizer.

**Live demo:** [coming soon]

---

## Features

### AI Chatbot

- Conversational interface powered by OpenAI GPT-4o
- Persistent chat history stored in Supabase
- Multiple chat sessions with session switching
- Anonymous user identification

### Text Summarizer

- Dual-provider support: OpenAI GPT-4o and HuggingFace BART
- Toggle between providers to compare outputs
- Save summaries to database for later reference

### Infrastructure

- Subdomain-based routing via Next.js middleware
- Server-side Supabase client with SSR support
- Dark/light theme with system preference detection
- Responsive UI with Tailwind CSS v4 and Radix UI

---

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI:** React 19, Tailwind CSS v4, Radix UI
- **Language:** TypeScript
- **AI:** OpenAI API (GPT-4o), HuggingFace Inference API
- **Database:** Supabase (PostgreSQL)
- **Animation:** Framer Motion, GSAP
- **Deployment:** Vercel

---

## Getting Started

### Prerequisites

- Node.js 18+
- OpenAI API key
- Supabase project (for chat persistence and saved summaries)
- HuggingFace API key (optional, for BART summarizer)

### Setup

```bash
git clone https://github.com/madfrag/ai-suite.git
cd ai-suite
npm install
```

Create `.env.local`:

```env
OPENAI_API_KEY=your_openai_key
HUGGINGFACE_API_KEY=your_hf_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
```

### Database

Create the following tables in Supabase:

**chatbot_messages**

| Column          | Type                                 |
| --------------- | ------------------------------------ |
| id              | uuid (PK, default gen_random_uuid()) |
| chat_session_id | text                                 |
| role            | text                                 |
| content         | text                                 |
| created_at      | timestamptz (default now())          |

**summaries**

| Column     | Type                                 |
| ---------- | ------------------------------------ |
| id         | uuid (PK, default gen_random_uuid()) |
| original   | text                                 |
| summary    | text                                 |
| created_at | timestamptz (default now())          |

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/          # Chat send & history endpoints
│   │   ├── summarize/     # Multi-provider summarization
│   │   └── save-summary/  # Persist summaries to Supabase
│   ├── chatbot/           # Chat UI with dynamic sessions
│   ├── summarizer/        # Summarizer page
│   └── layout.tsx
├── components/            # UI components (ChatUI, SummaryTabs, etc.)
├── lib/
│   ├── db/                # Database abstraction layer
│   ├── supabase/          # Supabase client (server & client)
│   └── chatbot/           # Chat message service
└── middleware.ts          # Subdomain routing
```

---

## Roadmap

- [ ] Streaming responses (SSE / Vercel AI SDK)
- [ ] Resume analyzer
- [ ] Image caption generator

---

## License

MIT
