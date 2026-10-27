import { CUE } from "@/lib/dossier"
import { Exhibit, Heading, capture } from "./board"
import { decode, easeOut, hash, ramp, typed, window01 } from "./timing"
import styles from "./dossier.module.css"

/* PROFILE SHIFT (SEG08) — back in Lille, the file flips: the target
   now builds. A terminal runs the tools (the research engine then takes
   the whole screen, see engine-map.tsx), and the thesis topic is set
   in large type. */

const { shift, ono } = CUE

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

export function ShiftScene({ t }: { t: number }) {
  const visible = window01(t, shift.last.at - 0.2, ono.exhibit.end + 0.3, 0.3)
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
