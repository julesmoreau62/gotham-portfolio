"use client"

import { useEffect, useRef, type CSSProperties } from "react"
import imageLoader from "@/lib/image-loader"
import { CUE } from "@/lib/dossier"
import { GLYPHS } from "@/components/home/matrix-portrait"
import { decode, easeInOut, hash, lerp, ramp } from "./timing"
import styles from "./dossier.module.css"

/* SUBJECT FILE — bursts out of the matched tile, rebuilds the portrait
   from code, docks in the corner and keeps updating as the narration
   reveals more about the target. */

const PORTRAIT = imageLoader({ src: "/assets/portfolio/jules-portrait.webp", width: 828 })
/** The part of the photo the frame shows: head and shoulders, the CSS crop below. */
const CROP = { x: 0.1875, y: 0.045, size: 0.625 }
const PLACE_NAMES = ["FRANCE", "FRENCH GUIANA", "CORSICA", "NEW CALEDONIA", "CONGO · BRAZZAVILLE", "FRANCE"]
const GRID = { cols: 46, rows: 61 }

type Field = { label: string; value: string; at: number; flag?: boolean; minor?: boolean }

/** Where the file says the target was last seen, from the childhood moves to the career ones. */
const SIGHTINGS = [
  ...CUE.places.map((place, i) => ({ at: place.at, value: PLACE_NAMES[i] })),
  { at: CUE.field.opal, value: "OPAL COAST · FR" },
  { at: CUE.field.club.at + 1.2, value: "NORTKERQUE · FR" },
  { at: CUE.kourou.place, value: "KOUROU · GF" },
  { at: CUE.lille.move.at + 0.5, value: "LILLE · FR" },
  { at: CUE.daring.brussels, value: "BRUSSELS · BE" },
  { at: CUE.shift.last.at + 0.6, value: "LILLE · FR" },
]

/** The latest value whose time has come, with the moment it changed. */
function latest<T extends { at: number }>(t: number, steps: T[]) {
  return steps.reduce<T | null>((found, step) => (t >= step.at ? step : found), null)
}

function fields(t: number, open: number): Field[] {
  const { unusual, gaming, shift, mission } = CUE
  const seen = latest(t, SIGHTINGS)
  const flag = latest(t, [
    { at: unusual.at + 0.3, value: "UNUSUAL HISTORY", flag: true },
    { at: shift.shift.at, value: "PROFILE SHIFT", flag: true },
    { at: mission.window.at, value: "AVAILABLE · FEB → JUN 2027", flag: false },
  ])
  const interest = latest(t, [
    { at: gaming.at, value: "COMPETITIVE GAMING" },
    { at: shift.builds.at, value: "AI · AUTOMATION · LOCAL MODELS" },
  ])
  const alias = t >= gaming.at + 0.2
  return [
    { label: "NAME", value: "JULES MOREAU", at: open },
    { label: "ALIAS", value: alias ? "SANSBLAZE" : "UNKNOWN", at: alias ? gaming.at + 0.2 : open + 0.1, minor: true },
    { label: "STATUS", value: "M2 · INTL SPORT ADMINISTRATION", at: open + 0.2, minor: true },
    { label: "BASE", value: "LILLE · FR", at: open + 0.3, minor: true },
    { label: "LAST SEEN", value: seen?.value ?? "TRACING…", at: seen?.at ?? open + 0.4 },
    { label: "FLAG", value: flag?.value ?? "NONE", at: flag?.at ?? open + 0.5, flag: flag?.flag },
    { label: "INTEREST", value: interest?.value ?? "PENDING", at: interest?.at ?? open + 0.6 },
  ]
}

