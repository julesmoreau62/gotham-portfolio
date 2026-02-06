"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  X,
  Radio,
  Eye,
  Users,
  Heart,
  TrendingUp,
  Zap,
  Trophy,
  MonitorPlay,
  Clock,
  Target,
  BarChart3,
  ArrowUpRight,
} from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import Image from "next/image"

/* ================================================================
   DATA
   ================================================================ */

const KPI_CARDS = [
  { icon: Eye,        label: "VIEWS",       value: 1000000, display: "1.0M",   sub: "Facebook reach",       color: "primary",  spark: [3,8,12,15,20,25,28,30,32,35] },
  { icon: Users,      label: "REACH",       value: 44000,   display: "44K",    sub: "Unique accounts",      color: "primary",  spark: [10,12,15,18,20,22,25,27,28,30], trend: "+24%" },
  { icon: Heart,      label: "ENGAGEMENT",  value: 24200,   display: "24.2K",  sub: "Total interactions",   color: "primary",  spark: [5,8,12,15,18,20,25,28,30,35],   trend: "+93.8%" },
  { icon: TrendingUp, label: "GROWTH",      value: 28.2,    display: "+28.2%", sub: "Follower increase",    color: "green",    spark: [8,10,15,18,20,24,28,30,32,38],   trend: "+28.2%" },
]

const SECONDARY_STATS = [
  { icon: MonitorPlay, label: "Visits", value: "93K", trend: "+10.3%" },
  { icon: Clock,       label: "Watch Time", value: "11d 23h", trend: "+162%" },
]

const ACHIEVEMENTS = [
  { label: "Engagement",  metric: "+93.8%", detail: "24.2K interactions", icon: Heart },
  { label: "Watch time",  metric: "+162%",  detail: "11d 23h total",      icon: Clock },
  { label: "Reach",       metric: "1M",     detail: "Facebook views",     icon: Eye },
]

const TOP_CONTENT = [
  { label: "MATCH DAY 1",    type: "VIDEO",  reach: "412K", eng: "8.2K", src: "/assets/comms/match-championnat.png" },
  { label: "MATCH RESULT 1", type: "REEL",   reach: "287K", eng: "6.1K", src: "/assets/comms/resultat-match.jpg" },
  { label: "MATCH RESULT 2", type: "REEL",   reach: "198K", eng: "5.4K", src: "/assets/comms/resultat-match-2.jpg" },
]

const SPONSOR_METRICS = [
  { label: "CTR BOOST",      value: "+467%", color: "accent" },
  { label: "ENGAGEMENT",     value: "HIGH",  color: "foreground" },
  { label: "DATA CAPTURE",   value: "YES",   color: "green" },
  { label: "ROI",            value: "+++",   color: "green" },
]

/* ================================================================
   ANIMATED COUNTER HOOK
   ================================================================ */
