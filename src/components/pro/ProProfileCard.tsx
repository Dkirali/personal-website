import { ProfilePhoto } from '@/components/profile/ProfilePhoto';
import { CVDownload } from '@/components/cv/CVDownload';
import { bio } from '@/content/bio';

export function ProProfileCard() {
  return (
    <section className="bg-white border border-neutral-200 rounded-lg -mt-20 mx-4 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-end gap-6">
        <ProfilePhoto
          size={160}
          className="border-4 border-white -mt-20 sm:-mt-16 shadow-md"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-neutral-900">
            {bio.name}
          </h1>
          <p className="text-neutral-700">{bio.title}</p>
          <p className="text-sm text-neutral-500">{bio.location}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="#contact"
              className="px-4 py-2 rounded-full bg-[#0a66c2] text-white text-sm font-medium hover:bg-[#084a8f] transition-colors"
            >
              Contact
            </a>
            <CVDownload variant="pro" />
            <a
              href={bio.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full border border-neutral-300 text-neutral-700 text-sm font-medium hover:bg-neutral-50 transition-colors"
            >
              LinkedIn →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
