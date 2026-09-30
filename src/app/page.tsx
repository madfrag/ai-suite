'use client';

import Link from 'next/link';
import { FileText, FileSearch, Bot, Image as ImageIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function Home() {
  return (
    <main className="bg-background text-foreground min-h-screen font-sans">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-24 border-b border-border">
        <div className="grid md:grid-cols-2 items-center gap-12">
          <div>
            <h1 className="text-6xl font-bold uppercase tracking-tight leading-[1.1] mb-6">
              AI Tool Suite
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground max-w-prose mb-8">
              Explore powerful, no-nonsense AI tools for summarizing text, analyzing resumes, and
              more. Built for clarity and function.
            </p>
            <Link
              href="/summarizer"
              className="inline-block border border-foreground px-6 py-3 uppercase text-sm tracking-widest hover:bg-foreground hover:text-background transition"
            >
              Start Exploring
            </Link>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-sm uppercase tracking-wide text-muted-foreground">
              Designed with grid systems & typographic discipline
            </p>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {tools.map((tool) =>
          tool.available ? (
            <div
              key={tool.title}
              className="border-t-4 border-primary p-6 flex flex-col justify-between shadow-md hover:shadow-lg transition bg-card text-card-foreground"
            >
              <div className="mb-4 space-y-2">
                <tool.icon className="w-8 h-8 text-primary" />
                <h3 className="text-xl font-bold uppercase tracking-wide">{tool.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{tool.description}</p>
                {tool.howItWorks && (
                  <Dialog>
                    <DialogTrigger className="text-xs font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground underline underline-offset-2 cursor-pointer">
                      How it works
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{tool.title}</DialogTitle>
                      </DialogHeader>
                      <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                        {tool.howItWorks.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
              <Link
                href={tool.link}
                className="mt-4 text-sm font-semibold uppercase tracking-wide border-t border-border pt-2 hover:underline"
              >
                Try Now →
              </Link>
            </div>
          ) : (
            <div
              key={tool.title}
              className="border-t-4 border-muted p-6 flex flex-col justify-between shadow-inner bg-muted text-muted-foreground opacity-60 cursor-not-allowed"
            >
              <div className="mb-4 space-y-2">
                <tool.icon className="w-8 h-8 text-muted-foreground" />
                <h3 className="text-xl font-bold uppercase tracking-wide line-through">
                  {tool.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{tool.description}</p>
              </div>
              <span className="mt-4 text-sm font-semibold uppercase tracking-wide border-t border-border pt-2 text-muted-foreground cursor-not-allowed opacity-70">
                Coming Soon
              </span>
            </div>
          )
        )}
      </section>
    </main>
  );
}

const tools = [
  {
    title: 'Text Summarizer',
    description:
      'Paste long articles and get concise summaries powered by OpenAI and Hugging Face.',
    link: '/summarizer',
    icon: FileText,
    available: true,
    howItWorks: [
      'Pick a provider: OpenAI (GPT) for a 5-bullet-point summary, or Hugging Face (BART) for a short abstractive summary.',
      'Long input is trimmed before it reaches Hugging Face, since bart-large-cnn has a hard 1024-token context window.',
      'OpenAI requests are rate-limited per visitor per day; Hugging Face runs on a free-tier API with no app-side cap.',
      'Summaries can be saved to Supabase and revisited later from the "Previous Summaries" panel.',
    ],
  },
  {
    title: 'Resume Analyzer',
    description: 'Upload your resume and receive detailed feedback and optimization tips.',
    link: '/resume-analyzer',
    icon: FileSearch,
    available: false,
  },
  {
    title: 'AI Chatbot',
    description: 'Streaming chat with persistent sessions and rolling context compression.',
    link: '/chatbot',
    icon: Bot,
    available: true,
    howItWorks: [
      'Responses stream token-by-token from OpenAI over a single request, so replies render as they’re generated.',
      'Sessions persist in Supabase, so a conversation can be closed and picked back up later.',
      'Once a session passes 5 messages, the last 5 stay verbatim and everything older gets compressed into a running AI-generated summary instead of being sent in full.',
      'That summary auto-refreshes every 5 messages, keeping the prompt small without the model losing earlier context.',
    ],
  },
  {
    title: 'Image Caption Generator',
    description: 'Upload an image and generate a meaningful, descriptive caption instantly.',
    link: '/image-caption',
    icon: ImageIcon,
    available: false,
  },
];
