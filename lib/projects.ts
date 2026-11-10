/* ------------------------------------------------------------------
   PROJECTS — what the artifact panel shows. The AI's knowledge of each
   project lives in knowledge/projects/<id>.md; the ids below are the
   only values the open_project tool accepts.
   ------------------------------------------------------------------ */

export const PROJECT_IDS = ["sifflo", "ono-sendai", "daring", "signal", "field-ops", "build", "strategy", "harness"] as const
export type ProjectId = (typeof PROJECT_IDS)[number]

export const SECTIONS = ["overview", "context", "role", "approach", "results", "gallery", "demo", "links"] as const
export type SectionId = (typeof SECTIONS)[number]

export type Media = { src: string; alt: string; caption?: string; fit?: "cover" | "contain" }

export type Block = { section: SectionId; title?: string } & (
  | { type: "text"; body: string }
  | { type: "list"; items: string[] }
  | { type: "steps"; items: { label: string; text: string }[] }
  | { type: "metrics"; items: { value: string; label: string }[] }
  | { type: "gallery"; items: Media[] }
  | { type: "site"; url: string; label: string; note?: string }
  | { type: "pdf"; src: string; label: string }
  | { type: "demo"; demo: "ono-spaces" | "asi-incidents" | "thesis-engine" }
  | { type: "links"; items: { label: string; href: string }[] }
)

export type Project = {
  id: ProjectId
  code: string
  title: string
  org: string
  role: string
  period: string
  location: string
  status: string
  summary: string
  accent: string
  cover?: Media
  stack?: string[]
  /** Kept for the AI double and its own page, but not listed in the sidebar. */
  hidden?: boolean
  /** Optional per-project names for the section tabs. */
  labels?: Partial<Record<SectionId, string>>
  blocks: Block[]
}

const D = "/media/daring"
const S = "/media/signal"
const F = "/media/field-ops"
const O = "/media/ono-sendai"
const B = "/media/build"
const SF = "/media/sifflo"

