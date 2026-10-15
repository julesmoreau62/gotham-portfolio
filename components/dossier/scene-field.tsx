import { Anchor, GraduationCap, Volleyball } from "lucide-react"
import { CUE } from "@/lib/dossier"
import { Exhibit, Metric, Record, STILLS, Still, capture } from "./board"
import { easeOut, ramp, window01 } from "./timing"
import styles from "./dossier.module.css"

/* FIELD RECORD (SEG04) — 2022 on the Opal Coast: degree, Navy Reserve,
   coaching; then 2025 and the AS Nortkerque season, its numbers
   counted up as the voice gives them. */

const { field, kourou } = CUE

/** The sponsor click-through curve: flat, then the prediction game kicks in. */
const CURVE = [0, 0.04, 0.03, 0.06, 0.05, 0.08, 0.1, 0.22, 0.48, 0.81, 1]

function Spark({ t }: { t: number }) {
  const p = easeOut(ramp(t, field.ctr.at, field.ctrUp + 0.6))
  const points = CURVE.map((v, i) => `${(i / (CURVE.length - 1)) * 100},${40 - v * 36}`)
  return (
    <svg className={styles.spark} viewBox="0 0 100 42" preserveAspectRatio="none" aria-hidden="true">
      <polyline points={points.join(" ")} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

export function FieldScene({ t }: { t: number }) {
  const visible = window01(t, field.year.at - 0.2, kourou.summer.at - 0.1, 0.3)
  if (!visible) return null
  const early = field.year2025.at - 0.15

  return (
    <div className={styles.board} style={{ opacity: visible }} aria-hidden="true">
      <Record t={t} at={field.base.at} out={early} box={{ x: 0, y: 0, w: 46 }} kicker="BASE OF OPERATIONS" title="OPAL COAST" titleAt={field.opal}
        lines={[{ text: "NORTHERN FRANCE · 50.95°N 1.86°E", at: field.opal + 0.5 }]} />
      <Record t={t} at={field.bachelor.at} out={early} box={{ x: 52, y: 0, w: 48 }} icon={<GraduationCap size={13} />} kicker="EDUCATION · 2022 → 2025"
        title="BACHELOR’S · SPORT MANAGEMENT" lines={[{ text: "ULCO · UNIVERSITÉ DU LITTORAL CÔTE D’OPALE", at: field.bachelor.at + 0.7 }]} />
      <Record t={t} at={field.navy.at} out={early} box={{ x: 52, y: 31, w: 48 }} icon={<Anchor size={13} />} kicker="SERVICE · SINCE 2022"
        title="FRENCH NAVY RESERVE" lines={[{ text: "RANK · PETTY OFFICER (SECOND MAÎTRE)", at: field.rank }]} />
      <Record t={t} at={field.coach.at} out={early} box={{ x: 52, y: 62, w: 48 }} icon={<Volleyball size={13} />} kicker="MEANWHILE"
        title="YOUTH VOLLEYBALL COACH" titleAt={field.coach.at + 0.5} lines={[{ text: "LISSP CALAIS", at: field.calais }]} />
      <Still t={t} at={field.coach.at + 0.25} out={early} box={{ x: 2, y: 30, w: 44 }} tilt={-2.5} src={STILLS.volleyball}
        cam="CAM 02 · LISSP CALAIS" tag="EXHIBIT D · SHOT BY THE TARGET" />

      <Still t={t} at={field.club.at + 0.2} box={{ x: 0, y: 0, w: 60 }} tilt={-1.2} src={STILLS.pitch} position="50% 40%" cam="CAM 03 · PITCH-SIDE" tag="EXHIBIT E · MATCHDAY · SHOT BY THE TARGET" />
      <Exhibit t={t} at={field.club.at + 1.5} box={{ x: 18, y: 47, w: 40 }} tilt={2.4} src={capture("asn95-posters")} tag="EXHIBIT F · MATCHDAY CONTENT" caption="POSTERS · RESULTS · INTERVIEWS" />
      <Record t={t} at={field.club.at} box={{ x: 65, y: 0, w: 35 }} kicker="COMMUNICATIONS · JAN → JUN 2025" title="AS NORTKERQUE 95" titleAt={field.club.at + 1.6}
        lines={[{ text: "AMATEUR FOOTBALL CLUB", at: field.club.at + 2.8 }, { text: "ROLE · HEAD OF COMMUNICATIONS", at: field.club.at + 3.3 }]} />
      <Metric t={t} at={field.season.at} box={{ x: 65, y: 33, w: 35 }} label="SEASON · JAN → JUN 2025" value={1} count={0.3} format={() => "01"} />
      <Metric t={t} at={field.views.at} box={{ x: 65, y: 52, w: 35 }} label="VIEWS" value={1_000_000} count={1.4}
        format={n => (n >= 999_500 ? "1,000,000+" : Math.round(n).toLocaleString("en-US"))} />
      <Metric t={t} at={field.ctr.at} box={{ x: 65, y: 71, w: 35 }} label="SPONSOR CLICK-THROUGH RATE" value={467} count={field.ctrUp - field.ctr.at + 0.5}
        format={n => `+${Math.round(n)}%`}>
        <Spark t={t} />
      </Metric>
    </div>
  )
}
