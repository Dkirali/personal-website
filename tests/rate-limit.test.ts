import { describe, expect, it, vi } from 'vitest';
import { createRateLimiter } from '@/lib/rate-limit';

describe('createRateLimiter', () => {
  it('allows up to N hits per window, then blocks', () => {
    const rl = createRateLimiter({ max: 3, windowMs: 60_000 });
    expect(rl.check('1.2.3.4')).toBe(true);
    expect(rl.check('1.2.3.4')).toBe(true);
    expect(rl.check('1.2.3.4')).toBe(true);
    expect(rl.check('1.2.3.4')).toBe(false);
  });

  it('resets after windowMs', () => {
    vi.useFakeTimers();
    const rl = createRateLimiter({ max: 1, windowMs: 1000 });
    expect(rl.check('x')).toBe(true);
    expect(rl.check('x')).toBe(false);
    vi.advanceTimersByTime(1001);
    expect(rl.check('x')).toBe(true);
    vi.useRealTimers();
  });

  it('keys are isolated', () => {
    const rl = createRateLimiter({ max: 1, windowMs: 60_000 });
    expect(rl.check('a')).toBe(true);
    expect(rl.check('b')).toBe(true);
    expect(rl.check('a')).toBe(false);
    expect(rl.check('b')).toBe(false);
  });
});
