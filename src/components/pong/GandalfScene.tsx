'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { setPathway } from '@/lib/pathway';

/**
 * Rendered after the player loses twice. Plays /gandalf.mp4 (if present) and,
 * after 4 s or when the video ends, reveals a mercy link to /pro.
 */
export function GandalfScene() {
  const [showMercy, setShowMercy] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowMercy(true), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <video
        src="/gandalf.mp4"
        autoPlay
        muted
        playsInline
        className="max-h-full max-w-full"
        onEnded={() => setShowMercy(true)}
      />
      {showMercy && (
        <Link
          href="/pro"
          onClick={() => setPathway('pro')}
          className="absolute bottom-10 text-white underline text-sm"
        >
          Alright, let me in anyway →
        </Link>
      )}
    </div>
  );
}