function useCountUp(end: number, start: boolean, duration = 1800, decimals = 0) {
  const [val, setVal] = useState(0)
  const rafRef = useRef(0)
  useEffect(() => {
    if (!start) { setVal(0); return }
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Number((end * eased).toFixed(decimals)))
      if (p < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [end, start, duration, decimals])
  return val
}

/* ================================================================
   FREQUENCY VISUALIZER  (canvas-based)
   ================================================================ */
function FrequencyVisualizer({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef(0)
  const barsRef = useRef<number[]>(Array.from({ length: 64 }, () => Math.random()))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const draw = () => {
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      const barW = w / 64
      for (let i = 0; i < 64; i++) {
        const target = active ? 0.15 + Math.random() * 0.85 : 0.05
        barsRef.current[i] += (target - barsRef.current[i]) * 0.12
        const barH = barsRef.current[i] * h

        const hue = 217
        const lightness = 50 + barsRef.current[i] * 20
        ctx.fillStyle = `hsla(${hue}, 91%, ${lightness}%, ${0.4 + barsRef.current[i] * 0.6})`
        ctx.fillRect(i * barW, h - barH, barW - 1, barH)

        // Reflection
        ctx.fillStyle = `hsla(${hue}, 91%, ${lightness}%, ${barsRef.current[i] * 0.15})`
        ctx.fillRect(i * barW, h, barW - 1, barH * 0.3)
      }

      rafRef.current = requestAnimationFrame(draw)
    }
    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [active])

  return (
    <canvas
      ref={canvasRef}
      width={640}
      height={120}
      className="w-full h-16 md:h-20 rounded-sm"
    />
  )
}

/* ================================================================
   SIGNAL INTRO  -  Frequency Lock
   ================================================================ */
function SignalIntro({ onDone, isMobile }: { onDone: () => void; isMobile: boolean }) {
  const [step, setStep] = useState(0)
  const [freq, setFreq] = useState(87.5)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef(0)

  // Frequency scanning animation - Mobile: 1s / Desktop: 2s
  useEffect(() => {
    const t0 = performance.now()
    const targetFreq = 143.7
    const duration = isMobile ? 1000 : 2000
    
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1)
      // Eased with some oscillation
      const eased = 1 - Math.pow(1 - p, 3)
      const jitter = p < 0.8 ? Math.sin(p * 40) * (1 - p) * 8 : 0
      setFreq(Number((87.5 + (targetFreq - 87.5) * eased + jitter).toFixed(1)))
      if (p < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [isMobile])

  // Waveform canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    let raf: number
    let phase = 0

    const draw = () => {
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      // Draw waveform
      ctx.strokeStyle = "hsl(217 91% 60%)"
      ctx.lineWidth = 2
      ctx.beginPath()
      for (let x = 0; x < w; x++) {
        const t = (x / w) * Math.PI * 12
        const amplitude = step >= 2 ? 0.6 : 0.3 + Math.sin(phase * 0.5) * 0.2
        const y = h / 2 + Math.sin(t + phase) * h * amplitude * 0.4
          + Math.sin(t * 2.5 + phase * 1.3) * h * 0.1
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      // Ghost waveform
      ctx.strokeStyle = "hsl(186 100% 50% / 0.2)"
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let x = 0; x < w; x++) {
        const t = (x / w) * Math.PI * 8
        const y = h / 2 + Math.sin(t + phase * 0.7 + 1) * h * 0.25
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      phase += 0.06
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [step])

  // Step progression - Mobile: 1.2s / Desktop: 2.8s
  useEffect(() => {
    const timings = isMobile
      ? { t1: 150, t2: 500, t3: 800, t4: 1200 }
      : { t1: 400, t2: 1200, t3: 2000, t4: 2800 }
    
    const t1 = setTimeout(() => setStep(1), timings.t1)
    const t2 = setTimeout(() => setStep(2), timings.t2)
    const t3 = setTimeout(() => setStep(3), timings.t3)
    const t4 = setTimeout(onDone, timings.t4)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [onDone, isMobile])

  const locked = step >= 2

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: "linear-gradient(hsl(217 91% 60%) 1px, transparent 1px), linear-gradient(90deg, hsl(217 91% 60%) 1px, transparent 1px)",
        backgroundSize: "30px 30px",
      }} />

      {/* Frequency display */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-4">
          <Radio className={`w-5 h-5 ${locked ? "text-primary" : "text-muted-foreground"} transition-colors duration-500`} />
          <span className="text-[10px] font-mono text-muted-foreground tracking-[0.3em] uppercase">
            {locked ? "SIGNAL ACQUIRED" : "SCANNING FREQUENCY..."}
          </span>
        </div>

        {/* Big frequency number */}
        <div className={`font-mono text-6xl md:text-8xl font-bold tabular-nums transition-colors duration-500 ${locked ? "text-primary" : "text-foreground"}`}
          style={{ textShadow: locked ? "0 0 40px hsl(217 91% 60% / 0.5)" : "none" }}
        >
          {freq}
        </div>
        <span className="text-xs font-mono text-muted-foreground mt-1">MHz</span>

        {/* Waveform */}
        <div className="w-80 md:w-[28rem] mt-6 relative">
          <canvas ref={canvasRef} width={640} height={100} className="w-full h-14" />
          {/* Center line */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-primary/20" />
          {/* Scanning cursor */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-primary/40"
            style={{ boxShadow: locked ? "0 0 12px hsl(217 91% 60%)" : "none" }}
          />
        </div>

        {/* Status line */}
        <div className="flex items-center gap-4 mt-5 text-[9px] font-mono text-muted-foreground">
          <span className={step >= 1 ? "text-[hsl(var(--field-green))]" : ""}>
            {step >= 1 ? "[OK]" : "[..]"} BAND LOCK
          </span>
          <span className={step >= 2 ? "text-[hsl(var(--field-green))]" : ""}>
            {step >= 2 ? "[OK]" : "[..]"} DECRYPT
          </span>
          <span className={step >= 3 ? "text-[hsl(var(--field-green))]" : ""}>
            {step >= 3 ? "[OK]" : "[..]"} STREAM READY
          </span>
        </div>
      </div>

      {/* Skip */}
      <button
        onClick={onDone}
        type="button"
        className="absolute bottom-8 text-[9px] font-mono text-muted-foreground/50 hover:text-foreground transition tracking-widest z-20"
      >
        [ SKIP ]
      </button>
    </div>
  )
}

/* ================================================================
   LIVE SPARKLINE
   ================================================================ */
function LiveSparkline({ data, color = "primary", active }: { data: number[]; color?: string; active: boolean }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100
    const y = 100 - ((v - min) / range) * 80 - 10
    return `${x},${y}`
  }).join(" ")

  const fillPoints = `0,100 ${points} 100,100`

  const hsl = color === "green" ? "var(--field-green)" : "var(--primary)"

  return (
    <svg viewBox="0 0 100 100" className="w-full h-8" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`sg-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={`hsl(${hsl})`} stopOpacity="0.25" />
          <stop offset="100%" stopColor={`hsl(${hsl})`} stopOpacity="0" />
        </linearGradient>
      </defs>
      {active && <polygon fill={`url(#sg-${color})`} points={fillPoints} className="transition-opacity duration-1000" />}
      <polyline
        fill="none"
        stroke={`hsl(${hsl})`}
        strokeWidth="2"
        opacity={active ? 0.8 : 0.15}
        points={points}
        className="transition-opacity duration-1000"
      />
      {active && (
        <circle cx="100" cy={points.split(" ").pop()?.split(",")[1]} r="3" fill={`hsl(${hsl})`}>
          <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
        </circle>
      )}
    </svg>
  )
}

/* ================================================================
   MAIN PANEL
   ================================================================ */
export function SignalPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const isMobile = useIsMobile()
  const [showIntro, setShowIntro] = useState(true)
  const [visible, setVisible] = useState(false)

  const handleIntroDone = useCallback(() => {
    setShowIntro(false)
    requestAnimationFrame(() => setVisible(true))
  }, [])

  useEffect(() => {
    if (!open) { setShowIntro(true); setVisible(false) }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col">
      {showIntro && <SignalIntro onDone={handleIntroDone} isMobile={isMobile} />}

      {/* Header */}
      <header
        className="h-11 border-b border-border/50 bg-card/40 backdrop-blur-md flex items-center justify-between px-4 md:px-6 shrink-0 z-40"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(-100%)",
          transition: "all 0.5s cubic-bezier(0.2,1,0.3,1)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <Radio className="w-3.5 h-3.5 text-primary" />
            <div className="absolute inset-0 w-3.5 h-3.5 rounded-full bg-primary/40 animate-ping" />
          </div>
          <h2 className="text-foreground font-tech text-sm tracking-widest uppercase">
            Signal: <span className="text-primary">ASN95</span>
          </h2>
          <span className="hidden md:inline-flex text-[8px] font-mono text-muted-foreground border border-border px-2 py-0.5 rounded-sm">
            143.7 MHz // ENCRYPTED
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 text-[8px] font-mono text-muted-foreground">
            <span>ROLE: <span className="text-primary font-bold">HEAD OF COMMS</span></span>
            <span className="text-border">|</span>
            <span>LINK: <span className="text-[hsl(var(--field-green))] font-bold">ACTIVE</span></span>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 hover:border-primary/60 text-primary font-bold text-[9px] px-3 py-1.5 transition-all uppercase tracking-widest rounded-sm group"
          >
            <X className="w-3 h-3 group-hover:rotate-90 transition-transform" />
            <span className="hidden sm:inline">CUT SIGNAL</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 md:p-5">
        <div className="max-w-6xl mx-auto flex flex-col gap-4 md:gap-5">

          {/* LIVE FREQUENCY VISUALIZER */}
          <section
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: "all 0.7s cubic-bezier(0.2,1,0.3,1) 100ms",
            }}
          >
            <div className="bg-card/40 border border-primary/20 rounded-sm overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b border-primary/10 bg-primary/[0.03]">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-3 h-3 text-primary" />
                  <span className="text-[8px] font-mono text-primary tracking-[0.2em] uppercase font-bold">
                    Live Signal Monitor
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--field-green))] animate-pulse" />
                  <span className="text-[7px] font-mono text-[hsl(var(--field-green))]">STREAMING</span>
                </div>
              </div>
              <div className="p-3 bg-background/50">
                <FrequencyVisualizer active={visible} />
              </div>
            </div>
          </section>

          {/* MAIN KPI GRID */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
            {KPI_CARDS.map((kpi, i) => {
              const Icon = kpi.icon
              return (
                <KpiCard key={kpi.label} kpi={kpi} icon={Icon} index={i} visible={visible} />
              )
            })}
          </section>

          {/* ROLE + SECONDARY STATS */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
            {/* Role card */}
            <div
              className="md:col-span-1 bg-card/40 border border-primary/15 rounded-sm p-3 flex flex-col justify-center"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(12px)",
                transition: "all 0.6s cubic-bezier(0.2,1,0.3,1) 700ms",
              }}
            >
              <span className="text-[7px] font-mono text-muted-foreground uppercase tracking-wider mb-1">Position</span>
              <p className="text-xs font-tech text-primary leading-snug">
                Head of Communication
              </p>
              <p className="text-[9px] font-mono text-muted-foreground mt-0.5">
                Digital & Sponsor Dev. Manager
              </p>
            </div>

            {/* Secondary stats */}
            {SECONDARY_STATS.map((stat, i) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  className="bg-card/40 border border-border rounded-sm p-3 group hover:border-primary/40 transition-all"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(12px)",
                    transition: `all 0.6s cubic-bezier(0.2,1,0.3,1) ${750 + i * 80}ms`,
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Icon className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-[7px] font-mono text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                  </div>
                  <div className="text-xl font-bold text-foreground font-mono leading-none">{stat.value}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="w-2.5 h-2.5 text-[hsl(var(--field-green))]" />
                    <span className="text-[9px] font-mono font-bold text-[hsl(var(--field-green))]">{stat.trend}</span>
                  </div>
                </div>
              )
            })}
          </section>

          {/* TOP CONTENT + ACHIEVEMENTS */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-3">

            {/* Top Content */}
            <div
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transition: "all 0.7s cubic-bezier(0.2,1,0.3,1) 850ms",
              }}
            >
              <div className="bg-card/40 border border-border rounded-sm overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-2 border-b border-border/50 bg-card/30">
                  <Radio className="w-3 h-3 text-primary" />
                  <span className="text-[8px] font-tech text-foreground uppercase tracking-wider">Top Content</span>
                </div>
                <div className="p-2 flex flex-col gap-1.5">
                  {TOP_CONTENT.map((c, i) => (
                    <div key={c.label} className="flex items-center gap-3 bg-background/40 border border-border/50 rounded-sm px-3 py-2 hover:border-primary/30 transition-all group"
                      style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? "translateX(0)" : "translateX(-20px)",
                        transition: `all 0.5s cubic-bezier(0.2,1,0.3,1) ${950 + i * 100}ms`,
                      }}
                    >
                      <div className="w-10 h-10 rounded-sm border border-primary/20 overflow-hidden shrink-0 relative bg-muted">
                        <Image
                          src={c.src || "/placeholder.svg"}
                          alt={c.label}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                        />
                        <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 border-t border-l border-primary/30" />
                        <div className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 border-b border-r border-primary/30" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[9px] font-tech text-foreground truncate">{c.label}</div>
                        <div className="text-[7px] font-mono text-muted-foreground">{c.type}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-[9px] font-mono text-foreground font-bold">{c.reach}</div>
                        <div className="text-[7px] font-mono text-muted-foreground">{c.eng} eng.</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transition: "all 0.7s cubic-bezier(0.2,1,0.3,1) 950ms",
              }}
            >
              <div className="bg-card/40 border border-[hsl(var(--field-green))]/25 rounded-sm overflow-hidden h-full">
                <div className="flex items-center gap-2 px-3 py-2 border-b border-[hsl(var(--field-green))]/15 bg-gradient-to-r from-[hsl(var(--field-green))]/8 to-transparent">
                  <Trophy className="w-3 h-3 text-[hsl(var(--field-green))]" />
                  <span className="text-[8px] font-tech text-foreground uppercase tracking-wider">Key Achievements</span>
                </div>
                <div className="p-3 flex flex-col gap-2.5">
                  {ACHIEVEMENTS.map((a, i) => {
                    const AIcon = a.icon
                    return (
                      <div key={a.label}
                        className="flex items-start gap-3 group"
                        style={{
                          opacity: visible ? 1 : 0,
                          transform: visible ? "translateX(0)" : "translateX(20px)",
                          transition: `all 0.5s cubic-bezier(0.2,1,0.3,1) ${1050 + i * 100}ms`,
                        }}
                      >
                        <div className="w-7 h-7 rounded-full bg-[hsl(var(--field-green))]/10 border border-[hsl(var(--field-green))]/25 flex items-center justify-center shrink-0 mt-0.5">
                          <AIcon className="w-3 h-3 text-[hsl(var(--field-green))]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold font-mono text-[hsl(var(--field-green))]">{a.metric}</span>
                            <span className="text-[8px] font-tech text-foreground uppercase">{a.label}</span>
                          </div>
                          <span className="text-[8px] font-mono text-muted-foreground">{a.detail}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* SPONSOR ACTIVATION */}
          <section
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.8s cubic-bezier(0.2,1,0.3,1) 1100ms",
            }}
          >
            <SponsorBlock visible={visible} />
          </section>
        </div>
      </div>

      {/* Bottom bar */}
      <footer
        className="h-6 flex items-center justify-between px-4 md:px-6 border-t border-border/30 bg-card/20 backdrop-blur shrink-0"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 0.5s 1400ms" }}
      >
        <div className="flex items-center gap-3 text-[7px] font-mono text-muted-foreground">
          <span>CHANNEL: <span className="text-primary">SOCIAL-MEDIA</span></span>
          <span className="hidden sm:inline">ENCRYPTION: <span className="text-[hsl(var(--field-green))]">ACTIVE</span></span>
        </div>
        <div className="text-[7px] font-mono text-muted-foreground">
          FREQ: <span className="text-foreground">143.7 MHz</span>
        </div>
      </footer>
    </div>
  )
}

