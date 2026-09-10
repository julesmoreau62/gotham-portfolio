"use client"

import Image from "next/image"
import { entranceTiming, useContractEntrance, type EntranceCallbacks } from "@/hooks/use-contract-entrance"
import styles from "./daring-entrance.module.css"

/** A short club ident, replayed whenever the Daring case is opened. */
export function DaringEntrance(callbacks: EntranceCallbacks) {
  const { visible, skip } = useContractEntrance(callbacks)

  if (!visible) return null

  return (
    <div className={styles.entrance} style={entranceTiming}>
      <div className={styles.curtain} aria-hidden="true" />
      <div className={styles.content} aria-hidden="true">
        <div className={styles.topline}>
          <span>Contract 01 / DRG</span>
          <span>Molenbeek · Brussels</span>
        </div>

        <span className={styles.year}>1922</span>

        <div className={styles.identity}>
          <div className={styles.crest}>
            <Image
              src="/assets/Royal%20daring%20/logo-DARING.png"
              alt=""
              width={144}
              height={144}
              priority
              className={styles.logo}
            />
          </div>
          <p className={styles.eyebrow}>Royal Daring Hockey Club</p>
          <div className={styles.title}>
            <div className={styles.line}><span>Royal</span></div>
            <div className={styles.line}><span>Daring<span className={styles.period}>.</span></span></div>
          </div>
          <div className={styles.rule} />
          <p className={styles.subtitle}>Communication &amp; Sponsoring</p>
        </div>

        <div className={styles.bottomline}>
          <span>Est. 1922</span>
          <span>Season 2025–26</span>
        </div>
      </div>
      <button
        type="button"
        className={styles.skip}
        onClick={skip}
      >
        Skip intro <span aria-hidden="true">↗</span>
      </button>
    </div>
  )
}
