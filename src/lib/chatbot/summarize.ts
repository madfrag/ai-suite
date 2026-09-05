export const RECENT_WINDOW = 5; // always keep this many trailing raw messages verbatim
export const SUMMARIZE_EVERY = 5; // refresh the summary every N messages

export function isOverThreshold(totalMessages: number) {
  return totalMessages > RECENT_WINDOW;
}

export function shouldRefreshSummary(totalMessages: number, hasSummary: boolean) {
  return isOverThreshold(totalMessages) && (!hasSummary || totalMessages % SUMMARIZE_EVERY === 0);
}
