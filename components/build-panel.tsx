"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import {
  X, Globe, CheckCircle, ExternalLink, Clock,
  Leaf, FlaskConical, Factory, BookOpen, Mail, Layers,
  Home, Users, Camera, GraduationCap, Shield,
} from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

const PURPLE = "hsl(262 83% 58%)"
const PURPLE_VAL = "262 83% 58%"
const GREEN_PHE = "#1A2F25"
const GOLD_PHE = "#C5A065"

/* ASN95 palette */
const ASN_BG = "#0D0D0A"
const ASN_YELLOW = "#F0C000"

/* Intro orbital nodes */
const ORBIT_NODES = ["DNS", "CDN", "SSL", "HTTP", "PWA", "SEO"]

/* ================================================================
   FERRANTPHE — Rich detail data
   ================================================================ */

const FERRANT_STATS = [
  { value: "16", label: "PRODUCTS" },
  { value: "1989", label: "EST." },
  { value: "30T", label: "DAILY CAPACITY" },
  { value: "FR/EN", label: "BILINGUAL" },
]

const FERRANT_STACK = [
  { category: "Frontend", items: ["HTML5", "CSS3", "JavaScript (vanilla)"] },
  { category: "Styling", items: ["Tailwind CSS (CDN)", "Playfair Display", "Lato"] },
  { category: "Performance", items: ["PWA", "Manifest.json", "Lazy loading"] },
  { category: "SEO", items: ["JSON-LD", "Open Graph", "Sitemap.xml", "Robots.txt"] },
  { category: "Discoverability", items: ["llms.txt (LLM layer)", "Structured data"] },
  { category: "Tooling", items: ["Lucide Icons", "Google Fonts", "GitHub Codex", "Claude Code"] },
]

const FERRANT_SECTIONS = [
  { icon: BookOpen, label: "HOME", desc: "Hero with animated background, event badge (FIE Frankfurt), CTA" },
  { icon: Leaf, label: "PRODUCTS", desc: "16 products, filterable by category (Oils / Concentrates), PDF datasheets" },
  { icon: Factory, label: "ABOUT", desc: "3-act company history + industrial specs (4 extractors, 316L SS, biomass boiler)" },
  { icon: Mail, label: "CONTACT", desc: "Phone, email, address, Maps link — M. Adrien Ferrant" },
]

const ESSENTIAL_OILS = [
  "Leek", "Garlic", "Onion", "Shallot",
  "Lovage Leaf", "Lovage Root", "Angelica Root", "Angelica Seed",
  "Thuya Atrovirens", "Thuya Occidentalis", "Carrot Seed", "Garlic Chives",
]

const CONCENTRATES = ["Leek", "Shallot", "Onion", "Garlic"]

const TIMELINE = [
  { year: "1989", label: "THE ROOTS", text: "Patrice Ferrant founds the company on family lands in Rodelinghem (Hauts-de-France). Onion farming diversifies into distillation." },
  { year: "2000s", label: "INNOVATION", text: "Industrial scale-up with custom 316L stainless steel stills. World-first Leek Essential Oil production launched." },
  { year: "TODAY", label: "GLOBAL LEADER", text: "30 metric tons processed daily. Supplies the world's leading flavor houses. Kosher certified, biomass closed-loop sustainability." },
]

const FERRANT_HIGHLIGHTS = [
  "Bilingual FR/EN — full UI, product names, datasheets",
  "16 downloadable PDF technical datasheets (FR + EN)",
  "Dynamic product catalog with category filter",
  "SEO: JSON-LD schema, Open Graph, sitemap.xml",
  "PWA-ready: manifest, theme-color, Apple touch icon",
  "LLM discoverability layer via /llms.txt",
  "No-JS fallback with full product & contact info",
  "Responsive: sidebar nav desktop / hamburger mobile",
  "Kosher certification & sustainability messaging",
  "Event badge (FIE Frankfurt) configurable via data.js",
]

/* ================================================================
   AS NORTKERQUE 95 — Rich detail data
   ================================================================ */

const ASN_STATS = [
  { value: "1995", label: "FOUNDED" },
  { value: "250+", label: "MEMBERS" },
  { value: "14", label: "SQUADS" },
  { value: "U7-U17", label: "YOUTH ACADEMY" },
]

