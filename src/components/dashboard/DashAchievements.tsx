import { achievements } from '@/content/achievements';

export function DashAchievements() {
  const unlocked = achievements.filter((a) => !a.locked).length;
  const total = achievements.length;
  const pct = Math.round((unlocked / total) * 100);
  return (
    <section>
      <div className="section-heading">
        <h3>Achievements</h3>
        <span className="meta">
          {unlocked} of {total} unlocked · rare 🏆 equipped
        </span>
      </div>
      <div className="achievements">
        <div className="ach-header">
          <span className="sub">GLOBAL + PERSONAL MILESTONES</span>
          <div className="ach-progress">
            <span>{pct}%</span>
            <div className="bar">
              <div style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
        <div className="ach-grid">
          {achievements.map((a) => (
            <div key={a.id} className={`ach${a.locked ? ' locked' : ''}`}>
              <div className="ach-icon">{a.locked ? '🔒' : a.icon}</div>
              <div className="ach-text">
                <div className="ach-title">{a.title}</div>
                <div className="ach-desc">{a.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
