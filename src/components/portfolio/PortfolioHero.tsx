import Image from 'next/image';
import Link from 'next/link';
import { bio } from '@/content/bio';
import { PastelBackdrop } from './PastelBackdrop';

export function PortfolioHero() {
  return (
    <section className="relative overflow-hidden pb-24 pt-16">
      <PastelBackdrop />
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{bio.name.split(' ')[0]}</p>
          <h1 className="mt-2 text-5xl font-semibold tracking-tight text-neutral-900 md:text-6xl dark:text-neutral-50">
            About me
          </h1>
        </div>

        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">I am {bio.name}</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-neutral-900 md:text-4xl dark:text-neutral-50">
              {bio.title.split('→')[0].trim()}
              <br />
              <span className="text-neutral-500 dark:text-neutral-400">becoming a</span>{' '}
              {bio.title.split('→')[1]?.trim() ?? 'Web Developer'}
            </h2>
            <p className="mt-6 max-w-lg text-neutral-600 dark:text-neutral-300">
              {bio.about.split('\n\n')[0]}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="#services"
                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
              >
                My services →
              </Link>
              <Link
                href="#contact"
                className="text-sm font-medium text-neutral-900 underline underline-offset-4 hover:text-indigo-600 dark:text-neutral-100 dark:hover:text-indigo-400"
              >
                Let&apos;s talk now →
              </Link>
            </div>
            <p className="mt-6 text-sm text-neutral-500 dark:text-neutral-400">
              {bio.location}
            </p>
          </div>

          <div className="relative flex justify-center">
            <div className="absolute inset-0 mx-auto h-[360px] w-[360px] rounded-[45%_55%_60%_40%/50%_45%_55%_50%] bg-indigo-100 dark:bg-indigo-900/30" />
            <div className="relative h-[340px] w-[340px] overflow-hidden rounded-[45%_55%_60%_40%/50%_45%_55%_50%] shadow-xl">
              <Image
                src="/headshot.png"
                alt={bio.name}
                fill
                sizes="340px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
