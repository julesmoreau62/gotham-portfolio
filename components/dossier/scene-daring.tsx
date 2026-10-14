import { Check } from "lucide-react"
import { CUE } from "@/lib/dossier"
import { BigDate, Exhibit, Heading, Record, capture, picture } from "./board"
import { decode, easeOut, hash, ramp, window01 } from "./timing"
import styles from "./dossier.module.css"

/* OPERATION DARING (SEG07) — a border stamp, Brussels, the club's case
   file; then each result lands as the voice lists it, its evidence
   piling up on the desk. */

const { daring, shift } = CUE

function Passport({ t }: { t: number }) {
  const { border, join } = daring
  const slam = easeOut(ramp(t, border.at, border.at + 0.14))
  const gone = ramp(t, join.at - 0.2, join.at + 0.2)
  if (!slam || gone >= 1) return null
  const shake = t < border.at + 0.25 ? (hash(Math.floor(t * 50)) - 0.5) * 10 : 0
  const cross = easeOut(ramp(t, border.at - 0.3, border.at + 0.5))
  return (
    <div className={styles.passport} style={{ opacity: 1 - gone }}>
      <div className={styles.border}>
        <span>FR</span><i /><span>BE</span>
        <b style={{ left: `${12 + cross * 70}%` }} />
      </div>
      <svg viewBox="0 0 200 200" className={styles.passportStamp} style={{ transform: `translate(${shake}px, 0) rotate(-12deg) scale(${1.6 - slam * 0.6})` }} aria-hidden="true">
        <defs><path id="dossier-ring" d="M100 100m-74 0a74 74 0 1 1 148 0a74 74 0 1 1-148 0" /></defs>
        <circle cx="100" cy="100" r="92" /><circle cx="100" cy="100" r="58" />
        <text><textPath href="#dossier-ring" startOffset="2%">ENTRY · BELGIQUE · BELGIË · BELGIEN · ENTRY ·</textPath></text>
        <text x="100" y="98" textAnchor="middle" className={styles.passportBig}>BE</text>
        <text x="100" y="124" textAnchor="middle" className={styles.passportSmall}>05 · 2026</text>
      </svg>
    </div>
  )
}

const RESULTS = [
  { at: daring.identity, text: "VISUAL IDENTITY" },
  { at: daring.tiers, text: "FIVE-TIER SPONSORSHIP OFFER" },
  { at: daring.website, text: "BILINGUAL PARTNER WEBSITE · FR / NL" },
  { at: daring.handover.at, text: "HANDOVER SYSTEM" },
]

export function DaringScene({ t }: { t: number }) {
  const visible = window01(t, daring.may.at - 0.2, shift.last.at - 0.1, 0.3)
  if (!visible) return null
  return (
    <div className={styles.board} style={{ opacity: visible }} aria-hidden="true">
      <BigDate t={t} at={daring.may.at} text="MAY 2026" />
      <Passport t={t} />
      <Record t={t} at={daring.position.at} out={daring.join.at - 0.1} box={{ x: 52, y: 4, w: 48 }} kicker="POSITION" title="BRUSSELS · BELGIUM" titleAt={daring.brussels}
        lines={[{ text: "MOLENBEEK · 50.85°N 4.33°E", at: daring.brussels + 0.4 }]} />

      <Exhibit t={t} at={daring.join.at + 0.1} dimAt={daring.identity} box={{ x: 0, y: 0, w: 58 }} tilt={-1.2} src={capture("daring-case")} tag="EXHIBIT I · ROYAL DARING HC" caption="CASE FILE · JULESMOREAU.EU" />
      <Record t={t} at={daring.join.at} box={{ x: 62, y: 0, w: 38 }}
        icon={/* eslint-disable-next-line @next/next/no-img-element */ <img src={picture("/assets/Royal daring/logo-DARING.png", 256)} alt="" className={styles.recordLogo} />}
        kicker="MAY 2026 · BRUSSELS" title="ROYAL DARING HOCKEY CLUB" titleAt={daring.join.at + 0.6}
        lines={[{ text: "MOLENBEEK · EST. 1922", at: daring.join.at + 1.6 }, { text: "NEXT · PROMOTION TO DIVISION HONNEUR", at: daring.join.at + 3.2 }]} />

      <Heading t={t} at={daring.results.at} box={{ x: 62, y: 38, w: 38 }} text="RESULTS" />
      <ol className={styles.checklist} style={{ top: "45%" }}>
        {RESULTS.map((result, i) => {
          const p = ramp(t, result.at, result.at + 0.25)
          if (!p) return null
          return (
            <li key={result.text} style={{ opacity: p, transform: `translateX(${(1 - easeOut(p)) * 20}px)` }}>
              <i data-on={t >= result.at + 0.4 || undefined}>{t >= result.at + 0.4 && <Check size={12} strokeWidth={3} />}</i>
              <span>{String(i + 1).padStart(2, "0")}</span>
              {decode(result.text, ramp(t, result.at, result.at + 0.5), t)}
            </li>
          )
        })}
        {t >= daring.handover.end - 0.9 && <li className={styles.checkNote}>{decode("STATUS · KEEPS RUNNING AFTER DEPARTURE", ramp(t, daring.handover.end - 0.9, daring.handover.end - 0.2), t)}</li>}
      </ol>

      <Exhibit t={t} at={daring.identity + 0.1} box={{ x: 0, y: 34, w: 34 }} tilt={-3.2} src={capture("daring-visuals")} tag="01 · VISUAL IDENTITY" />
      <Exhibit t={t} at={daring.tiers + 0.1} box={{ x: 13, y: 40, w: 34 }} tilt={2.2} src={capture("daring-package")} tag="02 · FIVE-TIER OFFER" />
      <Exhibit t={t} at={daring.website + 0.1} box={{ x: 26, y: 46, w: 33 }} tilt={-1.5} src={picture("/assets/portfolio/daring-sponsor-site.webp")} tag="03 · PARTNER WEBSITE · FR / NL" />
      <Exhibit t={t} at={daring.handover.at + 0.1} box={{ x: 6, y: 52, w: 33 }} tilt={1.2} src={picture("/assets/Royal daring/notion/playbook.png")} position="50% 0%" tag="04 · HANDOVER · NOTION PLAYBOOK" />
    </div>
  )
}
