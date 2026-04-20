'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

type Mode = 'linkedin' | 'gaming';

interface Cached {
  canvas: HTMLCanvasElement;
  pixelated: boolean;
}

interface Props {
  className?: string;
  size?: number;
  linkedinSrc?: string;
  gamingSrc?: string;
  alt?: string;
  /** Optional initial mode — defaults to 'linkedin'. */
  initialMode?: Mode;
}

/**
 * Avatar that morphs between a clean headshot and a pixel-art portrait when
 * hovered, clicked, or toggled via keyboard (Enter/Space). Pixel source is
 * rendered without smoothing; photo source keeps smoothing. The "cell size"
 * follows a sine bell during the morph so the midpoint looks chunkier.
 */
export function ProfilePhoto({
  className,
  size = 256,
  linkedinSrc = '/headshot.png',
  gamingSrc = '/headshot-pixel.png',
  alt = 'Doruk Kırali',
  initialMode = 'linkedin',
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const linkedinRef = useRef<Cached | null>(null);
  const gamingRef = useRef<Cached | null>(null);
  const progressRef = useRef(initialMode === 'gaming' ? 1 : 0);
  const targetRef = useRef(initialMode === 'gaming' ? 1 : 0);
  const runningRef = useRef(false);
  const [mode, setMode] = useState<Mode>(initialMode);

  const fitToCanvas = useCallback(
    (img: HTMLImageElement, pixelated: boolean): Cached => {
      const c = document.createElement('canvas');
      c.width = size;
      c.height = size;
      const cx = c.getContext('2d');
      if (!cx) throw new Error('ProfilePhoto: 2d context unavailable');
      cx.imageSmoothingEnabled = !pixelated;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const scale = Math.max(size / iw, size / ih);
      const w = iw * scale;
      const h = ih * scale;
      cx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
      return { canvas: c, pixelated };
    },
    [size],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;

    // Reused offscreen buffer — resized per frame rather than re-allocated
    // to avoid continuous GC pressure during the morph.
    const small = document.createElement('canvas');
    const sctx = small.getContext('2d');

    const drawFrame = () => {
      const a = linkedinRef.current;
      const b = gamingRef.current;
      if (!a || !b || !sctx) return;
      // easeInOutSine
      const p = -(Math.cos(Math.PI * progressRef.current) - 1) / 2;
      const bell = Math.sin(p * Math.PI);
      const cellSize = Math.max(1, Math.round(1 + bell * (size / 8)));
      const src = p < 0.5 ? a : b;
      const cells = Math.ceil(size / cellSize);

      if (small.width !== cells || small.height !== cells) {
        small.width = cells;
        small.height = cells;
      } else {
        sctx.clearRect(0, 0, cells, cells);
      }
      sctx.imageSmoothingEnabled = !src.pixelated;
      sctx.drawImage(src.canvas, 0, 0, cells, cells);

      ctx.clearRect(0, 0, size, size);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(small, 0, 0, size, size);
    };

    const step = () => {
      const delta = targetRef.current - progressRef.current;
      if (Math.abs(delta) < 0.005) {
        progressRef.current = targetRef.current;
        drawFrame();
        runningRef.current = false;
        return;
      }
      progressRef.current += delta * 0.18;
      drawFrame();
      rafId = requestAnimationFrame(step);
    };

    const run = () => {
      if (runningRef.current) return;
      runningRef.current = true;
      rafId = requestAnimationFrame(step);
    };

    const load = (src: string, pixelated: boolean): Promise<Cached> =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(fitToCanvas(img, pixelated));
        img.onerror = () => reject(new Error(`Failed to load ${src}`));
        img.src = src;
      });

    let cancelled = false;
    Promise.all([load(linkedinSrc, false), load(gamingSrc, true)])
      .then(([a, b]) => {
        if (cancelled) return;
        linkedinRef.current = a;
        gamingRef.current = b;
        drawFrame();
      })
      .catch(() => {
        // Image load failure — canvas stays blank. Non-fatal.
      });

    const handleEnter = () => {
      targetRef.current = 1;
      setMode('gaming');
      run();
    };
    const handleLeave = () => {
      targetRef.current = 0;
      setMode('linkedin');
      run();
    };
    const handleToggle = () => {
      const next: Mode = targetRef.current > 0.5 ? 'linkedin' : 'gaming';
      targetRef.current = next === 'gaming' ? 1 : 0;
      setMode(next);
      run();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        handleToggle();
      }
    };

    canvas.addEventListener('mouseenter', handleEnter);
    canvas.addEventListener('mouseleave', handleLeave);
    canvas.addEventListener('click', handleToggle);
    canvas.addEventListener('keydown', handleKey);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      canvas.removeEventListener('mouseenter', handleEnter);
      canvas.removeEventListener('mouseleave', handleLeave);
      canvas.removeEventListener('click', handleToggle);
      canvas.removeEventListener('keydown', handleKey);
    };
  }, [size, linkedinSrc, gamingSrc, fitToCanvas]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      tabIndex={0}
      aria-label={`${alt} — ${mode === 'linkedin' ? 'LinkedIn headshot; press Enter to morph to pixel art' : 'pixel-art portrait; press Enter to revert'}`}
      className={`rounded-full cursor-pointer focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#0a66c2] ${className ?? ''}`}
      style={{ width: size, height: size }}
    />
  );
}
