import ChatUI from '@/components/ChatUI';
import { CHAT_DAILY_LIMIT } from '@/lib/consts';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export default function ChatbotPage() {
  return <ChatUI dailyLimit={CHAT_DAILY_LIMIT} />;
}
