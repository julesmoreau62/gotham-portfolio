"use client"

import { DEPLOYMENTS, PROFILE } from "@/lib/profile"
import { Reveal } from "@/components/fx/reveal"
import { WipeLink } from "@/components/fx/page-wipe"
import { ArrowUpRight } from "@/components/ui/primitives"
import styles from "./journey.module.css"

export function DeploymentLog() {
  return (
    <section id="log" className={styles.background} aria-labelledby="background-title">
      <div className={styles.chapterTop}><span>04 / Experience & education</span><span>Lille · Brussels · French Guiana</span></div>
      <Reveal><div className={styles.backgroundHeading}><h2 id="background-title">On the ground.</h2><a href={PROFILE.cv} download className={styles.textLink}>Full CV / PDF <ArrowUpRight /></a></div><p className={styles.experienceIntro}>Practical experience with the people, equipment and preparation behind an event.</p></Reveal>
      <div className={styles.fieldGrid}>
        <article className={styles.fieldCard}><span>Festival infrastructure / AUG 2025</span><h3>Kourou Beach Festival<br />& Tour de Guyane</h3><p>Built the VIP hospitality complex and deployed sponsor arches with Bolt Echafaudage, under strict timing constraints.</p></article>
        <article className={styles.fieldCard}><span>Team logistics / 2024 — 2025</span><h3>From training<br />to tournament day</h3><p>Organised transport and accommodation for the Ensisheim volleyball tournament alongside my coaching responsibilities at LISSP Calais.</p></article>
        <article className={styles.fieldCard}><span>Teamwork / SINCE 2022</span><h3>Preparation.<br />Responsibility.</h3><p>French Navy Reserve service taught me discipline, organisation and team leadership under pressure.</p></article>
      </div>
      <Reveal className={styles.education}>
        <div><span>2025 — 2027 / Université de Lille</span><h3>Master’s · International Sport Administration</h3><p>Sport management, governance and esports.</p></div>
        <div><span>2022 — 2025 / ULCO</span><h3>Bachelor’s · Sport Management</h3><p>The academic foundation behind my field experience.</p></div>
      </Reveal>
      <details className={styles.experienceDetails}>
        <summary>Explore all experience / {String(DEPLOYMENTS.length).padStart(2, "0")} roles</summary>
        {DEPLOYMENTS.map(d => <article key={d.title} className={styles.experienceRow}><span>{d.period}</span><div><h3>{d.title}</h3><p className={styles.experienceOrg}>{d.org}</p><p>{d.body}</p></div><span>{d.where}</span></article>)}
      </details>
      <div id="more-about-me" className={styles.personalLink}><p>Competition and creativity are still part of my everyday life.</p><WipeLink href="/about/games" className={styles.textLink}>Beyond the projects / My gaming story <ArrowUpRight /></WipeLink></div>
    </section>
  )
}
