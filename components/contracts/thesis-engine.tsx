"use client"

import { useEffect, useRef, useState } from "react"
import { useInView } from "framer-motion"
import { cn } from "@/lib/utils"
import { Reveal, Stagger } from "@/components/fx/reveal"
import { Counter } from "@/components/fx/counter"
import { useReducedMotion } from "@/hooks/use-media"
import { Logo, LOGOS, type LogoId } from "@/components/contracts/thesis-logos"
import { ThesisMap } from "@/components/contracts/thesis-map"
import { ThesisCanvas } from "@/components/contracts/thesis-canvas"
import { thesisSerif } from "@/components/contracts/thesis-font"
import styles from "./thesis-engine.module.css"

/* ------------------------------------------------------------------
   THESIS ENGINE — the case file. Its own identity: a night lab where
   the machine talks in mono and the thesis talks in serif.
   ------------------------------------------------------------------ */

const MARQUEE: (LogoId | string)[] = ["scholar", "openalex", "cairn", "LoRA", "qwen", "ollama", "RAG", "claude", "obsidian"]

export function ThesisEngineCase() {
  return (
    <div className={cn(styles.root, thesisSerif.variable)}>
      <ToolMarquee />
      <Readout />
      <Question />
      <LabSection
        n="02"
        kicker="The engine"
        title={<>A research assistant <em>that never sleeps.</em></>}
        intro="Every dot below is one candidate source. Follow it through the scan, the local model and the vault, or send your own source through the pipeline."
      >
        <ThesisMap />
      </LabSection>
      <Sieve />
      <TwoMinds />
      <LabSection
        n="05"
        kicker="Inside the vault"
        title={<>Where it all <em>lands.</em></>}
        intro="The vault is organised around the concepts of the research question. Kept sources arrive as summarised notes, complex ones as deeper analyses, and the bibliography follows on its own."
      >
        <ThesisCanvas />
      </LabSection>
      <Toolchain />
      <Closing />
    </div>
  )
}

function LabSection({ n, kicker, title, intro, children, className }: { n: string; kicker: string; title: React.ReactNode; intro?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn(styles.section, className)}>
      <Reveal>
        <div className={styles.secRule}>
          <span className={styles.secN}>§ {n}</span>
          <span className={styles.secLine} />
          <span className={styles.secKicker}>{kicker}</span>
        </div>
        <div className={styles.secHead}>
          <h2 className={styles.secTitle}>{title}</h2>
          {intro && <p className={styles.secIntro}>{intro}</p>}
        </div>
      </Reveal>
      <div className={styles.secBody}>{children}</div>
    </section>
  )
}

function ToolMarquee() {
  const row = (hidden?: boolean) => (
    <div className={styles.marqueeRow} aria-hidden={hidden ? true : undefined}>
      {MARQUEE.map((item, i) => (
        <span key={i} className={styles.marqueeItem}>
          {item in LOGOS ? (
            <>
              <Logo id={item as LogoId} tone="mono" className={styles.marqueeLogo} />
              {LOGOS[item as LogoId].name}
            </>
          ) : (
            <span className={styles.marqueeWord}>{item}</span>
          )}
          <span className={styles.marqueeSep} aria-hidden="true">✦</span>
        </span>
      ))}
    </div>
  )
  return (
    <div className={styles.marquee}>
      <div className={styles.marqueeTrack}>
        {row()}
        {row(true)}
      </div>
    </div>
  )
}