/* ================================================================
   KPI CARD
   ================================================================ */
function KpiCard({
  kpi,
  icon: Icon,
  index,
  visible,
}: {
  kpi: typeof KPI_CARDS[0]
  icon: typeof Eye
  index: number
  visible: boolean
}) {
  const numericEnd = kpi.value
  const countVal = useCountUp(numericEnd, visible, 1800, numericEnd < 100 ? 1 : 0)
  const isGreen = kpi.color === "green"
  const hslVar = isGreen ? "var(--field-green)" : "var(--primary)"

  // Format displayed value
  let displayCount: string
  if (numericEnd >= 1000000) displayCount = `${(countVal / 1000000).toFixed(1)}M`
  else if (numericEnd >= 1000) displayCount = `${(countVal / 1000).toFixed(1)}K`
  else if (numericEnd < 100) displayCount = `+${countVal.toFixed(1)}%`
  else displayCount = countVal.toString()

  return (
    <div
      className="relative bg-card/60 border rounded-sm p-3 overflow-hidden group transition-all duration-500"
      style={{
        borderColor: `hsl(${hslVar} / 0.2)`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
        transition: `all 0.6s cubic-bezier(0.2,1,0.3,1) ${200 + index * 120}ms`,
      }}
    >
      {/* Hover glow */}
      <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full blur-2xl transition-opacity duration-500 opacity-0 group-hover:opacity-100"
        style={{ background: `hsl(${hslVar} / 0.12)` }}
      />

      {/* Scan line on hover */}
      <div className="absolute left-0 w-full h-px pointer-events-none opacity-0 group-hover:opacity-100"
        style={{
          background: `linear-gradient(90deg, transparent, hsl(${hslVar}), transparent)`,
          animation: "scan-line 1.5s linear infinite",
        }}
      />

      <div className="relative">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <Icon className="w-3 h-3" style={{ color: `hsl(${hslVar})` }} />
            <span className="text-[7px] font-mono text-muted-foreground uppercase tracking-wider">{kpi.label}</span>
          </div>
          {kpi.trend && (
            <span className="text-[8px] font-bold px-1.5 py-0.5 border rounded font-mono"
              style={{
                color: `hsl(${hslVar})`,
                borderColor: `hsl(${hslVar} / 0.3)`,
                background: `hsl(${hslVar} / 0.08)`,
              }}
            >
              {kpi.trend}
            </span>
          )}
        </div>

        <div className="text-2xl font-bold text-foreground font-mono tabular-nums leading-none mb-0.5">
          {displayCount}
        </div>
        <div className="text-[8px] text-muted-foreground font-mono">{kpi.sub}</div>

        <LiveSparkline data={kpi.spark} color={kpi.color} active={visible} />
      </div>
    </div>
  )
}

