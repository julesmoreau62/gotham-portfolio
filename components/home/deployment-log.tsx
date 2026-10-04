"use client"

import { DEPLOYMENTS, PROFILE } from "@/lib/profile"
import { Reveal } from "@/components/fx/reveal"
import { WipeLink } from "@/components/fx/page-wipe"
import { ArrowUpRight } from "@/components/ui/primitives"
import styles from "./journey.module.css"

export function DeploymentLog() {
  return (
    <section id="log" className={styles.background} aria-labelledby="background-title">
      <Reveal><div className={styles.backgroundHeading}><h2 id="background-title">The background.</h2><a href={PROFILE.cv} download className={styles.textLink}>Full CV / PDF <ArrowUpRight /></a></div></Reveal>
      <Reveal className={styles.education}>
        <div><span>2025 — 2027 / Université de Lille</span><h3>Master’s · International Sport Administration</h3><p>Sport management, governance and esports.</p></div>
        <div><span>2022 — 2025 / ULCO</span><h3>Bachelor’s · Sport Management</h3><p>The academic foundation behind my field experience.</p></div>
      </Reveal>
      <details className={styles.experienceDetails}>
        <summary>Open the experience log / {String(DEPLOYMENTS.length).padStart(2, "0")} entries</summary>
        {DEPLOYMENTS.map(d => <article key={d.title} className={styles.experienceRow}><span>{d.period}</span><div><h3>{d.title}</h3><p>{d.org}</p></div><span>{d.where}</span></article>)}
      </details>
      <div id="more-about-me" className={styles.personalLink}><p>Competition and creativity are still part of my everyday life.</p><WipeLink href="/about/games" className={styles.textLink}>Beyond the projects / My gaming story <ArrowUpRight /></WipeLink></div>
    </section>
  )
}
