"use client"

import { useEffect, useRef, type CSSProperties } from "react"
import Link from "next/link"
import { SEGMENTS, type SfxKind } from "@/lib/dossier"
import { BRIEFING_PATH } from "@/lib/i18n"
import { PLACES, type PlaceId } from "@/lib/journey"
import { DOTS, arcPoints, paintGraticule, paintLand, paintPlanet, rotate, toVec, type Vec } from "./globe"
import { ContactActions } from "./scene-mission"
import styles from "./dossier.module.css"

/* END SCREEN — the debrief once the transmission is over: the whole
   route on a slowly turning globe, what the file established, the brief
   for the next mission, ways to make contact, and every chapter one
   click away. It runs on its own clock: the film has stopped. */

type Spot = { lat: number; lon: number }
const at = (id: PlaceId): Spot => PLACES[id]
/** Childhood moves, faint, then the career bases, bright. */
const CHILDHOOD: Spot[] = (["france", "guiana", "corsica", "caledonia", "congo", "france", "guiana", "france"] as PlaceId[]).map(at)
const CAREER: Spot[] = [
  { lat: 50.95, lon: 1.86 },
  { lat: 5.16, lon: -52.65 },
  { lat: 50.63, lon: 3.06 },
  { lat: 50.85, lon: 4.33 },
  { lat: 50.63, lon: 3.06 },
]
const BASE = CAREER[CAREER.length - 1]

const SUMMARY = [
  { value: "7", label: "Moves · 4 continents" },
  { value: "1M+", label: "Views · one club season" },
  { value: "+467%", label: "Sponsor click-through" },
  { value: "90", label: "Sources scanned a day" },
]

const BRIEF = [
  ["Objective", "Digital transformation & AI"],
  ["Theatre", "A sport organisation"],
  ["Window", "February → June 2027"],
  ["Area", "Anywhere · worldwide"],
]

/** When the "cleared for contact" stamp lands, in step with its CSS animation. */
const STAMP_MS = 1600
const ACID = "200,255,0"
const PALETTE = [...Array.from({ length: 6 }, (_, k) => `rgba(242,241,236,${0.1 + k * 0.07})`), `rgba(${ACID},1)`]

function drawRoute(canvas: HTMLCanvasElement, s: number) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return
  const W = canvas.width, H = canvas.height, dpr = Math.min(devicePixelRatio || 1, 2)
  ctx.clearRect(0, 0, W, H)
  const grow = 1 - Math.pow(1 - Math.min(1, s / 1.4), 3)
  const cam = { lon: -20 + Math.sin(s * 0.12) * 18, lat: 24, zoom: 1 }
  const view = { cam, cx: W * 0.71, cy: H * 0.52, R: Math.min(H * 0.4, W * 0.26) * (0.85 + 0.15 * grow) }
  const base = toVec(BASE.lon, BASE.lat)
  paintPlanet(ctx, view, dpr, grow, 1)
  paintGraticule(ctx, view, dpr)
  paintLand(ctx, view, PALETTE, (i, z, _x, _y, vx, vy, vz) => {
    if (DOTS.seed[i] > grow * 1.2) return -1
    return vx * base[0] + vy * base[1] + vz * base[2] > 0.9993 ? 6 : Math.min(5, Math.floor(z * 6))
  })
  const project = (v: Vec) => {
    const r = rotate(v, cam)
    return { x: view.cx + view.R * r[0], y: view.cy - view.R * r[1], z: r[2], out: r[0] ** 2 + r[1] ** 2 > 1 }
  }
  const stroke = (route: Spot[], style: string, width: number, glow: number) => {
    ctx.strokeStyle = style
    ctx.lineWidth = width * dpr
    ctx.shadowColor = `rgb(${ACID})`
    ctx.shadowBlur = glow * dpr
    for (let k = 1; k < route.length; k++) {
      const a = toVec(route[k - 1].lon, route[k - 1].lat), b = toVec(route[k].lon, route[k].lat)
      if (a.every((v, i) => Math.abs(v - b[i]) < 1e-6)) continue
      ctx.beginPath()
      let pen = false
      for (const q of arcPoints(a, b, 1, 48).map(project)) {
        if (q.z <= 0 && !q.out) { pen = false; continue }
        if (pen) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y)
        pen = true
      }
      ctx.stroke()
    }
    ctx.shadowBlur = 0
  }
  ctx.lineCap = "round"
  if (s > 0.6) stroke(CHILDHOOD, `rgba(242,241,236,${0.22 * Math.min(1, (s - 0.6) * 2)})`, 1, 0)
  if (s > 1) stroke(CAREER, `rgba(${ACID},${0.85 * Math.min(1, (s - 1) * 2)})`, 1.8, 10)

  // A pulse travels the career route, base to base, again and again.
  if (s > 1.4) {
    const legs = CAREER.length - 1
    const p = ((s - 1.4) / 1.3) % legs
    const leg = Math.floor(p)
    const a = toVec(CAREER[leg].lon, CAREER[leg].lat), b = toVec(CAREER[leg + 1].lon, CAREER[leg + 1].lat)
    const points = arcPoints(a, b, p - leg, 48)
    const head = project(points[points.length - 1])
    if (head.z > 0 || head.out) {
      ctx.fillStyle = "#fff"
      ctx.shadowColor = `rgb(${ACID})`
      ctx.shadowBlur = 14 * dpr
      ctx.beginPath(); ctx.arc(head.x, head.y, 3.4 * dpr, 0, Math.PI * 2); ctx.fill()
      ctx.shadowBlur = 0
    }
  }

  // Every place on record, and the current base waiting for its next posting.
  for (const spot of [...CHILDHOOD, ...CAREER]) {
    const q = project(toVec(spot.lon, spot.lat))
    if (q.z <= 0.05) continue
    ctx.fillStyle = `rgba(${ACID},.9)`
    ctx.fillRect(q.x - 2.5 * dpr, q.y - 2.5 * dpr, 5 * dpr, 5 * dpr)
  }
  const q = project(base)
  if (q.z > 0.05 && s > 1.2) {
    for (const delay of [0, 0.7]) {
      const pulse = (((s + delay) % 1.4) + 1.4) % 1.4 / 1.4
      ctx.strokeStyle = `rgba(${ACID},${(1 - pulse) * 0.9})`
      ctx.lineWidth = 1.4 * dpr
      ctx.beginPath(); ctx.arc(q.x, q.y, (8 + pulse * 46) * dpr, 0, Math.PI * 2); ctx.stroke()
    }
    ctx.fillStyle = "#fff"
    ctx.fillRect(q.x - 4 * dpr, q.y - 4 * dpr, 8 * dpr, 8 * dpr)
    const font = getComputedStyle(document.documentElement).getPropertyValue("--font-mono").trim() || "monospace"
    const lx = q.x + 26 * dpr, ly = q.y - 26 * dpr
    ctx.strokeStyle = "rgba(255,255,255,.8)"
    ctx.lineWidth = 1 * dpr
    ctx.beginPath(); ctx.moveTo(q.x + 7 * dpr, q.y - 7 * dpr); ctx.lineTo(lx, ly); ctx.lineTo(lx + 18 * dpr, ly); ctx.stroke()
    ctx.font = `700 ${13 * dpr}px ${font}`
    ctx.fillStyle = "#fff"
    ctx.fillText("LILLE · CURRENT BASE", lx + 24 * dpr, ly + 4 * dpr)
    ctx.font = `${11 * dpr}px ${font}`
    ctx.fillStyle = `rgba(${ACID},.95)`
    ctx.fillText("NEXT POSTING · OPEN", lx + 24 * dpr, ly + 21 * dpr)
  }
}