const ASN_STACK = [
  { category: "Frontend", items: ["HTML5", "CSS3", "JavaScript (vanilla)"] },
  { category: "Styling", items: ["Tailwind CSS (CDN)", "Bebas Neue", "Inter"] },
  { category: "Performance", items: ["WebP images", "Lazy loading"] },
  { category: "SEO", items: ["Open Graph", "Meta tags", "Sitemap.xml"] },
  { category: "Tooling", items: ["Claude Code", "GitHub Codex"] },
]

const ASN_SECTIONS = [
  { icon: Home, label: "HOME", desc: "Hero \"More than a club, a family\" — CTAs Join us / Our matches" },
  { icon: Users, label: "TEAMS", desc: "All squads by category — Seniors A/B, U23, youth teams, women's" },
  { icon: Camera, label: "GALLERY", desc: "Match & training photos — integrated lightbox" },
  { icon: GraduationCap, label: "FOOTBALL SCHOOL", desc: "Youth academy U7→U17 — qualified coaches, Wed & Sat sessions" },
  { icon: Mail, label: "CONTACT", desc: "Club info + contact form" },
]

const ASN_TEAMS = [
  "Seniors A", "Seniors B", "U23", "U18", "U17", "U15",
  "U13", "U11", "U9", "U7", "Women's", "Futsal",
  "Veterans", "Animation Football",
]

const ASN_TIMELINE = [
  { year: "1995", label: "FOUNDED", text: "AS Nortkerque is established in Pas-de-Calais. The club is built on values of solidarity, respect and enjoyment of the game." },
  { year: "30 YRS", label: "LOCAL ROOTS", text: "250+ registered members, 14 squads and a structured youth academy (U7→U17). A cornerstone of local sport for three decades." },
  { year: "2025", label: "DIGITAL DEBUT", text: "First ever official website — no prior web presence. Launching a modern digital identity to support the club's development ambitions." },
]

const ASN_HIGHLIGHTS = [
  "Club's first-ever website — full digital debut",
  "Dark design with club identity colors (green / yellow)",
  "Youth football school section U7→U17 front & center",
  "Integrated photo gallery — matches & training",
  "Mobile-first responsive layout",
  "Strategic CTAs: Join us / Our matches",
  "Local SEO — Nortkerque, Pas-de-Calais",
  "Integrated contact form",
]

/* ================================================================
   PLACEHOLDER PROJECTS (future builds)
   ================================================================ */

interface PlaceholderProject {
  id: string
  name: string
  context: string
  status: "IN DEV" | "COMING SOON"
}

const PLACEHOLDER_PROJECTS: PlaceholderProject[] = []

/* ================================================================
   MAIN PANEL
   ================================================================ */