export const PROJECTS: Project[] = [
  {
    id: "sifflo",
    code: "SFL",
    title: "Sifflo",
    org: "The app for amateur football clubs · Moreau Digital",
    role: "Product designer and builder",
    period: "Nov 2026 → pilot",
    location: "sifflo.app",
    status: "Pilot · first club online",
    summary:
      "One app that replaces a football club's WhatsApp groups: call-ups answered in one tap, live score from the touchline, carpooling, volunteers and sponsor slots. Built from what I saw running communications at AS Nortkerque 95, now its first club.",
    accent: "#3fb56b",
    cover: { src: `${SF}/pelouse.webp`, alt: "Football pitch" },
    stack: ["Next.js", "Supabase", "Cloudflare Workers", "Web push", "PWA", "Claude Code"],
    labels: { results: "Where it stands" },
    blocks: [
      { section: "overview", type: "metrics", items: [
        { value: "5", label: "roles on one account" },
        { value: "€2", label: "per licensed member, per year" },
        { value: "409", label: "automated access-rule tests" },
        { value: "0", label: "app store: it opens from a link" },
      ] },
      { section: "context", title: "The friction", type: "text", body:
        "A volunteer-run club lives in group chats. Call-ups by text message, changes lost in the thread, parents who miss the one message that concerned them, sponsors seen only on a pitch-side banner. I lived it at AS Nortkerque 95. Sifflo is the tool I was missing, and the field answer to my thesis question." },
      { section: "role", title: "My role", type: "text", body:
        "Product design, the rules on who sees what, pricing, content, QA and deployment. I directed AI coding agents for the implementation." },
      { section: "demo", title: "sifflo.app", type: "site", url: "https://sifflo.app", label: "sifflo.app", note: "The live landing page, with tappable previews of the live score and call-ups." },
      { section: "approach", title: "Choices", type: "steps", items: [
        { label: "No app store", text: "Opens from a link and installs on the home screen, with the club's own name, crest and colours." },
        { label: "Children first", text: "Minors' data is protected by the database itself. Shortened names, accounts validated by a club official, image rights dated and revocable." },
        { label: "Works at the pitch", text: "A goal or an answer entered without network is sent when the connection returns, with the right minute." },
        { label: "A price a club can carry", text: "€2 per licensed member per year, designed to be covered by the sponsor slots inside the app." },
      ] },
      { section: "approach", title: "What a club gets", type: "list", items: [
        "Call-ups answered in one tap, with an automatic reminder the evening before.",
        "Live score with a notification for each goal.",
        "One notification per family, mentioning only its own children.",
        "Calendar, carpooling, volunteer slots, line-ups, licence files.",
        "Partner of the week, \"match presented by\" and a partners page for sponsors.",
      ] },
      { section: "gallery", title: "Screens", type: "gallery", items: [
        { src: `${SF}/accueil-partenaire.jpg`, alt: "Home screen with the partner of the week", fit: "contain" },
        { src: `${SF}/matchs.jpg`, alt: "Match calendar", fit: "contain" },
        { src: `${SF}/match-partenaire.jpg`, alt: "Match page presented by a partner", fit: "contain" },
        { src: `${SF}/equipes.jpg`, alt: "Teams of the club", fit: "contain" },
        { src: `${SF}/equipe-s1.jpg`, alt: "Senior team page", fit: "contain" },
      ] },
      { section: "results", title: "Where it stands", type: "list", items: [
        "Launched in November 2026, at pilot stage with its first club, AS Nortkerque 95.",
        "Built for many clubs from day one: each has its own address and its data is isolated from the others.",
        "No usage figures yet. I will publish them when they exist.",
      ] },
      { section: "links", type: "links", items: [{ label: "sifflo.app", href: "https://sifflo.app" }] },
    ],
  },
  {
    id: "ono-sendai",
    code: "ONO",
    title: "Ono-Sendai",
    org: "My lab · personal AI workspace",
    role: "Designer and builder",
    period: "2026 → in daily use",
    location: "macOS app",
    status: "In daily use",
    summary:
      "The tool I use every day, and where I test on myself what I recommend to clubs. It lets me write my thesis with every claim tied to its page, question 31 books in French, and leave a lecture with a course, a revision sheet and flashcards.",
    accent: "#8b9cf7",
    cover: { src: `${O}/cover.jpg`, alt: "Illustration of a knowledge graph" },
    stack: ["Electron", "OpenCode", "whisper.cpp", "bge-m3", "pdf.js", "Qwen3 4B + LoRA", "Ollama", "DeepSeek V4-Pro"],
    blocks: [
      { section: "overview", type: "metrics", items: [
        { value: "4", label: "study tools in one app" },
        { value: "31", label: "books searchable to the page" },
        { value: "90/day", label: "sources scanned" },
        { value: "≈ €0", label: "per month to run" },
      ] },
      { section: "context", title: "Context", type: "text", body:
        "My thesis asks whether generative AI and no-code tools can professionalise a sports association with little time and money. Before recommending anything to a club, I tried it on myself: one app for the whole master's year, used every day. What held up here (answers that cite their source, plain files, tools that run locally for almost nothing) is what I carried into Sifflo." },
      { section: "role", title: "My role", type: "text", body:
        "Product design, architecture choices, model testing, content and QA. I directed AI coding agents (OpenCode, Claude Code, Codex) for the implementation, with tests." },
      { section: "demo", title: "Explore the four study tools", type: "demo", demo: "ono-spaces" },
      { section: "approach", title: "Design choices", type: "steps", items: [
        { label: "Grounded", text: "The copilot is read-only on the thesis and every answer cites its page or section." },
        { label: "Plain files", text: "Markdown, CSL-JSON and Zotero. Nothing is locked inside the app." },
        { label: "Local first", text: "Transcription and search run on my Mac: audio never leaves it." },
        { label: "Tested models", text: "Three embedding models compared on real sport-management books. Only bge-m3 linked French questions to English passages." },
      ] },
      { section: "approach", title: "The Thesis Engine", type: "demo", demo: "thesis-engine" },
      { section: "gallery", title: "Gallery", type: "gallery", items: [
        { src: `${O}/thesis-case.webp`, alt: "Ono-Sendai case overview" },
        { src: `${O}/thesis-stack.webp`, alt: "Toolchain behind Ono-Sendai" },
        { src: `${O}/thesis-sieve.webp`, alt: "Thesis Engine filtering sources" },
      ] },
      { section: "links", title: "Access", type: "text", body:
        "The repositories stay private while the thesis is in progress. Happy to demo it live in an interview." },
    ],
  },
  {
    id: "daring",
    code: "DRG",
    title: "Royal Daring HC",
    org: "Royal Daring Club de Molenbeek · est. 1922",
    role: "Communication and sponsoring",
    period: "May → Jul 2026",
    location: "Brussels, BE",
    status: "Built to last",
    summary:
      "A sponsor system built to outlive my internship: first brand guidelines, a bilingual FR/NL partner website, a generated PDF brochure, Canva templates and a Notion handover the volunteers run on their own.",
    accent: "#e5484d",
    cover: { src: `${D}/site/img/hero.jpg`, alt: "Royal Daring hockey field" },
    stack: ["HTML", "CSS", "JavaScript", "Python", "ReportLab", "Netlify", "Canva", "Notion", "Claude Code", "Codex"],
    blocks: [
      { section: "overview", type: "metrics", items: [
        { value: "5 + 1", label: "sponsor tiers + Youth Pack" },
        { value: "FR/NL", label: "partner website" },
        { value: "9 p.", label: "generated brochure" },
        { value: "11", label: "post templates handed over" },
      ] },
      { section: "context", title: "Context", type: "text", body:
        "A century-old field hockey club: 19 teams, about 620 members, promotion to Division Honneur ahead. When I arrived there was no visual identity, a static 3-tier sponsor PDF and no reusable workflow." },
      { section: "role", title: "My role", type: "text", body:
        "Communication and sponsoring intern. I ran the audit, designed the brand system and the sponsor offer, built the website and brochure with AI coding agents, and wrote the handover." },
      { section: "demo", title: "Partner website", type: "site", url: "https://rdaring-sponsor-only.netlify.app", label: "rdaring-sponsor-only.netlify.app", note: "The live bilingual partner site. Switch FR / NL in its menu." },
      { section: "approach", title: "Approach", type: "steps", items: [
        { label: "Awareness", text: "Social formats: weekend recap, matchday stories, playoff poster." },
        { label: "Credibility", text: "First graphic charter: Daring red, black, gold, Playfair Display and DM Sans." },
        { label: "Offer", text: "5 tiers + Youth Pack on a FR/NL website and a 9-page brochure generated with Python." },
        { label: "Continuity", text: "Notion playbook, editorial charter, 11 templates and a Markdown export for any AI assistant." },
      ] },
      { section: "gallery", title: "Gallery", type: "gallery", items: [
        { src: `${D}/sponsor-site-preview.jpg`, alt: "Partner website, home" },
        { src: `${D}/sponsor-site-packs.webp`, alt: "Partner website, sponsor packs" },
        { src: `${D}/daring-visuals.webp`, alt: "Social visuals" },
        { src: `${D}/affiche_final.png`, alt: "Match poster", fit: "contain" },
        { src: `${D}/recap/1.png`, alt: "Weekend recap carousel", fit: "contain" },
        { src: `${D}/stage_ete_fr.png`, alt: "Summer camp poster, French", fit: "contain" },
        { src: `${D}/stage_ete_nl.png`, alt: "Summer camp poster, Dutch", fit: "contain" },
        { src: `${D}/tshirt_playoffs.png`, alt: "Playoffs T-shirt", fit: "contain" },
        { src: `${D}/notion/playbook.png`, alt: "Notion playbook", fit: "contain" },
        { src: `${D}/info_general_cartsnack.png`, alt: "Bilingual signage", fit: "contain" },
      ] },
      { section: "results", title: "What the club kept", type: "list", items: [
        "A live bilingual partner website and a sponsor offer rebuilt from 3 to 5 tiers + Youth Pack.",
        "22 existing partner logos integrated as social proof, and a club LinkedIn page.",
        "Templates and a Notion workspace so volunteers keep producing without me.",
      ] },
      { section: "links", title: "Documents", type: "pdf", src: `${D}/site/Royal_Daring_Partenaires_2025-26.pdf`, label: "Partner brochure 2025-26 (PDF)" },
      { section: "links", type: "links", items: [{ label: "Live partner site", href: "https://rdaring-sponsor-only.netlify.app" }] },
    ],
  },
  {
    id: "signal",
    code: "SGN",
    title: "ASN95 Signal",
    org: "AS Nortkerque 95 · football club",
    role: "Head of communications",
    period: "Jan → Jun 2025",
    location: "Nortkerque, FR",
    status: "Built from scratch",
    summary:
      "A local club's digital presence built from nothing: a sponsor prediction game, a weekly visual identity and a full season of matchday photography. One million views.",
    accent: "#d6409f",
    cover: { src: `${S}/group_sponsor.webp`, alt: "Youth academy sponsor photoshoot" },
    stack: ["Canva", "Lightroom", "Sony α6400", "Google Forms"],
    blocks: [
      { section: "overview", type: "metrics", items: [
        { value: "1M+", label: "views in one season" },
        { value: "+467%", label: "sponsor click-through" },
        { value: "+93.8%", label: "interactions" },
        { value: "1,650+", label: "edited photos" },
      ] },
      { section: "context", title: "Starting point", type: "text", body:
        "No content calendar, no visual guidelines, no recurring formats. Sponsors had no visibility beyond pitch-side banners. The club had a community, but no voice." },
      { section: "approach", title: "Three acts", type: "steps", items: [
        { label: "Activation", text: "Les Pronos du Sultan: a weekly prediction game with a sponsor, free meal for the top 3. +467% CTR. Then ASN95 Predict, a first app concept." },
        { label: "Communication", text: "Match posters, results and interviews. 3 recurring formats, 5+ sponsors per visual, templates locked mid-season." },
        { label: "Field", text: "33 events covered, 26 league matches, the club's 30th anniversary, a youth sponsor shoot with 50+ kids." },
      ] },
      { section: "gallery", title: "Gallery", type: "gallery", items: [
        { src: `${S}/asn95-posters.webp`, alt: "Match posters" },
        { src: `${S}/match-championnat.png`, alt: "Match day poster", fit: "contain" },
        { src: `${S}/resultat-match.jpg`, alt: "Result graphic", fit: "contain" },
        { src: `${S}/interview.webp`, alt: "Interview series", fit: "contain" },
        { src: `${S}/photo_senior_1.jpg`, alt: "Senior team in action" },
        { src: `${S}/photoshoot_individuel_1.jpg`, alt: "Player portrait" },
        { src: `${S}/dossier-sponsoring.jpg`, alt: "Sponsorship file", fit: "contain" },
      ] },
      { section: "results", title: "Lessons", type: "list", items: ["Consistency wins.", "Sponsors need stories.", "Build, then scale."] },
    ],
  },
  {
    id: "field-ops",
    code: "FLD",
    title: "ASI Tournament",
    org: "ASI Multisports Tournament · UFR3S Lille",
    role: "Comms chief · field operations",
    period: "December 2025",
    location: "Lille, FR",
    status: "On the ground",
    summary:
      "Communication and field coordination for a 500+ person campus tournament across four disciplines. Two critical incidents handled with zero disruption.",
    accent: "#3e9bd6",
    cover: { src: `${F}/asi-1.jpg`, alt: "ASI tournament" },
    stack: ["Sony α6400", "GoPro ×2", "Canva"],
    blocks: [
      { section: "overview", type: "metrics", items: [
        { value: "500+", label: "people" },
        { value: "4", label: "disciplines" },
        { value: "2 / 0", label: "incidents / disruption" },
        { value: "45 min", label: "to secure a new venue" },
      ] },
      { section: "context", title: "Context", type: "text", body:
        "A university tournament in disc golf, wheelchair basketball, laser tag and spikeball. I led communication and helped run the day on the ground." },
      { section: "demo", title: "Incident log", type: "demo", demo: "asi-incidents" },
      { section: "role", title: "What I produced", type: "list", items: [
        "Graphic charter (palette and type system).",
        "Bilingual FR/EN participant briefing and rules.",
        "Campus and social media poster.",
        "Event photography and body-cam coverage.",
      ] },
      { section: "gallery", title: "Gallery", type: "gallery", items: [
        { src: `${F}/affiche.png`, alt: "Tournament poster", fit: "contain" },
        { src: `${F}/charte.png`, alt: "Graphic charter", fit: "contain" },
        { src: `${F}/regles.jpg`, alt: "Bilingual rules", fit: "contain" },
        { src: `${F}/asi-2.jpg`, alt: "Tournament action" },
        { src: `${F}/asi-3.jpg`, alt: "Tournament action" },
        { src: `${F}/asi-4.jpg`, alt: "Tournament action" },
      ] },
    ],
  },
  {
    id: "build",
    code: "BLD",
    title: "Client builds",
    org: "Moreau Digital · Ferrant P.H.E",
    role: "AI-assisted web delivery",
    period: "2025 → 2026",
    location: "Hauts-de-France, FR",
    status: "Live",
    summary:
      "Websites for real clients, starting with a live bilingual catalogue for an essential-oils manufacturer. Since October 2026 I do this under my own micro-enterprise, Moreau Digital. I own the brief, content, QA and deployment; AI agents write the code.",
    accent: "#d9a21b",
    cover: { src: `${B}/ferrantphe.png`, alt: "ferrantphe.fr home page" },
    stack: ["HTML", "CSS", "JavaScript", "Tailwind CSS", "Claude Code", "Codex"],
    blocks: [
      { section: "approach", title: "Method", type: "steps", items: [
        { label: "Brief", text: "Goals, audience and content with the client." },
        { label: "Structure", text: "Pages, catalogue and SEO plan." },
        { label: "AI build", text: "Implementation directed through Claude Code and Codex." },
        { label: "QA and deploy", text: "Visual checks on every screen, then static hosting." },
      ] },
      { section: "demo", title: "Ferrant P.H.E · live", type: "site", url: "https://ferrantphe.fr", label: "ferrantphe.fr", note: "16 products, FR/EN datasheets, PWA, JSON-LD, llms.txt." },
      { section: "gallery", title: "Gallery", type: "gallery", items: [
        { src: `${B}/ferrantphe.png`, alt: "Ferrant P.H.E home" },
        { src: `${B}/ferrantphe2.webp`, alt: "Ferrant P.H.E catalogue" },
      ] },
      { section: "context", title: "Moreau Digital", type: "text", body:
        "My micro-enterprise since October 2026: websites for local shops and craftspeople who have none, hosted for a yearly subscription. I find the business, build a mock-up made for it from its own logo, van or business card, then quote. It is a young side activity, and it also publishes Sifflo." },
      { section: "links", type: "links", items: [
        { label: "ferrantphe.fr", href: "https://ferrantphe.fr" },
        { label: "moreaudigital.fr", href: "https://moreaudigital.fr" },
      ] },
    ],
  },
  {
    id: "strategy",
    code: "STR",
    title: "BLAST strategy",
    org: "Academic case study · “David vs Goliath 2.0”",
    role: "Strategic analyst",
    period: "2025",
    location: "Copenhagen → Mumbai",
    status: "Case study",
    hidden: true,
    summary:
      "A 23-page strategic audit of BLAST facing the PIF-backed EFG: PESTEL, VRIO, SWOT, and a mobile-first India pivot through a Reliance joint venture.",
    accent: "#e5733a",
    cover: { src: "/media/strategy/cover.jpg", alt: "Corporate environment" },
    blocks: [
      { section: "overview", type: "metrics", items: [
        { value: "23 p.", label: "dossier" },
        { value: "$82.1M", label: "BLAST FY24 revenue" },
        { value: "600M", label: "Indian gamers targeted" },
        { value: "2027", label: "break-even target" },
      ] },
      { section: "approach", title: "Roadmap", type: "steps", items: [
        { label: "H1 2026", text: "India launch: Mumbai studio, Jio and Paytm integration, mobile test event." },
        { label: "H2 2026", text: "Monetisation: Fantasy Live, Watch-to-Earn, ARPU +50%." },
        { label: "2027", text: "Break-even, revenue mix EU 60% / India 20% / MENA 20%." },
      ] },
      { section: "links", title: "Full dossier", type: "pdf", src: "/media/strategy/blast-case-study.pdf", label: "BLAST case study (PDF)" },
    ],
  },
  {
    id: "harness",
    code: "MHX",
    title: "How this works",
    org: "This site · Moreau Harness",
    role: "Designer and builder",
    period: "2026",
    location: "Next.js on Vercel",
    status: "Live",
    summary:
      "A portfolio you talk to. The AI double answers only from notes I wrote myself, opens projects in this panel, and runs on a budget of about €1 a day. Here is what happens behind each answer, and where it stops.",
    accent: "#5fd3a0",
    stack: ["Next.js", "TypeScript", "Vercel", "OpenRouter", "Claude Haiku 5.5", "Upstash Redis", "Claude Code"],
    labels: { results: "Limits", links: "Privacy" },
    blocks: [
      { section: "overview", type: "metrics", items: [
        { value: "≈ $0.001", label: "per answer" },
        { value: "€1", label: "daily spend cap" },
        { value: "4", label: "tools, all UI-only" },
        { value: "0", label: "models trained on me" },
      ] },
      { section: "context", title: "Why a chat", type: "text", body:
        "Recruiters rarely read a whole portfolio. They have one question: has he done X? So the site answers it directly, then shows the proof. It is also a small, real version of what I study: a useful AI tool that a small organisation could afford to run." },
      { section: "approach", title: "What happens when you ask", type: "steps", items: [
        { label: "Your message", text: "Sent to the site's server with the last few turns of the chat. Nothing else about you." },
        { label: "The reference", text: "The server adds my notes: identity, experience, skills, method, projects, FAQ and the rules the double must follow. That is all it knows." },
        { label: "The model", text: "Claude Haiku 5.5, through OpenRouter, writes the answer in my voice and streams it back. The notes are cached, which keeps each answer at a fraction of a cent." },
        { label: "The panel", text: "When a project is relevant, the model asks the interface to open it here. Its tools only open panels (project, CV, contact, off the clock); they never run anything on the server, and unknown project ids are dropped." },
      ] },
      { section: "approach", title: "Design choices", type: "list", items: [
        "Grounded, not trained: editing a Markdown file is all it takes to update what the double knows.",
        "Honest by default: when something is not in my notes, it says so and shows how to reach me.",
        "Works without AI: every project, the CV and the contact are reachable from the sidebar, and each project has its own shareable page.",
        "Built with AI coding agents (Claude Code); I owned the product, the content, the limits and the QA.",
      ] },
      { section: "results", title: "Limits", type: "list", items: [
        "It can be wrong. It is an AI summarising my notes, not me: for anything that matters (dates, contracts, an interview), write to me.",
        "Short answers by design, and only the recent part of the conversation is sent to the model.",
        "Usage is capped per visitor to keep costs predictable.",
        "A daily spending cap of about €1. Once it is reached, the chat pauses until midnight UTC; projects, CV and contact keep working.",
      ] },
      { section: "links", title: "Your data", type: "list", items: [
        "Your chats are stored in your own browser. Delete them from the sidebar at any time.",
        "To answer, your messages go to OpenRouter and the model provider. The site itself does not store or log what you write.",
        "Your IP address is only used as a rate-limit counter that expires within 24 hours.",
        "No account, no analytics, no tracking cookies.",
      ] },
    ],
  },
]

export function getProject(id: string) {
  return PROJECTS.find((p) => p.id === id)
}

export const CV_URL = "/media/docs/cv-julesmoreau.pdf"
export const CONTACT = {
  email: "jules.moreau1@outlook.com",
  linkedin: "https://www.linkedin.com/in/jules-moreau-lille",
  github: "https://github.com/julesmoreau62",
}
