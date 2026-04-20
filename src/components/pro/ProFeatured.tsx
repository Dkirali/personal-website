import Link from 'next/link';
import { projects } from '@/content/projects';

export function ProFeatured() {
  const featured = projects.filter((p) => p.featured && !p.placeholder);
  const rest = projects.filter((p) => !p.featured && !p.placeholder);

  return (
    <section className="bg-white border border-neutral-200 rounded-lg mx-4 p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-neutral-900">Projects</h2>
      <ul className="grid gap-4 sm:grid-cols-2">
        {[...featured, ...rest].map((p) => (
          <li
            key={p.slug}
            className="border border-neutral-200 rounded p-4 hover:border-[#0a66c2] transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-medium text-neutral-900">{p.title}</h3>
              {p.featured && (
                <span className="text-[10px] px-2 py-0.5 bg-[#0a66c2] text-white rounded-full uppercase tracking-wide">
                  Featured
                </span>
              )}
            </div>
            <p className="text-sm text-neutral-500 mt-1">{p.tagline}</p>
            <p className="text-sm text-neutral-700 mt-2 leading-relaxed">
              {p.description}
            </p>
            {p.tech.length > 0 && (
              <ul className="flex flex-wrap gap-1.5 mt-3">
                {p.tech.map((t) => (
                  <li
                    key={t}
                    className="text-[11px] px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            )}
            {p.github && (
              <Link
                href={p.github}
                className="text-[#0a66c2] text-sm mt-3 inline-block hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub →
              </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
