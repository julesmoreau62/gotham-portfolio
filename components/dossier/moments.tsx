"use client"

import { useEffect, useRef, type CSSProperties } from "react"
import { CUE } from "@/lib/dossier"
import { BigDate, STILLS } from "./board"
import { DOTS, arcPoints, cameraAt, paintGraticule, paintLand, paintPlanet, rotate, toVec, type Shot, type Vec } from "./globe"
import { decode, easeInOut, easeOut, hash, lerp, ramp, window01 } from "./timing"
import styles from "./dossier.module.css"

/* MOMENTS — the full-screen beats of the career chapters. While one
   plays, the subject file and the locator slide off screen and the
   investigation board steps back: giant dates, the flight to each new
   base on a large globe, and the numbers worth a whole screen. */

const { field, kourou, lille, daring, shift } = CUE

const DATES = [
  { at: field.year.at, text: "2022", hold: 0.7 },
  { at: field.year2025.at, text: "2025", hold: 0.7 },
  { at: kourou.summer.at, text: "SUMMER 2025", hold: 0.7 },
  { at: lille.september.at, text: "SEPTEMBER 2025", hold: 0.7 },
  { at: lille.december.at, text: "DECEMBER 2025", hold: 0.45 },
  { at: daring.may.at, text: "MAY 2026", hold: 0.7 },
]

type Spot = { lat: number; lon: number }
const FRANCE: Spot = { lat: 46.6, lon: 2.4 }
const NORTKERQUE: Spot = { lat: 50.88, lon: 2.03 }
const OPAL: Spot = { lat: 50.95, lon: 1.86 }
const KOUROU: Spot = { lat: 5.16, lon: -52.65 }
const LILLE: Spot = { lat: 50.63, lon: 3.06 }
const BRUSSELS: Spot = { lat: 50.85, lon: 4.33 }

type Travel = {
  /** When the flight leaves, how long it takes, and when the shot ends. */
  at: number; flight: number; until: number
  from: Spot; to: Spot; zoom: [number, number]
  kicker: string; place: string; placeAt: number; sub: string; subAt: number
  /** "… Lille." — the voice says it twice. */
  again?: number
}

/** Each new base, reached by a flight on the large globe as the voice names it. */
const TRAVELS: Travel[] = [
  { at: field.base.at, flight: 1.5, until: field.bachelor.at - 0.2, from: FRANCE, to: OPAL, zoom: [1.1, 2.1],
    kicker: "BASE OF OPERATIONS", place: "OPAL COAST", placeAt: field.opal, sub: "NORTHERN FRANCE", subAt: field.opal + 0.9 },
  { at: kourou.signal.at, flight: 1.7, until: kourou.build.at - 0.25, from: NORTKERQUE, to: KOUROU, zoom: [1, 1.9],
    kicker: "NEW SIGNAL", place: "KOUROU", placeAt: kourou.place, sub: "FRENCH GUIANA", subAt: kourou.guiana },
  { at: lille.september.end - 0.5, flight: 1.4, until: lille.master.at - 0.2, from: KOUROU, to: LILLE, zoom: [1, 2.1],
    kicker: "RELOCATION", place: "LILLE", placeAt: lille.move.at + 0.5, sub: "FRANCE · NEW BASE", subAt: lille.move.at + 0.9 },
  { at: shift.last.at - 0.05, flight: 1.1, until: shift.shift.at - 0.15, from: BRUSSELS, to: LILLE, zoom: [1.6, 2.3],
    kicker: "LAST KNOWN POSITION", place: "LILLE", placeAt: shift.last.at + 0.5, sub: "FRANCE", subAt: shift.last.at + 0.8, again: shift.again.at },
]

type Hero = {
  from: number; to: number; kicker: string; label: string
  value: number; countAt: number; count: number; format: (n: number) => string
  backdrop?: "photo" | "curve" | "dial"
}

