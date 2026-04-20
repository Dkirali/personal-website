import { NextResponse } from 'next/server';
import { PATHWAY_KEY } from '@/lib/pathway';

export function GET(req: Request) {
  const res = NextResponse.redirect(new URL('/', req.url));
  res.cookies.set(PATHWAY_KEY, '', { path: '/', maxAge: 0 });
  return res;
}
