# Jules Moreau — Portfolio (v4 · "Runner profile")

**Live:** [julesmoreau.eu](https://www.julesmoreau.eu)

An esports-operations portfolio built as a full experience: acid green on black, wide grotesk display type,
registration marks, a real-time 3D artifact, boot sequence, wipe transitions and seven long-form case files
("contracts"). Art direction inspired by graphic-realism game UI.

Designed and shipped by a non-developer with an AI-augmented workflow (Claude Code).

## Stack

- **Next.js 15** (App Router, React 19, TypeScript)
- **Tailwind CSS 3** + a small custom design system in `app/globals.css`
- **framer-motion** for reveals, staggers, page wipes
- **three.js / @react-three/fiber / drei** for the hero artifact (desktop only, static reticle fallback)
- **lenis** for smooth scrolling (disabled on touch / reduced motion)
- Fonts: Archivo (variable width axis) + JetBrains Mono via `next/font`

## Structure

```
app/
  layout.tsx                 fonts, metadata, JSON-LD, providers (smooth scroll, cursor, grain, wipe)
  page.tsx                   home: boot → hero → operator → contracts → log → loadout → extraction
  briefing/page.tsx          30-second recruiter briefing
  contracts/[slug]/page.tsx  case files (static params)
  not-found.tsx · sitemap.ts · robots.ts
components/
  fx/        boot-less effects: cursor, page wipe, reveal, counter, marquee, scramble, 3D artifact
  ui/        primitives: buttons, chips, labels, section heads, stats, barcode, registration marks
  home/      boot sequence + home sections
  contracts/ case-study shell, primitives and the seven case files
lib/
  profile.ts   identity, experience, education, skills (single source of truth)
  contracts.ts case-file index metadata
public/
  llms.txt     plain-text portfolio summary for LLM crawlers
  assets/      PDFs, photos, case-file media
```

## Case files

| # | Contract | Role | Proof |
|---|----------|------|-------|
| 01 | Royal Daring HC | Communication & Sponsoring | FR/NL sponsor website, 9-page ReportLab brochure, brand system, Notion handover |
| 02 | ASN95 Signal | Head of Communications | +467% sponsor CTR, 1M+ views, 1,650+ edited photos |
| 03 | BLAST Strategy | Strategic analyst | 23-page dossier, PESTEL / VRIO / SWOT, India pivot roadmap |
| 04 | ASI Tournament | Comms Chief | 500+ personnel, 2 incidents solved, zero disruption |
| 05 | Intel Core | Product owner | Telegram → Gemini → Notion → Next.js pipeline, ~$1/month |
| 06 | Client builds | AI-assisted web delivery | ferrantphe.fr (live), AS Nortkerque 95 (in dev) |
| 07 | Imagery | Photographer | 50 frames, 3 sectors |

## Develop

```bash
npm install
npm run dev
```

`npm run typecheck` · `npm run lint` · `npm run build`

## Discoverability

- `/llms.txt` plain-text summary for LLM crawlers
- Schema.org `Person` JSON-LD in the root layout
- Real semantic HTML (no hidden fallback needed), sitemap and robots

---

*Private project. All rights reserved.*
