"use client"

import { useEffect, useState, useCallback, useRef } from "react"

interface BootSequenceProps {
  onComplete: () => void
}

const BOOT_LINES = [
  { text: "GOTHAM TACTICAL OS v2.7.1", delay: 0, type: "header" },
  { text: "Initializing kernel...", delay: 100, type: "system" },
  { text: "[OK] Memory check: 16384 MB available", delay: 200, type: "ok" },
  { text: "[OK] Network interface: ENCRYPTED TUNNEL", delay: 300, type: "ok" },
  { text: "[OK] Biometric scanner: ONLINE", delay: 400, type: "ok" },
  { text: "[WARN] Threat level: ELEVATED", delay: 500, type: "warn" },
  { text: "Loading agent profile...", delay: 650, type: "system" },
  { text: ">>  AGENT: JULES MOREAU", delay: 800, type: "agent" },
  { text: ">>  RANK: M1 STAPS ISA", delay: 950, type: "agent" },
  { text: ">>  CLEARANCE: LEVEL 4 - FULL ACCESS", delay: 1100, type: "clearance" },
  { text: ">>  STATUS: ACTIVE OPERATIVE", delay: 1250, type: "status" },
  { text: "Loading tactical modules...", delay: 1400, type: "system" },
  { text: "[OK] STRATEGY module loaded", delay: 1500, type: "ok" },
  { text: "[OK] FIELD OPS module loaded", delay: 1575, type: "ok" },
  { text: "[OK] SIGNAL module loaded", delay: 1650, type: "ok" },
  { text: "[OK] IMAGERY module loaded", delay: 1725, type: "ok" },
  { text: "[OK] INTEL CORE module loaded", delay: 1800, type: "ok" },
  { text: "", delay: 1900, type: "blank" },
  { text: "All systems operational. Launching interface...", delay: 1900, type: "launch" },
]

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [visibleLines, setVisibleLines] = useState<number[]>([])
  const [exiting, setExiting] = useState(false)
  const [showSkip, setShowSkip] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const completedRef = useRef(false)

  const handleComplete = useCallback(() => {
    if (completedRef.current) return
    completedRef.current = true
    setExiting(true)
    setTimeout(onComplete, 800)
  }, [onComplete])

  useEffect(() => {
    const skipTimer = setTimeout(() => setShowSkip(true), 400)
    const timers: ReturnType<typeof setTimeout>[] = []

    for (const line of BOOT_LINES) {
      timers.push(
        setTimeout(() => {
          setVisibleLines((prev) => [...prev, BOOT_LINES.indexOf(line)])
        }, line.delay)
      )
    }

    // Auto-complete after last line
    timers.push(setTimeout(() => handleComplete(), 2400))

    return () => {
      clearTimeout(skipTimer)
      for (const t of timers) clearTimeout(t)
    }
  }, [handleComplete])

  // Auto scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [visibleLines])

  const getLineColor = (type: string) => {
    switch (type) {
      case "header": return "text-[hsl(var(--neon-cyan))]"
      case "ok": return "text-[hsl(var(--field-green))]"
      case "warn": return "text-accent"
      case "agent": return "text-primary"
      case "clearance": return "text-accent"
      case "status": return "text-[hsl(var(--field-green))]"
      case "launch": return "text-foreground font-bold"
      case "system": return "text-muted-foreground"
      default: return "text-muted-foreground"
    }
  }

  return (
    <div
      className={`fixed inset-0 z-[100] bg-background flex flex-col transition-all duration-800 ${exiting ? "opacity-0 translate-y-[-20px]" : "opacity-100"}`}
    >
      {/* Scan line overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
        }}
      />

      {/* CRT vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-20">
        <div
          ref={containerRef}
          className="w-full max-w-2xl font-mono text-xs leading-relaxed overflow-y-auto max-h-[70vh] space-y-1"
        >
          {BOOT_LINES.filter((_, i) => visibleLines.includes(i)).map((line, i) => (
            <div
              key={`boot-${i}`}
              className={`${getLineColor(line.type)} transition-opacity duration-200`}
              style={{ opacity: 1 }}
            >
              {line.text}
            </div>
          ))}

          {/* Blinking cursor */}
          <span
            className="inline-block w-2 h-4 bg-[hsl(var(--neon-cyan))] ml-1"
            style={{ animation: "cursor-blink 0.8s step-end infinite" }}
          />
        </div>

        {/* Skip button */}
        {showSkip && !exiting && (
          <button
            onClick={handleComplete}
            className="absolute bottom-10 text-[10px] font-mono text-muted-foreground/50 hover:text-foreground transition-colors tracking-widest uppercase"
          >
            {'[PRESS TO SKIP]'}
          </button>
        )}
      </div>

      {/* Bottom progress bar */}
      <div className="h-1 w-full bg-secondary relative overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary via-[hsl(var(--neon-cyan))] to-[hsl(var(--field-green))] transition-all duration-300"
          style={{
            width: `${(visibleLines.length / BOOT_LINES.length) * 100}%`,
          }}
        />
      </div>
    </div>
  )
}
