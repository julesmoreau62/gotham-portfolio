"use client"

import React from "react"

import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react"
import { Crosshair, Radio, Camera, Brain, Linkedin, Mail, Download } from "lucide-react"
import Image from "next/image"
import { AboutPanel } from "./about-panel"
import { StrategyPanel } from "./strategy-panel"
import { IntelCorePanel } from "./intel-core-panel"
import { FieldOpsPanel } from "./field-ops-panel"
import { SignalPanel } from "./signal-panel"
import { ImageryPanel } from "./imagery-panel"
import { useIsMobile } from "@/hooks/use-mobile"

interface HexModule {
  id: string
  title: string
  subtitle: string
  icon: React.ElementType
  color: string
  glowColor: string
  status: string
  statusType: "critical" | "active" | "online" | "standby" | "intel"
}

const MODULES: HexModule[] = [
  {
    id: "strategy",
    title: "STRATEGY",
    subtitle: "Target: BLAST.tv",
    icon: Crosshair,
    color: "hsl(24 95% 53%)",
    glowColor: "24 95% 53%",
    status: "CRITICAL",
    statusType: "critical",
  },
  {
    id: "events",
    title: "FIELD OPS",
    subtitle: "Event Logistics",
    icon: Radio,
    color: "hsl(186 100% 50%)",
    glowColor: "186 100% 50%",
    status: "ACTIVE",
    statusType: "active",
  },
  {
    id: "comms",
    title: "SIGNAL",
    subtitle: "Digital Activation",
    icon: Radio,
    color: "hsl(217 91% 60%)",
    glowColor: "217 91% 60%",
    status: "ONLINE",
    statusType: "online",
  },
  {
    id: "photo",
    title: "IMAGERY",
    subtitle: "Visual Archives",
    icon: Camera,
    color: "hsl(215 20% 45%)",
    glowColor: "215 20% 45%",
    status: "STANDBY",
    statusType: "standby",
  },
  {
    id: "intel",
    title: "INTEL CORE",
    subtitle: "Sport Biz + Spatial",
    icon: Brain,
    color: "hsl(186 100% 50%)",
    glowColor: "186 100% 50%",
    status: "SCANNING",
    statusType: "intel",
  },
]

