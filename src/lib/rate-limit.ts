interface Entry {
  count: number;
  resetAt: number;
}

export interface RateLimiter {
  check(key: string): boolean;
}

export interface RateLimitOptions {
  max: number;
  windowMs: number;
}

export function createRateLimiter(opts: RateLimitOptions): RateLimiter {
  const store = new Map<string, Entry>();
  return {
    check(key: string): boolean {
      const now = Date.now();
      const entry = store.get(key);
      if (!entry || entry.resetAt <= now) {
        store.set(key, { count: 1, resetAt: now + opts.windowMs });
        return true;
      }
      if (entry.count >= opts.max) return false;
      entry.count += 1;
      return true;
    },
  };
}
