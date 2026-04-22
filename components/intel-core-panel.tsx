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

/* ---------- Pipeline node types ---------- */
const PIPELINE_NODES = [
  {
    id: "cron",
    label: "GitHub Actions",
    sub: "Daily 18:00 Paris (16:00 UTC)",
    icon: Clock,
    color: "hsl(var(--foreground))",
    border: "border-foreground/20",
    bg: "bg-foreground/5",
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
    sub: "Next.js // sport-business-watch.netlify.app",
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
  { label: "DAILY CRON", value: 1, suffix: "x", color: "text-accent" },
]

export function IntelCorePanel({ open, onClose }: IntelCorePanelProps) {
  const isMobile = useIsMobile()
  const [phase, setPhase] = useState<"intro" | "main">("intro")
  const [introStep, setIntroStep] = useState(0)
  const [mainReady, setMainReady] = useState(false)
  const [activePipe, setActivePipe] = useState(-1)
  const scrollRef = useRef<HTMLDivElement>(null)
  const hasPlayedIntro = useRef(false)

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
        setTimeout(() => setMainReady(true), 100)
      }, timings[4]),
    ]
    return () => timers.forEach(clearTimeout)
  }, [open, phase, isMobile])

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
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          {/* Neural network animation */}
          <div className="relative w-48 h-48 md:w-64 md:h-64 mb-8">
            {/* Central brain */}
            <div
              className={`absolute inset-0 m-auto w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-[hsl(var(--neon-cyan))]/50 flex items-center justify-center transition-all duration-700 ${introStep >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
              style={{
                boxShadow: introStep >= 2 ? "0 0 40px hsl(186 100% 50% / 0.3), inset 0 0 20px hsl(186 100% 50% / 0.1)" : "none",
              }}
            >
              <Brain
                className="w-8 h-8 md:w-10 md:h-10 text-[hsl(var(--neon-cyan))]"
                style={{ filter: introStep >= 2 ? "drop-shadow(0 0 10px hsl(186 100% 50%))" : "none" }}
              />
            </div>

            {/* Orbiting data nodes */}
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const angle = (i / 6) * Math.PI * 2 - Math.PI / 2
              const r = 80
              const x = 50 + (r / 128) * 100 * Math.cos(angle)
              const y = 50 + (r / 128) * 100 * Math.sin(angle)
              const colors = [
                "bg-[hsl(var(--neon-cyan))]",
                "bg-primary",
                "bg-[hsl(var(--field-green))]",
                "bg-accent",
                "bg-[hsl(var(--neon-cyan))]",
                "bg-primary",
              ]
              return (
                <div
                  key={i}
                  className={`absolute w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${colors[i]} transition-all duration-500`}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: "translate(-50%, -50%)",
                    opacity: introStep >= 2 ? 1 : 0,
                    transitionDelay: `${i * 100}ms`,
                    boxShadow: introStep >= 3 ? `0 0 12px currentColor` : "none",
                  }}
                />
              )
            })}

            {/* Connection lines (SVG) */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
              {[0, 1, 2, 3, 4, 5].map((i) => {
                const angle = (i / 6) * Math.PI * 2 - Math.PI / 2
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
                    stroke="hsl(186 100% 50% / 0.2)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    className={`transition-opacity duration-500`}
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
              <div className="absolute inset-0 m-auto w-20 h-20 md:w-24 md:h-24 rounded-full border border-[hsl(var(--neon-cyan))]/30 animate-[node-ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
            )}
          </div>

          {/* Text lines */}
          <div className="text-center space-y-2">
            <p
              className={`font-mono text-[10px] text-[hsl(var(--neon-cyan))] tracking-[0.4em] uppercase transition-all duration-500 ${introStep >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              INITIALIZING INTELLIGENCE SYSTEM
            </p>
            <p
              className={`font-mono text-[9px] text-muted-foreground tracking-[0.2em] transition-all duration-500 ${introStep >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              CONNECTING TO NOTION DATABASE...
            </p>
            <p
              className={`font-mono text-[9px] text-muted-foreground tracking-[0.2em] transition-all duration-500 ${introStep >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              LOADING AI FILTER MODELS // GEMINI 2.0 FLASH
            </p>
            <p
              className={`font-mono text-[9px] text-[hsl(var(--field-green))] tracking-[0.2em] transition-all duration-500 ${introStep >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              PIPELINE OPERATIONAL // 9 CHANNELS ACTIVE
            </p>
          </div>

          {/* Loading bar */}
          <div className="w-48 md:w-64 h-0.5 bg-border/30 rounded-full mt-6 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-primary rounded-full transition-all duration-[3000ms] ease-out"
              style={{ width: introStep >= 1 ? "100%" : "0%" }}
            />
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
                <span className="text-[8px] font-mono border border-[hsl(var(--neon-cyan))]/40 text-[hsl(var(--neon-cyan))] px-1.5 py-0.5 rounded">LIVE</span>
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
                    <div className={`text-2xl md:text-3xl font-tech font-bold ${s.color} leading-none mb-1`}>
                      {statVals[i]}
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
                    <div className="mt-4 flex items-center gap-2 text-[9px] font-mono text-[hsl(var(--field-green))] animate-[fade-slide-in_0.6s_ease_forwards]">
                      <Zap className="w-3 h-3" />
                      <span className="tracking-[0.2em]">PIPELINE FULLY OPERATIONAL // ALL NODES GREEN</span>
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
                    href="https://sport-business-watch.netlify.app"
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
                  CLASSIFICATION: OPERATIONAL // INTEL CORE v2.0 // AI-POWERED INTELLIGENCE SYSTEM
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
