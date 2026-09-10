/* ------------------------------------------------------------------
   PROFILE — single source of truth for identity, experience, skills.
   ------------------------------------------------------------------ */

export const SITE = {
  url: "https://www.julesmoreau.eu",
  name: "Jules Moreau",
  title: "Jules Moreau — Event Management",
  description:
    "M2 International Sport Administration student seeking an Event Management internship, February to June 2027. Event logistics, sponsor activation, digital communication and competitive intelligence.",
  version: "v4.0",
  year: "2026",
}

export const PROFILE = {
  firstName: "Jules",
  lastName: "Moreau",
  role: "Event Management // Communication & branding",
  degree: "M2 International Sport Administration",
  school: "Université de Lille — STAPS / ISA",
  seeking: "Event Management internship",
  window: "February → June 2027",
  windowShort: "FEB → JUN 2027",
  focus: "Event logistics, sponsor activation, digital communication & competitive intelligence.",
  location: "Lille, France",
  coords: "50.6292° N / 3.0573° E",
  email: "jules.moreau1@outlook.com",
  linkedin: "https://www.linkedin.com/in/jules-moreau-25405b363",
  cv: "/assets/cv-julesmoreau.pdf",
  photo: "/assets/photo-cv.jpg",
  languages: [
    { label: "French", level: "Native" },
    { label: "English", level: "C1" },
  ],
  bio: [
    "Sport-management profile: military precision, international mobility and hands-on production experience.",
    "Former French Navy Reserve NCO (Second Maître, NATO Secret clearance). Grandmaster-level Overwatch 2 player, former Top 500.",
    "No formal coding background — ships production-grade tools and websites through AI-augmented workflows.",
  ],
  facts: [
    { k: "Clearance", v: "NATO Secret" },
    { k: "Reserve", v: "French Navy · Petty Officer" },
    { k: "Status", v: "Active reserve" },
    { k: "Languages", v: "FR native · EN C1" },
    { k: "Mobility", v: "French Guiana · New Caledonia · Congo" },
    { k: "Competitive", v: "OW2 Grandmaster · ex Top 500" },
    { k: "Driving", v: "Licence B" },
    { k: "Areas", v: "FR · BE · EU" },
  ],
  differentiators: [
    {
      n: "01",
      title: "International mobility",
      body: "Lived and worked in French Guiana, New Caledonia and Congo. Comfortable operating far from base, in tropical and remote environments.",
    },
    {
      n: "02",
      title: "Military background",
      body: "French Navy Reserve NCO with NATO Secret clearance. Crisis management, command under pressure, discipline in execution.",
    },
    {
      n: "03",
      title: "Esports depth",
      body: "Former Top 500 Overwatch player and French Championship finalist.",
    },
    {
      n: "04",
      title: "Production-grade builder",
      body: "Deploys real tools and client websites with no formal coding background, directing Claude Code and Codex end to end.",
    },
  ],
}

export type Deployment = {
  period: string
  where: string
  title: string
  org: string
  body: string
  tag?: string
}

export const DEPLOYMENTS: Deployment[] = [
  {
    period: "MAY — JUL 2026",
    where: "BRUSSELS, BE",
    title: "Communication & Sponsoring Intern",
    org: "Royal Daring Hockey Club ASBL",
    body: "Led the club's communication and sponsoring overhaul ahead of its promotion to Division Honneur: first graphic charter, reusable Canva template system across 4 content formats, 5-tier sponsor package + Youth Pack delivered as a bilingual FR/NL partner website, Notion handover system for continuity.",
    tag: "ISA MASTER INTERNSHIP",
  },
  {
    period: "DEC 2025",
    where: "LILLE, FR",
    title: "Comms Chief — ASI Multisports Tournament",
    org: "UFR3S Lille",
    body: "Field operations for a 500+ personnel campus tournament. Two critical incidents (venue conflict, weather hazard) resolved with zero event disruption. Graphic charter, bilingual briefing and poster produced.",
    tag: "FIELD OPS",
  },
  {
    period: "AUG 2025",
    where: "KOUROU, FRENCH GUIANA",
    title: "Event Infrastructure Technician",
    org: "Bolt Echafaudage",
    body: "Kourou Beach Festival & Tour de Guyane. Built the VIP hospitality complex and deployed sponsor arches under strict timing constraints. Heavy material handling (telehandlers).",
  },
  {
    period: "JUN — JUL 2025",
    where: "FRENCH GUIANA",
    title: "Sales & Ops Support",
    org: "Guyane Matériels Groupe",
    body: "Customer operations in a tropical environment. Product photography asset production for sales campaigns.",
  },
  {
    period: "JAN — JUN 2025",
    where: "NORTKERQUE, FR",
    title: "Head of Communications",
    org: "AS Nortkerque 95 (ASN95)",
    body: "Built the club's digital presence from scratch: sponsor activation (+467% CTR), visual identity, matchday operations and season-long photography. 1M+ views, 44K accounts reached, +93.8% interactions, +28.2% follower growth.",
    tag: "SIGNAL",
  },
  {
    period: "SEP 2024 — JUN 2025",
    where: "CALAIS, FR",
    title: "Volleyball Coach — Head Coach U15 / Assistant U13",
    org: "LISSP Calais VB",
    body: "Complete team logistics, including international travel (transport, accommodation) for the Ensisheim tournament.",
  },
  {
    period: "SINCE JUL 2022",
    where: "FRANCE",
    title: "French Navy Reservist — Petty Officer (Second Maître)",
    org: "Marine Nationale",
    body: "École de Maistrance. Military rigor, crisis management and team leadership. Operational reserve duties focused on discipline and organisation. NATO Secret clearance.",
    tag: "ACTIVE RESERVE",
  },
]

