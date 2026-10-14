import { GraduationCap, Megaphone, TriangleAlert } from "lucide-react"
import { CUE } from "@/lib/dossier"
import { BigDate, Exhibit, Metric, Record, Stamp, capture, picture } from "./board"
import { easeOut, hash, ramp, window01 } from "./timing"
import styles from "./dossier.module.css"

/* BASE LILLE (SEG06) — the move to Lille and the Master's, then the
   December tournament: the case file, the delivered files piling up,
   two incidents raised in red and closed in acid. */

const { lille, daring } = CUE

const PHOTOS = [1, 2, 3, 4, 5].map(n => picture(`/assets/photo/asi-${n}.jpg`, 384))
const WALL = 18

function PhotoWall({ t }: { t: number }) {
  const dim = ramp(t, lille.incidents.at, lille.incidents.at + 0.4)
  return (
    <div className={styles.wall} style={{ opacity: 1 - dim * 0.65 }}>
      {Array.from({ length: WALL }, (_, i) => {
        const at = lille.files.at + i * 0.12
        const p = easeOut(ramp(t, at, at + 0.15))
        if (!p) return <span key={i} />
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={PHOTOS[i % PHOTOS.length]} alt="" style={{ opacity: p, transform: `scale(${1.25 - 0.25 * p})`, objectPosition: `${Math.round(hash(i) * 100)}% ${Math.round(hash(i + 9) * 100)}%` }} />
        )
      })}
    </div>
  )
}

export function LilleScene({ t }: { t: number }) {
  const visible = window01(t, lille.september.at - 0.2, daring.may.at - 0.1, 0.3)
  if (!visible) return null
  const resolved = t >= lille.zero.at
  return (
    <div className={styles.board} style={{ opacity: visible }} aria-hidden="true">
      <BigDate t={t} at={lille.september.at} text="SEPTEMBER 2025" />
      <Record t={t} at={lille.move.at} out={lille.december.at - 0.1} box={{ x: 0, y: 0, w: 46 }} kicker="RELOCATION" title="LILLE · FRANCE" titleAt={lille.move.at + 0.5}
        lines={[{ text: "50.63°N 3.06°E · NEW BASE", at: lille.move.at + 0.9 }]} />
      <Record t={t} at={lille.master.at} out={lille.december.at - 0.1} box={{ x: 52, y: 0, w: 48 }} icon={<GraduationCap size={13} />} kicker="EDUCATION · 2025 → 2027"
        title="MASTER’S · INTERNATIONAL SPORT ADMINISTRATION" lines={[{ text: "UNIVERSITÉ DE LILLE · STAPS / ISA", at: lille.master.at + 1 }]} />

      <BigDate t={t} at={lille.december.at} text="DECEMBER 2025" hold={0.45} />

      <Exhibit t={t} at={lille.comms.at + 0.1} dimAt={lille.incidents.at} box={{ x: 0, y: 0, w: 60 }} tilt={-1.4} src={capture("asi-case")} tag="EXHIBIT G · ASI TOURNAMENT" caption="CASE FILE · JULESMOREAU.EU" />
      <Record t={t} at={lille.comms.at} box={{ x: 64, y: 0, w: 36 }} icon={<Megaphone size={13} />} kicker="DECEMBER 2025 · UFR3S LILLE" title="HEAD OF COMMUNICATIONS"
        lines={[{ text: "ASI MULTISPORTS TOURNAMENT", at: lille.comms.at + 1.2 }, { text: "500+ PEOPLE · 4 DISCIPLINES", at: lille.comms.at + 2 }]} />
      {t >= lille.files.at && <PhotoWall t={t} />}
      <Metric t={t} at={lille.files.at} box={{ x: 64, y: 37, w: 36 }} label="PHOTOS & VIDEOS DELIVERED" value={500} count={2.2}
        format={n => (n >= 499.5 ? "500+" : String(Math.round(n)).padStart(3, "0"))} />

      <Exhibit t={t} at={lille.incidents.at + 0.35} box={{ x: 3, y: 46, w: 56 }} tilt={1.4} ratio="1440 / 610" src={capture("asi-incidents")} tag="EXHIBIT H · DECISIONS ON THE DAY" />
      <Record t={t} at={lille.incidents.at} box={{ x: 64, y: 58, w: 36 }} tone={resolved ? "acid" : "red"} icon={<TriangleAlert size={13} />}
        kicker="INCIDENT 01 · 2 H BEFORE THE START" title="FACILITY CONFLICT" lines={[{ text: "RESOLVED · NEW VENUE IN 45 MIN", at: lille.zero.at }]} />
      <Record t={t} at={lille.incidents.at + 0.4} box={{ x: 64, y: 79, w: 36 }} tone={resolved ? "acid" : "red"} icon={<TriangleAlert size={13} />}
        kicker="INCIDENT 02 · 30 MIN BEFORE" title="WEATHER HAZARD" lines={[{ text: "RESOLVED · MOVED INDOORS", at: lille.zero.at + 0.3 }]} />
      <Stamp t={t} at={lille.zero.at + 0.1} text="ZERO DISRUPTION" x={31} y={72} rotate={-7} tone="acid" />
    </div>
  )
}
