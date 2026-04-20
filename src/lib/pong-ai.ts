import type { PongState } from './pong-engine';

export interface AIConfig {
  /** Maximum paddle movement per tick (px). */
  maxSpeed: number;
  /** Frames the AI ignores at the start of an approach before reacting. */
  reactionDelay: number;
}

export const DEFAULT_AI: AIConfig = {
  maxSpeed: 5,
  reactionDelay: 7,
};

/**
 * How far the AI paddle should move this frame.
 * Returns 0 when the ball is heading away, or during the reaction delay.
 */
export function aiDelta(
  state: PongState,
  framesSinceBallDirChange: number,
  cfg: Partial<AIConfig> = {},
): number {
  const { maxSpeed, reactionDelay } = { ...DEFAULT_AI, ...cfg };
  if (state.ball.vx <= 0) return 0;
  if (framesSinceBallDirChange < reactionDelay) return 0;

  const paddle = state.paddles.right;
  const paddleCenter = paddle.y + paddle.h / 2;
  const diff = state.ball.y - paddleCenter;
  const proposed = diff * 0.12;
  return Math.max(-maxSpeed, Math.min(maxSpeed, proposed));
}
