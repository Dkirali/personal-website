import Link from 'next/link';

export function DashFooter() {
  return (
    <footer>
      <div>© 2026 Doruk Kırali · Built with care. Steam-esque styling is a pastiche — not affiliated with Valve.</div>
      <Link href="/pro" className="reset-link">
        switch to boring mode →
      </Link>
      <div style={{ marginTop: 6 }}>
        <Link href="/reset" className="reset-link">
          replay the Pong game →
        </Link>
      </div>
    </footer>
  );
}
