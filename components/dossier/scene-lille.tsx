import { GraduationCap } from "lucide-react"
import { CUE } from "@/lib/dossier"
import { Record } from "./board"
import { window01 } from "./timing"
import styles from "./dossier.module.css"

/* BASE LILLE (SEG06) — the move to Lille and the Master's that the
   thesis and Ono-Sendai grow out of. */

const { lille, daring } = CUE

export function LilleScene({ t }: { t: number }) {
  const visible = window01(t, lille.september.at - 0.2, daring.may.at - 0.1, 0.3)
  if (!visible) return null
  return (
    <div className={styles.board} style={{ opacity: visible }} aria-hidden="true">
      <Record t={t} at={lille.move.at} box={{ x: 0, y: 0, w: 46 }} kicker="RELOCATION" title="LILLE · FRANCE" titleAt={lille.move.at + 0.5}
        lines={[{ text: "50.63°N 3.06°E · NEW BASE", at: lille.move.at + 0.9 }]} />
      <Record t={t} at={lille.master.at} box={{ x: 52, y: 0, w: 48 }} icon={<GraduationCap size={13} />} kicker="EDUCATION · 2025 → 2027"
        title="MASTER’S · INTERNATIONAL SPORT ADMINISTRATION" lines={[{ text: "UNIVERSITÉ DE LILLE · STAPS / ISA", at: lille.master.at + 1 }]} />
    </div>
  )
}