const HEROES: Hero[] = [
  { from: field.views.at - 0.1, to: field.ctr.at - 0.1, kicker: "REACH VERIFIED · AS NORTKERQUE 95 · ONE SEASON", label: "VIEWS",
    value: 1_000_000, countAt: field.views.at, count: 1.4, format: n => (n >= 999_500 ? "1,000,000+" : Math.round(n).toLocaleString("en-US")), backdrop: "photo" },
  { from: field.ctr.at - 0.1, to: field.ctr.end + 0.45, kicker: "AS NORTKERQUE 95 · JAN → JUN 2025", label: "SPONSOR CLICK-THROUGH RATE",
    value: 467, countAt: field.ctr.at, count: field.ctrUp - field.ctr.at + 0.5, format: n => `+${Math.round(n)}%`, backdrop: "curve" },
  { from: shift.scans - 0.1, to: shift.engine.end + 0.2, kicker: "RESEARCH ENGINE · AROUND THE CLOCK", label: "SOURCES SCANNED A DAY",
    value: 90, countAt: shift.scans, count: 3.4, format: n => String(Math.round(n)), backdrop: "dial" },
]

/** Fades for the subject file and the board, merged when two moments sit close together. */
export const FOCUS = (() => {
  const raw = [
    // The gaming chapter: from the radar to the ecosystem around the match.
    [CUE.interest.at - 0.3, CUE.around.end + 0.6],
    ...DATES.map(d => [d.at - 0.3, d.at + d.hold + 0.45]),
    ...TRAVELS.map(v => [v.at - 0.3, v.until + 0.2]),
    ...HEROES.map(h => [h.from - 0.15, h.to]),
  ].sort((a, b) => a[0] - b[0])
  const merged: number[][] = []
  for (const [from, to] of raw) {
    const last = merged[merged.length - 1]
    if (last && from - last[1] < 1.3) last[1] = Math.max(last[1], to)
    else merged.push([from, to])
  }
  return merged
})()

/** 0 while the board has the screen, 1 while a moment has it. */
export const focusAt = (t: number) => FOCUS.reduce((max, [from, to]) => Math.max(max, easeInOut(window01(t, from, to, 0.4))), 0)

/* ---------------------------------------------------------------- */

const ACID = "200,255,0"
const PALETTE = [...Array.from({ length: 6 }, (_, k) => `rgba(242,241,236,${0.12 + k * 0.08})`), `rgba(${ACID},.55)`, `rgba(${ACID},.85)`, `rgba(${ACID},1)`]
const coords = (spot: Spot) => `${Math.abs(spot.lat).toFixed(2)}°${spot.lat >= 0 ? "N" : "S"} ${Math.abs(spot.lon).toFixed(2)}°${spot.lon >= 0 ? "E" : "W"}`
const travelAt = (t: number) => TRAVELS.find(v => t >= v.at - 0.3 && t < v.until + 0.3)

