import Link from 'next/link';
import { projects } from '@/content/projects';

export function DashFeatured() {
  const feat = projects.find((p) => p.featured);
  if (!feat) return null;
  return (
    <div className="featured">
      <div
        className="hero-art"
        data-title={feat.title.toUpperCase()}
        data-tag="AI · AUTOMATION · EASY APPLY"
      />
      <div className="hero-body">
        <div className="eyebrow">FEATURED BUILD · TOP PROJECT</div>
        <h2>{feat.title}</h2>
        <p>{feat.description}</p>
        <div className="review-row">
          <span className="pos">Very Positive</span>
          <span style={{ color: 'var(--text-dim)' }}>
            · 100% of early testers recommend this tool
          </span>
        </div>
        <div className="tag-row">
          {feat.tech.map((t, i) => (
            <span key={t} className={`tag${i >= 2 ? ' lang' : ''}`}>
              {t}
            </span>
          ))}
        </div>
        <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
          {feat.github && (
            <Link
              href={feat.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn cta"
            >
              ▶ Install from GitHub
            </Link>
          )}
          <button type="button" className="btn">+ Wishlist</button>
        </div>
      </div>
    </div>
  );
}
