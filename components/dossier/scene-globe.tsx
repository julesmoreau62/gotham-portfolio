"use client"

import { useEffect, useRef } from "react"
import { CUE } from "@/lib/dossier"
import { PLACES, PLACE_STOPS, type PlaceId } from "@/lib/journey"
import { DOTS, arcPoints, cameraAt, paintGraticule, paintLand, paintPlanet, placeVec, rotate, type Shot, type Vec } from "./globe"
import { decode, easeInOut, easeOut, hash, lerp, ramp, window01 } from "./timing"
import styles from "./dossier.module.css"
import { glow } from "@/lib/quality"

/* MOVEMENT HISTORY — a dotted globe is scanned into existence, then
   spins to each place as the voice names it, a flight arc lifting off
   between stops. */

const ROUTE: PlaceId[] = ["france", "guiana", "corsica", "caledonia", "congo", "france"]
const STOPS = PLACE_STOPS
const ACID = "200,255,0"
const INK = "242,241,236"

/** Every move of the childhood, France → … → France, as the counters tally it. */
const FULL_ROUTE: PlaceId[] = ["france", "guiana", "corsica", "caledonia", "congo", "france", "guiana", "france"]
const KM = (() => {
  let total = 0
  for (let i = 1; i < FULL_ROUTE.length; i++) {
    const a = placeVec(FULL_ROUTE[i - 1]), b = placeVec(FULL_ROUTE[i])
    total += 6371 * Math.acos(Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]))
  }
  return Math.round(total / 100) * 100
})()

const SHOTS: Shot[] = [
  { at: 0, dur: 0, lon: -38, lat: 16, zoom: 0.82 },
  { at: CUE.unusual.at - 0.6, dur: 5.6, lon: 38, lat: 14, zoom: 0.95 },
  ...CUE.places.map((cue, i) => {
    const { lon, lat } = PLACES[ROUTE[i]]
    return { at: cue.at - 0.42, dur: 0.85, lon, lat: lat * 0.8, zoom: ROUTE[i] === "corsica" ? 1.85 : 1.55 }
  }),
  { at: CUE.interest.at - 0.6, dur: 0.6, lon: 2.4, lat: 30, zoom: 1.2 },
]

let mono = ""
const monoFont = () => (mono ||= getComputedStyle(document.documentElement).getPropertyValue("--font-mono").trim() || "monospace")

/** Six depth shades of ink, then four strengths of acid for the scan and the focus. */
const PALETTE = [...Array.from({ length: 6 }, (_, k) => `rgba(${INK},${0.12 + k * 0.085})`), ...[0.35, 0.55, 0.8, 1].map(a => `rgba(${ACID},${a})`)]

const coords = (id: PlaceId) => {
  const { lat, lon } = PLACES[id]
  return `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? "N" : "S"} ${Math.abs(lon).toFixed(2)}°${lon >= 0 ? "E" : "W"}`
}

