# MarkLabs — futuristic site (Next.js 14)

Digital-агентство MarkLabs (Вінниця). Next.js 14 App Router + TypeScript + Tailwind,
GSAP + ScrollTrigger, Lenis smooth scroll, React Three Fiber (lazy WebGL hero),
Framer-friendly micro-interactions. Dark "space" aesthetic, glassmorphism, aurora gradients.

The existing Flask app is the API backend — this frontend calls its `POST /api/lead`
(leads + Telegram notification). Flask admin/DB are untouched.

## Requirements

- Node.js **20 LTS** recommended (Vercel default). Node 24 works locally via a build shim (see below).
- npm 10+

## Local development

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_API_BASE + NEXT_PUBLIC_SITE_URL
npm run dev                  # http://localhost:3000
```

`.env.local`:

```
NEXT_PUBLIC_API_BASE=http://127.0.0.1:8080   # your running Flask app
NEXT_PUBLIC_SITE_URL=https://www.mark-labs.com.ua
```

If `NEXT_PUBLIC_API_BASE` is empty, the calculator/contact form degrade gracefully
(они показують fallback «напишіть у Telegram» замість краху).

## Production build

Standard (Vercel / Node 20):

```bash
npm run build
npm start
```

### Local build on Node 24 / Windows

Node 24 changed `fs.readlink`/`fs.readFile` behavior on Windows, which breaks
Next 14's build tracer (`EISDIR readlink`, `UNKNOWN read`). Use the shimmed script:

```bash
npm run build:win
```

This loads `scripts/readlink-shim.js` (remaps `EISDIR`→`EINVAL`, retries transient
`UNKNOWN` reads). **Not needed on Vercel** — `npm run build` is what Vercel runs.

## Deploy to Vercel

1. Push `marklabs-next/` to a Git repo (GitHub/GitLab).
2. Vercel → **New Project** → import the repo. Framework preset: **Next.js** (auto).
   If the repo root is the monorepo, set **Root Directory** = `marklabs-next`.
3. **Environment Variables** (Project Settings → Environment Variables):
   - `NEXT_PUBLIC_API_BASE` = your Flask API origin (e.g. `https://api.mark-labs.com.ua`)
   - `NEXT_PUBLIC_SITE_URL` = `https://www.mark-labs.com.ua`
4. Deploy. Build command `next build`, output auto-detected. Node 20.x.
5. Add your domain in **Settings → Domains** (production domain unchanged until you point DNS).

CORS note: the Flask `/api/lead` must allow requests from the Vercel origin.
Add the Vercel domain to Flask CORS (or serve both behind the same domain).

## Project structure

```
src/
  app/
    layout.tsx            # fonts, metadata, JSON-LD, global providers
    page.tsx              # home: assembles all sections
    globals.css           # tokens, grain, glass, rotating-border, reduced-motion
    sitemap.ts robots.ts manifest.ts not-found.tsx
    services/[slug]/      # SSG service pages (+ Service JSON-LD)
    projects/[slug]/      # SSG project (concept) pages
    privacy/ terms/       # legal pages (noindex)
  components/             # Cursor, Preloader, Navbar, StickyCta, MagneticButton,
                          # Reveal, SplitReveal, CountUp, TiltCard, Icon,
                          # SmoothScroll (Lenis), ScrollProgress, JsonLd, SubPageShell
  sections/              # Hero, Marquee, Services, Projects, Process, Pricing,
                          # Calculator, About, Faq, Contact, Footer
  components/hero/ParticleField.tsx  # lazy R3F WebGL (client-only)
  lib/site.ts            # single source of copy/data
  lib/api.ts             # submitLead → Flask /api/lead
  lib/useDeviceCapabilities.ts       # reduced-motion / touch / low-power gating
```

## Performance & accessibility notes

- **WebGL is lazy + gated**: only loads on capable, motion-friendly, non-mobile devices
  (`useDeviceCapabilities`). Everyone else gets the CSS aurora background. R3F/three are
  code-split — not in the initial JS.
- **prefers-reduced-motion** disables Lenis, GSAP reveals, pinned scroll, particle field,
  rolling counters, and the preloader animation.
- No horizontal scroll on mobile (`overflow-x: hidden`, projects fall back to vertical cards).
- Semantic landmarks, skip-link, `aria-expanded/controls` on FAQ, labelled form fields,
  focus-visible ring, `aria-live` form status.

## Assets you still need to provide

Drop these into `public/` (site works with graceful placeholders until then):

| File | Used by | Notes |
|------|---------|-------|
| `public/founder.jpg` | About section | Portrait, ~4:5, ≥ 800×1000px |
| `public/projects/<slug>.webm` + `.mp4` | Projects slides | 7 slugs: smiledent, blackhorse, detaillab, fitcore, urbanbuild, autofix, aura. Muted loop previews. Swap the placeholder block in `Projects.tsx`/`ProjectVisual`. |
| `public/og.jpg` | Open Graph | 1200×630 social preview (add to metadata `openGraph.images`) |
| Optional Lottie JSON | Service icons | Currently inline SVG; can be upgraded later |

Demo project subdomains (e.g. `smiledent.mark-labs.com.ua`) are currently shown as
«Концепт — демо скоро». Wire real URLs in `Projects.tsx` when they exist.
