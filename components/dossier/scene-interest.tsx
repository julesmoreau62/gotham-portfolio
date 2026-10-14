import type { CSSProperties } from "react"
import imageLoader from "@/lib/image-loader"
import { CAREER_START, CUE } from "@/lib/dossier"
import { decode, easeInOut, easeOut, hash, ramp, typed, window01 } from "./timing"
import styles from "./dossier.module.css"

/* INTEREST PROFILE — a behavioural radar locks onto one signal,
   the evidence lands on the desk, then the view pulls back from the
   match to everything that surrounds it. */

const img = (src: string) => imageLoader({ src, width: 828 })

const EXHIBITS = [
  { tag: "EXHIBIT A", title: "OVERWATCH", lines: ["1,289 H LOGGED", "TOP 20–200 · 2 YEARS RANKED"], src: img("/assets/games/OW/Capture d'écran 2026-09-16 115505.png"), tilt: -5 },
  { tag: "EXHIBIT B", title: "COUNTER-STRIKE", lines: ["10-YEAR VETERAN", "FACEIT LEVEL 10"], src: img("/assets/games/CS/Capture d'écran 2026-09-16 115844.png"), tilt: 3 },
  { tag: "EXHIBIT C", title: "MINECRAFT", lines: ["250+ H", "A CITY BUILT BY HAND"], src: img("/assets/games/Minecraft/web/skyline.webp"), tilt: -2 },
]

const AROUND = ["THE TEAM", "THE COMMUNITY", "TOURNAMENT OPS", "THE BROADCAST", "SPONSORS", "LOGISTICS", "THE DATA"]
const SWEEP = 280
/** Where the strong signal sits on the radar, in degrees clockwise from north and share of the radius. */
const SIGNAL = { angle: 52, radius: 0.62 }
const NOISE = Array.from({ length: 14 }, (_, i) => ({ angle: hash(i + 1) * 360, radius: 0.15 + hash(i + 40) * 0.8 }))

/** How bright a blip is: it flares when the sweep passes, then fades. */
const echo = (t: number, angle: number) => {
  const behind = (((t * SWEEP - angle) % 360) + 360) % 360
  return Math.max(0, 1 - behind / 200)
}

const polar = (angle: number, radius: number) => {
  const a = ((angle - 90) * Math.PI) / 180
  return { x: 100 + Math.cos(a) * radius * 92, y: 100 + Math.sin(a) * radius * 92 }
}

function Radar({ t }: { t: number }) {
  const { interest, gaming } = CUE
  const strength = ramp(t, interest.at + 0.4, gaming.at - 0.1)
  const locked = t >= gaming.at - 0.15
  const zoom = easeInOut(ramp(t, gaming.at, gaming.at + 0.45))
  const signal = polar(SIGNAL.angle, SIGNAL.radius)
  return (
    <div className={styles.radar} style={{ opacity: 1 - zoom, transform: `translate(-50%, -50%) scale(${1 + zoom * 2.4})`, transformOrigin: `${signal.x / 2}% ${signal.y / 2}%` }}>
      <div className={styles.radarSweep} style={{ transform: `rotate(${(t * SWEEP) % 360}deg)` }} />
      <svg viewBox="0 0 200 200" aria-hidden="true">
        {[0.33, 0.66, 1].map(r => <circle key={r} cx={100} cy={100} r={r * 92} className={styles.radarRing} />)}
        <line x1={8} x2={192} y1={100} y2={100} className={styles.radarRing} />
        <line x1={100} x2={100} y1={8} y2={192} className={styles.radarRing} />
        {NOISE.map((blip, i) => {
          const p = polar(blip.angle, blip.radius)
          return <circle key={i} cx={p.x} cy={p.y} r={1.6} className={styles.blip} opacity={echo(t, blip.angle) * 0.6} />
        })}
        {strength > 0 && <circle cx={signal.x} cy={signal.y} r={2.5 + strength * 2.5} className={styles.blipHot} opacity={locked ? 1 : 0.25 + echo(t, SIGNAL.angle) * strength} />}
        {locked && (
          <g className={styles.radarLock}>
            <rect x={signal.x - 11} y={signal.y - 11} width={22} height={22} />
            <line x1={signal.x + 11} y1={signal.y - 11} x2={signal.x + 30} y2={signal.y - 30} />
          </g>
        )}
      </svg>
      {locked && <span className={styles.radarLabel} style={{ left: `${(signal.x + 31) / 2}%`, top: `${(signal.y - 31) / 2}%` }}>SIGNAL 07 · STRONG</span>}
    </div>
  )
}

