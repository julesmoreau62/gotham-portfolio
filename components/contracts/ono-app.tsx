"use client"

import { useRef, useState } from "react"
import { cn } from "@/lib/utils"
import styles from "./ono-sendai.module.css"

/* ------------------------------------------------------------------
   ONO-SENDAI — the app, recreated in HTML. The interface is in French,
   as in the real app; the caption under each screen says in English
   what it shows. Sample content, not screenshots.
   ------------------------------------------------------------------ */

type SpaceId = "thesis" | "library" | "lectures" | "ask"

const SPACES: { id: SpaceId; label: string; key: string; caption: string }[] = [
  { id: "thesis", label: "Mémoire", key: "⌥2", caption: "Writing the thesis. I select a sentence and ask the copilot to check it: it reads my library, flags the claim as “to nuance” and offers a source with its page. Citations render in APA 7 as I type." },
  { id: "library", label: "Bibliothèque", key: "⌥4", caption: "Searching my books. A French question returns English passages by meaning, each with its book and page; one click opens the PDF on that page, another adds the passage to a reading note." },
  { id: "lectures", label: "Cours", key: "⌥3", caption: "Recording a lecture. The slide on screen and every flagged moment are timed; after class, the local transcript turns into a written course with links back to each slide, then revision cards." },
  { id: "ask", label: "Demander", key: "⌘K", caption: "One question across everything I own: books, thesis and lecture notes. The answer cites each passage, and every reference opens the exact page or section." },
]

export function OnoApp() {
  const [active, setActive] = useState<SpaceId>("thesis")
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const index = SPACES.findIndex((s) => s.id === active)

  const onKey = (e: React.KeyboardEvent) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0
    if (!step) return
    // The case shell turns arrows into next/previous project: keep them inside the tabs.
    e.preventDefault()
    e.stopPropagation()
    const next = (index + step + SPACES.length) % SPACES.length
    setActive(SPACES[next].id)
    tabs.current[next]?.focus()
  }

  return (
    <figure className={styles.app}>
      <div className={styles.window}>
        <div className={styles.titlebar}>
          <span className={styles.lights} aria-hidden="true"><i /><i /><i /></span>
          <div className={styles.switcher} role="tablist" aria-label="Spaces of the app" onKeyDown={onKey}>
            {SPACES.map((s, i) => (
              <button
                key={s.id}
                ref={(el) => { tabs.current[i] = el }}
                type="button"
                role="tab"
                id={`ono-tab-${s.id}`}
                aria-selected={active === s.id}
                aria-controls="ono-screen"
                tabIndex={active === s.id ? 0 : -1}
                className={cn(styles.tab, active === s.id && styles.tabOn)}
                onClick={() => setActive(s.id)}
              >
                {s.label}
                <kbd>{s.key}</kbd>
              </button>
            ))}
          </div>
          <span className={styles.appName}>Ono-Sendai</span>
        </div>

        <div id="ono-screen" role="tabpanel" aria-labelledby={`ono-tab-${active}`} className={styles.screen} key={active}>
          {active === "thesis" && <ThesisScreen />}
          {active === "library" && <LibraryScreen />}
          {active === "lectures" && <LecturesScreen />}
          {active === "ask" && <AskScreen />}
        </div>
      </div>
      <figcaption className={styles.caption}>
        <span className={styles.captionN}>{String(index + 1).padStart(2, "0")} / 04</span>
        <span>{SPACES[index].caption}</span>
        <span className={styles.captionNote}>Recreated interface · sample content</span>
      </figcaption>
    </figure>
  )
}

/* ---------------------------------------------------------- screens */

function Skel({ w, hl }: { w: string; hl?: string }) {
  return (
    <span className={styles.skelLine}>
      <i style={{ width: w }} />
      {hl && <mark>{hl}</mark>}
    </span>
  )
}

const PLAN: [string, string, "final" | "relu" | "brouillon" | "idee", boolean?][] = [
  ["00", "Introduction", "relu"],
  ["01", "Cadre théorique", "brouillon"],
  ["1.1", "IA générative et associations", "brouillon", true],
  ["1.2", "Outils no-code", "idee"],
  ["02", "Méthodologie", "idee"],
  ["03", "Résultats", "idee"],
]

