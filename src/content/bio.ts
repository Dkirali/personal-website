/** Personal bio — shared between /pro and /dashboard. */

export interface Bio {
  name: string;
  title: string;
  location: string;
  email: string;
  linkedin: string;
  phone: string;
  about: string;
}

export const bio: Bio = {
  name: 'Doruk Kırali',
  title: 'Product Operations Manager → Web Developer',
  location: 'Vancouver, Canada · open to remote',
  email: 'kiralidoruk@gmail.com',
  linkedin: 'https://linkedin.com/in/doruk-kirali',
  phone: '+90 (532) 286 04 61',
  about:
    'Problem-solver with cross-functional experience in marketing, sales, and technical domains. I translate complex client needs into strategic product solutions and bridge communication between technical teams and business stakeholders — driving product development that aligns with market demand and user expectations.\n\nCurrently transitioning from Product Operations into full-stack web development. Passionate about turning logical thinking into user-centric applications.',
};

export const skills: string[] = [
  'Python',
  'JavaScript',
  'TypeScript',
  'SQL',
  'Next.js',
  'React',
  'Node.js',
  'Product lifecycle management',
  'Agile & Scrum',
  'Roadmapping & prioritization',
  'Stakeholder management',
  'Market research',
  'Jira',
  'Notion',
  'Excel (Advanced)',
  'PowerPoint (Advanced)',
];

export const languages: readonly string[] = [
  'Turkish — Native',
  'English — Native',
];

export const certificates: { name: string; issuer: string; date: string }[] = [
  { name: 'Python Data Structures', issuer: 'University of Michigan', date: 'April 2021' },
  { name: 'CS50: Intro to Computer Science', issuer: 'Harvard', date: 'January 2021' },
  { name: 'Digital Marketing', issuer: 'BrainStation', date: 'April 2018' },
];

export const education: {
  program: string;
  school: string;
  location: string;
  start: string;
  end: string;
  description?: string;
}[] = [
  {
    program: 'Web Development Bootcamp',
    school: 'BrainStation',
    location: 'Toronto, Canada',
    start: '2020',
    end: '2021',
    description:
      'Full-stack web development — HTML/CSS, JavaScript, React, Node.js.',
  },
  {
    program: "Bachelor's in Marketing Management",
    school: 'University of Guelph',
    location: 'Guelph, Canada',
    start: '2013',
    end: '2017',
    description:
      'Specialization in Commerce.',
  },
];
