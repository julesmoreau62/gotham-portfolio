"use client"

import Image from "next/image"
import { CONTRACTS } from "@/lib/contracts"
import { PROJECT_STORIES, STORY_PROJECT_SLUGS } from "@/lib/journey"
import { cn } from "@/lib/utils"
import { WipeLink } from "@/components/fx/page-wipe"
import { Reveal, Lines, Stagger } from "@/components/fx/reveal"
import { ArrowUpRight } from "@/components/ui/primitives"
import shared from "./journey.module.css"
import styles from "./selected-work.module.css"

const ARCHIVE_COPY: Record<string, string> = {
  strategy: "Understanding the business behind esports.",
  "intel-core": "Turning daily information into a useful intelligence tool.",
  build: "Building websites for real organisations.",
  imagery: "Capturing the people and moments behind the event.",
}

export function ContractsIndex() {
  const otherProjects = CONTRACTS.filter(c => !(STORY_PROJECT_SLUGS as readonly string[]).includes(c.slug))
  return (
    <section id="contracts" className={cn(shared.projects, styles.section)} aria-labelledby="projects-title">
      <div className={shared.chapterTop}><span>01 / Selected work</span><span>Three projects / Practical experience</span></div>
      <div className={styles.projectIntro}>
        <div id="projects-title"><Lines as="h2" className={shared.chapterTitle} lines={["Less theory.", <span key="doing" className="text-acid">More impact.</span>]} /></div>
        <Reveal className={styles.introCopy}><span className={styles.introLabel}>On the ground. In the work.</span><p>Running a tournament. Giving a club a voice. Equipping a team for its next season. Three projects, three ways to make sport happen.</p></Reveal>
      </div>
      <div className={styles.projectGrid}>
        {STORY_PROJECT_SLUGS.map((slug, index) => {
          const project = CONTRACTS.find(c => c.slug === slug)!
          const story = PROJECT_STORIES[slug]
          const isFeatured = project.statusKind === "featured"
          return (
            <Reveal key={slug} delay={index * 0.08} amount={0.12} y={24} className={cn(styles.projectReveal, isFeatured && styles.featuredReveal)}>
              <WipeLink href={`/contracts/${slug}`} className={cn(styles.projectCard, styles[slug === "field-ops" ? "field" : slug], isFeatured && styles.featuredProject)} data-cursor="open" aria-labelledby={`identity-${slug} project-${slug}`} aria-describedby={`result-${slug} description-${slug}`}>
                <div className={styles.projectScene}>
                  <div className={styles.sceneGrid} aria-hidden="true" />
                  <div className={styles.sceneTop}><span>{String(index + 1).padStart(2, "0")} / {project.code}</span><span>{isFeatured ? "Featured case" : slug === "signal" ? "Content in action" : "On the ground"}</span></div>
                  {slug === "daring" ? <>
                    <span className={styles.sceneWord} aria-hidden="true">DARING</span>
                    <div className={styles.websitePreview}>
                      <div className={styles.previewBar}><span /><span /><span /><p>Royal Daring / Partner website</p><b>FR · NL</b></div>
                      <div className={styles.previewScreen}><Image src="/assets/portfolio/daring-sponsor-site.webp" alt="Bilingual Royal Daring partner website designed and delivered by Jules" fill sizes="(min-width: 1600px) 650px, (min-width: 801px) 48vw, 84vw" className={styles.projectScreenshot} /></div>
                    </div>
                    <div className={styles.partnerPreview}><Image src="/assets/Royal%20daring/sponsor-site-packs.webp" alt="Partner packages on the delivered Royal Daring website" fill sizes="(min-width: 801px) 18vw, 34vw" /></div>
                    <div className={styles.deliveryTag}><span className={styles.tagDot} />Website · Brand · Brochure</div>
                  </> : slug === "signal" ? <>
                    <div className={styles.signalPhoto}><Image src={project.cover} alt="ASN95 youth players photographed for club and sponsor communication" fill sizes="(min-width: 1600px) 680px, (min-width: 801px) 44vw, 88vw" /></div>
                    <div className={styles.posterPreview}><Image src="/assets/portfolio/asn95-match-poster.webp" alt="ASN95 match poster created by Jules" fill sizes="(min-width: 801px) 15vw, 32vw" className={styles.projectPoster} /></div>
                  </> : <Image src={project.cover} alt="ASI university tournament on the ground in Lille" fill sizes="(min-width: 1600px) 680px, (min-width: 801px) 44vw, 88vw" className={styles.fieldPhoto} style={{ objectPosition: project.coverPosition ?? "center" }} />}
                  {!isFeatured && <div id={`result-${slug}`} className={styles.sceneResult}><strong>{story.proof}</strong><span>{story.proofLabel}</span></div>}
                </div>
                <div className={styles.projectContent}>
                  <p id={`identity-${slug}`} className={styles.projectIdentity}>{slug === "signal" ? "ASN95" : project.title}<span>{story.chapter}</span></p>
                  <h3 id={`project-${slug}`} className={styles.projectVerb}>{story.verb}</h3>
                  <p id={`description-${slug}`} className={styles.projectDescription}>{story.text}</p>
                  {isFeatured && <div id={`result-${slug}`} className={styles.projectProof}><strong>{story.proof}</strong><span>Bilingual website.<br />A complete partner system.</span></div>}
                  <div className={styles.projectOpen}><span>{isFeatured ? "Inside the partner system" : "Explore the case study"}</span><span className={styles.openIcon}><ArrowUpRight /></span></div>
                </div>
              </WipeLink>
            </Reveal>
          )
        })}
      </div>
      <div className={shared.archive}>
        <div className={shared.archiveTop}><h3>More projects / Digital, strategy & photography</h3><span>04 projects</span></div>
        <Stagger stagger={0.06} amount={0.1}>
          {otherProjects.map(project => <WipeLink key={project.slug} href={`/contracts/${project.slug}`} className={shared.archiveRow} data-cursor="open">
            <span className={shared.archiveCode}>{project.code}</span><h4 className={shared.archiveTitle}>{project.title}</h4><p className={shared.archiveDesc}>{ARCHIVE_COPY[project.slug]}</p><ArrowUpRight />
          </WipeLink>)}
        </Stagger>
      </div>
    </section>
  )
}
