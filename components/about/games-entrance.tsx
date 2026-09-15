"use client"

import { useEffect, useRef, useState } from "react"
import { getLenis } from "@/components/fx/smooth-scroll"
import styles from "./games.module.css"

export function GamesEntrance({ settled, onComplete }: { settled: boolean; onComplete: () => void }) {
  const [held, setHeld] = useState(false)
  const [exiting, setExiting] = useState(false)
  const skipRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (preference.matches) {
      onComplete()
      return
    }

    const overflow = document.documentElement.style.overflow
    const lenis = getLenis()
    document.documentElement.style.overflow = "hidden"
    lenis?.stop()
    skipRef.current?.focus({ preventScroll: true })
    const minimum = window.setTimeout(() => setHeld(true), 3000)
    // A slow or missing video must never prevent access to the page.
    const maximum = window.setTimeout(() => setExiting(true), 6000)
    const onPreference = () => { if (preference.matches) onComplete() }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        onComplete()
      }
      if (event.key === "Tab") {
        event.preventDefault()
        skipRef.current?.focus()
      }
    }
    preference.addEventListener("change", onPreference)
    window.addEventListener("keydown", onKey)
    return () => {
      window.clearTimeout(minimum)
      window.clearTimeout(maximum)
      preference.removeEventListener("change", onPreference)
      window.removeEventListener("keydown", onKey)
      document.documentElement.style.overflow = overflow
      lenis?.start()
    }
  }, [onComplete])

  useEffect(() => {
    if (held && settled) setExiting(true)
  }, [held, settled])

  useEffect(() => {
    if (!exiting) return
    const timer = window.setTimeout(onComplete, 650)
    return () => window.clearTimeout(timer)
  }, [exiting, onComplete])

  return (
    <div className={styles.entrance} data-exiting={exiting} role="dialog" aria-modal="true" aria-labelledby="games-intro-title" aria-describedby="games-intro-description">
      <div className={styles.introGrid} aria-hidden="true" />
      <div className={styles.introTop}><span>JM / Personal archive</span><span>File 02 — Gaming</span></div>
      <div className={styles.introContent}>
        <span className={styles.introKicker}>Beyond the profile</span>
        <h2 id="games-intro-title"><span>Every game.</span><span>A part of <i>me.</i></span></h2>
        <p id="games-intro-description">The competition, the worlds, and the moments that stayed with me.</p>
        <div className={styles.introSequence} aria-hidden="true"><span>01 / Compete</span><span>02 / Create</span><span>03 / Repeat</span></div>
      </div>
      <div className={styles.introBottom}>
        <div><span className={styles.loadingLine} aria-hidden="true" /><span role="status">{settled ? "Opening my gaming story" : "Preparing background film"}</span></div>
        <button ref={skipRef} type="button" onClick={onComplete}>Skip intro <span aria-hidden="true">↗</span></button>
      </div>
    </div>
  )
}
