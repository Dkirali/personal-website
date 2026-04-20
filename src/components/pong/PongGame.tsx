'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createState,
  tick,
  setPaddleY,
  isOver,
  winner,
  movePaddle,
  FIELD,
  WIN_SCORE,
  type PongState,
} from '@/lib/pong-engine';
import { aiDelta } from '@/lib/pong-ai';
import { sfx } from '@/lib/pong-audio';
import { setPathway } from '@/lib/pathway';
import { SkipLink } from './SkipLink';
import { GandalfScene } from './GandalfScene';

type Phase = 'idle' | 'playing' | 'won' | 'lost-1' | 'lost-2';

export function PongGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<PongState>(createState());
  const phaseRef = useRef<Phase>('idle');
  const aiFramesRef = useRef(0);
  const lossCountRef = useRef(0);
  const [phase, setPhase] = useState<Phase>('idle');
  const router = useRouter();

  // Render + tick loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf = 0;

    const render = () => {
      const s = stateRef.current;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, FIELD.w, FIELD.h);

      ctx.fillStyle = '#7cff7c';
      ctx.fillRect(0, s.paddles.left.y, s.paddles.left.w, s.paddles.left.h);
      ctx.fillRect(
        FIELD.w - s.paddles.right.w,
        s.paddles.right.y,
        s.paddles.right.w,
        s.paddles.right.h,
      );

      ctx.beginPath();
      ctx.arc(s.ball.x, s.ball.y, s.ball.r, 0, Math.PI * 2);
      ctx.fill();

      for (let y = 0; y < FIELD.h; y += 20) {
        ctx.fillRect(FIELD.w / 2 - 1, y, 2, 10);
      }

      ctx.font = '40px "Press Start 2P", monospace';
      ctx.fillText(String(s.scoreLeft), FIELD.w / 2 - 80, 60);
      ctx.fillText(String(s.scoreRight), FIELD.w / 2 + 52, 60);

      if (phaseRef.current === 'idle') {
        ctx.font = '20px "Press Start 2P", monospace';
        ctx.fillText('PRESS SPACE TO START', FIELD.w / 2 - 220, FIELD.h / 2 + 120);
      }
    };

    const loop = () => {
      if (phaseRef.current === 'playing') {
        const prev = stateRef.current;
        const prevDir = Math.sign(prev.ball.vx);
        let next = tick(prev, 1);

        aiFramesRef.current =
          Math.sign(next.ball.vx) !== prevDir ? 0 : aiFramesRef.current + 1;
        next = movePaddle(next, 'right', aiDelta(next, aiFramesRef.current));

        if (
          next.scoreLeft > prev.scoreLeft ||
          next.scoreRight > prev.scoreRight
        ) {
          sfx.score();
        }

        stateRef.current = next;

        if (isOver(next)) {
          const w = winner(next);
          if (w === 'left') {
            sfx.win();
            phaseRef.current = 'won';
            setPhase('won');
            setPathway('gaming');
            setTimeout(() => router.push('/dashboard'), 1500);
          } else {
            sfx.lose();
            lossCountRef.current += 1;
            const p: Phase = lossCountRef.current >= 2 ? 'lost-2' : 'lost-1';
            phaseRef.current = p;
            setPhase(p);
          }
        }
      }
      render();
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [router]);

  // Input handling
  useEffect(() => {
    const canvas = canvasRef.current;

    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && phaseRef.current === 'idle') {
        phaseRef.current = 'playing';
        setPhase('playing');
      }
      if (phaseRef.current === 'playing') {
        const step = 20;
        if (e.code === 'ArrowUp' || e.code === 'KeyW') {
          stateRef.current = movePaddle(stateRef.current, 'left', -step);
        }
        if (e.code === 'ArrowDown' || e.code === 'KeyS') {
          stateRef.current = movePaddle(stateRef.current, 'left', step);
        }
      }
    };

    const onMouse = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const y = (e.clientY - rect.top) * (FIELD.h / rect.height);
      stateRef.current = setPaddleY(stateRef.current, 'left', y - 40);
    };

    const onBlur = () => {
      if (phaseRef.current === 'playing') {
        phaseRef.current = 'idle';
        setPhase('idle');
      }
    };

    const onVisibility = () => {
      if (document.hidden) onBlur();
    };

    window.addEventListener('keydown', onKey);
    window.addEventListener('blur', onBlur);
    document.addEventListener('visibilitychange', onVisibility);
    canvas?.addEventListener('mousemove', onMouse);

    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('visibilitychange', onVisibility);
      canvas?.removeEventListener('mousemove', onMouse);
    };
  }, []);

  const retry = () => {
    stateRef.current = createState();
    phaseRef.current = 'playing';
    setPhase('playing');
  };

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center">
      <div className="crt relative" style={{ width: FIELD.w, maxWidth: '95vw' }}>
        <canvas
          ref={canvasRef}
          width={FIELD.w}
          height={FIELD.h}
          className="w-full h-auto block crt-glow"
          aria-label={`Pong game, first to ${WIN_SCORE} points`}
        />
        {phase === 'lost-1' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <button
              onClick={retry}
              className="crt-glow text-2xl p-6 border border-current"
            >
              GAME OVER — ONE MORE TRY?
            </button>
          </div>
        )}
        {phase === 'won' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <span className="crt-glow text-4xl">YOU WIN</span>
          </div>
        )}
      </div>
      {phase === 'lost-2' && <GandalfScene />}
      {(phase === 'idle' || phase === 'playing') && <SkipLink />}
    </div>
  );
}
