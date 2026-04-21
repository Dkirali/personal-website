import { bio } from '@/content/bio';
import { ContactForm } from '@/components/contact/ContactForm';

export function PortfolioContact() {
  return (
    <section id="contact" className="relative overflow-hidden py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-[420px] w-[420px] rounded-full bg-indigo-200/70 blur-3xl dark:bg-indigo-500/10" />
        <div className="absolute right-0 bottom-0 h-[420px] w-[420px] rounded-full bg-pink-200/70 blur-3xl dark:bg-pink-500/10" />
      </div>
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Get in touch</p>
          <h2 className="mt-2 text-3xl font-semibold text-neutral-900 md:text-4xl dark:text-neutral-50">
            Let&apos;s talk
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              Direct
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-neutral-700 dark:text-neutral-200">
              <li>
                <a href={`mailto:${bio.email}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  {bio.email}
                </a>
              </li>
              <li>
                <a
                  href={bio.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  {bio.linkedin.replace('https://', '')}
                </a>
              </li>
              <li className="text-neutral-500 dark:text-neutral-400">{bio.location}</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              Send a message
            </h3>
            <div className="mt-4">
              <ContactForm variant="portfolio" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