/** The portrait drawn in glyphs, brightness from the photo, rebuilt top to bottom. */
function GlyphPortrait({ t, from }: { t: number; from: number }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const sample = useRef<Float32Array | null>(null)
  const drawn = useRef("")

  useEffect(() => {
    const photo = new Image()
    photo.onload = () => {
      const c = document.createElement("canvas")
      c.width = GRID.cols
      c.height = GRID.rows
      const g = c.getContext("2d", { willReadFrequently: true })!
      const w = photo.naturalWidth, h = photo.naturalHeight
      g.drawImage(photo, w * CROP.x, h * CROP.y, w * CROP.size, h * CROP.size, 0, 0, GRID.cols, GRID.rows)
      const data = g.getImageData(0, 0, GRID.cols, GRID.rows).data
      const out = new Float32Array(GRID.cols * GRID.rows)
      for (let i = 0; i < out.length; i++) {
        const a = data[i * 4 + 3] / 255
        out[i] = a < 0.4 ? -1 : (0.2126 * data[i * 4] + 0.7152 * data[i * 4 + 1] + 0.0722 * data[i * 4 + 2]) / 255
      }
      sample.current = out
      drawn.current = ""
    }
    photo.src = PORTRAIT
  }, [])

  useEffect(() => {
    const el = canvas.current
    const lum = sample.current
    if (!el || !lum) return
    const build = ramp(t, from, from + 0.85)
    // Fast while rebuilding, then a slow shimmer.
    const tick = build < 1 ? Math.floor(t * 24) : Math.floor(t * 5)
    const key = `${tick}:${el.clientWidth}`
    if (drawn.current === key) return
    drawn.current = key
    const dpr = Math.min(devicePixelRatio || 1, 2)
    el.width = Math.round(el.clientWidth * dpr)
    el.height = Math.round(el.clientHeight * dpr)
    const ctx = el.getContext("2d")!
    const cw = el.width / GRID.cols, ch = el.height / GRID.rows
    ctx.font = `600 ${Math.round(ch * 0.95)}px ${getComputedStyle(document.documentElement).getPropertyValue("--font-mono").trim() || "monospace"}`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    for (let r = 0; r < GRID.rows; r++) {
      for (let c = 0; c < GRID.cols; c++) {
        const i = r * GRID.cols + c
        const v = lum[i]
        if (v < 0) continue
        if (r / GRID.rows > build * 1.25 - hash(i) * 0.25) continue
        const front = build < 1 && Math.abs(r / GRID.rows - build) < 0.05
        ctx.fillStyle = front ? "rgba(255,255,255,.95)" : `rgba(200,255,0,${0.12 + v * 0.88})`
        ctx.fillText(GLYPHS[Math.floor(hash(i * 1.7 + tick) * GLYPHS.length)], c * cw + cw / 2, r * ch + ch / 2)
      }
    }
  }, [t, from])

  return <canvas ref={canvas} className={styles.glyphs} style={{ opacity: lerp(1, 0.32, ramp(t, from + 0.9, from + 1.5)) }} />
}

export function IdCard({ t }: { t: number }) {
  const { match, rebuild } = CUE
  const grow = ramp(t, match.at + 0.5, match.at + 0.88)
  if (grow <= 0) return null
  const open = match.at + 0.72
  const dock = easeInOut(ramp(t, rebuild.at + 0.15, rebuild.at + 1.05))
  const score = Math.min(99.2, ramp(t, open, open + 0.8) * 99.2)
  const burst = 1 - Math.pow(1 - grow, 4)

  return (
    <div className={styles.cardDock} style={{ "--dock": dock } as CSSProperties} aria-hidden="true">
      <article className={styles.card} data-docked={dock > 0.5 || undefined} style={{ transform: `scale(${0.12 + 0.88 * burst})`, opacity: Math.min(1, grow * 4) }}>
        <header className={styles.cardHead}>
          <span>SUBJECT FILE · JM-0624</span>
          <span className={styles.classified}>CLASSIFIED</span>
        </header>
        <div className={styles.cardBody}>
          <figure className={styles.portrait}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PORTRAIT} alt="" style={{ opacity: ramp(t, open + 0.45, open + 1.1) * 0.92 }} />
            <GlyphPortrait t={t} from={open - 0.1} />
            <span className={styles.faceBox} style={{ opacity: ramp(t, open + 0.7, open + 0.9) }}><i>BIOMETRIC · MASKED</i></span>
            <span className={styles.portraitScan} />
          </figure>
          <dl className={styles.fields}>
            {fields(t, open).map(field => (
              <div key={field.label} className={field.flag ? styles.flagged : undefined} data-minor={field.minor || undefined} style={field.minor && dock > 0 ? { opacity: 1 - dock * 2 } : undefined}>
                <dt>{field.label}</dt>
                <dd>{decode(field.value, ramp(t, field.at, field.at + 0.45), t) || " "}</dd>
              </div>
            ))}
          </dl>
        </div>
        <footer className={styles.cardFoot}>
          <span>MATCH <b>{score.toFixed(1)}%</b></span>
          <span className={styles.barcode} />
        </footer>
      </article>
    </div>
  )
}
