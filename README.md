<div align="center">

<code>A PLAYER'S PERSPECTIVE // JULES MOREAU</code>

# JULES MOREAU — PORTFOLIO

**From playing to making it happen.**<br />
A personal journey from competitive gaming and volleyball coaching to sport event management.

[![Next.js](https://img.shields.io/badge/Next.js_15-0A0A0A?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React_19-0A0A0A?style=flat-square&logo=react&logoColor=C8FF00)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-0A0A0A?style=flat-square&logo=typescript&logoColor=C8FF00)](https://www.typescriptlang.org/)
[![Live](https://img.shields.io/badge/STATUS-LIVE-C8FF00?style=flat-square&labelColor=0A0A0A)](https://www.julesmoreau.eu)

[**Enter the live experience ↗**](https://www.julesmoreau.eu) · [30-second briefing](https://www.julesmoreau.eu/briefing) · [Version française](https://www.julesmoreau.eu/fr) · [Jump to the case files](#case-files)

</div>

[![Jules Moreau portfolio hero](.github/readme/hero-desktop.png)](https://www.julesmoreau.eu)

## The experience

Acid green on black. Wide grotesk type, registration marks and personal sport photography. The homepage opens with the internship role and availability, followed immediately by selected projects. A compact personal story connects competitive gaming and volleyball coaching to event operations, communication and partnerships, then a timeline traces eight moves across four continents (France, French Guiana, Corsica, New Caledonia, Congo) and what each place brought.

The selected projects show **event operations** (ASI Tournament), **communication and activation** (ASN95), and **branding and partnerships** (Royal Daring). Project cards include actual deliverables, including the Daring website and ASN95 campaign visuals. An approach section, visible field experience, education, a full expandable experience log and internship contact complete the page. Volleyball photos are labelled as personal archive imagery.

On the first home visit, a 2.5-second introduction brings fragments of projects, sport and games together around JM before revealing the portfolio. It uses dedicated WebP thumbnails (186 kB total) and CSS perspective, with fewer fragments on mobile. Skip and Escape exit immediately; repeat visits in the same tab session, direct section links and reduced-motion preferences bypass it. The content remains available without JavaScript or if hydration fails. Project introductions are also brief and play once per session.

### Built for two reading speeds

| Surface | Purpose |
| --- | --- |
| **Full experience** | Immersive, scroll-driven portfolio with motion, narrative and project evidence. |
| **30-second briefing** | Recruiter-first scan of role, availability, strongest proof points and contact links. |
| **Version française** | `/fr` and `/fr/briefing` mirror the home page and the briefing, with an FR/EN switch in the top bar. |
| **Contract files** | Seven long-form case studies (English) with context, actions, outputs and measurable results. |
| **Machine-readable layer** | Semantic HTML, JSON-LD, hreflang, bilingual sitemap, robots, generated share images and `/llms.txt`. |

## Case files

![Featured contract cards](.github/readme/home-contracts.png)

| # | Contract | Role | Selected proof |
| :-- | --- | --- | --- |
| `01` | **Royal Daring HC** | Communication & Sponsoring | Bilingual sponsor website, nine-page partner brochure, brand system and Notion handover. |
| `02` | **ASN95 Signal** | Head of Communications | +467% sponsor CTR, 1M+ views and 1,650+ edited photos. |
| `03` | **BLAST Strategy** | Strategic Analyst | 23-page dossier, PESTEL / VRIO / SWOT and India pivot roadmap. |
| `04` | **ASI Tournament** | Communication lead / Field operations | 500+ people, venue and weather changes handled without disruption. |
| `05` | **Thesis Engine** | Builder & Operator | Local AI research pipeline for the M2 thesis: Scholar · OpenAlex · Cairn → fine-tuned Qwen3 4B (+ Claude Sonnet 5.5 when complex) → Obsidian vault, 90 sources a day for ≈ €0. |
| `06` | **Client Builds** | AI-assisted Web Delivery | One live client website and one in development. |
| `07` | **Imagery** | Photographer | 50 selected frames across sport, events and corporate work. |

## Under the hood

```text
app/
├── page.tsx                   home: internship → projects → story → experience → contact
├── briefing/page.tsx         recruiter-focused fast path
├── fr/                       French home page and briefing
├── opengraph-image.tsx       share card (EN; FR in fr/)
└── contracts/[slug]/page.tsx seven statically generated case files

components/
├── fx/                       cursor, grain, reveals, wipe, marquee, analytics
├── home/                     the complete home-page narrative
├── briefing/                 the briefing page, shared by both languages
└── contracts/                shared case-study shell + individual dossiers

lib/
├── copy.ts                   every home and briefing string, English and French
├── i18n.ts                   locales, localized paths and hreflang helpers
├── profile.ts                identity, experience, education and skills
├── contracts.ts              case-file index and metadata
├── image-loader.ts           next/image loader for the generated WebP variants
└── og-image.tsx              share card renderer (next/og)

scripts/
└── build-images.mjs          resized WebP variants in public/_img, before dev and build
```

### Stack

- **Next.js 15**, App Router, React 19 and TypeScript
- **Tailwind CSS 3** plus a compact custom design system in `app/globals.css`
- **Framer Motion** for reveals, staggers and page wipes
- **sharp** build step and a custom `next/image` loader: resized WebP variants, no runtime image service
- **next/og** share images rendered at build time in the site's fonts
- **Vercel Web Analytics**, cookie-free, with download, email and LinkedIn events
- **Lenis** for smooth scrolling, disabled on touch and reduced-motion devices
- **Archivo Variable** and **JetBrains Mono** through `next/font`

### Experience safeguards

- Thumbnails and galleries load resized WebP variants, never the originals
- Animated counters show their real value in the server HTML and for reduced motion
- Motion automatically reduced when the operating system requests it
- Smooth scrolling disabled for touch input and reduced motion
- Static generation for every contract route
- Semantic content remains available without relying on animation

## Run locally

```bash
npm install
npm run dev
```

```bash
npm run typecheck
npm run build
```

`npm run dev` and `npm run build` first run `npm run images`, which only rebuilds variants for new or changed images.

Then open [`http://localhost:3000`](http://localhost:3000).

## Notes

The product, editorial structure, art direction and implementation were designed and shipped by Jules Moreau through an AI-augmented workflow. The portfolio is a private project; all rights are reserved.

<div align="center">

`50.6292° N / 3.0573° E` · `LILLE / FR` · `© 2026 JULES MOREAU`

</div>
