"use client"

import Image from "next/image"
import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useReducedMotion } from "@/hooks/use-media"
import { useBooted } from "@/components/home/boot"
import { Lines } from "@/components/fx/reveal"
import { Scramble } from "@/components/fx/scramble"
import { ArrowUpRight, Barcode } from "@/components/ui/primitives"
import styles from "./journey.module.css"

export function Hero() {
  const booted = useBooted()
  const reduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 110])
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -60])
  const fade = (delay: number) => ({
    initial: { opacity: 0, y: reduced ? 0 : 16 },
    animate: { opacity: booted ? 1 : 0, y: 0 },
    transition: { duration: reduced ? 0 : 0.7, delay: reduced ? 0 : delay },
  })
  return (
    <section ref={ref} id="hero" className={styles.hero} aria-labelledby="hero-title">
      <motion.div className={styles.heroImage} style={{ y: reduced ? 0 : photoY }} aria-hidden="true">
        <Image src="/assets/photo/volleyball-6.jpg" alt="" fill priority sizes="(min-width: 900px) 65vw, 100vw" className={styles.heroPhoto} />
      </motion.div>
      <div className={styles.heroGrid} aria-hidden="true" />
      <div className={styles.heroTop}>
        <motion.span {...fade(0.15)} className="label text-acid"><Scramble text="A PLAYER'S PERSPECTIVE" play={booted} /></motion.span>
        <motion.span {...fade(0.25)} className="label text-mute">Jules Moreau / Portfolio 2026</motion.span>
      </div>
      <div className={styles.heroMain}>
        <motion.div style={{ y: reduced ? 0 : titleY }}>
          <motion.p {...fade(0.25)} className={styles.heroName}>Jules Moreau <span>— Event management</span></motion.p>
          <div id="hero-title"><Lines as="h1" play={booted} delay={0.35} stagger={0.13} className={styles.heroTitle}
            lines={["From playing.", <span key="making" className="outline-text">To making</span>, <span key="happen" className="text-acid">it happen.</span>]} /></div>
          <motion.p {...fade(0.85)} className={styles.heroIntro}>Gaming sparked my curiosity. Volleyball made it real.<br className="hidden sm:block" /> Now I want to help bring sporting events to life.</motion.p>
          <motion.div {...fade(1)} className={styles.heroActions}>
            <a href="#origin" className={styles.primaryLink}>Follow the story <span aria-hidden="true">↓</span></a>
            <a href="#contracts" className={styles.textLink}>Go to the projects <ArrowUpRight /></a>
          </motion.div>
        </motion.div>
        <motion.div {...fade(0.7)} className={styles.heroStamp} aria-hidden="true">
          <span className={styles.stampCross}>+</span><span>PLAYER → COACH<br />→ EVENT MANAGEMENT</span>
          <Barcode seed="JM-FROM-PLAYER" height={23} className="w-28 text-acid" />
        </motion.div>
      </div>
      <motion.div {...fade(1.1)} className={styles.heroBottom}>
        <div className={styles.availability}><span className={styles.statusDot} /><span>Seeking internship <strong>FEB — JUN 2027</strong></span></div>
        <div className={styles.heroChapters} aria-label="Story chapters"><span>01 / Play</span><span aria-hidden="true">→</span><span>02 / Discover</span><span aria-hidden="true">→</span><span>03 / Make it happen</span></div>
        <a href="/briefing" className={styles.textLink}>The 30-second version <ArrowUpRight /></a>
      </motion.div>
      <span className={styles.heroEdge} aria-hidden="true">SCROLL TO EXPLORE / 50.6292° N</span>
    </section>
  )
}
