import type { CSSProperties, ReactNode } from "react"
import imageLoader from "@/lib/image-loader"
import { decode, easeOut, hash, pad, ramp, typed } from "./timing"
import styles from "./dossier.module.css"

/* BOARD — the pieces of the investigation board the career chapters
   are built from: pinned exhibits, record cards, stamps, giant dates.
   Each one is placed in percent of the board and timed on the film. */

/** A capture of one of the portfolio's own pages, from public/assets/dossier. */
export const capture = (name: string, width = 1080) => imageLoader({ src: `/assets/dossier/${name}.webp`, width })
export const picture = (src: string, width = 828) => imageLoader({ src, width })

/** Field photos shown as surveillance stills, at the width they are drawn. */
export const STILLS = {
  crowd: picture("/assets/photo/volleyball-2.jpg", 1080),
  volleyball: picture("/assets/photo/volleyball-3.jpg", 1080),
  pitch: picture("/assets/photo/football-8.jpg", 1080),
  stadium: picture("/assets/photo/football-9.jpg", 1920),
  tournament: picture("/assets/photo/asi-4.jpg", 1080),
}

/** Every image the film shows, preloaded during the sound check. */
export const BOARD_IMAGES = [
  ...Object.values(STILLS),
  ...["asn95-posters", "daring-package", "daring-visuals", "thesis-case"].map(name => capture(name)),
  ...["/assets/portfolio/daring-sponsor-site.webp", "/assets/Royal daring/notion/playbook.png", "/assets/Royal daring/logo-DARING.png", "/assets/Royal daring/recap du weekend/1.png",
    ...[1, 2, 3, 4, 5].map(n => `/assets/photo/asi-${n}.jpg`)].map(src => picture(src)),
]

export type Box = { x: number; y: number; w: number; h?: number }

const place = (box: Box): CSSProperties => ({ left: `${box.x}%`, top: `${box.y}%`, width: `${box.w}%`, height: box.h === undefined ? undefined : `${box.h}%` })

/** How far an element has gone: 0 before `at`, 1 once landed; `out` takes it away again. */
function life(t: number, at: number, out?: number, land = 0.18) {
  const p = easeOut(ramp(t, at, at + land))
  const gone = out === undefined ? 0 : ramp(t, out, out + 0.35)
  return { p, gone, visible: p > 0 && gone < 1 }
}

