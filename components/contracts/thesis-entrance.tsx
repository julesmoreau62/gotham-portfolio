"use client"

import { entranceTiming, useContractEntrance, type EntranceCallbacks } from "@/hooks/use-contract-entrance"
import { Logo, type LogoId } from "@/components/contracts/thesis-logos"
import { thesisSerif } from "@/components/contracts/thesis-font"
import styles from "./thesis-entrance.module.css"

const CHAIN: (LogoId | "arrow")[] = ["scholar", "openalex", "cairn", "arrow", "qwen", "arrow", "obsidian"]

/** A short lab ident: a graph draws itself, the sources flow into the vault, then an iris closes. */
export function ThesisEntrance(callbacks: EntranceCallbacks) {
  const { visible, skip } = useContractEntrance(callbacks)
  if (!visible) return null

  return (
    <div className={`${styles.entrance} ${thesisSerif.variable}`} style={entranceTiming}>
      <div className={styles.dots} aria-hidden="true" />
      <svg className={styles.graph} viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path d="M120 140 L300 260 L520 180 L700 300 L880 160 M300 260 L360 450 L560 420 L700 300 M520 180 L560 420 M700 300 L860 470" />
        {[[120, 140], [300, 260], [520, 180], [700, 300], [880, 160], [360, 450], [560, 420], [860, 470]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === 3 ? 7 : 4} className={i === 3 ? styles.hub : undefined} />
        ))}
      </svg>
      <div className={styles.layout} aria-hidden="true">
        <div className={styles.topline}>
          <span>Contract 05 / THS</span>
          <span>Live · running 24/7</span>
        </div>

        <div className={styles.identity}>
          <p className={styles.eyebrow}>M2 thesis · Local AI research pipeline</p>
          <div className={styles.title}>
            <div className={styles.mask}><span className={styles.serif}>Thesis</span></div>
            <div className={styles.mask}><span className={styles.sans}>Engine<span className={styles.period}>.</span></span></div>
          </div>
          <div className={styles.chain}>
            {CHAIN.map((item, i) =>
              item === "arrow" ? (
                <span key={i} className={styles.arrow}>→</span>
              ) : (
                <span key={i} className={styles.mark} style={{ animationDelay: `${120 + i * 28}ms` }}>
                  <Logo id={item} tone="brand" className={styles.logo} />
                </span>
              )
            )}
          </div>
        </div>

        <div className={styles.bottomline}>
          <span>90 sources → ~5% kept</span>
          <span className={styles.desktopMeta}>Scan · Triage · Write</span>
        </div>
      </div>
      <button type="button" className={styles.skip} onClick={skip}>
        Skip intro <span aria-hidden="true">↗</span>
      </button>
    </div>
  )
}
