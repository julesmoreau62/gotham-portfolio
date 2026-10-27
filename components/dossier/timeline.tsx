"use client"

import { useEffect, useRef } from "react"
import { CUE } from "@/lib/dossier"
import { arcPoints, cameraAt, paintGraticule, paintLand, paintPlanet, rotate, toVec, type Shot, type Vec } from "./globe"
import { decode, easeInOut, easeOut, lerp, ramp, window01 } from "./timing"
import styles from "./dossier.module.css"
import { glow } from "@/lib/quality"

/* TIMELINE + LOCATOR — the two instruments of the career chapters:
   a ruler from 2022 to 2027 whose cursor follows every date the voice
   gives, and a small globe that locks onto every place it names. */

const { field, kourou, lille, daring, shift, mission } = CUE
const FROM = 2022, TO = 2028
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]

/** Where the cursor goes, and when: decimal years. */
const DATES = [
  { at: field.year.at, date: 2022.71 },
  { at: field.year2025.at, date: 2025.04 },
  { at: kourou.summer.at, date: 2025.62 },
  { at: lille.september.at, date: 2025.71 },
  { at: daring.may.at, date: 2026.37 },
  { at: shift.last.at, date: 2026.79 },
]

const MARKS = [
  { date: 2022.71, label: "ULCO · NAVY", at: field.bachelor.at },
  { date: 2025.04, label: "ASN95", at: field.club.at },
  { date: 2025.62, label: "KOUROU", at: kourou.place },
  { date: 2025.75, label: "M2 LILLE", at: lille.master.at },
  { date: 2026.37, label: "DARING", at: daring.join.at },
  { date: 2026.79, label: "NOW", at: shift.last.at },
]

const WINDOW = { from: 2027.08, to: 2027.5 }
const xOf = (date: number) => ((date - FROM) / (TO - FROM)) * 100

function dateAt(t: number) {
  let i = 0
  while (i + 1 < DATES.length && DATES[i + 1].at <= t) i++
  const prev = DATES[Math.max(0, i - 1)], key = DATES[i]
  return lerp(prev.date, key.date, easeInOut(ramp(t, key.at, key.at + 0.7)))
}

const label = (date: number) => `${MONTHS[Math.min(11, Math.floor((date % 1) * 12))]} ${Math.floor(date)}`

