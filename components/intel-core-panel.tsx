"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  X,
  Brain,
  Rss,
  Database,
  Cpu,
  Layers,
  ExternalLink,
  Github,
  Globe,
  Zap,
  Filter,
  BarChart3,
  Clock,
  ArrowDown,
  CheckCircle2,
  Satellite,
  Unlock,
  FlaskConical,
} from "lucide-react"
import Link from "next/link"
import { useIsMobile } from "@/hooks/use-mobile"

/* ================================================================
   INTEL CORE PANEL  -  Intelligence pipeline immersive view
   ================================================================ */

interface IntelCorePanelProps {
  open: boolean
  onClose: () => void
}

/* ---------- Animated counter ---------- */
function useCountUp(end: number, dur: number, start: boolean, suffix = "") {
  const [val, setVal] = useState("0")
  useEffect(() => {
    if (!start) { setVal("0"); return }
    let raf: number
    const t0 = performance.now()
    const tick = (now: number) => {
      const elapsed = now - t0
      const p = Math.min(elapsed / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(end * eased).toLocaleString() + suffix)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [end, dur, start, suffix])
  return val
}

/* ---------- Telegram channels ---------- */
const CHANNELS = [
  { label: "Bloomberg",       domain: "Finance · Markets" },
  { label: "SCMP",            domain: "Asia · Geopolitics" },
  { label: "BBC Breaking",    domain: "World News" },
  { label: "Reuters World",   domain: "International" },
  { label: "Politico Europe", domain: "Europe · Politics" },
  { label: "Al Jazeera EN",  domain: "Middle East · Global" },
  { label: "Clash Report",    domain: "Conflicts" },
  { label: "Our Wars Today",  domain: "Conflicts" },
  { label: "Intel Slava",     domain: "Conflicts", bias: "PRO-RUSSIAN ⚠" },
]

type PipelineSplit = {
  label: string
  color: string
  border: string
  bg: string
}

type PipelineNode = {
  id: string
  label: string
  sub: string
  icon: React.ElementType
  color: string
  border: string
  bg: string
  badge?: string
  showRoster?: boolean
  split?: PipelineSplit[]
}

/* ---------- Pipeline node types ---------- */
const PIPELINE_NODES: PipelineNode[] = [
  {
    id: "cron",
    label: "GitHub Actions",
    sub: "Archived schedule — daily 18:00 Paris build documented",
    icon: Clock,
    color: "hsl(var(--neon-cyan))",
    border: "border-[hsl(var(--neon-cyan))]/30",
    bg: "bg-[hsl(var(--neon-cyan))]/5",
    badge: "ARCHIVED",
  },
  {
    id: "crawler",
    label: "Telegram Crawler",
    sub: "telegram_veille.py — Telethon API",
    icon: Satellite,
    color: "hsl(var(--neon-cyan))",
    border: "border-[hsl(var(--neon-cyan))]/30",
    bg: "bg-[hsl(var(--neon-cyan))]/5",
  },
  {
    id: "channels",
    label: "Channel Aggregation",
    sub: "9 sources — messages since midnight Paris time",
    icon: Rss,
    color: "hsl(var(--foreground))",
    border: "border-foreground/20",
    bg: "bg-foreground/5",
    showRoster: true,
  },
  {
    id: "filter",
    label: "AI Top-10 Selector",
    sub: "OpenRouter → Gemini 2.0 Flash",
    icon: Filter,
    color: "hsl(var(--neon-cyan))",
    border: "border-[hsl(var(--neon-cyan))]/30",
    bg: "bg-[hsl(var(--neon-cyan))]/5",
    badge: "AI PASS",
  },
  {
    id: "notion",
    label: "Notion Database",
    sub: "Auto-rotation — max 100 entries — indexed & categorized",
    icon: Database,
    color: "hsl(var(--neon-cyan))",
    border: "border-[hsl(var(--neon-cyan))]/30",
    bg: "bg-[hsl(var(--neon-cyan))]/5",
  },
  {
    id: "dash",
    label: "Intelligence Dashboard",
    sub: "Next.js // intel-dashboard-telegram.netlify.app",
    icon: BarChart3,
    color: "hsl(var(--alert-orange))",
    border: "border-accent/30",
    bg: "bg-accent/5",
  },
]

/* ---------- Stats ---------- */
const STATS = [
  { label: "TELEGRAM CHANNELS", value: 9, suffix: "", color: "text-[hsl(var(--neon-cyan))]" },
  { label: "CATEGORIES", value: 8, suffix: "", color: "text-primary" },
  { label: "DAILY TOP", value: 10, suffix: "", color: "text-[hsl(var(--field-green))]" },
  { label: "STATUS", value: 1, suffix: "x", color: "text-[hsl(var(--neon-cyan))]", text: "ARCHIVE" },
]

/* ---- Archive context — what the shipped pipeline proves ---- */
const ARCHIVE_PIPELINE_STATE = [
  { k: "Codebase", v: "Intact — no regression" },
  { k: "Cron schedule", v: "Documented automation path" },
  { k: "Notion database", v: "Frozen demo snapshot" },
  { k: "Dashboard", v: "Still online — read-only archive" },
]

const R_AND_D_FOCUS = [
  { k: "Model", v: "Qwen3 27B (open weights)" },
  { k: "Task", v: "Sport-management fine-tuning" },
  { k: "Scope", v: "Dataset curation · LoRA training · eval" },
  { k: "Status", v: "Active R&D" },
]

export function IntelCorePanel({ open, onClose }: IntelCorePanelProps) {
  const isMobile = useIsMobile()
  const [phase, setPhase] = useState<"intro" | "main">("intro")
  const [introStep, setIntroStep] = useState(0)
  const [mainReady, setMainReady] = useState(false)
  const [activePipe, setActivePipe] = useState(-1)
  const scrollRef = useRef<HTMLDivElement>(null)
  const hasPlayedIntro = useRef(false)
  const isMobileRef = useRef(isMobile)
  isMobileRef.current = isMobile

  /* Reset on close */
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setPhase("intro")
        setIntroStep(0)
        setMainReady(false)
        setActivePipe(-1)
      }, 400)
      return () => clearTimeout(t)
    }
    // Scroll to top on open
    if (scrollRef.current) scrollRef.current.scrollTop = 0
  }, [open])

  /* Intro sequence - Mobile: 1.2s / Desktop: 3.2s */
  useEffect(() => {
    if (!open || phase !== "intro") return

    // Skip intro on re-opens
    if (hasPlayedIntro.current) {
      setPhase("main")
      setTimeout(() => setMainReady(true), 100)
      return
    }

    hasPlayedIntro.current = true
    const timings = isMobileRef.current
      ? [80, 300, 600, 900, 1200]
      : [200, 800, 1600, 2400, 3200]

    const timers = [
      setTimeout(() => setIntroStep(1), timings[0]),
      setTimeout(() => setIntroStep(2), timings[1]),
      setTimeout(() => setIntroStep(3), timings[2]),
      setTimeout(() => setIntroStep(4), timings[3]),
      setTimeout(() => {
        setPhase("main")
        setTimeout(() => setMainReady(true), 100)
      }, timings[4]),
    ]
    return () => timers.forEach(clearTimeout)
  }, [open, phase])

  /* Pipeline cascade animation */
  useEffect(() => {
    if (!mainReady) return
    const timers = PIPELINE_NODES.map((_, i) =>
      setTimeout(() => setActivePipe(i), 600 + i * 350)
    )
    return () => timers.forEach(clearTimeout)
  }, [mainReady])

  /* Escape to close */
  const handleKey = useCallback(
    (e: KeyboardEvent) => { if (e.key === "Escape") onClose() },
    [onClose]
  )
  useEffect(() => {
    if (open) document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [open, handleKey])

  /* Count-up stats */
  const s0 = useCountUp(STATS[0].value, 1400, mainReady, STATS[0].suffix)
  const s1 = useCountUp(STATS[1].value, 1200, mainReady, STATS[1].suffix)
  const s2 = useCountUp(STATS[2].value, 800, mainReady, STATS[2].suffix)
  const s3 = useCountUp(STATS[3].value, 600, mainReady, STATS[3].suffix)
  const statVals = [s0, s1, s2, s3]

  if (!open) return null

  return (
    <div
      className={`fixed inset-0 z-[200] transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/95 backdrop-blur-md" onClick={onClose} />

      {/* ============ INTRO PHASE ============ */}
      {phase === "intro" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 overflow-hidden">
          {/* Channel intake ring — one node per real Telegram source */}
          <div className="relative w-48 h-48 md:w-60 md:h-60 mb-6">
            {/* Core */}
            <div
              className={`absolute inset-0 m-auto w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-[hsl(var(--neon-cyan))]/50 flex items-center justify-center transition-all duration-700 ${introStep >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
              style={{
                boxShadow: introStep >= 2 ? "0 0 40px hsl(186 100% 50% / 0.3), inset 0 0 20px hsl(186 100% 50% / 0.1)" : "none",
              }}
            >
              <Brain
                className="w-7 h-7 md:w-9 md:h-9 text-[hsl(var(--neon-cyan))]"
                style={{ filter: introStep >= 2 ? "drop-shadow(0 0 10px hsl(186 100% 50%))" : "none" }}
              />
            </div>

            {/* Channel nodes (9 = actual source count) */}
            {CHANNELS.map((ch, i) => {
              const angle = (i / CHANNELS.length) * Math.PI * 2 - Math.PI / 2
              const r = 58
              const x = 50 + (r / 120) * 100 * Math.cos(angle)
              const y = 50 + (r / 120) * 100 * Math.sin(angle)
              return (
                <div
                  key={ch.label}
                  className="absolute w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[hsl(var(--neon-cyan))] transition-all duration-500"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: "translate(-50%, -50%)",
                    opacity: introStep >= 2 ? 1 : 0,
                    transitionDelay: `${i * 55}ms`,
                    boxShadow: introStep >= 3 ? "0 0 8px hsl(186 100% 50%)" : "none",
                  }}
                />
              )
            })}

            {/* Spokes converging — data ingestion toward the core */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
              {CHANNELS.map((ch, i) => {
                const angle = (i / CHANNELS.length) * Math.PI * 2 - Math.PI / 2
                const r = 48
                const ex = 100 + r * Math.cos(angle)
                const ey = 100 + r * Math.sin(angle)
                return (
                  <line
                    key={ch.label}
                    x1={ex}
                    y1={ey}
                    x2="100"
                    y2="100"
                    stroke="hsl(186 100% 50% / 0.18)"
                    strokeWidth="1"
                    strokeDasharray="3 5"
                    className="transition-opacity duration-500"
                    style={{ opacity: introStep >= 3 ? 1 : 0, transitionDelay: `${i * 50}ms` }}
                  />
                )
              })}
            </svg>

            {/* Pulse ring */}
            {introStep >= 3 && (
              <div className="absolute inset-0 m-auto w-16 h-16 md:w-20 md:h-20 rounded-full border border-[hsl(var(--neon-cyan))]/30 animate-[node-ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
            )}
          </div>

          {/* Channel ticker — scrolling feed of live sources */}
          <div
            className="w-56 md:w-72 h-4 overflow-hidden mb-6 transition-opacity duration-500"
            style={{
              opacity: introStep >= 2 ? 1 : 0,
              maskImage: "linear-gradient(90deg, transparent, black 15%, black 85%, transparent)",
              WebkitMaskImage: "linear-gradient(90deg, transparent, black 15%, black 85%, transparent)",
            }}
          >
            <div
              className="flex gap-4 whitespace-nowrap font-mono text-[8px] tracking-[0.15em] text-[hsl(var(--neon-cyan))]/60 w-max"
              style={{ animation: introStep >= 2 ? "marquee-x 9s linear infinite" : "none" }}
            >
              {[...CHANNELS, ...CHANNELS].map((ch, i) => (
                <span key={i}>// {ch.label.toUpperCase()}</span>
              ))}
            </div>
          </div>

          {/* Terminal log — typewriter reveal */}
          <div className="text-center space-y-1.5">
            {[
              { step: 1, text: "INITIALIZING INTELLIGENCE SYSTEM", color: "text-[hsl(var(--neon-cyan))]" },
              { step: 2, text: "CONNECTING TO NOTION DATABASE...", color: "text-muted-foreground" },
              { step: 3, text: "LOADING AI FILTER MODELS // GEMINI 2.0 FLASH", color: "text-muted-foreground" },
              { step: 4, text: "ARCHIVE SNAPSHOT // R&D CONTINUES", color: "text-[hsl(var(--neon-cyan))]" },
            ].map((line) => {
              const active = introStep === line.step
              const shown = introStep >= line.step
              return (
                <div key={line.step} className="h-4 flex items-center justify-center">
                  <span
                    className={`inline-block overflow-hidden whitespace-nowrap font-mono text-[9px] md:text-[10px] tracking-[0.25em] uppercase ${line.color}`}
                    style={{
                      width: shown ? `${line.text.length}ch` : "0ch",
                      transition: `width ${Math.min(0.9, line.text.length * 0.02)}s steps(${line.text.length}, end)`,
                    }}
                  >
                    {line.text}
                  </span>
                  {active && (
                    <span
                      className="inline-block w-[5px] h-[10px] ml-1 bg-[hsl(var(--neon-cyan))]"
                      style={{ animation: "cursor-blink 0.8s step-end infinite" }}
                    />
                  )}
                </div>
              )
            })}
          </div>

          {/* Signal strength meter */}
          <div className="flex items-end gap-1.5 h-5 mt-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="w-2 rounded-sm bg-[hsl(var(--neon-cyan))] transition-all duration-300"
                style={{
                  height: `${n * 22 + 12}%`,
                  opacity: introStep >= n ? 1 : 0.12,
                  boxShadow: introStep >= n ? "0 0 8px hsl(186 100% 50% / 0.6)" : "none",
                }}
              />
            ))}
          </div>

          {/* Skip */}
          <button
            onClick={() => { setPhase("main"); setTimeout(() => setMainReady(true), 100) }}
            className="mt-6 text-[8px] font-mono text-muted-foreground/40 hover:text-muted-foreground transition-colors tracking-[0.3em] uppercase"
          >
            SKIP INIT
          </button>
        </div>
      )}

      {/* ============ MAIN PHASE ============ */}
      {phase === "main" && (
        <div
          className={`absolute inset-0 flex flex-col z-10 transition-opacity duration-700 ${mainReady ? "opacity-100" : "opacity-0"}`}
        >
          {/* Header */}
          <header className="h-11 flex items-center justify-between px-4 md:px-8 border-b border-[hsl(var(--neon-cyan))]/20 bg-card/40 backdrop-blur-xl shrink-0">
            <div className="flex items-center gap-4">
              <Brain className="w-4 h-4 text-[hsl(var(--neon-cyan))]" style={{ filter: "drop-shadow(0 0 6px hsl(186 100% 50%))" }} />
              <div className="flex items-center gap-2">
                <span className="font-tech text-sm md:text-base text-foreground tracking-[0.15em]">INTEL CORE</span>
                <span className="flex items-center gap-1 text-[8px] font-mono border border-[hsl(var(--neon-cyan))]/50 bg-[hsl(var(--neon-cyan))]/10 text-[hsl(var(--neon-cyan))] px-1.5 py-0.5 rounded tracking-wider">
                  <FlaskConical className="w-2.5 h-2.5" />
                  R&D ARCHIVE
                </span>
                <span className="text-[8px] font-mono bg-[hsl(var(--neon-cyan))]/15 text-[hsl(var(--neon-cyan))] px-1.5 py-0.5 rounded">AI FILTERED</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-4 text-[9px] font-mono text-muted-foreground mr-4">
                <span>DOMAIN: <span className="text-foreground font-bold">Business · Finance · Geopolitics</span></span>
              </div>
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-destructive/10 border border-destructive/30 hover:bg-destructive/20 rounded text-destructive text-[9px] font-mono tracking-[0.15em] transition-all"
              >
                <X className="w-3 h-3" />
                CLOSE
              </button>
            </div>
          </header>

          {/* Scrollable content */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto">
            <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-8 space-y-8 md:space-y-10">

              {/* ---- Status banner: shipped archive + current R&D ---- */}
              <section
                className={`transition-all duration-700 ${mainReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionDelay: "100ms" }}
              >
                <div className="relative overflow-hidden rounded-lg border-2 border-[hsl(var(--neon-cyan))]/35 bg-[hsl(var(--neon-cyan))]/[0.05]">
                  {/* Subtle data stripes */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-[0.06]"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(45deg, hsl(var(--neon-cyan)) 0 10px, transparent 10px 20px)",
                    }}
                  />
                  <div className="absolute left-0 top-0 h-full w-1 bg-[hsl(var(--neon-cyan))]/60" />

                  <div className="relative p-4 md:p-5">
                    {/* Banner header */}
                    <div className="flex flex-wrap items-center gap-2.5 mb-3">
                      <FlaskConical
                        className="w-4 h-4 text-[hsl(var(--neon-cyan))] shrink-0"
                        style={{ filter: "drop-shadow(0 0 6px hsl(var(--neon-cyan) / 0.6))" }}
                      />
                      <span className="font-tech text-sm md:text-base text-[hsl(var(--neon-cyan))] tracking-[0.15em]">
                        SHIPPED PROTOTYPE ARCHIVE
                      </span>
                      <span className="text-[8px] font-mono border border-[hsl(var(--neon-cyan))]/40 text-[hsl(var(--neon-cyan))]/80 px-1.5 py-0.5 rounded tracking-[0.15em]">
                        R&D CONTINUES
                      </span>
                    </div>

                    <p className="text-[10px] md:text-[11px] font-mono text-foreground/70 leading-relaxed max-w-3xl">
                      This project demonstrates the complete intelligence loop: Telegram crawling, AI ranking,
                      Notion storage, dashboard publishing and low-cost automation. The public version now acts
                      as a stable archive while current R&D focuses on sport-management model fine-tuning.
                    </p>

                    {/* Two columns: current state / reassignment */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                      <div className="rounded border border-border/40 bg-card/50 p-3">
                        <h3 className="flex items-center gap-1.5 font-tech text-[11px] text-foreground/80 tracking-[0.15em] mb-2.5">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          ARCHIVE STATE
                        </h3>
                        <ul className="space-y-1.5">
                          {ARCHIVE_PIPELINE_STATE.map((row) => (
                            <li key={row.k} className="flex items-baseline justify-between gap-3">
                              <span className="text-[9px] font-mono text-muted-foreground shrink-0">{row.k}</span>
                              <span className="text-[9px] font-mono text-foreground/70 text-right">{row.v}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded border border-primary/30 bg-primary/[0.04] p-3">
                        <h3 className="flex items-center gap-1.5 font-tech text-[11px] text-primary tracking-[0.15em] mb-2.5">
                          <FlaskConical className="w-3 h-3" />
                          CURRENT R&D
                        </h3>
                        <ul className="space-y-1.5">
                          {R_AND_D_FOCUS.map((row) => (
                            <li key={row.k} className="flex items-baseline justify-between gap-3">
                              <span className="text-[9px] font-mono text-muted-foreground shrink-0">{row.k}</span>
                              <span className="text-[9px] font-mono text-primary/90 text-right">{row.v}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* ---- Stats row ---- */}
              <div
                className={`grid grid-cols-2 md:grid-cols-4 gap-3 transition-all duration-700 ${mainReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionDelay: "200ms" }}
              >
                {STATS.map((s, i) => (
                  <div
                    key={s.label}
                    className="bg-card/60 border border-border/50 rounded-lg p-3 md:p-4 text-center relative overflow-hidden group hover:border-[hsl(var(--neon-cyan))]/30 transition-colors"
                  >
                    <div
                      className={`font-tech font-bold ${s.color} leading-none mb-1 ${
                        "text" in s && s.text ? "text-base md:text-lg pt-1.5 md:pt-2.5" : "text-2xl md:text-3xl"
                      }`}
                    >
                      {"text" in s && s.text ? s.text : statVals[i]}
                    </div>
                    <div className="text-[8px] font-mono text-muted-foreground tracking-[0.2em]">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* ---- Section: Intelligence Gathering Engine ---- */}
              <section
                className={`transition-all duration-700 ${mainReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionDelay: "400ms" }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded border border-[hsl(var(--neon-cyan))]/30 bg-[hsl(var(--neon-cyan))]/5 flex items-center justify-center">
                    <Layers className="w-4 h-4 text-[hsl(var(--neon-cyan))]" />
                  </div>
                  <div>
                    <h2 className="font-tech text-lg md:text-xl text-foreground tracking-[0.1em]">INTELLIGENCE GATHERING ENGINE</h2>
                    <p className="text-[9px] font-mono text-muted-foreground tracking-wider">END-TO-END AUTOMATED PIPELINE</p>
                  </div>
                </div>

                {/* Pipeline visualization */}
                <div className="relative flex flex-col items-center gap-0">
                  {PIPELINE_NODES.map((node, i) => {
                    const isActive = i <= activePipe
                    const isCurrentlyActivating = i === activePipe
                    const Icon = node.icon
                    const hasSplit = "split" in node && node.split

                    return (
                      <div key={node.id} className="flex flex-col items-center w-full max-w-xl">
                        {/* Connector line above (except first) */}
                        {i > 0 && (
                          <div className="flex flex-col items-center py-1.5">
                            <div
                              className="w-px h-6 transition-all duration-500"
                              style={{
                                background: isActive ? "hsl(var(--neon-cyan))" : "hsl(215 25% 22% / 0.4)",
                                boxShadow: isCurrentlyActivating ? "0 0 8px hsl(186 100% 50% / 0.5)" : "none",
                              }}
                            />
                            <ArrowDown
                              className="w-3 h-3 transition-colors duration-500"
                              style={{ color: isActive ? "hsl(var(--neon-cyan))" : "hsl(215 25% 22% / 0.4)" }}
                            />
                          </div>
                        )}

                        {/* Split nodes (two side by side) */}
                        {hasSplit ? (
                          <div className="flex flex-col sm:flex-row w-full gap-2">
                            {node.split!.map((s, si) => (
                              <div
                                key={si}
                                className={`flex-1 border rounded-lg p-3 text-center transition-all duration-700 ${isActive ? s.border + " " + s.bg : "border-border/20 bg-card/30"}`}
                                style={{
                                  opacity: isActive ? 1 : 0.3,
                                  transform: isActive ? "scale(1)" : "scale(0.95)",
                                  transitionDelay: `${si * 100}ms`,
                                }}
                              >
                                <span
                                  className="text-xs font-mono font-bold transition-colors duration-500"
                                  style={{ color: isActive ? s.color : "hsl(215 20% 45%)" }}
                                >
                                  {s.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          /* Single node */
                          <div
                            className={`w-full border rounded-lg p-3 md:p-4 transition-all duration-700 relative overflow-hidden ${isActive ? node.border + " " + node.bg : "border-border/20 bg-card/30"}`}
                            style={{
                              opacity: isActive ? 1 : 0.3,
                              transform: isActive ? "scale(1)" : "scale(0.95)",
                              boxShadow: isCurrentlyActivating ? `0 0 25px ${node.color.replace(")", " / 0.15)")}` : "none",
                            }}
                          >
                            {/* Scan line on activation */}
                            {isCurrentlyActivating && (
                              <div
                                className="absolute left-0 w-full h-px pointer-events-none"
                                style={{
                                  background: `linear-gradient(90deg, transparent, ${node.color}, transparent)`,
                                  animation: "scan-line 1.2s linear infinite",
                                }}
                              />
                            )}

                            <div className="flex items-center gap-3 relative z-10">
                              <div
                                className="w-8 h-8 rounded border flex items-center justify-center shrink-0 transition-all duration-500"
                                style={{
                                  borderColor: isActive ? node.color : "hsl(215 25% 22%)",
                                  background: isActive ? `${node.color.replace(")", " / 0.1)")}` : "transparent",
                                }}
                              >
                                <Icon
                                  className="w-4 h-4 transition-all duration-500"
                                  style={{
                                    color: isActive ? node.color : "hsl(215 20% 45%)",
                                    filter: isCurrentlyActivating ? `drop-shadow(0 0 6px ${node.color})` : "none",
                                  }}
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span
                                    className="text-sm font-tech font-bold tracking-wide transition-colors duration-500"
                                    style={{ color: isActive ? "hsl(var(--foreground))" : "hsl(215 20% 45%)" }}
                                  >
                                    {node.label}
                                  </span>
                                  {"badge" in node && node.badge && (
                                    <span
                                      className="text-[7px] font-mono px-1.5 py-0.5 border rounded tracking-wider transition-all duration-500"
                                      style={{
                                        borderColor: isActive ? node.color : "hsl(215 25% 22%)",
                                        color: isActive ? node.color : "hsl(215 20% 45%)",
                                      }}
                                    >
                                      {node.badge}
                                    </span>
                                  )}
                                  {isActive && i <= activePipe && (
                                    <CheckCircle2
                                      className="w-3 h-3 ml-auto shrink-0 transition-all duration-500"
                                      style={{ color: "hsl(var(--field-green))" }}
                                    />
                                  )}
                                </div>
                                <p
                                  className="text-[9px] font-mono mt-0.5 transition-colors duration-500"
                                  style={{ color: isActive ? "hsl(215 20% 65%)" : "hsl(215 20% 35%)" }}
                                >
                                  {node.sub}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Channel roster */}
                        {"showRoster" in node && node.showRoster && (
                          <div
                            className={`w-full mt-3 grid grid-cols-3 gap-1.5 transition-all duration-700 ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
                            style={{ transitionDelay: "200ms" }}
                          >
                            {CHANNELS.map((ch) => (
                              <div
                                key={ch.label}
                                className={`px-2 py-1.5 rounded border ${ch.bias ? "border-destructive/30 bg-destructive/5" : "border-border/20 bg-card/30"} transition-all duration-500`}
                              >
                                <span className={`text-[9px] font-mono font-bold block ${ch.bias ? "text-destructive/80" : "text-foreground/70"}`}>{ch.label}</span>
                                <span className="text-[8px] font-mono text-muted-foreground block">{ch.domain}</span>
                                {ch.bias && <span className="text-[7px] font-mono text-destructive block mt-0.5">{ch.bias}</span>}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {/* Pipeline completion status */}
                  {activePipe >= PIPELINE_NODES.length - 1 && (
                    <div className="mt-4 flex items-center gap-2 text-[9px] font-mono text-[hsl(var(--neon-cyan))] animate-[fade-slide-in_0.6s_ease_forwards]">
                      <Zap className="w-3 h-3" />
                      <span className="tracking-[0.2em] text-center">PIPELINE DOCUMENTED // PUBLIC ARCHIVE — READY TO REACTIVATE</span>
                    </div>
                  )}
                </div>
              </section>

              {/* ---- Section: Tech Stack ---- */}
              <section
                className={`transition-all duration-700 ${mainReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionDelay: "800ms" }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded border border-primary/30 bg-primary/5 flex items-center justify-center">
                    <Cpu className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-tech text-lg md:text-xl text-foreground tracking-[0.1em]">TECH STACK</h2>
                    <p className="text-[9px] font-mono text-muted-foreground tracking-wider">INFRASTRUCTURE BREAKDOWN</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Crawling */}
                  <div className="bg-card/60 border border-[hsl(var(--neon-cyan))]/20 rounded-lg p-4 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-[hsl(var(--neon-cyan))]/50 via-transparent to-[hsl(var(--neon-cyan))]/10" />
                    <h3 className="font-tech text-sm text-[hsl(var(--neon-cyan))] tracking-wider mb-3">CRAWLING LAYER</h3>
                    <ul className="space-y-2 text-[10px] font-mono text-foreground/70">
                      <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[hsl(var(--neon-cyan))]" />Python 3.11 + Telethon</li>
                      <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[hsl(var(--neon-cyan))]" />GitHub Actions (CRON)</li>
                      <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[hsl(var(--neon-cyan))]" />Telegram API (Telethon)</li>
                      <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[hsl(var(--neon-cyan))]" />9 curated channels</li>
                    </ul>
                  </div>

                  {/* AI Processing */}
                  <div className="bg-card/60 border border-primary/20 rounded-lg p-4 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-primary/50 via-transparent to-primary/10" />
                    <h3 className="font-tech text-sm text-primary tracking-wider mb-3">AI PROCESSING</h3>
                    <ul className="space-y-2 text-[10px] font-mono text-foreground/70">
                      <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-primary" />OpenRouter API Gateway</li>
                      <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-primary" />Google Gemini 2.0 Flash</li>
                      <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-primary" />Top-10 selection engine</li>
                      <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-primary" />Bias-aware ranking</li>
                    </ul>
                  </div>

                  {/* Output */}
                  <div className="bg-card/60 border border-accent/20 rounded-lg p-4 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-accent/50 via-transparent to-accent/10" />
                    <h3 className="font-tech text-sm text-accent tracking-wider mb-3">OUTPUT LAYER</h3>
                    <ul className="space-y-2 text-[10px] font-mono text-foreground/70">
                      <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-accent" />Notion API + DB rotation</li>
                      <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-accent" />Next.js 14 dashboard</li>
                      <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-accent" />Netlify deployment</li>
                      <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-accent" />Real-time intelligence feed</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* ---- CTA Links ---- */}
              <section
                className={`transition-all duration-700 ${mainReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionDelay: "1000ms" }}
              >
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://intel-dashboard-telegram.netlify.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 bg-[hsl(var(--neon-cyan))]/10 border border-[hsl(var(--neon-cyan))]/40 hover:bg-[hsl(var(--neon-cyan))]/20 hover:border-[hsl(var(--neon-cyan))]/60 rounded text-[hsl(var(--neon-cyan))] text-[10px] font-mono font-bold tracking-[0.15em] uppercase transition-all group"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    LIVE DEMO
                    <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </a>
                  <a
                    href="https://github.com/julesmoreau62/sport-business-watch"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 border border-[hsl(var(--neon-cyan))]/30 hover:bg-[hsl(var(--neon-cyan))]/10 rounded text-[hsl(var(--neon-cyan))] text-[10px] font-mono font-bold tracking-[0.15em] uppercase transition-all"
                  >
                    <Github className="w-3.5 h-3.5" />
                    DASHBOARD REPO
                  </a>
                  <a
                    href="https://github.com/julesmoreau62/veille-sport-biz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 border border-border/40 hover:bg-foreground/5 rounded text-foreground/70 text-[10px] font-mono font-bold tracking-[0.15em] uppercase transition-all"
                  >
                    <Github className="w-3.5 h-3.5" />
                    INTEL ENGINE REPO
                  </a>
                </div>

                {/* Declassify Build Process CTA */}
                <div className="mt-6 flex justify-center">
                  <Link
                    href="/intel-core/build-process"
                    className="group relative flex items-center gap-3 px-6 py-3.5 border-2 border-[hsl(var(--neon-cyan))]/50 hover:border-[hsl(var(--neon-cyan))] rounded bg-[hsl(var(--neon-cyan))]/5 hover:bg-[hsl(var(--neon-cyan))]/10 text-[hsl(var(--neon-cyan))] text-xs font-mono font-bold tracking-[0.2em] uppercase transition-all duration-300"
                    style={{
                      boxShadow: "0 0 20px hsl(186 100% 50% / 0.15), inset 0 0 20px hsl(186 100% 50% / 0.05)",
                    }}
                  >
                    {/* Animated glow ring */}
                    <span className="absolute inset-0 rounded border border-[hsl(var(--neon-cyan))]/20 animate-[node-ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
                    <Unlock className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" style={{ filter: "drop-shadow(0 0 6px hsl(186 100% 50%))" }} />
                    <span>{'HOW WAS IT DONE? // DECLASSIFY BUILD PROCESS'}</span>
                    <svg className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </Link>
                </div>
              </section>

              {/* Footer classification */}
              <div
                className={`text-center py-4 border-t border-border/20 transition-all duration-700 ${mainReady ? "opacity-100" : "opacity-0"}`}
                style={{ transitionDelay: "1200ms" }}
              >
                <p className="text-[8px] font-mono text-muted-foreground/40 tracking-[0.3em]">
                  INTEL CORE v2.0 // AI-POWERED INTELLIGENCE SYSTEM // ARCHIVED PUBLIC BUILD
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
