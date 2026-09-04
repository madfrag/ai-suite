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
import { ChevronDown, ChevronUp, Copy, Check, Plus } from 'lucide-react';

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

export default function ChatUI() {
  const params = useParams();
  const router = useRouter();

  const chatSessionId = (params?.chatSessionId as string[])?.[0] || null;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [sessions, setSessions] = useState<SessionPreview[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isReasoning, setIsReasoning] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopy = (content: string, idx: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  useEffect(() => {
    if (!chatSessionId) {
      router.push('/chatbot/' + crypto.randomUUID());
      return;
    }

    const loadMessages = async () => {
      setMessages([]);
      setLoading(false);
      setIsStreaming(false);
      setIsReasoning(false);
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
  }, [chatSessionId, router]);

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

    const res = await fetch('/api/chat/send', {
      method: 'POST',
      body: JSON.stringify({ content: userMessage.content, chatSessionId }),
    });

    if (!res.ok || !res.body) {
      setMessages((prev) => [...prev, { role: 'system' as const, content: 'Failed.' }]);
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
        }
      }
      chunk = await reader.read();
    }
    setIsStreaming(false);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="max-w-4xl mx-auto pb-10 pt-16 px-4 h-screen flex flex-col text-foreground bg-background w-full">
      <div className="flex items-center justify-between mb-4 border-b border-border pb-4">
        <h1 className="text-3xl font-bold uppercase">AI Chatbot</h1>
        <button
          onClick={() => router.push('/chatbot/' + crypto.randomUUID())}
          className="flex items-center gap-1.5 border border-border text-foreground px-4 py-2 rounded uppercase text-sm tracking-wide hover:bg-muted transition"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>
      </div>

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
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
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

      <div className="flex-1 overflow-hidden flex flex-col border border-border rounded-lg bg-card text-card-foreground shadow relative w-full">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
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
                    className="absolute top-2 right-2 p-1 rounded opacity-40 hover:opacity-100 transition-opacity"
                    aria-label="Copy message"
                  >
                    {copiedIdx === idx ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
                {msg.content}
              </div>
              {/* Fade active only while the last assistant message is streaming */}
              {msg.role === 'assistant' && isStreaming && idx === messages.length - 1 && (
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-linear-to-t from-foreground/5 to-transparent rounded-b-md pointer-events-none" />
              )}
            </div>
          ))}
          <div
            className={`ml-5 min-h-5 flex items-center ${!loading && !isStreaming ? 'invisible' : ''}`}
          >
            {loading && <div className="waiting" />}
            {isReasoning && <div className="thinking" />}
          </div>
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-border p-4 flex items-center gap-2 bg-card sticky bottom-0 left-0 right-0 z-10 w-full">
          <input
            className="flex-1 border border-border rounded px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !loading && handleSend()}
            placeholder="Type your message..."
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
    </div>
  );
}
