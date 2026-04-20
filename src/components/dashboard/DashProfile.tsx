import { ProfilePhoto } from '@/components/profile/ProfilePhoto';
import { CVDownload } from '@/components/cv/CVDownload';
import { bio } from '@/content/bio';

export function DashProfile() {
  return (
    <div className="profile-card">
      <div className="level-bar">
        <div className="level-badge">LVL 33</div>
        <div className="xp">
          <div />
        </div>
        <span style={{ color: 'var(--text-dim)', fontSize: 10 }}>1,240 / 1,600 XP</span>
      </div>
      <div className="profile-body">
        <ProfilePhoto size={128} className="rounded-none border-[3px] border-[#66c0f4] p-[2px] bg-black shrink-0" />
        <div className="profile-meta">
          <div className="name">{bio.name}</div>
          <div className="handle">@doruk-kirali · #0033</div>
          <div className="status">
            <span className="status-dot" />
            Currently playing: Life · {bio.location}
          </div>
          <div className="loc">{bio.title}</div>
        </div>
      </div>
      <div className="profile-actions">
        <a className="btn cta" href="#contact">▶ Send Message</a>
        <CVDownload variant="dashboard" />
        <a className="btn" href="https://github.com/Dkirali" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a className="btn" href={bio.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </div>
    </div>
  );
}