/** A screenshot or photo pinned to the board. It slams in, gets scanned, and can step back. */
export function Exhibit({ t, at, out, dimAt, src, tag, caption, box, tilt = 0, ratio = "16 / 10", fit = "cover", position }: {
  t: number; at: number; out?: number; dimAt?: number
  src: string; tag: string; caption?: string; box: Box; tilt?: number; ratio?: string; fit?: "cover" | "contain"; position?: string
}) {
  const { p, gone, visible } = life(t, at, out)
  if (!visible) return null
  const dim = dimAt === undefined ? 0 : ramp(t, dimAt, dimAt + 0.4)
  const scan = ramp(t, at + 0.15, at + 1.05)
  return (
    <figure className={styles.pin} style={{ ...place(box), opacity: p * (1 - gone) * (1 - dim * 0.6), transform: `rotate(${tilt}deg) scale(${(1.3 - 0.3 * p) * (1 - 0.08 * gone)})` }}>
      <div className={styles.pinImage} style={{ aspectRatio: ratio }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" style={{ objectFit: fit, objectPosition: position }} />
        {scan > 0 && scan < 1 && <span className={styles.pinScan} style={{ top: `${scan * 100}%` }} />}
      </div>
      <span className={styles.tape} />
      <figcaption><b>{tag}</b>{caption && <span>{caption}</span>}</figcaption>
    </figure>
  )
}

/** A camera clock for a still: a fixed time of day per camera, running from the moment it lands. */
function cameraClock(t: number, at: number) {
  const base = 9 * 3600 + Math.floor(hash(Math.round(at * 10)) * 9 * 3600)
  const now = base + Math.max(0, t - at)
  return `${pad(now / 3600)}:${pad((now / 60) % 60)}:${pad(now % 60)}:${pad((now % 1) * 25)}`
}

/** A field photo as a surveillance still: graded to the dossier's ink, framed, timestamped, slowly pushed in. */
export function Still({ t, at, out, dimAt, src, cam, tag, box, tilt = 0, ratio = "3 / 2", position }: {
  t: number; at: number; out?: number; dimAt?: number
  src: string; cam: string; tag: string; box: Box; tilt?: number; ratio?: string; position?: string
}) {
  const { p, gone, visible } = life(t, at, out)
  if (!visible) return null
  const dim = dimAt === undefined ? 0 : ramp(t, dimAt, dimAt + 0.4)
  const scan = ramp(t, at + 0.15, at + 1.05)
  const focus = easeOut(ramp(t, at + 0.2, at + 0.7))
  return (
    <figure className={styles.still} style={{ ...place(box), opacity: p * (1 - gone) * (1 - dim * 0.6), transform: `rotate(${tilt}deg) scale(${(1.3 - 0.3 * p) * (1 - 0.08 * gone)})` }}>
      <div className={styles.stillImage} style={{ aspectRatio: ratio }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" style={{ objectPosition: position, transform: `scale(${1.05 + ramp(t, at, at + 10) * 0.12})`, filter: `grayscale(1) contrast(1.25) brightness(0.9) blur(${(1 - focus) * 6}px)` }} />
        <span className={styles.stillHud}><b><i />REC · {cam}</b><span>{cameraClock(t, at)}</span></span>
        <span className={styles.stillFocus} style={{ opacity: 1 - focus * 0.6, transform: `translate(-50%, -50%) scale(${1.6 - focus * 0.6})` }} />
        {scan > 0 && scan < 1 && <span className={styles.pinScan} style={{ top: `${scan * 100}%` }} />}
        {(["tl", "tr", "bl", "br"] as const).map(corner => <i key={corner} className={styles.crop} data-at={corner} />)}
      </div>
      <figcaption><b>{tag}</b></figcaption>
    </figure>
  )
}

/** A record card: kicker, decoded title, detail lines typed in one after the other. */
export function Record({ t, at, out, kicker, title, titleAt = at + 0.1, lines = [], box, icon, tone }: {
  t: number; at: number; out?: number; kicker: string; title: string; titleAt?: number; lines?: { text: string; at: number }[]; box: Box; icon?: ReactNode; tone?: "red" | "acid"
}) {
  const { p, gone, visible } = life(t, at, out, 0.25)
  if (!visible) return null
  return (
    <div className={styles.record} data-tone={tone} style={{ ...place(box), opacity: p * (1 - gone), transform: `translateX(${(1 - p) * 24}px)` }}>
      <p className={styles.recordKicker}>{icon}{decode(kicker, ramp(t, at, at + 0.35), t)}</p>
      <h4>{decode(title, ramp(t, titleAt, titleAt + 0.5), t) || " "}</h4>
      {lines.map(line => t >= line.at && <p key={line.text} className={styles.recordLine}>{typed(line.text, ramp(t, line.at, line.at + 0.4))}</p>)}
    </div>
  )
}

/** A rubber stamp, slammed onto the board with a small shake. */
export function Stamp({ t, at, out, text, x, y, rotate = -8, tone = "red", size = 1 }: {
  t: number; at: number; out?: number; text: string; x: number; y: number; rotate?: number; tone?: "red" | "acid"; size?: number
}) {
  const { gone, visible } = life(t, at, out)
  if (!visible) return null
  const slam = easeOut(ramp(t, at, at + 0.14))
  const shake = t < at + 0.25 ? (hash(Math.floor(t * 50)) - 0.5) * 10 : 0
  return (
    <div className={styles.boardStamp} data-tone={tone} style={{
      left: `${x}%`, top: `${y}%`, fontSize: `calc(clamp(26px, 3.6vw, 64px) * ${size})`, opacity: 1 - gone,
      transform: `translate(calc(-50% + ${shake}px), -50%) rotate(${rotate}deg) scale(${1.7 - slam * 0.7})`,
    }}>
      {text}
    </div>
  )
}

/** A date that punches through the screen, then drops away to let the chapter start. */
export function BigDate({ t, at, text, hold = 0.7 }: { t: number; at: number; text: string; hold?: number }) {
  const p = ramp(t, at - 0.05, at + 0.2)
  const away = ramp(t, at + hold, at + hold + 0.45)
  if (p <= 0 || away >= 1) return null
  const jitter = p < 1 ? (hash(Math.floor(t * 40)) - 0.5) * 16 : 0
  return (
    <div className={styles.bigDate} style={{ fontSize: `min(9vw, ${(58 / (text.length * 0.64)).toFixed(2)}vw)`, opacity: Math.min(1, p * 2) * (1 - away), transform: `translate(calc(-50% + ${jitter}px), calc(-50% - ${away * 18}vh)) scale(${(1.35 - easeOut(p) * 0.35) * (1 - away * 0.55)})` }}>
      {decode(text, ramp(t, at - 0.05, at + 0.35), t)}
    </div>
  )
}

/** A big metric tile with a number counting up. */
export function Metric({ t, at, out, box, label, value, format, tone, count = 1.2, children }: {
  t: number; at: number; out?: number; box: Box; label: string; value: number; format: (n: number) => string; tone?: "acid" | "red"; count?: number; children?: ReactNode
}) {
  const { p, gone, visible } = life(t, at, out, 0.2)
  if (!visible) return null
  const n = easeOut(ramp(t, at, at + count)) * value
  return (
    <div className={styles.metric} data-tone={tone} style={{ ...place(box), opacity: p * (1 - gone), transform: `translateY(${(1 - p) * 16}px)` }}>
      <b>{format(n)}</b>
      <span>{decode(label, ramp(t, at, at + 0.4), t)}</span>
      {children}
    </div>
  )
}

/** A heading line typed on the board. */
export function Heading({ t, at, out, text, box, size = "md" }: { t: number; at: number; out?: number; text: string; box: Box; size?: "md" | "xl" }) {
  const { p, gone, visible } = life(t, at, out, 0.2)
  if (!visible) return null
  return <p className={styles.boardHeading} data-size={size} style={{ ...place(box), opacity: p * (1 - gone) }}>{decode(text, ramp(t, at, at + 0.5), t)}</p>
}
