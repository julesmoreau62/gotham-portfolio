"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import {
  X,
  ShieldCheck,
  Globe,
  FileText,
  Languages,
  Download,
  ExternalLink,
  CheckCircle,
  Target,
  Code2,
  CalendarDays,
  Signpost,
  Repeat,
} from "lucide-react"

const R = "#C8102E"
const BK = "#0D0D0D"
const G = "#C9A84C"
const W = "#F4F0E8"

const B = "/assets/Royal%20daring%20"
const V = `${B}/Daring%20Vitrine%20Marketing`
const LIVE_SITE = "https://leafy-pavlova-69305b.netlify.app"

export function DaringPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [previewLoaded, setPreviewLoaded] = useState(false)

  const jumpTo = (id: string) => {
    const scroller = scrollRef.current
    const target = scroller?.querySelector<HTMLElement>(`#${id}`)
    if (!scroller || !target) return
    scroller.scrollTo({ top: target.offsetTop - 8, behavior: "smooth" })
  }

  useEffect(() => {
    if (!open) return
    if (scrollRef.current) scrollRef.current.scrollTop = 0
    setPreviewLoaded(false)
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="daring-panel-shell fixed inset-0 z-[100] overflow-hidden" style={{ background: BK }}>
      <div className="daring-intro pointer-events-none absolute inset-0 z-50 overflow-hidden" aria-hidden="true">
        <div className="daring-intro__gate daring-intro__gate--top" />
        <div className="daring-intro__gate daring-intro__gate--bottom" />
        <div className="daring-intro__grid" />
        <div className="daring-intro__crest">
          <Image src={`${B}/logo-DARING.png`} alt="" fill className="object-contain" sizes="128px" priority />
        </div>
        <div className="daring-intro__copy">
          <span>Royal Daring HC</span>
          <strong>CASE FILE OPEN</strong>
        </div>
        <div className="daring-intro__scan" />
      </div>

      {/* ── HEADER ── */}
      <header className="daring-enter daring-enter--header relative z-20 h-11 flex items-center justify-between px-4 md:px-8 border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="flex items-center gap-3 min-w-0">
          <ShieldCheck className="w-4 h-4 shrink-0" style={{ color: R }} />
          <span className="font-tech text-sm font-bold tracking-[0.2em] uppercase" style={{ color: W }}>Royal Daring HC</span>
          <span className="hidden sm:inline text-[10px] font-mono tracking-[0.2em]" style={{ color: G }}>// Since 1922</span>
        </div>
        <nav className="hidden lg:flex items-center gap-1">
          {[
            ["Problem", "daring-problem"],
            ["Website", "daring-website"],
            ["Build", "daring-build"],
            ["Brand", "daring-brand"],
            ["Brochure", "daring-brochure"],
            ["Social", "daring-social"],
          ].map(([label, id]) => (
            <button
              key={id}
              type="button"
              onClick={() => jumpTo(id)}
              className="px-2.5 py-1.5 text-[9px] font-mono uppercase tracking-[0.18em] text-white/38 transition-colors hover:text-white/75"
            >
              {label}
            </button>
          ))}
        </nav>
        <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded border border-white/15 bg-white/5 hover:bg-white/10 transition-colors" aria-label="Close">
          <X className="w-4 h-4 text-white/70" />
        </button>
      </header>

      <div ref={scrollRef} className="relative z-10 h-[calc(100vh-2.75rem)] overflow-y-auto">

        {/* ━━━━━━━━━━ HERO — FULL BLEED ━━━━━━━━━━ */}
        <section className="daring-hero relative min-h-[90vh] flex items-end overflow-hidden">
          <Image src={`${V}/img/hero.jpg`} alt="Terrain de Wemmel" fill className="daring-hero__image object-cover" priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />
          <div className="absolute inset-0 opacity-15" style={{ backgroundImage: `linear-gradient(${R}44 1px, transparent 1px), linear-gradient(90deg, ${R}44 1px, transparent 1px)`, backgroundSize: "48px 48px" }} />
          <div className="daring-hero__sweep absolute inset-0 pointer-events-none" />

          <div className="daring-hero__content relative w-full max-w-7xl mx-auto px-5 md:px-10 pb-10 md:pb-16">
            <div className="daring-stagger daring-stagger--1 flex flex-wrap items-center gap-2 mb-6">
              <span className="text-[10px] font-mono font-bold tracking-[0.25em] uppercase px-3 py-1.5 border" style={{ color: G, borderColor: `${G}66`, background: `${BK}cc` }}>ISA Master Internship</span>
              <span className="text-[10px] font-mono font-bold tracking-[0.25em] uppercase px-3 py-1.5 border" style={{ color: W, borderColor: `${R}80`, background: `${R}22` }}>Communication & Sponsoring</span>
            </div>
            <p className="daring-stagger daring-stagger--2 text-xs md:text-sm font-mono uppercase tracking-[0.4em] mb-4" style={{ color: G }}>Royal Daring Club de Molenbeek</p>
            <h2 className="daring-stagger daring-stagger--3 font-tech text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-wide leading-[0.95]" style={{ color: W }}>
              Professionalizing<br />brand image & sponsorship
            </h2>
            <p className="daring-stagger daring-stagger--4 mt-6 max-w-2xl text-sm md:text-base leading-relaxed text-white/70">
              I turned a local hockey club's fragmented communication into a sponsor-ready digital acquisition system.
            </p>

            <div className="daring-stagger daring-stagger--5 mt-6 flex flex-wrap gap-2">
              <AssetLink href={LIVE_SITE} label="View live website" icon={ExternalLink} />
              <AssetLink href={`${V}/Royal_Daring_Partenaires_2025-26.pdf`} label="PDF brochure" icon={Download} />
            </div>

            {/* Stats strip */}
            <div className="daring-stagger daring-stagger--6 flex flex-wrap gap-6 md:gap-10 mt-8">
              {[
                { v: "1922", l: "Founded" }, { v: "19", l: "Teams" }, { v: "30+", l: "Visuals" },
                { v: "FR/NL", l: "Bilingual" }, { v: "9p", l: "Brochure" },
              ].map(s => (
                <div key={s.l}>
                  <span className="block text-2xl md:text-3xl font-mono font-bold" style={{ color: G }}>{s.v}</span>
                  <span className="block text-[9px] font-mono uppercase tracking-[0.2em] text-white/40 mt-1">{s.l}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ━━━━━━━━━━ PULL QUOTE — PROBLEM STATEMENT ━━━━━━━━━━ */}
        <section id="daring-problem" className="relative py-16 md:py-24 px-5 md:px-10 overflow-hidden scroll-mt-12">
          <div className="absolute top-0 left-0 w-1 h-full" style={{ background: R }} />
          <div className="max-w-5xl mx-auto">
            <p className="text-[10px] font-mono uppercase tracking-[0.4em] mb-6" style={{ color: R }}>Problem statement</p>
            <blockquote className="font-tech text-2xl md:text-4xl lg:text-5xl font-bold leading-tight" style={{ color: W }}>
              How can an amateur club professionalize its image and funding with limited human and financial resources?
            </blockquote>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-10">
              {[
                ["Context", "19 teams, from youth squads to senior sides, with a strong local footprint."],
                ["Gap", "No structured visual identity, no sponsorship material, no institutional LinkedIn presence."],
                ["System", "Brand guidelines, website, brochure, and social templates designed to work together."],
              ].map(([title, body]) => (
                <div key={title} className="border p-4" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)" }}>
                  <h3 className="text-[10px] font-mono uppercase tracking-[0.25em] mb-2" style={{ color: G }}>{title}</h3>
                  <p className="text-sm leading-relaxed text-white/55">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ━━━━━━━━━━ BEFORE / AFTER — TRANSFORMATION ━━━━━━━━━━ */}
        <section className="px-5 md:px-10 pb-16">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 items-stretch">
            <div className="border p-6" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)" }}>
              <p className="text-[10px] font-mono uppercase tracking-[0.35em] mb-5" style={{ color: R }}>Before</p>
              <div className="space-y-3">
                {["Fragmented visual communication", "No sponsor-ready digital surface", "No structured partner argument", "No reusable production workflow"].map(s => (
                  <div key={s} className="flex items-center gap-3 text-sm text-white/52">
                    <span className="h-px w-5" style={{ background: R }} />
                    {s}
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-center px-3">
              <span className="text-2xl font-mono" style={{ color: G }}>→</span>
            </div>
            <div className="border p-6" style={{ borderColor: `${G}40`, background: `${G}08` }}>
              <p className="text-[10px] font-mono uppercase tracking-[0.35em] mb-5" style={{ color: G }}>After</p>
              <div className="space-y-3">
                {["Live bilingual sponsor website", "Complete brand guidelines", "Programmatic PDF brochure", "Reusable social and signage templates"].map(s => (
                  <div key={s} className="flex items-center gap-3 text-sm text-white/62">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" style={{ color: G }} />
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ━━━━━━━━━━ PARTNER WEBSITE — FULL WIDTH IMAGE + OVERLAY ━━━━━━━━━━ */}
        <section id="daring-website" className="relative h-[70vh] min-h-[500px] overflow-hidden scroll-mt-12">
          <Image src={`${V}/img/sponsor-terrain.jpg`} alt="Pitch-side partner visibility" fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${BK}ee 0%, ${BK}cc 40%, transparent 70%)` }} />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-5 md:px-10 w-full">
              <div className="max-w-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-5 h-5" style={{ color: G }} />
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em]" style={{ color: G }}>Partner website</span>
                </div>
                <h2 className="font-tech text-3xl md:text-5xl font-bold uppercase leading-tight" style={{ color: W }}>
                  From sponsorship deck to conversion website
                </h2>
                <p className="text-sm text-white/60 mt-4 leading-relaxed">
                  A bilingual FR/NL website designed as a sponsor acquisition tool: audiences, visibility assets, CSR patronage, Business Club narrative, and direct contact flow in one clear experience.
                </p>
                <div className="flex flex-wrap gap-2 mt-6">
                  <AssetLink href={LIVE_SITE} label="Live website" icon={ExternalLink} />
                  <AssetLink href={`${V}/index.html`} label="FR archive" icon={ExternalLink} />
                  <AssetLink href={`${V}/Royal_Daring_Partenaires_2025-26.pdf`} label="PDF brochure" icon={Download} />
                </div>
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {["Live Netlify deploy", "FR/NL structure", "Sponsor funnel", "CSR patronage", "Business Club"].map(s => (
                    <span key={s} className="text-[9px] font-mono px-2 py-1 uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.06)" }}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ━━━━━━━━━━ SPONSOR FUNNEL ━━━━━━━━━━ */}
        <section className="py-14 px-5 md:px-10" style={{ background: BK }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-2 h-12" style={{ background: R }} />
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.35em] mb-2" style={{ color: R }}>Sponsor funnel</p>
                <h2 className="font-tech text-2xl md:text-4xl font-bold uppercase tracking-[0.1em]" style={{ color: W }}>Each asset has a job</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {[
                ["Awareness", "Social visuals", "Make the club visible and recognizable."],
                ["Credibility", "Brand system", "Create consistency across every touchpoint."],
                ["Offer", "Website + brochure", "Turn sponsor packages into a clear value proposition."],
                ["Contact", "Live deployment", "Give prospects a direct path to act."],
              ].map(([stage, asset, job], index) => (
                <div key={stage} className="relative border p-5 min-h-[160px]" style={{ borderColor: "rgba(255,255,255,0.1)", background: index === 2 ? `${R}10` : "rgba(255,255,255,0.02)" }}>
                  <span className="text-[10px] font-mono" style={{ color: G }}>0{index + 1}</span>
                  <h3 className="font-tech text-xl uppercase tracking-[0.12em] mt-4" style={{ color: W }}>{stage}</h3>
                  <p className="text-[10px] font-mono uppercase tracking-[0.18em] mt-2" style={{ color: G }}>{asset}</p>
                  <p className="text-sm leading-relaxed text-white/50 mt-4">{job}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ━━━━━━━━━━ LIVE WEBSITE BUILD — FEATURED ━━━━━━━━━━ */}
        <section id="daring-build" className="py-16 md:py-20 px-5 md:px-10 scroll-mt-12" style={{ background: `linear-gradient(180deg, ${BK} 0%, #130608 100%)` }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-2 h-12" style={{ background: G }} />
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.35em] mb-2" style={{ color: G }}>Live web build</p>
                <h2 className="font-tech text-2xl md:text-4xl font-bold uppercase tracking-[0.1em]" style={{ color: W }}>AI-augmented delivery</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_0.65fr] gap-6 lg:gap-8 items-stretch">
              <div className="border overflow-hidden min-h-[360px]" style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.03)" }}>
                <div className="h-10 flex items-center justify-between gap-4 px-4 border-b" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.45)" }}>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: R }} />
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: G }} />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/25" />
                  </div>
                  <span className="min-w-0 truncate text-[10px] font-mono tracking-[0.18em] uppercase text-white/45">{LIVE_SITE.replace("https://", "")}</span>
                  <div className="hidden sm:flex items-center gap-1">
                    {[
                      ["Static", false],
                      ["Interactive", true],
                    ].map(([label, value]) => (
                      <button
                        key={label as string}
                        type="button"
                        onClick={() => setPreviewLoaded(value as boolean)}
                        className="px-2 py-1 text-[8px] font-mono uppercase tracking-[0.16em] transition-colors"
                        style={{
                          color: previewLoaded === value ? BK : "rgba(255,255,255,0.42)",
                          background: previewLoaded === value ? G : "rgba(255,255,255,0.04)",
                        }}
                      >
                        {label as string}
                      </button>
                    ))}
                  </div>
                  <Globe className="w-3.5 h-3.5 shrink-0" style={{ color: G }} />
                </div>
                <div className="relative aspect-[16/10] min-h-[320px] bg-black">
                  {previewLoaded ? (
                    <iframe
                      src={`${V}/index.html`}
                      title="Royal Daring partner website interactive preview"
                      loading="lazy"
                      className="absolute inset-0 h-full w-full"
                    />
                  ) : (
                    <>
                      <Image
                        src={`${B}/sponsor-site-preview.jpg`}
                        alt="Royal Daring sponsor website preview"
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 1024px) 100vw, 65vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <button
                        type="button"
                        onClick={() => setPreviewLoaded(true)}
                        className="absolute bottom-4 left-4 inline-flex items-center gap-2 px-4 py-2.5 border text-[10px] font-mono font-bold uppercase tracking-wider transition-colors hover:bg-white/10"
                        style={{ color: W, borderColor: `${G}66`, background: "rgba(0,0,0,0.72)" }}
                        aria-label="Load interactive sponsor website preview"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        Interactive preview
                      </button>
                    </>
                  )}
                  <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10" />
                </div>
              </div>

              <div className="grid gap-4">
                <div className="border p-6" style={{ borderColor: `${G}33`, background: `${G}08` }}>
                  <Code2 className="w-5 h-5 mb-4" style={{ color: G }} />
                  <h3 className="font-tech text-xl font-bold uppercase tracking-wider" style={{ color: W }}>Built with Claude Code + Codex</h3>
                  <p className="text-sm leading-relaxed text-white/55 mt-4">
                    AI-assisted implementation, directed through product framing, content architecture, visual QA, integration decisions, and final delivery.
                  </p>
                </div>

                <div className="border p-5" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)" }}>
                  <h3 className="text-[10px] font-mono uppercase tracking-[0.28em] mb-3" style={{ color: G }}>My role</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {["Product direction", "Brand system", "Prompting & iteration", "Front-end integration", "Visual QA", "Deployment"].map(s => (
                      <span key={s} className="text-[9px] font-mono px-2 py-1 uppercase tracking-wider text-white/50 bg-white/5">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="border p-5" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)" }}>
                  <h3 className="text-[10px] font-mono uppercase tracking-[0.28em] mb-3" style={{ color: G }}>Stack</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {["HTML", "CSS", "JavaScript", "Python", "ReportLab", "Netlify", "Claude Code", "Codex"].map(s => (
                      <span key={s} className="text-[9px] font-mono px-2 py-1 uppercase tracking-wider text-white/50 bg-white/5">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { v: "2", l: "Languages" },
                    { v: "10+", l: "Sections" },
                    { v: "1", l: "Sponsor funnel" },
                  ].map(s => (
                    <div key={s.l} className="border p-4" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
                      <span className="block text-2xl font-mono font-bold" style={{ color: G }}>{s.v}</span>
                      <span className="block text-[9px] font-mono uppercase tracking-[0.16em] text-white/35 mt-1">{s.l}</span>
                    </div>
                  ))}
                </div>

                <div className="border p-5" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)" }}>
                  {["Strategy", "UX structure", "AI-assisted implementation", "Visual QA", "Netlify deployment"].map((step, index) => (
                    <div key={step} className="flex items-center gap-3 py-2 border-b last:border-b-0" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                      <span className="w-6 text-[10px] font-mono" style={{ color: G }}>0{index + 1}</span>
                      <span className="text-xs font-mono uppercase tracking-[0.14em] text-white/55">{step}</span>
                    </div>
                  ))}
                </div>

                <AssetLink href={LIVE_SITE} label="Open live deployment" icon={ExternalLink} />
              </div>
            </div>
          </div>
        </section>

        {/* ━━━━━━━━━━ BRAND GUIDELINES — SHOWCASE ━━━━━━━━━━ */}
        <section id="daring-brand" className="relative py-16 md:py-20 overflow-hidden scroll-mt-12" style={{ background: `linear-gradient(135deg, ${BK} 0%, #1a0a0a 50%, ${BK} 100%)` }}>
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("${B}/logo-DARING.png")`, backgroundSize: "300px", backgroundPosition: "center", backgroundRepeat: "no-repeat" }} />
          <div className="max-w-7xl mx-auto px-5 md:px-10 relative">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-2 h-12" style={{ background: R }} />
              <h2 className="font-tech text-2xl md:text-4xl font-bold uppercase tracking-[0.1em]" style={{ color: W }}>Brand guidelines</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8 items-start">
              {/* Logo */}
              <div className="relative aspect-square border-2 overflow-hidden mx-auto lg:mx-0" style={{ borderColor: `${G}40`, background: `${BK}` }}>
                <Image src={`${B}/logo-DARING.png`} alt="Logo Royal Daring HC" fill className="object-contain p-6" sizes="220px" />
              </div>

              <div className="space-y-8">
                {/* Palette — big swatches */}
                <div className="grid grid-cols-4 gap-0 overflow-hidden border" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                  {[
                    { c: R, n: "Daring Red", h: "#C8102E", r: "Action & impact" },
                    { c: BK, n: "Black", h: "#0D0D0D", r: "Structure" },
                    { c: G, n: "Gold", h: "#C9A84C", r: "Prestige" },
                    { c: W, n: "Off-white", h: "#F4F0E8", r: "Breathing space" },
                  ].map(s => (
                    <div key={s.h} className="flex flex-col">
                      <div className="h-20 md:h-28" style={{ background: s.c }} />
                      <div className="p-3" style={{ background: "rgba(255,255,255,0.03)" }}>
                        <span className="block text-xs font-mono font-bold" style={{ color: W }}>{s.n}</span>
                        <span className="block text-[10px] font-mono text-white/35 mt-0.5">{s.h}</span>
                        <span className="block text-[10px] font-mono text-white/50 mt-1">{s.r}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Typo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border p-5" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)" }}>
                    <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/30">Headlines & posters</span>
                    <p className="text-3xl md:text-4xl mt-2 leading-tight" style={{ fontFamily: "serif", color: W }}>Playfair Display</p>
                    <p className="text-xs font-mono text-white/40 mt-2">High-contrast serif. Bold & Black.</p>
                  </div>
                  <div className="border p-5" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)" }}>
                    <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/30">UI & body copy</span>
                    <p className="text-3xl md:text-4xl mt-2 leading-tight" style={{ fontFamily: "sans-serif", color: W }}>DM Sans</p>
                    <p className="text-xs font-mono text-white/40 mt-2">Geometric sans-serif. Regular, Medium, Bold.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {["Logo", "Colors", "Typography", "Tone", "Templates"].map(s => (
                    <div key={s} className="border p-3 text-center" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)" }}>
                      <span className="text-[9px] font-mono uppercase tracking-[0.18em] text-white/45">{s}</span>
                    </div>
                  ))}
                </div>

                <AssetLink href={`${B}/chartegraphiquedemo.pdf`} label="Download full guidelines" icon={Download} />
              </div>
            </div>
          </div>
        </section>

        {/* ━━━━━━━━━━ SKILLS + BROCHURE — SPLIT ━━━━━━━━━━ */}
        <section id="daring-brochure" className="grid grid-cols-1 md:grid-cols-2 scroll-mt-12">
          <div className="p-8 md:p-12 flex flex-col justify-center" style={{ background: `${R}12` }}>
            <Code2 className="w-5 h-5 mb-4" style={{ color: R }} />
            <h3 className="font-tech text-xl md:text-2xl font-bold uppercase tracking-wider mb-6" style={{ color: W }}>Skills mobilized</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                "Art direction", "Brand identity", "Responsive web design",
                "Vanilla front-end", "Python PDF (ReportLab)", "Social media strategy",
                "FR/NL production", "Design system", "Physical signage",
              ].map(s => (
                <div key={s} className="flex items-center gap-2 text-xs font-mono text-white/60">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0" style={{ color: G }} />
                  {s}
                </div>
              ))}
            </div>
          </div>
          <div className="p-8 md:p-12 flex flex-col justify-center border-l border-white/5" style={{ background: `${G}08` }}>
            <FileText className="w-5 h-5 mb-4" style={{ color: G }} />
            <h3 className="font-tech text-xl md:text-2xl font-bold uppercase tracking-wider mb-4" style={{ color: W }}>Brochure PDF</h3>
            <p className="text-sm leading-relaxed text-white/55">
              9 pages generated programmatically in Python with ReportLab. The club can update figures and content without desktop publishing software: edit the data, rerun the script.
            </p>
            <div className="flex items-center gap-4 mt-6">
              {[
                { v: "9", l: "Pages" }, { v: "Python", l: "ReportLab" }, { v: "Auto", l: "Updates" },
              ].map(s => (
                <div key={s.l}>
                  <span className="block text-lg font-mono font-bold" style={{ color: G }}>{s.v}</span>
                  <span className="block text-[9px] font-mono uppercase tracking-wider text-white/35">{s.l}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ━━━━━━━━━━ VISUAL ADAPTATIONS — BENTO GALLERY ━━━━━━━━━━ */}
        <section id="daring-social" className="py-16 md:py-20 px-5 md:px-10 scroll-mt-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-2 h-12" style={{ background: R }} />
              <h2 className="font-tech text-2xl md:text-4xl font-bold uppercase tracking-[0.1em]" style={{ color: W }}>Visual adaptations</h2>
            </div>
            <p className="text-sm text-white/50 mb-12 max-w-2xl ml-6">
              Every visual fits inside the brand system. The goal: enable a volunteer to produce a new asset without breaking brand consistency.
            </p>

            {/* ── BENTO ROW 1 : Weekend recap (4 slides) + label ── */}
            <div className="mb-4">
              <Label icon={Repeat} text="Social media — Weekend recap" sub="Weekly Instagram carousel published every Monday. Cover, team-by-team results, global recap." />
            </div>
            <div className="grid grid-cols-6 md:grid-cols-12 gap-3 mb-12">
              <div className="col-span-3 relative aspect-[4/5] overflow-hidden group" style={{ background: BK }}>
                <Image src={`${B}/recap%20du%20weekend/1.png`} alt="Recap cover" fill className="object-contain group-hover:scale-105 transition-transform duration-500" sizes="25vw" />
              </div>
              <div className="col-span-3 relative aspect-[4/5] overflow-hidden group" style={{ background: BK }}>
                <Image src={`${B}/recap%20du%20weekend/2.png`} alt="Men's recap" fill className="object-contain group-hover:scale-105 transition-transform duration-500" sizes="25vw" />
              </div>
              <div className="col-span-3 relative aspect-[4/5] overflow-hidden group" style={{ background: BK }}>
                <Image src={`${B}/recap%20du%20weekend/3.png`} alt="Women's recap" fill className="object-contain group-hover:scale-105 transition-transform duration-500" sizes="25vw" />
              </div>
              <div className="col-span-3 relative aspect-[4/5] overflow-hidden group" style={{ background: BK }}>
                <Image src={`${B}/recap%20du%20weekend/4.png`} alt="19-team recap" fill className="object-contain group-hover:scale-105 transition-transform duration-500" sizes="25vw" />
              </div>
            </div>

            {/* ── BENTO ROW 2 : Final poster (large) + score story + T-shirt ── */}
            <div className="mb-4">
              <Label icon={CalendarDays} text="Events & match day" sub="Playoff posters, real-time stories, merchandising." />
            </div>
            <div className="grid grid-cols-12 gap-3 mb-12">
              <div className="col-span-12 md:col-span-5 relative aspect-[4/5] overflow-hidden group border" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <Image src={`${B}/affiche_final.png`} alt="Playoff final poster" fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 42vw" />
              </div>
              <div className="col-span-6 md:col-span-3 relative aspect-[9/16] overflow-hidden group border" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <Image src={`${B}/story%20match/H1/score_final.png`} alt="Story score final" fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="25vw" />
                <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em]" style={{ color: G }}>Story match day</span>
                </div>
              </div>
              <div className="col-span-6 md:col-span-4 relative aspect-[4/5] overflow-hidden group border" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <Image src={`${B}/tshirt_playoffs.png`} alt="T-shirt playoffs" fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="33vw" />
                <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em]" style={{ color: G }}>Merchandising</span>
                </div>
              </div>
            </div>

            {/* ── BENTO ROW 3 : Camp FR/NL + portrait ── */}
            <div className="mb-4">
              <Label icon={Languages} text="Bilingual FR/NL & templates" sub="Each visual exists in French and Dutch. Templates are reusable by volunteers." />
            </div>
            <div className="grid grid-cols-12 gap-3 mb-12">
              <div className="col-span-6 md:col-span-4 relative aspect-[4/5] overflow-hidden group border" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <Image src={`${B}/stage_ete_fr.png`} alt="Summer camp FR" fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="33vw" />
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-mono font-bold tracking-[0.2em] px-2 py-1" style={{ color: G, background: `${BK}dd` }}>FR</span>
                </div>
              </div>
              <div className="col-span-6 md:col-span-4 relative aspect-[4/5] overflow-hidden group border" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <Image src={`${B}/stage_ete_nl.png`} alt="Summer camp NL" fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="33vw" />
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-mono font-bold tracking-[0.2em] px-2 py-1" style={{ color: G, background: `${BK}dd` }}>NL</span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-4 relative aspect-[4/5] overflow-hidden group border" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <Image src={`${B}/portrait.png`} alt="Player portrait template" fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="33vw" />
                <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em]" style={{ color: G }}>Template portrait</span>
                </div>
              </div>
            </div>

            {/* ── BENTO ROW 4 : Signage — masonry ── */}
            <div className="mb-4">
              <Label icon={Signpost} text="Club signage" sub="Physical brand communication, not just utilitarian signage. Every piece is bilingual." />
            </div>
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-6 md:col-span-3 relative aspect-[3/4] overflow-hidden group border" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <Image src={`${B}/info_general_zonefumeur.jpg`} alt="Smoking area" fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="25vw" />
              </div>
              <div className="col-span-6 md:col-span-3 relative aspect-[3/4] overflow-hidden group border" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <Image src={`${B}/info_general_chien.png`} alt="Dogs on leash" fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="25vw" />
              </div>
              <div className="col-span-6 md:col-span-3 relative aspect-[3/4] overflow-hidden group border" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <Image src={`${B}/info_general_cartsnack.png`} alt="Snack menu" fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="25vw" />
              </div>
              <div className="col-span-6 md:col-span-3 relative aspect-[3/4] overflow-hidden group border" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <Image src={`${B}/info_general_portecuisine.png`} alt="Daring is Cooking" fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="25vw" />
              </div>
            </div>
          </div>
        </section>

        {/* ━━━━━━━━━━ FOOTER STRIP ━━━━━━━━━━ */}
        <footer className="border-t border-white/10 py-6 px-5 md:px-10">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4" style={{ color: R }} />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">Royal Daring Club de Molenbeek // Since 1922</span>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/25">ISA Master Internship 2025-26</span>
          </div>
        </footer>

      </div>
    </div>
  )
}

/* ── Small components ── */

function Label({ icon: Icon, text, sub }: { icon: typeof Target; text: string; sub: string }) {
  return (
    <div className="flex items-start gap-3 ml-1">
      <Icon className="w-4 h-4 mt-0.5 shrink-0" style={{ color: G }} />
      <div>
        <h3 className="text-sm md:text-base font-tech font-bold uppercase tracking-[0.1em]" style={{ color: W }}>{text}</h3>
        <p className="text-xs font-mono text-white/40 mt-1">{sub}</p>
      </div>
    </div>
  )
}

function AssetLink({ href, label, icon: Icon }: { href: string; label: string; icon: typeof ExternalLink }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2.5 border text-[10px] font-mono font-bold uppercase tracking-wider transition-colors hover:bg-white/10"
      style={{ color: W, borderColor: `${G}55`, background: "rgba(255,255,255,0.04)" }}>
      <Icon className="w-3.5 h-3.5" />{label}
    </a>
  )
}
