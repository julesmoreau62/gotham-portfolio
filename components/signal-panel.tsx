"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  X,
  Radio,
  Eye,
  Heart,
  Clock,
  Target,
  BarChart3,
  Zap,
  Smartphone,
} from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import Image from "next/image"

/* ================================================================
   DATA
   ================================================================ */

const KPI_CHIPS = [
  { label: "1M Views",          icon: Eye },
  { label: "+93.8% Engagement", icon: Heart },
  { label: "+162% Watch Time",  icon: Clock },
  { label: "44K Reach",         icon: Target },
]

const V2_FEATURES = ["Live Rankings", "User Profiles", "Sponsor Data Layer"]

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
      className="w-full h-16 md:h-20"
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

  useEffect(() => {
    const t0 = performance.now()
    const targetFreq = 143.7
    const duration = isMobile ? 1000 : 2000
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      const jitter = p < 0.8 ? Math.sin(p * 40) * (1 - p) * 8 : 0
      setFreq(Number((87.5 + (targetFreq - 87.5) * eased + jitter).toFixed(1)))
      if (p < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [isMobile])

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
      ctx.strokeStyle = "hsl(217 91% 60%)"
      ctx.lineWidth = 2
      ctx.beginPath()
      for (let x = 0; x < w; x++) {
        const t = (x / w) * Math.PI * 12
        const amplitude = step >= 2 ? 0.6 : 0.3 + Math.sin(phase * 0.5) * 0.2
        const y = h / 2 + Math.sin(t + phase) * h * amplitude * 0.4 + Math.sin(t * 2.5 + phase * 1.3) * h * 0.1
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
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
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: "linear-gradient(hsl(217 91% 60%) 1px, transparent 1px), linear-gradient(90deg, hsl(217 91% 60%) 1px, transparent 1px)",
        backgroundSize: "30px 30px",
      }} />
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-4">
          <Radio className={`w-5 h-5 ${locked ? "text-primary" : "text-muted-foreground"} transition-colors duration-500`} />
          <span className="text-[10px] font-mono text-muted-foreground tracking-[0.3em] uppercase">
            {locked ? "SIGNAL ACQUIRED" : "SCANNING FREQUENCY..."}
          </span>
        </div>
        <div className={`font-mono text-6xl md:text-8xl font-bold tabular-nums transition-colors duration-500 ${locked ? "text-primary" : "text-foreground"}`}
          style={{ textShadow: locked ? "0 0 40px hsl(217 91% 60% / 0.5)" : "none" }}
        >
          {freq}
        </div>
        <span className="text-xs font-mono text-muted-foreground mt-1">MHz</span>
        <div className="w-80 md:w-[28rem] mt-6 relative">
          <canvas ref={canvasRef} width={640} height={100} className="w-full h-14" />
          <div className="absolute top-1/2 left-0 w-full h-px bg-primary/20" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-primary/40"
            style={{ boxShadow: locked ? "0 0 12px hsl(217 91% 60%)" : "none" }}
          />
        </div>
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
   PULSING BADGE
   ================================================================ */
function PulsingBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-accent/50 bg-accent/10 text-accent text-[9px] font-mono font-bold uppercase tracking-widest">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping bg-accent/60" />
        <span className="relative inline-flex h-2 w-2 bg-accent" />
      </span>
      {label}
    </span>
  )
}

/* ================================================================
   V1 SPONSOR CARD
   ================================================================ */
