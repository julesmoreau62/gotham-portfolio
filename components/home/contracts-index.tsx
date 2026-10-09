"use client"

import Image from "next/image"
import { CONTRACTS } from "@/lib/contracts"
import { STORY_PROJECT_SLUGS } from "@/lib/journey"
import { COPY } from "@/lib/copy"
import type { Locale } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { WipeLink } from "@/components/fx/page-wipe"
import { Reveal, Lines, Stagger } from "@/components/fx/reveal"
import { ArrowUpRight } from "@/components/ui/primitives"
import { ThesisSpotlight } from "@/components/home/thesis-spotlight"
import shared from "./journey.module.css"
import styles from "./selected-work.module.css"

export function ContractsIndex({ locale = "en" }: { locale?: Locale }) {
  const t = COPY[locale].work
  // Thesis Engine has its own lab card, so it leaves the archive list.
  const otherProjects = CONTRACTS.filter(c => !(STORY_PROJECT_SLUGS as readonly string[]).includes(c.slug) && c.slug !== "thesis-engine")
  return (
    <section id="contracts" className={cn(shared.projects, styles.section)} aria-labelledby="projects-title">
      <div className={shared.chapterTop}><span>{t.chapter}</span><span>{t.chapterRight}</span></div>
      <div className={styles.projectIntro}>
        <div id="projects-title"><Lines as="h2" className={shared.chapterTitle} lines={[t.title[0], <span key="doing" className="text-acid">{t.title[1]}</span>]} /></div>
        <Reveal className={styles.introCopy}><span className={styles.introLabel}>{t.introLabel}</span><p>{t.intro}</p>{t.languageNote && <p className={styles.languageNote}>{t.languageNote}</p>}</Reveal>
      </div>
      <div className={styles.projectGrid}>
        {STORY_PROJECT_SLUGS.map((slug, index) => {
          const project = CONTRACTS.find(c => c.slug === slug)!
          const story = t.stories[slug]
          const isFeatured = project.statusKind === "featured"
          return (
            <Reveal key={slug} delay={index * 0.08} amount={0.12} y={24} className={cn(styles.projectReveal, isFeatured && styles.featuredReveal)}>
              <WipeLink href={`/contracts/${slug}`} className={cn(styles.projectCard, styles[slug === "field-ops" ? "field" : slug], isFeatured && styles.featuredProject)} data-cursor="open" aria-labelledby={`identity-${slug} project-${slug}`} aria-describedby={`result-${slug} description-${slug}`}>
                <div className={styles.projectScene}>
                  <div className={styles.sceneGrid} aria-hidden="true" />
                  <div className={styles.sceneTop}><span>{String(index + 1).padStart(2, "0")} / {project.code}</span><span>{isFeatured ? t.scene.featured : slug === "signal" ? t.scene.signal : t.scene.field}</span></div>
                  {slug === "daring" ? <>
                    <span className={styles.sceneWord} aria-hidden="true">DARING</span>
                    <div className={styles.websitePreview}>
                      <div className={styles.previewBar}><span /><span /><span /><p>{t.preview}</p><b>FR · NL</b></div>
                      <div className={styles.previewScreen}><Image src="/assets/portfolio/daring-sponsor-site.webp" alt={t.alts.daringSite} fill sizes="(min-width: 1600px) 650px, (min-width: 801px) 48vw, 84vw" className={styles.projectScreenshot} /></div>
                    </div>
                    <div className={styles.partnerPreview}><Image src="/assets/Royal%20daring/sponsor-site-packs.webp" alt={t.alts.daringPacks} fill sizes="(min-width: 801px) 18vw, 34vw" /></div>
                    <div className={styles.deliveryTag}><span className={styles.tagDot} />{t.delivery}</div>
                  </> : slug === "signal" ? <>
                    <div className={styles.signalPhoto}><Image src={project.cover} alt={t.alts.signalPhoto} fill sizes="(min-width: 1600px) 680px, (min-width: 801px) 44vw, 88vw" /></div>
                    <div className={styles.posterPreview}><Image src="/assets/portfolio/asn95-match-poster.webp" alt={t.alts.signalPoster} fill sizes="(min-width: 801px) 15vw, 32vw" className={styles.projectPoster} /></div>
                  </> : <Image src={project.cover} alt={t.alts.field} fill sizes="(min-width: 1600px) 680px, (min-width: 801px) 44vw, 88vw" className={styles.fieldPhoto} style={{ objectPosition: project.coverPosition ?? "center" }} />}
                  {!isFeatured && <div id={`result-${slug}`} className={styles.sceneResult}><strong>{story.proof}</strong><span>{story.proofLabel}</span></div>}
                </div>
                <div className={styles.projectContent}>
                  <p id={`identity-${slug}`} className={styles.projectIdentity}>{slug === "signal" ? "ASN95" : t.titles[slug] ?? project.title}<span>{story.chapter}</span></p>
                  <h3 id={`project-${slug}`} className={styles.projectVerb}>{story.verb}</h3>
                  <p id={`description-${slug}`} className={styles.projectDescription}>{story.text}</p>
                  {isFeatured && <div id={`result-${slug}`} className={styles.projectProof}><strong>{story.proof}</strong><span>{t.featuredProof[0]}<br />{t.featuredProof[1]}</span></div>}
                  <div className={styles.projectOpen}><span>{isFeatured ? t.openFeatured : t.open}</span><span className={styles.openIcon}><ArrowUpRight /></span></div>
                </div>
              </WipeLink>
            </Reveal>
          )
        })}
      </div>
      <ThesisSpotlight locale={locale} />
      <div className={shared.archive}>
        <div className={shared.archiveTop}><h3>{t.archiveTitle}</h3><span>{t.archiveCount}</span></div>
        <Stagger stagger={0.06} amount={0.1}>
          {otherProjects.map(project => <WipeLink key={project.slug} href={`/contracts/${project.slug}`} className={shared.archiveRow} data-cursor="open">
            <span className={shared.archiveCode}>{project.code}</span><h4 className={shared.archiveTitle}>{t.titles[project.slug] ?? project.title}</h4><p className={shared.archiveDesc}>{t.archive[project.slug]}</p><ArrowUpRight />
          </WipeLink>)}
        </Stagger>
      </div>
    </section>
  )
}
