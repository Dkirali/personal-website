import Link from 'next/link';

export function ProFooter() {
  return (
    <footer className="py-10 text-center text-xs text-neutral-400">
      <Link
        href="/reset"
        className="hover:text-neutral-600 underline transition-colors"
      >
        wait, was there a game? →
      </Link>
    </footer>
  );
}
