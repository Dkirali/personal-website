'use client';
import Link from 'next/link';
import { setPathway } from '@/lib/pathway';

export function SkipLink() {
  return (
    <Link
      href="/pro"
      onClick={() => setPathway('pro')}
      className="fixed bottom-4 right-4 text-xs text-white/60 hover:text-white underline"
    >
      Skip this and view the website →
    </Link>
  );
}
