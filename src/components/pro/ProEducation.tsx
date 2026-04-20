import { education, certificates } from '@/content/bio';

export function ProEducation() {
  return (
    <section className="bg-white border border-neutral-200 rounded-lg mx-4 p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-neutral-900">Education</h2>
      <ul className="space-y-4">
        {education.map((e) => (
          <li key={`${e.school}-${e.start}`}>
            <p className="font-medium text-neutral-900">{e.program}</p>
            <p className="text-sm text-neutral-700">{e.school}</p>
            <p className="text-xs text-neutral-500 mt-0.5">
              {e.start} – {e.end} · {e.location}
            </p>
            {e.description && (
              <p className="text-sm text-neutral-700 mt-1.5 leading-relaxed">
                {e.description}
              </p>
            )}
          </li>
        ))}
      </ul>

      <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 mt-6 mb-3">
        Certificates
      </h3>
      <ul className="space-y-2">
        {certificates.map((c) => (
          <li key={c.name} className="text-sm text-neutral-700">
            <span className="font-medium text-neutral-900">{c.name}</span>
            <span className="text-neutral-500"> · {c.issuer}</span>
            <span className="text-neutral-400 text-xs"> · {c.date}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
