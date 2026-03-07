"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  X,
  Radio,
  Eye,
  Heart,
  Clock,
  Target,
  Zap,
  Smartphone,
  Camera,
  Megaphone,
  ChevronDown,
} from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import Image from "next/image"

/* ================================================================
   DATA
   ================================================================ */

const KPI_CHIPS = [
  { value: 1,    suffix: "M Views",       prefix: "",  icon: Eye,    decimals: 0, duration: 1500 },
  { value: 93.8, suffix: "% Engagement",  prefix: "+", icon: Heart,  decimals: 1, duration: 2000 },
  { value: 162,  suffix: "% Watch Time",  prefix: "+", icon: Clock,  decimals: 0, duration: 2000 },
  { value: 44,   suffix: "K Reach",       prefix: "",  icon: Target, decimals: 0, duration: 1500 },
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
   SCROLL REVEAL HOOK  (IntersectionObserver)
   ================================================================ */
function useScrollReveal<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setRevealed(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return { ref, revealed }
}

/* ================================================================
   ANIMATED KPI CHIP
   ================================================================ */
function AnimatedKpiChip({ chip, active }: { chip: typeof KPI_CHIPS[number]; active: boolean }) {
  const val = useCountUp(chip.value, active, chip.duration, chip.decimals)
  const Icon = chip.icon
  return (
    <div className="flex items-center gap-1.5">
      <Icon className="w-3 h-3 text-primary/40" />
      <span className="text-[11px] font-mono font-bold tabular-nums text-primary" style={{ textShadow: "0 0 12px hsl(217 91% 60% / 0.3)" }}>
        {chip.prefix}{val}
      </span>
      <span className="text-[9px] font-mono text-muted-foreground tracking-wide uppercase">
        {chip.suffix.trim()}
      </span>
    </div>
  )
}

/* ================================================================
   NARRATIVE BRIDGE
   ================================================================ */
function NarrativeBridge({ text, subtext, delay = 0 }: { text: string; subtext?: string; delay?: number }) {
  const { ref, revealed } = useScrollReveal<HTMLDivElement>(0.3)

  return (
    <div
      ref={ref}
      className="relative overflow-hidden border-2 border-primary/30 bg-primary/[0.04]"
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(16px)",
        transition: `all 0.8s cubic-bezier(0.2,1,0.3,1) ${delay}ms`,
      }}
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.02] via-primary/[0.08] to-primary/[0.02] pointer-events-none" />

      <div className="relative flex items-center gap-3 md:gap-5 px-4 md:px-6 py-5 md:py-6">
        <div className="shrink-0 flex items-center gap-1 text-primary/40">
          <ChevronDown className="w-4 h-4" />
        </div>
        <div className="w-px h-8 bg-primary/20 shrink-0 hidden md:block" />
        <div className="flex-1 text-center md:text-left">
          <p className="text-xs md:text-sm font-mono text-primary font-bold tracking-wide leading-relaxed">
            {text}
          </p>
          {subtext && (
            <p className="text-[10px] font-mono text-muted-foreground mt-1 tracking-wide">
              {subtext}
            </p>
          )}
        </div>
        <div className="w-px h-8 bg-primary/20 shrink-0 hidden md:block" />
        <div className="shrink-0 flex items-center gap-1 text-primary/40">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </div>
  )
}

/* ================================================================
   SCROLL-REVEALED SECTION WRAPPER
   ================================================================ */
function RevealSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, revealed } = useScrollReveal<HTMLDivElement>(0.1)

  return (
    <div
      ref={ref}
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(30px)",
        transition: `all 0.9s cubic-bezier(0.2,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

/* ================================================================
   ACT HEADER
   ================================================================ */
function ActHeader({ act, title, subtitle, icon: Icon, color }: { act: string; title: string; subtitle: string; icon: React.ElementType; color: string }) {
  const { ref, revealed } = useScrollReveal<HTMLDivElement>(0.3)

  return (
    <div
      ref={ref}
      className="flex items-center gap-3 py-2"
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateX(0)" : "translateX(-20px)",
        transition: "all 0.7s cubic-bezier(0.2,1,0.3,1)",
      }}
    >
      <div className={`flex items-center justify-center w-8 h-8 border`} style={{ borderColor: color, background: `${color}15` }}>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[8px] font-mono text-muted-foreground tracking-[0.3em] uppercase">{act}</span>
          <div className="w-8 h-px" style={{ background: color }} />
        </div>
        <h3 className="text-sm md:text-base font-tech font-bold text-foreground uppercase tracking-widest">{title}</h3>
      </div>
      <span className="ml-auto text-[9px] font-mono text-muted-foreground hidden md:inline">{subtitle}</span>
    </div>
  )
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
      className="w-full h-10 md:h-12"
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
   PHOTOGRAPHER BADGE  (teal/green variant)
   ================================================================ */
function PhotographerBadge() {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-widest"
      style={{
        border: "1px solid hsl(160 84% 39% / 0.5)",
        background: "hsl(160 84% 39% / 0.1)",
        color: "hsl(160 84% 39%)",
      }}
    >
      <span className="relative flex h-2 w-2">
        <span
          className="absolute inline-flex h-full w-full animate-ping"
          style={{ background: "hsl(160 84% 39% / 0.6)" }}
        />
        <span
          className="relative inline-flex h-2 w-2"
          style={{ background: "hsl(160 84% 39%)" }}
        />
      </span>
      PHOTOGRAPHER
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
        <h3 className="text-lg md:text-2xl font-bold text-foreground font-tech leading-tight mb-4">
          {"\"Les Pronos du Sultan\""}
        </h3>

        {/* Mobile: stack vertically | Desktop: strict 55/45 grid */}
        <div className="flex flex-col lg:grid lg:gap-8" style={{ gridTemplateColumns: "55fr 45fr" }}>
          {/* Text content — left column */}
          <div className="min-w-0 flex flex-col">
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              In 2024, ASN95 partnered with Sultan Kebab on a simple bet: a weekly prediction game to turn passive followers into an active community. Low-tech by design — a Google Form, a manual leaderboard, a free meal for the top 3. It drove <span className="text-accent font-bold">+467% CTR</span>. Followers came back. Every. Single. Week. The infrastructure couldn{"'"}t scale. The proof of concept was undeniable.
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
                ASN95 Predict is the real thing. Live rankings, user profiles, sponsor-ready data capture — built to make this activation replicable for any future partner. No more manual tracking. Just a model that scales.
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

          {/* Smartphone mockup */}
          <div className="w-full md:w-44 shrink-0 flex items-center justify-center">
            <div className="relative w-32 md:w-36 aspect-[9/18] border-2 border-accent/30 bg-background/80 overflow-hidden">
              {/* Phone notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-2 bg-accent/15 rounded-b" />
              {/* Screen content */}
              <div className="absolute inset-2 top-4 flex flex-col gap-1.5 px-1.5">
                {/* App header */}
                <div className="flex items-center justify-between">
                  <span className="text-[5px] font-mono font-bold text-accent uppercase tracking-wider">ASN95 Predict</span>
                  <div className="w-2.5 h-2.5 border border-accent/30 rounded-full" />
                </div>
                {/* Match card */}
                <div className="border border-accent/20 bg-accent/[0.06] p-1.5">
                  <span className="text-[4px] font-mono text-accent/50 uppercase block mb-0.5">Next Match</span>
                  <div className="flex items-center justify-between">
                    <span className="text-[5px] font-mono text-foreground/70 font-bold">ASN</span>
                    <span className="text-[5px] font-mono text-accent/40">vs</span>
                    <span className="text-[5px] font-mono text-foreground/70 font-bold">FCM</span>
                  </div>
                  <div className="h-2.5 bg-accent/15 mt-1 flex items-center justify-center">
                    <span className="text-[4px] font-mono text-accent/60">Submit prediction</span>
                  </div>
                </div>
                {/* Leaderboard */}
                <div>
                  <span className="text-[4px] font-mono text-accent/50 uppercase tracking-wider">Live Rankings</span>
                  {[{ rank: "1", name: "Karim M.", pts: "42" }, { rank: "2", name: "Sofiane L.", pts: "38" }, { rank: "3", name: "Julien D.", pts: "35" }].map((row) => (
                    <div key={row.rank} className="flex items-center justify-between py-0.5 border-b border-accent/10">
                      <div className="flex items-center gap-1">
                        <span className="text-[4px] font-mono text-accent/40">{row.rank}</span>
                        <span className="text-[5px] font-mono text-foreground/60">{row.name}</span>
                      </div>
                      <span className="text-[5px] font-mono text-accent font-bold">{row.pts}</span>
                    </div>
                  ))}
                </div>
                {/* Sponsor strip */}
                <div className="mt-auto border-t border-accent/10 pt-1">
                  <span className="text-[3px] font-mono text-accent/30 uppercase tracking-widest block text-center">Powered by Sultan Kebab</span>
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
  const hasPlayedIntro = useRef(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleIntroDone = useCallback(() => {
    setShowIntro(false)
    hasPlayedIntro.current = true
    requestAnimationFrame(() => setVisible(true))
  }, [])

  useEffect(() => {
    if (!open) { setShowIntro(true); setVisible(false); return }
    // Skip intro on re-opens
    if (hasPlayedIntro.current) {
      setShowIntro(false)
      requestAnimationFrame(() => setVisible(true))
    }
    // Scroll to top on open
    if (scrollRef.current) scrollRef.current.scrollTop = 0
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

      {/* Sub-header: KPI */}
      <div
        className="shrink-0 border-b border-border/30 backdrop-blur-sm relative overflow-hidden"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.7s cubic-bezier(0.2,1,0.3,1) 100ms",
          background: "linear-gradient(180deg, hsl(222 40% 10% / 0.6) 0%, hsl(222 47% 6% / 0.4) 100%)",
        }}
      >
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        {/* KPI STATUS LINE */}
        <div className="flex flex-wrap items-center justify-center gap-y-1 py-2.5">
          {KPI_CHIPS.map((chip, i) => (
            <div key={chip.suffix} className="flex items-center">
              <div className="px-4 md:px-5">
                <AnimatedKpiChip chip={chip} active={visible} />
              </div>
              {i < KPI_CHIPS.length - 1 && (
                <div className="w-px h-4 bg-border/40 shrink-0 hidden sm:block" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================
          SCROLL STORYTELLING — continuous narrative flow
          ============================================================ */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 md:p-5">
        <div className="max-w-5xl mx-auto flex flex-col gap-6 md:gap-8">

          {/* ─── MISSION BRIEF ─── */}
          <div
            className="border border-primary/20 bg-card/20 relative overflow-hidden"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.8s cubic-bezier(0.2,1,0.3,1) 200ms",
            }}
          >
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <div className="px-4 md:px-5 py-3 md:py-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 bg-primary animate-pulse" />
                <span className="text-[8px] font-mono text-primary/60 tracking-[0.3em] uppercase">Mission Brief</span>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                During my third year of <span className="text-foreground font-semibold">Licence STAPS — Sport Management</span>, I joined <span className="text-primary font-semibold">AS Nortkerque (ASN95)</span> as Head of Communications for a full season. What started as an internship became a complete digital overhaul — from sponsor activation to visual identity to match-day photography.
              </p>
              <div className="mt-3 pt-3 border-t border-primary/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[8px] font-mono text-primary/40 tracking-[0.3em] uppercase">Starting Point</span>
                  <div className="flex-1 h-px bg-primary/10" />
                </div>
                <p className="text-[11px] md:text-xs text-muted-foreground leading-relaxed">
                  When I arrived, ASN95 had no structured digital presence. No content calendar, no visual guidelines, no recurring formats. Sponsors had zero visibility beyond pitch-side banners. Social media was sporadic — a post here, a score there, no identity. The club had the community, but no voice. My job was to build one from scratch.
                </p>
              </div>
            </div>
          </div>

          {/* ─── ACT 1: ACTIVATION ─── */}
          <ActHeader act="Act I" title="Activation" subtitle="Sponsor engagement through prediction games" icon={Zap} color="hsl(24 95% 53%)" />

          <SponsorV1 visible={visible} />

          {/* V1 → V2 bridge (kept accent-colored like the original) */}
          <div
            className="relative overflow-hidden border-2 border-accent/40 bg-accent/[0.06]"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(12px)",
              transition: "all 0.7s cubic-bezier(0.2,1,0.3,1) 800ms",
            }}
          >
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-accent/[0.04] via-accent/[0.12] to-accent/[0.04] pointer-events-none" />

            <div className="relative flex items-center gap-3 md:gap-5 px-4 md:px-6 py-4 md:py-5">
              <div className="shrink-0 flex items-center gap-1 text-accent/50">
                <span className="text-sm md:text-lg font-mono">{">"}</span>
                <span className="text-sm md:text-lg font-mono">{">"}</span>
                <span className="text-sm md:text-lg font-mono">{">"}</span>
              </div>
              <div className="w-px h-8 bg-accent/30 shrink-0 hidden md:block" />
              <p className="text-xs md:text-sm font-mono text-accent font-bold tracking-wide leading-relaxed flex-1 text-center md:text-left">
                {"The +467% wasn't a campaign. It was a blueprint."}
              </p>
              <div className="w-px h-8 bg-accent/30 shrink-0 hidden md:block" />
              <div className="shrink-0 flex items-center gap-1 text-accent/50">
                <span className="text-sm md:text-lg font-mono">{">"}</span>
                <span className="text-sm md:text-lg font-mono">{">"}</span>
                <span className="text-sm md:text-lg font-mono">{">"}</span>
              </div>
            </div>
          </div>

          <SponsorV2 visible={visible} />

          {/* ─── BRIDGE: ACT 1 → ACT 2 ─── */}
          <NarrativeBridge
            text="The activation proved demand. Now the content had to match the ambition."
            subtext="FROM ENGAGEMENT TO IDENTITY"
          />

          {/* ─── ACT 2: COMMS ─── */}
          <ActHeader act="Act II" title="Comms" subtitle="Building a visual identity week after week" icon={Megaphone} color="hsl(217 91% 60%)" />

          <RevealSection>
            <section className="border-2 border-primary/30 bg-card/30 overflow-hidden relative">
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/6 rounded-full blur-3xl pointer-events-none" />

              <div className="p-4 md:p-5 relative">
                {/* 3-column grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">

                  {/* Column 1 — MATCH POSTERS */}
                  <div className="flex flex-col gap-3">
                    <span className="text-[9px] font-mono font-bold text-primary uppercase tracking-widest">
                      Match Posters
                    </span>
                    <div className="relative group overflow-hidden border border-primary/20 bg-muted aspect-[3/4]">
                      <Image
                        src="/signal/affiche_match_1.webp"
                        alt="Match poster — pre-game announcement"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t border-l border-primary/40" />
                      <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t border-r border-primary/40" />
                      <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b border-l border-primary/40" />
                      <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b border-r border-primary/40" />
                    </div>
                    <p className="text-[10px] md:text-[11px] font-mono text-muted-foreground leading-relaxed">
                      Pre-game announcements. Team identity meets local branding. Date, venue, opponent, sponsors — all in one visual asset.
                    </p>
                  </div>

                  {/* Column 2 — RESULT GRAPHICS */}
                  <div className="flex flex-col gap-3">
                    <span className="text-[9px] font-mono font-bold text-primary uppercase tracking-widest">
                      Result Graphics
                    </span>
                    {/* Stacked images */}
                    <div className="flex flex-col gap-2">
                      <div className="relative group overflow-hidden border border-primary/20 bg-muted aspect-[16/9]">
                        <Image
                          src="/signal/brise_légère.webp"
                          alt="Result graphic — Brise légère"
                          fill
                          className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t border-l border-primary/40" />
                        <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t border-r border-primary/40" />
                        <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b border-l border-primary/40" />
                        <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b border-r border-primary/40" />
                      </div>
                      <div className="relative group overflow-hidden border border-primary/20 bg-muted aspect-[16/9]">
                        <Image
                          src="/signal/le_soleil_tape.webp"
                          alt="Result graphic — Le soleil tape"
                          fill
                          className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t border-l border-primary/40" />
                        <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t border-r border-primary/40" />
                        <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b border-l border-primary/40" />
                        <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b border-r border-primary/40" />
                      </div>
                    </div>
                    {/* Quote block */}
                    <div className="border-l-2 border-accent/60 bg-accent/[0.04] px-3 py-2.5 flex flex-col gap-2">
                      <div>
                        <p className="text-[11px] font-mono leading-relaxed">
                          <span className="text-foreground font-bold">{`"Brise légère, 3 points dans l'air"`}</span>
                          {" — "}
                          <span className="text-muted-foreground italic">Light breeze, 3 points in the air</span>
                        </p>
                        <p className="text-[11px] font-mono leading-relaxed mt-1">
                          <span className="text-foreground font-bold">{`"Le soleil tape ? Nous aussi."`}</span>
                          {" — "}
                          <span className="text-muted-foreground italic">The sun hits hard? So do we.</span>
                        </p>
                      </div>
                      <span className="text-[9px] font-mono text-muted-foreground/70 uppercase tracking-wider">
                        Every result tells a story — not just a score.
                      </span>
                    </div>
                  </div>

                  {/* Column 3 — INTERVIEW SERIES */}
                  <div className="flex flex-col gap-3">
                    <span className="text-[9px] font-mono font-bold text-primary uppercase tracking-widest">
                      Interview Series
                    </span>
                    <div className="relative group overflow-hidden border border-primary/20 bg-muted aspect-[3/4]">
                      <Image
                        src="/signal/interview.webp"
                        alt="Interview series — weekly content"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t border-l border-primary/40" />
                      <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t border-r border-primary/40" />
                      <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b border-l border-primary/40" />
                      <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b border-r border-primary/40" />
                    </div>
                    <p className="text-[10px] md:text-[11px] font-mono text-muted-foreground leading-relaxed">
                      Serialized weekly content. Building recurring engagement around club figures and coaches.
                    </p>
                  </div>
                </div>

                {/* Stat pills */}
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-primary/10">
                  {["15+ visuals / season", "3 recurring formats", "5+ sponsors integrated per visual"].map((stat) => (
                    <span
                      key={stat}
                      className="px-3 py-1.5 border border-primary/20 bg-primary/[0.04] text-[10px] font-mono text-foreground font-bold tracking-wide"
                    >
                      {stat}
                    </span>
                  ))}
                </div>

                {/* Micro-narrative */}
                <div className="mt-4 border-l-2 border-primary/30 bg-primary/[0.03] px-3 py-2">
                  <p className="text-[10px] font-mono text-muted-foreground leading-relaxed italic">
                    There was no brand book when I started — just a badge and a set of colors. The visual language was built week by week: testing layouts, refining typography, finding a tone that felt like the club. By mid-season, the templates were locked and every post was instantly recognizable as ASN95.
                  </p>
                </div>
              </div>
            </section>
          </RevealSection>

          {/* ─── BRIDGE: ACT 2 → ACT 3 ─── */}
          <NarrativeBridge
            text="Every visual needed proof. So we shot it ourselves."
            subtext="FROM DESIGN TO THE PITCH"
          />

          {/* ─── ACT 3: FIELD ─── */}
          <ActHeader act="Act III" title="Field" subtitle="Capturing the club from the sidelines" icon={Camera} color="hsl(160 84% 39%)" />

          <RevealSection>
            <div className="flex items-center gap-2 px-1 mb-3">
              <PhotographerBadge />
            </div>
          </RevealSection>

          <RevealSection delay={100}>
            <section className="border-2 border-primary/30 bg-card/30 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-64 h-64 bg-primary/6 rounded-full blur-3xl pointer-events-none" />

              <div className="p-4 md:p-5 relative">
                {/* 2-column grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">

                  {/* Left — MATCH COVERAGE */}
                  <div className="flex flex-col gap-3">
                    <span className="text-[9px] font-mono font-bold text-primary uppercase tracking-widest">
                      Match Coverage
                    </span>
                    {/* Two images side by side */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative group overflow-hidden border border-primary/20 bg-muted aspect-[3/4]">
                        <Image
                          src="/signal/fond.webp"
                          alt="Match coverage — senior team"
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                        <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t border-l border-primary/40" />
                        <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t border-r border-primary/40" />
                        <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b border-l border-primary/40" />
                        <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b border-r border-primary/40" />
                      </div>
                      <div className="relative group overflow-hidden border border-primary/20 bg-muted aspect-[3/4]">
                        <Image
                          src="/signal/photo_senior_1.jpg"
                          alt="Match coverage — senior team"
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                        <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t border-l border-primary/40" />
                        <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t border-r border-primary/40" />
                        <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b border-l border-primary/40" />
                        <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b border-r border-primary/40" />
                      </div>
                    </div>
                    {/* Stats in orange */}
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-mono text-accent font-bold">
                      <span>33 events covered</span>
                      <span className="text-accent/40">—</span>
                      <span>500+ shots per match</span>
                      <span className="text-accent/40">—</span>
                      <span>~50 delivered per session</span>
                      <span className="text-accent/40">—</span>
                      <span>1,650+ edited photos across one full season</span>
                    </div>
                    {/* Caption */}
                    <p className="text-[10px] md:text-[11px] font-mono text-muted-foreground leading-relaxed">
                      Near-complete season coverage: 26 league matches, 4 youth training camps, 2 general assemblies, and the club{"'"}s 30th anniversary event. From the pitch to the feed.
                    </p>
                    <div className="border-l-2 border-[hsl(160_84%_39%_/_0.4)] bg-[hsl(160_84%_39%_/_0.04)] px-3 py-2">
                      <p className="text-[10px] font-mono text-muted-foreground leading-relaxed italic">
                        Every Sunday at 13:00, same routine — charge batteries, clean lenses, arrive early. Rain, wind, mud. 33 match days, no excuses, no missed games. The players knew me by name by week five. That{"'"}s when the shots started getting real.
                      </p>
                    </div>
                  </div>

                  {/* Right — SPONSOR PHOTOSHOOT */}
                  <div className="flex flex-col gap-3">
                    <span className="text-[9px] font-mono font-bold text-primary uppercase tracking-widest">
                      Sponsor Photoshoot
                    </span>
                    {/* Wide image */}
                    <div className="relative group overflow-hidden border border-primary/20 bg-muted aspect-[16/9]">
                      <Image
                        src="/signal/group_sponsor.webp"
                        alt="Youth academy photoshoot — 50+ players in branded Senlecq kits"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t border-l border-primary/40" />
                      <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t border-r border-primary/40" />
                      <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b border-l border-primary/40" />
                      <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b border-r border-primary/40" />
                    </div>
                    {/* Three portrait images */}
                    <div className="grid grid-cols-3 gap-2">
                      {["photoshoot_individuel_1.jpg", "photoshoot_individuel_2.jpg", "photoshoot_individuel_5.webp"].map((file) => (
                        <div key={file} className="relative group overflow-hidden border border-primary/20 bg-muted aspect-[3/4]">
                          <Image
                            src={`/signal/${file}`}
                            alt="Individual player portrait — sponsor photoshoot"
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                            sizes="(max-width: 768px) 33vw, 16vw"
                          />
                          <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t border-l border-primary/40" />
                          <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t border-r border-primary/40" />
                          <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b border-l border-primary/40" />
                          <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b border-r border-primary/40" />
                        </div>
                      ))}
                    </div>
                    {/* Caption */}
                    <p className="text-[10px] md:text-[11px] font-mono text-muted-foreground leading-relaxed">
                      Youth academy photoshoot — sponsor visibility through authentic club moments. Not a logo on a banner. A brand woven into the heartbeat of the club.
                    </p>
                    <div className="border-l-2 border-[hsl(160_84%_39%_/_0.4)] bg-[hsl(160_84%_39%_/_0.04)] px-3 py-2">
                      <p className="text-[10px] font-mono text-muted-foreground leading-relaxed italic">
                        50+ kids in branded kits, one afternoon, no studio — just the pitch they train on every week. The sponsor got content they actually used. The kids got portraits they were proud of. That{"'"}s the ROI nobody puts in a deck.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Gear line */}
                <div className="mt-4 pt-3 border-t border-primary/10 text-center">
                  <span className="text-[8px] font-mono text-muted-foreground/50 tracking-[0.3em] uppercase">
                    {"GEAR // Sony α6400 + SEL70350G"}
                  </span>
                </div>
              </div>
            </section>
          </RevealSection>

          {/* ─── EPILOGUE ─── */}
          <NarrativeBridge
            text="One season. Three roles. One mission — give a local club the digital presence it deserved."
            subtext="SIGNAL ENDS // TRANSMISSION COMPLETE"
          />

          {/* ─── TAKEAWAYS ─── */}
          <RevealSection delay={100}>
            <div className="border border-primary/20 bg-card/20 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              <div className="px-4 md:px-5 py-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-1.5 bg-primary animate-pulse" />
                  <span className="text-[8px] font-mono text-primary/60 tracking-[0.3em] uppercase">Debrief — Key Takeaways</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-primary/15 bg-primary/[0.03] px-4 py-3">
                    <span className="text-[9px] font-mono font-bold text-primary uppercase tracking-widest block mb-2">01 — Consistency wins</span>
                    <p className="text-[10px] md:text-[11px] font-mono text-muted-foreground leading-relaxed">
                      Showing up every week matters more than any single viral post. The audience grew because they knew what to expect and when to expect it.
                    </p>
                  </div>
                  <div className="border border-primary/15 bg-primary/[0.03] px-4 py-3">
                    <span className="text-[9px] font-mono font-bold text-primary uppercase tracking-widest block mb-2">02 — Sponsors need stories</span>
                    <p className="text-[10px] md:text-[11px] font-mono text-muted-foreground leading-relaxed">
                      A logo on a banner is invisible. A sponsor woven into weekly content, prediction games, and photoshoots becomes part of the club{"'"}s identity.
                    </p>
                  </div>
                  <div className="border border-primary/15 bg-primary/[0.03] px-4 py-3">
                    <span className="text-[9px] font-mono font-bold text-primary uppercase tracking-widest block mb-2">03 — Build, then scale</span>
                    <p className="text-[10px] md:text-[11px] font-mono text-muted-foreground leading-relaxed">
                      The prediction game started with a Google Form. It didn{"'"}t need to be perfect — it needed to prove the concept. V2 exists because V1 worked.
                    </p>
                  </div>
                </div>

                {/* Forward link */}
                <div className="mt-4 pt-3 border-t border-primary/10 text-center">
                  <span className="text-[9px] font-mono text-muted-foreground/60 tracking-wide">
                    These principles now guide how I approach every project.
                  </span>
                </div>
              </div>
            </div>
          </RevealSection>

          {/* Scroll spacer so the last section isn't cramped */}
          <div className="h-8" />

        </div>
      </div>

      {/* Bottom bar */}
      <footer
        className="h-6 flex items-center justify-between px-4 md:px-6 border-t border-border/30 bg-card/20 backdrop-blur shrink-0"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 0.5s 300ms" }}
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
