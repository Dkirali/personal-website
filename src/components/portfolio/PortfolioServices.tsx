import { services, type Service } from '@/content/portfolio';

export function PortfolioServices() {
  return (
    <section id="services" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-12 text-center">
        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">What I do</p>
        <h2 className="mt-2 text-3xl font-semibold text-neutral-900 md:text-4xl dark:text-neutral-50">
          My services
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {services.map((s) => (
          <ServiceCard key={s.title} service={s} />
        ))}
      </div>
    </section>
  );
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="group rounded-2xl border border-black/5 bg-white/70 p-6 backdrop-blur transition hover:border-indigo-300 hover:shadow-lg dark:border-white/10 dark:bg-neutral-900/60 dark:hover:border-indigo-500/40">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
          <Icon name={service.icon} />
        </div>
        <div>
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-50">{service.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
            {service.description}
          </p>
        </div>
      </div>
    </article>
  );
}

function Icon({ name }: { name: Service['icon'] }) {
  const common = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (name) {
    case 'product':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case 'code':
      return (
        <svg {...common}>
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
    case 'strategy':
      return (
        <svg {...common}>
          <path d="M3 3v18h18" />
          <path d="M7 14l4-4 4 4 5-5" />
        </svg>
      );
    case 'insights':
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      );
  }
}
