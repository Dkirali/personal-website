import type { Metadata } from 'next';
import { bio } from '@/content/bio';
import { PortfolioNav } from '@/components/portfolio/PortfolioNav';
import { PortfolioHero } from '@/components/portfolio/PortfolioHero';
import { PortfolioStats } from '@/components/portfolio/PortfolioStats';
import { PortfolioAbout } from '@/components/portfolio/PortfolioAbout';
import { PortfolioServices } from '@/components/portfolio/PortfolioServices';
import { PortfolioExperience } from '@/components/portfolio/PortfolioExperience';
import { PortfolioProjects } from '@/components/portfolio/PortfolioProjects';
import { PortfolioEmployers } from '@/components/portfolio/PortfolioEmployers';
import { PortfolioContact } from '@/components/portfolio/PortfolioContact';
import { PortfolioFooter } from '@/components/portfolio/PortfolioFooter';

export const metadata: Metadata = {
  title: `${bio.name} — ${bio.title}`,
  description: bio.about.split('\n')[0],
};

export default function ProPage() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <PortfolioNav />
      <main>
        <PortfolioHero />
        <PortfolioStats />
        <PortfolioAbout />
        <PortfolioServices />
        <PortfolioExperience />
        <PortfolioProjects />
        <PortfolioEmployers />
        <PortfolioContact />
      </main>
      <PortfolioFooter />
    </div>
  );
}
