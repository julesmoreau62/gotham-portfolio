"use client"

import { Reveal, Lines, Stagger } from "@/components/fx/reveal"
import styles from "./journey.module.css"

const METHODS = [
  { title: "Prepare the ground.", text: "Coaching, event infrastructure work and the Navy Reserve taught me to take preparation, coordination and responsibility seriously." },
  { title: "Connect the people.", text: "Clear information for a team. Content that brings a club to life. Partnerships that give a project the resources to grow." },
  { title: "Build what is useful.", text: "Photography, websites and AI-assisted tools expand what I can deliver. I learn the tools a project needs, then put them to work." },
]

export function Operator() {
  return (
    <section id="operator" className={styles.approach} aria-labelledby="approach-title">
      <div className={styles.chapterTop}><span>03 / How I work</span><span>Sport management · Field experience · Curiosity</span></div>
      <div className={styles.approachLayout}>
        <div className={styles.approachIntro}>
          <div id="approach-title"><Lines as="h2" className={styles.chapterTitle} lines={["One direction.", <span key="skills" className="text-acid">Different skills.</span>]} /></div>
          <Reveal className={styles.bodyCopy}>My path brings together competition, coaching, military discipline and creative work. They all feed the way I approach a project.</Reveal>
          <div className={styles.profileMeta}><span>French / Native</span><span>English / C1</span><span>FR · BE · Europe</span></div>
        </div>
        <div>
          <Stagger className={styles.methodList} stagger={0.1} amount={0.1}>{METHODS.map((method, i) => <article className={styles.method} key={method.title}><span>0{i + 1}</span><div><h3>{method.title}</h3><p>{method.text}</p></div></article>)}</Stagger>
          <Reveal className={styles.toolLine}><span>Tools, when they help</span><span>Canva · Lightroom · Premiere</span><span>Notion · Web · AI workflows</span></Reveal>
          <span id="loadout" className="block scroll-mt-24" />
        </div>
      </div>
    </section>
  )
}
