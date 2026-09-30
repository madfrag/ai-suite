import { redirect } from 'next/navigation';
import ChatUI from '@/components/ChatUI';
import { CHAT_DAILY_LIMIT } from '@/lib/consts';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export default async function ChatbotPage({
  params,
}: {
  params: Promise<{ chatSessionId?: string[] }>;
}) {
  const { chatSessionId } = await params;

  // Redirect server-side, not with a client useEffect: a client-side
  // router.push() here left the previous (paramless) route segment mounted
  // but hidden (display:none) in the DOM — Next's Router Cache keeps it
  // alive for fast back-navigation — which meant two elements shared every
  // id in ChatUI (#main-content, #chat-message-input), invalid HTML that
  // also broke id-based test locators. Redirecting before the client ever
  // renders the paramless variant avoids mounting it at all.
  if (!chatSessionId?.length) {
    redirect(`/chatbot/${crypto.randomUUID()}`);
  }

  return <ChatUI dailyLimit={CHAT_DAILY_LIMIT} />;
}
