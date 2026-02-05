"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  X,
  Activity,
  Eye,
  Users,
  Heart,
  TrendingUp,
  Zap,
  Trophy,
  MonitorPlay,
  Clock,
  Target,
  Radio,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const METRICS = [
  {
    icon: Eye,
    label: "Total Views",
    value: "1.0M",
    sub: "Facebook reach",
    trend: null,
    spark: [35, 32, 30, 25, 22, 18, 15, 12, 8, 5, 3],
  },
  {
    icon: Users,
    label: "Reach",
    value: "44K",
    sub: "Unique accounts",
    trend: "+24%",
    spark: [30, 28, 32, 25, 27, 20, 18, 22, 15, 12, 10],
  },
  {
    icon: Heart,
    label: "Engagement",
    value: "24.2K",
    sub: "Total interactions",
    trend: "+93.8%",
    spark: [35, 33, 30, 28, 25, 20, 18, 15, 12, 8, 5],
  },
  {
    icon: TrendingUp,
    label: "Growth",
    value: "+28.2%",
    sub: "Follower increase",
    trend: "+28.2%",
    spark: [38, 35, 32, 30, 28, 24, 20, 18, 15, 10, 8],
  },
]

const SECONDARY_METRICS = [
  { label: "Visits", value: "93K", trend: "+10.3%", icon: MonitorPlay },
  { label: "Watch Time", value: "11d 23h", trend: "+162%", icon: Clock },
]

const ACHIEVEMENTS = [
  { text: "Engagement", detail: "+93.8% (24.2K)" },
  { text: "Watch time", detail: "+162% (11d 23h)" },
  { text: "Reach", detail: "1M views" },
]

const SPONSOR_METRICS = [
  { label: "Link Clicks", value: "+467%", color: "accent" },
  { label: "Engagement", value: "High", color: "foreground" },
  { label: "Data Capture", value: "YES", color: "green" },
  { label: "ROI", value: "Positive", color: "green" },
]