function SponsorV1({ visible }: { visible: boolean }) {
  const ctrVal = useCountUp(467, visible, 2000)

  return (
    <div
      className="border-2 border-accent/30 bg-card/30 overflow-hidden relative"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.8s cubic-bezier(0.2,1,0.3,1) 600ms",
      }}
    >
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/8 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="border-b border-accent/20 bg-gradient-to-r from-accent/10 via-accent/5 to-transparent px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 relative">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-[9px] font-bold text-accent uppercase tracking-widest font-mono">V1 // Sponsor Activation</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="text-2xl md:text-3xl font-bold text-accent font-mono tabular-nums leading-none"
            style={{ textShadow: "0 0 30px hsl(24 95% 53% / 0.4)" }}
          >
            +{ctrVal}%
          </div>
          <span className="text-[8px] font-mono text-accent/70 uppercase">CTR</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 md:p-5 relative">
        <h3 className="text-base md:text-lg font-bold text-foreground font-tech leading-tight mb-3">
          {"\"Les Pronos du Sultan\""}
        </h3>

        {/* Mobile: stack vertically | Desktop: strict 55/45 grid */}
        <div className="flex flex-col lg:grid lg:gap-6" style={{ gridTemplateColumns: "55fr 45fr" }}>
          {/* Text content — left column */}
          <div className="min-w-0">
            <p className="text-[11px] md:text-xs font-mono text-muted-foreground leading-relaxed">
              In 2024, ASN95 partnered with Sultan Kebab for a simple bet: could a weekly prediction game turn passive followers into an active community? The mechanic was deliberately low-tech — submit your match score prediction via form, top 3 predictors win a free meal. No app, no platform, just a Google Form and a leaderboard posted manually every week. It worked beyond expectations. <span className="text-accent font-bold">+467% CTR</span>. Followers didn{"'"}t just participate — they came back. Every. Single. Week. The sponsor got measurable ROI. The club got data. The community got a reason to care beyond the 90 minutes. The infrastructure couldn{"'"}t scale. But the proof of concept was undeniable.
            </p>
          </div>

          {/* Image — right column, contained */}
          <div className="mt-4 lg:mt-0 w-full border border-accent/20 relative group bg-muted aspect-[4/3] overflow-hidden">
            <Image
              src="/assets/comms/sponsor.png"
              alt="Les Pronos du Sultan - Sultan Kebab Campaign"
              fill
              className="object-contain bg-background/50"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
            {/* Corner brackets */}
            <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t border-l border-accent/40" />
            <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t border-r border-accent/40" />
            <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b border-l border-accent/40" />
            <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b border-r border-accent/40" />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ================================================================
   V2 SPONSOR CARD
   ================================================================ */
