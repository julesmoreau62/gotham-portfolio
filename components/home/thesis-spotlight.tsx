"use client"

import { WipeLink } from "@/components/fx/page-wipe"
import { Reveal } from "@/components/fx/reveal"
import { ArrowUpRight } from "@/components/ui/primitives"
import { ThesisBackdrop } from "@/components/contracts/thesis-backdrop"
import { Logo, type LogoId } from "@/components/contracts/thesis-logos"
import { thesisSerif } from "@/components/contracts/thesis-font"
import { COPY } from "@/lib/copy"
import type { Locale } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import styles from "./thesis-spotlight.module.css"

const CHAIN: (LogoId | "arrow")[] = ["scholar", "openalex", "cairn", "arrow", "qwen", "arrow", "obsidian"]

/** The live R&D project, leading the selected work as its own lab card. */
export function ThesisSpotlight({ locale }: { locale: Locale }) {
  const t = COPY[locale].work.lab
  return (
    <div className={cn(styles.lab, thesisSerif.variable)}>
      <div className={styles.labTop}>
        <span>{t.label}</span>
        <span className={styles.labLive}><i aria-hidden="true" />{t.right}</span>
      </div>
      <Reveal amount={0.12} y={24}>
        <WipeLink href="/contracts/thesis-engine" className={styles.card} data-cursor="open" aria-labelledby="lab-identity lab-verb" aria-describedby="lab-proof lab-text">
          <div className={styles.scene}>
            <ThesisBackdrop />
            <div className={styles.sceneTop}>
              <span>{t.code}</span>
              <span className={styles.status}>{t.status}</span>
            </div>
            <div className={styles.chain} role="img" aria-label={t.chainLabel}>
              {CHAIN.map((item, i) =>
                item === "arrow" ? (
                  <span key={i} className={styles.arrow} aria-hidden="true">→</span>
                ) : (
                  <span key={i} className={styles.mark}><Logo id={item} tone="brand" className={styles.logo} /></span>
                )
              )}
              <span className={styles.packet} aria-hidden="true" />
            </div>
            <div id="lab-proof" className={styles.result}>
              <strong>{t.proof}</strong>
              <span>{t.proofLabel}</span>
            </div>
          </div>
          <div className={styles.content}>
            <p id="lab-identity" className={styles.identity}>{t.identity}<span>{t.chapter}</span></p>
            <p className={styles.offer}><span className={styles.offerSoon}>{t.offer[0]}</span><span>{t.offer[1]}</span></p>
            <h3 id="lab-verb" className={styles.verb}>{t.verb[0]} <em>{t.verb[1]}</em></h3>
            <p id="lab-text" className={styles.text}>{t.text}</p>
            <div className={styles.cost}><strong>{t.cost}</strong><span>{t.costLabel}</span></div>
            <div className={styles.open}>
              <span>{t.open}</span>
              <span className={styles.openIcon}><ArrowUpRight /></span>
            </div>
          </div>
        </WipeLink>
      </Reveal>
    </div>
  )
}
