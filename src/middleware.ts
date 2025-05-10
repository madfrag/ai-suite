import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|api).*)'],
};

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = req.headers.get('host') || '';
  const subdomain = host.split('.')[0];
console.log('Subdomain:', subdomain);
  console.log('Host:', host);
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
