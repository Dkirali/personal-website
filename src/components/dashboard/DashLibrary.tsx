import Link from 'next/link';
import { projects, type Project } from '@/content/projects';

const artClassBySlug: Record<string, string> = {
  jobbot: 'art-jobbot',
  flow: 'art-flow',
  'productivity-rewards': 'art-todo',
};

function artTitle(p: Project): string {
  if (p.slug === 'jobbot') return 'JOB\nBOT';
  if (p.slug === 'flow') return 'FLŌW';
  if (p.slug === 'productivity-rewards') return 'TODO\n+XP';
  return 'COMING\nSOON';
}

function Stars({ n }: { n: number }) {
  const full = '★'.repeat(n);
  const empty = '☆'.repeat(Math.max(0, 5 - n));
  return <span className="stars">{full + empty}</span>;
}

export function DashLibrary() {
  return (
    <section>
      <div className="section-heading">
        <h3>Your Library</h3>
        <span className="meta">
          {projects.filter((p) => !p.placeholder).length} items · sorted by Recently Updated
        </span>
      </div>
      <div className="library">
        {projects.map((p) => {
          const artClass = p.placeholder
            ? 'art-placeholder'
            : artClassBySlug[p.slug] ?? '';
          const inner = (
            <>
              <div className={`game-art ${artClass}`}>
                <div
                  className="title"
                  style={p.placeholder ? { fontSize: 14, color: '#666' } : undefined}
                >
                  {artTitle(p).split('\n').map((line, i, arr) => (
                    <span key={i}>
                      {line}
                      {i < arr.length - 1 && <br />}
                    </span>
                  ))}
                </div>
              </div>
              <div className="game-body">
                <div
                  className="game-title"
                  style={p.placeholder ? { color: 'var(--text-dim)' } : undefined}
                >
                  {p.title}
                </div>
                <div className="game-sub">{p.tagline}</div>
                {p.tech.length > 0 && (
                  <div className="game-tags">
                    {p.tech.slice(0, 2).map((t, i) => (
                      <span key={t} className={`tag${i === 1 ? ' lang' : ''}`}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                {!p.placeholder && (
                  <div className="game-meta">
                    <Stars n={p.stars ?? 4} />
                    <span>{p.updated ?? '—'}</span>
                  </div>
                )}
              </div>
            </>
          );
          if (p.placeholder) {
            return (
              <div key={p.slug} className="game-card" aria-disabled>
                {inner}
              </div>
            );
          }
          return (
            <Link
              key={p.slug}
              href={`/dashboard/${p.slug}`}
              className="game-card"
            >
              {inner}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