function Readout() {
  return (
    <div className={styles.readout}>
      <Stagger className={styles.readoutGrid} stagger={0.06}>
        <div className={styles.readCell}>
          <span className={styles.readValue}><Counter to={90} /></span>
          <span className={styles.readLabel}>Candidate sources a day</span>
        </div>
        <div className={styles.readCell}>
          <span className={styles.readValue}>×3</span>
          <span className={styles.readLabel}>Scans a day</span>
        </div>
        <div className={styles.readCell}>
          <span className={styles.readValue}>~<Counter to={5} suffix="%" /></span>
          <span className={styles.readLabel}>Kept after triage</span>
        </div>
        <div className={styles.readCell}>
          <span className={styles.readValue}>≈ €0</span>
          <span className={styles.readLabel}>A month · local, plus cents of Sonnet</span>
        </div>
        <div className={styles.readCell}>
          <span className={cn(styles.readValue, styles.readLive)}>24/7</span>
          <span className={styles.readLabel}>Running on my machine</span>
        </div>
      </Stagger>
    </div>
  )
}

/* ---------------------------------------------------------------- §01 */

const MARKS = ["generative AI", "no-code tools", "professionalisation", "organisational efficiency", "limited human and financial resources"]

function Question() {
  const ref = useRef<HTMLQuoteElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const text = "To what extent are generative AI and no-code tools levers of professionalisation and organisational efficiency for a sports association with limited human and financial resources?"
  // Split the question around its five concepts so each one can be highlighted in turn.
  const parts: React.ReactNode[] = []
  let rest = text
  MARKS.forEach((m, i) => {
    const at = rest.indexOf(m)
    parts.push(rest.slice(0, at))
    parts.push(<mark key={m} className={styles.qMark} style={{ transitionDelay: `${0.35 + i * 0.28}s` }}>{m}</mark>)
    rest = rest.slice(at + m.length)
  })
  parts.push(rest)

  return (
    <LabSection n="01" kicker="The research question" title={<>A young field, <em>watched every day.</em></>}>
      <figure className={styles.question}>
        <blockquote ref={ref} className={cn(styles.qText, inView && styles.qLit)}>“{parts}”</blockquote>
        <figcaption className={styles.qCaption}>
          <span>M2 International Sport Administration · thesis question, translated</span>
          <span lang="fr" className={styles.qOriginal}>Dans quelle mesure l’IA générative et les outils no-code constituent-ils des leviers de professionnalisation et d’efficacité organisationnelle pour une association sportive disposant de ressources humaines et financières limitées ?</span>
        </figcaption>
      </figure>

      <Stagger className={styles.margins} stagger={0.08}>
        {[
          ["i", "A young topic", "Research on generative AI and no-code tools in amateur sport is only starting. The few relevant sources have to be caught as soon as they appear."],
          ["ii", "Three databases", "Google Scholar, OpenAlex and Cairn cover international and French-language research. Checking them by hand every day would eat the time meant for writing."],
          ["iii", "The same constraint", "One person and close to zero budget: the engine runs under the very constraints the thesis studies."],
        ].map(([n, title, body]) => (
          <div key={n} className={styles.marginNote}>
            <span className={styles.marginN}>{n}.</span>
            <h3 className={styles.marginTitle}>{title}</h3>
            <p className={styles.marginBody}>{body}</p>
          </div>
        ))}
      </Stagger>
    </LabSection>
  )
}

/* ---------------------------------------------------------------- §03 */

// Five of ninety, spread over the three passes (~5%).
const KEPT = new Set([6, 21, 44, 63, 81])

