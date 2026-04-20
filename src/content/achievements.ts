/** Achievements — Steam-pastiche unlocks shown on /dashboard. */

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  locked?: boolean;
}

export const achievements: Achievement[] = [
  {
    id: 'team-builder',
    title: 'Team Builder',
    description: 'Scaled engineering team from 2 → 17 @ Styx',
    icon: '🧑\u200d🤝\u200d🧑',
  },
  {
    id: 'shipped',
    title: 'Shipped',
    description: 'Delivered 25+ major initiatives on time',
    icon: '📦',
  },
  {
    id: 'ivy-league',
    title: 'Ivy League',
    description: 'CS50 · Harvard University',
    icon: '🎓',
  },
  {
    id: 'python-apprentice',
    title: 'Python Apprentice',
    description: 'Python Data Structures · University of Michigan',
    icon: '🐍',
  },
  {
    id: 'translator',
    title: 'Translator',
    description: 'Bridged technical teams + business stakeholders',
    icon: '🧭',
  },
  {
    id: 'veteran',
    title: 'Veteran',
    description: '4+ years as Product Operations Manager',
    icon: '⏳',
  },
  {
    id: 'bilingual',
    title: 'Bilingual',
    description: 'Turkish · English (native)',
    icon: '🌍',
  },
  {
    id: 'operator',
    title: 'Operator',
    description: 'Owned roadmaps, sprints & backlog at Styx',
    icon: '📊',
  },
  {
    id: 'first-hire',
    title: 'First Hire',
    description: 'Accept first offer in new role',
    icon: '🔒',
    locked: true,
  },
  {
    id: 'product-launch',
    title: 'Product Launch',
    description: 'Ship a public SaaS v1.0',
    icon: '🔒',
    locked: true,
  },
  {
    id: 'speedrun',
    title: 'Speedrun',
    description: 'Ship a side project in under 30 days',
    icon: '🔒',
    locked: true,
  },
  {
    id: 'open-source',
    title: 'Open Source',
    description: '100 GitHub stars on any repo',
    icon: '🔒',
    locked: true,
  },
];
