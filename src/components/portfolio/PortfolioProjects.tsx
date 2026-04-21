import Link from 'next/link';
import { projects } from '@/content/projects';

export function PortfolioProjects() {
  const shown = projects.filter((p) => !p.placeholder);
  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-12 text-center">
        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Selected work</p>
        <h2 className="mt-2 text-3xl font-semibold text-neutral-900 md:text-4xl dark:text-neutral-50">
          Personal projects
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <article
            key={p.slug}
            className="group flex flex-col rounded-2xl border border-black/5 bg-white/70 p-6 backdrop-blur transition hover:border-indigo-300 hover:shadow-lg dark:border-white/10 dark:bg-neutral-900/60 dark:hover:border-indigo-500/40"
          >
            <div className="mb-4 flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-pink-400 text-xs font-bold text-white">
                {p.title.slice(0, 2).toUpperCase()}
              </span>
              {p.featured && (
                <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                  Featured
                </span>
              )}
            </div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-50">{p.title}</h3>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{p.tagline}</p>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {p.description}
            </p>
            {p.tech.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {p.tech.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-neutral-200 bg-white px-2 py-0.5 text-[11px] text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-5 flex gap-4 text-sm">
              {p.github && (
                <Link
                  href={p.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  GitHub →
                </Link>
              )}
              <Link
                href={`/dashboard/${p.slug}`}
                className="font-medium text-neutral-700 hover:underline dark:text-neutral-200"
              >
                Case study →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