export function InterestScene({ t }: { t: number }) {
  const { interest, gaming, game, around } = CUE
  const visible = window01(t, interest.at - 0.1, CAREER_START + 0.2, 0.3)
  if (!visible) return null

  const scan = ramp(t, interest.at, gaming.at)
  const hit = t >= gaming.at
  const pullBack = easeOut(ramp(t, game.at - 0.1, game.at + 0.6))
  const network = ramp(t, around.at, around.end)
  const titleP = ramp(t, gaming.at, gaming.at + 0.35)

  return (
    <div className={styles.interest} style={{ opacity: visible }}>
      <div className={styles.scanHead} style={{ opacity: 1 - ramp(t, gaming.at + 0.05, gaming.at + 0.3) }}>
        <span className={styles.panelLabel}>BEHAVIOURAL SCAN · {String(Math.round(scan * 100)).padStart(3, "0")}%</span>
        <p className={styles.scanLine}>{typed("FIRST INTEREST DETECTED:", ramp(t, interest.at, interest.end))}<i className={styles.caret} /></p>
      </div>
      {t < gaming.at + 0.5 && <Radar t={t} />}

      {hit && (
        <h2 className={styles.bigTitle} style={{
          opacity: titleP,
          transform: `translate(-50%, -50%) scale(${(1.3 - easeOut(titleP) * 0.3) * (1 - pullBack * 0.45)})`,
          top: `${30 - pullBack * 16}%`,
        }}>
          {decode("COMPETITIVE GAMING", ramp(t, gaming.at, gaming.at + 0.5), t)}
        </h2>
      )}

      <div className={styles.exhibits} style={{ opacity: 1 - 0.72 * ramp(t, game.at, game.at + 0.5) - 0.28 * ramp(t, around.at, around.at + 0.5) }}>
        {EXHIBITS.map((exhibit, i) => {
          const at = gaming.at + 0.1 + i * 0.32
          const p = ramp(t, at, at + 0.16)
          if (!p) return null
          return (
            <figure key={exhibit.tag} className={styles.exhibit} style={{ "--tilt": `${exhibit.tilt}deg`, "--land": easeOut(p), "--drop": pullBack } as CSSProperties}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={exhibit.src} alt="" />
              <span className={styles.tape} />
              <figcaption>
                <b>{exhibit.tag} · {exhibit.title}</b>
                {exhibit.lines.map(line => <span key={line}>{line}</span>)}
              </figcaption>
            </figure>
          )
        })}
      </div>

      {t >= game.at && (
        <div className={styles.arena} style={{ opacity: ramp(t, game.at, game.at + 0.4) }}>
          <svg className={styles.links} viewBox="-50 -50 100 100" preserveAspectRatio="none" aria-hidden="true">
            {AROUND.map((_, i) => {
              const angle = (i / AROUND.length) * Math.PI * 2 - Math.PI / 2
              const p = easeOut(ramp(t, around.at + 0.25 + i * 0.2, around.at + 0.55 + i * 0.2))
              return p > 0 && <line key={i} x1={0} y1={0} x2={Math.cos(angle) * 40 * p} y2={Math.sin(angle) * 40 * p} vectorEffect="non-scaling-stroke" />
            })}
          </svg>
          {AROUND.map((_, i) => {
            const angle = (i / AROUND.length) * Math.PI * 2 - Math.PI / 2
            if (t < around.at + 0.55 + i * 0.2) return null
            // Data keeps flowing out to each node once it is linked.
            return [0, 0.5].map(offset => {
              const s = ((t * 0.9 + i * 0.37 + offset) % 1)
              return <span key={`${i}-${offset}`} className={styles.packet} style={{ left: `${50 + Math.cos(angle) * 40 * s}%`, top: `${50 + Math.sin(angle) * 40 * s}%`, opacity: Math.sin(Math.PI * s) }} />
            })
          })}
          <div className={styles.matchCard} style={{ transform: `translate(-50%, -50%) scale(${1 - network * 0.18})` }}>
            <span>LIVE MATCH · ROUND 24</span>
            <b>13 <i>:</i> 11</b>
            <span className={styles.crossMark} />
            {t >= game.at + 0.9 && <em className={styles.low}>PRIORITY ▼ LOW</em>}
          </div>
          {AROUND.map((label, i) => {
            const angle = (i / AROUND.length) * Math.PI * 2 - Math.PI / 2
            const at = around.at + 0.45 + i * 0.2
            const p = ramp(t, at, at + 0.25)
            if (!p) return null
            return (
              <span key={label} className={styles.node} style={{ left: `${50 + Math.cos(angle) * 40}%`, top: `${50 + Math.sin(angle) * 40}%`, opacity: p }}>
                <i />{decode(label, ramp(t, at, at + 0.4), t)}
              </span>
            )
          })}
          {t >= around.at + 1.2 && <em className={styles.high} style={{ opacity: ramp(t, around.at + 1.2, around.at + 1.5) }}>EVERYTHING AROUND IT · PRIORITY ▲ HIGH</em>}
        </div>
      )}
    </div>
  )
}
