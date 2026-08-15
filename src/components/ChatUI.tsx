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
import { ChevronDown, ChevronUp } from 'lucide-react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  chat_session_id?: string;
};

export default function ChatUI() {
  const params = useParams();
  const router = useRouter();

  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [allUserMessages, setAllUserMessages] = useState<Message[]>([]);
  const [groupedMessages, setGroupedMessages] = useState<Record<string, Message[]>>({});
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const chatSessionIdParam = params?.chatSessionId as string;
    if (!chatSessionIdParam) {
      router.push('/chatbot/' + crypto.randomUUID());
      return;
    }
    let localUserId = localStorage.getItem('anon_id');
    if (!localUserId) {
      localUserId = crypto.randomUUID();
      localStorage.setItem('anon_id', localUserId);
    }
    setUserId(localUserId);

    const loadMessages = async () => {
      const res = await fetch('/api/chat/history?userId=' + localUserId);
      const data = await res.json();
      setAllUserMessages(data.messages);
      setMessages(
        data.messages.filter((msg: Message) => msg.chat_session_id === chatSessionIdParam)
      );
    };

    loadMessages();
    setChatSessionId(chatSessionIdParam);
  }, [params, router]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const res = await fetch('/api/chat/send', {
      method: 'POST',
      body: JSON.stringify({ content: userMessage.content, userId, chatSessionId }),
    });

    const data = await res.json();
    const assistantMessage = { role: 'assistant' as const, content: data.reply };
    setMessages((prev) => [...prev, assistantMessage]);
    setLoading(false);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const grouped = allUserMessages.reduce(
      (acc, msg) => {
        if (!msg.chat_session_id) return acc;
        if (!acc[msg.chat_session_id]) acc[msg.chat_session_id] = [];
        acc[msg.chat_session_id].push(msg);
        return acc;
      },
      {} as Record<string, Message[]>
    );

    setGroupedMessages(grouped);
  }, [allUserMessages]);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 h-screen flex flex-col text-foreground bg-background w-full">
      <h1 className="text-3xl font-bold uppercase mb-4 border-b border-border pb-4">AI Chatbot</h1>

      <Accordion
        type="single"
        collapsible
        className="mb-6 border border-border rounded-lg shadow-sm w-full"
        onValueChange={(value) => setIsOpen(!!value)}
      >
        <AccordionItem value="history">
          <AccordionTrigger className="cursor-pointer flex justify-between items-center text-lg font-medium px-4 py-3 bg-muted text-muted-foreground hover:bg-muted/80 rounded-t-lg w-full">
            <span>Previous Chat Sessions</span>
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </AccordionTrigger>
          <AccordionContent className="p-4 space-y-3 max-h-[300px] overflow-y-auto bg-card text-card-foreground rounded-b-lg border-t border-border w-full">
            {Object.entries(groupedMessages).length === 0 && (
              <p className="text-sm text-muted-foreground">No previous chats found.</p>
            )}
            {Object.entries(groupedMessages).map(([sessionId, messages]) => (
              <Link
                key={sessionId}
                href={`/chatbot/${sessionId}`}
                className="block border border-border rounded-md p-3 bg-background text-foreground hover:bg-muted transition w-full"
              >
                <p className="truncate text-sm text-muted-foreground">
                  {messages.find((m) => m.role === 'user')?.content || 'No message'}
                </p>
              </Link>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex-1 overflow-hidden flex flex-col border border-border rounded-lg bg-card text-card-foreground shadow relative w-full">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`whitespace-pre-wrap px-4 py-3 rounded-md max-w-prose text-sm ${
                msg.role === 'user'
                  ? 'bg-secondary text-secondary-foreground self-end'
                  : 'bg-primary text-primary-foreground self-start'
              }`}
            >
              {msg.content}
            </div>
          ))}
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
            {loading ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
