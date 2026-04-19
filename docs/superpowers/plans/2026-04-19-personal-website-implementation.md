# Personal Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a game-gated personal portfolio where `/` shows a retro Pong game whose outcome routes the visitor to a gaming-themed Steam-pastiche at `/dashboard` or a recruiter-safe LinkedIn-pastiche at `/pro`, deployable to a Hetzner VPS via Coolify.

**Architecture:** Next.js 15 App Router app with a thin middleware layer that reads a `pathway` cookie to redirect returning visitors at `/`. Client-side game logic uses HTML5 Canvas with pure-function engine split from React (so physics can be unit-tested). Shared UI (avatar morph, contact form, CV download) lives in typed React components. Contact form posts to a server route that rate-limits and sends via Resend. Deployed as a standalone Docker image built by Coolify from the GitHub repo.

**Tech Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Framer Motion · Zod · Resend SDK · Vitest + Testing Library · Playwright · pnpm · Docker · Coolify (Hetzner).

**Spec:** `docs/superpowers/specs/2026-04-18-personal-website-design.md`

**Assets already on disk:**
- `/Users/dkirali/Desktop/website/Assets/Normal.png` — clean headshot
- `/Users/dkirali/Desktop/website/Assets/Pixel.png` — pixel-art headshot
- `/Users/dkirali/Desktop/website/Assets/Doruk Kirali Resume 2026.pdf` — CV
- `/Users/dkirali/Desktop/website/index.html` — Steam-pastiche HTML mockup (reference for Phase 4)

---

## File structure (target end state)

```
website/
├── Dockerfile
├── .dockerignore
├── .env.local.example
├── .gitignore
├── README.md
├── middleware.ts
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
├── public/
│   ├── cv.pdf
│   ├── headshot.png            ← copy of Assets/Normal.png
│   ├── headshot-pixel.png      ← copy of Assets/Pixel.png
│   └── gandalf.mp4             ← sourced during Phase 2
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # Pong landing
│   │   ├── globals.css
│   │   ├── pro/page.tsx              # LinkedIn pastiche
│   │   ├── dashboard/page.tsx        # Steam pastiche
│   │   ├── reset/route.ts            # Clears cookie, redirects to /
│   │   └── api/contact/route.ts
│   ├── components/
│   │   ├── profile/ProfilePhoto.tsx
│   │   ├── contact/ContactForm.tsx
│   │   ├── cv/CVDownload.tsx
│   │   ├── pong/
│   │   │   ├── PongGame.tsx
│   │   │   ├── SkipLink.tsx
│   │   │   └── GandalfScene.tsx
│   │   ├── pro/* (section components)
│   │   └── dashboard/* (section components)
│   ├── lib/
│   │   ├── pathway.ts                # Client-side gate state
│   │   ├── pathway-server.ts         # Server-side cookie read
│   │   ├── pong-engine.ts            # Pure physics/state (testable)
│   │   ├── pong-ai.ts                # AI paddle logic (testable)
│   │   ├── pong-audio.ts             # Web Audio helpers
│   │   ├── rate-limit.ts
│   │   ├── email.ts                  # Resend wrapper
│   │   └── contact-schema.ts         # Shared Zod schema
│   ├── content/
│   │   ├── bio.ts
│   │   ├── experience.ts
│   │   ├── projects.ts
│   │   ├── achievements.ts
│   │   └── reviews.ts
│   └── styles/pong-crt.css
└── tests/
    ├── pong-engine.test.ts
    ├── pong-ai.test.ts
    ├── pathway.test.ts
    ├── rate-limit.test.ts
    ├── contact-schema.test.ts
    ├── api-contact.test.ts
    └── e2e/
        ├── gate.spec.ts
        └── contact.spec.ts
```

Each file has one responsibility. Pure logic (physics, validation, rate limiting) lives in `lib/` and is unit-tested. React components wrap that logic. Page files compose section components — no long page files.

---

## Phase 0 — Project scaffold

Goal: empty, type-checking, test-passing Next.js app that builds and boots.

### Task 0.1: Back up current `index.html` before scaffold

**Files:**
- Move: `/Users/dkirali/Desktop/website/index.html` → `/Users/dkirali/Desktop/website/reference/steam-mockup.html`

- [ ] **Step 1:** Create reference dir and move mockup

```bash
cd /Users/dkirali/Desktop/website
mkdir -p reference
mv index.html reference/steam-mockup.html
mv Assets reference/Assets-source  # keep originals; we'll copy to /public later
```

- [ ] **Step 2:** Commit

```bash
git add -A
git commit -m "chore: archive pre-scaffold mockup and source assets under reference/"
```

### Task 0.2: Scaffold Next.js 15 app with TypeScript + Tailwind

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `.gitignore`

- [ ] **Step 1:** Run scaffold

```bash
cd /Users/dkirali/Desktop/website
pnpm dlx create-next-app@latest . \
  --ts --tailwind --eslint --app --src-dir \
  --import-alias "@/*" \
  --no-turbopack --use-pnpm --skip-install
pnpm install
```

Expected: a standard Next.js 15 app in the working directory. If the tool refuses due to non-empty dir, copy scaffold into `/tmp/scaffold` then `rsync -a /tmp/scaffold/ ./` and delete the tmp.

- [ ] **Step 2:** Pin Node engine in `package.json`

Edit `package.json` — add:

```json
"engines": { "node": ">=20.11.0" },
"packageManager": "pnpm@9.0.0"
```

- [ ] **Step 3:** Verify build + dev boot

```bash
pnpm build
pnpm dev
# visit http://localhost:3000, confirm the default page loads, then Ctrl-C
```

Expected: build succeeds, dev server serves default page on :3000.

- [ ] **Step 4:** Commit

```bash
git add -A
git commit -m "feat: scaffold Next.js 15 app with TypeScript and Tailwind"
```

### Task 0.3: Add test tooling (Vitest + Testing Library + Playwright)

**Files:**
- Create: `vitest.config.ts`, `playwright.config.ts`, `tests/setup.ts`
- Modify: `package.json` (scripts, devDependencies)

- [ ] **Step 1:** Install dev dependencies

```bash
pnpm add -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom \
  @testing-library/user-event jsdom happy-dom @playwright/test
pnpm exec playwright install --with-deps chromium
```

- [ ] **Step 2:** Create `vitest.config.ts`

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    exclude: ['node_modules', 'tests/e2e/**', '.next'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
```

- [ ] **Step 3:** Install `@vitejs/plugin-react`

```bash
pnpm add -D @vitejs/plugin-react
```

- [ ] **Step 4:** Create `tests/setup.ts`

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 5:** Create `playwright.config.ts`

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
```

- [ ] **Step 6:** Add scripts to `package.json`

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:e2e": "playwright test",
  "typecheck": "tsc --noEmit"
}
```

- [ ] **Step 7:** Sanity test

Create `tests/sanity.test.ts`:

```ts
import { expect, test } from 'vitest';
test('sanity', () => { expect(1 + 1).toBe(2); });
```

Run: `pnpm test`
Expected: 1 passed.

- [ ] **Step 8:** Commit

```bash
git add -A
git commit -m "chore: add Vitest + Testing Library + Playwright"
```

### Task 0.4: Copy static assets into `public/`

**Files:**
- Create: `public/headshot.png`, `public/headshot-pixel.png`, `public/cv.pdf`

- [ ] **Step 1:** Copy

```bash
cp reference/Assets-source/Normal.png public/headshot.png
cp reference/Assets-source/Pixel.png  public/headshot-pixel.png
cp "reference/Assets-source/Doruk Kirali Resume 2026.pdf" public/cv.pdf
```

- [ ] **Step 2:** Verify file sizes

```bash
ls -lah public/
```

Expected: all three files present, non-zero.

- [ ] **Step 3:** Commit

```bash
git add public/
git commit -m "feat: add headshot, pixel-art portrait, and CV to public"
```

### Task 0.5: Add environment file template

**Files:**
- Create: `.env.local.example`
- Modify: `.gitignore`

- [ ] **Step 1:** Write `.env.local.example`

```
# Copy to .env.local and fill in values
RESEND_API_KEY=
CONTACT_TO_EMAIL=kiralidoruk@gmail.com
CONTACT_FROM_EMAIL=site@your-domain.com
```

- [ ] **Step 2:** Verify `.gitignore` includes `.env*.local` (Next.js scaffold already does this — confirm with `grep env .gitignore`).

- [ ] **Step 3:** Commit

```bash
git add .env.local.example .gitignore
git commit -m "chore: document required environment variables"
```

---

## Phase 1 — Gate state + middleware

Goal: `pathway` state persists across sessions; middleware redirects returning visitors away from `/`.

### Task 1.1: Pathway constants + Zod-less parser

**Files:**
- Create: `src/lib/pathway.ts`
- Create: `tests/pathway.test.ts`

- [ ] **Step 1:** Write the failing test at `tests/pathway.test.ts`

```ts
import { describe, expect, it, beforeEach, vi } from 'vitest';
import {
  PATHWAY_KEY, parsePathway, setPathway, readPathway, clearPathway,
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

  it('clearPathway removes both', () => {
    setPathway('gaming');
    clearPathway();
    expect(readPathway()).toBeNull();
    expect(document.cookie).not.toContain('pathway=gaming');
  });
});
```

- [ ] **Step 2:** Run and confirm it fails

```bash
pnpm test tests/pathway.test.ts
```
Expected: FAIL — module not found.

- [ ] **Step 3:** Implement `src/lib/pathway.ts`

```ts
export const PATHWAY_KEY = 'pathway';
export type Pathway = 'gaming' | 'pro';

