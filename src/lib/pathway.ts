export const PATHWAY_KEY = 'pathway';
export type Pathway = 'gaming' | 'pro';

const ONE_YEAR = 60 * 60 * 24 * 365;

export function parsePathway(value: string | null | undefined): Pathway | null {
  return value === 'gaming' || value === 'pro' ? value : null;
}

export function readPathway(): Pathway | null {
  if (typeof window === 'undefined') return null;
  const fromStorage = parsePathway(window.localStorage.getItem(PATHWAY_KEY));
  if (fromStorage) return fromStorage;
  const cookieMatch = document.cookie.match(
    new RegExp(`(?:^|; )${PATHWAY_KEY}=([^;]+)`),
  );
  return parsePathway(cookieMatch?.[1] ?? null);
}

export function setPathway(value: Pathway): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(PATHWAY_KEY, value);
  document.cookie =
    `${PATHWAY_KEY}=${value}; Max-Age=${ONE_YEAR}; path=/; SameSite=Lax`;
}

export function clearPathway(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(PATHWAY_KEY);
  document.cookie = `${PATHWAY_KEY}=; Max-Age=0; path=/; SameSite=Lax`;
}
