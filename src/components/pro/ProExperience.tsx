import { experience, internships } from '@/content/experience';

export function ProExperience() {
  return (
    <section className="bg-white border border-neutral-200 rounded-lg mx-4 p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-neutral-900">Experience</h2>
      <ul className="space-y-6">
        {experience.map((e) => (
          <li key={`${e.company}-${e.start}`}>
            <h3 className="font-medium text-neutral-900">
              {e.role} · <span className="text-neutral-700">{e.company}</span>
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              {e.start} – {e.end ?? 'Present'} · {e.location}
            </p>
            <p className="text-sm text-neutral-700 mt-2 whitespace-pre-line leading-relaxed">
              {e.description}
            </p>
          </li>
        ))}
      </ul>

      <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 mt-8 mb-3">
        Internships
      </h3>
      <ul className="space-y-4">
        {internships.map((i) => (
          <li key={`${i.company}-${i.start}`}>
            <p className="font-medium text-neutral-900 text-sm">
              {i.role} · <span className="text-neutral-700">{i.company}</span>
            </p>
            <p className="text-xs text-neutral-500 mt-0.5">
              {i.start} – {i.end} · {i.location}
            </p>
            <p className="text-sm text-neutral-700 mt-1.5 leading-relaxed">
              {i.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