const ONE_YEAR = 60 * 60 * 24 * 365;

export function parsePathway(value: string | null | undefined): Pathway | null {
  return value === 'gaming' || value === 'pro' ? value : null;
}

export function readPathway(): Pathway | null {
  if (typeof window === 'undefined') return null;
  const fromStorage = parsePathway(window.localStorage.getItem(PATHWAY_KEY));
  if (fromStorage) return fromStorage;
  const cookieMatch = document.cookie.match(
    new RegExp(`(?:^|; )${PATHWAY_KEY}=([^;]+)`),
  );
  return parsePathway(cookieMatch?.[1] ?? null);
}

export function setPathway(value: Pathway): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(PATHWAY_KEY, value);
  document.cookie =
    `${PATHWAY_KEY}=${value}; Max-Age=${ONE_YEAR}; path=/; SameSite=Lax`;
}

export function clearPathway(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(PATHWAY_KEY);
  document.cookie = `${PATHWAY_KEY}=; Max-Age=0; path=/; SameSite=Lax`;
}
```

- [ ] **Step 4:** Run tests

```bash
pnpm test tests/pathway.test.ts
```
Expected: all pass.

- [ ] **Step 5:** Commit

```bash
git add src/lib/pathway.ts tests/pathway.test.ts
git commit -m "feat: pathway gate state helpers (localStorage + cookie mirror)"
```

### Task 1.2: Server-side pathway reader

**Files:**
- Create: `src/lib/pathway-server.ts`

- [ ] **Step 1:** Implement

```ts
import { cookies } from 'next/headers';
import { PATHWAY_KEY, parsePathway, type Pathway } from './pathway';