function ThesisScreen() {
  return (
    <div className={styles.cols3}>
      <aside className={styles.rail}>
        <span className={styles.railHead}>Plan</span>
        {PLAN.map(([n, title, status, on]) => (
          <span key={n} className={cn(styles.planRow, n.includes(".") && styles.planSub, on && styles.planOn)}>
            <i className={styles[`st_${status}`]} aria-hidden="true" />
            <b>{n}</b>{title}
          </span>
        ))}
        <span className={styles.railFoot}>6 240 / 15 000 mots</span>
      </aside>

      <div className={styles.doc}>
        <span className={styles.docKicker}>1.1 · brouillon · 1 120 mots</span>
        <h4 className={styles.docTitle}>L’IA générative dans les associations sportives</h4>
        <p className={styles.docP}>
          Les associations sportives reposent largement sur le bénévolat, avec peu de salariés pour les tâches
          administratives <span className={styles.cite}>(Lemaire et al., 2022, p. 52)</span>.
        </p>
        <div className={styles.selWrap}>
          <span className={styles.toolbar} aria-hidden="true">
            {["Vérifier", "Relire", "Sourcer", "Reformuler", "Jury", "Demander"].map((b, i) => (
              <span key={b} className={cn(i === 0 && styles.toolbarOn)}>{b}</span>
            ))}
          </span>
          <p className={styles.docP}>
            <span className={styles.selNuance}>L’IA générative permet à un seul bénévole de produire toute la communication d’un club.</span>
          </p>
        </div>
        <div className={styles.docSkel}><Skel w="92%" /><Skel w="78%" /></div>
      </div>

      <aside className={styles.copilot}>
        <span className={styles.railHead}>Copilote · Relecteur</span>
        <span className={styles.verdict}>À nuancer</span>
        <p>Formulation trop générale : aucun passage de ta bibliothèque ne mesure ce gain pour un club entier.</p>
        <p className={styles.suggest}>« … peut permettre à un bénévole de produire une part importante de la communication courante. »</p>
        <span className={styles.srcChip}>Ouvrage · p. 265 ↗</span>
        <span className={styles.btnRow}><span>Remplacer</span><span>+ citation</span></span>
      </aside>
    </div>
  )
}

const RESULTS = [
  { src: "Sport management handbook", page: "p. 118", sens: true, hl: "volunteer motivation", w: ["94%", "40%"] },
  { src: "Managing sport organisations", page: "p. 203", sens: true, hl: "retaining volunteers", w: ["88%", "56%"] },
  { src: "Dictionnaire critique de la RSE", page: "p. 61", sens: false, hl: "motivation des bénévoles", w: ["90%", "34%"] },
]

