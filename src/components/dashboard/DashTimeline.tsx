import { experience, internships } from '@/content/experience';

function formatHours(h: number | undefined): string {
  if (!h) return '—';
  return `~${h.toLocaleString('en-US')} hrs`;
}

export function DashTimeline() {
  const rows = experience.map((e, i) => ({
    key: `${e.company}-${e.start}`,
    initials: e.initials ?? e.company.slice(0, 2).toUpperCase(),
    gradient: e.gradient ?? (['#44403c', '#a8a29e'] as [string, string]),
    name: e.company,
    role: `${e.role} · ${e.location}`,
    hours: e.hours,
    span: `${e.start} – ${e.end ?? 'Present'}`,
    current: i === 0,
  }));
  const totalHours = experience.reduce((n, e) => n + (e.hours ?? 0), 0) +
    internships.reduce((n) => n + 1040 / 3, 0); // internships summary bucket
  const internHours = internships.length > 0 ? 1040 : 0;
  return (
    <section>
      <div className="section-heading">
        <h3>Hours Played</h3>
        <span className="meta">
          Work experience · total {(Math.round(totalHours / 100) * 100).toLocaleString('en-US')} hrs
        </span>
      </div>
      <div className="playtime">
        {rows.map((r) => (
          <div key={r.key} className={`pt-row${r.current ? ' current' : ''}`}>
            <div
              className="pt-cover"
              style={{ background: `linear-gradient(135deg, ${r.gradient[0]}, ${r.gradient[1]})` }}
            >
              {r.initials}
            </div>
            <div>
              <div className="pt-name">{r.name}</div>
              <div className="pt-role">{r.role}</div>
            </div>
            <div className="pt-hours">{formatHours(r.hours)}</div>
            <div className="pt-last">{r.span}</div>
          </div>
        ))}
        {internships.length > 0 && (
          <div className="pt-row">
            <div
              className="pt-cover"
              style={{ background: 'linear-gradient(135deg, #44403c, #a8a29e)', color: '#000' }}
            >
              INT
            </div>
            <div>
              <div className="pt-name">
                Internships · {internships.map((i) => i.company).join(', ')}
              </div>
              <div className="pt-role">Planning, Sales, Marketing · Istanbul / Toronto</div>
            </div>
            <div className="pt-hours">{formatHours(internHours)}</div>
            <div className="pt-last">2014 – 2016</div>
          </div>
        )}
      </div>
    </section>
  );
}
