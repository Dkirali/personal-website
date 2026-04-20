import { NextResponse, type NextRequest } from 'next/server';
import { PATHWAY_KEY, parsePathway } from '@/lib/pathway';

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname !== '/') return NextResponse.next();
  const cookie = req.cookies.get(PATHWAY_KEY)?.value ?? null;
  const pathway = parsePathway(cookie);
  if (pathway === 'gaming') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  if (pathway === 'pro') {
    return NextResponse.redirect(new URL('/pro', req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ['/'] };
