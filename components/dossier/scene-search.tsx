import type { CSSProperties } from "react"
import { CUE } from "@/lib/dossier"
import { easeOut, hash, ramp, typed, window01 } from "./timing"
import styles from "./dossier.module.css"

/* BOOT + SEARCH — the secure link opens, then a face database is
   scanned until the spoken name leaves a single match. */

const BOOT = [
  { text: "ESTABLISHING SECURE LINK", ok: "OK", at: 0.3, done: 0.8 },
  { text: "DECRYPTING ARCHIVE JM-0624", ok: "OK", at: 0.9, done: 1.4 },
  { text: "OPERATOR CLEARANCE · RECRUITER", ok: "GRANTED", at: 1.5, done: 2.0 },
]

export function BootScene({ t }: { t: number }) {
  const visible = window01(t, 0, CUE.search.at - 0.05, 0.2)
  if (!visible) return null
  return (
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
    </div>
  )
}

const COLS = 11
const ROWS = 5
const TILES = COLS * ROWS
/** The middle tile: the subject file bursts out of the centre of the screen. */
const TARGET = 27
const RECORDS = 1_483_207
const NAME = "JULES MOREAU"

export function SearchScene({ t }: { t: number }) {
  const { search, name, match } = CUE
  const visible = window01(t, search.at - 0.3, match.at + 0.75, 0.3)
  if (!visible) return null

  const scanning = t < match.at
  const query = typed(NAME, ramp(t, name.at, name.end))
  const records = Math.round(easeOut(ramp(t, search.at - 0.3, match.at)) * RECORDS)
  const outAt = (i: number) => name.end - 0.1 + hash(i) * (match.at - name.end - 0.05)
  const candidates = Array.from({ length: TILES }, (_, i) => i).filter(i => i === TARGET || t < outAt(i)).length
  const tick = Math.floor(t * 14)
  const hot = new Set([0, 1, 2].map(k => Math.floor(hash(tick * 3 + k) * TILES)))
  const lock = ramp(t, match.at, match.at + 0.3)
  const status = t >= match.at ? "MATCH FOUND · 99.2%" : t >= name.end ? "FILTERING BY NAME" : t >= name.at ? "PARSING QUERY" : "SCANNING FACIAL INDEX"

  return (
    <div className={styles.search} style={{ opacity: visible }}>
      <div className={styles.query}>
        <span>QUERY ›</span>
        <b>{query || (t < name.at ? "*" : "")}</b>
        <i className={styles.caret} />
      </div>
      <div className={styles.grid} style={{ "--cols": COLS } as CSSProperties}>
        {Array.from({ length: TILES }, (_, i) => {
          const target = i === TARGET
          const out = !target && t >= outAt(i)
          const state = target && t >= match.at ? "target" : out ? "out" : scanning && hot.has(i) ? "hot" : "idle"
          const tilt = hash(i + 50)
          return (
            <div key={i} className={styles.tile} data-state={state} style={target ? { transform: `scale(${1 + lock * 0.18})` } : undefined}>
              <svg viewBox="0 0 40 44" aria-hidden="true">
                <circle cx={20 + (tilt - 0.5) * 3} cy={15 + tilt * 2} r={6.5 + hash(i + 9) * 1.6} />
                <path d={`M${5 + tilt * 3} 44Q${6} ${27 + tilt * 2} 20 ${26 + tilt * 2}Q34 ${27 + tilt * 2} ${35 - tilt * 3} 44Z`} />
              </svg>
              <span>#{String(1000 + Math.floor(hash(i + 3) * 8999))}</span>
              {state === "target" && <em className={styles.lockBox} />}
            </div>
          )
        })}
      </div>
      <div className={styles.searchStats}>
        <span>RECORDS <b>{records.toLocaleString("en-US")}</b></span>
        <span>CANDIDATES <b>{String(candidates).padStart(2, "0")}</b></span>
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
