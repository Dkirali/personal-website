/**
 * Tiny square-wave SFX for the Pong landing page.
 * Uses a lazily-initialized AudioContext so we don't break SSR or autoplay policies.
 * All helpers silently no-op on the server or if the AudioContext can't be created.
 */

type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (ctx) return ctx;
  const Ctor =
    window.AudioContext ?? (window as WebkitWindow).webkitAudioContext;
  if (!Ctor) return null;
  try {
    ctx = new Ctor();
    return ctx;
  } catch {
    return null;
  }
}

function beep(
  freq: number,
  durMs: number,
  type: OscillatorType = 'square',
): void {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.05, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + durMs / 1000);
  osc.connect(gain).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + durMs / 1000);
}

export const sfx = {
  paddle: () => beep(440, 60),
  wall: () => beep(220, 50),
  score: () => beep(110, 200, 'sawtooth'),
  win: () => {
    beep(660, 120);
    setTimeout(() => beep(880, 200), 120);
  },
  lose: () => {
    beep(160, 200);
    setTimeout(() => beep(120, 260), 180);
  },
} as const;
