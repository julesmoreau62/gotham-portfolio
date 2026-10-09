"use client"

import type { CSSProperties, RefObject } from "react"
import { COPY } from "@/lib/copy"
import type { Locale } from "@/lib/i18n"
import styles from "./universe-intro.module.css"

export type IntroPhase = "drift" | "gather" | "dive"

type Fragment = {
  id: string
  label: string
  image?: string
  kind?: "rhythm" | "rank" | "coordinates" | "ball"
  x: number
  y: number
  z: number
  angle: number
  width: number
  ratio: number
  gather: [number, number]
  mobile?: [number, number]
  accent?: string
}

const fragments: Fragment[] = [
  { id: "daring", label: "Royal Daring / Identity", image: "daring-logo", x: -32, y: -22, z: 100, angle: -12, width: 130, ratio: 1, gather: [-122, -74], mobile: [-31, -25], accent: "#ff2a3c" },
  { id: "minecraft", label: "Minecraft / A city of my own", image: "minecraft-canal", x: 22, y: -28, z: -80, angle: 9, width: 220, ratio: 1.78, gather: [82, -102], mobile: [27, -31], accent: "#a6c9a0" },
  { id: "volley", label: "On the court / Volleyball", image: "volleyball", x: 34, y: 2, z: 75, angle: 12, width: 142, ratio: .667, gather: [128, -15], mobile: [31, -3] },
  { id: "asn95", label: "ASN95 / Matchday", image: "asn95-poster", x: -27, y: 17, z: 20, angle: 8, width: 128, ratio: .706, gather: [-118, 25], mobile: [-32, 13] },
  { id: "overwatch", label: "Overwatch / Competitive side", image: "overwatch", x: -7, y: -33, z: 40, angle: -6, width: 205, ratio: 1.79, gather: [-26, -112], accent: "#f5aa53" },
  { id: "cs", label: "Counter-Strike / One more round", image: "counter-strike", x: 14, y: 27, z: 115, angle: -10, width: 190, ratio: 1.41, gather: [65, 85], mobile: [25, 26], accent: "#e8c15a" },
  { id: "playoffs", label: "Royal Daring / Playoffs", image: "daring-poster", x: 7, y: -17, z: -130, angle: -9, width: 116, ratio: .8, gather: [34, -77], accent: "#ff2a3c" },
  { id: "website", label: "Royal Daring / Partnerships", image: "daring-site", x: -11, y: 30, z: -15, angle: 7, width: 205, ratio: 1.78, gather: [-47, 90], mobile: [-20, 31], accent: "#ff2a3c" },
  { id: "skyline", label: "Minecraft / 250+ hours", image: "minecraft-skyline", x: -36, y: -3, z: -140, angle: -7, width: 186, ratio: 1.78, gather: [-154, -17], accent: "#a6c9a0" },
  { id: "event", label: "ASI / Make sport happen", image: "event-poster", x: 35, y: 26, z: -120, angle: 7, width: 178, ratio: 1.76, gather: [140, 71], mobile: [33, 39] },
  { id: "osu", label: "osu! / Rhythm & precision", kind: "rhythm", x: 34, y: -21, z: 120, angle: -9, width: 100, ratio: 1, gather: [151, -78], mobile: [34, -19], accent: "#ff78ad" },
  { id: "faceit", label: "FACEIT / Counter-Strike", kind: "rank", x: -33, y: 34, z: 95, angle: -13, width: 106, ratio: 1, gather: [-133, 85], mobile: [-34, 39], accent: "#ff8a3d" },
  { id: "places", label: "Lille / Across Europe", kind: "coordinates", x: -19, y: -17, z: -160, angle: 5, width: 150, ratio: 1.85, gather: [-78, -61] },
  { id: "ball", label: "A player's perspective", kind: "ball", x: 19, y: 10, z: -100, angle: 16, width: 95, ratio: 1, gather: [91, 37] },
]