export async function readPathwayFromRequest(): Promise<Pathway | null> {
  const store = await cookies();
  return parsePathway(store.get(PATHWAY_KEY)?.value ?? null);
}
```

- [ ] **Step 2:** Commit

```bash
git add src/lib/pathway-server.ts
git commit -m "feat: server-side pathway cookie reader"
```

### Task 1.3: Middleware redirect at `/`

**Files:**
- Create: `middleware.ts` (at repo root, not under `src/`)

- [ ] **Step 1:** Implement

```ts
import { NextResponse, type NextRequest } from 'next/server';
import { PATHWAY_KEY, parsePathway } from '@/lib/pathway';

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname !== '/') return NextResponse.next();
  const cookie = req.cookies.get(PATHWAY_KEY)?.value ?? null;
  const pathway = parsePathway(cookie);
  if (pathway === 'gaming') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  if (pathway === 'pro') {
    return NextResponse.redirect(new URL('/pro', req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ['/'] };
```

- [ ] **Step 2:** Manual smoke test

```bash
pnpm dev
```
Open http://localhost:3000 → default Next page (no cookie yet).
In devtools console: `document.cookie = 'pathway=pro; path=/'` then reload → should redirect to `/pro` (404 for now; expected).
Clear cookie: `document.cookie = 'pathway=; Max-Age=0; path=/'` → `/` loads again.
Ctrl-C.

- [ ] **Step 3:** Commit

```bash
git add middleware.ts
git commit -m "feat: middleware redirects returning visitors away from /"
```

### Task 1.4: `/reset` route clears state

**Files:**
- Create: `src/app/reset/route.ts`

- [ ] **Step 1:** Implement

```ts
import { NextResponse } from 'next/server';
import { PATHWAY_KEY } from '@/lib/pathway';

export function GET(req: Request) {
  const res = NextResponse.redirect(new URL('/', req.url));
  res.cookies.set(PATHWAY_KEY, '', { path: '/', maxAge: 0 });
  return res;
}
```

The server-side cookie clear is the primary effect; the `/` redirect triggers the Pong page. Client-side localStorage must also be cleared — do it on `/`'s page mount when `document.cookie` lacks the key (covered in Task 2.6).

- [ ] **Step 2:** Smoke test

```bash
pnpm dev
```
Set cookie in devtools then GET http://localhost:3000/reset → should redirect to `/` with the cookie cleared.

- [ ] **Step 3:** Commit

```bash
git add src/app/reset/route.ts
git commit -m "feat: /reset clears pathway cookie and returns home"
```

---

## Phase 2 — Pong game

Goal: `/` renders a winnable Pong game with retro CRT styling; win → `/dashboard` with pathway set; lose twice → Gandalf → mercy skip to `/pro`; skip link always available.

### Task 2.1: Pure Pong engine (tick + score)

**Files:**
- Create: `src/lib/pong-engine.ts`
- Create: `tests/pong-engine.test.ts`

- [ ] **Step 1:** Write the failing tests

```ts
import { describe, expect, it } from 'vitest';
import {
  createState, tick, movePaddle, reflectBall, isOver, FIELD,
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
    s.ball.vx = 2; s.ball.vy = 0;
    const next = tick(s, 1);
    expect(next.ball.x).toBe(FIELD.w / 2 + 2);
  });

  it('ball bounces off top and bottom walls', () => {
    const s = createState();
    s.ball.y = 1; s.ball.vy = -5;
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
    s.ball.vx = 4; s.ball.vy = 0;
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
```

- [ ] **Step 2:** Run tests, expect FAIL (module missing).

```bash
pnpm test tests/pong-engine.test.ts
```

- [ ] **Step 3:** Implement engine

```ts
// src/lib/pong-engine.ts
export const FIELD = { w: 800, h: 500 } as const;
export const WIN_SCORE = 3;
export const PADDLE = { w: 12, h: 80, speed: 7 } as const;
export const BALL = { r: 8, baseSpeed: 5, maxSpeed: 12 } as const;

export type Side = 'left' | 'right';

export interface Paddle { y: number; h: number; w: number; }
export interface Ball { x: number; y: number; vx: number; vy: number; r: number; }

export interface PongState {
  ball: Ball;
  paddles: { left: Paddle; right: Paddle };
  scoreLeft: number;
  scoreRight: number;
}

export function createState(): PongState {
  return {
    ball: centeredBall(randomDirection()),
    paddles: {
      left:  { y: (FIELD.h - PADDLE.h) / 2, h: PADDLE.h, w: PADDLE.w },
      right: { y: (FIELD.h - PADDLE.h) / 2, h: PADDLE.h, w: PADDLE.w },
    },
    scoreLeft: 0,
    scoreRight: 0,
  };
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

function randomDirection(): 1 | -1 { return Math.random() < 0.5 ? -1 : 1; }

export function tick(prev: PongState, dtFrames: number): PongState {
  const ball = { ...prev.ball };
  ball.x += ball.vx * dtFrames;
  ball.y += ball.vy * dtFrames;

  if (ball.y - ball.r < 0) { ball.y = ball.r; ball.vy = -ball.vy; }
  if (ball.y + ball.r > FIELD.h) { ball.y = FIELD.h - ball.r; ball.vy = -ball.vy; }

  const leftP = prev.paddles.left;
  if (ball.x - ball.r < leftP.w && ball.y > leftP.y && ball.y < leftP.y + leftP.h) {
    const next = reflectBall({ ...prev, ball }, 'left');
    return { ...next, ball: { ...next.ball, x: leftP.w + next.ball.r } };
  }
  const rightP = prev.paddles.right;
  if (ball.x + ball.r > FIELD.w - rightP.w && ball.y > rightP.y && ball.y < rightP.y + rightP.h) {
    const next = reflectBall({ ...prev, ball }, 'right');
    return { ...next, ball: { ...next.ball, x: FIELD.w - rightP.w - next.ball.r } };
  }

  if (ball.x < 0) {
    return { ...prev, ball: centeredBall(1), scoreRight: prev.scoreRight + 1 };
  }
  if (ball.x > FIELD.w) {
    return { ...prev, ball: centeredBall(-1), scoreLeft: prev.scoreLeft + 1 };
  }

  return { ...prev, ball };
}

export function reflectBall(state: PongState, paddle: Side): PongState {
  const speed = Math.min(BALL.maxSpeed, Math.hypot(state.ball.vx, state.ball.vy) * 1.08);
  const sign = paddle === 'left' ? 1 : -1;
  const vx = sign * speed * 0.8;
  const vy = state.ball.vy + (Math.random() - 0.5) * 2;
  return { ...state, ball: { ...state.ball, vx, vy } };
}

export function movePaddle(state: PongState, side: Side, delta: number): PongState {
  const p = state.paddles[side];
  const y = Math.max(0, Math.min(FIELD.h - p.h, p.y + delta));
  return { ...state, paddles: { ...state.paddles, [side]: { ...p, y } } };
}

export function setPaddleY(state: PongState, side: Side, y: number): PongState {
  const p = state.paddles[side];
  const clamped = Math.max(0, Math.min(FIELD.h - p.h, y));
  return { ...state, paddles: { ...state.paddles, [side]: { ...p, y: clamped } } };
}

export function isOver(s: PongState): boolean {
  return s.scoreLeft >= WIN_SCORE || s.scoreRight >= WIN_SCORE;
}

export function winner(s: PongState): Side | null {
  if (s.scoreLeft >= WIN_SCORE) return 'left';
  if (s.scoreRight >= WIN_SCORE) return 'right';
  return null;
}
```

- [ ] **Step 4:** Run tests

```bash
pnpm test tests/pong-engine.test.ts
```
Expected: all pass.

- [ ] **Step 5:** Commit

```bash
git add src/lib/pong-engine.ts tests/pong-engine.test.ts
git commit -m "feat: pure-function Pong engine with physics and scoring"
```

### Task 2.2: AI paddle

**Files:**
- Create: `src/lib/pong-ai.ts`
- Create: `tests/pong-ai.test.ts`

- [ ] **Step 1:** Write failing test

```ts
import { describe, expect, it } from 'vitest';
import { aiDelta } from '@/lib/pong-ai';
import { createState } from '@/lib/pong-engine';

describe('aiDelta', () => {
  it('is zero when ball moves away from AI', () => {
    const s = createState();
    s.ball.vx = -5;              // moving toward player (left)
    expect(aiDelta(s, 0)).toBe(0);
  });

  it('moves toward ball y when ball approaches AI', () => {
    const s = createState();
    s.ball.vx = 5;               // toward right (AI)
    s.ball.y = 10;
    s.paddles.right.y = 200;
    expect(aiDelta(s, 0)).toBeLessThan(0); // move up
  });

  it('is clamped to max speed', () => {
    const s = createState();
    s.ball.vx = 5;
    s.ball.y = 0;
    s.paddles.right.y = 500;
    const d = aiDelta(s, 0);
    expect(Math.abs(d)).toBeLessThanOrEqual(5);   // max AI speed
  });

  it('does not react before reactionDelay frames', () => {
    const s = createState();
    s.ball.vx = 5;
    s.ball.y = 0;
    expect(aiDelta(s, 5, { reactionDelay: 10 })).toBe(0);
  });
});
```

- [ ] **Step 2:** Run test, expect FAIL.

- [ ] **Step 3:** Implement

```ts
// src/lib/pong-ai.ts
import type { PongState } from './pong-engine';

export interface AIConfig {
  maxSpeed: number;       // px per tick
  reactionDelay: number;  // frames the AI ignores before reacting
}

export const DEFAULT_AI: AIConfig = { maxSpeed: 5, reactionDelay: 7 };

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
  return Math.max(-maxSpeed, Math.min(maxSpeed, diff * 0.12));
}
```

- [ ] **Step 4:** Run tests, expect PASS.

- [ ] **Step 5:** Commit

```bash
git add src/lib/pong-ai.ts tests/pong-ai.test.ts
git commit -m "feat: pong AI paddle with reaction delay and speed cap"
```

### Task 2.3: Audio helpers

**Files:**
- Create: `src/lib/pong-audio.ts`

- [ ] **Step 1:** Implement

```ts
let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  return ctx;
}

function beep(freq: number, durMs: number, type: OscillatorType = 'square') {
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
  wall:   () => beep(220, 50),
  score:  () => beep(110, 200, 'sawtooth'),
  win:    () => { beep(660, 120); setTimeout(() => beep(880, 200), 120); },
  lose:   () => { beep(160, 200); setTimeout(() => beep(120, 260), 180); },
};
```

No unit tests (no behavior worth mocking `AudioContext` for). Verified via manual play later.

- [ ] **Step 2:** Commit

```bash
git add src/lib/pong-audio.ts
git commit -m "feat: pong square-wave SFX via Web Audio"
```

### Task 2.4: CRT styles

**Files:**
- Create: `src/styles/pong-crt.css`

- [ ] **Step 1:** Write

```css
.crt {
  position: relative;
  font-family: "Press Start 2P", ui-monospace, monospace;
  color: #7cff7c;
  background: #000;
}
.crt::before {
  content: "";
  position: absolute; inset: 0;
  background: repeating-linear-gradient(
    to bottom,
    rgba(0,0,0,0) 0 2px,
    rgba(0,0,0,0.25) 2px 3px
  );
  pointer-events: none;
  mix-blend-mode: multiply;
}
.crt::after {
  content: "";
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.6) 100%);
  pointer-events: none;
}
.crt-glow { text-shadow: 0 0 6px currentColor, 0 0 16px currentColor; }
```

- [ ] **Step 2:** Import in `src/app/globals.css`

Add line at top:
```css
@import "../styles/pong-crt.css";
```

- [ ] **Step 3:** Load "Press Start 2P" Google Font via `src/app/layout.tsx`

```tsx
import { Press_Start_2P } from 'next/font/google';
const press = Press_Start_2P({
  subsets: ['latin'], weight: '400', variable: '--font-pixel',
});
```

Apply `className={press.variable}` to `<html>` in the layout.

- [ ] **Step 4:** Commit

```bash
git add src/styles/pong-crt.css src/app/globals.css src/app/layout.tsx
git commit -m "style: CRT scanline overlay and pixel font"
```

### Task 2.5: `<SkipLink>` and `<GandalfScene>`

**Files:**
- Create: `src/components/pong/SkipLink.tsx`
- Create: `src/components/pong/GandalfScene.tsx`

- [ ] **Step 1:** `SkipLink.tsx`

```tsx
'use client';
import Link from 'next/link';
import { setPathway } from '@/lib/pathway';

export function SkipLink() {
  return (
    <Link
      href="/pro"
      onClick={() => setPathway('pro')}
      className="fixed bottom-4 right-4 text-xs text-white/60 hover:text-white underline"
    >
      Skip this and view the website →
    </Link>
  );
}
```

- [ ] **Step 2:** `GandalfScene.tsx`

```tsx
'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { setPathway } from '@/lib/pathway';