function LibraryScreen() {
  return (
    <div className={styles.cols2}>
      <aside className={styles.rail}>
        <span className={styles.railHead}>Ouvrages · 31</span>
        {["Sport management", "Gouvernance", "Développement durable", "Articles"].map((g, i) => (
          <span key={g} className={styles.planRow}><i className={styles.st_final} aria-hidden="true" />{g}{i === 0 && <em className={styles.railBadge}>indexé</em>}</span>
        ))}
        <span className={styles.railFoot}>Recherche par le sens · active</span>
      </aside>
      <div className={styles.doc}>
        <div className={styles.search}>
          <span aria-hidden="true">⌕</span>
          motivation des bénévoles
          <span className={styles.searchMode}>mots + sens</span>
        </div>
        <div className={styles.results}>
          {RESULTS.map((r) => (
            <div key={r.src} className={styles.result}>
              <div className={styles.resultTop}>
                <span className={styles.srcChip}>{r.src} · {r.page} ↗</span>
                {r.sens && <span className={styles.sensTag}>sens</span>}
              </div>
              <p className={styles.resultBody}><Skel w={r.w[0]} /><Skel w={r.w[1]} hl={r.hl} /></p>
              <span className={styles.resultActions}><span>Passage entier</span><span>Copier</span><span>→ Fiche de lecture</span></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function LecturesScreen() {
  return (
    <div className={styles.cols2}>
      <aside className={styles.rail}>
        <span className={styles.railHead}>Matières</span>
        {[["Marketing sportif", true], ["Gouvernance du sport", false], ["Sport & RSE", false], ["Management de projet", false]].map(([m, on]) => (
          <span key={m as string} className={cn(styles.planRow, on && styles.planOn)}><i className={on ? styles.st_final : styles.st_idee} aria-hidden="true" />{m}</span>
        ))}
        <span className={styles.railFoot}>14 cartes à revoir</span>
      </aside>
      <div className={styles.doc}>
        <div className={styles.rec}>
          <span className={styles.recDot} aria-hidden="true" />
          <b>REC 00:42:17</b>
          <span>CM4 · Naming</span>
          <span className={styles.recBtn}>⚑ Important</span>
          <span className={styles.recBtn}>Pause</span>
        </div>
        <div className={styles.lectureBody}>
          <div className={styles.slide}>
            <span className={styles.slideN}>Diapo 12 / 34</span>
            <Skel w="70%" /><Skel w="48%" /><Skel w="56%" />
          </div>
          <div className={styles.transcript}>
            <span className={styles.railHead}>Transcription · locale</span>
            <p><b>[diapo 11]</b> <Skel w="80%" /></p>
            <p className={styles.flagged}><b>[diapo 12]</b> « Retenez bien la différence entre sponsoring et mécénat. » <em>⚑</em></p>
            <p><b>[diapo 12]</b> <Skel w="64%" /></p>
          </div>
        </div>
        <span className={styles.btnRow}><span>Rédiger le cours</span><span>Fiche + cartes</span><span>M’interroger</span></span>
      </div>
    </div>
  )
}

function AskScreen() {
  return (
    <div className={styles.askWrap}>
      <div className={styles.askPanel}>
        <div className={styles.search}>
          <span aria-hidden="true">⌘K</span>
          Qu’est-ce que je sais déjà sur le sponsoring local ?
        </div>
        <div className={styles.scopes}>
          <span>Chercher dans</span>
          {["Bibliothèque", "Mémoire", "Cours"].map((s) => <span key={s} className={styles.scope}>☑ {s}</span>)}
        </div>
        <div className={styles.answer}>
          <p>
            Tes lectures distinguent la visibilité achetée de la relation durable avec le partenaire <span className={styles.ref}>O2, p. 53</span>.
            Ton chapitre 1.1 l’applique déjà aux petits clubs <span className={cn(styles.ref, styles.refDoc)}>M1</span>, et le CM4
            insiste sur la différence avec le mécénat <span className={cn(styles.ref, styles.refDoc)}>C3</span>.
          </p>
          <p className={styles.outside}>(hors documents) Aucune de tes sources ne chiffre le retour pour un sponsor local.</p>
        </div>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------- timeline */

const SLIDES = 14
// Slide boundaries in minutes over a 90-minute lecture, uneven like a real one.
const CUTS = [0, 4, 9, 17, 22, 27, 35, 41, 48, 53, 61, 68, 76, 83, 90]
const FLAGS: { at: number; slide: number; mine: boolean; text: string }[] = [
  { at: 19, slide: 4, mine: true, text: "Flagged by me (⌥M) while the lecturer explained the slide." },
  { at: 44, slide: 8, mine: false, text: "Detected in the transcript: “this will come up in the exam”." },
  { at: 64, slide: 11, mine: false, text: "Detected in the transcript: “remember the difference between sponsorship and patronage”." },
  { at: 79, slide: 13, mine: true, text: "Flagged by me (⌥M) during the case study." },
]
// A fixed pseudo-waveform: same bars on every render.
const WAVE = Array.from({ length: 120 }, (_, i) => 0.25 + 0.75 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.31)))

export function LectureTimeline() {
  const [slide, setSlide] = useState(11)
  const flags = FLAGS.filter((f) => f.slide === slide)
  const from = CUTS[slide - 1]
  const to = CUTS[slide]

  return (
    <div className={styles.timeline}>
      <div className={styles.tlTrack}>
        <div className={styles.wave} aria-hidden="true">
          {WAVE.map((h, i) => <i key={i} style={{ height: `${Math.round(h * 100)}%` }} />)}
        </div>
        <div className={styles.segments} role="group" aria-label="Slides of a 90-minute lecture">
          {Array.from({ length: SLIDES }, (_, i) => {
            const n = i + 1
            return (
              <button
                key={n}
                type="button"
                className={cn(styles.segment, n === slide && styles.segmentOn)}
                style={{ flexGrow: CUTS[n] - CUTS[i] }}
                onClick={() => setSlide(n)}
                aria-pressed={n === slide}
                aria-label={`Slide ${n}, minute ${CUTS[i]} to ${CUTS[n]}`}
              >
                {n}
              </button>
            )
          })}
        </div>
        {FLAGS.map((f) => (
          <span key={f.at} className={cn(styles.flag, f.mine ? styles.flagMine : styles.flagAuto)} style={{ left: `${(f.at / 90) * 100}%` }} aria-hidden="true">⚑</span>
        ))}
        <div className={styles.tlScale} aria-hidden="true"><span>0:00</span><span>0:45</span><span>1:30</span></div>
      </div>

      <div className={styles.tlBelow}>
        <div className={styles.tlDetail}>
          <span className={styles.railHead}>Slide {slide} · {from}–{to} min</span>
          {flags.length > 0 ? (
            flags.map((f) => <p key={f.at} className={styles.tlFlag}><em className={f.mine ? styles.flagMine : styles.flagAuto}>⚑</em>{f.text}</p>)
          ) : (
            <p className={styles.tlQuiet}>No flag on this slide: its sentences go into the course as usual.</p>
          )}
          <p className={styles.tlOut}>
            In the written course, this part ends with <span className={styles.slideLink}>[diapo {slide}] ▶</span>: one click opens the slide, ▶ replays what was said while it was on screen.
          </p>
        </div>
        <ol className={styles.tlSteps}>
          <li><b>01</b>Audio saved every 5 s: nothing lost if the app closes</li>
          <li><b>02</b>whisper.cpp transcribes on the Mac, primed with the slide titles</li>
          <li><b>03</b>Each sentence is pinned to the slide on screen at that moment</li>
          <li><b>04</b>The copilot writes the course: slides + what was said, marked “(oral)”</li>
          <li><b>05</b>Revision sheet and flashcards, spaced 1 → 120 days</li>
        </ol>
      </div>
      <ul className={styles.legend}>
        <li><span className={styles.lgMine} aria-hidden="true" />Flagged by me</li>
        <li><span className={styles.lgAuto} aria-hidden="true" />Detected (“remember…”, “exam”)</li>
        <li>Click a slide to see what the app kept</li>
      </ul>
    </div>
  )
}
