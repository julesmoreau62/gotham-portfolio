import { ChartColumn, Handshake, MessagesSquare, Radio, Trophy, Truck, Users, type LucideIcon } from "lucide-react"
import { CAREER_START, CUE, MONTAGE_CUT as CUT } from "@/lib/dossier"
import { capture, picture } from "./board"
import { decode, easeInOut, easeOut, hash, lerp, ramp, timecode, typed, window01 } from "./timing"
import styles from "./dossier.module.css"

/* INTEREST PROFILE — a behavioural radar locks onto one signal and the
   film cuts into the target's own feed: a montage of his CS2 plays, the
   three games on record slammed onto it. Then the feed shrinks to one
   small match on a monitor, and everything around it lights up. */

/** Frames from Jules's CS2 highlights film (the one behind the games page). */
const MONTAGE = [1, 2, 3, 4, 5, 6].map(n => capture(`cs2-${n}`, 1440))
/** "Manche gagnée": the round won, kept on the monitor once the camera pulls back. */
const ROUND = capture("cs2-round", 1080)

const EVIDENCE = [
  { stat: "TOP 20–200", game: "OVERWATCH", line: "RANKED · 2 YEARS · 1,289 H", src: picture("/assets/games/OW/Capture d'écran 2026-09-16 115505.png"), tilt: -2.4, position: "0% 0%" },
  { stat: "LEVEL 10", game: "COUNTER-STRIKE", line: "FACEIT · 10-YEAR VETERAN", src: picture("/assets/games/CS/Capture d'écran 2026-09-16 115844.png"), tilt: 1.6, position: "50% 45%" },
  { stat: "250+ H", game: "MINECRAFT", line: "A CITY BUILT BY HAND", src: picture("/assets/games/Minecraft/web/skyline.webp"), tilt: -1.2, position: "50% 50%" },
]

/** Everything the scene shows, preloaded during the sound check. */
export const INTEREST_IMAGES = [...MONTAGE, ROUND, ...EVIDENCE.map(card => card.src)]

const AROUND: { label: string; icon: LucideIcon }[] = [
  { label: "THE TEAM", icon: Users },
  { label: "THE COMMUNITY", icon: MessagesSquare },
  { label: "TOURNAMENT OPS", icon: Trophy },
  { label: "THE BROADCAST", icon: Radio },
  { label: "SPONSORS", icon: Handshake },
  { label: "LOGISTICS", icon: Truck },
  { label: "THE DATA", icon: ChartColumn },
]
/** Where each node sits around the monitor, in percent of the screen. */
const spot = (i: number) => {
  const angle = (i / AROUND.length) * Math.PI * 2 - Math.PI / 2
  return { x: 50 + Math.cos(angle) * 37, y: 52 + Math.sin(angle) * 34 }
}

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

/**
 * The target's feed: a fast montage of his own plays, full screen, that
 * shrinks to a small monitor holding the round he won.
 */
