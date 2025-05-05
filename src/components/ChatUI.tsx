'use client';

import { useState, useEffect, useRef } from 'react';
import { chatbotMessages } from '@/lib/chatbot/messages';
import { clientDb } from '@/lib/db/db.client-side';

type Message = {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
};

export default function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const user = await clientDb.getCurrentUser();
      const history = await chatbotMessages.getAllMessages(user?.id);
      setMessages(history);
    };
    fetchMessages();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage: Message = { role: 'user', content: input };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ content: input }),
    });

    const data = await res.json();
    setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    setLoading(false);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 min-h-screen flex flex-col">
      <h1 className="text-3xl font-bold uppercase tracking-tight mb-8 border-b pb-4">AI Chatbot</h1>

      <div className="flex-1 overflow-y-auto space-y-4 mb-6">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`whitespace-pre-wrap px-4 py-3 max-w-prose text-sm border rounded-md ${
              msg.role === 'user'
                ? 'bg-neutral-100 self-end text-right'
                : 'bg-black text-white self-start'
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="flex items-center gap-2 border-t pt-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 border border-neutral-300 rounded px-3 py-2 text-sm"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-black text-white px-4 py-2 text-sm uppercase"
        >
          {loading ? 'Thinking...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
