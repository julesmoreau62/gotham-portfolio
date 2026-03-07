# Jules Moreau — Portfolio

**A production-grade tactical portfolio built entirely with AI — zero coding background.**

**Live:** [julesmoreau.eu](https://www.julesmoreau.eu)

## The Challenge

I needed a portfolio for esports operations & event management applications. The problem:

- Zero coding skills
- Every Wix/WordPress template looked the same
- Couldn't create the tactical/strategic identity I envisioned

## The Solution: AI as Creative Co-Pilots

I built this site from scratch using a **dual-AI workflow** — rough sketches to production in iterations.

### Gemini — Design & Architecture
- Transformed rough sketches into a cohesive tactical/military UI
- Generated the visual identity reflecting a strategic mindset
- Created the foundation and layout architecture

### Claude — Technical Execution
- Built custom CSS animations and particle effects
- Optimized mobile responsiveness
- Solved complex layering and z-index issues
- Fine-tuned performance and interactions

## From Sketch to Production

The site went through a full design-to-code pipeline, all AI-assisted:

**Boot Sequence** — Wireframe concept to animated military-style boot screen with typing effects

**GOTHAM Command Grid** — Sketch of hexagonal navigation to fully interactive hub with orbital rings, data streams, and agent profile panel

**Strategy Panel** — Layout mockup to interactive BLAST case study with live data visualizations, roadmap timeline, and map component

**Signal Panel** — KPI dashboard wireframe to full social media analytics display with sponsor activation metrics and content gallery

## Design System: GOTHAM

Dark tactical/military aesthetic — single-page application featuring:
- Animated boot sequence with terminal typing effect
- Particle network background with ambient glow
- Hexagonal command grid navigation with orbital animations
- Custom cursor, scan lines, glitch effects, and noise overlay

## Portfolio Sections

| Code Name | Content |
|-----------|---------|
| **Strategy** | BLAST Strategic Case Study — "David vs. Goliath 2.0" (23-page analysis) |
| **Intel Core** | Sport Business Watch — AI Intelligence Dashboard (live production tool) |
| **Field Ops** | ASI Multisports Tournament — Event Management (500+ personnel) |
| **Signal** | ASN95 — Head of Communications (+467% CTR, 1,650+ photos) |
| **Imagery** | Photography archive — corporate, events, sport (50+ files) |

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 3 + `tailwindcss-animate`
- **UI Components:** Radix UI + shadcn/ui
- **Fonts:** Rajdhani, JetBrains Mono, Share Tech Mono

## AI/Crawler Accessibility Layer

The site is a JS-rendered SPA invisible to most crawlers. To fix this:

- **`/llms.txt`** — Plain-text portfolio summary for LLM crawlers
- **JSON-LD** — Schema.org `Person` structured data in `<head>`
- **sr-only fallback** — Full HTML content readable by crawlers and screen readers, invisible to sighted users

## Getting Started

```bash
npm install --legacy-peer-deps
npm run dev
```

Opens at [localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Project Structure

```
app/
  layout.tsx          # Root layout + JSON-LD structured data
  page.tsx            # Main page + sr-only crawler fallback
  globals.css         # Global styles + tactical grid
components/
  hex-command-grid.tsx # Main navigation hub
  boot-sequence.tsx    # Animated boot sequence
  strategy-panel.tsx   # BLAST case study panel
  intel-core-panel.tsx # Sport Business Watch panel
  field-ops-panel.tsx  # ASI Tournament panel
  signal-panel.tsx     # ASN95 comms panel
  imagery-panel.tsx    # Photography panel
  about-panel.tsx      # Agent profile panel
  ui/                  # shadcn/ui components
public/
  llms.txt            # LLM crawler content
  assets/             # PDFs, photos, event visuals
  signal/             # ASN95 media assets
```

## Key Takeaway

> AI doesn't replace creativity — it amplifies execution. You don't need to be a developer to build something unique. Prompt engineering is becoming an essential skill.

## License

Private project. All rights reserved.
