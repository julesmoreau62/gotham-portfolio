"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useReducedMotion } from "@/hooks/use-media"
import { PROFILE } from "@/lib/profile"
import { COPY } from "@/lib/copy"
import { BRIEFING_PATH, type Locale } from "@/lib/i18n"
import { ArrowUpRight, Barcode } from "@/components/ui/primitives"
import { MatrixPortrait } from "./matrix-portrait"
import styles from "./journey.module.css"

export function Hero({ locale = "en" }: { locale?: Locale }) {
  const t = COPY[locale].hero
  const reduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 70])

  return (
    <section ref={ref} id="hero" className={styles.hero} aria-labelledby="hero-title">
      <motion.div className={styles.heroImage} style={{ y: reduced ? 0 : photoY }} aria-hidden="true">
        <MatrixPortrait />
      </motion.div>
      <div className={styles.heroGrid} aria-hidden="true" />
      <div className={styles.heroTop}>
        <span className="text-acid">{t.kicker}</span>
        <span>{t.portfolio}</span>
      </div>
      <div className={styles.heroMain}>
        <div className={styles.heroCopy}>
          <div className={styles.heroAvailability}><span className={styles.statusDot} /> {t.availability} <strong>{t.window}</strong></div>
          <p className={styles.heroName}>Jules Moreau <span> / {t.role}</span></p>
          <h1 id="hero-title" className={styles.heroTitle}>{t.title[0]}<br /><span className="text-acid">{t.title[1]}</span></h1>
          <p className={styles.heroSpecialty}>{t.specialty}</p>
          <p className={styles.heroIntro}>{t.intro}</p>
          <div className={styles.heroActions}>
            <a href="#contracts" className={styles.primaryLink}>{t.explore} <span aria-hidden="true">↓</span></a>
            <a href={`mailto:${PROFILE.email}`} className={styles.textLink}>{t.talk} <ArrowUpRight /></a>
          </div>
          <a href={BRIEFING_PATH[locale]} className={styles.heroBriefing}>{t.briefing} <ArrowUpRight /></a>
        </div>
        <div className={styles.heroStamp} aria-hidden="true">
          <span className={styles.stampCross}>+</span><span>{t.stamp[0]}<br />{t.stamp[1]}</span>
          <Barcode seed="JM-DIGITAL-TRANSFORMATION" height={23} className="w-28 text-acid" />
        </div>
      </div>
      <span className={styles.heroEdge} aria-hidden="true">{t.edge}</span>
    </section>
  )
}
