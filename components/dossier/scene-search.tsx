"use client"

import { useEffect, useRef, useState } from "react"
import { GLYPHS } from "@/components/home/matrix-portrait"
import { CUE } from "@/lib/dossier"
import { STILLS } from "./board"
import { decode, easeOut, hash, ramp, typed, window01 } from "./timing"
import styles from "./dossier.module.css"

/* BOOT + SEARCH — the secure link opens over the archive number, then
   a crowd is scanned face by face until the spoken name filters every
   one out and leaves a single match. */

const BOOT = [
  { text: "ESTABLISHING SECURE LINK", ok: "OK", at: 0.3, done: 0.8 },
  { text: "DECRYPTING ARCHIVE JM-0624", ok: "OK", at: 0.9, done: 1.4 },
  { text: "OPERATOR CLEARANCE · RECRUITER", ok: "GRANTED", at: 1.5, done: 2.0 },
]

export function BootScene({ t }: { t: number }) {
  const visible = window01(t, 0, CUE.search.at - 0.05, 0.2)
  if (!visible) return null
  const decrypt = ramp(t, 0.3, 2.2)
  return (
    <>
      <p className={styles.bootId} style={{ opacity: visible * ramp(t, 0.05, 0.5) * 0.9, transform: `translate(-50%, -50%) scale(${1 + t * 0.02})` }} aria-hidden="true">
        {decode("JM-0624", ramp(t, 0.15, 1.5), t)}
      </p>
      <div className={styles.boot} style={{ opacity: visible }}>
        {BOOT.map(line => {
          const shown = ramp(t, line.at, line.at + 0.3)
          if (!shown) return null
          const dots = Math.round(ramp(t, line.at + 0.2, line.done) * 18)
          return (
            <p key={line.text}>
              <span className={styles.prompt}>&gt;</span> {typed(line.text, shown)}
              <span className={styles.dots}>{" " + ".".repeat(dots)}</span>
              {t >= line.done && <b>{line.ok}</b>}
            </p>
          )
        })}
        <div className={styles.bootBar}><i><b style={{ transform: `scaleX(${decrypt})` }} /></i><span>{decrypt < 1 ? `DECRYPTING · ${Math.round(decrypt * 100)}%` : "ARCHIVE OPEN"}</span></div>
      </div>
    </>
  )
}

/** The crowd photo, redrawn in glyphs: a face index where no face can be read. */
const MOSAIC = { cols: 132, rows: 66 }
/** The part of the photo used: the stands, cropped to the 2:1 frame. */
const CROP = { y: 0.02, h: 0.75 }
const BOXES = 8
const RECORDS = 1_483_207
const FACES = 2_431
const NAME = "JULES MOREAU"

function CrowdMosaic({ t, dim }: { t: number; dim: number }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const sample = useRef<Float32Array | null>(null)
  const drawn = useRef("")
  // Draws as soon as the photo is in, even on a paused frame.
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const photo = new Image()
    photo.onload = () => {
      const c = document.createElement("canvas")
      c.width = MOSAIC.cols
      c.height = MOSAIC.rows
      const g = c.getContext("2d", { willReadFrequently: true })!
      const w = photo.naturalWidth, h = photo.naturalHeight
      g.drawImage(photo, 0, h * CROP.y, w, h * CROP.h, 0, 0, MOSAIC.cols, MOSAIC.rows)
      const data = g.getImageData(0, 0, MOSAIC.cols, MOSAIC.rows).data
      const out = new Float32Array(MOSAIC.cols * MOSAIC.rows)
      for (let i = 0; i < out.length; i++) out[i] = (0.2126 * data[i * 4] + 0.7152 * data[i * 4 + 1] + 0.0722 * data[i * 4 + 2]) / 255
      sample.current = out
      drawn.current = ""
      setLoaded(true)
    }
    photo.src = STILLS.crowd
  }, [])

  useEffect(() => {
    const el = canvas.current
    const lum = sample.current
    if (!el || !lum) return
    const tick = Math.floor(t * 12)
    const key = `${tick}:${el.clientWidth}:${dim.toFixed(2)}`
    if (drawn.current === key) return
    drawn.current = key
    const dpr = Math.min(devicePixelRatio || 1, 2)
    el.width = Math.round(el.clientWidth * dpr)
    el.height = Math.round(el.clientHeight * dpr)
    const ctx = el.getContext("2d")!
    const cw = el.width / MOSAIC.cols, ch = el.height / MOSAIC.rows
    ctx.font = `600 ${Math.round(ch * 1.05)}px ${getComputedStyle(document.documentElement).getPropertyValue("--font-mono").trim() || "monospace"}`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    // A bright band sweeps down the crowd, over and over.
    const band = ((t * 0.55) % 1) * MOSAIC.rows
    for (let r = 0; r < MOSAIC.rows; r++) {
      const lit = Math.max(0, 1 - Math.abs(r - band) / 3)
      for (let c = 0; c < MOSAIC.cols; c++) {
        const i = r * MOSAIC.cols + c
        const v = lum[i]
        // Contrast pushed so the stands and the people in them read as shapes.
        const alpha = Math.min(1, Math.max(0.04, (v - 0.12) * 1.7)) * (1 - dim * 0.7)
        if (alpha < 0.05 && !lit) continue
        ctx.fillStyle = lit > 0.5 ? `rgba(255,255,255,${Math.min(1, alpha + 0.4)})` : `rgba(200,255,0,${Math.min(1, alpha + lit * 0.4)})`
        // Each glyph changes now and then, out of step with its neighbours.
        ctx.fillText(GLYPHS[Math.floor(hash(i * 1.7 + Math.floor((tick + hash(i) * 8) / 8)) * GLYPHS.length)], c * cw + cw / 2, r * ch + ch / 2)
      }
    }
  }, [t, dim, loaded])

  return <canvas ref={canvas} className={styles.mosaic} />
}

