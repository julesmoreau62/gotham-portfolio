"use client"

import { useEffect, useState, useCallback } from "react"
import { ChevronRight } from "lucide-react"

interface TypingIntroProps {
  onComplete: () => void
}

function useTypewriter(text: string, speed = 40, startDelay = 0, enabled = true) {
  const [displayed, setDisplayed] = useState("")
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!enabled) return
    let i = 0
    let timeout: ReturnType<typeof setTimeout>

    const startTimeout = setTimeout(() => {
      const type = () => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1))
          i++
          timeout = setTimeout(type, speed)
        } else {
          setDone(true)
        }
      }
      type()
    }, startDelay)

    return () => {
      clearTimeout(startTimeout)
      clearTimeout(timeout)
    }
  }, [text, speed, startDelay, enabled])

  return { displayed, done }
}

export function TypingIntro({ onComplete }: TypingIntroProps) {
  const [phase, setPhase] = useState(0)
  const [showButton, setShowButton] = useState(false)
  const [exiting, setExiting] = useState(false)

  const name = useTypewriter("JULES MOREAU", 60, 500, phase >= 0)
  const role = useTypewriter("M1 STAPS ISA // HEAD OF COMMS @ ASN95", 30, 0, phase >= 1)
  const clearance = useTypewriter("LEVEL 4 - FULL ACCESS", 40, 0, phase >= 2)
  const bio = useTypewriter(
    "Operative specialized in sport management, event logistics, digital communication strategy, and competitive intelligence. Former Marine Nationale Reserve. Currently tracking BLAST ApS operations.",
    15,
    0,
    phase >= 3
  )

  useEffect(() => {
    if (name.done && phase === 0) setPhase(1)
  }, [name.done, phase])

  useEffect(() => {
    if (role.done && phase === 1) setPhase(2)
  }, [role.done, phase])

  useEffect(() => {
    if (clearance.done && phase === 2) setPhase(3)
  }, [clearance.done, phase])

  useEffect(() => {
    if (bio.done && phase === 3) {
      const timer = setTimeout(() => setShowButton(true), 400)
      return () => clearTimeout(timer)
    }
  }, [bio.done, phase])

  const handleEnter = useCallback(() => {
    setExiting(true)
    setTimeout(onComplete, 600)
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 z-[100] bg-background flex items-center justify-center overflow-y-auto transition-all duration-600 ${exiting ? "opacity-0 scale-110 blur-sm" : "opacity-100"}`}
    >
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none tactical-grid" />

      {/* Scanline */}
      <div
        className="absolute left-0 w-full h-[1px] bg-primary/20 pointer-events-none"
        style={{ animation: "scan-line 4s linear infinite" }}
      />

      <div className="max-w-2xl w-full p-8 relative">
        {/* Glitch header */}
        <div
          className={`flex items-center gap-3 mb-8 transition-all duration-700 ${phase >= 0 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div className="w-2 h-2 bg-destructive animate-pulse rounded-sm" />
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tighter font-tech animate-glitch">
            TARGET_IDENTIFIED
          </h1>
        </div>

        <div className="space-y-5 text-sm font-mono">
          {/* Name */}
          <div className="flex gap-4 border-b border-border pb-2">
            <span className="text-muted-foreground w-28 text-xs uppercase tracking-widest shrink-0">
              Operative
            </span>
            <span className="text-foreground font-bold">
              {name.displayed}
              {!name.done && (
                <span className="inline-block w-[2px] h-[14px] bg-foreground ml-0.5 align-middle" style={{ animation: "cursor-blink 1s step-end infinite" }} />
              )}
            </span>
          </div>

          {/* Role */}
          {phase >= 1 && (
            <div className="flex gap-4 border-b border-border pb-2 animate-fade-in">
              <span className="text-muted-foreground w-28 text-xs uppercase tracking-widest shrink-0">
                Rank/Role
              </span>
              <span className="text-primary">
                {role.displayed}
                {!role.done && (
                  <span className="inline-block w-[2px] h-[14px] bg-primary ml-0.5 align-middle" style={{ animation: "cursor-blink 1s step-end infinite" }} />
                )}
              </span>
            </div>
          )}

          {/* Clearance */}
          {phase >= 2 && (
            <div className="flex gap-4 border-b border-border pb-2 animate-fade-in">
              <span className="text-muted-foreground w-28 text-xs uppercase tracking-widest shrink-0">
                Clearance
              </span>
              <span className="text-accent">
                {clearance.displayed}
                {!clearance.done && (
                  <span className="inline-block w-[2px] h-[14px] bg-accent ml-0.5 align-middle" style={{ animation: "cursor-blink 1s step-end infinite" }} />
                )}
              </span>
            </div>
          )}

          {/* Bio */}
          {phase >= 3 && (
            <div className="mt-8 p-4 bg-foreground/5 border-l-2 border-primary rounded-r animate-fade-in">
              <p className="text-[11px] leading-relaxed text-foreground/70 font-sans">
                {bio.displayed}
                {!bio.done && (
                  <span className="inline-block w-[2px] h-[12px] bg-foreground/70 ml-0.5 align-middle" style={{ animation: "cursor-blink 1s step-end infinite" }} />
                )}
              </p>
            </div>
          )}
        </div>

        {/* Enter button */}
        <button
          onClick={handleEnter}
          className={`mt-10 group relative w-fit transition-all duration-700 ${showButton ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-[hsl(var(--field-green))] rounded opacity-50 blur group-hover:opacity-100 transition" />
          <div className="relative bg-background px-8 py-3 flex items-center gap-3 rounded-sm">
            <span className="text-xs font-bold text-foreground uppercase tracking-[0.2em]">
              Access Interface
            </span>
            <ChevronRight className="w-4 h-4 text-foreground group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>
    </div>
  )
}
