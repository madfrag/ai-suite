import { supabaseDb } from '@/lib/db/supabase.server-side';

export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

export async function checkRateLimit({
  ipAddress,
  endpoint,
  limit,
}: {
  ipAddress: string;
  endpoint: string;
  limit: number;
}) {
  const { data: count, error } = await supabaseDb.incrementRateLimit({ ipAddress, endpoint });

  if (error) {
    console.error('Rate limit check failed, allowing request:', error);
    return { allowed: true, count: 0 };
  }

  return { allowed: count <= limit, count };
}
