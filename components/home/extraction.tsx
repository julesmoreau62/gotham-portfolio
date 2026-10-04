"use client"

import { PROFILE } from "@/lib/profile"
import { Reveal, Lines } from "@/components/fx/reveal"
import { ArrowUpRight } from "@/components/ui/primitives"
import styles from "./journey.module.css"

export function Extraction() {
  return (
    <section id="extraction" className={styles.contact} aria-labelledby="contact-title">
      <div className={styles.chapterTop}><span>05 / The next chapter</span><span>Event management internship / FEB — JUN 2027</span></div>
      <div id="contact-title"><Lines as="h2" className={styles.contactTitle} lines={["Let's make", <span key="happen" className={styles.contactOutline}>it happen.</span>]} /></div>
      <div className={styles.contactBottom}>
        <div>
          <Reveal className={styles.contactCopy}>I am looking for an event management team where I can keep learning and contribute on the ground. <strong>February to June 2027, in France, Belgium or elsewhere in Europe.</strong></Reveal>
          <Reveal className={styles.contactLinks}><a href={PROFILE.cv} download className={styles.textLink}>Download CV <ArrowUpRight /></a><a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" className={styles.textLink}>LinkedIn <ArrowUpRight /></a><a href="/briefing" className={styles.textLink}>30-second briefing <ArrowUpRight /></a></Reveal>
        </div>
        <Reveal><a href={`mailto:${PROFILE.email}`} className={styles.contactEmail} data-cursor="mail"><span>{PROFILE.email}</span><ArrowUpRight /></a><div className={styles.contactMeta}><span>Lille / France</span><span>FR native · EN C1</span></div></Reveal>
      </div>
    </section>
  )
}