/* ------------------------------------------------------------------ */
/*  Animated counter                                                   */
/* ------------------------------------------------------------------ */
function useCountUp(target: string, start: boolean, duration = 1600) {
  const [display, setDisplay] = useState("0")
  const hasRun = useRef(false)

  useEffect(() => {
    if (!start || hasRun.current) return
    hasRun.current = true

    const isPercent = target.includes("%")
    const isPlus = target.startsWith("+")
    const cleaned = target.replace(/[+%KMdh ]/g, "")
    const isDecimal = cleaned.includes(".")
    const numericEnd = Number.parseFloat(cleaned)

    if (Number.isNaN(numericEnd)) {
      setDisplay(target)
      return
    }

    const suffix = target.replace(/[\d.+-]/g, "")
    const prefix = isPlus ? "+" : ""
    const startTime = performance.now()

    function tick(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = numericEnd * eased

      if (isDecimal) {
        setDisplay(`${prefix}${current.toFixed(1)}${suffix}`)
      } else {
        setDisplay(`${prefix}${Math.round(current)}${suffix}`)
      }

      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [start, target, duration])

  return display
}

/* ------------------------------------------------------------------ */
/*  Mini sparkline SVG                                                 */
/* ------------------------------------------------------------------ */
function Sparkline({ data, active }: { data: number[]; active: boolean }) {
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * 100},${v}`)
    .join(" ")

  return (
    <svg viewBox="0 0 100 40" className="w-full h-7 mt-1.5" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="1.8"
        opacity={active ? 0.7 : 0.2}
        points={points}
        className="transition-opacity duration-1000"
      />
      {active && (
        <circle cx="100" cy={data[data.length - 1]} r="2.5" fill="hsl(var(--primary))">
          <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
        </circle>
      )}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Waveform intro animation                                           */
/* ------------------------------------------------------------------ */
function WaveformIntro({ onDone }: { onDone: () => void }) {
  const [bandwidth, setBandwidth] = useState(0)

  useEffect(() => {
    const start = performance.now()
    function tick(now: number) {
      const p = Math.min((now - start) / 2200, 1)
      setBandwidth(Math.round(p * 128))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)

    const t = setTimeout(onDone, 2800)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background">
      {/* Waveform bars */}
      <div className="flex items-end gap-1 h-12 mb-6">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="w-1 bg-primary rounded-full"
            style={{
              animation: `wave-bar 0.6s ${i * 0.04}s ease-in-out infinite alternate`,
              height: `${12 + Math.random() * 36}px`,
            }}
          />
        ))}
      </div>

      <p className="font-mono text-primary text-sm tracking-widest animate-pulse">
        ESTABLISHING UPLINK...
      </p>
      <p className="font-mono text-muted-foreground text-[10px] mt-2">
        ENCRYPTION: BLUE-CHANNEL // <span className="text-primary tabular-nums">{bandwidth}</span> TB/s
      </p>

      {/* Progress bar */}
      <div className="w-48 h-[2px] bg-border mt-5 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-100"
          style={{ width: `${(bandwidth / 128) * 100}%` }}
        />
      </div>

      {/* Skip */}
      <button
        onClick={onDone}
        type="button"
        className="absolute bottom-8 text-[9px] font-mono text-muted-foreground hover:text-foreground transition tracking-widest"
      >
        [ SKIP UPLINK ]
      </button>

      <style>{`
        @keyframes wave-bar {
          0% { transform: scaleY(0.3); }
          100% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Metric Card                                                        */
/* ------------------------------------------------------------------ */
function MetricCard({
  metric,
  index,
  visible,
}: {
  metric: (typeof METRICS)[0]
  index: number
  visible: boolean
}) {
  const Icon = metric.icon
  const count = useCountUp(metric.value, visible)

  return (
    <div
      className="relative bg-card/60 border border-primary/20 p-3 overflow-hidden group hover:border-primary/50 transition-all duration-500 rounded-sm"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `all 0.6s cubic-bezier(0.2,1,0.3,1) ${200 + index * 100}ms`,
      }}
    >
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-xl" />

      <div className="relative">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Icon className="w-3 h-3 text-primary" />
            <span className="text-[7px] font-mono text-muted-foreground uppercase tracking-wider">
              {metric.label}
            </span>
          </div>
          {metric.trend && (
            <span className="text-[8px] font-bold text-[hsl(var(--field-green))] px-1.5 py-0.5 bg-[hsl(var(--field-green))]/10 border border-[hsl(var(--field-green))]/30 rounded font-mono">
              {metric.trend}
            </span>
          )}
        </div>

        <div className="text-2xl font-bold text-foreground font-mono mb-0.5 tabular-nums">
          {count}
        </div>
        <div className="text-[8px] text-muted-foreground font-mono">{metric.sub}</div>

        <Sparkline data={metric.spark} active={visible} />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Sponsor Activation Block                                           */
/* ------------------------------------------------------------------ */
function SponsorActivation({ visible }: { visible: boolean }) {
  const ctrCount = useCountUp("+467%", visible)

  return (
    <div
      className="border-2 border-accent/40 rounded-sm bg-gradient-to-br from-accent/10 via-accent/5 to-transparent relative overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.8s cubic-bezier(0.2,1,0.3,1) 900ms",
      }}
    >
      <div className="absolute top-0 right-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />

      {/* Header */}
      <div className="relative border-b border-accent/25 p-3 bg-card/30">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-4 h-4 text-accent" />
          <span className="text-[10px] font-bold text-accent uppercase tracking-wider font-tech">
            Sponsor Activation
          </span>
        </div>
        <div className="text-3xl font-bold text-accent font-mono tabular-nums">{ctrCount}</div>
        <div className="text-[9px] text-muted-foreground font-mono uppercase">Click-Through Rate Explosion</div>
      </div>

      {/* Body */}
      <div className="relative p-3">
        <h3 className="text-sm font-bold text-foreground mb-1 font-tech">
          {"\"Les Pronos du Sultan\""}
        </h3>
        <p className="text-[9px] text-muted-foreground font-mono leading-relaxed mb-2">
          Gamification campaign with Sultan Kebab. Followers submit predictions via form, top 3 win free meals.
        </p>
        <div className="flex items-center gap-1.5 text-[8px] text-accent font-mono font-bold mb-3">
          <Target className="w-3 h-3" />
          Drive engagement + capture data
        </div>

        {/* Sponsor metrics */}
        <div className="grid grid-cols-2 gap-1.5">
          {SPONSOR_METRICS.map((m) => (
            <div key={m.label} className="bg-card/50 p-2 border border-accent/20 rounded-sm text-center">
              <div className="text-[7px] text-muted-foreground uppercase mb-0.5 font-mono">{m.label}</div>
              <div
                className={`text-sm font-bold font-mono ${
                  m.color === "accent"
                    ? "text-accent"
                    : m.color === "green"
                      ? "text-[hsl(var(--field-green))]"
                      : "text-foreground"
                }`}
              >
                {m.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Panel                                                         */
/* ------------------------------------------------------------------ */
export function SignalPanel({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [showIntro, setShowIntro] = useState(true)
  const [visible, setVisible] = useState(false)

  const handleIntroDone = useCallback(() => {
    setShowIntro(false)
    requestAnimationFrame(() => setVisible(true))
  }, [])

  // Reset on close
  useEffect(() => {
    if (!open) {
      setShowIntro(true)
      setVisible(false)
    }
  }, [open])

  // ESC key
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col">
      {/* Intro */}
      {showIntro && <WaveformIntro onDone={handleIntroDone} />}

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
          <Activity className="w-3.5 h-3.5 text-primary animate-pulse" />
          <h2 className="text-foreground font-tech text-sm tracking-widest uppercase">
            Social Command: <span className="text-primary">ASN95</span>
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4 text-[8px] font-mono text-muted-foreground">
            <span>
              ROLE: <span className="text-primary font-bold">HEAD OF COMMS</span>
            </span>
            <span className="text-border">|</span>
            <span>
              STATUS: <span className="text-[hsl(var(--field-green))] font-bold">DEPLOYED</span>
            </span>
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
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 md:gap-4">

            {/* LEFT COLUMN: Metrics & Content (3 cols on lg) */}
            <div className="lg:col-span-3 flex flex-col gap-3">

              {/* Main metrics grid */}
              <div className="grid grid-cols-2 gap-2">
                {METRICS.map((m, i) => (
                  <MetricCard key={m.label} metric={m} index={i} visible={visible} />
                ))}
              </div>

              {/* Role badge */}
              <div
                className="bg-card/30 border border-primary/15 p-2 rounded-sm text-center"
                style={{
                  opacity: visible ? 1 : 0,
                  transition: "opacity 0.6s 600ms",
                }}
              >
                <p className="text-[8px] font-mono text-muted-foreground uppercase">
                  Position:{" "}
                  <span className="text-primary">Head of Communication & Digital/Sponsor Dev. Manager</span>
                </p>
              </div>

              {/* Secondary metrics */}
              <div className="grid grid-cols-2 gap-2">
                {SECONDARY_METRICS.map((m, i) => {
                  const Icon = m.icon
                  return (
                    <div
                      key={m.label}
                      className="bg-card/40 border border-border p-2.5 rounded-sm hover:border-primary/40 transition group"
                      style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? "translateY(0)" : "translateY(12px)",
                        transition: `all 0.5s cubic-bezier(0.2,1,0.3,1) ${700 + i * 80}ms`,
                      }}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <Icon className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-[7px] text-muted-foreground font-mono uppercase">{m.label}</span>
                      </div>
                      <div className="text-lg font-bold text-foreground font-mono">{m.value}</div>
                      <div className="text-[8px] text-[hsl(var(--field-green))] font-mono font-bold mt-0.5">
                        {"^"} {m.trend}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Top Content placeholder tiles */}
              <div
                style={{
                  opacity: visible ? 1 : 0,
                  transition: "opacity 0.7s 850ms",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Radio className="w-3.5 h-3.5 text-primary" />
                  <h3 className="text-foreground font-tech text-xs uppercase tracking-wider">Top Content</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {["MATCH DAY 1", "MATCH RESULT 1", "MATCH RESULT 2"].map((label, i) => (
                    <div
                      key={label}
                      className={`relative h-28 md:h-32 bg-card border border-border rounded-sm overflow-hidden group hover:border-primary/50 transition-all ${i === 2 ? "hidden md:block" : ""}`}
                    >
                      {/* Simulated content pattern */}
                      <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity">
                        <div
                          className="w-full h-full"
                          style={{
                            backgroundImage: `repeating-linear-gradient(
                              0deg,
                              hsl(var(--primary) / 0.08),
                              hsl(var(--primary) / 0.08) 1px,
                              transparent 1px,
                              transparent 6px
                            )`,
                          }}
                        />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[8px] font-mono text-muted-foreground uppercase tracking-wider bg-card/80 px-2 py-1 border border-border rounded-sm">
                          {label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div
                className="bg-card/40 border border-[hsl(var(--field-green))]/25 rounded-sm overflow-hidden"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(12px)",
                  transition: "all 0.6s cubic-bezier(0.2,1,0.3,1) 950ms",
                }}
              >
                <div className="h-7 border-b border-[hsl(var(--field-green))]/15 bg-gradient-to-r from-[hsl(var(--field-green))]/8 to-transparent flex items-center px-3">
                  <Trophy className="w-3 h-3 text-[hsl(var(--field-green))] mr-1.5" />
                  <span className="text-[8px] font-bold text-foreground uppercase tracking-widest font-tech">
                    Key Achievements
                  </span>
                </div>
                <div className="p-2.5 flex flex-col gap-1.5">
                  {ACHIEVEMENTS.map((a) => (
                    <div key={a.text} className="flex items-center gap-1.5 text-[8px]">
                      <TrendingUp className="w-2.5 h-2.5 text-[hsl(var(--field-green))] shrink-0" />
                      <span className="text-muted-foreground font-mono">
                        {a.text}{" "}
                        <span className="text-[hsl(var(--field-green))] font-bold">{a.detail}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Sponsor Activation (2 cols on lg) */}
            <div className="lg:col-span-2">
              <SponsorActivation visible={visible} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <footer
        className="h-6 flex items-center justify-between px-4 md:px-6 border-t border-border/30 bg-card/20 backdrop-blur shrink-0"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.5s 1200ms",
        }}
      >
        <div className="flex items-center gap-3 text-[7px] font-mono text-muted-foreground">
          <span>
            CHANNEL: <span className="text-primary">SOCIAL-MEDIA</span>
          </span>
          <span className="hidden sm:inline">
            ENCRYPTION: <span className="text-[hsl(var(--field-green))]">ACTIVE</span>
          </span>
        </div>
        <div className="text-[7px] font-mono text-muted-foreground">
          BANDWIDTH: <span className="text-foreground">128 TB/s</span>
        </div>
      </footer>
    </div>
  )
}
