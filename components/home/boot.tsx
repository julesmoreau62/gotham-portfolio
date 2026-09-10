"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { PROFILE, SITE } from "@/lib/profile"
import { getLenis } from "@/components/fx/smooth-scroll"

const BootCtx = createContext(false)
export const useBooted = () => useContext(BootCtx)

const KEY = "mrtn-booted"

export function BootProvider({ children }: { children: React.ReactNode }) {
  const [booted, setBooted] = useState(false)
  const [showLoader, setShowLoader] = useState(false)

  useEffect(() => {
    let already = false
    try {
      already = !!sessionStorage.getItem(KEY)
    } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (already || reduce) {
      setBooted(true)
    } else {
      setShowLoader(true)
    }
  }, [])

  const done = useCallback(() => {
    try {
      sessionStorage.setItem(KEY, "1")
    } catch {}
    setBooted(true)
    window.setTimeout(() => setShowLoader(false), 900)
  }, [])

  return (
    <BootCtx.Provider value={booted}>
      {showLoader && <Loader onDone={done} />}
      {children}
    </BootCtx.Provider>
  )
}

const STATUS = [
  "INITIALIZING RUNNER PROFILE",
  "LOADING OPERATIONS MODULES",
  "SYNCING CONTRACTS [07]",
  "CALIBRATING INTERFACE",
  "SYSTEMS NOMINAL",
]

function Loader({ onDone }: { onDone: () => void }) {
  const [p, setP] = useState(0)
  const [phase, setPhase] = useState<"run" | "flash" | "exit">("run")
  const finished = useRef(false)

  const finish = useCallback(() => {
    if (finished.current) return
    finished.current = true
    setP(100)
    setPhase("flash")
    window.setTimeout(() => setPhase("exit"), 140)
    window.setTimeout(onDone, 220)
  }, [onDone])

  useEffect(() => {
    document.documentElement.classList.add("lenis-stopped")
    document.documentElement.style.overflow = "hidden"
    getLenis()?.stop()
    const mobile = window.innerWidth < 768
    const duration = mobile ? 1300 : 2100
    const t0 = performance.now()
    let raf = 0
    const tick = (now: number) => {
      if (finished.current) return
      const x = Math.min((now - t0) / duration, 1)
      // Stepped, slightly irregular progress — reads as "loading", not a tween.
      const eased = x < 0.85 ? x * 1.02 : 0.867 + (x - 0.85) * 0.887
      setP(Math.min(99, Math.floor(eased * 100)))
      if (x < 1) raf = requestAnimationFrame(tick)
      else finish()
    }
    raf = requestAnimationFrame(tick)
    const skip = () => finish()
    window.addEventListener("keydown", skip)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("keydown", skip)
      document.documentElement.classList.remove("lenis-stopped")
      document.documentElement.style.overflow = ""
      getLenis()?.start()
    }
  }, [finish])

  const statusIdx = Math.min(Math.floor((p / 100) * STATUS.length), STATUS.length - 1)
  const exiting = phase === "exit"

  return (
    <div
      className="fixed inset-0 z-[300] select-none bg-bg text-ink"
      onClick={finish}
      role="status"
      aria-live="polite"
      aria-label="Loading"
      style={{
        clipPath: exiting ? "inset(0 0 100% 0)" : "inset(0 0 0 0)",
        transition: exiting ? "clip-path 0.75s cubic-bezier(0.76, 0, 0.24, 1)" : "none",
      }}
    >
      <div className="absolute inset-0 grid-fine opacity-40" aria-hidden="true" />

      {/* Corner telemetry */}
      <div className="absolute left-5 top-5 label text-mute md:left-8 md:top-7">
        {"RUNNER PROFILE // J.MOREAU"}
      </div>
      <div className="absolute right-5 top-5 label text-mute md:right-8 md:top-7">
        {`${SITE.version} // ${SITE.year}`}
      </div>
      <div className="absolute bottom-5 left-5 label text-acid md:bottom-7 md:left-8">
        <span className="inline-block h-1.5 w-1.5 bg-acid mr-2 animate-blink align-middle" />
        {STATUS[statusIdx]}
      </div>
      <div className="absolute bottom-5 right-5 label text-mute md:bottom-7 md:right-8 hidden sm:block">
        {`${PROFILE.coords} // LILLE`}
      </div>

      {/* Counter */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="display-black tnum text-[clamp(96px,22vw,340px)] leading-none">
          {String(p).padStart(3, "0")}
        </div>
        <div className="mt-6 h-[3px] w-[min(60vw,520px)] bg-ink/10">
          <div className="h-full bg-acid" style={{ width: `${p}%`, transition: "width 80ms linear" }} />
        </div>
        <div className="mt-4 label text-mute [@media(max-height:560px)]:hidden">click / any key to skip</div>
      </div>

      {/* Hazard stripe */}
      <div className="absolute inset-x-0 bottom-0 h-1.5 hazard opacity-70" style={{ ["--accent" as string]: "#c8ff00" }} aria-hidden="true" />

      {/* Flash */}
      {phase !== "run" && (
        <div className="absolute inset-0 bg-acid" style={{ animation: "flash-acid 0.35s ease-out forwards" }} aria-hidden="true" />
      )}
    </div>
  )
}
