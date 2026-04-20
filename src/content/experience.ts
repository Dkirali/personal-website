/** Professional experience timeline — used on /pro and /dashboard "Hours Played". */

export interface ExperienceItem {
  role: string;
  company: string;
  location: string;
  start: string;
  end: string | null; // null = present
  description: string;
  /** Approximate total hours (Steam-pastiche "playtime"). */
  hours?: number;
  gradient?: [string, string]; // for /dashboard cover tile
  initials?: string;
}

export const experience: ExperienceItem[] = [
  {
    role: 'Product Operations Manager',
    company: 'Styx Intelligence',
    location: 'Vancouver, Canada',
    start: 'Sep 2021',
    end: 'Jan 2026',
    hours: 9500,
    initials: 'SI',
    gradient: ['#2a475e', '#66c0f4'],
    description:
      'Scaled a cross-functional engineering team from 2 to 17 members while overseeing end-to-end cybersecurity platform development and maintaining hands-on contributions to the codebase.\n\nOwned product roadmaps, sprint planning, and backlog prioritization — translating business requirements into clear user stories and acceptance criteria to deliver 25+ major initiatives on time.\n\nServed as primary liaison between engineering, design, and business stakeholders, collaborating with customers and partners to align product features with user needs and long-term strategy.',
  },
  {
    role: 'Senior Sales Support',
    company: 'Ingram Micro',
    location: 'Toronto, Canada',
    start: 'Dec 2018',
    end: 'Jan 2021',
    hours: 4300,
    initials: 'IM',
    gradient: ['#7c2d12', '#f59e0b'],
    description:
      "Managed Dell's third-party product portfolio by forecasting demand, analyzing market trends, and identifying new vendors to expand product offerings — driving increased website traffic.\n\nCollaborated with vendors and cross-functional teams to develop targeted promotions for Dell's key customer segments, ensuring strategic alignment across sales, marketing, and product teams.\n\nOptimized inventory management through process improvements and demand forecasting, reducing stockouts by 10% and enhancing product availability for key customers.",
  },
  {
    role: 'Retail Marketing Coordinator',
    company: 'Mosaic North America',
    location: 'Toronto, Canada',
    start: 'Aug 2018',
    end: 'Oct 2018',
    hours: 560,
    initials: 'MO',
    gradient: ['#065f46', '#10b981'],
    description:
      "Customer Insights & Product Positioning: gathered and analyzed customer data to inform marketing strategies and product positioning for clients' newest products in Shoppers Drug Mart stores.\n\nCoordinated and trained Brand Ambassadors across Canada to deliver key product messages, ensuring consistent communication of product value propositions.",
  },
];

export interface Internship {
  role: string;
  company: string;
  location: string;
  start: string;
  end: string;
  description: string;
}

export const internships: Internship[] = [
  {
    role: 'Planning & Strategy Intern',
    company: 'Borusan Group',
    location: 'Istanbul, Türkiye',
    start: 'Jun 2016',
    end: 'Aug 2016',
    description:
      "Developed new strategies for expanding the company's logistics throughout the Middle East. Conducted market research and analyzed trends in connecting machinery and tech.",
  },
  {
    role: 'Sales Intern',
    company: 'Hometex & Floorex',
    location: 'Toronto, Canada',
    start: 'Jun 2015',
    end: 'Aug 2015',
    description:
      "As part of the H&F sales team, worked on acquiring new sellers for the company's Canadian textile trade show, further extending H&F's client portfolio.",
  },
  {
    role: 'Marketing & Sales Intern',
    company: 'Coca-Cola Bottling',
    location: 'Istanbul, Türkiye',
    start: 'Jun 2014',
    end: 'Aug 2014',
    description:
      'Proposed and helped execute the development of the 150 ml bottle size through market analysis. Liaised with a variety of clients to learn about product distribution and consumer insights.',
  },
];
