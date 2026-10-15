"use client"

import { useEffect, useRef, type CSSProperties } from "react"
import Link from "next/link"
import type { SfxKind } from "@/lib/dossier"
import { drawHorizon } from "./horizon"
import { MatrixTitle } from "./matrix-title"
import { ContactActions } from "./scene-mission"
import styles from "./dossier.module.css"

/* END SCREEN — once the transmission is over, one line and the ways to
   answer it, over the planet the film's last globe has just zoomed into:
   the career route on it, Lille pulsing. It runs on its own clock, from
   the frame the film stopped on. */

/** The slogan, written by the rain like the name in the home intro. */
const SLOGAN = [
  { text: "Next mission:", color: "#f2f1ec" },
  { text: "your organisation?", color: "#c8ff00" },
]

function Horizon() {
  const canvas = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const el = canvas.current
    if (!el) return
    const start = performance.now()
    let frame = 0
    const loop = (now: number) => {
      frame = requestAnimationFrame(loop)
      const dpr = Math.min(devicePixelRatio || 1, 2)
      const w = Math.round(el.clientWidth * dpr), h = Math.round(el.clientHeight * dpr)
      if (el.width !== w || el.height !== h) { el.width = w; el.height = h }
      drawHorizon(el, (now - start) / 1000)
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [])
  return <canvas ref={canvas} className={styles.endGlobe} aria-hidden="true" />
}

export function EndScreen({ onReplay, sound }: { onReplay: () => void; sound: (kind: SfxKind) => void }) {
  const heading = useRef<HTMLHeadingElement>(null)
  const play = useRef(sound)
  play.current = sound
  useEffect(() => {
    heading.current?.focus({ preventScroll: true })
    play.current("reticle")
  }, [])
  // The kicker first, then the slogan is written, then the ways to answer it.
  const delay = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties

  return (
    <section className={styles.endScreen} aria-labelledby="dossier-end-title">
      <Horizon />
      <MatrixTitle heading={heading} lines={SLOGAN} onWritten={() => play.current("lock")} />
      <div className={styles.endBody}>
        <p className={styles.endKicker} style={delay(0.2)}><i /> END OF TRANSMISSION</p>
        <h2 id="dossier-end-title" ref={heading} tabIndex={-1} className={styles.endTitle} data-coded>
          Next mission:<br /><span>your organisation?</span>
        </h2>
        <div className={styles.endReveal} style={delay(1.8)}>
          <ContactActions className={styles.endContact} />
        </div>
        <div className={styles.endLinks} style={delay(2)}>
          <button type="button" onClick={onReplay}>Replay <span aria-hidden="true">↺</span></button>
          <Link href="/">Back to the portfolio</Link>
        </div>
      </div>
    </section>
  )
}
