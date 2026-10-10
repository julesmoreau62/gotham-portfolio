"use client"

import { COPY } from "@/lib/copy"
import type { Locale } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { Reveal, Lines } from "@/components/fx/reveal"
import { ProjectTerminal } from "@/components/home/project-terminal"
import shared from "./journey.module.css"
import styles from "./selected-work.module.css"

export function ContractsIndex({ locale = "en" }: { locale?: Locale }) {
  const t = COPY[locale].work
  return (
    <section id="contracts" className={cn(shared.projects, styles.section)} aria-labelledby="projects-title">
      <div className={shared.chapterTop}><span>{t.chapter}</span><span>{t.chapterRight}</span></div>
      <div className={styles.projectIntro}>
        <div id="projects-title"><Lines as="h2" className={shared.chapterTitle} lines={[t.title[0], <span key="doing" className="text-acid">{t.title[1]}</span>]} /></div>
        <Reveal className={styles.introCopy}><span className={styles.introLabel}>{t.introLabel}</span><p>{t.intro}</p>{t.languageNote && <p className={styles.languageNote}>{t.languageNote}</p>}</Reveal>
      </div>
      <ProjectTerminal locale={locale} />
    </section>
  )
}
