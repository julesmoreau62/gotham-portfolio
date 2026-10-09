"use client"

import { PROFILE } from "@/lib/profile"
import { COPY } from "@/lib/copy"
import type { Locale } from "@/lib/i18n"
import { Reveal } from "@/components/fx/reveal"
import { WipeLink } from "@/components/fx/page-wipe"
import { ArrowUpRight } from "@/components/ui/primitives"
import styles from "./journey.module.css"

export function DeploymentLog({ locale = "en" }: { locale?: Locale }) {
  const t = COPY[locale].experience
  return (
    <section id="log" className={styles.background} aria-labelledby="background-title">
      <div className={styles.chapterTop}><span>{t.chapter}</span><span>{t.chapterRight}</span></div>
      <Reveal><div className={styles.backgroundHeading}><h2 id="background-title">{t.title}</h2><a href={PROFILE.cv} download className={styles.textLink}>{t.cv} <ArrowUpRight /></a></div><p className={styles.experienceIntro}>{t.intro}</p></Reveal>
      <div className={styles.fieldGrid}>
        {t.field.map(card => <article key={card.label} className={styles.fieldCard}><span>{card.label}</span><h3>{card.title[0]}<br />{card.title[1]}</h3><p>{card.text}</p></article>)}
      </div>
      <Reveal className={styles.education}>
        {t.education.map(item => <div key={item.label}><span>{item.label}</span><h3>{item.title}</h3><p>{item.text}</p></div>)}
      </Reveal>
      <details className={styles.experienceDetails}>
        <summary>{t.allRoles} / {String(t.deployments.length).padStart(2, "0")} {t.roles}</summary>
        {t.deployments.map(d => <article key={d.title} className={styles.experienceRow}><span>{d.period}</span><div><h3>{d.title}</h3><p className={styles.experienceOrg}>{d.org}</p><p>{d.body}</p></div><span>{d.where}</span></article>)}
      </details>
      <div id="more-about-me" className={styles.personalLink}><p>{t.personal}</p><WipeLink href="/about/games" className={styles.textLink}>{t.gamesLink} <ArrowUpRight /></WipeLink></div>
    </section>
  )
}