export function Timeline({ t }: { t: number }) {
  const visible = window01(t, field.year.at + 0.4, mission.out.end + 0.2, 0.4)
  if (!visible) return null
  const date = dateAt(t)
  const windowOn = ramp(t, mission.window.at, mission.window.at + 0.5)
  return (
    <div className={styles.ruler} style={{ opacity: visible }} aria-hidden="true">
      <div className={styles.rulerTrack}>
        {Array.from({ length: (TO - FROM) * 12 + 1 }, (_, m) => <i key={m} data-year={m % 12 === 0 || undefined} style={{ left: `${(m / ((TO - FROM) * 12)) * 100}%` }} />)}
        {Array.from({ length: TO - FROM }, (_, y) => <span key={y} className={styles.rulerYear} style={{ left: `${xOf(FROM + y)}%` }}>{FROM + y}</span>)}
        <span className={styles.rulerTrail} style={{ left: `${xOf(DATES[0].date)}%`, width: `${xOf(date) - xOf(DATES[0].date)}%` }} />
        {MARKS.map((mark, i) => t >= mark.at && (
          <span key={mark.label} className={styles.rulerMark} data-row={i % 3} style={{ left: `${xOf(mark.date)}%`, opacity: ramp(t, mark.at, mark.at + 0.3) }}>
            <em>{decode(mark.label, ramp(t, mark.at, mark.at + 0.4), t)}</em>
          </span>
        ))}
        {windowOn > 0 && (
          <span className={styles.rulerWindow} style={{ left: `${xOf(WINDOW.from)}%`, width: `${(xOf(WINDOW.to) - xOf(WINDOW.from)) * windowOn}%` }}>
            <em>NEXT MISSION · FEB → JUN 2027</em>
          </span>
        )}
        <span className={styles.rulerCursor} style={{ left: `${xOf(date)}%` }}><b>{label(date)}</b></span>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- */

type Spot = { at: number; name: string; lat: number; lon: number; zoom: number }

const SPOTS: Spot[] = [
  { at: field.opal, name: "OPAL COAST · FR", lat: 50.95, lon: 1.86, zoom: 3 },
  { at: field.club.at + 1.2, name: "NORTKERQUE · FR", lat: 50.88, lon: 2.03, zoom: 3.4 },
  { at: kourou.place, name: "KOUROU · FRENCH GUIANA", lat: 5.16, lon: -52.65, zoom: 3 },
  { at: lille.move.at + 0.5, name: "LILLE · FR", lat: 50.63, lon: 3.06, zoom: 3.2 },
  { at: daring.brussels, name: "BRUSSELS · BE", lat: 50.85, lon: 4.33, zoom: 3.4 },
  { at: shift.last.at + 0.6, name: "LILLE · FR", lat: 50.63, lon: 3.06, zoom: 3.2 },
]

const SHOTS: Shot[] = SPOTS.map((spot, i) => ({ at: i ? spot.at - 0.55 : 0, dur: i ? 0.8 : 0, lon: spot.lon, lat: spot.lat * 0.92, zoom: spot.zoom }))
const PALETTE = [...Array.from({ length: 6 }, (_, k) => `rgba(242,241,236,${0.14 + k * 0.08})`), "rgba(200,255,0,.85)"]
const coords = (spot: Spot) => `${Math.abs(spot.lat).toFixed(2)}°${spot.lat >= 0 ? "N" : "S"} ${Math.abs(spot.lon).toFixed(2)}°${spot.lon >= 0 ? "E" : "W"}`

function drawLocator(canvas: HTMLCanvasElement, t: number) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return
  const W = canvas.width, H = canvas.height, dpr = Math.min(devicePixelRatio || 1, 2)
  ctx.clearRect(0, 0, W, H)
  const cam = cameraAt(SHOTS, t)
  const view = { cam, cx: W / 2, cy: H * 0.56, R: H * 0.42 * cam.zoom }
  paintPlanet(ctx, view, dpr, 1, 0.7)
  paintGraticule(ctx, view, dpr)
  const current = SPOTS.reduce((k, spot, i) => (t >= spot.at - 0.55 ? i : k), 0)
  const target = toVec(SPOTS[current].lon, SPOTS[current].lat)
  paintLand(ctx, view, PALETTE, (_i, z, _x, _y, vx, vy, vz) => (vx * target[0] + vy * target[1] + vz * target[2] > 0.9994 ? 6 : Math.min(5, Math.floor(z * 6))), Math.max(1.5 * dpr, view.R * 0.012))
  const project = (v: Vec) => { const r = rotate(v, cam); return { x: view.cx + view.R * r[0], y: view.cy - view.R * r[1], z: r[2], out: r[0] ** 2 + r[1] ** 2 > 1 } }

  // The flight from the previous place, when it is a long one.
  if (current > 0) {
    const from = SPOTS[current - 1], to = SPOTS[current]
    const p = easeOut(ramp(t, to.at - 0.55, to.at + 0.25))
    const a = toVec(from.lon, from.lat), b = toVec(to.lon, to.lat)
    if (p < 1 || t < to.at + 1.4) {
      ctx.strokeStyle = "rgba(200,255,0,.9)"
      ctx.lineWidth = 1.6 * dpr
      ctx.shadowColor = "#c8ff00"
      ctx.shadowBlur = glow(8 * dpr)
      ctx.beginPath()
      let pen = false
      for (const q of arcPoints(a, b, p, 48).map(project)) {
        if (q.z <= 0 && !q.out) { pen = false; continue }
        if (pen) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y)
        pen = true
      }
      ctx.stroke()
      ctx.shadowBlur = 0
    }
  }

  // Lock on the place.
  const p = project(target)
  if (p.z <= 0.05) return
  const since = t - SPOTS[current].at
  const lock = (12 + (1 - easeOut(ramp(since, 0, 0.3))) * 30) * dpr, arm = 5 * dpr
  const pulse = (((since % 1.1) + 1.1) % 1.1) / 1.1
  ctx.strokeStyle = `rgba(200,255,0,${(1 - pulse) * 0.9})`
  ctx.lineWidth = 1 * dpr
  ctx.beginPath(); ctx.arc(p.x, p.y, (5 + pulse * 22) * dpr, 0, Math.PI * 2); ctx.stroke()
  ctx.strokeStyle = "#fff"
  ctx.lineWidth = 1.3 * dpr
  ctx.beginPath()
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    ctx.moveTo(p.x + sx * lock, p.y + sy * (lock - arm)); ctx.lineTo(p.x + sx * lock, p.y + sy * lock); ctx.lineTo(p.x + sx * (lock - arm), p.y + sy * lock)
  }
  ctx.stroke()
  ctx.fillStyle = "#fff"
  ctx.fillRect(p.x - 2.5 * dpr, p.y - 2.5 * dpr, 5 * dpr, 5 * dpr)
}

export function Locator({ t }: { t: number }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const visible = window01(t, field.opal - 0.4, mission.world.at + 0.2, 0.35)

  useEffect(() => {
    const el = canvas.current
    if (!el || !visible) return
    const dpr = Math.min(devicePixelRatio || 1, 2)
    const w = Math.round(el.clientWidth * dpr), h = Math.round(el.clientHeight * dpr)
    if (el.width !== w || el.height !== h) { el.width = w; el.height = h }
    drawLocator(el, t)
  }, [t, visible])

  if (!visible) return null
  const current = SPOTS.reduce((k, spot, i) => (t >= spot.at - 0.55 ? i : k), 0)
  const spot = SPOTS[current]
  const again = t >= shift.again.at
  return (
    <div className={styles.locator} style={{ opacity: visible }} aria-hidden="true">
      <div className={styles.locatorHead}><span><i /> GEOLOCATION · LIVE</span><span>{coords(spot)}</span></div>
      <canvas ref={canvas} className={styles.locatorCanvas} />
      <div className={styles.locatorFoot}>
        <b key={current}>{decode(spot.name, ramp(t, spot.at - 0.2, spot.at + 0.3), t)}</b>
        {again && <em style={{ opacity: ramp(t, shift.again.at, shift.again.at + 0.2) }}>{decode("AGAIN.", ramp(t, shift.again.at, shift.again.at + 0.3), t)}</em>}
      </div>
    </div>
  )
}
