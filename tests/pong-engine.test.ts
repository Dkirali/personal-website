import { describe, expect, it } from 'vitest';
import {
  createState,
  tick,
  movePaddle,
  reflectBall,
  isOver,
  FIELD,
} from '@/lib/pong-engine';

describe('pong engine', () => {
  it('createState returns centered ball and zero scores', () => {
    const s = createState();
    expect(s.ball.x).toBe(FIELD.w / 2);
    expect(s.ball.y).toBe(FIELD.h / 2);
    expect(s.scoreLeft).toBe(0);
    expect(s.scoreRight).toBe(0);
  });

  it('tick advances ball by velocity', () => {
    const s = createState();
    s.ball.vx = 2;
    s.ball.vy = 0;
    const next = tick(s, 1);
    expect(next.ball.x).toBe(FIELD.w / 2 + 2);
  });

  it('ball bounces off top and bottom walls', () => {
    const s = createState();
    s.ball.y = 1;
    s.ball.vy = -5;
    const next = tick(s, 1);
    expect(next.ball.vy).toBeGreaterThan(0);
  });

  it('ball exiting left awards right, resets', () => {
    const s = createState();
    s.ball.x = -10;
    const next = tick(s, 1);
    expect(next.scoreRight).toBe(1);
    expect(next.ball.x).toBe(FIELD.w / 2);
  });

  it('reflectBall increases speed and flips vx', () => {
    const s = createState();
    s.ball.vx = 4;
    s.ball.vy = 0;
    const next = reflectBall(s, 'left');
    expect(next.ball.vx).toBeLessThan(0);
    expect(Math.abs(next.ball.vx)).toBeGreaterThan(4);
  });

  it('movePaddle clamps within field', () => {
    const s = createState();
    const hi = movePaddle(s, 'left', -1000);
    expect(hi.paddles.left.y).toBe(0);
    const lo = movePaddle(s, 'left', 1000);
    expect(lo.paddles.left.y).toBe(FIELD.h - s.paddles.left.h);
  });

  it('isOver true when either side reaches 3', () => {
    const s = createState();
    expect(isOver({ ...s, scoreLeft: 3 })).toBe(true);
    expect(isOver({ ...s, scoreRight: 3 })).toBe(true);
    expect(isOver({ ...s, scoreLeft: 2, scoreRight: 2 })).toBe(false);
  });
});
