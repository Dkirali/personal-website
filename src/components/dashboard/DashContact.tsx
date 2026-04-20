import { ContactForm } from '@/components/contact/ContactForm';
import { CVDownload } from '@/components/cv/CVDownload';

export function DashContact() {
  return (
    <div id="contact" className="cta-row">
      <div className="cta-card">
        <h4>📮 Send me a message</h4>
        <p>Reach out for roles, collabs, or to swap game recommendations.</p>
        <ContactForm variant="dashboard" />
      </div>
      <div className="cta-card">
        <h4>📄 Download full CV</h4>
        <p>PDF · updated Jan 2026 · the recruiter-safe version.</p>
        <CVDownload variant="dashboard" />
      </div>
    </div>
  );
}