function Feed({ t }: { t: number }) {
  const { gaming, game } = CUE
  const on = ramp(t, gaming.at - 0.06, gaming.at + 0.04)
  if (!on) return null
  const shrink = easeInOut(ramp(t, game.at - 0.15, game.at + 0.75))
  const since = t - gaming.at
  const montage = t < game.at
  const k = Math.floor(since / CUT)
  const within = montage ? (since % CUT) / CUT : ramp(t, game.at, CAREER_START)
  // A cut flashes for a frame, then the shot drifts and settles.
  const flash = montage && since % CUT < 0.04 ? 1 : 0
  const scale = montage ? 1.14 - within * 0.08 : 1.06 - within * 0.05
  const pan = montage ? (hash(k) - 0.5) * 5 : 0
  const careless = ramp(t, game.at + 0.8, game.at + 1.6)
  return (
    <div className={styles.feed} data-small={shrink > 0.5 || undefined} style={{
      opacity: on,
      width: `${lerp(100, 36, shrink)}vw`,
      height: `calc(${(1 - shrink) * 100}vh + ${shrink * 20.25}vw)`,
      top: `${lerp(50, 52, shrink)}%`,
      translate: flash ? `${(hash(k + 7) - 0.5) * 18}px 0` : undefined,
    }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={montage ? MONTAGE[k % MONTAGE.length] : ROUND} alt="" style={{
        transform: `scale(${scale}) translateX(${pan}%)`,
        filter: `grayscale(1) sepia(1) hue-rotate(28deg) saturate(${lerp(2.4, 1.2, careless)}) brightness(${lerp(0.62, 0.48, careless)}) contrast(1.15)`,
      }} />
      {flash > 0 && <span className={styles.feedFlash} />}
      <div className={styles.feedHud} style={{ opacity: 1 - shrink }}>
        <span><i />LIVE · INTERCEPTED FEED · TARGET POV</span>
        <span>T+{timecode(t).slice(0, 8)}</span>
        <span>CS2 · FACEIT LEVEL 10 · SANSBLAZE</span>
        <span>CAM 01 · FRAME {String(k + 1).padStart(3, "0")}</span>
      </div>
      {montage && <span className={styles.crosshair} />}
      {(["tl", "tr", "bl", "br"] as const).map(corner => <i key={corner} className={styles.crop} data-at={corner} />)}
    </div>
  )
}

export function InterestScene({ t }: { t: number }) {
  const { interest, gaming, game, around } = CUE
  const visible = window01(t, interest.at - 0.1, CAREER_START + 0.2, 0.3)
  if (!visible) return null

  const scan = ramp(t, interest.at, gaming.at)
  const pullBack = easeOut(ramp(t, game.at - 0.1, game.at + 0.6))
  const titleP = ramp(t, gaming.at, gaming.at + 0.35)
  const titleJitter = t < gaming.at + 0.3 ? (hash(Math.floor(t * 40)) - 0.5) * 16 : 0
  const network = easeOut(ramp(t, around.at, around.end))

  return (
    <div className={styles.interest} style={{ opacity: visible, transform: network ? `scale(${1.04 - network * 0.04})` : undefined }}>
      <div className={styles.scanHead} style={{ opacity: 1 - ramp(t, gaming.at + 0.05, gaming.at + 0.3) }}>
        <span className={styles.panelLabel}>BEHAVIOURAL SCAN · {String(Math.round(scan * 100)).padStart(3, "0")}%</span>
        <p className={styles.scanLine}>{typed("FIRST INTEREST DETECTED:", ramp(t, interest.at, interest.end))}<i className={styles.caret} /></p>
      </div>
      {t < gaming.at + 0.5 && <Radar t={t} />}

      {/* The links light up behind the monitor, one node at a time. */}
      {t >= around.at && (
        <svg className={styles.links} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {AROUND.map((_, i) => {
            const at = around.at + 0.25 + i * 0.2
            const p = easeOut(ramp(t, at - 0.15, at + 0.15))
            const end = spot(i)
            return p > 0 && <line key={i} x1={50} y1={52} x2={lerp(50, end.x, p)} y2={lerp(52, end.y, p)} vectorEffect="non-scaling-stroke" />
          })}
        </svg>
      )}
      {AROUND.map((_, i) => {
        const at = around.at + 0.25 + i * 0.2
        if (t < at + 0.15) return null
        const end = spot(i)
        // Data keeps flowing out to each node once it is linked.
        return [0, 0.5].map(offset => {
          const s = (t * 0.9 + i * 0.37 + offset) % 1
          return <span key={`${i}-${offset}`} className={styles.packet} style={{ left: `${lerp(50, end.x, s)}%`, top: `${lerp(52, end.y, s)}%`, opacity: Math.sin(Math.PI * s) }} />
        })
      })}

      <Feed t={t} />

      {t >= gaming.at && (
        <h2 className={styles.bigTitle} style={{
          opacity: titleP * (1 - ramp(t, game.at, game.at + 0.4)),
          transform: `translate(calc(-50% + ${titleJitter}px), -50%) scale(${1.3 - easeOut(titleP) * 0.3})`,
          top: "21%",
        }}>
          {decode("COMPETITIVE GAMING", ramp(t, gaming.at, gaming.at + 0.5), t)}
        </h2>
      )}

      <div className={styles.evidence}>
        {EVIDENCE.map((card, i) => {
          // Each card slams in on its shutter sound, then drops away as the camera pulls back.
          const at = gaming.at + 0.1 + i * 0.32
          const p = easeOut(ramp(t, at, at + 0.16))
          if (!p || pullBack >= 1) return null
          return (
            <figure key={card.game} className={styles.evidenceCard} style={{
              opacity: Math.min(1, p * 2) * (1 - pullBack),
              transform: `translateY(${pullBack * 16}vh) rotate(${card.tilt}deg) scale(${1.35 - 0.35 * p})`,
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={card.src} alt="" style={{ objectPosition: card.position }} />
              <figcaption>
                <b>{card.stat}</b>
                <span>{card.game}</span>
                <em>{card.line}</em>
              </figcaption>
            </figure>
          )
        })}
      </div>

      {t >= game.at + 0.5 && (
        <div className={styles.monitorTags} style={{ opacity: ramp(t, game.at + 0.5, game.at + 0.8) }}>
          <span>LIVE MATCH · ROUND WON</span>
          {t >= game.at + 0.9 && <em>{decode("PRIORITY ▼ LOW", ramp(t, game.at + 0.9, game.at + 1.3), t)}</em>}
        </div>
      )}

      {AROUND.map((node, i) => {
        const at = around.at + 0.25 + i * 0.2
        const p = easeOut(ramp(t, at, at + 0.25))
        if (!p) return null
        const { x, y } = spot(i)
        const Icon = node.icon
        return (
          <span key={node.label} className={styles.node} style={{ left: `${x}%`, top: `${y}%`, opacity: p, transform: `translate(-50%, -50%) scale(${1.3 - 0.3 * p})` }}>
            <Icon size={20} strokeWidth={1.8} />
            {decode(node.label, ramp(t, at, at + 0.4), t)}
          </span>
        )
      })}
      {t >= around.at + 1.2 && (
        <p className={styles.high} style={{ opacity: ramp(t, around.at + 1.2, around.at + 1.5) }}>
          {decode("EVERYTHING AROUND IT · PRIORITY ▲ HIGH", ramp(t, around.at + 1.2, around.at + 1.8), t)}
        </p>
      )}
    </div>
  )
}
