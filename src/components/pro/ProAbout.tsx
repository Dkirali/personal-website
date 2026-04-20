import { bio } from '@/content/bio';

export function ProAbout() {
  return (
    <section className="bg-white border border-neutral-200 rounded-lg mx-4 p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-3 text-neutral-900">About</h2>
      <p className="text-sm text-neutral-700 whitespace-pre-line leading-relaxed">
        {bio.about}
      </p>
    </section>
  );
}
