import { bio, skills, languages } from '@/content/bio';

export function PortfolioAbout() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-12 text-center">
        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">My story</p>
        <h2 className="mt-2 text-3xl font-semibold text-neutral-900 md:text-4xl dark:text-neutral-50">About</h2>
      </div>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
        <div className="md:col-span-3">
          {bio.about.split('\n\n').map((p, i) => (
            <p key={i} className="mb-4 text-neutral-600 dark:text-neutral-300">
              {p}
            </p>
          ))}
        </div>
        <aside className="md:col-span-2">
          <div className="rounded-2xl border border-black/5 bg-white/60 p-6 backdrop-blur dark:border-white/10 dark:bg-neutral-900/60">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              Skills
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {skills.slice(0, 10).map((s) => (
                <li
                  key={s}
                  className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                >
                  {s}
                </li>
              ))}
            </ul>
            <h3 className="mt-6 text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              Languages
            </h3>
            <ul className="mt-3 space-y-1 text-sm text-neutral-700 dark:text-neutral-200">
              {languages.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