function FragmentArt({ fragment, coordinates }: { fragment: Fragment; coordinates: string }) {
  if (fragment.image) {
    return (
      // These dedicated thumbnails are already resized and compressed.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={`/assets/intro/${fragment.image}.webp`} alt="" width={480} height={Math.round(480 / fragment.ratio)} decoding="async" draggable={false} />
    )
  }
  if (fragment.kind === "rhythm") return <span className={styles.rhythm}><i />osu!</span>
  if (fragment.kind === "rank") return <span className={styles.rank}><small>FACEIT</small><strong>10</strong><span>LEVEL</span></span>
  if (fragment.kind === "coordinates") return <span className={styles.coordinates}><span>50°37′N / 03°03′E</span><strong>LILLE ↗</strong><span>{coordinates}</span></span>
  return <svg className={styles.ball} viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="44" /><path d="M50 6c-6 16-6 30 0 44s6 30 0 44M12 28c17-3 28 3 38 22s21 25 38 22M12 72c11-16 24-23 38-22s27-6 38-22M33 10c-4 22 3 38 17 40M77 14c-20 8-29 20-27 36M89 67c-22-1-35-7-39-17M25 86c5-20 13-32 25-36" /></svg>
}

export function UniverseIntro({ phase, compact, skipButton, onSkip, locale = "en" }: {
  phase: IntroPhase
  compact: boolean
  skipButton: RefObject<HTMLButtonElement | null>
  onSkip: () => void
  locale?: Locale
}) {
  const t = COPY[locale].intro
  const visible = compact ? fragments.filter((fragment) => fragment.mobile) : fragments
  return (
    <div className={styles.intro} data-phase={phase} role="dialog" aria-modal="true" aria-labelledby="universe-intro-title" aria-describedby="universe-intro-description" data-lenis-prevent>
      <h2 id="universe-intro-title" className="sr-only">{t.title}</h2>
      <p id="universe-intro-description" className="sr-only">{t.description}</p>
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.topline} aria-hidden="true">
        <span><i /> JM / Portfolio 2026</span>
        <span>{t.topline}</span>
      </div>
      <div className={styles.viewport} aria-hidden="true">
        <div className={styles.camera}>
          <div className={styles.orbit}><i /><i /><i /><i /></div>
          {visible.map((fragment, index) => {
            const properties = {
              "--x": `${fragment.x}vw`, "--y": `${fragment.y}svh`, "--z": `${fragment.z}px`,
              "--mobile-x": `${fragment.mobile?.[0] ?? fragment.x}vw`, "--mobile-y": `${fragment.mobile?.[1] ?? fragment.y}svh`,
              "--angle": `${fragment.angle}deg`, "--width": `${fragment.width}px`, "--ratio": fragment.ratio,
              "--gather-x": `${fragment.gather[0]}px`, "--gather-y": `${fragment.gather[1]}px`,
              "--accent": fragment.accent ?? "#c8ff00", "--index": index,
              "--delay": `${index * 18}ms`, "--float-delay": `${index * -230}ms`,
            } as CSSProperties
            return (
              <div key={fragment.id} className={styles.fragment} style={properties} data-kind={fragment.kind ?? fragment.image}>
                <div className={styles.float}>
                  <div className={styles.plate}><FragmentArt fragment={fragment} coordinates={t.coordinates} /><span className={styles.corner} /></div>
                  <span className={styles.caption}><i />{t.labels[fragment.id] ?? fragment.label}</span>
                </div>
              </div>
            )
          })}
          <div className={styles.core}>
            <span className={styles.coreKicker}>{t.kicker}</span>
            <span className={styles.monogram}>J<span>M</span><i /></span>
            <span className={styles.coreName}>Jules Moreau</span>
            <span className={styles.coreNote}>{t.note}</span>
          </div>
        </div>
      </div>
      <div className={styles.bottomline}>
        <div className={styles.sequence} aria-hidden="true"><span className={styles.progress}><span /></span><span>{t.phases[phase]}</span></div>
        <button ref={skipButton} type="button" onClick={onSkip} className={styles.skip}>{t.skip} <span aria-hidden="true">↗</span></button>
      </div>
    </div>
  )
}
