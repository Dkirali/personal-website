import { experience } from '@/content/experience';
import { internships } from '@/content/experience';

export function PortfolioEmployers() {
  const all = [
    ...experience.map((e) => e.company),
    ...internships.map((i) => i.company),
  ];
  const unique = Array.from(new Set(all));

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-10 text-center">
        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Featured</p>
        <h2 className="mt-2 text-3xl font-semibold text-neutral-900 md:text-4xl dark:text-neutral-50">
          Past employers
        </h2>
      </div>
      <ul className="grid grid-cols-2 divide-x divide-y divide-neutral-200 overflow-hidden rounded-2xl border border-neutral-200 bg-white/60 backdrop-blur sm:grid-cols-3 md:grid-cols-4 dark:divide-neutral-800 dark:border-neutral-800 dark:bg-neutral-900/60">
        {unique.map((name) => (
          <li
            key={name}
            className="flex h-24 items-center justify-center px-4 text-center text-sm font-medium text-neutral-700 transition hover:text-indigo-600 dark:text-neutral-200 dark:hover:text-indigo-400"
          >
            {name}
          </li>
        ))}
      </ul>
    </section>
  );
}
