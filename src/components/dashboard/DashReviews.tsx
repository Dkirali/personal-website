import { reviews } from '@/content/reviews';

export function DashReviews() {
  return (
    <section>
      <div className="section-heading">
        <h3>Community Reviews</h3>
        <span className="meta">Verified colleagues · see full references on request</span>
      </div>
      <div className="reviews">
        {reviews.map((r) => (
          <div key={r.id} className="review">
            <div className="head">
              <div className="pfp">{r.initials}</div>
              <div>
                <div className="who">{r.name}</div>
                <div className="who-sub">
                  {r.role} · {r.company} · {r.relationship}
                </div>
              </div>
            </div>
            <div className="verdict">✅ {r.verdict}</div>
            <div className="body">&ldquo;{r.body}&rdquo;</div>
            <div className="meta-line">
              Playtime together: ~{r.overlapHours?.toLocaleString('en-US')} hrs ·{' '}
              {r.recommendPct}% recommend
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