function drawTravel(canvas: HTMLCanvasElement, travel: Travel, t: number) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return
  const W = canvas.width, H = canvas.height, dpr = Math.min(devicePixelRatio || 1, 2)
  ctx.clearRect(0, 0, W, H)
  const { from, to, at, flight, zoom } = travel
  const arrive = at + flight
  const shots: Shot[] = [
    { at: 0, dur: 0, lon: from.lon, lat: from.lat, zoom: zoom[0] },
    { at, dur: flight, lon: to.lon, lat: to.lat, zoom: zoom[1] },
  ]
  const cam = cameraAt(shots, t)
  // Once there, the camera keeps creeping in.
  cam.zoom *= 1 + Math.max(0, t - arrive) * 0.05
  const view = { cam, cx: W * 0.68, cy: H * 0.54, R: Math.min(H * 0.42, W * 0.3) * cam.zoom }
  const target = toVec(to.lon, to.lat)
  const heat = ramp(t, arrive - 0.2, arrive + 0.5)
  paintPlanet(ctx, view, dpr, 1, 1.1)
  paintGraticule(ctx, view, dpr)
  paintLand(ctx, view, PALETTE, (i, z, _x, _y, vx, vy, vz) => {
    const depth = Math.min(5, Math.floor(z * 6))
    if (DOTS.seed[i] > heat) return depth
    const d = vx * target[0] + vy * target[1] + vz * target[2]
    return d > 0.99985 ? 8 : d > 0.9994 ? 7 : d > 0.998 ? 6 : depth
  }, Math.max(1.5 * dpr, view.R * 0.0085))
  const project = (v: Vec) => {
    const r = rotate(v, cam)
    return { x: view.cx + view.R * r[0], y: view.cy - view.R * r[1], z: r[2], out: r[0] ** 2 + r[1] ** 2 > 1 }
  }

  // The flight, drawn as it goes.
  const p = easeOut(ramp(t, at, arrive))
  if (p > 0) {
    const points = arcPoints(toVec(from.lon, from.lat), target, p, 64).map(project)
    ctx.lineCap = "round"
    ctx.strokeStyle = `rgba(${ACID},1)`
    ctx.lineWidth = 2.6 * dpr
    ctx.shadowColor = `rgb(${ACID})`
    ctx.shadowBlur = 16 * dpr
    ctx.beginPath()
    let pen = false
    for (const q of points) {
      if (q.z <= 0 && !q.out) { pen = false; continue }
      if (pen) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y)
      pen = true
    }
    ctx.stroke()
    const head = points[points.length - 1]
    if (p < 1 && (head.z > 0 || head.out)) {
      ctx.fillStyle = "#fff"
      ctx.beginPath(); ctx.arc(head.x, head.y, 4 * dpr, 0, Math.PI * 2); ctx.fill()
    }
    ctx.shadowBlur = 0
  }

  // Lock on the new base: rings, then a reticle closing in.
  const q = project(target)
  if (t < arrive - 0.1 || q.z <= 0.05) return
  const since = t - arrive
  for (const delay of [0, 0.55]) {
    const pulse = (((since + delay) % 1.1) + 1.1) % 1.1 / 1.1
    ctx.strokeStyle = `rgba(${ACID},${(1 - pulse) * 0.9})`
    ctx.lineWidth = 1.4 * dpr
    ctx.beginPath(); ctx.arc(q.x, q.y, (10 + pulse * 70) * dpr, 0, Math.PI * 2); ctx.stroke()
  }
  const lock = (24 + (1 - easeOut(ramp(since, 0, 0.35))) * 90) * dpr, arm = 12 * dpr
  ctx.strokeStyle = "#fff"
  ctx.lineWidth = 2 * dpr
  ctx.beginPath()
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    ctx.moveTo(q.x + sx * lock, q.y + sy * (lock - arm)); ctx.lineTo(q.x + sx * lock, q.y + sy * lock); ctx.lineTo(q.x + sx * (lock - arm), q.y + sy * lock)
  }
  ctx.stroke()
  ctx.fillStyle = "#fff"
  ctx.shadowColor = `rgb(${ACID})`
  ctx.shadowBlur = 14 * dpr
  ctx.fillRect(q.x - 4 * dpr, q.y - 4 * dpr, 8 * dpr, 8 * dpr)
  ctx.shadowBlur = 0
}

