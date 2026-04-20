import { describe, expect, it, beforeEach } from 'vitest';
import {
  PATHWAY_KEY,
  parsePathway,
  setPathway,
  readPathway,
  clearPathway,
} from '@/lib/pathway';

describe('parsePathway', () => {
  it('returns "gaming" | "pro" | null', () => {
    expect(parsePathway('gaming')).toBe('gaming');
    expect(parsePathway('pro')).toBe('pro');
    expect(parsePathway('')).toBeNull();
    expect(parsePathway('garbage')).toBeNull();
    expect(parsePathway(null)).toBeNull();
    expect(parsePathway(undefined)).toBeNull();
  });
});

describe('client pathway storage', () => {
  beforeEach(() => {
    localStorage.clear();
    document.cookie = `${PATHWAY_KEY}=; Max-Age=0; path=/`;
  });

  it('writes to localStorage AND cookie', () => {
    setPathway('gaming');
    expect(localStorage.getItem(PATHWAY_KEY)).toBe('gaming');
    expect(document.cookie).toContain(`${PATHWAY_KEY}=gaming`);
  });

  it('reads back the pathway', () => {
    setPathway('pro');
    expect(readPathway()).toBe('pro');
  });

  it('clearPathway removes both stores', () => {
    setPathway('gaming');
    clearPathway();
    expect(readPathway()).toBeNull();
    expect(document.cookie).not.toContain(`${PATHWAY_KEY}=gaming`);
  });
});