export const EDUCATION = [
  {
    period: "2025 — 2027",
    degree: "Master's in Sport Sciences — International Sport Administration (ISA)",
    school: "Université de Lille · STAPS",
    detail: "Esports management, sport governance, sustainability. Final internship: February → June 2027.",
  },
  {
    period: "2022 — 2025",
    degree: "Bachelor's in Sport Sciences — Sport Management",
    school: "ULCO",
    detail: "Third-year internship at ASN95 (Head of Communications).",
  },
]

export type SkillGroup = { label: string; accent: string; items: string[] }

export const LOADOUT: SkillGroup[] = [
  {
    label: "Operations",
    accent: "#2ee6ff",
    items: [
      "Event logistics",
      "Crisis management",
      "Matchday operations",
      "Team leadership",
      "Venue & equipment coordination",
      "Sport governance",
    ],
  },
  {
    label: "Communication",
    accent: "#ff2e88",
    items: [
      "Sponsor activation",
      "Brand identity & guidelines",
      "Content strategy",
      "Social media formats",
      "Bilingual FR/NL/EN production",
      "Copywriting",
    ],
  },
  {
    label: "Intelligence",
    accent: "#9d6bff",
    items: [
      "Esports business analysis",
      "PESTEL · VRIO · SWOT",
      "Competitive intelligence",
      "OSINT",
      "Data analysis",
      "Market entry strategy",
    ],
  },
  {
    label: "Production",
    accent: "#c8ff00",
    items: [
      "Sport & event photography",
      "Sony α6400 · GoPro",
      "Lightroom · Premiere",
      "Canva · Adobe Suite",
      "Notion systems",
      "Physical signage",
    ],
  },
  {
    label: "AI-augmented build",
    accent: "#ffb000",
    items: [
      "Claude Code · Codex",
      "Next.js · Tailwind",
      "Python · Telethon · ReportLab",
      "GitHub Actions",
      "Notion API · OpenRouter · Gemini",
      "Netlify · Vercel",
    ],
  },
]

export const SIDE_PROJECTS = [
  {
    title: "Overwatch 2 Stats Dashboard",
    body: "Personal production tool on the OverFast API, built from a Grandmaster / former Top 500 player's perspective.",
  },
  {
    title: "Sport-management model fine-tuning",
    body: "Current R&D: dataset curation, LoRA training and evaluation on Qwen3 27B (open weights) for sport-management tasks.",
  },
  {
    title: "julesmoreau.eu",
    body: "This site. Next.js, three.js and framer-motion, art-directed and shipped through an AI-augmented workflow with zero coding background.",
  },
]

export const TICKER = [
  "EVENT LOGISTICS",
  "SPONSOR ACTIVATION",
  "CRISIS MANAGEMENT",
  "DIGITAL COMMUNICATION",
  "COMPETITIVE INTELLIGENCE",
  "SPORT PHOTOGRAPHY",
  "AI-AUGMENTED BUILD",
  "NATO SECRET",
  "GRANDMASTER OW2",
  "FR / EN / NL",
]