export function GandalfScene() {
  const [showMercy, setShowMercy] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShowMercy(true), 4000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <video
        src="/gandalf.mp4"
        autoPlay muted playsInline
        className="max-h-full max-w-full"
        onEnded={() => setShowMercy(true)}
      />
      {showMercy && (
        <Link
          href="/pro"
          onClick={() => setPathway('pro')}
          className="absolute bottom-10 text-white underline text-sm"
        >
          Alright, let me in anyway →
        </Link>
      )}
    </div>
  );
}
```

- [ ] **Step 3:** Source the Gandalf clip — save a short (≤3s) MP4 to `public/gandalf.mp4`. Until sourced, the component falls back to its mercy link after 4s even with a missing video (the `onEnded` doesn't fire but the `setTimeout` does).

- [ ] **Step 4:** Commit

```bash
git add src/components/pong/
git commit -m "feat: Pong SkipLink and GandalfScene overlay"
```

### Task 2.6: `<PongGame>` component

**Files:**
- Create: `src/components/pong/PongGame.tsx`

- [ ] **Step 1:** Implement

```tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createState, tick, setPaddleY, isOver, winner, movePaddle,
  FIELD, WIN_SCORE, type PongState,
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
  const [phase, setPhase] = useState<Phase>('idle');
  const aiFramesRef = useRef(0);
  const lossCountRef = useRef(0);
  const router = useRouter();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let raf = 0;

    function render() {
      const s = stateRef.current;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, FIELD.w, FIELD.h);
      ctx.fillStyle = '#7cff7c';
      ctx.fillRect(0, s.paddles.left.y, s.paddles.left.w, s.paddles.left.h);
      ctx.fillRect(FIELD.w - s.paddles.right.w, s.paddles.right.y, s.paddles.right.w, s.paddles.right.h);
      ctx.beginPath(); ctx.arc(s.ball.x, s.ball.y, s.ball.r, 0, Math.PI * 2); ctx.fill();
      for (let y = 0; y < FIELD.h; y += 20) ctx.fillRect(FIELD.w / 2 - 1, y, 2, 10);
      ctx.font = '40px "Press Start 2P", monospace';
      ctx.fillText(String(s.scoreLeft), FIELD.w / 2 - 80, 60);
      ctx.fillText(String(s.scoreRight), FIELD.w / 2 + 52, 60);
      if (phaseRef.current === 'idle') {
        ctx.font = '20px "Press Start 2P", monospace';
        ctx.fillText('PRESS SPACE TO START', FIELD.w / 2 - 220, FIELD.h / 2 + 120);
      }
    }

    function loop() {
      if (phaseRef.current === 'playing') {
        const prev = stateRef.current;
        const prevDir = Math.sign(prev.ball.vx);
        let next = tick(prev, 1);
        aiFramesRef.current = Math.sign(next.ball.vx) !== prevDir ? 0 : aiFramesRef.current + 1;
        next = movePaddle(next, 'right', aiDelta(next, aiFramesRef.current));
        if (next.scoreLeft > prev.scoreLeft || next.scoreRight > prev.scoreRight) sfx.score();
        stateRef.current = next;
        if (isOver(next)) {
          const w = winner(next);
          if (w === 'left') { sfx.win(); setPhase('won'); phaseRef.current = 'won';
            setPathway('gaming');
            setTimeout(() => router.push('/dashboard'), 1500);
          } else {
            sfx.lose();
            lossCountRef.current += 1;
            const p: Phase = lossCountRef.current >= 2 ? 'lost-2' : 'lost-1';
            setPhase(p); phaseRef.current = p;
          }
        }
      }
      render();
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [router]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code === 'Space' && phaseRef.current === 'idle') {
        phaseRef.current = 'playing'; setPhase('playing');
      }
      if (phaseRef.current === 'playing') {
        const step = 20;
        if (e.code === 'ArrowUp' || e.code === 'KeyW')
          stateRef.current = movePaddle(stateRef.current, 'left', -step);
        if (e.code === 'ArrowDown' || e.code === 'KeyS')
          stateRef.current = movePaddle(stateRef.current, 'left', step);
      }
    }
    function onMouse(e: MouseEvent) {
      const canvas = canvasRef.current; if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const y = (e.clientY - rect.top) * (FIELD.h / rect.height);
      stateRef.current = setPaddleY(stateRef.current, 'left', y - 40);
    }
    function onBlur() {
      if (phaseRef.current === 'playing') {
        phaseRef.current = 'idle'; setPhase('idle');
      }
    }
    window.addEventListener('keydown', onKey);
    window.addEventListener('blur', onBlur);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) onBlur();
    });
    canvasRef.current?.addEventListener('mousemove', onMouse);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('blur', onBlur);
      canvasRef.current?.removeEventListener('mousemove', onMouse);
    };
  }, []);

  function retry() {
    stateRef.current = createState();
    phaseRef.current = 'playing';
    setPhase('playing');
  }

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
            <button onClick={retry} className="crt-glow text-2xl p-6 border border-current">
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
```

- [ ] **Step 2:** Create `src/app/page.tsx`

```tsx
import { PongGame } from '@/components/pong/PongGame';
export default function Home() { return <PongGame />; }
```

- [ ] **Step 3:** Manual play test

```bash
pnpm dev
```
Visit http://localhost:3000 → Press Space → use mouse/arrows → confirm scoring, AI, skip link all work. Lose twice → Gandalf overlay appears. Win → redirects to `/dashboard` (will 404 for now — expected). Visit `/reset` → pathway cleared, back to Pong.

- [ ] **Step 4:** Commit

```bash
git add src/components/pong/PongGame.tsx src/app/page.tsx
git commit -m "feat: Pong game component with state machine and gate wiring"
```

---

## Phase 3 — `/pro` page (LinkedIn pastiche)

Goal: shareable recruiter-safe page. LinkedIn-style visual, with all sections from spec §5.

### Task 3.1: Static content files

**Files:**
- Create: `src/content/bio.ts`, `src/content/experience.ts`, `src/content/projects.ts`, `src/content/achievements.ts`, `src/content/reviews.ts`

- [ ] **Step 1:** Extract content from the resume and the Steam mockup into typed modules. Example — `src/content/projects.ts`:

```ts
export interface Project {
  slug: string;
  title: string;        // display title
  tagline: string;
  description: string;
  tech: string[];
  github?: string;
  hoursPlayed?: number; // for /dashboard
  featured?: boolean;
}

export const projects: Project[] = [
  {
    slug: 'jobbot',
    title: 'Jobbot',
    tagline: 'AI agent that applies to jobs for you',
    description:
      'Python + LangChain agent that reads a resume, finds matching postings, and submits tailored applications.',
    tech: ['Python', 'LangChain', 'Playwright'],
    github: 'https://github.com/Dkirali/Automated-Application',
    hoursPlayed: 480,
    featured: true,
  },
  {
    slug: 'flow',
    title: 'FLŌW',
    tagline: 'Personal budget + habit tracker',
    description:
      'React Native app that unifies budgeting and habit tracking in one daily flow.',
    tech: ['React Native', 'TypeScript', 'SQLite'],
    github: 'https://github.com/Dkirali/flow',
    hoursPlayed: 220,
  },
];
```

Bio / experience / achievements / reviews follow the same pattern — extract verbatim from resume PDF and the Steam mockup reference at `reference/steam-mockup.html`.

- [ ] **Step 2:** Commit

```bash
git add src/content/
git commit -m "feat: typed content modules sourced from resume and mockup"
```

### Task 3.2: `<ProfilePhoto>` component with canvas morph

**Files:**
- Create: `src/components/profile/ProfilePhoto.tsx`

This ports the canvas pixelation from `reference/steam-mockup.html` into a React component. Pixel source is treated as pixel art (no smoothing); photo source keeps smoothing.

- [ ] **Step 1:** Implement

```tsx
'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

type Mode = 'linkedin' | 'gaming';
interface Cached { canvas: HTMLCanvasElement; pixelated: boolean; }

interface Props {
  className?: string;
  size?: number;
  linkedinSrc?: string;
  gamingSrc?: string;
  alt?: string;
}

