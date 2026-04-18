# Personal Website — Design Spec

**Date:** 2026-04-18
**Owner:** Doruk Kırali
**Status:** Design approved, pending implementation plan
**Repo:** `/Users/dkirali/Desktop/Project/personal-website`

---

## 1. Concept

A personal portfolio website with a **game-gated dual experience**:

- First-time visitors land on a **retro Pong game**
- **Win** the game → taken to a gaming-themed portfolio (**Steam pastiche**)
- **Skip** or **lose** → taken to a professional portfolio (**LinkedIn pastiche**)
- Both pastiches are intentional parodies of platforms visitors already know, which creates the recognition moment ("wait, is this LinkedIn?" / "wait, is this Steam?")

**Primary audiences:**
1. Engineer recruiters / hiring managers → typically arrive via a direct `/pro` link or skip the game
2. Friends / curious visitors / personal network → play the game, get the gaming dashboard

**Tone:** professional-but-playful. The professional side is intentionally boring/safe; the gaming side is loud, fun, and rewards the player.

---

## 2. Tech stack

| Concern | Choice | Why |
|---|---|---|
| Framework | Next.js 15 (App Router, React 19, TypeScript) | User's pick; first-class Vercel deploy; middleware for gate redirects |
| Styling | Tailwind CSS | Fast pixel-accurate pastiche work |
| Animation | Framer Motion | Page transitions, photo crossfade, Gandalf reveal |
| Email | Resend (free tier, 100/day) | First-party Next.js SDK; simplest route |
| Pong | HTML5 Canvas + vanilla TS | ~200 LOC; no engine needed |
| Deployment | Vercel | Free, GitHub-linked CI/CD |
| Domain | Custom (TBD) | User will purchase separately |

**Not using:** Three.js (no real 3D needed), headless CMS (content is static), any auth (no accounts).

---

## 3. Routes & gate logic

| Route | Purpose | Gate |
|---|---|---|
| `/` | Pong game (first-time) or redirect (returning) | Middleware reads `pathway` cookie |
| `/dashboard` | Gaming side — Steam pastiche | Always accessible |
| `/pro` | Professional side — LinkedIn pastiche | Always accessible, shareable recruiter link |
| `/reset` | Clears localStorage + cookie, redirects to `/` | Always accessible |
| `/api/contact` | POST — sends email via Resend | Rate-limited, honeypot |

### Gate logic
- First-time visitor: middleware sees no cookie, serves Pong at `/`
- On game **win**: client writes `pathway=gaming` to localStorage + cookie, navigates to `/dashboard`
- On **skip** (any time): client writes `pathway=pro` to localStorage + cookie, navigates to `/pro`
- On second loss: Gandalf scene plays, then mercy skip link → same as skip
- Returning visitor: middleware reads cookie, redirects `/` → `/dashboard` or `/pro`

### Direct links always bypass the gate
- `/pro` — recruiter-safe link (no game required)
- `/dashboard` — gamer-safe link
- `/reset` — clears state, replays the game

---

## 4. Pong game

**Canvas:** 800×500 responsive (scales to viewport, maintains aspect ratio).

### Gameplay
- Left paddle = player (mouse or W/S / ↑↓ keys; touch-drag on mobile)
- Right paddle = AI with ~120ms reaction delay + max-speed cap at 70% of ball speed → medium-easy
- Ball speeds up slightly after each paddle hit; resets to base on score
- **First to 3 points wins**
- Game pauses on tab blur

### Retro treatment
- Monochrome palette (green-on-black or amber-on-black — final pick during implementation)
- CSS scanline overlay (`repeating-linear-gradient`)
- Subtle CRT contrast/brightness filter
- `Press Start 2P` pixel font for score
- Square-wave beep SFX via Web Audio API (no audio files)
- Flashing "PRESS SPACE TO START" at idle

### State machine
1. `idle` — awaiting start input
2. `playing` — match in progress
3. `won` — "YOU WIN" flash → 2s → `/dashboard` + set `pathway=gaming`
4. `lost-round-1` — "GAME OVER — ONE MORE TRY?" with retry button
5. `lost-round-2` — Gandalf scene plays → mercy skip link fades in after ~4s → click goes to `/pro` + sets `pathway=pro`

