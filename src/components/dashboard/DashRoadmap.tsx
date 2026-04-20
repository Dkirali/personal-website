interface RoadmapItem {
  title: string;
  sub: string;
}

const items: RoadmapItem[] = [
  { title: 'v2 · Jobbot', sub: 'Public release + OSS' },
  { title: 'New role', sub: 'PM / Product Ops · AI-native SaaS' },
  { title: 'Blog', sub: 'Product ops field notes' },
  { title: 'Cert', sub: 'AWS Solutions Architect' },
];

export function DashRoadmap() {
  return (
    <section>
      <div className="section-heading">
        <h3>Roadmap · Coming Soon</h3>
        <span className="meta">early-access builds, wishlists &amp; what&apos;s brewing</span>
      </div>
      <div className="roadmap">
        <div className="roadmap-items">
          {items.map((it) => (
            <div key={it.title} className="rm">
              <div className="rm-title">{it.title}</div>
              <div className="rm-sub">{it.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
