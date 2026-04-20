import { describe, expect, it } from 'vitest';
import { aiDelta } from '@/lib/pong-ai';
import { createState } from '@/lib/pong-engine';

describe('aiDelta', () => {
  it('is zero when ball moves away from AI', () => {
    const s = createState();
    s.ball.vx = -5; // moving toward player (left)
    expect(aiDelta(s, 0)).toBe(0);
  });

  it('moves toward ball y when ball approaches AI', () => {
    const s = createState();
    s.ball.vx = 5; // toward right (AI)
    s.ball.y = 10;
    s.paddles.right.y = 200;
    expect(aiDelta(s, 100)).toBeLessThan(0); // move up
  });

  it('is clamped to max speed', () => {
    const s = createState();
    s.ball.vx = 5;
    s.ball.y = 0;
    s.paddles.right.y = 500;
    const d = aiDelta(s, 100);
    expect(Math.abs(d)).toBeLessThanOrEqual(5); // max AI speed
  });

  it('does not react before reactionDelay frames', () => {
    const s = createState();
    s.ball.vx = 5;
    s.ball.y = 0;
    expect(aiDelta(s, 5, { reactionDelay: 10 })).toBe(0);
  });
});
