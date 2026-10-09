"use client"

import { Reveal, Lines, Stagger } from "@/components/fx/reveal"
import { COPY } from "@/lib/copy"
import type { Locale } from "@/lib/i18n"
import styles from "./journey.module.css"

export function Operator({ locale = "en" }: { locale?: Locale }) {
  const t = COPY[locale].approach
  return (
    <section id="operator" className={styles.approach} aria-labelledby="approach-title">
      <div className={styles.chapterTop}><span>{t.chapter}</span><span>{t.chapterRight}</span></div>
      <div className={styles.approachLayout}>
        <div className={styles.approachIntro}>
          <div id="approach-title"><Lines as="h2" className={styles.chapterTitle} lines={[t.title[0], <span key="skills" className="text-acid">{t.title[1]}</span>]} /></div>
          <Reveal className={styles.bodyCopy}>{t.body}</Reveal>
          <div className={styles.profileMeta}>{t.languages.map(item => <span key={item}>{item}</span>)}</div>
        </div>
        <div>
          <Stagger className={styles.methodList} stagger={0.1} amount={0.1}>{t.methods.map((method, i) => <article className={styles.method} key={method.title}><span>0{i + 1}</span><div><h3>{method.title}</h3><p>{method.text}</p></div></article>)}</Stagger>
          <Reveal className={styles.toolLine}>{t.tools.map(item => <span key={item}>{item}</span>)}</Reveal>
          <span id="loadout" className="block scroll-mt-24" />
        </div>
      </div>
    </section>
  )
}