export function ProfilePhoto({
  className,
  size = 256,
  linkedinSrc = '/headshot.png',
  gamingSrc = '/headshot-pixel.png',
  alt = 'Doruk Kırali',
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const linkedinRef = useRef<Cached | null>(null);
  const gamingRef = useRef<Cached | null>(null);
  const progressRef = useRef(0);
  const targetRef = useRef(0);
  const runningRef = useRef(false);
  const [mode, setMode] = useState<Mode>('linkedin');

  const fitToCanvas = useCallback((img: HTMLImageElement, pixelated: boolean): Cached => {
    const c = document.createElement('canvas');
    c.width = size; c.height = size;
    const cx = c.getContext('2d')!;
    cx.imageSmoothingEnabled = !pixelated;
    const iw = img.naturalWidth, ih = img.naturalHeight;
    const scale = Math.max(size / iw, size / ih);
    const w = iw * scale, h = ih * scale;
    cx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
    return { canvas: c, pixelated };
  }, [size]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    function drawFrame() {
      const a = linkedinRef.current, b = gamingRef.current;
      if (!a || !b) return;
      const p = -(Math.cos(Math.PI * progressRef.current) - 1) / 2; // easeInOutSine
      const bell = Math.sin(p * Math.PI);
      const bs = Math.max(1, Math.round(1 + bell * (size / 8)));
      const src = p < 0.5 ? a : b;
      const cells = Math.ceil(size / bs);
      const small = document.createElement('canvas');
      small.width = cells; small.height = cells;
      const sctx = small.getContext('2d')!;
      sctx.imageSmoothingEnabled = !src.pixelated;
      sctx.drawImage(src.canvas, 0, 0, cells, cells);
      ctx.clearRect(0, 0, size, size);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(small, 0, 0, size, size);
    }

    function loop() {
      runningRef.current = true;
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
        requestAnimationFrame(step);
      };
      step();
    }

    function load(src: string, pixelated: boolean): Promise<Cached> {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = src;
        img.onload = () => resolve(fitToCanvas(img, pixelated));
      });
    }

    Promise.all([load(linkedinSrc, false), load(gamingSrc, true)]).then(([a, b]) => {
      linkedinRef.current = a;
      gamingRef.current = b;
      drawFrame();
    });

    // expose a trigger via window for imperative toggling in tests if needed
    const el = canvasRef.current!;
    const go = (toward: number) => {
      targetRef.current = toward;
      if (!runningRef.current) requestAnimationFrame(loop);
    };
    const handleEnter = () => { setMode('gaming'); go(1); };
    const handleLeave = () => { setMode('linkedin'); go(0); };
    const handleToggle = () => {
      const next = mode === 'linkedin' ? 'gaming' : 'linkedin';
      setMode(next); go(next === 'gaming' ? 1 : 0);
    };
    el.addEventListener('mouseenter', handleEnter);
    el.addEventListener('mouseleave', handleLeave);
    el.addEventListener('click', handleToggle);
    return () => {
      el.removeEventListener('mouseenter', handleEnter);
      el.removeEventListener('mouseleave', handleLeave);
      el.removeEventListener('click', handleToggle);
    };
  }, [size, linkedinSrc, gamingSrc, fitToCanvas, mode]);

  return (
    <div className={className} style={{ width: size, height: size }}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={alt}
        className="rounded-full cursor-pointer"
      />
      <button
        type="button"
        onClick={() => {
          const next = mode === 'linkedin' ? 'gaming' : 'linkedin';
          setMode(next);
          targetRef.current = next === 'gaming' ? 1 : 0;
          if (!runningRef.current) requestAnimationFrame(() => {}); // nudge loop via click path
        }}
        className="sr-only"
        aria-label={`Toggle avatar to ${mode === 'linkedin' ? 'gaming' : 'linkedin'} mode`}
      />
    </div>
  );
}
```

- [ ] **Step 2:** Commit

```bash
git add src/components/profile/ProfilePhoto.tsx
git commit -m "feat: ProfilePhoto React component with pixel-art morph"
```

### Task 3.3: `<CVDownload>` component

**Files:**
- Create: `src/components/cv/CVDownload.tsx`

- [ ] **Step 1:** Implement

```tsx
import Link from 'next/link';

export function CVDownload({ variant = 'pro' }: { variant?: 'pro' | 'dashboard' }) {
  const base =
    variant === 'pro'
      ? 'inline-flex items-center gap-2 px-4 py-2 rounded bg-[#0a66c2] text-white text-sm font-medium hover:bg-[#084a8f]'
      : 'inline-flex items-center gap-2 px-4 py-2 rounded bg-[#5c7e10] text-white text-sm font-medium hover:bg-[#6fa71a]';
  return (
    <Link href="/cv.pdf" className={base} target="_blank" rel="noopener">
      ↓ Download CV
    </Link>
  );
}
```

- [ ] **Step 2:** Commit

```bash
git add src/components/cv/CVDownload.tsx
git commit -m "feat: CVDownload button with pro and dashboard styling"
```

### Task 3.4: `/pro` page sections

**Files:**
- Create: `src/components/pro/ProBanner.tsx`, `ProProfileCard.tsx`, `ProAbout.tsx`, `ProFeatured.tsx`, `ProExperience.tsx`, `ProSkills.tsx`, `ProFooter.tsx`, `ProContact.tsx`
- Create: `src/app/pro/page.tsx`

Each section is a pure presentational component that reads from the content modules. Keep each file to one section and under ~60 lines.

- [ ] **Step 1:** `ProProfileCard.tsx`

```tsx
import { ProfilePhoto } from '@/components/profile/ProfilePhoto';
import { CVDownload } from '@/components/cv/CVDownload';
import { bio } from '@/content/bio';

