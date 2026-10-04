"use client"

import Image from "next/image"
import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useReducedMotion } from "@/hooks/use-media"
import { Lines, Reveal, Wipe, Stagger } from "@/components/fx/reveal"
import { WipeLink } from "@/components/fx/page-wipe"
import { ArrowUpRight } from "@/components/ui/primitives"
import { CompetitionVideo } from "./competition-video"
import styles from "./journey.module.css"

export function Journey() { return <><Origin /><TurningPoint /></> }

function Origin() {
  return (
    <section id="origin" className={styles.origin} aria-labelledby="origin-title">
      <div className={styles.chapterTop}><span>01 / The starting point</span><span>From the screen to the sidelines</span></div>
      <div className={styles.originLayout}>
        <div>
          <Reveal><span className={styles.eyebrow}>Competition came first.</span></Reveal>
          <div id="origin-title"><Lines as="h2" className={styles.chapterTitle} lines={["It started", "with a game", <span key="period" className="text-acid">and a question.</span>]} /></div>
          <Reveal className={styles.bodyCopy}>I played video games at a high level. Following esports came naturally. Then I started looking beyond the match: how do you bring a competition like this to life?</Reveal>
          <Reveal className={styles.question} delay={0.1}><span aria-hidden="true">↳</span> Who makes everything around the game work?</Reveal>
          <Reveal className="mt-8"><WipeLink href="/about/games" className={styles.textLink} data-cursor="open">Explore my gaming background <ArrowUpRight /></WipeLink></Reveal>
        </div>
        <CompetitionVideo />
      </div>
      <Reveal className={styles.originBridge}><span className={styles.bridgeLine} /><span>The screen sparked the question.<br /><strong>The court gave it meaning.</strong></span><span aria-hidden="true">↓</span></Reveal>
    </section>
  )
}

function TurningPoint() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const photoY = useTransform(scrollYProgress, [0, 1], [-35, 45])
  const lineScale = useTransform(scrollYProgress, [0.15, 0.75], [0, 1])
  return (
    <section id="turning-point" ref={ref} className={styles.turningPoint} aria-labelledby="turning-title">
      <div className={styles.chapterTop}><span>02 / The turning point</span><span>Volleyball · Coaching · U13 tournament</span></div>
      <div className={styles.turningLayout}>
        <div className={styles.turningVisual}>
          <Wipe from="left" className={styles.courtFrame}><div className={styles.courtImage}>
            <motion.div className={styles.courtPhotoWrap} style={{ y: reduced ? 0 : photoY }}><Image src="/assets/photo/volleyball-3.jpg" alt="Volleyball match photographed by Jules Moreau" fill sizes="(min-width: 1024px) 48vw, 100vw" className={styles.courtPhoto} /></motion.div>
            <div className={styles.courtOverlay} aria-hidden="true" /><span className={styles.imageTag}>On the court / Volleyball archive</span><span className={styles.courtCross} aria-hidden="true">+</span>
          </div></Wipe>
          <div className={styles.photoCaption}><span>Personal photography archive</span><span>Volleyball / LISSP Calais</span></div>
          <Reveal className={styles.turningQuote}><span aria-hidden="true">“</span><p>I enjoyed managing my team.<br /><strong>Everything just flowed.</strong></p></Reveal>
        </div>
        <div className={styles.turningCopy}>
          <Reveal><span className={styles.eyebrow}>The moment it clicked.</span></Reveal>
          <div id="turning-title"><Lines as="h2" className={styles.chapterTitle} lines={["A team.", "A tournament.", <span key="spark" className="text-acid">A direction.</span>]} /></div>
          <Reveal className={styles.bodyCopy}>I played a lot of volleyball, then began coaching. At a tournament with my U13 team, event management became something I could feel.</Reveal>
          <div className={styles.memoryList}>
            <motion.span className={styles.memoryRail} style={{ scaleY: reduced ? 1 : lineScale }} aria-hidden="true" />
            <Stagger stagger={0.14} amount={0.15}>{[
              ["The day before", "We already knew which halls we would play in."],
              ["On the day", "No last-minute problems. An approachable, friendly staff."],
              ["On the sidelines", "I could focus on my team and enjoy coaching."],
            ].map(([label, text]) => <div key={label} className={styles.memory}><span className={styles.memoryDot} aria-hidden="true" /><span className={styles.memoryLabel}>{label}</span><p>{text}</p></div>)}</Stagger>
          </div>
          <Reveal className={styles.realisation}>That was the appeal: a well-prepared event gives everyone room to enjoy their role. <strong>I wanted to understand how to make that happen.</strong></Reveal>
        </div>
      </div>
      <Reveal className={styles.manifesto}><span className={styles.eyebrow}>What stayed with me</span><p>Prepare the details.<br /><span>Let the game happen.</span></p><a href="#contracts" className={styles.textLink}>Where that curiosity took me <span aria-hidden="true">↓</span></a></Reveal>
    </section>
  )
}
