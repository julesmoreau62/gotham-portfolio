"use client"

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react"
import { getLenis } from "@/components/fx/smooth-scroll"
import type { Locale } from "@/lib/i18n"
import { INTRO_MS, MatrixIntro, type IntroPhase } from "./matrix-intro"
import styles from "./matrix-intro.module.css"

const SESSION_KEY = "jm-matrix-intro-v1"
let playedInThisTab = false

const ORDER: IntroPhase[] = ["wake", "rain", "choose", "exit"]
/** Timers only move the intro forward: a skip is never undone by a late timer. */
const advance = (to: IntroPhase) => (from: IntroPhase | null) => (from && ORDER.indexOf(from) >= ORDER.indexOf(to) ? from : to)

// Hide the first paint only when the intro will play. Without JavaScript the
// server-rendered portfolio stays visible; a failed hydration also fails open.
const primer = `(function(){var cover=document.getElementById('home-intro-primer');var content=document.getElementById('home-content');var seen=false;try{seen=sessionStorage.getItem('${SESSION_KEY}')==='1'}catch(e){}if(cover&&content&&!seen&&!location.hash&&!matchMedia('(prefers-reduced-motion: reduce)').matches){cover.dataset.state='pending';content.inert=true;setTimeout(function(){if(cover.dataset.state==='pending'){cover.dataset.state='expired';content.inert=false}},3400)}})()`

export function HomeEntrance({ children, locale = "en" }: { children: ReactNode; locale?: Locale }) {
  const [phase, setPhase] = useState<IntroPhase | null>(null)
  const decision = useRef<boolean | null>(null)
  const primerElement = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const skipButton = useRef<HTMLButtonElement>(null)
  const restoreFocus = useRef(false)
  const active = phase !== null

  const finish = useCallback(() => {
    restoreFocus.current = true
    setPhase(null)
  }, [])
  const skipToChoice = useCallback(() => setPhase(advance("choose")), [])
  /** When the choice appeared: "Skip intro" turns into "Enter the portfolio" in place. */
  const choiceShownAt = useRef(0)
  /** "Enter the portfolio": the screen drains onto the hero, then hands over. */
  const enter = useCallback(() => {
    // A double click on "Skip intro" must not skip the choice as well.
    if (performance.now() - choiceShownAt.current < 450) return
    setPhase(advance("exit"))
  }, [])

  useLayoutEffect(() => {
    if (decision.current === null) {
      let seen = playedInThisTab
      try { seen ||= sessionStorage.getItem(SESSION_KEY) === "1" } catch {}
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined
      decision.current = !seen && !reduced && !window.location.hash && navigation?.type !== "back_forward" && primerElement.current?.dataset.state !== "expired"
      if (decision.current) {
        playedInThisTab = true
        try { sessionStorage.setItem(SESSION_KEY, "1") } catch {}
      }
    }
    if (decision.current) setPhase("wake")
    if (content.current) content.current.inert = decision.current
    if (primerElement.current) delete primerElement.current.dataset.state
  }, [])

  useEffect(() => {
    if (!active) return
    const root = document.documentElement
    const overflow = root.style.overflow
    const lenis = getLenis()
    const wasStopped = lenis?.isStopped ?? false
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)")
    root.style.overflow = "hidden"
    lenis?.stop()
    skipButton.current?.focus({ preventScroll: true })

    const rain = window.setTimeout(() => setPhase(advance("rain")), INTRO_MS.rain)
    const choose = window.setTimeout(() => setPhase(advance("choose")), INTRO_MS.choose)
    const onPreference = () => { if (preference.matches) finish() }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        event.stopImmediatePropagation()
        finish()
      } else if (event.key === "Tab") {
        // Focus stays inside the intro: the access choices, then the skip button.
        event.preventDefault()
        const focusable = [...document.querySelectorAll<HTMLElement>("#matrix-intro a[href], #matrix-intro button")]
        const at = focusable.indexOf(document.activeElement as HTMLElement)
        const next = focusable[(at + (event.shiftKey ? -1 : 1) + focusable.length) % focusable.length]
        next?.focus({ preventScroll: true })
      }
    }
    const onHash = () => { if (window.location.hash) finish() }
    preference.addEventListener("change", onPreference)
    window.addEventListener("keydown", onKey, true)
    window.addEventListener("hashchange", onHash)
    return () => {
      window.clearTimeout(rain)
      window.clearTimeout(choose)
      preference.removeEventListener("change", onPreference)
      window.removeEventListener("keydown", onKey, true)
      window.removeEventListener("hashchange", onHash)
      root.style.overflow = overflow
      if (!wasStopped) lenis?.start()
    }
  }, [active, finish])

  // The choice takes focus as it appears; the drain hands over once it has played.
  useEffect(() => {
    if (phase === "choose") {
      choiceShownAt.current = performance.now()
      document.querySelector<HTMLElement>("#matrix-intro [data-choice]")?.focus({ preventScroll: true })
    }
    if (phase !== "exit") return
    // Completion never depends on an animation event.
    const end = window.setTimeout(finish, INTRO_MS.exit)
    return () => window.clearTimeout(end)
  }, [phase, finish])

  useEffect(() => {
    if (active || !restoreFocus.current) return
    restoreFocus.current = false
    const frame = requestAnimationFrame(() => {
      content.current?.querySelector<HTMLElement>("#main-content")?.focus({ preventScroll: true })
    })
    return () => cancelAnimationFrame(frame)
  }, [active])

  return (
    <>
      <div ref={primerElement} id="home-intro-primer" className={styles.primer} suppressHydrationWarning aria-hidden="true" />
      <div ref={content} id="home-content" className={styles.content} data-intro-phase={phase ?? "ready"} suppressHydrationWarning inert={active}>
        {children}
      </div>
      <script dangerouslySetInnerHTML={{ __html: primer }} />
      {phase && <MatrixIntro phase={phase} skipButton={skipButton} onSkip={skipToChoice} onEnter={enter} locale={locale} />}
    </>
  )
}
