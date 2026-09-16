"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { getLenis } from "@/components/fx/smooth-scroll"
import { GAMES } from "@/lib/games"
import styles from "./games-entrance.module.css"

const SEQUENCE_MS = 2600
const REVEAL_MS = 1000

export function GamesEntrance({ settled, onReveal, onComplete }: { settled: boolean; onReveal: () => void; onComplete: () => void }) {
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
    const minimum = window.setTimeout(() => setHeld(true), SEQUENCE_MS)
    // A slow or missing video must never prevent access to the page.
    const maximum = window.setTimeout(() => setExiting(true), 4000)
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
    onReveal()
    const timer = window.setTimeout(onComplete, REVEAL_MS)
    return () => window.clearTimeout(timer)
  }, [exiting, onReveal, onComplete])

  return (
    <div className={styles.entrance} data-exiting={exiting} style={{ "--sequence-duration": `${SEQUENCE_MS}ms`, "--reveal-duration": `${REVEAL_MS}ms` } as CSSProperties} role="dialog" aria-modal="true" aria-labelledby="games-intro-title" aria-describedby="games-intro-description">
      <div className={`${styles.shutter} ${styles.shutterTop}`} aria-hidden="true" />
      <div className={`${styles.shutter} ${styles.shutterBottom}`} aria-hidden="true" />
      <div className={styles.atmosphere} aria-hidden="true" />
      <div className={styles.scan} aria-hidden="true" />
      <div className={styles.topline}>
        <span><i aria-hidden="true" /> JM / Personal archive</span>
        <span>Chapter 02 <span className={styles.toplineDetail}>/ Beyond the profile</span></span>
      </div>
      <div className={styles.stage}>
        <div className={styles.scope} aria-hidden="true">
          <svg className={styles.orbit} viewBox="0 0 400 400" fill="none">
            <circle className={styles.orbitTrack} cx="200" cy="200" r="183" />
            <circle className={styles.orbitArc} cx="200" cy="200" r="183" pathLength="1" />
            <circle className={styles.orbitInner} cx="200" cy="200" r="152" />
            <path className={styles.orbitTicks} d="M200 8v24 M200 368v24 M8 200h24 M368 200h24 M64 64l12 12 M324 324l12 12 M64 336l12-12 M324 76l12-12" />
          </svg>
          <div className={styles.target}><i /><i /><i /><i /><span>+</span></div>
          <span className={styles.scopeLabel}>One more game.</span>
        </div>
        <div className={styles.copy}>
          <p className={styles.kicker}><span aria-hidden="true">↳</span> Competition meets creation</p>
          <h2 id="games-intro-title">
            <span className={styles.titleLine}><span>Games that</span></span>
            <span className={styles.titleLine}><span><em>shaped</em> me<span className={styles.period}>.</span></span></span>
          </h2>
          <p id="games-intro-description" className={styles.description}>The competition. The creativity. The countless hours.</p>
        </div>
        <div className={styles.games} aria-hidden="true">
          {GAMES.map((game, index) => (
            <div key={game.id} className={styles.game} style={{ "--game-color": game.accent, "--game-delay": `${550 + index * 180}ms` } as CSSProperties}>
              <span className={styles.gameNumber}>0{index + 1}<i /></span>
              <span className={styles.gameName}>{game.title}</span>
              <span className={styles.gameCategory}>{game.category}</span>
              <span className={styles.gameLine} />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.bottomline}>
        <div className={styles.sequence}>
          <span className={styles.progress} aria-hidden="true"><span /></span>
          <span>{exiting ? "Welcome to my world" : "Four games. A part of me in each."}</span>
        </div>
        <button ref={skipRef} type="button" onClick={onComplete}>Skip intro <span aria-hidden="true">↗</span></button>
      </div>
    </div>
  )
}