function draw(canvas: HTMLCanvasElement, t: number, width: number, height: number) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return
  const dpr = canvas.width / Math.max(1, width)
  const W = canvas.width, H = canvas.height
  const { rebuild, places, interest } = CUE
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, W, H)

  const dock = easeInOut(ramp(t, rebuild.at + 0.15, rebuild.at + 1.05))
  const cam = cameraAt(SHOTS, t)
  const cx = W * lerp(0.5, 0.6, dock)
  const cy = H * 0.53
  const R = Math.min(H * 0.37, W * 0.3) * cam.zoom
  const stop = places.reduce((k, cue, i) => (t >= cue.at ? i : k), -1)
  const project = (v: Vec) => {
    const r = rotate(v, cam)
    return { x: cx + R * r[0], y: cy - R * r[1], z: r[2], out: r[0] * r[0] + r[1] * r[1] > 1 }
  }

  // The screen switches off like an old monitor when the scene ends.
  const off = easeInOut(ramp(t, interest.at - 0.38, interest.at - 0.04))
  if (off > 0) {
    ctx.translate(0, cy)
    ctx.scale(1 + off * 0.2, Math.max(0.006, 1 - off))
    ctx.translate(0, -cy)
  }

  const view = { cam, cx, cy, R }
  paintPlanet(ctx, view, dpr, ramp(t, rebuild.at - 0.1, rebuild.at + 0.6))
  paintGraticule(ctx, view, dpr)

  // Land dots, revealed by a scan line sweeping down the globe.
  const scanY = cy - R + 2 * R * easeInOut(ramp(t, rebuild.at, rebuild.end + 0.25))
  const assembling = t < rebuild.end + 0.25
  const focus = stop >= 0 ? placeVec(ROUTE[stop]) : null
  const heat = stop >= 0 ? ramp(t, places[stop].at, places[stop].at + 0.6) : 0
  paintLand(ctx, view, PALETTE, (i, z, _x, y, vx, vy, vz) => {
    if (assembling && y > scanY) return -1
    const depth = Math.min(5, Math.floor(z * 6))
    if (assembling && scanY - y < 26 * dpr) return 9
    if (!focus || heat <= 0 || DOTS.seed[i] > heat) return depth
    const d = vx * focus[0] + vy * focus[1] + vz * focus[2]
    return d > 0.9992 ? 9 : d > 0.998 ? 8 : d > 0.9962 ? 7 : depth
  }, Math.max(1.4 * dpr, R * 0.0105))
  if (assembling && scanY > cy - R) {
    const half = Math.sqrt(Math.max(0, R * R - (scanY - cy) ** 2))
    ctx.strokeStyle = `rgba(${ACID},0.9)`
    ctx.shadowColor = `rgb(${ACID})`
    ctx.shadowBlur = glow(16 * dpr)
    ctx.lineWidth = 1.5 * dpr
    ctx.beginPath(); ctx.moveTo(cx - half - 30 * dpr, scanY); ctx.lineTo(cx + half + 30 * dpr, scanY); ctx.stroke()
    ctx.shadowBlur = 0
  }

  // Flight arcs between the stops.
  ctx.lineCap = "round"
  for (let i = 0; i < ROUTE.length - 1; i++) {
    const p = easeOut(ramp(t, places[i + 1].at - 0.42, places[i + 1].at + 0.38))
    if (p <= 0) continue
    const active = p < 1 || t < places[i + 1].at + 1.2
    const points = arcPoints(placeVec(ROUTE[i]), placeVec(ROUTE[i + 1]), p).map(project)
    ctx.strokeStyle = active ? `rgba(${ACID},1)` : `rgba(${ACID},0.5)`
    ctx.lineWidth = (active ? 2.4 : 1.4) * dpr
    ctx.shadowColor = `rgb(${ACID})`
    ctx.shadowBlur = glow(active ? 14 * dpr : 0)
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
      ctx.beginPath(); ctx.arc(head.x, head.y, 3.2 * dpr, 0, Math.PI * 2); ctx.fill()
    }
    ctx.shadowBlur = 0
  }

  // Markers: every place reached, and a lock with a callout on the current one.
  const font = monoFont()
  ROUTE.forEach((id, i) => {
    if (stop < i || ROUTE.indexOf(id) !== i) return
    const p = project(placeVec(id))
    if (p.z <= 0.05) return
    const current = ROUTE[stop] === id
    ctx.fillStyle = current ? "#fff" : `rgb(${ACID})`
    ctx.shadowColor = `rgb(${ACID})`
    ctx.shadowBlur = glow(current ? 12 * dpr : 0)
    ctx.fillRect(p.x - 3 * dpr, p.y - 3 * dpr, 6 * dpr, 6 * dpr)
    ctx.shadowBlur = 0
    if (!current) return
    const since = t - places[stop].at
    for (const delay of [0, 0.6]) {
      const pulse = ((since + delay) % 1.2) / 1.2
      ctx.strokeStyle = `rgba(${ACID},${(1 - pulse) * 0.9})`
      ctx.lineWidth = 1.2 * dpr
      ctx.beginPath(); ctx.ellipse(p.x, p.y, (8 + pulse * 40) * dpr, (8 + pulse * 40) * dpr * Math.max(0.4, p.z), 0, 0, Math.PI * 2); ctx.stroke()
    }
    // The lock closes in from wide to tight.
    const lock = (16 + (1 - easeOut(ramp(since, 0, 0.3))) * 46) * dpr, arm = 7 * dpr
    ctx.strokeStyle = "#fff"
    ctx.lineWidth = 1.5 * dpr
    ctx.beginPath()
    for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      ctx.moveTo(p.x + sx * lock, p.y + sy * (lock - arm)); ctx.lineTo(p.x + sx * lock, p.y + sy * lock); ctx.lineTo(p.x + sx * (lock - arm), p.y + sy * lock)
    }
    ctx.stroke()
    // Callout: a leader line out to a label box.
    const reach = easeOut(ramp(since, 0.15, 0.45))
    if (reach <= 0) return
    const ex = p.x + 16 * dpr + 46 * dpr * reach, ey = p.y - 16 * dpr - 46 * dpr * reach
    ctx.strokeStyle = "rgba(255,255,255,.85)"
    ctx.lineWidth = 1 * dpr
    ctx.beginPath(); ctx.moveTo(p.x + 16 * dpr, p.y - 16 * dpr); ctx.lineTo(ex, ey); ctx.lineTo(ex + 22 * dpr * reach, ey); ctx.stroke()
    if (reach < 1) return
    const name = decode(STOPS[stop].place.toUpperCase(), ramp(since, 0.45, 0.8), t)
    ctx.font = `700 ${13 * dpr}px ${font}`
    const boxW = Math.max(ctx.measureText(STOPS[stop].place.toUpperCase()).width, 150 * dpr) + 22 * dpr
    const bx = ex + 22 * dpr, by = ey - 22 * dpr
    ctx.fillStyle = "rgba(5,5,5,.88)"
    ctx.fillRect(bx, by, boxW, 40 * dpr)
    ctx.fillStyle = `rgb(${ACID})`
    ctx.fillRect(bx, by, 2 * dpr, 40 * dpr)
    ctx.fillStyle = "#fff"
    ctx.fillText(name, bx + 11 * dpr, by + 17 * dpr)
    ctx.font = `${10 * dpr}px ${font}`
    ctx.fillStyle = `rgba(${ACID},0.9)`
    ctx.fillText(`${coords(id)} · LOCK`, bx + 11 * dpr, by + 32 * dpr)
  })

  // After the switch-off, a bright line lingers for a moment.
  if (off >= 1) {
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    const fade = 1 - ramp(t, interest.at - 0.04, interest.at + 0.4)
    ctx.fillStyle = `rgba(${INK},${fade})`
    ctx.shadowColor = `rgb(${ACID})`
    ctx.shadowBlur = glow(24 * dpr)
    ctx.fillRect(cx - R * 1.3 * fade, cy - 1 * dpr, R * 2.6 * fade, 2 * dpr)
    ctx.shadowBlur = 0
  }
}