export function SearchScene({ t }: { t: number }) {
  const { search, name, match } = CUE
  const visible = window01(t, search.at - 0.3, match.at + 0.75, 0.3)
  if (!visible) return null

  const query = typed(NAME, ramp(t, name.at, name.end))
  const records = Math.round(easeOut(ramp(t, search.at - 0.3, match.at)) * RECORDS)
  const filtering = t >= name.end
  const faces = Math.max(1, Math.round(FACES * (1 - easeOut(ramp(t, name.end, match.at)))))
  const dim = ramp(t, name.end, match.at)
  const lock = easeOut(ramp(t, match.at - 0.1, match.at + 0.3))
  const status = t >= match.at ? "MATCH FOUND · 99.2%" : filtering ? "FILTERING BY NAME" : t >= name.at ? "PARSING QUERY" : "SCANNING CROWD · FACIAL INDEX"
  // The boxes hop from face to face, then freeze on "no match" once the name filters them out.
  const clock = filtering ? name.end : t

  return (
    <div className={styles.search} style={{ opacity: visible }}>
      <div className={styles.query}>
        <span>QUERY ›</span>
        <b>{query || (t < name.at ? "*" : "")}</b>
        <i className={styles.caret} />
      </div>
      <div className={styles.crowd}>
        <CrowdMosaic t={t} dim={dim} />
        {Array.from({ length: BOXES }, (_, k) => {
          const epoch = Math.floor((clock + k * 0.11) * 5.5)
          const w = 5 + hash(epoch * 5.1 + k) * 4
          const x = 4 + hash(epoch * 13.7 + k * 3) * (90 - w)
          const y = 10 + hash(epoch * 7.3 + k * 11) * 62
          const gone = filtering ? ramp(t, name.end + 0.1 + k * 0.08, name.end + 0.5 + k * 0.08) : 0
          if (gone >= 1) return null
          return (
            <span key={k} className={styles.faceScan} data-miss={filtering || undefined} style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${w * 2}%`, opacity: 1 - gone }}>
              <em>{filtering ? "NO MATCH" : `#${4000 + Math.floor(hash(epoch + k * 31) * 5999)} · ${20 + Math.floor(hash(epoch * 3 + k) * 70)}%`}</em>
            </span>
          )
        })}
        {lock > 0 && <em className={styles.lockBox} data-center style={{ opacity: lock, transform: `translate(-50%, -50%) scale(${2.2 - lock * 1.2})` }} />}
      </div>
      <div className={styles.searchStats}>
        <span>RECORDS <b>{records.toLocaleString("en-US")}</b></span>
        <span>FACES IN FRAME <b>{faces.toLocaleString("en-US")}</b></span>
        <span className={t >= match.at ? styles.ok : undefined}>{status}</span>
      </div>
    </div>
  )
}

/** The giant MATCH FOUND that punches through the grid. */
export function MatchFlash({ t }: { t: number }) {
  const { match } = CUE
  const p = ramp(t, match.at, match.at + 0.62)
  if (p <= 0 || p >= 1) return null
  const jitter = p < 0.4 ? (hash(Math.floor(t * 40)) - 0.5) * 14 : 0
  // Gone before the subject file bursts out of the tile.
  return (
    <div className={styles.matchFlash} style={{ opacity: 1 - ramp(t, match.at + 0.38, match.at + 0.62), transform: `translate(calc(-50% + ${jitter}px), -50%) scale(${(1.25 - easeOut(ramp(t, match.at, match.at + 0.25)) * 0.25) * (1 + ramp(t, match.at + 0.38, match.at + 0.62) * 0.35)})` }}>
      MATCH FOUND
    </div>
  )
}
