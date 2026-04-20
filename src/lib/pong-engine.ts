export const FIELD = { w: 800, h: 500 } as const;
export const WIN_SCORE = 3;
export const PADDLE = { w: 12, h: 80, speed: 7 } as const;
export const BALL = { r: 8, baseSpeed: 5, maxSpeed: 12 } as const;

export type Side = 'left' | 'right';

export interface Paddle {
  y: number;
  h: number;
  w: number;
}

export interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

export interface PongState {
  ball: Ball;
  paddles: { left: Paddle; right: Paddle };
  scoreLeft: number;
  scoreRight: number;
}

function randomDirection(): 1 | -1 {
  return Math.random() < 0.5 ? -1 : 1;
}

function centeredBall(dir: 1 | -1): Ball {
  return {
    x: FIELD.w / 2,
    y: FIELD.h / 2,
    vx: BALL.baseSpeed * dir,
    vy: (Math.random() - 0.5) * BALL.baseSpeed,
    r: BALL.r,
  };
}

export function createState(): PongState {
  return {
    ball: centeredBall(randomDirection()),
    paddles: {
      left: { y: (FIELD.h - PADDLE.h) / 2, h: PADDLE.h, w: PADDLE.w },
      right: { y: (FIELD.h - PADDLE.h) / 2, h: PADDLE.h, w: PADDLE.w },
    },
    scoreLeft: 0,
    scoreRight: 0,
  };
}

/**
 * Bounce the ball off a paddle. Flips vx sign and amplifies total speed (capped).
 * The `paddle` parameter records which paddle was hit (not used for sign; sign
 * comes from the ball's current vx so the logic works whether it was moving
 * toward the left or right paddle).
 */
export function reflectBall(state: PongState, _paddle: Side): PongState {
  const currentSpeed = Math.hypot(state.ball.vx, state.ball.vy);
  const base = Math.max(currentSpeed, BALL.baseSpeed);
  const newSpeed = Math.min(BALL.maxSpeed, base * 1.08);
  const ratio = currentSpeed > 0.001 ? newSpeed / currentSpeed : 1;
  const vx = -state.ball.vx * ratio;
  const vy = state.ball.vy * ratio;
  return { ...state, ball: { ...state.ball, vx, vy } };
}

export function tick(prev: PongState, dtFrames: number): PongState {
  const ball: Ball = { ...prev.ball };
  ball.x += ball.vx * dtFrames;
  ball.y += ball.vy * dtFrames;

  // Wall bounces (top/bottom)
  if (ball.y - ball.r < 0) {
    ball.y = ball.r;
    ball.vy = -ball.vy;
  }
  if (ball.y + ball.r > FIELD.h) {
    ball.y = FIELD.h - ball.r;
    ball.vy = -ball.vy;
  }

  // Paddle collisions
  const leftP = prev.paddles.left;
  if (
    ball.x - ball.r < leftP.w &&
    ball.x > 0 &&
    ball.y > leftP.y &&
    ball.y < leftP.y + leftP.h
  ) {
    const reflected = reflectBall({ ...prev, ball }, 'left');
    return {
      ...reflected,
      ball: { ...reflected.ball, x: leftP.w + reflected.ball.r },
    };
  }

  const rightP = prev.paddles.right;
  if (
    ball.x + ball.r > FIELD.w - rightP.w &&
    ball.x < FIELD.w &&
    ball.y > rightP.y &&
    ball.y < rightP.y + rightP.h
  ) {
    const reflected = reflectBall({ ...prev, ball }, 'right');
    return {
      ...reflected,
      ball: { ...reflected.ball, x: FIELD.w - rightP.w - reflected.ball.r },
    };
  }

  // Score: ball fully off a side
  if (ball.x < 0) {
    return {
      ...prev,
      ball: centeredBall(1),
      scoreRight: prev.scoreRight + 1,
    };
  }
  if (ball.x > FIELD.w) {
    return {
      ...prev,
      ball: centeredBall(-1),
      scoreLeft: prev.scoreLeft + 1,
    };
  }

  return { ...prev, ball };
}

export function movePaddle(state: PongState, side: Side, delta: number): PongState {
  const p = state.paddles[side];
  const y = Math.max(0, Math.min(FIELD.h - p.h, p.y + delta));
  return {
    ...state,
    paddles: { ...state.paddles, [side]: { ...p, y } },
  };
}

export function setPaddleY(state: PongState, side: Side, y: number): PongState {
  const p = state.paddles[side];
  const clamped = Math.max(0, Math.min(FIELD.h - p.h, y));
  return {
    ...state,
    paddles: { ...state.paddles, [side]: { ...p, y: clamped } },
  };
}

export function isOver(s: PongState): boolean {
  return s.scoreLeft >= WIN_SCORE || s.scoreRight >= WIN_SCORE;
}

export function winner(s: PongState): Side | null {
  if (s.scoreLeft >= WIN_SCORE) return 'left';
  if (s.scoreRight >= WIN_SCORE) return 'right';
  return null;
}