### Skip link
Persistent at the bottom of the screen in `idle` and `playing` states: "Skip this and view the website →". Click = `/pro` + set `pathway=pro`.

### Gandalf scene
- Short clip or GIF (~3s) of "YOU SHALL NOT PASS"
- Legal note: personal-site/parody usage of a famous movie moment is low-risk but not zero-risk. Acceptable for this use case.

---

## 5. `/pro` page — LinkedIn pastiche

Visual reference: the "A · LinkedIn clone" mockup shown during brainstorming.

### Structure (top → bottom)
1. **Banner** — blue/teal gradient (LinkedIn-style)
2. **Profile card** — circular headshot (`<ProfilePhoto mode="linkedin" />`), name, title, Toronto, `Contact` + `Download CV` buttons
3. **About** — bio paragraph pulled from resume
4. **Featured / Projects** — Jobbot & Flaw App as LinkedIn-style featured cards (title, short tag, thumbnail, GitHub link)
5. **Experience** — roles, dates, descriptions pulled from resume
6. **Skills** — tag pills
7. **Contact** — `<ContactForm>` + direct email + LinkedIn/GitHub links
8. **Footer** — small link: "wait, was there a game? →" goes to `/reset`

### What gets pasticed (not copied)
Banner shape, profile-card layout, blue accent, section header styling, About/Featured/Experience labels. **No LinkedIn logos or trademarks.**

---

## 6. `/dashboard` page — Steam pastiche

Visual reference: the "F · Steam pastiche" mockup shown during brainstorming.

### Structure (top → bottom)
1. **Top nav bar** — dark bar with fake menu items: `STORE · LIBRARY · COMMUNITY · DORUK` (last one highlighted)
2. **Profile header** — avatar (`<ProfilePhoto mode="gaming" />`), name, "● Online · Currently playing: Life", faux level/XP (e.g. derived from GitHub commit count), Toronto flag
3. **Featured & Recommended** — one hero card (top project) + carousel
4. **Recent Projects grid** — each project as a Steam game card: gradient box-art, "hours played" = activity signal, tech tags, GitHub stars as "review count"
5. **Project detail page** (dynamic route, e.g. `/dashboard/[slug]`) — Steam-style detail view: screenshots, description, "About This Project", parody system requirements, GitHub link styled as an "Install" button
6. **Achievements panel** — GitHub stars, shipped projects, years coding
7. **About me** — Steam-style profile "summary" box with bio
8. **Contact** — Steam "Send Message" modal styling using `<ContactForm>`
9. **CV download** — styled like a Steam game download button
10. **Footer** — link to `/pro` ("switch to boring mode")

### Projects (initial)
- **Jobbot** — job-application agent (Python, LangChain)
- **Flaw App** — [tag to be filled from GitHub repo]

---

## 7. Shared components

| Component | Purpose | Notes |
|---|---|---|
| `<ProfilePhoto>` | LinkedIn headshot ↔ pixelated-gaming crossfade | Prop `mode: 'linkedin' \| 'gaming'`; hover on desktop, tap on mobile; always-visible toggle button for keyboard accessibility |
| `<ContactForm>` | Name/email/message → `/api/contact` → Resend → `kiralidoruk@gmail.com` | Zod validation, honeypot, per-IP rate-limit |
| `<CVDownload>` | Static PDF download button | Served from `/public/cv.pdf` |
| `<GandalfScene>` | Fullscreen loss overlay | Clip + mercy skip link |
| `<PongGame>` | The game canvas component | Encapsulates state machine above |
| `<SkipLink>` | Persistent bottom link on Pong page | Clicking sets `pathway=pro` and routes |

---

## 8. Data & persistence

**Key:** `pathway`
**Values:** `"gaming"` | `"pro"` | unset

**Storage:**
- `localStorage.pathway` — primary
- `document.cookie` mirror — written client-side immediately after localStorage, so Next.js middleware can read it for server-side redirects

**Why both:** localStorage isn't accessible to middleware (which runs on the edge, server-side), so we mirror to a cookie.

