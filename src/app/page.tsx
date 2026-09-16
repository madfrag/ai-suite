'use client';

import Link from 'next/link';
import { FileText, FileSearch, Bot, Image as ImageIcon } from 'lucide-react';

const GITHUB_URL = 'https://github.com/madfrag/ai-suite';

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

      {/* Footer */}
      <footer className="border-t border-border py-6 flex flex-col items-center gap-3 text-center text-sm text-muted-foreground uppercase tracking-wide">
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition"
          aria-label="GitHub repository"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
            <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.73.8 1.18 1.83 1.18 3.09 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .31.21.68.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
          </svg>
        </a>
        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:underline">
          &copy; 2026 Rushan Engalychev
        </a>
      </footer>
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
  },
  {
    title: 'Image Caption Generator',
    description: 'Upload an image and generate a meaningful, descriptive caption instantly.',
    link: '/image-caption',
    icon: ImageIcon,
    available: false,
  },
];