export function ProProfileCard() {
  return (
    <section className="bg-white border border-neutral-200 rounded-lg -mt-20 mx-4 p-6 shadow-sm">
      <div className="flex items-end gap-6">
        <ProfilePhoto size={160} className="rounded-full border-4 border-white -mt-16" />
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">{bio.name}</h1>
          <p className="text-neutral-700">{bio.title}</p>
          <p className="text-sm text-neutral-500">{bio.location}</p>
          <div className="mt-4 flex gap-3">
            <a href="#contact" className="px-4 py-2 rounded-full bg-[#0a66c2] text-white text-sm font-medium">
              Contact
            </a>
            <CVDownload variant="pro" />
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2:** `ProBanner.tsx`

```tsx
export function ProBanner() {
  return (
    <div
      aria-hidden
      className="h-48 w-full bg-gradient-to-br from-[#004182] via-[#0a66c2] to-[#378fe9]"
    />
  );
}
```

- [ ] **Step 3:** `ProAbout.tsx`

```tsx
import { bio } from '@/content/bio';
export function ProAbout() {
  return (
    <section className="bg-white border border-neutral-200 rounded-lg mx-4 p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-3">About</h2>
      <p className="text-sm text-neutral-700 whitespace-pre-line">{bio.about}</p>
    </section>
  );
}
```

- [ ] **Step 4:** `ProFeatured.tsx`

```tsx
import Link from 'next/link';
import { projects } from '@/content/projects';
export function ProFeatured() {
  const featured = projects.filter((p) => p.featured);
  return (
    <section className="bg-white border border-neutral-200 rounded-lg mx-4 p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-3">Featured</h2>
      <ul className="grid gap-4 sm:grid-cols-2">
        {featured.map((p) => (
          <li key={p.slug} className="border border-neutral-200 rounded p-4">
            <h3 className="font-medium">{p.title}</h3>
            <p className="text-sm text-neutral-500">{p.tagline}</p>
            <p className="text-sm mt-2">{p.description}</p>
            {p.github && (
              <Link href={p.github} className="text-[#0a66c2] text-sm mt-2 inline-block" target="_blank" rel="noopener">
                GitHub →
              </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 5:** `ProExperience.tsx`

```tsx
import { experience } from '@/content/experience';
export function ProExperience() {
  return (
    <section className="bg-white border border-neutral-200 rounded-lg mx-4 p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-3">Experience</h2>
      <ul className="space-y-5">
        {experience.map((e) => (
          <li key={`${e.company}-${e.start}`}>
            <h3 className="font-medium">{e.role} · {e.company}</h3>
            <p className="text-xs text-neutral-500">{e.start} – {e.end ?? 'Present'} · {e.location}</p>
            <p className="text-sm mt-1 whitespace-pre-line">{e.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 6:** `ProSkills.tsx`

```tsx
import { skills } from '@/content/bio';
export function ProSkills() {
  return (
    <section className="bg-white border border-neutral-200 rounded-lg mx-4 p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-3">Skills</h2>
      <ul className="flex flex-wrap gap-2">
        {skills.map((s) => (
          <li key={s} className="text-xs px-3 py-1 bg-neutral-100 border border-neutral-200 rounded-full">{s}</li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 7:** `ProFooter.tsx`

```tsx
import Link from 'next/link';
export function ProFooter() {
  return (
    <footer className="py-10 text-center text-xs text-neutral-400">
      <Link href="/reset" className="hover:text-neutral-600 underline">
        wait, was there a game? →
      </Link>
    </footer>
  );
}
```

- [ ] **Step 8:** `ProContact.tsx` — stub until Phase 5 replaces the body

```tsx
export function ProContact() {
  return (
    <section id="contact" className="bg-white border border-neutral-200 rounded-lg mx-4 p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-3">Contact</h2>
      <p className="text-sm text-neutral-500">Form wired up in Phase 5.</p>
    </section>
  );
}
```

Adjust the `bio` and `experience` exports in `@/content/*` if the field names here don't match. Expected shape: `bio = { name, title, location, about }`, `skills: string[]`, `experience: { role, company, start, end?, location, description }[]`.

- [ ] **Step 9:** `src/app/pro/page.tsx`

```tsx
import { ProBanner } from '@/components/pro/ProBanner';
import { ProProfileCard } from '@/components/pro/ProProfileCard';
import { ProAbout } from '@/components/pro/ProAbout';
import { ProFeatured } from '@/components/pro/ProFeatured';
import { ProExperience } from '@/components/pro/ProExperience';
import { ProSkills } from '@/components/pro/ProSkills';
import { ProContact } from '@/components/pro/ProContact';
import { ProFooter } from '@/components/pro/ProFooter';

export default function ProPage() {
  return (
    <main className="bg-neutral-100 min-h-screen">
      <ProBanner />
      <div className="max-w-3xl mx-auto space-y-4">
        <ProProfileCard />
        <ProAbout />
        <ProFeatured />
        <ProExperience />
        <ProSkills />
        <ProContact />
        <ProFooter />
      </div>
    </main>
  );
}
```

- [ ] **Step 10:** Visual check

```bash
pnpm dev
```
Open http://localhost:3000/pro → confirm structure, responsive at 375px width.

- [ ] **Step 11:** Commit

```bash
git add src/components/pro/ src/app/pro/page.tsx
git commit -m "feat: /pro LinkedIn-pastiche page with profile, about, featured, experience, skills"
```

---

## Phase 4 — `/dashboard` page (Steam pastiche)

Goal: port the existing `reference/steam-mockup.html` into React components. Use the same visual design, same content, same avatar morph. Break the single HTML file into focused React files.

### Task 4.1: Extract design tokens and shared styles

**Files:**
- Create: `src/components/dashboard/dashboard.css` (imported by page root)

- [ ] **Step 1:** Copy the scoped CSS variables from `reference/steam-mockup.html` (the `:root` block, Steam palette) into `dashboard.css`, scoped under a `.steam` class wrapper.

- [ ] **Step 2:** Commit

```bash
git add src/components/dashboard/dashboard.css
git commit -m "style: dashboard design tokens from Steam mockup"
```

### Task 4.2: Section components

**Files (one per section, copying markup from the mockup):**
- `src/components/dashboard/DashNav.tsx` — top bar
- `src/components/dashboard/DashProfile.tsx` — profile hero with `<ProfilePhoto>`, LVL, XP bar, status
- `src/components/dashboard/DashFeatured.tsx` — featured Jobbot card
- `src/components/dashboard/DashLibrary.tsx` — game card grid from `projects`
- `src/components/dashboard/DashAchievements.tsx` — achievements grid from `achievements` content
- `src/components/dashboard/DashTimeline.tsx` — hours-played bar chart (Styx ~9500 etc, from content)
- `src/components/dashboard/DashReviews.tsx` — reviews cards from `reviews` content
- `src/components/dashboard/DashRoadmap.tsx` — upcoming/planned
- `src/components/dashboard/DashContact.tsx` — contact + CV download (Phase 5 plugs in form)
- `src/components/dashboard/DashFooter.tsx` — link to `/pro`

Each file:
1. Pure presentational, reads from `@/content/*`.
2. Stays under ~80 lines.
3. Uses Tailwind + class names from `dashboard.css` where tokens matter.

- [ ] **Step 1 (representative):** `DashProfile.tsx`

```tsx
import { ProfilePhoto } from '@/components/profile/ProfilePhoto';
import { bio } from '@/content/bio';

export function DashProfile() {
  return (
    <section className="flex gap-6 items-center p-6">
      <ProfilePhoto size={128} />
      <div>
        <h1 className="text-2xl font-bold text-white">{bio.name}</h1>
        <p className="text-[#a0b2c4] text-sm">● Online · Currently playing: Life</p>
        <div className="mt-2 w-64 h-2 bg-[#1b2838] rounded">
          <div className="h-2 bg-[#5c7e10] rounded" style={{ width: '62%' }} />
        </div>
        <p className="text-xs text-[#a0b2c4] mt-1">LEVEL 33 · 62% to 34</p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2:** Implement the remaining section components by copying markup + wiring from `reference/steam-mockup.html` and replacing hard-coded strings with imports from `@/content/*`. Keep the avatar morph working (it's already in `<ProfilePhoto>`).

- [ ] **Step 3:** `src/app/dashboard/page.tsx`

```tsx
import '@/components/dashboard/dashboard.css';
import { DashNav } from '@/components/dashboard/DashNav';
import { DashProfile } from '@/components/dashboard/DashProfile';
import { DashFeatured } from '@/components/dashboard/DashFeatured';
import { DashLibrary } from '@/components/dashboard/DashLibrary';
import { DashAchievements } from '@/components/dashboard/DashAchievements';
import { DashTimeline } from '@/components/dashboard/DashTimeline';
import { DashReviews } from '@/components/dashboard/DashReviews';
import { DashRoadmap } from '@/components/dashboard/DashRoadmap';
import { DashContact } from '@/components/dashboard/DashContact';
import { DashFooter } from '@/components/dashboard/DashFooter';

export default function DashboardPage() {
  return (
    <main className="steam bg-[#1b2838] min-h-screen text-white">
      <DashNav />
      <div className="max-w-6xl mx-auto">
        <DashProfile />
        <DashFeatured />
        <DashLibrary />
        <DashAchievements />
        <DashTimeline />
        <DashReviews />
        <DashRoadmap />
        <DashContact />
      </div>
      <DashFooter />
    </main>
  );
}
```

- [ ] **Step 4:** Visual check at http://localhost:3000/dashboard — compare side-by-side with `reference/steam-mockup.html`. Avatar morph must work on hover.

- [ ] **Step 5:** Commit

```bash
git add src/components/dashboard/ src/app/dashboard/page.tsx
git commit -m "feat: /dashboard Steam-pastiche page ported from HTML mockup"
```

### Task 4.3: Project detail pages — `/dashboard/[slug]`

**Files:**
- Create: `src/app/dashboard/[slug]/page.tsx`
- Modify: `src/components/dashboard/DashLibrary.tsx` (wrap each game card in a `<Link>` to `/dashboard/${project.slug}`)

- [ ] **Step 1:** Implement detail page

```tsx
// src/app/dashboard/[slug]/page.tsx
import '@/components/dashboard/dashboard.css';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projects } from '@/content/projects';
import { DashNav } from '@/components/dashboard/DashNav';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

interface Props { params: Promise<{ slug: string }>; }

export default async function ProjectDetail({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <main className="steam bg-[#1b2838] min-h-screen text-white">
      <DashNav />
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <header>
          <h1 className="text-3xl font-bold">{project.title}</h1>
          <p className="text-[#a0b2c4]">{project.tagline}</p>
        </header>

        <section className="bg-[#16202d] border border-[#2a475e] rounded p-6">
          <h2 className="text-sm uppercase tracking-wide text-[#a0b2c4]">About this project</h2>
          <p className="mt-2 text-sm whitespace-pre-line">{project.description}</p>
        </section>

        <section className="bg-[#16202d] border border-[#2a475e] rounded p-6">
          <h2 className="text-sm uppercase tracking-wide text-[#a0b2c4]">System requirements</h2>
          <ul className="mt-2 text-sm text-[#c7d5e0] space-y-1">
            <li><strong>Minimum:</strong> Curiosity, caffeine</li>
            <li><strong>Recommended:</strong> Product sense, a Git client, headphones</li>
            <li><strong>Storage:</strong> 0 KB (it's on GitHub)</li>
          </ul>
        </section>

        <section className="bg-[#16202d] border border-[#2a475e] rounded p-6">
          <h2 className="text-sm uppercase tracking-wide text-[#a0b2c4]">Tech stack</h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <li key={t} className="text-xs px-2 py-1 bg-[#1b2838] border border-[#5c7e10] rounded">{t}</li>
            ))}
          </ul>
        </section>

        {project.github && (
          <Link
            href={project.github}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#5c7e10] hover:bg-[#6fa71a] text-white rounded font-medium"
          >
            ↓ Install (GitHub)
          </Link>
        )}

        <Link href="/dashboard" className="block text-sm text-[#a0b2c4] underline">
          ← Back to library
        </Link>
      </div>
    </main>
  );
}
```

- [ ] **Step 2:** Wrap library cards in links. In `DashLibrary.tsx` make each card a `<Link href={\`/dashboard/${p.slug}\`}>`.

- [ ] **Step 3:** Visual check: click a library card → lands on the detail page → "Install" goes to GitHub → back link returns.

- [ ] **Step 4:** Commit

```bash
git add src/app/dashboard/\[slug\]/page.tsx src/components/dashboard/DashLibrary.tsx
git commit -m "feat: /dashboard/[slug] project detail pages with Steam-style install CTA"
```

---

## Phase 5 — Contact form + Resend API

Goal: both `/pro` and `/dashboard` have a working contact form that sends email to `kiralidoruk@gmail.com`, rate-limited and honeypot-protected.

### Task 5.1: Shared Zod schema

**Files:**
- Create: `src/lib/contact-schema.ts`
- Create: `tests/contact-schema.test.ts`

- [ ] **Step 1:** Write failing tests

```ts
import { describe, expect, it } from 'vitest';
import { contactSchema } from '@/lib/contact-schema';

describe('contactSchema', () => {
  const valid = { name: 'Ada', email: 'a@b.com', message: 'hi there friend', hp: '' };
  it('accepts valid input', () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });
  it('rejects bad email', () => {
    expect(contactSchema.safeParse({ ...valid, email: 'not-an-email' }).success).toBe(false);
  });
  it('rejects short message', () => {
    expect(contactSchema.safeParse({ ...valid, message: 'hi' }).success).toBe(false);
  });
  it('rejects filled honeypot', () => {
    expect(contactSchema.safeParse({ ...valid, hp: 'bot' }).success).toBe(false);
  });
});
```

- [ ] **Step 2:** Run, expect FAIL.

- [ ] **Step 3:** Install Zod and implement

```bash
pnpm add zod
```

```ts
// src/lib/contact-schema.ts
import { z } from 'zod';
export const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(200),
  message: z.string().min(10).max(2000),
  hp: z.literal(''),
});
export type ContactInput = z.infer<typeof contactSchema>;
```

- [ ] **Step 4:** Run tests, expect PASS.

- [ ] **Step 5:** Commit

```bash
git add src/lib/contact-schema.ts tests/contact-schema.test.ts package.json pnpm-lock.yaml
git commit -m "feat: shared contact form validation schema"
```

### Task 5.2: Rate limiter

**Files:**
- Create: `src/lib/rate-limit.ts`
- Create: `tests/rate-limit.test.ts`

- [ ] **Step 1:** Write failing tests

```ts
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
    rl.check('x'); expect(rl.check('x')).toBe(false);
    vi.advanceTimersByTime(1001);
    expect(rl.check('x')).toBe(true);
    vi.useRealTimers();
  });
  it('keys are isolated', () => {
    const rl = createRateLimiter({ max: 1, windowMs: 60_000 });
    expect(rl.check('a')).toBe(true);
    expect(rl.check('b')).toBe(true);
  });
});
```

- [ ] **Step 2:** Run, expect FAIL.

- [ ] **Step 3:** Implement

```ts
// src/lib/rate-limit.ts
interface Entry { count: number; resetAt: number; }

export interface RateLimiter {
  check(key: string): boolean;
}

export function createRateLimiter(opts: { max: number; windowMs: number }): RateLimiter {
  const store = new Map<string, Entry>();
  return {
    check(key) {
      const now = Date.now();
      const e = store.get(key);
      if (!e || e.resetAt <= now) {
        store.set(key, { count: 1, resetAt: now + opts.windowMs });
        return true;
      }
      if (e.count >= opts.max) return false;
      e.count += 1;
      return true;
    },
  };
}
```

- [ ] **Step 4:** Run tests, expect PASS.

- [ ] **Step 5:** Commit

```bash
git add src/lib/rate-limit.ts tests/rate-limit.test.ts
git commit -m "feat: in-memory rate limiter"
```

### Task 5.3: Resend wrapper

**Files:**
- Create: `src/lib/email.ts`

- [ ] **Step 1:** Install and implement

```bash
pnpm add resend
```

```ts
// src/lib/email.ts
import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;
const to = process.env.CONTACT_TO_EMAIL ?? 'kiralidoruk@gmail.com';
const from = process.env.CONTACT_FROM_EMAIL ?? 'onboarding@resend.dev';

export async function sendContactEmail(input: {
  name: string; email: string; message: string;
}): Promise<void> {
  if (!apiKey) throw new Error('RESEND_API_KEY not configured');
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: input.email,
    subject: `[Site] ${input.name}`,
    text: `From: ${input.name} <${input.email}>\n\n${input.message}`,
  });
  if (error) throw new Error(`Resend error: ${error.message}`);
}
```

- [ ] **Step 2:** Commit

```bash
git add src/lib/email.ts package.json pnpm-lock.yaml
git commit -m "feat: Resend wrapper for contact form emails"
```

### Task 5.4: `/api/contact` route

**Files:**
- Create: `src/app/api/contact/route.ts`
- Create: `tests/api-contact.test.ts`

- [ ] **Step 1:** Write failing tests (we'll stub `sendContactEmail` and the rate limiter)

```ts
import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('@/lib/email', () => ({ sendContactEmail: vi.fn() }));
vi.mock('@/lib/rate-limit', async () => {
  const actual = await vi.importActual<typeof import('@/lib/rate-limit')>('@/lib/rate-limit');
  return { ...actual };
});

import { POST } from '@/app/api/contact/route';
import { sendContactEmail } from '@/lib/email';

function req(body: unknown, ip = '1.2.3.4') {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify(body),
  });
}

describe('POST /api/contact', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 400 on invalid input', async () => {
    const res = await POST(req({ name: '', email: 'x', message: '', hp: '' }));
    expect(res.status).toBe(400);
  });

  it('returns 400 on honeypot', async () => {
    const res = await POST(req({ name: 'A', email: 'a@b.com', message: 'hi hi hi hi', hp: 'bot' }));
    expect(res.status).toBe(400);
  });

  it('returns 200 and sends email on valid input', async () => {
    const res = await POST(req({ name: 'A', email: 'a@b.com', message: 'hello there', hp: '' }));
    expect(res.status).toBe(200);
    expect(sendContactEmail).toHaveBeenCalledOnce();
  });

  it('rate-limits after 3 per IP', async () => {
    const ok = { name: 'A', email: 'a@b.com', message: 'hello there', hp: '' };
    await POST(req(ok, '9.9.9.9'));
    await POST(req(ok, '9.9.9.9'));
    await POST(req(ok, '9.9.9.9'));
    const blocked = await POST(req(ok, '9.9.9.9'));
    expect(blocked.status).toBe(429);
  });
});
```

- [ ] **Step 2:** Run, expect FAIL.

- [ ] **Step 3:** Implement

```ts
// src/app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/contact-schema';
import { createRateLimiter } from '@/lib/rate-limit';
import { sendContactEmail } from '@/lib/email';

const limiter = createRateLimiter({ max: 3, windowMs: 60 * 60 * 1000 });

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (!limiter.check(ip)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }
  let payload: unknown;
  try { payload = await req.json(); }
  catch { return NextResponse.json({ error: 'bad_json' }, { status: 400 }); }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }
  try {
    await sendContactEmail({
      name: parsed.data.name,
      email: parsed.data.email,
      message: parsed.data.message,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'send_failed' }, { status: 502 });
  }
}
```

- [ ] **Step 4:** Run tests, expect PASS.

- [ ] **Step 5:** Commit

```bash
git add src/app/api/contact/route.ts tests/api-contact.test.ts
git commit -m "feat: /api/contact with Zod validation, honeypot, rate limit, Resend"
```

### Task 5.5: `<ContactForm>` component + wire-up

**Files:**
- Create: `src/components/contact/ContactForm.tsx`
- Modify: `src/components/pro/ProContact.tsx`, `src/components/dashboard/DashContact.tsx`

- [ ] **Step 1:** Implement form

```tsx
'use client';
import { useState } from 'react';
import { contactSchema } from '@/lib/contact-schema';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function ContactForm({ variant = 'pro' }: { variant?: 'pro' | 'dashboard' }) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const data = {
      name: String(form.get('name') ?? ''),
      email: String(form.get('email') ?? ''),
      message: String(form.get('message') ?? ''),
      hp: String(form.get('hp') ?? ''),
    };
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) { setError('Please fill all fields correctly.'); return; }
    setStatus('sending');
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) { setStatus('sent'); (e.target as HTMLFormElement).reset(); }
    else { setStatus('error'); setError(`Send failed (${res.status}).`); }
  }

  const inputCls = variant === 'pro'
    ? 'w-full p-2 border border-neutral-300 rounded text-sm'
    : 'w-full p-2 bg-[#1b2838] border border-[#5c7e10] rounded text-sm text-white';
  const btnCls = variant === 'pro'
    ? 'px-4 py-2 bg-[#0a66c2] text-white rounded text-sm font-medium'
    : 'px-4 py-2 bg-[#5c7e10] text-white rounded text-sm font-medium';

  return (
    <form onSubmit={onSubmit} className="space-y-3 max-w-md">
      <input name="hp" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <input name="name" required placeholder="Your name" className={inputCls} />
      <input name="email" type="email" required placeholder="Your email" className={inputCls} />
      <textarea name="message" required rows={5} placeholder="Your message" className={inputCls} />
      <button type="submit" disabled={status === 'sending'} className={btnCls}>
        {status === 'sending' ? 'Sending…' : 'Send message'}
      </button>
      {status === 'sent' && <p className="text-sm text-green-600">Thanks — I'll be in touch.</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
```

- [ ] **Step 2:** Wire into `ProContact.tsx`

```tsx
import { ContactForm } from '@/components/contact/ContactForm';
export function ProContact() {
  return (
    <section id="contact" className="bg-white border border-neutral-200 rounded-lg mx-4 p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Contact</h2>
      <ContactForm variant="pro" />
    </section>
  );
}
```

- [ ] **Step 3:** Same pattern in `DashContact.tsx` with `variant="dashboard"`.

- [ ] **Step 4:** Manual e2e

```bash
cp .env.local.example .env.local  # fill in RESEND_API_KEY
pnpm dev
```
Submit form on `/pro` → check inbox.

- [ ] **Step 5:** Commit

```bash
git add src/components/contact/ src/components/pro/ProContact.tsx src/components/dashboard/DashContact.tsx
git commit -m "feat: ContactForm wired into /pro and /dashboard"
```

---

## Phase 6 — Deployment (Hetzner + Coolify)

Goal: pushing to `main` on GitHub triggers Coolify to build and redeploy the site on the Hetzner VPS.

### Task 6.1: Enable standalone output

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1:** Set

```ts
import type { NextConfig } from 'next';
const nextConfig: NextConfig = { output: 'standalone' };
export default nextConfig;
```

- [ ] **Step 2:** Commit

```bash
git add next.config.ts
git commit -m "chore: emit standalone output for containerized deploy"
```

### Task 6.2: Dockerfile

**Files:**
- Create: `Dockerfile`
- Create: `.dockerignore`

- [ ] **Step 1:** `.dockerignore`

```
node_modules
.next
.git
reference
tests
docs
.superpowers
*.md
Dockerfile
.env*
```

- [ ] **Step 2:** `Dockerfile`

```dockerfile
# syntax=docker/dockerfile:1.6
ARG NODE_VERSION=20-alpine

FROM node:${NODE_VERSION} AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM node:${NODE_VERSION} AS build
WORKDIR /app
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM node:${NODE_VERSION} AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
RUN addgroup -S app && adduser -S app -G app
COPY --from=build --chown=app:app /app/public ./public
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
USER app
EXPOSE 3000
CMD ["node", "server.js"]
```

- [ ] **Step 3:** Local smoke test

```bash
docker build -t personal-website:test .
docker run --rm -p 3000:3000 -e RESEND_API_KEY=dummy personal-website:test
# visit http://localhost:3000
```

Expected: Pong page loads.

- [ ] **Step 4:** Commit

```bash
git add Dockerfile .dockerignore
git commit -m "feat: production Dockerfile with standalone Next output"
```

### Task 6.3: README deployment section

**Files:**
- Create: `README.md`

- [ ] **Step 1:** Write sections: setup, run, test, deploy (with Coolify step list: create new resource → pick GitHub repo → select Dockerfile builder → add env vars → set domain). Reference the spec file.

- [ ] **Step 2:** Commit

```bash
git add README.md
git commit -m "docs: add README with setup and deploy instructions"
```

### Task 6.4: Coolify configuration (manual in UI)

Not a code task — run through once in the Coolify UI on the Hetzner server:

- [ ] **Step 1:** Push repo to GitHub if not already there.
- [ ] **Step 2:** In Coolify → New Resource → Application → connect GitHub repo → branch `main` → build pack `Dockerfile`.
- [ ] **Step 3:** Set env vars: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`.
- [ ] **Step 4:** Set port `3000`, healthcheck `/pro` (200).
- [ ] **Step 5:** Attach domain once purchased → Let's Encrypt auto.
- [ ] **Step 6:** Enable auto-deploy on `main` push.

---

## Phase 7 — Polish + E2E

### Task 7.1: Playwright E2E — gate flow

**Files:**
- Create: `tests/e2e/gate.spec.ts`

- [ ] **Step 1:** Write

```ts
import { test, expect } from '@playwright/test';

test('skip link routes to /pro and pins pathway', async ({ page, context }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /Skip this/i }).click();
  await expect(page).toHaveURL(/\/pro$/);
  const cookies = await context.cookies();
  expect(cookies.find(c => c.name === 'pathway')?.value).toBe('pro');
  await page.goto('/');
  await expect(page).toHaveURL(/\/pro$/); // returning visitor redirect
});

test('/reset clears pathway', async ({ page }) => {
  await page.goto('/pro');
  await page.goto('/reset');
  await expect(page).toHaveURL(/\/$/);
});
```

- [ ] **Step 2:** Run

```bash
pnpm test:e2e
```
Expected: both pass.

- [ ] **Step 3:** Commit

```bash
git add tests/e2e/gate.spec.ts
git commit -m "test: e2e coverage for pathway gate"
```

### Task 7.2: Contact form E2E (stubbed)

**Files:**
- Create: `tests/e2e/contact.spec.ts`

- [ ] **Step 1:** Use Playwright route interception to stub `/api/contact`

```ts
import { test, expect } from '@playwright/test';

test('submitting contact form shows success', async ({ page }) => {
  await page.route('**/api/contact', r => r.fulfill({ status: 200, body: '{"ok":true}' }));
  await page.goto('/pro');
  await page.getByPlaceholder('Your name').fill('Ada');
  await page.getByPlaceholder('Your email').fill('a@b.com');
  await page.getByPlaceholder('Your message').fill('hello from playwright');
  await page.getByRole('button', { name: /Send message/i }).click();
  await expect(page.getByText(/I.ll be in touch/)).toBeVisible();
});
```

- [ ] **Step 2:** Run; commit

```bash
pnpm test:e2e
git add tests/e2e/contact.spec.ts
git commit -m "test: e2e contact form happy path"
```

### Task 7.3: Lighthouse + responsive pass

- [ ] **Step 1:** `pnpm build && pnpm start` → run Lighthouse on `/pro`. Target Performance ≥ 90. If < 90, main levers: image `<Image>` for headshots, `next/font` already loaded, check bundle size.
- [ ] **Step 2:** Manually resize the Steam page to 375px → confirm horizontal scroll is absent; fix tightest sections.
- [ ] **Step 3:** Commit any tweaks.

```bash
git commit -am "perf: Lighthouse polish on /pro and /dashboard"
```

### Task 7.4: Final spec alignment

- [ ] **Step 1:** Walk §14 of the spec (success criteria). For each checkbox, verify behavior in a running build. Note any red items and open tasks if needed.

---

## Execution notes

- **Tag rollout points:** after Phase 2 (`pong-playable`), Phase 4 (`dashboard-visual-complete`), Phase 6 (`deployable`). Use `git tag -a <name> -m ...` so you can roll back fast.
- **When in doubt, delete the reference:** `reference/steam-mockup.html` exists only as a visual checklist for Phase 4. Don't import from it; it's not on the runtime path.
- **Don't mass-refactor extracted content later.** Each content module is small on purpose — a single long file with all content would lose the "files that change together live together" benefit.
