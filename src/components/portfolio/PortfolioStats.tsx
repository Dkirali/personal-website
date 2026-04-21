import { stats } from '@/content/portfolio';

export function PortfolioStats() {
  return (
    <section className="mx-auto -mt-8 max-w-6xl px-6">
      <div className="grid grid-cols-2 gap-4 rounded-2xl border border-black/5 bg-white/60 p-6 backdrop-blur md:grid-cols-4 dark:border-white/10 dark:bg-neutral-900/60">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <path d="M22 4 12 14.01l-3-3" />
              </svg>
            </div>
            <div>
              <p className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">{s.value}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
