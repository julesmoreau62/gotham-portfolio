"use client"

import React from "react"

import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react"
import { Crosshair, Radio, Camera, Brain, User, Linkedin, Mail, Download } from "lucide-react"

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
    color: "hsl(160 84% 39%)",
    glowColor: "160 84% 39%",
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

function HexTile({
  module,
  index,
  mouseOffset,
  visible,
}: {
  module: HexModule
  index: number
  mouseOffset: { x: number; y: number }
  visible: boolean
}) {
  const Icon = module.icon
  const [hovered, setHovered] = useState(false)

  const parallaxX = mouseOffset.x * (0.02 + index * 0.008)
  const parallaxY = mouseOffset.y * (0.02 + index * 0.008)

  const statusDotClass =
    module.statusType === "critical"
      ? "bg-accent animate-pulse"
      : module.statusType === "active"
        ? "bg-[hsl(var(--field-green))] animate-pulse"
        : module.statusType === "intel"
          ? "bg-[hsl(var(--neon-cyan))] animate-pulse"
          : module.statusType === "online"
            ? "bg-primary"
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
      role="button"
      tabIndex={0}
    >
      {/* Hex shape container */}
      <div
        className={`relative transition-all duration-700 ${visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-90"}`}
        style={{ transitionDelay: `${300 + index * 150}ms` }}
      >
        {/* Glow effect on hover */}
        <div
          className="absolute -inset-3 rounded-2xl transition-opacity duration-500 blur-xl"
          style={{
            background: `radial-gradient(circle, hsl(${module.glowColor} / 0.3), transparent)`,
            opacity: hovered ? 1 : 0,
          }}
        />

        {/* Main card */}
        <div
          className="relative bg-card/80 backdrop-blur-md border rounded-lg p-5 md:p-6 overflow-hidden transition-all duration-300"
          style={{
            borderColor: hovered ? module.color : "hsl(215 25% 22%)",
            boxShadow: hovered
              ? `0 0 30px hsl(${module.glowColor} / 0.2), inset 0 0 30px hsl(${module.glowColor} / 0.05)`
              : "none",
          }}
        >
          {/* Scan line on hover */}
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
            className="absolute top-0 left-0 w-6 h-6 border-t border-l transition-all duration-300"
            style={{ borderColor: hovered ? module.color : "transparent" }}
          />
          <div
            className="absolute bottom-0 right-0 w-6 h-6 border-b border-r transition-all duration-300"
            style={{ borderColor: hovered ? module.color : "transparent" }}
          />

          {/* Status row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${statusDotClass}`} />
              <span
                className="text-[9px] font-mono tracking-[0.2em] uppercase"
                style={{ color: module.color }}
              >
                {module.status}
              </span>
            </div>
            <Icon
              className="w-4 h-4 transition-all duration-300"
              style={{
                color: hovered ? module.color : "hsl(215 20% 45%)",
                filter: hovered ? `drop-shadow(0 0 6px ${module.color})` : "none",
              }}
            />
          </div>

          {/* Title */}
          <h3
            className="font-tech text-xl md:text-2xl font-bold text-foreground leading-none mb-1.5 tracking-wide transition-all duration-300"
            style={{
              textShadow: hovered ? `0 0 20px hsl(${module.glowColor} / 0.5)` : "none",
            }}
          >
            {module.title}
          </h3>
          <p className="text-[10px] font-mono text-muted-foreground tracking-wider">
            {module.subtitle}
          </p>

          {/* Data bar for intel */}
          {module.statusType === "intel" && (
            <div className="relative h-[2px] bg-[hsl(var(--neon-cyan))]/15 rounded-full mt-3 overflow-hidden">
              <div
                className="absolute top-0 h-full w-[30%] bg-gradient-to-r from-transparent via-[hsl(var(--neon-cyan))]/90 to-transparent"
                style={{ animation: "data-flow 1.6s linear infinite" }}
              />
            </div>
          )}

          {/* Progress bar for critical */}
          {module.statusType === "critical" && (
            <div className="flex items-center gap-2 mt-3">
              <div className="flex-1 h-1 bg-accent/10 rounded-full overflow-hidden">
                <div className="h-full w-[73%] bg-gradient-to-r from-accent to-accent/60 rounded-full" />
              </div>
              <span className="text-[8px] font-mono text-accent">73%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function HexCommandGrid({ visible }: { visible: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 })
  const [time, setTime] = useState("")

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
        className={`h-12 md:h-14 flex items-center justify-between px-4 md:px-8 border-b border-border/50 bg-card/30 backdrop-blur-md z-50 shrink-0 transition-all duration-700 ${visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}
        style={{ transitionDelay: "200ms" }}
      >
        <div className="flex items-center gap-3 md:gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-sm bg-primary animate-pulse" />
            <span className="font-tech font-bold text-foreground tracking-[0.2em] text-sm md:text-base">
              GOTHAM
            </span>
          </div>
          <div className="h-5 w-px bg-border hidden sm:block" />
          <span className="text-[9px] font-mono text-muted-foreground hidden md:inline tracking-wider">
            OP: J.MOREAU // CLEARANCE: LV.4 // NODE: FR-LIL-01
          </span>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Contact links */}
          <div className="flex items-center gap-1.5">
            <a
              href="https://www.linkedin.com/in/jules-moreau-25405b363"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded border border-primary/30 bg-primary/5 hover:bg-primary/20 hover:border-primary/60 transition-all"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="w-3.5 h-3.5 text-primary" />
            </a>
            <a
              href="mailto:jules.moreau1@outlook.com"
              className="w-8 h-8 flex items-center justify-center rounded border border-[hsl(var(--field-green))]/30 bg-[hsl(var(--field-green))]/5 hover:bg-[hsl(var(--field-green))]/20 transition-all"
              aria-label="Send Email"
            >
              <Mail className="w-3.5 h-3.5 text-[hsl(var(--field-green))]" />
            </a>
            <button
              className="hidden sm:flex h-8 px-2.5 items-center gap-1.5 rounded border border-accent/30 bg-accent/5 hover:bg-accent/20 transition-all"
              aria-label="Download CV"
            >
              <Download className="w-3.5 h-3.5 text-accent" />
              <span className="text-[9px] font-mono text-accent">CV</span>
            </button>
          </div>

          <div className="h-5 w-px bg-border hidden md:block" />

          {/* Live badge */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-destructive/10 border border-destructive/30">
            <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
            <span className="text-[8px] font-mono text-destructive font-bold tracking-wider">LIVE</span>
          </div>

          {/* Clock */}
          <span className="text-[10px] font-mono text-muted-foreground tabular-nums hidden md:inline">
            {time}
          </span>
        </div>
      </header>

      {/* Main content area */}
      <main className="flex-1 flex flex-col items-center justify-center overflow-y-auto px-4 py-8 md:py-0">
        {/* Center identity block */}
        <div
          className={`text-center mb-8 md:mb-12 transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: "100ms" }}
        >
          {/* Avatar ring */}
          <div className="relative inline-flex items-center justify-center mb-5">
            {/* Outer rotating ring */}
            <div
              className="absolute w-28 h-28 md:w-32 md:h-32 rounded-full border border-dashed border-primary/20"
              style={{ animation: "orbit-spin 20s linear infinite" }}
            >
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_hsl(217_91%_60%)]" />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[hsl(var(--neon-cyan))] shadow-[0_0_10px_hsl(186_100%_50%)]" />
            </div>

            {/* Core circle */}
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-card border-2 border-primary/50 flex items-center justify-center relative shadow-[0_0_40px_hsl(217_91%_60%/0.3)]">
              <User className="w-8 h-8 md:w-10 md:h-10 text-primary/80" />
              {/* Ping */}
              <div className="absolute inset-0 rounded-full border border-primary/30 animate-node-ping" />
            </div>
          </div>

          <h1 className="font-tech text-2xl md:text-4xl font-bold text-foreground tracking-[0.15em] mb-1.5">
            JULES MOREAU
          </h1>
          <p className="font-mono text-[10px] md:text-xs text-primary tracking-[0.3em]">
            M1 STAPS ISA // HEAD OF COMMS @ ASN95
          </p>
          <p className="font-mono text-[9px] text-muted-foreground mt-2 max-w-md mx-auto leading-relaxed hidden md:block">
            Operative specialized in sport management, event logistics,
            digital communication & competitive intelligence.
          </p>
        </div>

        {/* Hex module grid */}
        <div className="w-full max-w-5xl">
          {/* Top row: 3 modules */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-3 md:mb-4">
            {MODULES.slice(0, 3).map((mod, i) => (
              <HexTile
                key={mod.id}
                module={mod}
                index={i}
                mouseOffset={mouseOffset}
                visible={visible}
              />
            ))}
          </div>

          {/* Bottom row: 2 modules centered */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 max-w-3xl mx-auto">
            {MODULES.slice(3).map((mod, i) => (
              <HexTile
                key={mod.id}
                module={mod}
                index={i + 3}
                mouseOffset={mouseOffset}
                visible={visible}
              />
            ))}
          </div>
        </div>

        {/* Skills orbiting tags */}
        <div
          className={`flex flex-wrap justify-center gap-2 mt-8 md:mt-10 max-w-lg transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ transitionDelay: "1200ms" }}
        >
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
              className={`text-[8px] md:text-[9px] font-mono px-2.5 py-1 rounded-sm border transition-colors duration-300 hover:brightness-150 cursor-default ${
                skill.color === "accent"
                  ? "text-accent/80 bg-accent/5 border-accent/20 hover:border-accent/50"
                  : skill.color === "cyan"
                    ? "text-[hsl(var(--neon-cyan))]/80 bg-[hsl(var(--neon-cyan))]/5 border-[hsl(var(--neon-cyan))]/20 hover:border-[hsl(var(--neon-cyan))]/50"
                    : "text-primary/80 bg-primary/5 border-primary/20 hover:border-primary/50"
              }`}
            >
              {skill.label}
            </span>
          ))}
        </div>
      </main>

      {/* Bottom status bar */}
      <footer
        className={`h-8 flex items-center justify-between px-4 md:px-8 border-t border-border/30 bg-card/20 backdrop-blur shrink-0 transition-all duration-700 ${visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}
        style={{ transitionDelay: "400ms" }}
      >
        <div className="flex items-center gap-4 text-[8px] font-mono text-muted-foreground">
          <span>
            SYS: <span className="text-[hsl(var(--field-green))]">OPERATIONAL</span>
          </span>
          <span className="hidden sm:inline">
            UPLINK: <span className="text-primary">STABLE</span>
          </span>
          <span className="hidden md:inline">
            THREAT: <span className="text-accent">LOW</span>
          </span>
        </div>
        <div className="flex items-center gap-4 text-[8px] font-mono text-muted-foreground">
          <span className="hidden sm:inline">ENCRYPTION: AES-256</span>
          <span>
            NODE: <span className="text-foreground">FR-LIL-01</span>
          </span>
        </div>
      </footer>
    </div>
  )
}
