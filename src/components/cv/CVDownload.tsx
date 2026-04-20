import Link from 'next/link';

interface CVDownloadProps {
  /** Visual variant — 'pro' for LinkedIn blue, 'dashboard' for Steam green. */
  variant?: 'pro' | 'dashboard';
}

export function CVDownload({ variant = 'pro' }: CVDownloadProps) {
  const styles =
    variant === 'pro'
      ? 'inline-flex items-center gap-2 px-4 py-2 rounded bg-[#0a66c2] text-white text-sm font-medium hover:bg-[#084a8f] transition-colors'
      : 'inline-flex items-center gap-2 px-4 py-2 rounded bg-[#5c7e10] text-white text-sm font-medium hover:bg-[#6fa71a] transition-colors';

  return (
    <Link
      href="/cv.pdf"
      className={styles}
      target="_blank"
      rel="noopener noreferrer"
    >
      ↓ Download CV
    </Link>
  );
}