/* ---- Priority Tile (large) for INTEL CORE & SIGNAL with stats ---- */
function PriorityTile({
  module,
  index,
  mouseOffset,
  visible,
  onSelect,
  stats,
}: {
  module: HexModule
  index: number
  mouseOffset: { x: number; y: number }
  visible: boolean
  onSelect?: () => void
  stats: { label: string; value: string }[]
}) {
  const Icon = module.icon
  const [hovered, setHovered] = useState(false)

  const parallaxX = mouseOffset.x * 0.03
  const parallaxY = mouseOffset.y * 0.03

  const isIntel = module.statusType === "intel"
  const isOnline = module.statusType === "online"

  return (
    <div
      className="relative group cursor-pointer h-full"
      style={{
        transform: `translate(${parallaxX}px, ${parallaxY}px)`,
        transition: "transform 0.3s cubic-bezier(0.2, 1, 0.3, 1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onSelect?.() }}
    >
      <div
        className={`relative h-full transition-all duration-700 ${visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-90"}`}
        style={{ transitionDelay: `${200 + index * 120}ms` }}
      >
        {/* Always-on ambient glow */}
        <div
          className="absolute -inset-4 rounded-2xl blur-2xl transition-opacity duration-500"
          style={{
            background: `radial-gradient(ellipse at center, hsl(${module.glowColor} / ${hovered ? 0.35 : 0.12}), transparent 70%)`,
          }}
        />

        {/* Main card */}
        <div
          className="relative h-full bg-card/70 backdrop-blur-xl border-2 rounded-xl p-3 md:p-4 overflow-hidden transition-all duration-300"
          style={{
            borderColor: hovered ? module.color : `hsl(${module.glowColor} / 0.35)`,
            boxShadow: hovered
              ? `0 0 50px hsl(${module.glowColor} / 0.25), inset 0 1px 0 hsl(${module.glowColor} / 0.15)`
              : `0 0 20px hsl(${module.glowColor} / 0.08), inset 0 1px 0 hsl(${module.glowColor} / 0.08)`,
          }}
        >
          {/* Persistent scan line (slow) */}
          <div
            className="absolute left-0 w-full h-[1px] pointer-events-none opacity-40"
            style={{
              background: `linear-gradient(90deg, transparent, ${module.color}, transparent)`,
              animation: "scan-line 4s linear infinite",
            }}
          />
          {/* Faster scan on hover */}
          {hovered && (
            <div
              className="absolute left-0 w-full h-[1px] pointer-events-none"
              style={{
                background: `linear-gradient(90deg, transparent, ${module.color}, transparent)`,
                animation: "scan-line 1.2s linear infinite",
              }}
            />
          )}

          {/* Corner accents (always visible) */}
          <div
            className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 rounded-tl-lg transition-colors duration-300"
            style={{ borderColor: hovered ? module.color : `hsl(${module.glowColor} / 0.5)` }}
          />
          <div
            className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 rounded-tr-lg transition-colors duration-300"
            style={{ borderColor: hovered ? module.color : `hsl(${module.glowColor} / 0.5)` }}
          />
          <div
            className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 rounded-bl-lg transition-colors duration-300"
            style={{ borderColor: hovered ? module.color : `hsl(${module.glowColor} / 0.5)` }}
          />
          <div
            className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 rounded-br-lg transition-colors duration-300"
            style={{ borderColor: hovered ? module.color : `hsl(${module.glowColor} / 0.5)` }}
          />

          {/* Background decorative grid lines */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(${module.color} 1px, transparent 1px), linear-gradient(90deg, ${module.color} 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          />

          <div className="flex flex-col h-full relative z-10">
            {/* Header row */}
            <div className="flex items-start gap-3 mb-2">
              {/* Icon block */}
              <div
                className="w-9 h-9 md:w-10 md:h-10 rounded-lg border flex items-center justify-center shrink-0 transition-all duration-300"
                style={{
                  borderColor: `hsl(${module.glowColor} / 0.4)`,
                  background: `hsl(${module.glowColor} / ${hovered ? 0.15 : 0.06})`,
                  boxShadow: hovered ? `0 0 20px hsl(${module.glowColor} / 0.3)` : "none",
                }}
              >
                <Icon
                  className="w-4 h-4 md:w-5 md:h-5 transition-all duration-300"
                  style={{
                    color: module.color,
                    filter: hovered ? `drop-shadow(0 0 10px ${module.color})` : `drop-shadow(0 0 4px hsl(${module.glowColor} / 0.4))`,
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                {/* Status */}
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${isIntel || isOnline ? "bg-[hsl(var(--neon-cyan))] animate-pulse" : "bg-primary animate-pulse"}`} />
                  <span
                    className="text-[10px] font-mono tracking-[0.2em] uppercase font-bold"
                    style={{ color: module.color }}
                  >
                    {module.status} // DEEP ANALYSIS
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="font-tech text-lg md:text-xl font-bold text-foreground leading-none mb-0.5 tracking-wide transition-all duration-300"
                  style={{
                    textShadow: `0 0 ${hovered ? 30 : 12}px hsl(${module.glowColor} / ${hovered ? 0.6 : 0.25})`,
                  }}
                >
                  {module.title}
                </h3>
                <p className="text-[10px] md:text-xs font-mono text-muted-foreground tracking-wider leading-relaxed">
                  {module.subtitle}
                  {isIntel && " // Sport business intelligence & geospatial ops"}
                  {isOnline && " // Social media strategy & community growth"}
                </p>
              </div>

              {/* Arrow indicator */}
              <div
                className="hidden md:flex w-7 h-7 rounded-full border items-center justify-center transition-all duration-300 shrink-0"
                style={{
                  borderColor: `hsl(${module.glowColor} / ${hovered ? 0.6 : 0.2})`,
                  background: hovered ? `hsl(${module.glowColor} / 0.1)` : "transparent",
                }}
              >
                <svg
                  className="w-3 h-3 transition-transform duration-300"
                  style={{
                    color: module.color,
                    transform: hovered ? "translateX(2px)" : "translateX(0)",
                  }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Stats row */}
            <div className="mt-auto pt-2 border-t border-border/30">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                {stats.map((stat, i) => (
                  <div key={i} className="text-center md:text-left">
                    <span
                      className="block text-sm md:text-base font-mono font-bold tabular-nums"
                      style={{ color: module.color }}
                    >
                      {stat.value}
                    </span>
                    <span className="block text-[8px] md:text-[9px] font-mono text-muted-foreground tracking-wider uppercase">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---- Secondary Tile (compact) for STRATEGY, FIELD OPS, IMAGERY ---- */
function SecondaryTile({
  module,
  index,
  mouseOffset,
  visible,
  onSelect,
}: {
  module: HexModule
  index: number
  mouseOffset: { x: number; y: number }
  visible: boolean
  onSelect?: () => void
}) {
  const Icon = module.icon
  const [hovered, setHovered] = useState(false)

  const parallaxX = mouseOffset.x * (0.015 + index * 0.006)
  const parallaxY = mouseOffset.y * (0.015 + index * 0.006)

  const isCritical = module.statusType === "critical"

  const statusDotClass =
    module.statusType === "critical"
      ? "bg-accent animate-pulse"
      : module.statusType === "active"
        ? "bg-[hsl(var(--neon-cyan))] animate-pulse"
        : "bg-muted-foreground/50"

  return (
    <div
      className="relative group cursor-pointer"
      style={{
        transform: `translate(${parallaxX}px, ${parallaxY}px)`,
        transition: "transform 0.3s cubic-bezier(0.2, 1, 0.3, 1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onSelect}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onSelect?.() }}
      role="button"
      tabIndex={0}
    >
      <div
        className={`relative h-full transition-all duration-700 ${visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-90"}`}
        style={{ transitionDelay: `${400 + index * 100}ms` }}
      >
        {/* Glow on hover */}
        <div
          className="absolute -inset-3 rounded-2xl transition-opacity duration-500 blur-xl"
          style={{
            background: `radial-gradient(circle, hsl(${module.glowColor} / 0.25), transparent)`,
            opacity: hovered ? 1 : 0,
          }}
        />

        {/* Card */}
        <div
          className="relative h-full bg-card/60 backdrop-blur-md border rounded-lg p-3 overflow-hidden transition-all duration-300"
          style={{
            borderColor: hovered ? module.color : `hsl(${module.glowColor} / 0.25)`,
            boxShadow: hovered
              ? `0 0 25px hsl(${module.glowColor} / 0.15), inset 0 0 20px hsl(${module.glowColor} / 0.04)`
              : "none",
          }}
        >
          {hovered && (
            <div
              className="absolute left-0 w-full h-[1px] pointer-events-none"
              style={{
                background: `linear-gradient(90deg, transparent, ${module.color}, transparent)`,
                animation: "scan-line 1.5s linear infinite",
              }}
            />
          )}

          {/* Corner accents */}
          <div
            className="absolute top-0 left-0 w-4 h-4 border-t border-l transition-all duration-300"
            style={{ borderColor: hovered ? module.color : `hsl(${module.glowColor} / 0.4)` }}
          />
          <div
            className="absolute bottom-0 right-0 w-4 h-4 border-b border-r transition-all duration-300"
            style={{ borderColor: hovered ? module.color : `hsl(${module.glowColor} / 0.4)` }}
          />

          {/* Status row */}
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${statusDotClass}`} />
              <span
                className="text-[10px] font-mono tracking-[0.2em] uppercase"
                style={{ color: module.color }}
              >
                {module.status}
              </span>
            </div>
            <Icon
              className="w-3 h-3 transition-all duration-300"
              style={{
                color: hovered ? module.color : "hsl(215 20% 45%)",
                filter: hovered ? `drop-shadow(0 0 6px ${module.color})` : "none",
              }}
            />
          </div>

          <h3
            className="font-tech text-base md:text-lg font-bold text-foreground leading-none mb-0.5 tracking-wide transition-all duration-300"
            style={{
              textShadow: hovered ? `0 0 15px hsl(${module.glowColor} / 0.4)` : "none",
            }}
          >
            {module.title}
          </h3>
          <p className="text-[10px] font-mono text-muted-foreground tracking-wider">
            {module.subtitle}
          </p>

          {/* Progress bar for STRATEGY */}
          {isCritical && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-1 bg-accent/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent via-accent/80 to-accent/40 rounded-full transition-all duration-1000"
                  style={{ width: hovered ? "85%" : "73%" }}
                />
              </div>
              <span className="text-[10px] font-mono text-accent font-bold tabular-nums">
                {hovered ? "85%" : "73%"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function HexCommandGrid({ visible }: { visible: boolean }) {
  const isMobile = useIsMobile()
  const containerRef = useRef<HTMLDivElement>(null)
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 })
  const [time, setTime] = useState("")
  // Hash-based section navigation synced with browser history
  type Section = "about" | "strategy" | "intel" | "field-ops" | "signal" | "imagery" | null
  const VALID_SECTIONS = new Set<string>(["about", "strategy", "intel", "field-ops", "signal", "imagery"])

  const readHash = (): Section => {
    if (typeof window === "undefined") return null
    const h = window.location.hash.replace("#", "")
    return VALID_SECTIONS.has(h) ? (h as Section) : null
  }

  const [activeSection, setActiveSection] = useState<Section>(null)


  const openSection = (section: Section) => {
    if (!section) return
    window.history.pushState(null, "", `#${section}`)
    setActiveSection(section)
  }

  const closeSection = () => {
    // Go back in history instead of just clearing, so the browser back stack stays correct
    if (activeSection) {
      window.history.back()
    }
  }

  // Listen for browser back/forward buttons
  useEffect(() => {
    const onHashChange = () => setActiveSection(readHash())
    const onPopState = () => setActiveSection(readHash())

    window.addEventListener("hashchange", onHashChange)
    window.addEventListener("popstate", onPopState)

    // Read initial hash on mount (e.g. direct link to /#strategy)
    setActiveSection(readHash())

    return () => {
      window.removeEventListener("hashchange", onHashChange)
      window.removeEventListener("popstate", onPopState)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      )
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  const handleMouseMove = (e: ReactMouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    setMouseOffset({
      x: (e.clientX - centerX) * 0.1,
      y: (e.clientY - centerY) * 0.1,
    })
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`fixed inset-0 z-10 flex flex-col transition-all duration-1000 ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      {/* Top HUD bar */}
      <header
        className={`h-10 md:h-11 flex items-center justify-between px-3 md:px-8 border-b border-border/50 bg-card/30 backdrop-blur-md z-50 shrink-0 transition-all duration-700 ${visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}
        style={{ transitionDelay: "200ms" }}
      >
        <div className="flex items-center gap-3 md:gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-sm bg-primary animate-pulse" />
            <span className="font-tech font-bold text-foreground tracking-[0.2em] text-sm md:text-base">
              GOTHAM
            </span>
          </div>
          <div className="h-5 w-px bg-border hidden md:block" />
          <span className="text-xs font-mono text-muted-foreground hidden md:inline tracking-wider">
            OP: J.MOREAU // CLEARANCE: LV.4 // NODE: FR-LIL-01
          </span>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Contact links - hidden on mobile, shown in hamburger */}
          <div className="hidden md:flex items-center gap-1.5">
            <a
              href="https://www.linkedin.com/in/jules-moreau-25405b363"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center rounded border border-primary/30 bg-primary/5 hover:bg-primary/20 hover:border-primary/60 transition-all"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="w-4 h-4 text-primary" />
            </a>
            <a
              href="mailto:jules.moreau1@outlook.com"
              className="w-9 h-9 flex items-center justify-center rounded border border-[hsl(var(--field-green))]/30 bg-[hsl(var(--field-green))]/5 hover:bg-[hsl(var(--field-green))]/20 transition-all"
              aria-label="Send Email"
            >
              <Mail className="w-4 h-4 text-[hsl(var(--field-green))]" />
            </a>
            <a
              href="/assets/cv-julesmoreau.pdf"
              download
              className="w-9 h-9 flex items-center justify-center rounded border border-accent/30 bg-accent/5 hover:bg-accent/20 transition-all"
              aria-label="Download CV"
            >
              <Download className="w-4 h-4 text-accent" />
              <span className="text-xs font-mono text-accent ml-1">CV</span>
            </a>
          </div>

          <div className="h-5 w-px bg-border hidden md:block" />

          {/* Live badge */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-destructive/10 border border-destructive/30">
            <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
            <span className="text-xs font-mono text-destructive font-bold tracking-wider">LIVE</span>
          </div>

          {/* Clock */}
          <span className="text-xs font-mono text-muted-foreground tabular-nums hidden md:inline">
            {time}
          </span>
        </div>
      </header>

      {/* Main content area - scrollable on mobile */}
      <main className="flex-1 flex flex-col items-center px-3 md:px-4 py-3 md:py-4 overflow-y-auto overflow-x-hidden">
        {/* Compact identity block - clickable to open About */}
        <button
          type="button"
          onClick={() => openSection("about")}
          className={`text-center mb-3 md:mb-4 transition-all duration-1000 group cursor-pointer ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: "100ms" }}
          aria-label="Open agent profile dossier"
        >
          {/* Avatar ring - smaller on mobile */}
          <div className="relative inline-flex items-center justify-center mb-2 md:mb-3">
            {/* Outer rotating ring */}
            <div
              className="absolute w-16 h-16 md:w-24 md:h-24 rounded-full border border-dashed border-primary/20 group-hover:border-primary/50 transition-colors duration-500"
              style={{ animation: "orbit-spin 20s linear infinite" }}
            >
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary shadow-[0_0_10px_hsl(217_91%_60%)]" />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-[hsl(var(--neon-cyan))] shadow-[0_0_10px_hsl(186_100%_50%)]" />
            </div>

            {/* Core circle */}
            <div className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-muted border-2 border-primary/50 group-hover:border-primary group-hover:shadow-[0_0_60px_hsl(217_91%_60%/0.5)] flex items-center justify-center relative shadow-[0_0_40px_hsl(217_91%_60%/0.3)] transition-all duration-500 overflow-hidden">
              <Image 
                src="/assets/photo-cv.jpg" 
                alt="Jules Moreau"
                width={80}
                height={80}
                className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                priority
              />
              {/* Censorship bar at eyes level */}
              <div className="absolute top-[20%] left-0 right-0 h-[18%] bg-black flex items-center justify-center z-10">
                <span className="text-[5px] md:text-[6px] font-mono font-bold text-white tracking-[0.15em] uppercase">
                  CONFIDENTIAL
                </span>
              </div>
              {/* Ping */}
              <div className="absolute inset-0 rounded-full border border-primary/30 animate-node-ping" />
            </div>
          </div>

          <h1 className="font-tech text-lg md:text-2xl lg:text-3xl font-bold text-foreground tracking-[0.15em] mb-0.5 group-hover:text-primary transition-colors duration-300">
            JULES MOREAU
          </h1>
          <p className="font-mono text-[10px] md:text-xs text-primary tracking-[0.3em]">
            M1 STAPS ISA
          </p>
          {/* Tagline hidden on mobile */}
          <p className="hidden md:block font-mono text-xs text-muted-foreground mt-1.5 max-w-md mx-auto leading-relaxed group-hover:text-muted-foreground/80 transition-colors">
            Operative specialized in sport management, event logistics,
            digital communication & competitive intelligence.
          </p>
          <span className="hidden md:inline-block mt-1 text-xs font-mono text-primary/0 group-hover:text-primary/60 transition-all duration-300 tracking-[0.2em]">
            [ CLICK TO OPEN DOSSIER ]
          </span>
        </button>

        {/* Module grid: 2 rows on desktop, stacked + scroll on mobile */}
        <div className="w-full max-w-5xl flex flex-col gap-4 flex-1 min-h-0">
          {/* Row 1: Priority cards (INTEL CORE + SIGNAL) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* INTEL CORE */}
            <PriorityTile
              module={MODULES[4]}
              index={0}
              mouseOffset={mouseOffset}
              visible={visible}
              onSelect={() => openSection("intel")}
              stats={[
                { value: "35+", label: "RSS SOURCES" },
                { value: "6", label: "GEO REGIONS" },
                { value: "2", label: "AI PASSES" },
                { value: "1x", label: "DAILY CRON" },
              ]}
            />

            {/* SIGNAL */}
            <PriorityTile
              module={MODULES[2]}
              index={1}
              mouseOffset={mouseOffset}
              visible={visible}
              onSelect={() => openSection("signal")}
              stats={[
                { value: "1.0M", label: "REACH" },
                { value: "+93.8%", label: "ENGAGEMENT" },
                { value: "+28.2%", label: "GROWTH" },
                { value: "+467%", label: "CTR" },
              ]}
            />
          </div>

          {/* Row 2: Secondary cards (STRATEGY, FIELD OPS, IMAGERY) */}
          {/* On mobile: vertical stack, on desktop: 3-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {/* STRATEGY */}
            <SecondaryTile
              module={MODULES[0]}
              index={0}
              mouseOffset={mouseOffset}
              visible={visible}
              onSelect={() => openSection("strategy")}
            />

            {/* FIELD OPS */}
            <SecondaryTile
              module={MODULES[1]}
              index={1}
              mouseOffset={mouseOffset}
              visible={visible}
              onSelect={() => openSection("field-ops")}
            />

            {/* IMAGERY */}
            <SecondaryTile
              module={MODULES[3]}
              index={2}
              mouseOffset={mouseOffset}
              visible={visible}
              onSelect={() => openSection("imagery")}
            />
          </div>

          {/* Skill tags - inside grid container, below secondary cards */}
          <div
            className={`w-full flex justify-center mt-2 md:mt-0 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: "800ms" }}
          >
            <div className="grid grid-cols-3 md:flex md:flex-wrap md:justify-center gap-1.5 md:gap-2 max-w-md md:max-w-lg">
              {[
                { label: "CRISIS MGMT", color: "primary" },
                { label: "ENGLISH C1", color: "primary" },
                { label: "ADOBE SUITE", color: "accent" },
                { label: "DATA ANALYSIS", color: "accent" },
                { label: "TEAM LEAD", color: "primary" },
                { label: "OSINT", color: "cyan" },
              ].map((skill) => (
                <span
                  key={skill.label}
                  className={`text-[8px] md:text-xs font-mono px-1.5 md:px-2.5 py-1 md:py-1.5 rounded border text-center whitespace-nowrap cursor-default transition-colors duration-300 hover:brightness-150 ${
                    skill.color === "accent"
                      ? "text-accent/80 bg-accent/5 border-accent/20"
                      : skill.color === "cyan"
                        ? "text-[hsl(var(--neon-cyan))]/80 bg-[hsl(var(--neon-cyan))]/5 border-[hsl(var(--neon-cyan))]/20"
                        : "text-primary/80 bg-primary/5 border-primary/20"
                  }`}
                >
                  {skill.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Bottom status bar - hidden on mobile */}
      <footer
        className={`hidden md:flex h-6 items-center justify-between px-4 md:px-8 border-t border-border/30 bg-card/20 backdrop-blur shrink-0 transition-all duration-700 ${visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}
        style={{ transitionDelay: "400ms" }}
      >
        <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
          <span>
            SYS: <span className="text-[hsl(var(--field-green))]">OPERATIONAL</span>
          </span>
          <span>
            UPLINK: <span className="text-primary">STABLE</span>
          </span>
          <span>
            THREAT: <span className="text-accent">LOW</span>
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
          <span>ENCRYPTION: AES-256</span>
          <span>
            NODE: <span className="text-foreground">FR-LIL-01</span>
          </span>
        </div>
      </footer>

      {/* About Panel overlay */}
      <AboutPanel open={activeSection === "about"} onClose={closeSection} />
      <StrategyPanel open={activeSection === "strategy"} onClose={closeSection} />
      <IntelCorePanel open={activeSection === "intel"} onClose={closeSection} />
      <FieldOpsPanel open={activeSection === "field-ops"} onClose={closeSection} />
      <SignalPanel open={activeSection === "signal"} onClose={closeSection} />
      <ImageryPanel open={activeSection === "imagery"} onClose={closeSection} />
    </div>
  )
}
