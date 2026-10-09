"use client"

import { getImageProps } from "next/image"
import { useRef } from "react"
import { preload } from "react-dom"
import { motion, useScroll, useTransform } from "framer-motion"
import { useReducedMotion } from "@/hooks/use-media"
import { PROFILE } from "@/lib/profile"
import { ArrowUpRight, Barcode } from "@/components/ui/primitives"
import styles from "./journey.module.css"

// Art-directed crops. Media queries never overlap, so the browser preloads
// and downloads exactly one of them.
const HERO_ART = [
  { media: "(max-width: 480px)", src: "/assets/portfolio/volleyball-6-mobile.webp", sizes: "100vw" },
  { media: "(min-width: 481px) and (max-width: 900px)", src: "/assets/portfolio/volleyball-6-tablet.webp", sizes: "100vw" },
  { media: "(min-width: 901px)", src: "/assets/portfolio/volleyball-6.webp", sizes: "65vw" },
].map(art => ({ ...art, props: getImageProps({ src: art.src, sizes: art.sizes, alt: "", fill: true }).props }))

export function Hero() {
  for (const art of HERO_ART) {
    preload(art.src, { as: "image", imageSrcSet: art.props.srcSet, imageSizes: art.sizes, media: art.media, fetchPriority: "high" })
  }
  const [mobile, tablet, desktop] = HERO_ART
  const reduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 70])

  return (
    <section ref={ref} id="hero" className={styles.hero} aria-labelledby="hero-title">
      <motion.div className={styles.heroImage} style={{ y: reduced ? 0 : photoY }} aria-hidden="true">
        <picture className="absolute inset-0">
          <source media={mobile.media} srcSet={mobile.props.srcSet} sizes={mobile.sizes} />
          <source media={tablet.media} srcSet={tablet.props.srcSet} sizes={tablet.sizes} />
          {/* eslint-disable-next-line @next/next/no-img-element -- art direction needs a raw img inside picture */}
          <img {...desktop.props} alt="" loading="eager" fetchPriority="high" className={styles.heroPhoto} />
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
