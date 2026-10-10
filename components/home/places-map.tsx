"use client"

import { useEffect, useRef, useState } from "react"
import { useInView } from "framer-motion"
import { useReducedMotion } from "@/hooks/use-media"
import { PLACES, type PlaceId, type PlaceStop } from "@/lib/journey"
import { WORLD_DOTS } from "@/lib/world-dots"
import { cn } from "@/lib/utils"
import styles from "./places-map.module.css"

/* ------------------------------------------------------------------
   PLACES MAP — the eight moves drawn as a route on a dotted world map.
   Equirectangular in degrees: x = lon + 180, y = 75 - lat (75°N → 57°S).
   ------------------------------------------------------------------ */

const VIEW = { width: 360, height: 132, latTop: 75 }
const STEP_MS = 1500

const project = ({ lat, lon }: { lat: number; lon: number }) => [lon + 180, VIEW.latTop - lat] as const

/** One zero-length round-capped segment per land cell: a single path for ~4,000 dots. */
const DOTS_PATH = (() => {
  const { bits, cols, rows, step, lonStart, latStart } = WORLD_DOTS
  const bytes = Uint8Array.from(atob(bits), c => c.charCodeAt(0))
  let d = ""
  for (let i = 0; i < cols * rows; i++) {
    if (!(bytes[i >> 3] & (0x80 >> (i & 7)))) continue
    const [x, y] = project({ lat: latStart - Math.floor(i / cols) * step, lon: lonStart + (i % cols) * step })
    d += `M${x} ${y}h.01`
  }
  return d
})()

/** How far each leg bows: trips out to French Guiana arc north, trips back arc south. */
const BENDS = [0.22, 0.3, 0.14, -0.12, 0.3, 0.42, 0.14]

/** Where each place name sits around its marker. */
const LABELS: Record<PlaceId, { dx: number; dy: number; anchor: "start" | "end" }> = {
  france: { dx: -2.2, dy: -2, anchor: "end" },
  corsica: { dx: 2.2, dy: 3.4, anchor: "start" },
  guiana: { dx: -2.2, dy: 1, anchor: "end" },
  congo: { dx: 2.2, dy: 3, anchor: "start" },
  caledonia: { dx: -2.2, dy: -2, anchor: "end" },
}

function leg(from: PlaceId, to: PlaceId, bend: number) {
  const [ax, ay] = project(PLACES[from])
  const [bx, by] = project(PLACES[to])
  const cx = (ax + bx) / 2 + (by - ay) * bend
  const cy = (ay + by) / 2 - (bx - ax) * bend
  return `M${ax} ${ay}Q${cx.toFixed(2)} ${cy.toFixed(2)} ${bx} ${by}`
}

const pad = (n: number) => String(n).padStart(2, "0")

type Copy = {
  stops: PlaceStop[]
  mapLabel: string
  compass: { n: string; s: string; e: string; w: string }
  controls: { prev: string; next: string; replay: string }
}

export function PlacesMap({ t }: { t: Copy }) {
  const { stops } = t
  const last = stops.length - 1
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  // The server and no-JS render show the whole route; with motion it rewinds and plays once in view.
  const [active, setActive] = useState(last)
  const [playing, setPlaying] = useState(false)
  const [touched, setTouched] = useState(false)

  useEffect(() => { setActive(reduced ? last : 0) }, [reduced, last])
  useEffect(() => { if (inView && !reduced && !touched) setPlaying(true) }, [inView, reduced, touched])
  useEffect(() => {
    if (!playing) return
    if (active >= last) { setPlaying(false); return }
    const id = setTimeout(() => setActive(active + 1), STEP_MS)
    return () => clearTimeout(id)
  }, [playing, active, last])

  const select = (i: number) => { setPlaying(false); setTouched(true); setActive(i) }
  const replay = () => { setTouched(false); setActive(0); setPlaying(!reduced) }

  const legs = stops.slice(1).map((stop, i) => leg(stops[i].at, stop.at, BENDS[i] ?? 0.2))
  const places = [...new Set(stops.map(s => s.at))].map(id => ({
    id,
    name: stops.find(s => s.at === id)!.place,
    visits: stops.flatMap((s, i) => (s.at === id ? [i] : [])),
  }))
  const stop = stops[active]
  const { lat, lon } = PLACES[stop.at]
  const coords = `${Math.abs(lat).toFixed(2)}° ${lat >= 0 ? t.compass.n : t.compass.s} · ${Math.abs(lon).toFixed(2)}° ${lon >= 0 ? t.compass.e : t.compass.w}`

  return (
    <div ref={ref}>
      <div className={styles.view}>
        <div className={styles.map}>
          <svg className={styles.svg} viewBox={`0 0 ${VIEW.width} ${VIEW.height}`} preserveAspectRatio="xMaxYMid slice" role="img" aria-label={t.mapLabel}>
            <line x1={0} x2={VIEW.width} y1={VIEW.latTop} y2={VIEW.latTop} className={styles.equator} />
            <path d={DOTS_PATH} className={styles.dots} />
            <path d={legs.join("")} className={styles.ghost} />
            {legs.map((d, i) => <path key={i} d={d} pathLength={1} className={cn(styles.leg, i < active && styles.legDone)} />)}
            {places.map(place => {
              const [x, y] = project(PLACES[place.id])
              const label = LABELS[place.id]
              return (
                <g key={place.id} transform={`translate(${x} ${y})`} className={cn(styles.marker, place.visits[0] <= active && styles.visited, stop.at === place.id && styles.current)}>
                  {stop.at === place.id && <circle r={3} className={styles.pulse} />}
                  <rect x={-0.9} y={-0.9} width={1.8} height={1.8} />
                  <text x={label.dx} y={label.dy} textAnchor={label.anchor} className={styles.label}>
                    {place.name}<tspan className={styles.visits}> {place.visits.map(i => pad(i + 1)).join("·")}</tspan>
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        <div className={styles.panel} aria-live={touched ? "polite" : "off"}>
          <div key={active} className={styles.panelBody}>
            <div className={styles.panelTop}><span>{pad(active + 1)} / {pad(stops.length)}</span><span>{coords}</span></div>
            <h4>{stop.place}</h4>
            <span className={styles.lesson}>{stop.lesson}</span>
            <p>{stop.text}</p>
          </div>
          <div className={styles.controls}>
            <button type="button" onClick={() => select(active - 1)} disabled={active === 0} aria-label={t.controls.prev}>←</button>
            <button type="button" onClick={() => select(active + 1)} disabled={active === last} aria-label={t.controls.next}>→</button>
            {active === last && !playing && <button type="button" onClick={replay} className={styles.replay}>↺ {t.controls.replay}</button>}
          </div>
        </div>
      </div>

      <ol className={styles.steps}>
        {stops.map((s, i) => (
          <li key={i}>
            <button type="button" onClick={() => select(i)} aria-current={i === active ? "step" : undefined} className={cn(styles.step, i <= active && styles.stepDone, i === active && styles.stepActive)}>
              <span>{pad(i + 1)}</span>{s.place}
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}
