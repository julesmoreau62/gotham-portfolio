"use client"

import { useEffect, useRef, type CSSProperties } from "react"
import Link from "next/link"
import type { SfxKind } from "@/lib/dossier"
import { DOTS, arcPoints, paintGraticule, paintLand, paintPlanet, rotate, toVec, type Vec } from "./globe"
import { easeOut } from "./timing"
import { ContactActions } from "./scene-mission"
import styles from "./dossier.module.css"

/* END SCREEN — once the transmission is over, one line and the ways to
   answer it. The planet rises under the slogan with the career route
   on it, Lille pulsing. It runs on its own clock: the film has stopped. */

type Spot = { lat: number; lon: number }
/** The long legs of the career route: Opal Coast, Kourou, Lille. The short hops would spike on the rim. */
const ROUTE: Spot[] = [
  { lat: 50.95, lon: 1.86 },
  { lat: 5.16, lon: -52.65 },
  { lat: 50.63, lon: 3.06 },
]
const BASE = toVec(ROUTE[ROUTE.length - 1].lon, ROUTE[ROUTE.length - 1].lat)
const ACID = "200,255,0"
const PALETTE = [...Array.from({ length: 6 }, (_, k) => `rgba(242,241,236,${0.08 + k * 0.06})`), `rgba(${ACID},1)`]

/** The planet as a horizon: it rises into the lower part of the screen, Europe near its rim. */
function drawHorizon(canvas: HTMLCanvasElement, s: number) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return
  const W = canvas.width, H = canvas.height, dpr = Math.min(devicePixelRatio || 1, 2)
  ctx.clearRect(0, 0, W, H)
  const R = Math.max(W * 0.5, H * 0.85)
  const rise = easeOut(Math.min(1, s / 1.8))
  const cam = { lon: 2 + Math.sin(s * 0.1) * 14, lat: -12, zoom: 1 }
  const view = { cam, cx: W / 2, cy: H * (1.02 - 0.4 * rise) + R, R }
  paintPlanet(ctx, view, dpr, 1, 1.6)
  paintGraticule(ctx, view, dpr)
  paintLand(ctx, view, PALETTE, (i, z, _x, _y, vx, vy, vz) => {
    if (DOTS.seed[i] > rise * 1.2) return -1
    return vx * BASE[0] + vy * BASE[1] + vz * BASE[2] > 0.9993 ? 6 : Math.min(5, Math.floor(z * 6))
  }, Math.max(1.4 * dpr, R * 0.0055))
  const project = (v: Vec) => {
    const r = rotate(v, cam)
    return { x: view.cx + view.R * r[0], y: view.cy - view.R * r[1], z: r[2], out: r[0] ** 2 + r[1] ** 2 > 1 }
  }

  // The career route, drawn once the planet is up, a pulse running it base to base.
  const drawn = Math.min(1, Math.max(0, (s - 1.2) / 1.2))
  ctx.lineCap = "round"
  ctx.strokeStyle = `rgba(${ACID},.85)`
  ctx.lineWidth = 1.8 * dpr
  ctx.shadowColor = `rgb(${ACID})`
  ctx.shadowBlur = 10 * dpr
  for (let k = 1; k < ROUTE.length && drawn > 0; k++) {
    const a = toVec(ROUTE[k - 1].lon, ROUTE[k - 1].lat), b = toVec(ROUTE[k].lon, ROUTE[k].lat)
    if (a.every((v, i) => Math.abs(v - b[i]) < 1e-6)) continue
    ctx.beginPath()
    let pen = false
    for (const q of arcPoints(a, b, drawn, 48).map(project)) {
      if (q.z <= 0 && !q.out) { pen = false; continue }
      if (pen) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y)
      pen = true
    }
    ctx.stroke()
  }
  ctx.shadowBlur = 0
  if (drawn >= 1) {
    const legs = ROUTE.length - 1
    const p = ((s - 2.4) / 1.3) % legs
    const leg = Math.floor(p)
    const points = arcPoints(toVec(ROUTE[leg].lon, ROUTE[leg].lat), toVec(ROUTE[leg + 1].lon, ROUTE[leg + 1].lat), p - leg, 48)
    const head = project(points[points.length - 1])
    if (head.z > 0 || head.out) {
      ctx.fillStyle = "#fff"
      ctx.shadowColor = `rgb(${ACID})`
      ctx.shadowBlur = 14 * dpr
      ctx.beginPath(); ctx.arc(head.x, head.y, 3.2 * dpr, 0, Math.PI * 2); ctx.fill()
      ctx.shadowBlur = 0
    }
  }

  // Lille, the current base, waiting for its next posting.
  const q = project(BASE)
  if (q.z <= 0.02 || s < 1.2) return
  for (const delay of [0, 0.7]) {
    const pulse = (((s + delay) % 1.4) + 1.4) % 1.4 / 1.4
    ctx.strokeStyle = `rgba(${ACID},${(1 - pulse) * 0.9})`
    ctx.lineWidth = 1.4 * dpr
    ctx.beginPath(); ctx.ellipse(q.x, q.y, (8 + pulse * 52) * dpr, (8 + pulse * 52) * dpr * Math.max(0.35, q.z), 0, 0, Math.PI * 2); ctx.stroke()
  }
  ctx.fillStyle = "#fff"
  ctx.shadowColor = `rgb(${ACID})`
  ctx.shadowBlur = 12 * dpr
  ctx.fillRect(q.x - 3.5 * dpr, q.y - 3.5 * dpr, 7 * dpr, 7 * dpr)
  ctx.shadowBlur = 0
}

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
    play.current("boot")
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
