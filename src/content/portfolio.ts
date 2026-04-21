/** Portfolio-page copy: stats + services shown on /pro. */

export interface Stat {
  value: string;
  label: string;
}

export const stats: Stat[] = [
  { value: '+8', label: 'Years of experience' },
  { value: '+25', label: 'Initiatives delivered' },
  { value: '+17', label: 'Engineers scaled' },
  { value: '+3', label: 'Industries spanned' },
];

export interface Service {
  title: string;
  description: string;
  icon: 'product' | 'code' | 'strategy' | 'insights';
}

export const services: Service[] = [
  {
    title: 'Product Operations',
    description:
      'Own roadmaps, sprint planning, and backlog prioritization. Translate business needs into user stories engineers can ship.',
    icon: 'product',
  },
  {
    title: 'Full-Stack Web',
    description:
      'TypeScript, React, Next.js, Node. Modern, typed, tested web apps — hands-on with the code, not just the spec.',
    icon: 'code',
  },
  {
    title: 'Agile Leadership',
    description:
      'Scrum and agile delivery across cross-functional teams. Scaled an engineering org from 2 to 17 while shipping 25+ initiatives on time.',
    icon: 'strategy',
  },
  {
    title: 'Market & Customer Insights',
    description:
      'Market research, competitive analysis, and customer data that grounds product positioning in real demand — not guesswork.',
    icon: 'insights',
  },
];