function RouteGlobe() {
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
      drawRoute(el, (now - start) / 1000)
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [])
  return <canvas ref={canvas} className={styles.endGlobe} aria-hidden="true" />
}

export function EndScreen({ onReplay, onChapter, sound }: { onReplay: () => void; onChapter: (at: number) => void; sound: (kind: SfxKind) => void }) {
  const heading = useRef<HTMLHeadingElement>(null)
  const play = useRef(sound)
  play.current = sound
  useEffect(() => {
    heading.current?.focus({ preventScroll: true })
    // The screen powers on, then the stamp lands.
    play.current("boot")
    const stamp = window.setTimeout(() => play.current("thump"), STAMP_MS)
    return () => window.clearTimeout(stamp)
  }, [])
  const step = (k: number) => ({ "--d": `${0.35 + k * 0.12}s` }) as CSSProperties

  return (
    <section className={styles.endScreen} aria-labelledby="dossier-end-title">
      <RouteGlobe />
      <p className={styles.endStamp} aria-hidden="true">Cleared for contact</p>
      <div className={styles.endBody}>
        <p className={styles.endKicker} style={step(0)}><i /> END OF TRANSMISSION · DOSSIER JM-0624 · AWAITING CONTACT</p>
        <h2 id="dossier-end-title" ref={heading} tabIndex={-1} className={styles.endTitle} style={step(1)}>
          Next mission:<br /><span>your organisation?</span>
        </h2>
        <dl className={styles.endSummary} style={step(2)}>
          {SUMMARY.map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}
        </dl>
        <dl className={styles.endBrief} style={step(3)}>
          {BRIEF.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
        </dl>
        <div style={step(4)} className={styles.endReveal}>
          <ContactActions className={styles.endContact} />
        </div>
        <div className={styles.endLinks} style={step(5)}>
          <button type="button" onClick={onReplay} className={styles.endReplay}>Replay the dossier <span aria-hidden="true">↺</span></button>
          <Link href={BRIEFING_PATH.en}>30-second briefing</Link>
          <Link href="/">Back to the portfolio</Link>
        </div>
        <nav className={styles.endChapters} aria-label="Replay a chapter" style={step(6)}>
          <span>Replay a chapter</span>
          <ol>
            {SEGMENTS.map((segment, i) => (
              <li key={segment.id}>
                <button type="button" onClick={() => onChapter(Math.max(0, segment.start - 0.4))}>
                  <b>{String(i + 1).padStart(2, "0")}</b> {segment.chapter}
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </section>
  )
}
