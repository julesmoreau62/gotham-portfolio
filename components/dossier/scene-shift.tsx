import { CUE } from "@/lib/dossier"
import { Exhibit, Heading, capture } from "./board"
import { decode, easeOut, hash, ramp, typed, window01 } from "./timing"
import styles from "./dossier.module.css"

/* PROFILE SHIFT (SEG08) — back in Lille, the file flips: the target
   now builds. A terminal runs the tools, the research engine sweeps
   its 24-hour dial, and the thesis topic is set in large type. */

const { shift, mission } = CUE

const COMMANDS = [
  { at: shift.builds.at, cmd: "build --ai-tools", out: "AI tools · online" },
  { at: shift.automations, cmd: "automate --workflows", out: "automations · running" },
  { at: shift.models, cmd: "ollama run qwen3:4b", out: "local model · loaded" },
]

function Terminal({ t }: { t: number }) {
  const p = ramp(t, shift.builds.at - 0.3, shift.builds.at)
  if (!p) return null
  return (
    <div className={styles.terminal} style={{ opacity: p * (1 - ramp(t, shift.topic.at - 0.1, shift.topic.at + 0.3)) }}>
      <div className={styles.terminalBar}><i /><i /><i /><span>target@lille: ~/tools</span></div>
      {COMMANDS.map(c => t >= c.at && (
        <p key={c.cmd}>
          <span className={styles.prompt}>$</span> {typed(c.cmd, ramp(t, c.at, c.at + 0.55))}
          {t >= c.at + 0.65 && <><br /><em>✓ {c.out}</em></>}
        </p>
      ))}
      <i className={styles.caret} />
    </div>
  )
}

const SOURCES = ["GOOGLE SCHOLAR", "OPENALEX", "CAIRN"]

/** The research engine: a 24-hour dial swept in time-lapse, three scans a day, ninety sources. */
function Engine({ t }: { t: number }) {
  const { engine, scans, topic } = shift
  const p = ramp(t, engine.at - 0.2, engine.at + 0.2)
  if (!p) return null
  const hand = ((t - engine.at) * 240) % 360
  const count = Math.round(easeOut(ramp(t, scans, scans + 3.4)) * 90)
  return (
    <div className={styles.engine} style={{ opacity: p * (1 - ramp(t, topic.at - 0.1, topic.at + 0.3)) }}>
      <svg viewBox="0 0 200 200" aria-hidden="true">
        {Array.from({ length: 24 }, (_, h) => {
          const a = (h / 24) * Math.PI * 2
          return <line key={h} x1={100 + Math.sin(a) * 84} y1={100 - Math.cos(a) * 84} x2={100 + Math.sin(a) * (h % 6 ? 78 : 72)} y2={100 - Math.cos(a) * (h % 6 ? 78 : 72)} className={styles.engineTick} />
        })}
        <circle cx={100} cy={100} r={90} className={styles.engineRing} />
        {[0, 120, 240].map(deg => {
          const a = (deg * Math.PI) / 180
          const lit = Math.max(0, 1 - ((((hand - deg) % 360) + 360) % 360) / 120)
          return <circle key={deg} cx={100 + Math.sin(a) * 90} cy={100 - Math.cos(a) * 90} r={4 + lit * 3} className={styles.engineScan} opacity={0.35 + lit * 0.65} />
        })}
        <line x1={100} y1={100} x2={100 + Math.sin((hand * Math.PI) / 180) * 86} y2={100 - Math.cos((hand * Math.PI) / 180) * 86} className={styles.engineHand} />
        <circle cx={100} cy={100} r={3} className={styles.engineScan} />
        <text x={100} y={96} textAnchor="middle" className={styles.engineCount}>{count}</text>
        <text x={100} y={114} textAnchor="middle" className={styles.engineUnit}>SOURCES / DAY</text>
      </svg>
      <div className={styles.engineSide}>
        <b>RESEARCH ENGINE</b>
        <span>3 SCANS A DAY · ≈ 5% KEPT</span>
        {SOURCES.map((s, i) => t >= scans + i * 0.5 && <span key={s} className={styles.engineSource}>{decode(s, ramp(t, scans + i * 0.5, scans + i * 0.5 + 0.4), t)}</span>)}
        {t >= engine.end - 1.4 && <em>{decode("24/7 · AROUND THE CLOCK", ramp(t, engine.end - 1.4, engine.end - 0.8), t)}</em>}
      </div>
    </div>
  )
}

export function ShiftScene({ t }: { t: number }) {
  const visible = window01(t, shift.last.at - 0.2, mission.sought.at - 0.1, 0.3)
  if (!visible) return null
  const alarm = ramp(t, shift.shift.at, shift.shift.at + 0.25)
  const settle = easeOut(ramp(t, shift.communicates.at - 0.2, shift.communicates.at + 0.4))
  const strike = ramp(t, shift.communicates.end - 0.45, shift.communicates.end - 0.1)
  const away = ramp(t, shift.topic.at - 0.2, shift.topic.at + 0.2)
  const jitter = t < shift.shift.at + 0.4 ? (hash(Math.floor(t * 40)) - 0.5) * 14 : 0
  return (
    <div className={styles.board} style={{ opacity: visible }} aria-hidden="true">
      {alarm > 0 && away < 1 && (
        <h3 className={styles.shiftTitle} style={{
          opacity: alarm * (1 - away),
          transform: `translate(${jitter}px, ${settle * -6}%) scale(${(1.1 - 0.1 * easeOut(alarm)) * (1 - settle * 0.36)})`,
          top: `${36 - settle * 36}%`,
        }}>
          {decode("PROFILE SHIFT DETECTED", ramp(t, shift.shift.at, shift.shift.at + 0.5), t)}
        </h3>
      )}
      {t >= shift.communicates.at && away < 1 && (
        <div className={styles.statement} style={{ opacity: ramp(t, shift.communicates.at, shift.communicates.at + 0.3) * (1 - away) }}>
          <span>{decode("NO LONGER JUST", ramp(t, shift.communicates.at, shift.communicates.at + 0.4), t)}</span>
          <s style={{ backgroundSize: `${strike * 100}% 3px` }}>{decode("COMMUNICATES", ramp(t, shift.communicates.at + 0.4, shift.communicates.at + 1), t)}</s>
          {t >= shift.builds.at && <b>{decode("BUILDS.", ramp(t, shift.builds.at, shift.builds.at + 0.4), t)}</b>}
        </div>
      )}
      <Terminal t={t} />
      <Engine t={t} />

      <Heading t={t} at={shift.topic.at} box={{ x: 0, y: 26, w: 58 }} text="THESIS TOPIC:" />
      {t >= shift.thesis.at && (
        <div className={styles.thesis} style={{ opacity: ramp(t, shift.thesis.at, shift.thesis.at + 0.3) }}>
          <h3>{typed("GENERATIVE AI IN SPORTS ASSOCIATIONS", ramp(t, shift.thesis.at, shift.thesis.end))}<i className={styles.caret} /></h3>
          <p>{decode("M2 THESIS · UNIVERSITÉ DE LILLE · INTERNATIONAL SPORT ADMINISTRATION", ramp(t, shift.thesis.at + 0.6, shift.thesis.end + 0.3), t)}</p>
        </div>
      )}
      <Exhibit t={t} at={shift.thesis.at + 0.4} box={{ x: 62, y: 30, w: 38 }} tilt={2} src={capture("thesis-case")} tag="EXHIBIT J · THESIS ENGINE" caption="LIVE · RUNNING 24/7" />
    </div>
  )
}
