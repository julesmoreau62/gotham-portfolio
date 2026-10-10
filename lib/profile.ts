/* ------------------------------------------------------------------
   PROFILE — single source of truth for identity, experience, skills.
   ------------------------------------------------------------------ */

export const SITE = {
  url: "https://www.julesmoreau.eu",
  name: "Jules Moreau",
  title: "Jules Moreau — Digital Transformation & AI",
  description:
    "M2 International Sport Administration student seeking a digital transformation & AI internship in a sport organisation, February to June 2027. Process mapping, workflow automation, AI tools and team adoption.",
  version: "v4.0",
  year: "2026",
}

export const PROFILE = {
  firstName: "Jules",
  lastName: "Moreau",
  role: "Digital Transformation & AI // Sport organisations",
  degree: "M2 International Sport Administration",
  school: "Université de Lille — STAPS / ISA",
  seeking: "Digital transformation & AI internship",
  window: "February → June 2027",
  windowShort: "FEB → JUN 2027",
  focus: "Process mapping, workflow automation, AI tools & team adoption for sport organisations.",
  location: "Lille, France",
  coords: "50.6292° N / 3.0573° E",
  email: "jules.moreau1@outlook.com",
  linkedin: "https://www.linkedin.com/in/jules-moreau-25405b363",
  cv: "/assets/cv-julesmoreau.pdf",
  languages: [
    { label: "French", level: "Native" },
    { label: "English", level: "C1" },
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
    body: "École de Maistrance. Military rigor, crisis management and team leadership. Operational reserve duties focused on discipline and organisation.",
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