export function BuildPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const isMobile = useIsMobile()
  const [phase, setPhase] = useState<"intro" | "main">("intro")
  const [introStep, setIntroStep] = useState(0)
  const [visible, setVisible] = useState(false)
  const hasPlayedIntro = useRef(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleKey = useCallback(
    (e: KeyboardEvent) => { if (e.key === "Escape") onClose() },
    [onClose]
  )

  useEffect(() => {
    if (open) document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [open, handleKey])

  /* Reset on open */
  useEffect(() => {
    if (open) {
      setPhase("intro")
      setIntroStep(0)
      setVisible(false)
      if (scrollRef.current) scrollRef.current.scrollTop = 0
    }
  }, [open])

  /* Intro sequence - Mobile: 1.2s / Desktop: 3.2s */
  useEffect(() => {
    if (!open || phase !== "intro") return

    if (hasPlayedIntro.current) {
      setPhase("main")
      setTimeout(() => setVisible(true), 100)
      return
    }

    hasPlayedIntro.current = true
    const timings = isMobile
      ? [80, 300, 600, 900, 1200]
      : [200, 800, 1600, 2400, 3200]

    const timers = [
      setTimeout(() => setIntroStep(1), timings[0]),
      setTimeout(() => setIntroStep(2), timings[1]),
      setTimeout(() => setIntroStep(3), timings[2]),
      setTimeout(() => setIntroStep(4), timings[3]),
      setTimeout(() => {
        setPhase("main")
        setTimeout(() => setVisible(true), 100)
      }, timings[4]),
    ]
    return () => timers.forEach(clearTimeout)
  }, [open, phase, isMobile])

  const skipIntro = () => {
    hasPlayedIntro.current = true
    setPhase("main")
    setTimeout(() => setVisible(true), 100)
  }

  if (!open) return null

  /* ===== INTRO PHASE ===== */
  if (phase === "intro") {
    return (
      <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center overflow-hidden">
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(hsl(${PURPLE_VAL} / 0.15) 1px, transparent 1px), linear-gradient(90deg, hsl(${PURPLE_VAL} / 0.15) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 50%, hsl(${PURPLE_VAL} / 0.08) 0%, transparent 60%)` }}
        />

        {/* Deployment network */}
        <div className="relative w-48 h-48 md:w-64 md:h-64 mb-8">
          {/* Central globe */}
          <div
            className={`absolute inset-0 m-auto w-20 h-20 md:w-24 md:h-24 rounded-full border-2 flex items-center justify-center transition-all duration-700 ${introStep >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
            style={{
              borderColor: `hsl(${PURPLE_VAL} / 0.5)`,
              boxShadow: introStep >= 2 ? `0 0 40px hsl(${PURPLE_VAL} / 0.3), inset 0 0 20px hsl(${PURPLE_VAL} / 0.1)` : "none",
            }}
          >
            <Globe
              className="w-8 h-8 md:w-10 md:h-10"
              style={{
                color: PURPLE,
                filter: introStep >= 2 ? `drop-shadow(0 0 10px ${PURPLE})` : "none",
                animation: introStep >= 2 ? "orbit-spin 12s linear infinite" : "none",
              }}
            />
          </div>

          {/* Orbital nodes */}
          {ORBIT_NODES.map((node, i) => {
            const angle = (i / ORBIT_NODES.length) * Math.PI * 2 - Math.PI / 2
            const r = 80
            const x = 50 + (r / 128) * 100 * Math.cos(angle)
            const y = 50 + (r / 128) * 100 * Math.sin(angle)
            return (
              <div
                key={node}
                className="absolute transition-all duration-500"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: "translate(-50%, -50%)",
                  opacity: introStep >= 2 ? 1 : 0,
                  transitionDelay: `${i * 100}ms`,
                }}
              >
                <div
                  className="w-9 h-9 md:w-10 md:h-10 rounded-full border flex items-center justify-center backdrop-blur-sm"
                  style={{
                    borderColor: `hsl(${PURPLE_VAL} / 0.6)`,
                    background: `hsl(${PURPLE_VAL} / 0.1)`,
                    boxShadow: introStep >= 3 ? `0 0 12px hsl(${PURPLE_VAL} / 0.6)` : "none",
                  }}
                >
                  <span className="text-[8px] font-mono font-bold tracking-wider" style={{ color: PURPLE }}>
                    {node}
                  </span>
                </div>
              </div>
            )
          })}

          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
            {ORBIT_NODES.map((_, i) => {
              const angle = (i / ORBIT_NODES.length) * Math.PI * 2 - Math.PI / 2
              const r = 62
              const ex = 100 + r * Math.cos(angle)
              const ey = 100 + r * Math.sin(angle)
              return (
                <line
                  key={i}
                  x1="100"
                  y1="100"
                  x2={ex}
                  y2={ey}
                  stroke={`hsl(${PURPLE_VAL} / 0.35)`}
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  className="transition-opacity duration-500"
                  style={{
                    opacity: introStep >= 3 ? 1 : 0,
                    transitionDelay: `${i * 80}ms`,
                  }}
                />
              )
            })}
          </svg>

          {/* Pulse ring */}
          {introStep >= 3 && (
            <div
              className="absolute inset-0 m-auto w-20 h-20 md:w-24 md:h-24 rounded-full border animate-[node-ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"
              style={{ borderColor: `hsl(${PURPLE_VAL} / 0.35)` }}
            />
          )}
        </div>

        {/* Text lines */}
        <div className="text-center space-y-2">
          <p
            className={`font-mono text-[10px] tracking-[0.4em] uppercase transition-all duration-500 ${introStep >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ color: PURPLE }}
          >
            INITIALIZING DEPLOYMENT PIPELINE
          </p>
          <p
            className={`font-mono text-[9px] text-muted-foreground tracking-[0.2em] transition-all duration-500 ${introStep >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            RESOLVING DNS // CONNECTING TO CDN EDGE
          </p>
          <p
            className={`font-mono text-[9px] text-muted-foreground tracking-[0.2em] transition-all duration-500 ${introStep >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            PROVISIONING SSL // COMPILING ASSETS
          </p>
          <p
            className={`font-mono text-[9px] tracking-[0.2em] transition-all duration-500 ${introStep >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ color: "hsl(160 84% 39%)" }}
          >
            DEPLOYMENT OPERATIONAL // 2 SITES LIVE
          </p>
        </div>

        {/* Loading bar */}
        <div className="w-48 md:w-64 h-0.5 bg-border/30 rounded-full mt-6 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-[3000ms] ease-out"
            style={{
              width: introStep >= 1 ? "100%" : "0%",
              background: `linear-gradient(90deg, hsl(${PURPLE_VAL}), hsl(${PURPLE_VAL} / 0.6))`,
            }}
          />
        </div>

        {/* Skip */}
        <button
          onClick={skipIntro}
          className="mt-6 text-[8px] font-mono text-muted-foreground/40 hover:text-muted-foreground transition-colors tracking-[0.3em] uppercase"
        >
          SKIP INIT
        </button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(hsl(${PURPLE_VAL} / 0.15) 1px, transparent 1px), linear-gradient(90deg, hsl(${PURPLE_VAL} / 0.15) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 30% 20%, hsl(${PURPLE_VAL} / 0.06) 0%, transparent 60%)` }}
      />

      {/* Header */}
      <header className="relative z-10 h-11 flex items-center justify-between px-4 md:px-8 border-b border-border/50 bg-card/30 backdrop-blur shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: PURPLE }} />
          <Globe className="w-3.5 h-3.5" style={{ color: PURPLE }} />
          <span className="font-tech text-sm font-bold tracking-[0.2em]" style={{ color: PURPLE }}>BUILD</span>
          <span className="hidden md:inline text-xs font-mono text-muted-foreground tracking-wider">// WEB DEPLOYMENTS</span>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded border border-border/50 hover:border-border transition-colors"
          aria-label="Close panel"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </header>

      {/* Scrollable content */}
      <div ref={scrollRef} className="relative z-10 h-[calc(100vh-2.75rem)] overflow-y-auto px-4 md:px-8 py-6">
        <div className={`max-w-4xl mx-auto transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>

          {/* Section header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4" style={{ color: PURPLE }} />
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase font-bold" style={{ color: PURPLE }}>
                Client Web Builds
              </span>
            </div>
            <h2 className="font-tech text-2xl md:text-3xl font-bold text-foreground tracking-wide">DEPLOYED ASSETS</h2>
            <p className="text-sm font-mono text-muted-foreground mt-2 leading-relaxed max-w-xl">
              Production-grade websites delivered to real clients — built via AI-augmented workflows (Codex + Claude Code).
            </p>
          </div>

          {/* ── FERRANT PHE — MAIN CARD ── */}
          <FerrantCard />

          {/* ── AS NORTKERQUE 95 ── */}
          <Asn95Card />

          {/* ── PLACEHOLDER PROJECTS ── */}
          {PLACEHOLDER_PROJECTS.length > 0 && (
            <div className="flex flex-col gap-4 mt-6">
              {PLACEHOLDER_PROJECTS.map((p) => (
                <PlaceholderCard key={p.id} project={p} />
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

/* ================================================================
   FERRANT PHE — DETAILED CARD
   ================================================================ */
function FerrantCard() {
  const [tab, setTab] = useState<"overview" | "stack" | "catalog">("overview")

  return (
    <div
      className="relative backdrop-blur-md border-2 rounded-xl overflow-hidden"
      style={{ borderColor: `${GOLD_PHE}70`, background: `${GREEN_PHE}cc` }}
    >
      {/* Scan line */}
      <div
        className="absolute left-0 w-full h-[1px] pointer-events-none opacity-30"
        style={{
          background: `linear-gradient(90deg, transparent, ${GOLD_PHE}, transparent)`,
          animation: "scan-line 6s linear infinite",
        }}
      />

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 rounded-tl-lg" style={{ borderColor: GOLD_PHE }} />
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 rounded-tr-lg" style={{ borderColor: GOLD_PHE }} />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 rounded-bl-lg" style={{ borderColor: `${GOLD_PHE}66` }} />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 rounded-br-lg" style={{ borderColor: `${GOLD_PHE}66` }} />

      <div className="p-5 md:p-6">

        {/* ── Header row ── */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: GOLD_PHE }} />
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase font-bold" style={{ color: GOLD_PHE }}>LIVE</span>
              <span className="text-[10px] font-mono text-muted-foreground tracking-wider">// ferrantphe.fr</span>
            </div>
            <h3 className="font-tech text-2xl font-bold text-foreground tracking-wide">FERRANT P.H.E</h3>
            <p className="text-xs font-mono text-muted-foreground mt-0.5">
              Essential Oils & Concentrates — Family client — Rodelinghem, France
            </p>
          </div>
          <a
            href="https://ferrantphe.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-mono transition-all hover:brightness-125 shrink-0"
            style={{ borderColor: `${GOLD_PHE}66`, color: GOLD_PHE, background: `${GOLD_PHE}14` }}
          >
            <ExternalLink className="w-3 h-3" />
            VISIT
          </a>
        </div>

        {/* ── KPI chips ── */}
        <div className="grid grid-cols-4 gap-2 mb-5">
          {FERRANT_STATS.map((s) => (
            <div
              key={s.label}
              className="text-center py-2 rounded-lg border"
              style={{ borderColor: `${GOLD_PHE}33`, background: `${GOLD_PHE}0d` }}
            >
              <span className="block text-base md:text-lg font-mono font-bold tabular-nums" style={{ color: GOLD_PHE }}>{s.value}</span>
              <span className="block text-[8px] md:text-[9px] font-mono text-muted-foreground tracking-wider uppercase">{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Screenshots ── */}
        <div className="flex gap-3 mb-5">
          <div
            className="relative flex-1 h-44 md:h-56 rounded-lg border overflow-hidden"
            style={{ borderColor: `${GOLD_PHE}33` }}
          >
            <Image
              src="/assets/build/ferrantphe.png"
              alt="FerrantPHE screenshot 1"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 50vw, 448px"
            />
          </div>
          <div
            className="relative flex-1 h-44 md:h-56 rounded-lg border overflow-hidden"
            style={{ borderColor: `${GOLD_PHE}33` }}
          >
            <Image
              src="/assets/build/ferrantphe2.webp"
              alt="FerrantPHE screenshot 2"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 50vw, 448px"
            />
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 mb-5 border-b pb-0" style={{ borderColor: `${GOLD_PHE}22` }}>
          {(["overview", "stack", "catalog"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-3 py-1.5 text-[10px] font-mono tracking-[0.15em] uppercase transition-all rounded-t-md -mb-px"
              style={{
                color: tab === t ? GOLD_PHE : "hsl(215 20% 45%)",
                borderBottom: tab === t ? `2px solid ${GOLD_PHE}` : "2px solid transparent",
                background: tab === t ? `${GOLD_PHE}12` : "transparent",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── Tab: OVERVIEW ── */}
        {tab === "overview" && (
          <div className="space-y-5">

            {/* Site sections */}
            <div>
              <p className="text-[10px] font-mono text-muted-foreground tracking-[0.2em] uppercase mb-3">Site Sections</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {FERRANT_SECTIONS.map(({ icon: Icon, label, desc }) => (
                  <div
                    key={label}
                    className="flex items-start gap-3 p-3 rounded-lg border"
                    style={{ borderColor: `${GOLD_PHE}28`, background: `${GOLD_PHE}08` }}
                  >
                    <Icon className="w-4 h-4 shrink-0 mt-0.5" style={{ color: GOLD_PHE }} />
                    <div>
                      <span className="text-[10px] font-mono font-bold tracking-widest uppercase" style={{ color: GOLD_PHE }}>{label}</span>
                      <p className="text-xs font-mono text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Company timeline */}
            <div>
              <p className="text-[10px] font-mono text-muted-foreground tracking-[0.2em] uppercase mb-3">Company Timeline</p>
              <div className="relative pl-4 border-l space-y-4" style={{ borderColor: `${GOLD_PHE}33` }}>
                {TIMELINE.map(({ year, label, text }) => (
                  <div key={year} className="relative">
                    <div
                      className="absolute -left-[1.35rem] w-2.5 h-2.5 rounded-full border-2"
                      style={{ background: GREEN_PHE, borderColor: GOLD_PHE }}
                    />
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-mono font-bold" style={{ color: GOLD_PHE }}>{year}</span>
                      <span className="text-[10px] font-mono tracking-widest uppercase text-foreground/70">{label}</span>
                    </div>
                    <p className="text-xs font-mono text-muted-foreground leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div>
              <p className="text-[10px] font-mono text-muted-foreground tracking-[0.2em] uppercase mb-3">Technical Highlights</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                {FERRANT_HIGHLIGHTS.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 mt-0.5 shrink-0" style={{ color: GOLD_PHE }} />
                    <span className="text-xs font-mono text-muted-foreground">{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Design system */}
            <div>
              <p className="text-[10px] font-mono text-muted-foreground tracking-[0.2em] uppercase mb-3">Design System</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { color: "#1A2F25", label: "phe-green" },
                  { color: "#C5A065", label: "phe-gold" },
                  { color: "#233b30", label: "phe-surface" },
                  { color: "#F9F9F7", label: "phe-light" },
                ].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div
                      className="w-5 h-5 rounded border border-white/10"
                      style={{ background: color }}
                    />
                    <span className="text-[10px] font-mono text-muted-foreground">{label}</span>
                  </div>
                ))}
                <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-border/30">
                  <span className="text-[10px] font-mono text-muted-foreground">Playfair Display</span>
                  <span className="text-[10px] font-mono text-muted-foreground/40">+</span>
                  <span className="text-[10px] font-mono text-muted-foreground">Lato</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ── Tab: STACK ── */}
        {tab === "stack" && (
          <div className="space-y-3">
            {FERRANT_STACK.map(({ category, items }) => (
              <div key={category}>
                <p className="text-[9px] font-mono tracking-[0.2em] uppercase mb-1.5" style={{ color: GOLD_PHE }}>
                  {category}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {items.map((item) => (
                    <span
                      key={item}
                      className="text-[10px] font-mono px-2 py-0.5 rounded border"
                      style={{
                        color: `${GOLD_PHE}dd`,
                        borderColor: `${GOLD_PHE}40`,
                        background: `${GOLD_PHE}0d`,
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Tab: CATALOG ── */}
        {tab === "catalog" && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FlaskConical className="w-3.5 h-3.5" style={{ color: GOLD_PHE }} />
                <p className="text-[10px] font-mono tracking-[0.2em] uppercase font-bold" style={{ color: GOLD_PHE }}>
                  Essential Oils — {ESSENTIAL_OILS.length} references
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ESSENTIAL_OILS.map((name) => (
                  <span
                    key={name}
                    className="text-[10px] font-mono px-2 py-0.5 rounded border"
                    style={{
                      color: `${GOLD_PHE}dd`,
                      borderColor: `${GOLD_PHE}40`,
                      background: `${GOLD_PHE}0d`,
                    }}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-3.5 h-3.5" style={{ color: GOLD_PHE }} />
                <p className="text-[10px] font-mono tracking-[0.2em] uppercase font-bold" style={{ color: GOLD_PHE }}>
                  Concentrates — {CONCENTRATES.length} references
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {CONCENTRATES.map((name) => (
                  <span
                    key={name}
                    className="text-[10px] font-mono px-2 py-0.5 rounded border"
                    style={{
                      color: `${GOLD_PHE}cc`,
                      borderColor: `${GOLD_PHE}44`,
                      background: `${GOLD_PHE}0d`,
                    }}
                  >
                    {name} Conc.
                  </span>
                ))}
              </div>
            </div>
            <div
              className="flex items-center gap-3 p-3 rounded-lg border mt-2"
              style={{ borderColor: `${GOLD_PHE}33`, background: `${GOLD_PHE}08` }}
            >
              <Factory className="w-4 h-4 shrink-0" style={{ color: GOLD_PHE }} />
              <p className="text-xs font-mono text-muted-foreground leading-relaxed">
                All products ship with bilingual PDF technical datasheets (FR + EN) — composition, process, origin, harvest calendar, ratio.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

/* ================================================================
   AS NORTKERQUE 95 — DETAILED CARD
   ================================================================ */
function Asn95Card() {
  const [tab, setTab] = useState<"overview" | "stack" | "squads">("overview")
  const [visible, setVisible] = useState(false)
  const statusColor = "hsl(45 93% 58%)"

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className={`relative backdrop-blur-md border-2 rounded-xl overflow-hidden mt-6 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      style={{ borderColor: `${ASN_YELLOW}70`, background: `${ASN_BG}cc` }}
    >
      {/* Scan line */}
      <div
        className="absolute left-0 w-full h-[1px] pointer-events-none opacity-30"
        style={{
          background: `linear-gradient(90deg, transparent, ${ASN_YELLOW}, transparent)`,
          animation: "scan-line 6s linear infinite",
        }}
      />

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 rounded-tl-lg" style={{ borderColor: ASN_YELLOW }} />
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 rounded-tr-lg" style={{ borderColor: ASN_YELLOW }} />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 rounded-bl-lg" style={{ borderColor: `${ASN_YELLOW}66` }} />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 rounded-br-lg" style={{ borderColor: `${ASN_YELLOW}66` }} />

      <div className="p-5 md:p-6">

        {/* ── Header row ── */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: statusColor }} />
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase font-bold" style={{ color: statusColor }}>IN DEV</span>
              <span className="text-[10px] font-mono text-muted-foreground tracking-wider">// asnortkerque95</span>
            </div>
            <h3 className="font-tech text-2xl font-bold text-foreground tracking-wide">AS NORTKERQUE 95</h3>
            <p className="text-xs font-mono text-muted-foreground mt-0.5">
              Football club — Local client — Nortkerque, Pas-de-Calais
            </p>
          </div>
          <Shield className="w-5 h-5 opacity-20 shrink-0 mt-1" style={{ color: ASN_YELLOW }} />
        </div>

        {/* ── WIP Progress bar ── */}
        <div
          className="flex items-center gap-3 px-3 py-2 rounded-lg border mb-5"
          style={{ borderColor: `${ASN_YELLOW}40`, background: `${ASN_YELLOW}0a` }}
        >
          <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase shrink-0" style={{ color: ASN_YELLOW }}>
            BUILD PROGRESS
          </span>
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: `${ASN_YELLOW}20` }}>
            <div
              className="h-full rounded-full"
              style={{ width: "50%", background: `linear-gradient(90deg, ${ASN_YELLOW}99, ${ASN_YELLOW})` }}
            />
          </div>
          <span className="text-[10px] font-mono font-bold tabular-nums shrink-0" style={{ color: ASN_YELLOW }}>50%</span>
          <span className="text-[10px] font-mono text-muted-foreground shrink-0">— WIP</span>
        </div>

        {/* ── KPI chips ── */}
        <div className="grid grid-cols-4 gap-2 mb-5">
          {ASN_STATS.map((s) => (
            <div
              key={s.label}
              className="text-center py-2 rounded-lg border"
              style={{ borderColor: `${ASN_YELLOW}33`, background: `${ASN_YELLOW}0d` }}
            >
              <span className="block text-base md:text-lg font-mono font-bold tabular-nums" style={{ color: ASN_YELLOW }}>{s.value}</span>
              <span className="block text-[8px] md:text-[9px] font-mono text-muted-foreground tracking-wider uppercase">{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Screenshots ── */}
        <div className="flex gap-3 mb-5">
          <div
            className="relative flex-1 h-44 md:h-56 rounded-lg border overflow-hidden"
            style={{ borderColor: `${ASN_YELLOW}33` }}
          >
            <Image
              src="/assets/build/ASN1.webp"
              alt="AS Nortkerque 95 screenshot 1"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 50vw, 448px"
            />
          </div>
          <div
            className="relative flex-1 h-44 md:h-56 rounded-lg border overflow-hidden"
            style={{ borderColor: `${ASN_YELLOW}33` }}
          >
            <Image
              src="/assets/build/ASN2.webp"
              alt="AS Nortkerque 95 screenshot 2"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 50vw, 448px"
            />
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 mb-5 border-b pb-0" style={{ borderColor: `${ASN_YELLOW}22` }}>
          {(["overview", "stack", "squads"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-3 py-1.5 text-[10px] font-mono tracking-[0.15em] uppercase transition-all rounded-t-md -mb-px"
              style={{
                color: tab === t ? ASN_YELLOW : "hsl(215 20% 45%)",
                borderBottom: tab === t ? `2px solid ${ASN_YELLOW}` : "2px solid transparent",
                background: tab === t ? `${ASN_YELLOW}12` : "transparent",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── Tab: OVERVIEW ── */}
        {tab === "overview" && (
          <div className="space-y-5">

            {/* Site sections */}
            <div>
              <p className="text-[10px] font-mono text-muted-foreground tracking-[0.2em] uppercase mb-3">Site Sections</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {ASN_SECTIONS.map(({ icon: Icon, label, desc }) => (
                  <div
                    key={label}
                    className="flex items-start gap-3 p-3 rounded-lg border"
                    style={{ borderColor: `${ASN_YELLOW}28`, background: `${ASN_YELLOW}08` }}
                  >
                    <Icon className="w-4 h-4 shrink-0 mt-0.5" style={{ color: ASN_YELLOW }} />
                    <div>
                      <span className="text-[10px] font-mono font-bold tracking-widest uppercase" style={{ color: ASN_YELLOW }}>{label}</span>
                      <p className="text-xs font-mono text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Club timeline */}
            <div>
              <p className="text-[10px] font-mono text-muted-foreground tracking-[0.2em] uppercase mb-3">Club History</p>
              <div className="relative pl-4 border-l space-y-4" style={{ borderColor: `${ASN_YELLOW}33` }}>
                {ASN_TIMELINE.map(({ year, label, text }) => (
                  <div key={year} className="relative">
                    <div
                      className="absolute -left-[1.35rem] w-2.5 h-2.5 rounded-full border-2"
                      style={{ background: ASN_BG, borderColor: ASN_YELLOW }}
                    />
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-mono font-bold" style={{ color: ASN_YELLOW }}>{year}</span>
                      <span className="text-[10px] font-mono tracking-widest uppercase text-foreground/70">{label}</span>
                    </div>
                    <p className="text-xs font-mono text-muted-foreground leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div>
              <p className="text-[10px] font-mono text-muted-foreground tracking-[0.2em] uppercase mb-3">Technical Highlights</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                {ASN_HIGHLIGHTS.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 mt-0.5 shrink-0" style={{ color: ASN_YELLOW }} />
                    <span className="text-xs font-mono text-muted-foreground">{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Design system */}
            <div>
              <p className="text-[10px] font-mono text-muted-foreground tracking-[0.2em] uppercase mb-3">Design System</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { color: "#0D0D0A", label: "asn-dark" },
                  { color: "#F0C000", label: "asn-yellow" },
                  { color: "#2E5C1A", label: "asn-green" },
                  { color: "#F9F9F7", label: "asn-light" },
                ].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded border border-white/10" style={{ background: color }} />
                    <span className="text-[10px] font-mono text-muted-foreground">{label}</span>
                  </div>
                ))}
                <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-border/30">
                  <span className="text-[10px] font-mono text-muted-foreground">Bebas Neue</span>
                  <span className="text-[10px] font-mono text-muted-foreground/40">+</span>
                  <span className="text-[10px] font-mono text-muted-foreground">Inter</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ── Tab: STACK ── */}
        {tab === "stack" && (
          <div className="space-y-3">
            {ASN_STACK.map(({ category, items }) => (
              <div key={category}>
                <p className="text-[9px] font-mono tracking-[0.2em] uppercase mb-1.5" style={{ color: ASN_YELLOW }}>
                  {category}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {items.map((item) => (
                    <span
                      key={item}
                      className="text-[10px] font-mono px-2 py-0.5 rounded border"
                      style={{
                        color: `${ASN_YELLOW}dd`,
                        borderColor: `${ASN_YELLOW}40`,
                        background: `${ASN_YELLOW}0d`,
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Tab: SQUADS ── */}
        {tab === "squads" && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-3.5 h-3.5" style={{ color: ASN_YELLOW }} />
                <p className="text-[10px] font-mono tracking-[0.2em] uppercase font-bold" style={{ color: ASN_YELLOW }}>
                  {ASN_TEAMS.length} squads — Season 2025-2026
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ASN_TEAMS.map((name) => (
                  <span
                    key={name}
                    className="text-[10px] font-mono px-2 py-0.5 rounded border"
                    style={{
                      color: `${ASN_YELLOW}dd`,
                      borderColor: `${ASN_YELLOW}40`,
                      background: `${ASN_YELLOW}0d`,
                    }}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
            <div
              className="flex items-center gap-3 p-3 rounded-lg border mt-2"
              style={{ borderColor: `${ASN_YELLOW}33`, background: `${ASN_YELLOW}08` }}
            >
              <GraduationCap className="w-4 h-4 shrink-0" style={{ color: ASN_YELLOW }} />
              <p className="text-xs font-mono text-muted-foreground leading-relaxed">
                Football school U7→U17 — Qualified coaches, Wed &amp; Sat sessions, technical focus and team spirit.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

/* ================================================================
   PLACEHOLDER CARD (future projects)
   ================================================================ */
function PlaceholderCard({ project }: { project: PlaceholderProject }) {
  const statusColor = "hsl(45 93% 58%)"

  return (
    <div
      className="relative bg-card/40 border rounded-xl p-5 overflow-hidden"
      style={{ borderColor: "hsl(215 20% 25% / 0.4)" }}
    >
      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l" style={{ borderColor: `hsl(${PURPLE_VAL} / 0.2)` }} />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r" style={{ borderColor: `hsl(${PURPLE_VAL} / 0.15)` }} />

      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor }} />
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase font-bold" style={{ color: statusColor }}>
              {project.status}
            </span>
          </div>
          <h3 className="font-tech text-lg font-bold text-foreground tracking-wide">{project.name}</h3>
          <p className="text-xs font-mono text-muted-foreground mt-0.5">{project.context}</p>
        </div>
        <Clock className="w-5 h-5 opacity-20" style={{ color: statusColor }} />
      </div>
    </div>
  )
}