**Middleware flow on `/`:**
```
if (cookie.pathway === 'gaming') redirect('/dashboard')
else if (cookie.pathway === 'pro') redirect('/pro')
else next() // render the Pong page
```

**`/reset`:** clears localStorage + cookie, redirects to `/`.

---

## 9. Contact form flow

1. User fills name/email/message + hidden honeypot
2. Client-side Zod validation
3. POST to `/api/contact` with JSON body
4. API route:
   - Reject if honeypot is filled
   - Rate-limit: ≤ 3 submissions per IP per hour (in-memory LRU)
   - Validate again server-side with Zod
   - Call Resend SDK → send email to `kiralidoruk@gmail.com` with reply-to set to submitter
   - Return 200 or 4xx/5xx
5. UI shows success toast or error

**Env:** `RESEND_API_KEY` in Vercel.

---

## 10. Content inventory — what needs to be gathered

### Already identified
- Resume: `/Users/dkirali/Desktop/Personal/Resume/Doruk Kirali Resume 2026.doc` → source for bio, experience, skills, LinkedIn/GitHub URLs

### To locate / produce
| Item | Status | Destination |
|---|---|---|
| CV PDF | Location TBD on Desktop | `/public/cv.pdf` |
| Professional headshot | Location TBD on Desktop | `/public/headshot.jpg` |
| Pixelated "gamer with headset" headshot | To be generated (Photoshop/AI) | `/public/headshot-gaming.png` |
| Gandalf "You shall not pass" clip | To be sourced (short MP4 or GIF, ~3s) | `/public/gandalf.mp4` |
| Jobbot GitHub URL | To be confirmed | Used in project card |
| Flaw App GitHub URL | To be confirmed | Used in project card |
| Project screenshots (optional) | Optional | `/public/projects/` — fallback: CSS gradients |
| Domain name | Not yet purchased | Added via Vercel after purchase |

---

## 11. Deployment

- **Platform:** Vercel (free tier)
- **CI/CD:** GitHub-linked; every push to `main` deploys to production
- **Preview deploys:** every PR gets a preview URL
- **Custom domain:** added via Vercel's DNS settings once purchased (one CNAME/A record)
- **Environment variables:** `RESEND_API_KEY`

---

## 12. Open questions (to resolve before implementation)

1. **CV + headshot locations** — user to confirm exact paths
2. **Domain name** — user to choose + purchase (suggestions: `doruk.dev`, `dorukkirali.com`, `doruk.gg`)
3. **Pong color palette** — green-on-black vs amber-on-black (low-stakes, can be picked during build)
4. **Pixelated headshot creation method** — Photoshop / AI (Midjourney/DALL-E) / separate illustration

---

## 13. Out of scope (explicitly)

- User accounts / login
- Blog / writing / articles
- Real 3D graphics (Three.js)
- Internationalization
- Analytics / tracking (can be added later)
- Dark-mode toggle on `/pro` (the "light side" is always light)
- Light-mode toggle on `/dashboard` (the "dark side" is always dark)

---

## 14. Success criteria

- ✅ First-time visitors see Pong within 1s of page load
- ✅ Pong is winnable in 60–120s for an attentive player
- ✅ Gandalf scene plays reliably on second loss
- ✅ Skip link always accessible during the game
- ✅ `/pro` link works independently and is recruiter-appropriate
- ✅ `/dashboard` link works independently
- ✅ localStorage + cookie persistence works across sessions
- ✅ Contact form delivers email to `kiralidoruk@gmail.com` within seconds
- ✅ Lighthouse performance score ≥ 90 on `/pro` (recruiter-facing — must be fast)
- ✅ Mobile-responsive — game and both sides work on iOS/Android

---

## 15. Brainstorm artifacts

Mockups generated during brainstorming are saved in:
`/Users/dkirali/Desktop/Project/personal-website/.superpowers/brainstorm/`

- `professional-style.html` — Options A (LinkedIn) vs B (editorial)
- `professional-style-v2.html` — Options C (read.cv), D (GitHub README), E (printed resume)
- `gaming-style.html` — Options F (Steam), G (full arcade), H (synthwave)
- `site-map.html` — Flow diagram
