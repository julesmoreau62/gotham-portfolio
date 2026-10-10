"use client"

import Image from "next/image"
import { Reveal, Lines } from "@/components/fx/reveal"
import { WipeLink } from "@/components/fx/page-wipe"
import { ArrowUpRight } from "@/components/ui/primitives"
import { COPY } from "@/lib/copy"
import type { Locale } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { CompetitionVideo } from "./competition-video"
import { PlacesMap } from "./places-map"
import styles from "./journey.module.css"

export function Journey({ locale = "en" }: { locale?: Locale }) {
  const t = COPY[locale].story
  return (
    <section id="origin" className={styles.origin} aria-labelledby="story-title">
      <div className={styles.chapterTop}><span>{t.chapter}</span><span>{t.chapterRight}</span></div>
      <div className={styles.storyLayout}>
        <div className={styles.storyCopy}>
          <div id="story-title"><Lines as="h2" className={styles.chapterTitle} lines={[t.title[0], <span key="perspective" className="text-acid">{t.title[1]}</span>]} /></div>
          {t.body.map(paragraph => <Reveal key={paragraph} className={styles.bodyCopy}>{paragraph}</Reveal>)}
          <div id="turning-point" className={styles.storyTakeaway}><span className={styles.eyebrow}>{t.takeawayLabel}</span><p>{t.takeaway[0]}<br /><strong>{t.takeaway[1]}</strong></p></div>
          <WipeLink href="/about/games" className={styles.textLink} data-cursor="open">{t.gamesLink} <ArrowUpRight /></WipeLink>
        </div>
        <Reveal className={styles.storyVisual}>
          <div className={styles.storyPhoto}><Image src="/assets/portfolio/volleyball-story.webp" alt={t.photoAlt} fill sizes="(min-width: 801px) 42vw, 100vw" className={styles.courtPhoto} /><span className={styles.imageTag}>{t.photoTag}</span></div>
          <p className={styles.storyCaption}>{t.caption}</p>
          <details className={styles.storyArchive}><summary>{t.highlights} <span aria-hidden="true">+</span></summary><CompetitionVideo locale={locale} /></details>
        </Reveal>
      </div>
      <div id="turning-path" className={cn(styles.places, styles.path)}>
        <div className={styles.placesTop}><span>{t.path.kicker}</span><span>{t.path.count}</span></div>
        <div className={styles.placesIntro}>
          <h3 className={styles.placesTitle}>{t.path.title[0]}<br /><span className="text-acid">{t.path.title[1]}</span></h3>
          <Reveal className={styles.placesLead}>{t.path.intro}</Reveal>
        </div>
        <Reveal amount={0.1}>
          <ol className={styles.placesList}>
            {t.path.steps.map((step, i) => (
              <li key={step.stage} className={cn(styles.place, i === t.path.steps.length - 1 && styles.placeNow)}>
                <span className={styles.placeIndex}>{String(i + 1).padStart(2, "0")} / {step.when}</span>
                <h4>{step.stage}</h4>
                <span className={styles.placeLesson}>{step.lesson}</span>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
      <div id="places" className={styles.places}>
        <div className={styles.placesTop}><span>{t.places.kicker}</span><span>{t.places.count}</span></div>
        <div className={styles.placesIntro}>
          <h3 id="places-title" className={styles.placesTitle}>{t.places.title[0]}<br /><span className="text-acid">{t.places.title[1]}</span></h3>
          <Reveal className={styles.placesLead}>{t.places.intro}</Reveal>
        </div>
        <Reveal amount={0.1}><PlacesMap t={t.places} /></Reveal>
      </div>
    </section>
  )
}
