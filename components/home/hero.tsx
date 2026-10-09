"use client"

import Image from "next/image"
import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useReducedMotion } from "@/hooks/use-media"
import { PROFILE } from "@/lib/profile"
import { ArrowUpRight, Barcode } from "@/components/ui/primitives"
import styles from "./journey.module.css"

export function Hero() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 70])

  return (
    <section ref={ref} id="hero" className={styles.hero} aria-labelledby="hero-title">
      <motion.div className={styles.heroImage} style={{ y: reduced ? 0 : photoY }} aria-hidden="true">
        <picture className="absolute inset-0">
          <source media="(max-width: 480px)" srcSet="/assets/portfolio/volleyball-6-mobile.webp" />
          <source media="(max-width: 900px)" srcSet="/assets/portfolio/volleyball-6-tablet.webp" />
          <Image src="/assets/portfolio/volleyball-6.webp" alt="" fill priority fetchPriority="high" sizes="(min-width: 900px) 65vw, 100vw" className={styles.heroPhoto} />
        </picture>
      </motion.div>
      <div className={styles.heroGrid} aria-hidden="true" />
      <div className={styles.heroTop}>
        <span className="text-acid">A player&apos;s perspective</span>
        <span>Jules Moreau / Portfolio 2026</span>
      </div>
      <div className={styles.heroMain}>
        <div className={styles.heroCopy}>
          <div className={styles.heroAvailability}><span className={styles.statusDot} /> Open to an internship <strong>FEB — JUN 2027</strong></div>
          <p className={styles.heroName}>Jules Moreau <span> / Event management</span></p>
          <h1 id="hero-title" className={styles.heroTitle}>Make sport<br /><span className="text-acid">happen.</span></h1>
          <p className={styles.heroSpecialty}>Event operations. Communication. Partnerships.</p>
          <p className={styles.heroIntro}>Hands-on experience on the ground, behind the content and alongside club partners. M2 International Sport Administration student, based in Lille and mobile across Europe.</p>
          <div className={styles.heroActions}>
            <a href="#contracts" className={styles.primaryLink}>Explore my work <span aria-hidden="true">↓</span></a>
            <a href={`mailto:${PROFILE.email}`} className={styles.textLink}>Let&apos;s talk <ArrowUpRight /></a>
          </div>
          <a href="/briefing" className={styles.heroBriefing}>Short on time? Read the 30-second briefing <ArrowUpRight /></a>
        </div>
        <div className={styles.heroStamp} aria-hidden="true">
          <span className={styles.stampCross}>+</span><span>FROM PLAYING<br />TO MAKING IT HAPPEN.</span>
          <Barcode seed="JM-EVENT-MANAGEMENT" height={23} className="w-28 text-acid" />
        </div>
      </div>
      <span className={styles.heroEdge} aria-hidden="true">ON THE GROUND / BEHIND THE GAME</span>
    </section>
  )
}
