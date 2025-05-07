'use client';

import {
  FileText,
  FileSearch,
 Bot,
  Image as ImageIcon,
} from 'lucide-react';

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
              Explore powerful, no-nonsense AI tools for summarizing text, analyzing resumes, and more. Built for clarity and function.
            </p>
            <a
              href="/summarizer"
              className="inline-block border border-foreground px-6 py-3 uppercase text-sm tracking-widest hover:bg-foreground hover:text-background transition"
            >
              Start Exploring
            </a>
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
        {tools.map((tool) => (
          <div
            key={tool.title}
            className="border-t-4 border-primary p-6 flex flex-col justify-between shadow-md hover:shadow-lg transition bg-card text-card-foreground"
          >
            <div className="mb-4 space-y-2">
              <tool.icon className="w-8 h-8 text-primary" />
              <h3 className="text-xl font-bold uppercase tracking-wide">{tool.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{tool.description}</p>
            </div>
            <a
              href={tool.link}
              className="mt-4 text-sm font-semibold uppercase tracking-wide border-t border-border pt-2 hover:underline"
            >
              Try Now →
            </a>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground uppercase tracking-wide">
        &copy; 2025 My AI Tool Suite
      </footer>
    </main>
  );
}

const tools = [
  {
    title: 'Text Summarizer',
    description: 'Paste long articles and get concise summaries powered by OpenAI and Hugging Face.',
    link: '/summarizer',
    icon: FileText,
  },
  {
    title: 'Resume Analyzer',
    description: 'Upload your resume and receive detailed feedback and optimization tips.',
    link: '/resume-analyzer',
    icon: FileSearch,
  },
  {
    title: 'AI Chatbot',
    description: 'Chat with a highly intelligent AI trained to handle any topic or query.',
    link: '/chatbot',
    icon: Bot,
  },
  {
    title: 'Image Caption Generator',
    description: 'Upload an image and generate a meaningful, descriptive caption instantly.',
    link: '/image-caption',
    icon: ImageIcon,
  },
];
