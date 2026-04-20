import { bio } from '@/content/bio';

export function ProContact() {
  return (
    <section
      id="contact"
      className="bg-white border border-neutral-200 rounded-lg mx-4 p-6 shadow-sm"
    >
      <h2 className="text-xl font-semibold mb-3 text-neutral-900">Contact</h2>
      <p className="text-sm text-neutral-500 mb-4">
        Form wired up in Phase 5. In the meantime, reach me directly:
      </p>
      <ul className="text-sm text-neutral-700 space-y-2">
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
