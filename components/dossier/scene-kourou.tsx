import { CUE } from "@/lib/dossier"
import { Record, Stamp } from "./board"
import { decode, easeInOut, ramp, window01 } from "./timing"
import styles from "./dossier.module.css"

/* OPERATION KOUROU (SEG05) — a new signal in French Guiana; the two
   builds are drawn as blueprints while the voice describes them, then
   the clock runs out and the mission is stamped. */

const { kourou, lille } = CUE

/** A scaffold truss between two points: two chords and a zigzag. */
function truss(x1: number, y1: number, x2: number, y2: number, width: number, bays: number) {
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy)
  const nx = (-dy / len) * width, ny = (dx / len) * width
  let d = `M${x1} ${y1}L${x2} ${y2}M${x1 + nx} ${y1 + ny}L${x2 + nx} ${y2 + ny}M${x1} ${y1}`
  for (let k = 1; k <= bays; k++) {
    const s = k / bays
    d += `L${x1 + dx * s + (k % 2 ? nx : 0)} ${y1 + dy * s + (k % 2 ? ny : 0)}`
  }
  return d
}

const PAVILION = [
  "M20 340H470",
  "M60 300H440V318H60Z",
  "M80 300V150M190 300V150M310 300V150M420 300V150",
  "M60 150L250 78L440 150Z",
  "M80 150L250 78M190 150L250 78M310 150L250 78M420 150L250 78",
  "M80 268H420M80 300V268M120 300V268M160 300V268M220 300V268M270 300V268M350 300V268M390 300V268",
  "M60 318L44 318V326H32V334H20V340",
  "M60 372H440M60 364V380M440 364V380",
].join("")

const ARCHES = [
  "M520 340H980",
  truss(560, 340, 560, 120, 18, 12),
  truss(780, 340, 780, 120, -18, 12),
  truss(560, 120, 798, 120, -18, 12),
  "M600 150H740V190H600Z",
  truss(820, 340, 820, 190, 12, 8),
  truss(950, 340, 950, 190, -12, 8),
  truss(820, 190, 962, 190, -12, 8),
  "M560 372H798M560 364V380M798 364V380",
].join("")

function Blueprint({ t }: { t: number }) {
  const pavilion = easeInOut(ramp(t, kourou.build.at, kourou.arches - 0.2))
  const arches = easeInOut(ramp(t, kourou.arches - 0.3, kourou.build.end + 0.2))
  const done = t >= kourou.done.at
  return (
    <div className={styles.blueprint} data-done={done || undefined} style={{ opacity: ramp(t, kourou.build.at - 0.2, kourou.build.at + 0.2) }}>
      <svg viewBox="0 0 1000 400" aria-hidden="true">
        <defs>
          <pattern id="dossier-grid" width="25" height="25" patternUnits="userSpaceOnUse"><path d="M25 0H0V25" fill="none" stroke="rgba(200,255,0,.08)" /></pattern>
        </defs>
        <rect width="1000" height="400" fill="url(#dossier-grid)" />
        <path d={PAVILION} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - pavilion} className={styles.bpLine} />
        <path d={ARCHES} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - arches} className={styles.bpLine} />
      </svg>
      <span className={styles.bpLabel} style={{ left: "6%", top: "2%", opacity: ramp(t, kourou.build.at + 0.8, kourou.build.at + 1.1) }}>
        <b>{decode("VIP HOSPITALITY AREA", ramp(t, kourou.build.at + 0.8, kourou.build.at + 1.4), t)}</b>
        <span>{decode("KOUROU BEACH FESTIVAL", ramp(t, kourou.build.at + 2.2, kourou.build.at + 2.8), t)}</span>
      </span>
      <span className={styles.bpLabel} style={{ left: "56%", top: "2%", opacity: ramp(t, kourou.arches, kourou.arches + 0.3) }}>
        <b>{decode("SPONSOR ARCHES", ramp(t, kourou.arches, kourou.arches + 0.5), t)}</b>
        <span>{decode("TOUR DE GUYANE · WITH BOLT ÉCHAFAUDAGE", ramp(t, kourou.arches + 1, kourou.arches + 1.7), t)}</span>
      </span>
    </div>
  )
}

export function KourouScene({ t }: { t: number }) {
  const visible = window01(t, kourou.summer.at - 0.2, lille.september.at - 0.1, 0.3)
  if (!visible) return null
  const clock = 1 - ramp(t, kourou.deadline.at, kourou.done.at)
  return (
    <div className={styles.board} style={{ opacity: visible }} aria-hidden="true">
      <Record t={t} at={kourou.signal.at} box={{ x: 0, y: 0, w: 46 }} kicker="NEW SIGNAL · FRENCH GUIANA" titleAt={kourou.place} title="KOUROU"
        lines={[{ text: "5.16°N 52.65°W · AUGUST 2025", at: kourou.place + 0.4 }]} />
      <Record t={t} at={kourou.build.at} box={{ x: 52, y: 0, w: 48 }} kicker="FIELD OPERATIONS" title="FESTIVAL INFRASTRUCTURE"
        lines={[{ text: "VIP HOSPITALITY · SPONSOR ARCHES", at: kourou.build.at + 1.2 }]} />
      <Blueprint t={t} />
      {t >= kourou.deadline.at && (
        <div className={styles.deadline} data-done={t >= kourou.done.at || undefined} style={{ opacity: ramp(t, kourou.deadline.at, kourou.deadline.at + 0.2) }}>
          <span>{t >= kourou.done.at ? "DELIVERED" : "TIGHT DEADLINES · TIME REMAINING"}</span>
          <i><b style={{ transform: `scaleX(${clock})` }} /></i>
        </div>
      )}
      <Stamp t={t} at={kourou.done.at} text="MISSION ACCOMPLISHED" x={52} y={62} rotate={-6} tone="acid" />
    </div>
  )
}
