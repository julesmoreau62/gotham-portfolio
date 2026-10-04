"use client"

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react"
import { ArrowUpRight } from "lucide-react"
import { getLenis } from "@/components/fx/smooth-scroll"
import { PROFILE, SITE } from "@/lib/profile"
import styles from "./home-intro.module.css"

const SEQUENCE_MS = 1850
const REVEAL_MS = 750
const CHAPTERS = [
  { word: "Play.", caption: "Where it started." },
  { word: "Observe.", caption: "Look beyond the game." },
  { word: "Create.", caption: "Make it happen." },
]

export function HomeIntro({ onReveal, onComplete }: { onReveal: () => void; onComplete: () => void }) {
  const [step, setStep] = useState(0)
  const [exiting, setExiting] = useState(false)
  const finished = useRef(false)
  const skipRef = useRef<HTMLButtonElement>(null)
  const timers = useRef<number[]>([])

  const finish = useCallback(() => {
    if (finished.current) return
    finished.current = true
    timers.current.forEach(window.clearTimeout)
    setExiting(true)
    onReveal()
    timers.current = [window.setTimeout(onComplete, REVEAL_MS)]
  }, [onReveal, onComplete])

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (preference.matches) return

    const previousFocus = document.activeElement
    const previousOverflow = document.documentElement.style.overflow
    const wasStopped = document.documentElement.classList.contains("lenis-stopped")
    const lenis = getLenis()
    document.documentElement.style.overflow = "hidden"
    document.documentElement.classList.add("lenis-stopped")
    lenis?.stop()
    skipRef.current?.focus({ preventScroll: true })
    timers.current = [
      window.setTimeout(() => setStep(1), 650),
      window.setTimeout(() => setStep(2), 1200),
      window.setTimeout(finish, SEQUENCE_MS),
    ]

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        finish()
      }
      if (event.key === "Tab") {
        event.preventDefault()
        skipRef.current?.focus()
      }
    }
    const onPreference = () => {
      if (!preference.matches) return
      timers.current.forEach(window.clearTimeout)
      finished.current = true
      onReveal()
      onComplete()
    }
    window.addEventListener("keydown", onKey)
    preference.addEventListener("change", onPreference)
    return () => {
      timers.current.forEach(window.clearTimeout)
      window.removeEventListener("keydown", onKey)
      preference.removeEventListener("change", onPreference)
      document.documentElement.style.overflow = previousOverflow
      if (!wasStopped) document.documentElement.classList.remove("lenis-stopped")
      lenis?.start()
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({ preventScroll: true })
    }
  }, [finish, onReveal, onComplete])

  return (
    <div className={styles.intro} data-exiting={exiting} style={{ "--sequence-duration": `${SEQUENCE_MS}ms`, "--reveal-duration": `${REVEAL_MS}ms` } as CSSProperties} role="dialog" aria-modal="true" aria-labelledby="home-intro-title" aria-describedby="home-intro-description" onClick={finish}>
      <div className={`${styles.shutter} ${styles.shutterTop}`} aria-hidden="true" />
      <div className={`${styles.shutter} ${styles.shutterBottom}`} aria-hidden="true" />
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.seam} aria-hidden="true" />

      <div className={styles.content}>
        <div className={styles.topline}>
          <span className={styles.identity}><span className={styles.monogram}>JM</span><span>{SITE.name}</span></span>
          <span>Personal portfolio / {SITE.year}</span>
        </div>

        <div className={styles.stage}>
          <p className={styles.eyebrow}><span /> A player&apos;s perspective</p>
          <h2 id="home-intro-title" className={styles.srOnly}>Jules Moreau — Play. Observe. Create.</h2>
          <div className={styles.chapters} aria-hidden="true">
            {CHAPTERS.map((chapter, index) => (
              <div key={chapter.word} className={styles.chapter} data-state={index === step ? "active" : index < step ? "done" : "next"} style={{ "--chapter-delay": `${index * 150}ms` } as CSSProperties}>
                <span className={styles.chapterNumber}>0{index + 1}</span>
                <span className={styles.wordMask}><span className={styles.word}>{chapter.word}</span></span>
                <span className={styles.caption}>{chapter.caption}<span>↗</span></span>
              </div>
            ))}
          </div>
          <p id="home-intro-description" className={styles.description}>From playing to making it happen.</p>
        </div>

        <div className={styles.bottomline}>
          <div className={styles.progress} aria-hidden="true"><span /></div>
          <div className={styles.footer}>
            <span>Event management <span className={styles.location}>/ {PROFILE.location}</span></span>
            <button ref={skipRef} type="button" onClick={finish} disabled={exiting}>Skip intro <ArrowUpRight size={14} /></button>
          </div>
        </div>
      </div>
    </div>
  )
}
