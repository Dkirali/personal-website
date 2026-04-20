import type { Metadata } from 'next';
import { ProBanner } from '@/components/pro/ProBanner';
import { ProProfileCard } from '@/components/pro/ProProfileCard';
import { ProAbout } from '@/components/pro/ProAbout';
import { ProFeatured } from '@/components/pro/ProFeatured';
import { ProExperience } from '@/components/pro/ProExperience';
import { ProEducation } from '@/components/pro/ProEducation';
import { ProSkills } from '@/components/pro/ProSkills';
import { ProContact } from '@/components/pro/ProContact';
import { ProFooter } from '@/components/pro/ProFooter';
import { bio } from '@/content/bio';

export const metadata: Metadata = {
  title: `${bio.name} — ${bio.title}`,
  description: bio.about.split('\n')[0],
};

export default function ProPage() {
  return (
    <main className="bg-neutral-100 min-h-screen text-neutral-900">
      <ProBanner />
      <div className="max-w-3xl mx-auto space-y-4 pb-6">
        <ProProfileCard />
        <ProAbout />
        <ProFeatured />
        <ProExperience />
        <ProEducation />
        <ProSkills />
        <ProContact />
        <ProFooter />
      </div>
    </main>
  );
}
