'use client';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

const links = [
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
];

export function PortfolioNav() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/5 bg-white/60 backdrop-blur-lg dark:border-white/5 dark:bg-neutral-950/60">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/pro" className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-pink-400 text-xs font-bold text-white">
            D
          </span>
          Doruk
        </Link>
        <ul className="hidden items-center gap-7 text-sm text-neutral-600 md:flex dark:text-neutral-300">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="transition hover:text-indigo-600 dark:hover:text-indigo-400">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <Link
            href="/cv.pdf"
            className="hidden rounded-full bg-neutral-900 px-4 py-2 text-xs font-medium text-white transition hover:bg-neutral-700 sm:inline-block dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Download CV
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
