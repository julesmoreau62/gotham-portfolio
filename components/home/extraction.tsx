"use client"

import { PROFILE } from "@/lib/profile"
import { Reveal, Lines } from "@/components/fx/reveal"
import { ArrowUpRight } from "@/components/ui/primitives"
import { COPY } from "@/lib/copy"
import { BRIEFING_PATH, type Locale } from "@/lib/i18n"
import styles from "./journey.module.css"

export function Extraction({ locale = "en" }: { locale?: Locale }) {
  const t = COPY[locale].contact
  return (
    <section id="extraction" className={styles.contact} aria-labelledby="contact-title">
      <div className={styles.chapterTop}><span>{t.chapter}</span><span>{t.chapterRight}</span></div>
      <div id="contact-title"><Lines as="h2" className={styles.contactTitle} lines={[t.title[0], <span key="happen" className={styles.contactOutline}>{t.title[1]}</span>]} /></div>
      <div className={styles.contactBottom}>
        <div>
          <Reveal className={styles.contactCopy}>{t.copy} <strong>{t.copyStrong}</strong></Reveal>
          <Reveal className={styles.contactLinks}><a href={PROFILE.cv} download className={styles.textLink}>{t.cv} <ArrowUpRight /></a><a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" className={styles.textLink}>LinkedIn <ArrowUpRight /></a><a href={BRIEFING_PATH[locale]} className={styles.textLink}>{t.briefing} <ArrowUpRight /></a></Reveal>
        </div>
        <Reveal><a href={`mailto:${PROFILE.email}`} className={styles.contactEmail} data-cursor="mail"><span>{PROFILE.email}</span><ArrowUpRight /></a><div className={styles.contactMeta}><span>{t.meta[0]}</span><span>{t.meta[1]}</span></div></Reveal>
      </div>
    </section>
  )
}
