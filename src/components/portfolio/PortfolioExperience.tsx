import { experience } from '@/content/experience';
import { education } from '@/content/bio';

export function PortfolioExperience() {
  return (
    <section id="experience" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-12 text-center">
        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Where I&apos;ve been</p>
        <h2 className="mt-2 text-3xl font-semibold text-neutral-900 md:text-4xl dark:text-neutral-50">
          Experience
        </h2>
      </div>

      <ol className="relative border-l border-neutral-200 pl-8 dark:border-neutral-800">
        {experience.map((e) => (
          <li key={e.company + e.start} className="mb-10 ml-2">
            <span className="absolute -left-2 mt-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-pink-400" />
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                {e.role} · <span className="text-indigo-600 dark:text-indigo-400">{e.company}</span>
              </h3>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {e.start} — {e.end ?? 'Present'} · {e.location}
              </span>
            </div>
            <div className="mt-3 space-y-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
              {e.description.split('\n\n').map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </li>
        ))}
      </ol>

      <h3 className="mt-16 mb-6 text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
        Education
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {education.map((ed) => (
          <div
            key={ed.school + ed.start}
            className="rounded-2xl border border-black/5 bg-white/70 p-5 backdrop-blur dark:border-white/10 dark:bg-neutral-900/60"
          >
            <p className="font-semibold text-neutral-900 dark:text-neutral-50">{ed.program}</p>
            <p className="text-sm text-indigo-600 dark:text-indigo-400">{ed.school}</p>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              {ed.start} — {ed.end} · {ed.location}
            </p>
            {ed.description && (
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{ed.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
