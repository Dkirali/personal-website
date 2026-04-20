import { CVDownload } from '@/components/cv/CVDownload';

export function DashContact() {
  return (
    <div id="contact" className="cta-row">
      <div className="cta-card">
        <h4>📮 Send me a message</h4>
        <p>Reach out for roles, collabs, or to swap game recommendations.</p>
        <button type="button" className="btn cta">
          Open Message Form
        </button>
      </div>
      <div className="cta-card">
        <h4>📄 Download full CV</h4>
        <p>PDF · updated Jan 2026 · the recruiter-safe version.</p>
        <CVDownload variant="dashboard" />
      </div>
    </div>
  );
}
