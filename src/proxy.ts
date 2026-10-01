import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|api).*)'],
};

export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();

  // A real HTTP 307 before rendering. Doing this with redirect() inside the
  // page puts it in the streamed payload instead, and the client router
  // swallowed it on the first click of "Try Now" (see e2e/smoke.spec.ts).
  if (url.pathname === '/chatbot') {
    url.pathname = `/chatbot/${crypto.randomUUID()}`;
    return NextResponse.redirect(url);
  }

  const host = req.headers.get('host') || '';
  const subdomain = host.split('.')[0];

  if (subdomain === 'www' || host.startsWith('localhost')) {
    return NextResponse.next();
  }

  if (subdomain === 'about') {
    url.pathname = `/about${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  if (subdomain === 'app') {
    url.pathname = `/app${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