/* ================================================================
   SPONSOR BLOCK
   ================================================================ */
function SponsorBlock({ visible }: { visible: boolean }) {
  const ctrVal = useCountUp(467, visible, 2000)

  return (
    <div className="border-2 border-accent/30 rounded-sm bg-card/30 overflow-hidden relative">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/8 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="border-b border-accent/20 bg-gradient-to-r from-accent/10 via-accent/5 to-transparent px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2 relative">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-[10px] font-bold text-accent uppercase tracking-wider font-tech">Sponsor Activation</span>
          </div>
          <h3 className="text-base md:text-lg font-bold text-foreground font-tech leading-tight">
            {"\"Les Pronos du Sultan\""}
          </h3>
          <p className="text-[9px] font-mono text-muted-foreground mt-0.5">
            Gamification campaign with Sultan Kebab // Predictions + Prizes
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-3xl md:text-4xl font-bold text-accent font-mono tabular-nums leading-none"
              style={{ textShadow: "0 0 30px hsl(24 95% 53% / 0.4)" }}
            >
              +{ctrVal}%
            </div>
            <div className="text-[8px] font-mono text-accent/70 uppercase">Click-Through Rate</div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 relative">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Sponsor visual */}
          <div className="w-full md:w-48 shrink-0 rounded overflow-hidden border border-accent/20 relative group bg-muted aspect-[4/3]">
            <Image
              src="/assets/comms/sponsor.png"
              alt="Les Pronos du Sultan - Sultan Kebab Campaign"
              fill
              className="object-contain bg-background/50"
              sizes="(max-width: 768px) 100vw, 192px"
            />
            {/* Corner brackets */}
            <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t border-l border-accent/40" />
            <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t border-r border-accent/40" />
            <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b border-l border-accent/40" />
            <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b border-r border-accent/40" />
          </div>

          {/* Description */}
          <div className="flex-1">
            <div className="flex items-center gap-1.5 text-[9px] text-accent font-mono font-bold mb-2">
              <Target className="w-3 h-3" />
              OBJECTIVE: Drive engagement + Capture user data
            </div>
            <p className="text-[10px] font-mono text-muted-foreground leading-relaxed">
              Followers submit match predictions via form. Top 3 predictors each week win free meals at Sultan Kebab.
              Proven model to build community loyalty while delivering measurable sponsor ROI through data capture
              and repeat engagement loops.
            </p>
          </div>

          {/* Metric grid */}
          <div className="grid grid-cols-2 gap-1.5 w-full md:w-56 shrink-0">
            {SPONSOR_METRICS.map((m, i) => (
              <div key={m.label}
                className="bg-background/50 border border-accent/15 rounded-sm p-2 text-center hover:border-accent/40 transition-all"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "scale(1)" : "scale(0.9)",
                  transition: `all 0.4s cubic-bezier(0.2,1,0.3,1) ${1200 + i * 80}ms`,
                }}
              >
                <div className="text-[6px] text-muted-foreground uppercase mb-0.5 font-mono tracking-wider">{m.label}</div>
                <div className={`text-sm font-bold font-mono ${
                  m.color === "accent" ? "text-accent"
                    : m.color === "green" ? "text-[hsl(var(--field-green))]"
                      : "text-foreground"
                }`}>
                  {m.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