function TravelShot({ t, size }: { t: number; size: { w: number; h: number } }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const travel = travelAt(t)

  useEffect(() => {
    const el = canvas.current
    if (!el || !travel) return
    const dpr = Math.min(devicePixelRatio || 1, 2)
    const w = Math.round(size.w * dpr), h = Math.round(size.h * dpr)
    if (el.width !== w || el.height !== h) { el.width = w; el.height = h }
    drawTravel(el, travel, t)
  }, [t, size, travel])

  if (!travel) return null
  const visible = window01(t, travel.at - 0.3, travel.until + 0.3, 0.3)
  const echo = travel.again === undefined ? 0 : easeOut(ramp(t, travel.again, travel.again + 0.3))
  return (
    <div className={styles.travel} style={{ opacity: visible }}>
      <canvas ref={canvas} className={styles.travelCanvas} />
      <div className={styles.travelText}>
        <p className={styles.travelKicker}><i />{decode(travel.kicker, ramp(t, travel.at - 0.1, travel.at + 0.4), t)}</p>
        <div className={styles.travelPlace}>
          <h3>{decode(travel.place, ramp(t, travel.placeAt, travel.placeAt + 0.45), t) || " "}</h3>
          {echo > 0 && <b className={styles.travelEcho} style={{ transform: `translate(${echo * 22}px, ${echo * 18}px)`, opacity: echo }}>{travel.place} <i>×2</i></b>}
        </div>
        <p className={styles.travelSub}>
          {decode(travel.sub, ramp(t, travel.subAt, travel.subAt + 0.4), t)}
          {t >= travel.at + travel.flight && <span>{decode(coords(travel.to), ramp(t, travel.at + travel.flight, travel.at + travel.flight + 0.5), t)}</span>}
        </p>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- */

const CURVE = [0, 0.04, 0.03, 0.06, 0.05, 0.08, 0.1, 0.22, 0.48, 0.81, 1]
/** The curve in a 1000 × 300 box, stretched to the screen. */
const CURVE_POINTS = CURVE.map((v, i) => `${(i / (CURVE.length - 1)) * 1000},${290 - v * 270}`).join(" ")

function HeroNumber({ t, hero }: { t: number; hero: Hero }) {
  const visible = window01(t, hero.from, hero.to, 0.22)
  if (!visible) return null
  const n = easeOut(ramp(t, hero.countAt, hero.countAt + hero.count)) * hero.value
  const text = hero.format(n)
  const done = t >= hero.countAt + hero.count
  const landed = done ? ramp(t, hero.countAt + hero.count, hero.countAt + hero.count + 0.5) : 0
  const push = lerp(0.97, 1.04, ramp(t, hero.from, hero.to))
  const jitter = t < hero.from + 0.3 ? (hash(Math.floor(t * 40)) - 0.5) * 14 : 0
  const curve = easeOut(ramp(t, hero.countAt, hero.countAt + hero.count))
  return (
    <div className={styles.hero} data-done={done || undefined} style={{ opacity: visible }}>
      {hero.backdrop === "photo" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={styles.heroPhoto} src={STILLS.stadium} alt="" style={{ transform: `scale(${lerp(1.04, 1.14, ramp(t, hero.from, hero.to))})` }} />
      )}
      {hero.backdrop === "curve" && (
        <svg className={styles.heroCurve} viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden="true">
          <polyline points={CURVE_POINTS} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - curve} />
        </svg>
      )}
      {hero.backdrop === "dial" && (
        <svg className={styles.heroDial} viewBox="0 0 200 200" aria-hidden="true" style={{ transform: `translate(-50%, -50%) rotate(${(t - hero.from) * 12}deg)` }}>
          <circle cx={100} cy={100} r={96} /><circle cx={100} cy={100} r={70} />
          {Array.from({ length: 24 }, (_, h) => {
            const a = (h / 24) * Math.PI * 2
            return <line key={h} x1={100 + Math.sin(a) * 96} y1={100 - Math.cos(a) * 96} x2={100 + Math.sin(a) * (h % 6 ? 90 : 84)} y2={100 - Math.cos(a) * (h % 6 ? 90 : 84)} />
          })}
          <line className={styles.heroHand} x1={100} y1={100} x2={100 + Math.sin((t - hero.from) * 4.2) * 94} y2={100 - Math.cos((t - hero.from) * 4.2) * 94} />
        </svg>
      )}
      <div className={styles.heroBody} style={{ transform: `translateX(${jitter}px) scale(${push})` }}>
        <p className={styles.heroKicker}><i />{decode(hero.kicker, ramp(t, hero.from, hero.from + 0.5), t)}</p>
        <b style={{ "--chars": text.length, textShadow: landed ? `0 0 ${40 + 60 * (1 - landed)}px rgba(200,255,0,${0.35 + 0.4 * (1 - landed)})` : undefined } as CSSProperties}>{text}</b>
        <span>{decode(hero.label, ramp(t, hero.from + 0.2, hero.from + 0.7), t)}</span>
      </div>
    </div>
  )
}

/** The full-screen layer: above the board, under the subject file. */
export function Moments({ t, size }: { t: number; size: { w: number; h: number } }) {
  return (
    <div className={styles.moments} aria-hidden="true">
      <TravelShot t={t} size={size} />
      {HEROES.map(hero => <HeroNumber key={hero.label} t={t} hero={hero} />)}
      {DATES.map(date => <BigDate key={date.text} t={t} at={date.at} text={date.text} hold={date.hold} />)}
    </div>
  )
}
