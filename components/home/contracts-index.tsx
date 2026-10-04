"use client"

import Image from "next/image"
import { CONTRACTS } from "@/lib/contracts"
import { PROJECT_STORIES, STORY_PROJECT_SLUGS } from "@/lib/journey"
import { cn } from "@/lib/utils"
import { WipeLink } from "@/components/fx/page-wipe"
import { Reveal, Lines, Stagger } from "@/components/fx/reveal"
import { ArrowUpRight } from "@/components/ui/primitives"
import styles from "./journey.module.css"

const ARCHIVE_COPY: Record<string, string> = {
  strategy: "Understanding the business behind esports.",
  "intel-core": "Turning daily information into a useful intelligence tool.",
  build: "Building websites for real organisations.",
  imagery: "Capturing the people and moments behind the event.",
}

export function ContractsIndex() {
  const otherProjects = CONTRACTS.filter(c => !(STORY_PROJECT_SLUGS as readonly string[]).includes(c.slug))
  return (
    <section id="contracts" className={styles.projects} aria-labelledby="projects-title">
      <div className={styles.chapterTop}><span>03 / From curiosity to practice</span><span>Selected projects / Real outcomes</span></div>
      <div className={styles.projectIntro}>
        <div id="projects-title"><Lines as="h2" className={styles.chapterTitle} lines={["Learning by", <span key="doing" className="text-acid">making it happen.</span>]} /></div>
        <Reveal className={styles.bodyCopy}>That interest became hands-on work. Three projects show how I am learning to organise, communicate and build for sport.</Reveal>
      </div>
      <Stagger className={styles.projectGrid} stagger={0.12} amount={0.08}>
        {STORY_PROJECT_SLUGS.map((slug, index) => {
          const project = CONTRACTS.find(c => c.slug === slug)!
          const story = PROJECT_STORIES[slug]
          const isFeatured = project.statusKind === "featured"
          return (
            <WipeLink key={slug} href={`/contracts/${slug}`} className={cn(styles.projectCard, isFeatured && styles.featuredProject)} data-cursor="open" aria-labelledby={`project-${slug}`}>
              <div className={styles.projectImage}>
                <Image src={project.cover} alt="" fill sizes={isFeatured ? "(min-width: 801px) 36vw, (min-width: 481px) 45vw, 100vw" : "(min-width: 801px) 27vw, (min-width: 481px) 45vw, 100vw"} style={{ objectPosition: project.coverPosition ?? "center" }} />
                <span className={styles.projectNumber}>{String(index + 1).padStart(2, "0")} / {project.code}</span>
                {isFeatured && <span className={styles.projectBadge}>Featured project</span>}
              </div>
              <div className={styles.projectContent}>
                <h3 id={`project-${slug}`} className={styles.projectVerb}>{isFeatured ? project.title : story.verb}</h3>
                <p className={styles.projectTitle}>{isFeatured ? story.verb : project.title} / {story.chapter}</p>
                <p className={styles.projectDescription}>{story.text}</p>
                <div className={styles.projectProof}><strong>{story.proof}</strong><span>{story.proofLabel}</span></div>
                <div className={styles.projectOpen}><span>{isFeatured ? "Explore the featured case" : "Explore the project"}</span><ArrowUpRight /></div>
              </div>
            </WipeLink>
          )
        })}
      </Stagger>
      <div className={styles.archive}>
        <div className={styles.archiveTop}><h3>Other ways I put it into practice</h3><span>04 projects</span></div>
        <Stagger stagger={0.06} amount={0.1}>
          {otherProjects.map(project => <WipeLink key={project.slug} href={`/contracts/${project.slug}`} className={styles.archiveRow} data-cursor="open">
            <span className={styles.archiveCode}>{project.code}</span><h4 className={styles.archiveTitle}>{project.title}</h4><p className={styles.archiveDesc}>{ARCHIVE_COPY[project.slug]}</p><ArrowUpRight />
          </WipeLink>)}
        </Stagger>
      </div>
    </section>
  )
}
