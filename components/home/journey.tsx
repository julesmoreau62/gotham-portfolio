"use client"

import Image from "next/image"
import { Reveal, Lines } from "@/components/fx/reveal"
import { WipeLink } from "@/components/fx/page-wipe"
import { ArrowUpRight } from "@/components/ui/primitives"
import { CompetitionVideo } from "./competition-video"
import styles from "./journey.module.css"

export function Journey() {
  return (
    <section id="origin" className={styles.origin} aria-labelledby="story-title">
      <div className={styles.chapterTop}><span>02 / The person behind the work</span><span>Competition → Coaching → Event management</span></div>
      <div className={styles.storyLayout}>
        <div className={styles.storyCopy}>
          <div id="story-title"><Lines as="h2" className={styles.chapterTitle} lines={["A player's", <span key="perspective" className="text-acid">perspective.</span>]} /></div>
          <Reveal className={styles.bodyCopy}>Competitive gaming made me curious about everything around the match: the people, the preparation and the experience.</Reveal>
          <Reveal className={styles.bodyCopy}>Coaching volleyball brought that curiosity onto the court. At a well-organised U13 tournament, I could focus on my team because the details had already been taken care of.</Reveal>
          <div id="turning-point" className={styles.storyTakeaway}><span className={styles.eyebrow}>What stayed with me</span><p>Prepare the details.<br /><strong>Let the game happen.</strong></p></div>
          <WipeLink href="/about/games" className={styles.textLink} data-cursor="open">Beyond the work / My gaming story <ArrowUpRight /></WipeLink>
        </div>
        <Reveal className={styles.storyVisual}>
          <div className={styles.storyPhoto}><Image src="/assets/portfolio/volleyball-story.webp" alt="Volleyball match photographed by Jules Moreau" fill sizes="(min-width: 801px) 42vw, 100vw" className={styles.courtPhoto} /><span className={styles.imageTag}>My photography / LISSP Calais</span></div>
          <p className={styles.storyCaption}>Personal photography archive · Volleyball</p>
          <details className={styles.storyArchive}><summary>Watch my competitive gaming highlights <span aria-hidden="true">+</span></summary><CompetitionVideo /></details>
        </Reveal>
      </div>
    </section>
  )
}
