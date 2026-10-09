/* ------------------------------------------------------------------
   CONTRACTS — the seven case files. Index metadata lives here; the
   long-form content of each case lives in components/contracts/*.
   ------------------------------------------------------------------ */

export type ContractSlug =
  | "daring"
  | "signal"
  | "strategy"
  | "field-ops"
  | "thesis-engine"
  | "build"
  | "imagery"

export type Contract = {
  slug: ContractSlug
  index: number
  code: string
  title: string
  org: string
  role: string
  period: string
  location: string
  status: string
  statusKind: "featured" | "delivered" | "live" | "archive" | "dev"
  metric: string
  metricLabel: string
  summary: string
  featured?: { summary: string }
  accent: string
  accent2?: string
  cover: string
  coverPosition?: string
  tags: string[]
  stack?: string[]
  links?: { label: string; href: string; download?: boolean }[]
}

export const CONTRACTS: Contract[] = [
  {
    slug: "daring",
    index: 1,
    code: "DRG",
    title: "Royal Daring HC",
    featured: {
      summary: "A complete sponsor acquisition system: bilingual website, brand identity, partner brochure and club handover.",
    },
    org: "Royal Daring Club de Molenbeek · Brussels · est. 1922",
    role: "Communication & Sponsoring",
    period: "Season 2025-26 · May → Jul 2026",
    location: "Molenbeek, Brussels, BE",
    status: "FEATURED CASE",
    statusKind: "featured",
    metric: "FR/NL",
    metricLabel: "site + 30 visuals",
    summary:
      "Turned a century-old amateur hockey club's fragmented communication into a sponsor-ready acquisition system: brand guidelines, bilingual partner website, programmatic PDF brochure, social templates and a Notion handover.",
    accent: "#ff2a3c",
    accent2: "#e8c15a",
    cover: "/assets/Royal%20daring/Daring%20Vitrine%20Marketing/img/hero.jpg",
    tags: ["Brand system", "Sponsor funnel", "FR/NL website", "PDF brochure", "Handover"],
    stack: ["HTML", "CSS", "JavaScript", "Python", "ReportLab", "Netlify", "Claude Code", "Codex"],
    links: [
      { label: "Live website", href: "https://leafy-pavlova-69305b.netlify.app" },
      {
        label: "PDF brochure",
        href: "/assets/Royal%20daring/Daring%20Vitrine%20Marketing/Royal_Daring_Partenaires_2025-26.pdf",
        download: true,
      },
    ],
  },
  {
    slug: "signal",
    index: 2,
    code: "SGN",
    title: "ASN95 Signal",
    featured: {
      summary: "A full season of sponsor activation, visual identity and matchday content. One million views.",
    },
    org: "AS Nortkerque 95 · football club · est. 1995",
    role: "Head of Communications",
    period: "Jan → Jun 2025",
    location: "Nortkerque, Pas-de-Calais, FR",
    status: "DELIVERED",
    statusKind: "delivered",
    metric: "+467%",
    metricLabel: "CTR growth · 1M views",
    summary:
      "Led club communication through recurring content, sponsor activation and matchday photography. January to June 2025: 1M+ views, +93.8% interactions and +467% growth in sponsor click-through rate.",
    accent: "#ff2e88",
    cover: "/signal/group_sponsor.webp",
    tags: ["Sponsor activation", "Visual identity", "Matchday photography", "1,650+ photos"],
    stack: ["Canva", "Lightroom", "Sony α6400", "Google Forms"],
  },
  {
    slug: "strategy",
    index: 3,
    code: "STR",
    title: "BLAST Strategy",
    org: "BLAST.tv · strategic audit · “David vs Goliath 2.0”",
    role: "Strategic analyst",
    period: "2025 · Academic case study",
    location: "Copenhagen → Mumbai",
    status: "CASE STUDY",
    statusKind: "delivered",
    metric: "23p",
    metricLabel: "dossier",
    summary:
      "A 23-page strategic audit of BLAST facing the Saudi PIF-backed EFG: PESTEL, VRIO, SWOT, and a mobile-first India pivot through a Reliance joint venture, with a three-phase roadmap to break-even.",
    accent: "#ff5c1a",
    cover: "/assets/photo/corporate-8.jpg",
    tags: ["PESTEL", "VRIO", "SWOT", "Market entry", "Roadmap"],
    links: [{ label: "Full dossier (PDF)", href: "/assets/blast-case-study.pdf", download: true }],
  },
  {
    slug: "field-ops",
    index: 4,
    code: "FLD",
    title: "ASI Tournament",
    org: "ASI Multisports Tournament · UFR3S Lille",
    role: "Communication lead · field operations",
    period: "December 2025",
    location: "Lille, FR",
    status: "COMPLETED",
    statusKind: "delivered",
    metric: "500+",
    metricLabel: "people · 4 disciplines",
    summary:
      "Field coordination and communication for a campus tournament with 500+ people across four disciplines. Venue and weather changes handled without disrupting the event.",
    accent: "#2ee6ff",
    cover: "/assets/photo/asi-1.jpg",
    tags: ["Event logistics", "Crisis management", "Body-cam footage", "Visual assets"],
    stack: ["Sony α6400", "GoPro ×2"],
  },
  {
    slug: "thesis-engine",
    index: 5,
    code: "THS",
    title: "Thesis Engine",
    org: "M2 thesis · Local AI research pipeline",
    role: "Builder & operator · AI-augmented build",
    period: "Oct 2026 → · running 24/7",
    location: "Local machine · Obsidian vault",
    status: "LIVE · RUNNING 24/7",
    statusKind: "live",
    metric: "90",
    metricLabel: "sources scanned / day · ~5% kept",
    summary:
      "A local research engine for my M2 thesis: three scans a day across Google Scholar, OpenAlex and Cairn, triaged by a fine-tuned Qwen3 4B, escalated to Claude Sonnet when the analysis gets deep, and written straight into my Obsidian vault.",
    accent: "#9d6bff",
    // Generated illustration of a knowledge graph. Source: public/assets/thesis-engine/README.md.
    cover: "/assets/thesis-engine/cover.jpg",
    tags: ["Qwen3 4B", "LoRA", "RAG", "Ollama", "Claude Sonnet 5.5", "Obsidian"],
    stack: ["Qwen3 4B + LoRA", "Ollama", "RAG", "Claude Sonnet 5.5", "Google Scholar", "OpenAlex", "Cairn", "Obsidian"],
  },
  {
    slug: "build",
    index: 6,
    code: "BLD",
    title: "Client Builds",
    org: "Ferrant P.H.E · AS Nortkerque 95",
    role: "AI-assisted web delivery",
    period: "2025 → 2026",
    location: "Hauts-de-France, FR",
    status: "1 LIVE · 1 IN DEV",
    statusKind: "live",
    metric: "1 live",
    metricLabel: "+ 1 in development",
    summary:
      "Web delivery for two clients: a live bilingual catalogue for essential-oils manufacturer Ferrant P.H.E, and a website in development for the 250-member AS Nortkerque 95 football club.",
    accent: "#ffb000",
    cover: "/assets/photo/corporate-2.jpg",
    tags: ["ferrantphe.fr", "asnortkerque95", "SEO", "PWA", "llms.txt"],
    stack: ["HTML5", "CSS3", "JavaScript", "Tailwind CSS", "Claude Code", "GitHub Codex"],
    links: [{ label: "ferrantphe.fr", href: "https://ferrantphe.fr" }],
  },
  {
    slug: "imagery",
    index: 7,
    code: "IMG",
    title: "Imagery",
    org: "Photography archive · corporate, events, sport",
    role: "Sport & event photographer",
    period: "2024 → 2026",
    location: "France · French Guiana",
    status: "ARCHIVE",
    statusKind: "archive",
    metric: "50",
    metricLabel: "frames · 3 sectors",
    summary:
      "Fifty selected frames across three sectors: industrial and corporate environments, tournament coverage, and action sports from football and volleyball to golf and kitesurfing.",
    accent: "#f2f1ec",
    cover: "/assets/photo/kite-3.jpg",
    tags: ["Corporate", "Events", "Football", "Golf", "Kitesurf", "Volleyball"],
    stack: ["Sony α6400", "GoPro ×2", "Lightroom", "Premiere"],
  },
]

export const CONTRACT_SLUGS = CONTRACTS.map((c) => c.slug)
export const FEATURED_CONTRACTS = CONTRACTS.filter((c) => c.featured)
export const OTHER_CONTRACTS = CONTRACTS.filter((c) => !c.featured)

export function getContract(slug: string) {
  return CONTRACTS.find((c) => c.slug === slug)
}

export function siblingContracts(slug: ContractSlug) {
  const i = CONTRACTS.findIndex((c) => c.slug === slug)
  const prev = CONTRACTS[(i - 1 + CONTRACTS.length) % CONTRACTS.length]
  const next = CONTRACTS[(i + 1) % CONTRACTS.length]
  return { prev, next }
}
