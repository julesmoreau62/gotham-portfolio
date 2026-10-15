"use client"

import { useEffect, useRef, type CSSProperties } from "react"
import Link from "next/link"
import type { SfxKind } from "@/lib/dossier"
import { drawHorizon } from "./horizon"
import { ContactActions } from "./scene-mission"
import styles from "./dossier.module.css"

/* END SCREEN — once the transmission is over, one line and the ways to
   answer it, over the planet the film's last globe has just zoomed into:
   the career route on it, Lille pulsing. It runs on its own clock, from
   the frame the film stopped on. */

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
  const step = (k: number) => ({ "--d": `${0.3 + k * 0.18}s` }) as CSSProperties

  return (
    <section className={styles.endScreen} aria-labelledby="dossier-end-title">
      <Horizon />
      <div className={styles.endBody}>
        <p className={styles.endKicker} style={step(0)}><i /> END OF TRANSMISSION</p>
        <h2 id="dossier-end-title" ref={heading} tabIndex={-1} className={styles.endTitle} style={step(1)}>
          Next mission:<br /><span>your organisation?</span>
        </h2>
        <div className={styles.endReveal} style={step(2)}>
          <ContactActions className={styles.endContact} />
        </div>
        <div className={styles.endLinks} style={step(3)}>
          <button type="button" onClick={onReplay}>Replay <span aria-hidden="true">↺</span></button>
          <Link href="/">Back to the portfolio</Link>
        </div>
      </div>
    </section>
  )
}
