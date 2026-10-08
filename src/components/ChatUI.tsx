'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@radix-ui/react-accordion';
import { ChevronDown, ChevronUp, Copy, Check, Plus, Lock, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  chat_session_id?: string;
};

type SessionPreview = {
  chat_session_id: string;
  content: string;
  created_at: string;
};

export default function ChatUI({ dailyLimit }: { dailyLimit: number }) {
  const params = useParams();
  const router = useRouter();

  // The [[...chatSessionId]] page always redirects server-side to a session
  // URL before this component ever mounts (see app/chatbot/.../page.tsx), so
  // this is guaranteed to be present here.
  const chatSessionId = (params?.chatSessionId as string[])[0];
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [sessions, setSessions] = useState<SessionPreview[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isReasoning, setIsReasoning] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Private mode keeps the conversation in this component's state only: no
  // history fetch, and /api/chat/send is told not to touch the database.
  const [isPrivate, setIsPrivate] = useState(false);

  const handleCopy = (content: string, idx: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  useEffect(() => {
    const loadMessages = async () => {
      setMessages([]);
      setLoading(false);
      setIsStreaming(false);
      setIsReasoning(false);
      setIsSummarizing(false);
      setError(null);
      if (isPrivate) return;
      const res = await fetch(`/api/chat/history?chatSessionId=${chatSessionId}`);
      if (!res.ok) {
        const systemMessage = {
          role: 'system' as const,
          content: 'Failed to load chat history. Please try again later.',
        };
        setMessages((prev) => [...prev, systemMessage]);
        return;
      }
      const data = await res.json();
      setMessages(data.messages);
    };

    loadMessages();
  }, [chatSessionId, isPrivate]);

  const loadSessions = async () => {
    setSessionsLoading(true);
    const res = await fetch('/api/chat/sessions');
    if (res.ok) {
      const data = await res.json();
      setSessions(data.sessions);
    }
    setSessionsLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    const res = await fetch('/api/chat/send', {
      method: 'POST',
      body: JSON.stringify(
        isPrivate
          ? {
              private: true,
              messages: [...messages, userMessage].filter((m) => m.role !== 'system'),
            }
          : { content: userMessage.content, chatSessionId }
      ),
    });

    if (!res.ok || !res.body) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? 'Failed to send message.');
      setLoading(false);
      return;
    }

    setLoading(false);
    setIsStreaming(true);

    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buffer = '';
    // Defer the assistant bubble until the first real text arrives
    let assistantAdded = false;
    let chunk = await reader.read();
    while (!chunk.done) {
      buffer += dec.decode(chunk.value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? ''; // keep incomplete last line

      for (const line of lines) {
        if (!line.trim()) continue;
        const event = JSON.parse(line);

        switch (event.type) {
          case 'response.output_text.delta':
            if (!event.delta) continue;
            if (!assistantAdded) {
              assistantAdded = true;
              setMessages((prev) => [
                ...prev,
                { role: 'assistant' as const, content: event.delta },
              ]);
            } else {
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                return [...prev.slice(0, -1), { ...last, content: last.content + event.delta }];
              });
            }
            break;

          case 'response.output_item.added':
            if (event.item.type === 'reasoning') setIsReasoning(true);
            break;

          case 'response.output_item.done':
            if (event.item.type === 'reasoning') setIsReasoning(false);
            break;

          case 'response.completed':
            setIsStreaming(false);
            break;

          case 'summary.started':
            setIsSummarizing(true);
            break;

          case 'summary.completed':
            setIsSummarizing(false);
            break;
        }
      }
      chunk = await reader.read();
    }
    setIsStreaming(false);
  };

  // Warn before a reload/close throws away an unsaved private conversation.
  useEffect(() => {
    if (!isPrivate || messages.length === 0) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [isPrivate, messages.length]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="max-w-4xl mx-auto pb-4 pt-16 px-4 h-[calc(100dvh-2.5rem)] min-h-96 flex-none flex flex-col text-foreground bg-background w-full outline-none"
    >
      <div className="flex items-center justify-between mb-4 border-b border-border pb-4">
        <h1 className="text-3xl font-bold uppercase flex items-center gap-3">
          AI Chatbot
          {isPrivate && (
            <span className="flex items-center gap-1.5 text-base font-medium text-muted-foreground">
              <Lock className="w-4 h-4" aria-hidden="true" />· Private
            </span>
          )}
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id="private-mode"
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
              disabled={loading || isStreaming}
            />
            <label htmlFor="private-mode" className="text-sm cursor-pointer select-none">
              Private mode
            </label>
          </div>
          <button
            onClick={() =>
              isPrivate ? setMessages([]) : router.push('/chatbot/' + crypto.randomUUID())
            }
            className="flex items-center gap-1.5 border border-border text-foreground px-4 py-2 rounded uppercase text-sm tracking-wide hover:bg-muted transition"
          >
            {isPrivate ? (
              <Trash2 className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Plus className="w-4 h-4" aria-hidden="true" />
            )}
            {isPrivate ? 'Clear chat' : 'New Chat'}
          </button>
        </div>
      </div>

      {!isPrivate && (
        <Accordion
          type="single"
          collapsible
          className="mb-6 border border-border rounded-lg shadow-sm w-full"
          onValueChange={(value) => {
            setIsOpen(!!value);
            if (value) loadSessions();
          }}
        >
          <AccordionItem value="history">
            <AccordionTrigger className="cursor-pointer flex justify-between items-center text-lg font-medium px-4 py-3 bg-muted text-muted-foreground hover:bg-muted/80 rounded-t-lg w-full">
              <span>Previous Chat Sessions</span>
              {isOpen ? (
                <ChevronUp className="w-5 h-5" aria-hidden="true" />
              ) : (
                <ChevronDown className="w-5 h-5" aria-hidden="true" />
              )}
            </AccordionTrigger>
            <AccordionContent className="p-4 space-y-3 max-h-75 overflow-y-auto bg-card text-card-foreground rounded-b-lg border-t border-border w-full">
              {sessionsLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
              {!sessionsLoading && sessions.length === 0 && (
                <p className="text-sm text-muted-foreground">No previous chats found.</p>
              )}
              {sessions.map((session) => (
                <Link
                  key={session.chat_session_id}
                  href={`/chatbot/${session.chat_session_id}`}
                  className="block border border-border rounded-md p-3 bg-background text-foreground hover:bg-muted transition w-full"
                >
                  <p className="truncate text-sm text-muted-foreground">{session.content}</p>
                </Link>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      <div
        className={`flex-1 min-h-0 overflow-hidden flex flex-col border rounded-lg text-card-foreground shadow relative w-full transition-colors duration-300 ${
          isPrivate
            ? 'border-dashed border-muted-foreground/60 bg-muted/50'
            : 'border-border bg-card'
        }`}
      >
        <div
          role="log"
          aria-label="Chat messages"
          aria-live="polite"
          className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col"
        >
          {isPrivate && messages.length === 0 && (
            <div
              role="note"
              className="m-auto max-w-sm text-center flex flex-col items-center gap-2 text-muted-foreground"
            >
              <Lock className="w-8 h-8" aria-hidden="true" />
              <p className="text-lg font-semibold text-foreground">
                Private chat. Nothing is saved.
              </p>
              <p className="text-sm">
                This conversation lives only in your browser&apos;s memory and disappears when you
                reload, leave the page or turn private mode off. Your messages are still sent to
                OpenAI to generate replies.
              </p>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`relative ${
                msg.role === 'user' ? 'self-end' : 'self-start'
              } ${msg.role === 'user' ? 'sm:max-w-prose max-w-[85%]' : 'w-[95%]'}`}
            >
              <div
                className={`relative whitespace-pre-wrap px-4 py-3 rounded-md text-sm ${
                  msg.role === 'user'
                    ? 'bg-secondary text-secondary-foreground pr-9'
                    : 'text-foreground pr-9'
                }`}
              >
                {!(isStreaming && idx === messages.length - 1) && (
                  <button
                    onClick={() => handleCopy(msg.content, idx)}
                    className="absolute top-2 right-2 p-1 rounded opacity-40 hover:opacity-100 transition-opacity cursor-pointer"
                    aria-label="Copy message"
                  >
                    {copiedIdx === idx ? (
                      <Check className="w-3.5 h-3.5" aria-hidden="true" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    )}
                    <span role="status" className="sr-only">
                      {copiedIdx === idx ? 'Copied to clipboard' : ''}
                    </span>
                  </button>
                )}
                {msg.content}
              </div>
              {/* Fade active only while the last assistant message is streaming */}
              {msg.role === 'assistant' && isStreaming && idx === messages.length - 1 && (
                <div
                  className={`absolute bottom-0 left-0 right-0 h-10 rounded-b-md pointer-events-none ${
                    isPrivate
                      ? 'bg-[linear-gradient(to_bottom,transparent,color-mix(in_oklab,var(--muted)_50%,var(--background)))]'
                      : 'bg-[linear-gradient(to_bottom,transparent,var(--card))]'
                  }`}
                />
              )}
            </div>
          ))}
          <div
            className={`ml-5 min-h-5 flex items-center ${
              !loading && !isStreaming && !error ? 'invisible' : ''
            }`}
          >
            <div role="status" aria-live="polite" className="flex items-center">
              {loading && (
                <>
                  <div className="waiting" aria-hidden="true" />
                  <span className="sr-only">Sending message…</span>
                </>
              )}
              {isSummarizing && (
                <>
                  <div className="summarizing" aria-hidden="true" />
                  <span className="sr-only">Summarizing conversation…</span>
                </>
              )}
              {isReasoning && (
                <>
                  <div className="thinking" aria-hidden="true" />
                  <span className="sr-only">Assistant is thinking…</span>
                </>
              )}
            </div>
            {error && (
              <p role="alert" className="italic text-destructive text-sm">
                {error}
              </p>
            )}
          </div>
          <div ref={bottomRef} />
        </div>

        <div
          className={`border-t p-4 flex items-center gap-2 sticky bottom-0 left-0 right-0 z-10 w-full ${
            isPrivate ? 'border-dashed border-muted-foreground/60' : 'border-border bg-card'
          }`}
        >
          <label htmlFor="chat-message-input" className="sr-only">
            Message
          </label>
          <input
            id="chat-message-input"
            className="flex-1 border border-border rounded px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !loading && handleSend()}
            placeholder={isPrivate ? 'Message privately…' : 'Type your message...'}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-primary text-primary-foreground px-4 py-2 text-sm uppercase rounded-md hover:opacity-90 transition"
          >
            {loading ? 'Wait...' : 'Send'}
          </button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-2">
        Demo — limited to {dailyLimit} messages/day per visitor.
      </p>
    </main>
  );
}
