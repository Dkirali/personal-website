import { skills, languages } from '@/content/bio';

export function ProSkills() {
  return (
    <section className="bg-white border border-neutral-200 rounded-lg mx-4 p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-neutral-900">Skills</h2>
      <ul className="flex flex-wrap gap-2">
        {skills.map((s) => (
          <li
            key={s}
            className="text-xs px-3 py-1 bg-neutral-100 border border-neutral-200 rounded-full text-neutral-700"
          >
            {s}
          </li>
        ))}
      </ul>

      <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 mt-6 mb-3">
        Languages
      </h3>
      <ul className="text-sm text-neutral-700 space-y-1">
        {languages.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
    </section>
  );
}
