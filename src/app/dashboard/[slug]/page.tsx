import '@/components/dashboard/dashboard.css';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projects } from '@/content/projects';
import { DashNav } from '@/components/dashboard/DashNav';
import { DashFooter } from '@/components/dashboard/DashFooter';

export function generateStaticParams() {
  return projects
    .filter((p) => !p.placeholder)
    .map((p) => ({ slug: p.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: 'Not found' };
  return {
    title: `${project.title} · Doruk Kırali`,
    description: project.tagline,
  };
}

export default async function ProjectDetail({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project || project.placeholder) notFound();

  return (
    <div className="steam">
      <DashNav />
      <main>
        <header style={{ marginBottom: 16 }}>
          <h1 style={{ color: 'var(--text-bright)', fontSize: 30, fontWeight: 300, letterSpacing: '-0.5px', margin: 0 }}>
            {project.title}
          </h1>
          <p style={{ color: 'var(--text-dim)', fontSize: 14, marginTop: 6 }}>
            {project.tagline}
          </p>
        </header>

        <section
          style={{
            background: 'var(--panel)',
            border: '1px solid var(--panel-3)',
            borderRadius: 2,
            padding: 20,
            boxShadow: '0 0 0 1px rgba(0,0,0,0.3)',
          }}
        >
          <h2 style={{ fontSize: 11, letterSpacing: 2, color: 'var(--text-dim)', margin: 0, textTransform: 'uppercase' }}>
            About this project
          </h2>
          <p style={{ marginTop: 10, fontSize: 13, color: 'var(--text)', whiteSpace: 'pre-line', lineHeight: 1.5 }}>
            {project.description}
          </p>
        </section>

        <section
          style={{
            background: 'var(--panel)',
            border: '1px solid var(--panel-3)',
            borderRadius: 2,
            padding: 20,
            boxShadow: '0 0 0 1px rgba(0,0,0,0.3)',
          }}
        >
          <h2 style={{ fontSize: 11, letterSpacing: 2, color: 'var(--text-dim)', margin: 0, textTransform: 'uppercase' }}>
            System requirements
          </h2>
          <ul style={{ marginTop: 10, fontSize: 13, color: 'var(--text)', listStyle: 'none', padding: 0 }}>
            <li><strong>Minimum:</strong> Curiosity, caffeine</li>
            <li style={{ marginTop: 4 }}><strong>Recommended:</strong> Product sense, a Git client, headphones</li>
            <li style={{ marginTop: 4 }}><strong>Storage:</strong> 0 KB (it&apos;s on GitHub)</li>
          </ul>
        </section>

        <section
          style={{
            background: 'var(--panel)',
            border: '1px solid var(--panel-3)',
            borderRadius: 2,
            padding: 20,
            boxShadow: '0 0 0 1px rgba(0,0,0,0.3)',
          }}
        >
          <h2 style={{ fontSize: 11, letterSpacing: 2, color: 'var(--text-dim)', margin: 0, textTransform: 'uppercase' }}>
            Tech stack
          </h2>
          <ul className="tag-row" style={{ marginTop: 10 }}>
            {project.tech.map((t, i) => (
              <li key={t} className={`tag${i >= 2 ? ' lang' : ''}`} style={{ listStyle: 'none' }}>
                {t}
              </li>
            ))}
          </ul>
        </section>

        {project.github && (
          <div style={{ marginTop: 20 }}>
            <Link
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn cta"
              style={{ padding: '10px 20px', fontSize: 13 }}
            >
              ▶ Install (GitHub)
            </Link>
          </div>
        )}

        <div style={{ marginTop: 24 }}>
          <Link href="/dashboard" className="reset-link">
            ← Back to library
          </Link>
        </div>
      </main>
      <DashFooter />
    </div>
  );
}