export function GlobeScene({ t, size }: { t: number; size: { w: number; h: number } }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const { rebuild, unusual, childhood, places, interest } = CUE
  const visible = window01(t, rebuild.at - 0.15, interest.at + 0.45, 0.2)

  useEffect(() => {
    const el = canvas.current
    if (!el || !visible) return
    const dpr = Math.min(devicePixelRatio || 1, 2)
    const width = Math.round(size.w * dpr), height = Math.round(size.h * dpr)
    if (el.width !== width || el.height !== height) { el.width = width; el.height = height }
    draw(el, t, size.w, size.h)
  }, [t, size, visible])

  if (!visible) return null
  const stop = places.reduce((k, cue, i) => (t >= cue.at ? i : k), -1)
  const alive = 1 - ramp(t, interest.at - 0.5, interest.at - 0.3)

  return (
    <div className={styles.globe}>
      <canvas ref={canvas} className={styles.globeCanvas} aria-hidden="true" />

      {t >= unusual.at && t < childhood.at + 0.6 && (
        <div className={styles.stamp} style={{
          opacity: 1 - ramp(t, childhood.at + 0.2, childhood.at + 0.6),
          transform: `translate(-50%, -50%) rotate(-8deg) scale(${1.7 - easeOut(ramp(t, unusual.at, unusual.at + 0.14)) * 0.7})`,
          translate: t < unusual.at + 0.3 ? `${(hash(Math.floor(t * 50)) - 0.5) * 12}px ${(hash(Math.floor(t * 50) + 1) - 0.5) * 12}px` : undefined,
        }}>
          UNUSUAL HISTORY
        </div>
      )}

      {t >= childhood.at && (
        <div className={styles.mobility} style={{ opacity: ramp(t, childhood.at, childhood.at + 0.3) * alive }}>
          <span>RELOCATIONS <b>{String(Math.round(ramp(t, childhood.at, childhood.end) * 7)).padStart(2, "0")}</b></span>
          <span>CONTINENTS <b>{String(Math.round(ramp(t, childhood.at + 0.4, childhood.end) * 4)).padStart(2, "0")}</b></span>
          <span>DISTANCE <b>≈ {(Math.round((easeOut(ramp(t, childhood.at, childhood.end + 0.3)) * KM) / 100) * 100).toLocaleString("en-US")} KM</b></span>
        </div>
      )}

      {stop >= 0 && (
        <div className={styles.entry} key={stop} style={{ opacity: alive }}>
          <div className={styles.entryTop}>
            <span>ENTRY {String(stop + 1).padStart(2, "0")} / 06</span>
            <span>{coords(ROUTE[stop])}</span>
          </div>
          <h3>{decode(STOPS[stop].place.toUpperCase(), ramp(t, places[stop].at, places[stop].at + 0.4), t)}</h3>
          <p className={styles.entryTag}>ACQUIRED · {decode(STOPS[stop].lesson.toUpperCase(), ramp(t, places[stop].at + 0.15, places[stop].at + 0.55), t)}</p>
          <p className={styles.entryNote}>{decode(STOPS[stop].text, ramp(t, places[stop].at + 0.2, places[stop].at + 0.9), t)}</p>
          <div className={styles.entryTrail}>
            {ROUTE.map((id, i) => <i key={i} data-on={i <= stop || undefined} title={STOPS[i].place} />)}
          </div>
        </div>
      )}
    </div>
  )
}
