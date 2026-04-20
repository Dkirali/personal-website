/** Projects — shared between /pro "Featured" and /dashboard "Your Library". */

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  tech: string[];
  github?: string;
  /** Approximate hours invested — surfaced on /dashboard. */
  hoursPlayed?: number;
  /** Star rating (1–5) shown on /dashboard library tiles. */
  stars?: number;
  /** Comma-phrase for "Updated…" e.g. "2d ago". */
  updated?: string;
  featured?: boolean;
  /** Optional "coming soon" / placeholder flag. */
  placeholder?: boolean;
}

export const projects: Project[] = [
  {
    slug: 'jobbot',
    title: 'Jobbot',
    tagline: 'Local automation tool that applies to LinkedIn Easy Apply jobs for you',
    description:
      'Tailors your resume per posting using Claude AI, tracks all applications in a dashboard, and stops itself if LinkedIn detects automation. 100% of early testers recommend this tool.',
    tech: ['TypeScript', 'Claude API', 'Playwright', 'AI Agent'],
    github: 'https://github.com/Dkirali/Automated-Application',
    hoursPlayed: 480,
    stars: 5,
    updated: '2d ago',
    featured: true,
  },
  {
    slug: 'flow',
    title: 'FLŌW',
    tagline: 'Smart budget tracking — learn your spending habits and decide smarter',
    description:
      'Personal finance app that unifies budgeting and habit tracking in one daily flow. Surfaces spending patterns so you can course-correct before the month is already gone.',
    tech: ['TypeScript', 'React Native', 'Finance'],
    hoursPlayed: 220,
    stars: 4,
    updated: '1w ago',
  },
  {
    slug: 'productivity-rewards',
    title: 'Productivity Rewards',
    tagline: 'Gamified task app — complete goals, unlock self-defined rewards',
    description:
      'Todo + XP system that lets you define your own rewards and only unlocks them once you finish the tasks you committed to. Makes short-term discipline feel earned.',
    tech: ['TypeScript', 'Gamified'],
    hoursPlayed: 140,
    stars: 4,
    updated: '3w ago',
  },
  {
    slug: 'project-four',
    title: 'Project #4',
    tagline: 'Your next build. Early Access TBD.',
    description: 'Coming soon.',
    tech: [],
    placeholder: true,
  },
];