function Sieve() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.35 })
  const reduced = useReducedMotion()
  const [phase, setPhase] = useState<"idle" | "scan" | "sort">("idle")
  const [run, setRun] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduced) {
      setPhase("sort")
      return
    }
    setPhase("idle")
    const a = window.setTimeout(() => setPhase("scan"), 60)
    const b = window.setTimeout(() => setPhase("sort"), 2300)
    return () => {
      window.clearTimeout(a)
      window.clearTimeout(b)
    }
  }, [inView, reduced, run])

  return (
    <LabSection
      n="03"
      kicker="The sieve"
      title={<>Ninety in, <em>a handful out.</em></>}
      intro="One simulated day at the real rates. Each square is a candidate: the three rows are the three daily scans, then the local model keeps what serves the question."
    >
      <div ref={ref} className={styles.sieve}>
        <div className={cn(styles.sieveGrid, phase === "scan" && styles.sieveScan, phase === "sort" && styles.sieveSort)} role="img" aria-label="Of 90 candidate sources scanned in a day, 5 are kept (about 5%) and 85 are dropped.">
          {[0, 1, 2].map((pass) => (
            <div key={pass} className={styles.passBlock}>
              <span className={styles.passLabel}>Scan {pass + 1}</span>
              <div className={styles.passCells}>
                {Array.from({ length: 30 }, (_, j) => {
                  const i = pass * 30 + j
                  const kept = KEPT.has(i)
                  return (
                    <span
                      key={i}
                      className={cn(styles.cell, kept && styles.cellKept)}
                      style={{ ["--i" as string]: i }}
                      data-tip={`Scan ${pass + 1} · #${j + 1} · ${kept ? "kept → note + bibliography" : "dropped at triage"}`}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.sieveSide}>
          <div className={styles.sieveStat}>
            <span className={styles.sieveNum}>90</span>
            <span className={styles.readLabel}>Scanned</span>
          </div>
          <div className={cn(styles.sieveStat, styles.sieveStatKept)}>
            <span className={styles.sieveNum}>5</span>
            <span className={styles.readLabel}>Kept · ~5%</span>
          </div>
          <div className={styles.sieveStat}>
            <span className={cn(styles.sieveNum, styles.sieveNumDim)}>85</span>
            <span className={styles.readLabel}>Dropped</span>
          </div>
          <ul className={styles.legend}>
            <li><span className={styles.lgKeep} aria-hidden="true" />Kept → vault</li>
            <li><span className={styles.lgDrop} aria-hidden="true" />Dropped at triage</li>
          </ul>
          <button type="button" className={styles.ctrlBtn} onClick={() => setRun((r) => r + 1)} disabled={phase !== "sort"}>
            <span aria-hidden="true">↻</span> Replay the day
          </button>
        </div>
      </div>
    </LabSection>
  )
}

/* ---------------------------------------------------------------- §04 */

const THRESHOLD = 66

function TwoMinds() {
  const [level, setLevel] = useState(28)
  const escalated = level >= THRESHOLD

  return (
    <LabSection
      n="04"
      kicker="Two models, one rule"
      title={<>Small model on duty, <em>big model on call.</em></>}
      intro="The local model does the daily work for free. Claude only steps in when an analysis needs more depth, which keeps the bill at a few cents a month."
    >
      <div className={styles.minds}>
        <div className={cn(styles.mind, styles.mindLocal, !escalated && styles.mindOn)}>
          <div className={styles.mindTop}>
            <span className={styles.mindKicker}>On duty · local</span>
            <span className={styles.mindLogos}>
              <Logo id="qwen" tone="brand" className={styles.mindLogo} />
              <Logo id="ollama" tone="mono" className={styles.mindLogo} />
            </span>
          </div>
          <h3 className={styles.mindName}>Qwen3 4B</h3>
          <ul className={styles.mindList}>
            <li>Fine-tuned with LoRA</li>
            <li>Grounded with RAG on reference documents</li>
            <li>Served by Ollama on my machine, 24/7</li>
            <li>Reads every candidate, sorts, selects and summarises</li>
          </ul>
          <div className={styles.mindCost}><b>€0</b> a month</div>
        </div>

        <div className={styles.router}>
          <span className={styles.routerLabel}>Complexity of the analysis</span>
          <div className={styles.routerTrack}>
            <span className={styles.routerThreshold} style={{ left: `${THRESHOLD}%` }}><i>escalate</i></span>
            <input
              type="range"
              min={0}
              max={100}
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              className={styles.routerInput}
              aria-label="Complexity of the analysis"
              aria-valuetext={escalated ? "Complex: escalated to Claude Sonnet 5.5" : "Routine: stays on the local model"}
            />
          </div>
          <div className={styles.routerEnds}><span>Routine</span><span>Complex</span></div>
          <p className={cn(styles.routerOut, escalated && styles.routerOutEsc)} aria-live="polite">
            {escalated ? "→ Escalated to Claude Sonnet 5.5" : "→ Stays local on Qwen3 4B"}
          </p>
          <p className={styles.routerNote}>Drag to see the routing rule. Illustration.</p>
        </div>

        <div className={cn(styles.mind, styles.mindCall, escalated && styles.mindOn)}>
          <div className={styles.mindTop}>
            <span className={styles.mindKicker}>On call · escalation</span>
            <span className={styles.mindLogos}>
              <Logo id="claude" tone="brand" className={styles.mindLogo} />
            </span>
          </div>
          <h3 className={styles.mindName}>Claude Sonnet 5.5</h3>
          <ul className={styles.mindList}>
            <li>Called only when the analysis is complex</li>
            <li>Deeper explanations of a source or a debate</li>
            <li>Visuals for the vault</li>
          </ul>
          <div className={styles.mindCost}><b>A few cents</b> a month</div>
        </div>
      </div>
    </LabSection>
  )
}

/* ---------------------------------------------------------------- §06 */

const TOOLS: { id?: LogoId; word?: string; name: string; role: string }[] = [
  { id: "scholar", name: "Google Scholar", role: "Source · academic index" },
  { id: "openalex", name: "OpenAlex", role: "Source · open catalogue" },
  { id: "cairn", name: "Cairn.info", role: "Source · French journals" },
  { id: "ollama", name: "Ollama", role: "Local runtime" },
  { id: "qwen", name: "Qwen3 4B", role: "Local model · triage & summaries" },
  { word: "LoRA", name: "LoRA", role: "Fine-tuning of the 4B" },
  { word: "RAG", name: "RAG", role: "Grounding on reference documents" },
  { id: "claude", name: "Claude Sonnet 5.5", role: "Escalation · depth & visuals" },
  { id: "obsidian", name: "Obsidian", role: "Vault · notes, Canvas, bibliography" },
]

function Toolchain() {
  return (
    <LabSection n="06" kicker="Toolchain" title={<>Nine pieces, <em>one routine.</em></>}>
      <Stagger className={styles.tools} stagger={0.05}>
        {TOOLS.map((t) => (
          <div key={t.name} className={cn(styles.tool, styles.dots)} style={{ ["--brand" as string]: t.id ? LOGOS[t.id].color : "#9d6bff" }}>
            <div className={styles.toolMark}>
              {t.id ? (
                <>
                  <Logo id={t.id} tone="mono" className={cn(styles.toolLogo, styles.toolMono)} />
                  <Logo id={t.id} tone="brand" className={cn(styles.toolLogo, styles.toolBrand)} />
                </>
              ) : (
                <span className={styles.toolWord}>{t.word}</span>
              )}
            </div>
            <div className={styles.toolName}>{t.name}</div>
            <div className={styles.toolRole}>{t.role}</div>
          </div>
        ))}
      </Stagger>
    </LabSection>
  )
}

/* ---------------------------------------------------------------- §07 */

function Closing() {
  return (
    <LabSection n="07" kicker="Why it matters" title={<>The engine is its own <em>field test.</em></>}>
      <Reveal className={styles.closing}>
        <p className={styles.closingQuote}>
          One person, almost no budget, and a research routine that scans, sorts, summarises and files every day.
          <em> A small-scale test of the thesis question: what generative AI can do when time and money are scarce.</em>
        </p>
        <dl className={styles.facts}>
          <div><dt>Status</dt><dd><span className={styles.liveDot} aria-hidden="true" />Running since October 2026</dd></div>
          <div><dt>Origin</dt><dd>Adapted from my own AI-news watch pipeline</dd></div>
          <div><dt>Cost</dt><dd>≈ €0 a month locally, a few cents of Sonnet</dd></div>
          <div><dt>Code</dt><dd>Private repository while the thesis is in progress</dd></div>
        </dl>
      </Reveal>
    </LabSection>
  )
}