function SponsorV2({ visible }: { visible: boolean }) {
  return (
    <div
      className="border-2 border-accent/30 bg-card/30 overflow-hidden relative"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.8s cubic-bezier(0.2,1,0.3,1) 900ms",
      }}
    >
      {/* Background glow */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/6 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="border-b border-accent/20 bg-gradient-to-r from-accent/10 via-accent/5 to-transparent px-4 py-3 flex items-center justify-between relative">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-accent" />
          <span className="text-[9px] font-bold text-accent uppercase tracking-widest font-mono">V2 // Platform Build</span>
        </div>
        <PulsingBadge label="In Development" />
      </div>

      {/* Body */}
      <div className="p-4 relative">
        <div className="flex flex-col md:flex-row gap-5">
          {/* Text content */}
          <div className="flex-1 flex flex-col gap-4">
            <div>
              <h3 className="text-base md:text-lg font-bold text-foreground font-tech leading-tight mb-2">
                ASN95 Predict
              </h3>
              <p className="text-[11px] md:text-xs font-mono text-muted-foreground leading-relaxed">
                If the V1 proved the concept, the V2 builds the machine. ASN95 Predict is a dedicated fan engagement platform — designed from the ground up to make this activation replicable, scalable, and sponsor-ready. Every feature exists for a reason: live rankings to drive weekly return visits, user profiles to build a persistent community, and a structured data capture layer to give future sponsors something they can actually measure. No more manual tracking. No more weekly rebuilds. Just a model that any partner can plug into.
              </p>
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[8px] font-mono text-muted-foreground uppercase tracking-widest">
                  Status — Beta
                </span>
                <span className="text-[9px] font-mono font-bold text-accent tabular-nums">80%</span>
              </div>
              <div className="h-1.5 bg-accent/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent via-accent/80 to-accent/60"
                  style={{
                    width: visible ? "80%" : "0%",
                    transition: "width 1.5s cubic-bezier(0.2,1,0.3,1) 1200ms",
                  }}
                />
              </div>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-1.5">
              {V2_FEATURES.map((feat) => (
                <span
                  key={feat}
                  className="px-2.5 py-1 border border-accent/25 bg-accent/5 text-[9px] font-mono text-accent uppercase tracking-wider"
                >
                  {feat}
                </span>
              ))}
            </div>
          </div>

          {/* Smartphone mockup placeholder */}
          <div className="w-full md:w-44 shrink-0 flex items-center justify-center">
            <div className="relative w-32 md:w-36 aspect-[9/18] border-2 border-accent/30 bg-background/80 overflow-hidden">
              {/* Phone notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-2 bg-accent/15" />
              {/* Phone screen content placeholder */}
              <div className="absolute inset-2 top-4 flex flex-col items-center justify-center gap-2">
                <Smartphone className="w-6 h-6 text-accent/30" />
                <div className="flex flex-col gap-1 w-full px-2">
                  <div className="h-1 bg-accent/15 w-full" />
                  <div className="h-1 bg-accent/10 w-3/4" />
                  <div className="h-1 bg-accent/10 w-5/6" />
                  <div className="h-4 bg-accent/8 w-full mt-1" />
                  <div className="h-1 bg-accent/10 w-2/3" />
                  <div className="h-1 bg-accent/10 w-4/5" />
                  <div className="h-3 bg-accent/6 w-full mt-1" />
                  <div className="h-3 bg-accent/6 w-full" />
                  <div className="h-3 bg-accent/6 w-full" />
                </div>
              </div>
              {/* Corner brackets */}
              <div className="absolute top-1 left-1 w-3 h-3 border-t border-l border-accent/30" />
              <div className="absolute top-1 right-1 w-3 h-3 border-t border-r border-accent/30" />
              <div className="absolute bottom-1 left-1 w-3 h-3 border-b border-l border-accent/30" />
              <div className="absolute bottom-1 right-1 w-3 h-3 border-b border-r border-accent/30" />
            </div>
          </div>
        </div>
      </div>
    </div>
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
          <span className="hidden md:inline-flex text-[8px] font-mono text-muted-foreground border border-border px-2 py-0.5">
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
            className="flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 hover:border-primary/60 text-primary font-bold text-[9px] px-3 py-1.5 transition-all uppercase tracking-widest group"
          >
            <X className="w-3 h-3 group-hover:rotate-90 transition-transform" />
            <span className="hidden sm:inline">CUT SIGNAL</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 md:p-5">
        <div className="max-w-5xl mx-auto flex flex-col gap-4 md:gap-5">

          {/* LIVE FREQUENCY VISUALIZER */}
          <section
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: "all 0.7s cubic-bezier(0.2,1,0.3,1) 100ms",
            }}
          >
            <div className="bg-card/40 border border-primary/20 overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b border-primary/10 bg-primary/[0.03]">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-3 h-3 text-primary" />
                  <span className="text-[8px] font-mono text-primary tracking-[0.2em] uppercase font-bold">
                    Live Signal Monitor
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-[hsl(var(--field-green))] animate-pulse" />
                  <span className="text-[7px] font-mono text-[hsl(var(--field-green))]">STREAMING</span>
                </div>
              </div>
              <div className="p-3 bg-background/50">
                <FrequencyVisualizer active={visible} />
              </div>
            </div>
          </section>

          {/* COMPACT KPI STATS BAR */}
          <section
            className="flex flex-wrap gap-2"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(12px)",
              transition: "all 0.6s cubic-bezier(0.2,1,0.3,1) 300ms",
            }}
          >
            {KPI_CHIPS.map((chip, i) => {
              const Icon = chip.icon
              return (
                <div
                  key={chip.label}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-primary/20 bg-primary/[0.04] hover:border-primary/40 transition-all"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(8px)",
                    transition: `all 0.5s cubic-bezier(0.2,1,0.3,1) ${350 + i * 80}ms`,
                  }}
                >
                  <Icon className="w-3 h-3 text-primary/70" />
                  <span className="text-[10px] font-mono text-foreground font-bold tracking-wide">{chip.label}</span>
                </div>
              )
            })}
          </section>

          {/* V1 SPONSOR ACTIVATION */}
          <SponsorV1 visible={visible} />

          {/* BRIDGE — prominent transition bar */}
          <div
            className="relative overflow-hidden border-2 border-accent/40 bg-accent/[0.06]"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(12px)",
              transition: "all 0.7s cubic-bezier(0.2,1,0.3,1) 800ms",
            }}
          >
            {/* Decorative top/bottom accent lines */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent/[0.04] via-accent/[0.12] to-accent/[0.04] pointer-events-none" />

            <div className="relative flex items-center gap-3 md:gap-5 px-4 md:px-6 py-4 md:py-5">
              {/* Left arrow cluster */}
              <div className="shrink-0 flex items-center gap-1 text-accent/50">
                <span className="text-sm md:text-lg font-mono">{">"}</span>
                <span className="text-sm md:text-lg font-mono">{">"}</span>
                <span className="text-sm md:text-lg font-mono">{">"}</span>
              </div>

              {/* Divider */}
              <div className="w-px h-8 bg-accent/30 shrink-0 hidden md:block" />

              {/* Text */}
              <p className="text-xs md:text-sm font-mono text-accent font-bold tracking-wide leading-relaxed flex-1 text-center md:text-left">
                {"The +467% wasn't a campaign. It was a blueprint."}
              </p>

              {/* Divider */}
              <div className="w-px h-8 bg-accent/30 shrink-0 hidden md:block" />

              {/* Right arrow cluster */}
              <div className="shrink-0 flex items-center gap-1 text-accent/50">
                <span className="text-sm md:text-lg font-mono">{">"}</span>
                <span className="text-sm md:text-lg font-mono">{">"}</span>
                <span className="text-sm md:text-lg font-mono">{">"}</span>
              </div>
            </div>
          </div>

          {/* V2 SPONSOR ACTIVATION */}
          <SponsorV2 visible={visible} />

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
