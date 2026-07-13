# ORVYX

> The future isn't predicted. It is remembered.

A cinematic Web3 experience for **ORVYX** — a synchronization network for collective attention. An award-tier dark, editorial, WebGL-driven landing page plus a set of premium editorial pages (About / Docs / Whitepaper), with typography as the hero and motion that feels expensive.

---

## Prerequisites

Make sure these are installed on your machine first:

| Tool | Version | Notes |
|------|---------|-------|
| **Node.js** | `>= 18.17` (20+ recommended) | Next.js 14 requirement. Check with `node -v`. |
| **pnpm** | `>= 9` (project pins `10.6.1`) | Preferred package manager. See install below. |
| **Git** | any recent | To clone the repo. |

A modern browser with **WebGL2** support is required to view the landing page (the editorial pages are pure CSS/HTML).

### Installing pnpm

The project declares its package manager in `package.json` (`packageManager` field), so the easiest path is via **corepack** (bundled with Node):

```bash
corepack enable
corepack prepare pnpm@10.6.1 --activate
```

Or install standalone:

```bash
npm install -g pnpm
```

> Prefer `npm` or `yarn`? They work too — just use `npm install` / `npm run dev` or `yarn` / `yarn dev` instead of the `pnpm` commands below.

---

## Getting Started

```bash
# 1. Clone
git clone https://github.com/damnxs/orvyx.git
cd orvyx

# 2. Install dependencies
pnpm install

# 3. Run the dev server
pnpm dev
```

Open **http://localhost:3000**.

> **First build note:** fonts are fetched via `next/font/google`, so the first `dev`/`build` run needs an internet connection to pull Cormorant + Inter.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start the dev server (HMR) on `:3000`. |
| `pnpm build` | Production build. |
| `pnpm start` | Serve the production build. |
| `pnpm typecheck` | Run TypeScript (`tsc --noEmit`). |
| `pnpm lint` | Run Next.js ESLint. |

---

## Tech Stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Three.js** with **@react-three/fiber** & **@react-three/drei**
- **@react-three/postprocessing** — bloom, depth-of-field, chromatic aberration, grain, vignette
- **GSAP** + **ScrollTrigger** — scroll-driven choreography
- **Lenis** — smooth scroll
- **Framer Motion** — editorial micro-animations & page transitions
- **Tailwind CSS** — styling

---

## Routes

| Path | Description |
|------|-------------|
| `/` | The 3D Obsidian Oracle landing (WebGL sphere, shaders, particles, procedural audio). |
| `/about` | Editorial entity narrative — origin, purpose, principles. |
| `/docs` | Linear-style documentation with scroll-spy sidebar. |
| `/whitepaper` | Classified research-paper layout with reading progress & footnotes. |
| `/prophecies` | Coming-soon page. |

---

## Project Structure

```
app/
  layout.tsx            # Root layout, fonts (Cormorant + Inter), metadata
  page.tsx              # 3D landing
  globals.css           # Tailwind + design tokens
  (editorial)/          # Editorial route group (shared navbar + transitions)
    layout.tsx          # Navbar + footer + smooth scroll
    template.tsx        # Fade-from-black page transitions
    about/ docs/ whitepaper/ prophecies/
components/
  Scene.tsx             # R3F Canvas, lights, camera rig, post-processing
  ObsidianObject.tsx    # The oracle: sphere + crack shader + galaxy + eye
  Particles.tsx         # Dust / orbiting field
  Navbar.tsx Footer.tsx SmoothScroll.tsx
  editorial.tsx         # Motion + UI kit (Reveal, cards, code, tables, …)
  HoloPanel.tsx TextReveal.tsx Loader.tsx
lib/
  hooks.ts              # useLenis, useSmoothScroll, useMouse, useDetectTier
  audio.ts              # Procedural Web Audio engine
  state.ts theme.ts
```

---

## Performance

- Adaptive tiers (desktop vs. mobile) for particle counts and post-processing.
- `prefers-reduced-motion` disables parallax, shake, and continuous animation.
- The 3D scene is lazy-loaded (`next/dynamic`, `ssr: false`) so editorial pages stay light.

---

## License

All rights reserved · ORVYX · MMXXVI
