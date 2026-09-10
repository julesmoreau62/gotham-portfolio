"use client"

import Image from "next/image"
import { type ContractSlug } from "@/lib/contracts"
import { DaringEntrance } from "@/components/contracts/daring-entrance"
import { entranceTiming, useContractEntrance, type EntranceCallbacks } from "@/hooks/use-contract-entrance"
import styles from "./contract-entrance.module.css"

export function ContractEntrance({ slug, ...callbacks }: EntranceCallbacks & { slug: ContractSlug }) {
  if (slug === "daring") return <DaringEntrance {...callbacks} />
  if (slug === "signal") return <SignalEntrance {...callbacks} />
  if (slug === "intel-core") return <IntelEntrance {...callbacks} />
  return null
}

function SignalEntrance(callbacks: EntranceCallbacks) {
  const { visible, skip } = useContractEntrance(callbacks)
  if (!visible) return null

  return (
    <div className={`${styles.entrance} ${styles.signal}`} style={entranceTiming}>
      <div className={styles.signalPhoto} aria-hidden="true">
        <Image src="/signal/group_sponsor.webp" alt="" fill priority sizes="100vw" className="object-cover grayscale" />
      </div>
      <div className={styles.signalShade} aria-hidden="true" />
      <div className={styles.layout} aria-hidden="true">
        <div className={styles.topline}>
          <span>Contract 02 / SGN</span>
          <span>Nortkerque · France</span>
        </div>

        <span className={styles.number}>95</span>
        <div className={styles.signalIdentity}>
          <p className={styles.eyebrow}>AS Nortkerque 95 · Est. 1995</p>
          <div className={`${styles.title} ${styles.signalTitle}`}>
            <div className={styles.mask}><span>ASN95</span></div>
            <div className={styles.mask}><span>Signal<span className={styles.period}>.</span></span></div>
          </div>
          <div className={styles.signalRule} />
          <div className={styles.scoreboard}>
            <div><strong>+467%</strong><span>Sponsor CTR</span></div>
            <div><strong>1M+</strong><span>Views</span></div>
          </div>
        </div>

        <div className={styles.bottomline}>
          <span>Club. Community. Matchday.</span>
          <span className={styles.desktopMeta}>Season 2025</span>
        </div>
      </div>
      <SkipIntro onClick={skip} />
    </div>
  )
}

function IntelEntrance(callbacks: EntranceCallbacks) {
  const { visible, skip } = useContractEntrance(callbacks)
  if (!visible) return null

  return (
    <div className={`${styles.entrance} ${styles.intel}`} style={entranceTiming}>
      <div className={styles.intelGrid} aria-hidden="true" />
      <div className={styles.scan} aria-hidden="true" />
      <div className={styles.layout} aria-hidden="true">
        <div className={styles.topline}>
          <span>Contract 05 / INT</span>
          <span>Standby · priority shift</span>
        </div>

        <div className={styles.intelIdentity}>
          <p className={styles.eyebrow}>Business · Finance · Geopolitics</p>
          <div className={`${styles.title} ${styles.intelTitle}`}>
            <div className={styles.mask}><span>Intel</span></div>
            <div className={styles.mask}><span>Core<span className={styles.period}>_</span></span></div>
          </div>

          <div className={styles.pipeline}>
            <div className={styles.pipelineLine} />
            <div className={styles.node}><span>01 / Collect</span><strong>Telegram</strong></div>
            <div className={styles.node}><span>02 / Analyse</span><strong>AI ranking</strong></div>
            <div className={styles.node}><span>03 / Publish</span><strong>Daily top 10</strong></div>
          </div>
        </div>

        <div className={styles.bottomline}>
          <span>09 sources → 10 insights</span>
          <span className={styles.desktopMeta}>Automated intelligence</span>
        </div>
      </div>
      <SkipIntro onClick={skip} />
    </div>
  )
}

function SkipIntro({ onClick }: { onClick: () => void }) {
  return <button type="button" className={styles.skip} onClick={onClick}>Skip intro <span aria-hidden="true">↗</span></button>
}
