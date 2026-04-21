import Link from 'next/link';
import { bio } from '@/content/bio';

export function PortfolioFooter() {
  return (
    <footer className="border-t border-black/5 bg-white/60 py-10 backdrop-blur dark:border-white/10 dark:bg-neutral-950/60">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">{bio.name}</p>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            {bio.title} · {bio.location}
          </p>
        </div>
        <div className="flex gap-5 text-xs text-neutral-500 dark:text-neutral-400">
          <a href={`mailto:${bio.email}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">
            Email
          </a>
          <a
            href={bio.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            LinkedIn
          </a>
          <Link href="/cv.pdf" className="hover:text-indigo-600 dark:hover:text-indigo-400">
            CV
          </Link>
          <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">
            Back to game
          </Link>
        </div>
        <p className="text-xs text-neutral-400 dark:text-neutral-500">
          © {new Date().getFullYear()} {bio.name}
        </p>
      </div>
    </footer>
  );
}
