/** Colleague reviews — doubles as "Community Reviews" on /dashboard. */

export interface Review {
  id: string;
  name: string;
  initials: string;
  role: string;
  company: string;
  relationship: string;
  body: string;
  verdict: string;
  /** Approximate hours overlapped with Doruk. */
  overlapHours?: number;
  /** "recommend" percentage, surfaced on /dashboard. */
  recommendPct?: number;
  email?: string;
  phone?: string;
}

export const reviews: Review[] = [
  {
    id: 'jim-virgin',
    name: 'Jim Virgin',
    initials: 'JV',
    role: 'Senior Manager',
    company: 'Ingram Micro',
    relationship: '2+ years together',
    body: 'Doruk combined sharp analytical instincts with real ownership. The kind of teammate who makes the whole team look better.',
    verdict: 'Recommended · 10 / 10',
    overlapHours: 4300,
    recommendPct: 98,
    email: 'Jim.Virgin@ingrammicro.com',
    phone: '+1 (416) 697 21 00',
  },
  {
    id: 'sarim-khawaja',
    name: 'Sarim Khawaja',
    initials: 'SK',
    role: 'Senior Security Analyst',
    company: 'Styx Intelligence',
    relationship: '4+ years together',
    body: 'Rare ability to operate at both the strategic and hands-on level. Translated messy requirements into shippable roadmaps.',
    verdict: 'Recommended · 10 / 10',
    overlapHours: 9500,
    recommendPct: 99,
    email: 'sarim.khawaja@styxintel.com',
    phone: '+1 (672) 338 1168',
  },
];
