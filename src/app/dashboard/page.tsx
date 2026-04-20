import '@/components/dashboard/dashboard.css';
import { DashNav } from '@/components/dashboard/DashNav';
import { DashProfile } from '@/components/dashboard/DashProfile';
import { DashFeatured } from '@/components/dashboard/DashFeatured';
import { DashLibrary } from '@/components/dashboard/DashLibrary';
import { DashAchievements } from '@/components/dashboard/DashAchievements';
import { DashTimeline } from '@/components/dashboard/DashTimeline';
import { DashReviews } from '@/components/dashboard/DashReviews';
import { DashRoadmap } from '@/components/dashboard/DashRoadmap';
import { DashContact } from '@/components/dashboard/DashContact';
import { DashFooter } from '@/components/dashboard/DashFooter';

export const metadata = {
  title: 'Doruk Kırali · Dashboard',
  description: 'Steam-style portfolio dashboard.',
};

export default function DashboardPage() {
  return (
    <div className="steam">
      <div className="banner-note">
        MOCKUP PREVIEW · NOT FINAL · shows the Steam pastiche concept applied to real data
      </div>
      <DashNav />
      <main>
        <div className="profile">
          <DashProfile />
          <DashFeatured />
        </div>
        <DashLibrary />
        <DashAchievements />
        <DashTimeline />
        <DashReviews />
        <DashRoadmap />
        <DashContact />
      </main>
      <DashFooter />
    </div>
  );
}
