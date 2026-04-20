import { ContactForm } from '@/components/contact/ContactForm';
import { bio } from '@/content/bio';

export function ProContact() {
  return (
    <section
      id="contact"
      className="bg-white border border-neutral-200 rounded-lg mx-4 p-6 shadow-sm"
    >
      <h2 className="text-xl font-semibold mb-4 text-neutral-900">Contact</h2>
      <ContactForm variant="pro" />
      <ul className="mt-6 text-sm text-neutral-700 space-y-2 border-t border-neutral-200 pt-4">
        <li>
          <span className="text-neutral-500">Email · </span>
          <a
            href={`mailto:${bio.email}`}
            className="text-[#0a66c2] hover:underline"
          >
            {bio.email}
          </a>
        </li>
        <li>
          <span className="text-neutral-500">LinkedIn · </span>
          <a
            href={bio.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0a66c2] hover:underline"
          >
            {bio.linkedin.replace(/^https?:\/\//, '')}
          </a>
        </li>
      </ul>
    </section>
  );
}
