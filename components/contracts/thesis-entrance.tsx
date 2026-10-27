"use client"

import { entranceTiming, useContractEntrance, type EntranceCallbacks } from "@/hooks/use-contract-entrance"
import { onoFonts } from "@/components/contracts/thesis-font"
import styles from "./thesis-entrance.module.css"

const SPACES = ["Thesis", "Library", "Lectures", "Ask"]

/** The landing's ident: a blueprint graph draws itself, ONO-SENDAI glows over the black hole, the four spaces line up, then an iris closes. */
export function ThesisEntrance(callbacks: EntranceCallbacks) {
  const { visible, skip } = useContractEntrance(callbacks)
  if (!visible) return null

  return (
    <div className={`${styles.entrance} ${onoFonts}`} style={entranceTiming}>
      <div className={styles.dots} aria-hidden="true" />
      <svg className={styles.graph} viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path d="M120 140 L300 260 L520 180 L700 300 L880 160 M300 260 L360 450 L560 420 L700 300 M520 180 L560 420 M700 300 L860 470" />
        {[[120, 140], [300, 260], [520, 180], [700, 300], [880, 160], [360, 450], [560, 420], [860, 470]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === 3 ? 7 : 4} className={i === 3 ? styles.hub : undefined} />
        ))}
      </svg>
      <div className={styles.layout} aria-hidden="true">
        <div className={styles.topline}>
          <span>Contract 05 / ONO</span>
          <span>In daily use</span>
        </div>

        <div className={styles.identity}>
          <p className={styles.eyebrow}>M2 thesis · Personal AI workspace</p>
          <div className={styles.title}>
            <div className={styles.mask}><span className={styles.hero}>Ono-Sendai</span></div>
          </div>
          <div className={styles.chain}>
            {SPACES.map((space, i) => (
              <span key={space} className={styles.space} style={{ animationDelay: `${120 + i * 40}ms` }}>
                <b>{i + 1}</b>{space}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.bottomline}>
          <span>One app · the whole master’s year</span>
          <span className={styles.desktopMeta}>Find · Write · Learn · Ask</span>
        </div>
      </div>
      <button type="button" className={styles.skip} onClick={skip}>
        Skip intro <span aria-hidden="true">↗</span>
      </button>
    </div>
  )
}
