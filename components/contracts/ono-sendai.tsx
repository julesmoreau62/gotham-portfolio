"use client"

import { cn } from "@/lib/utils"
import { Reveal, Stagger } from "@/components/fx/reveal"
import { Counter } from "@/components/fx/counter"
import { Logo, LOGOS, type LogoId } from "@/components/contracts/thesis-logos"
import { ThesisMap } from "@/components/contracts/thesis-map"
import { onoFonts } from "@/components/contracts/thesis-font"
import { OnoApp, LectureTimeline } from "@/components/contracts/ono-app"
import { PROFILE } from "@/lib/profile"
import styles from "./thesis-engine.module.css"
import ono from "./ono-sendai.module.css"

/* ------------------------------------------------------------------
   ONO-SENDAI — the case file. A desktop app for the whole master's
   year: thesis, library, lectures and one question across all three,
   fed every day by the Thesis Engine. Same night lab as before: the
   machine talks in mono, the thesis talks in serif.
   ------------------------------------------------------------------ */

const MARQUEE: (LogoId | string)[] = ["Electron", "OpenCode", "whisper.cpp", "bge-m3", "pdf.js", "APA 7", "obsidian", "Zotero", "qwen", "deepseek"]

export function OnoSendaiCase() {
  return (
    <div className={cn(styles.root, onoFonts)}>
      <ToolMarquee />
      <Readout />
      <Offer />
      <Problem />
      <LabSection
        n="02"
        kicker="The app"
        title={<>One app, <em>four spaces.</em></>}
        intro="Thesis, library, lectures, and one question across all of them. Switch spaces below the way I do in the app, with the tabs or the arrow keys."
      >
        <OnoApp />
      </LabSection>
      <LabSection
        n="03"
        kicker="Lecture capture"
        title={<>Nothing said in class <em>gets lost.</em></>}
        intro="I record the lecture while the slides play. Every slide change is timed, and I flag the moments the lecturer insists on. After class, the transcript lines up with the slides and becomes a written course."
      >
        <LectureTimeline />
      </LabSection>
      <Meaning />
      <Principles />
      <LabSection
        n="06"
        kicker="The feeder · Thesis Engine"
        title={<>New sources, <em>every morning.</em></>}
        intro="The library does not fill itself. A second tool, the Thesis Engine, scans three research databases three times a day with a small local model, and files what matters into the vault the app reads."
      >
        <EngineStats />
        <ThesisMap />
      </LabSection>
      <Toolchain />
      <Closing />
    </div>
  )
}

function LabSection({ n, kicker, title, intro, children }: { n: string; kicker: string; title: React.ReactNode; intro?: string; children: React.ReactNode }) {
  return (
    <section className={styles.section}>
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
          <span className={styles.readValue}><Counter to={4} /></span>
          <span className={styles.readLabel}>Spaces in one app</span>
        </div>
        <div className={styles.readCell}>
          <span className={styles.readValue}><Counter to={31} /></span>
          <span className={styles.readLabel}>Books & reports searchable to the page</span>
        </div>
        <div className={styles.readCell}>
          <span className={styles.readValue}>FR<span className={ono.readArrow}>→</span>EN</span>
          <span className={styles.readLabel}>Ask in French, find English passages</span>
        </div>
        <div className={styles.readCell}>
          <span className={styles.readValue}>~<Counter to={11} suffix="k" /></span>
          <span className={styles.readLabel}>Lines of code, with tests</span>
        </div>
        <div className={styles.readCell}>
          <span className={cn(styles.readValue, styles.readLive)}>≈ €0</span>
          <span className={styles.readLabel}>Transcription & search run on my Mac</span>
        </div>
      </Stagger>
    </div>
  )
}

/* ---------------------------------------------------------- offer */

const SECTORS = ["Clubs", "Federations", "Events", "Agencies", "Associations", "Your team"]

/** Tells a recruiter the app is not thesis-only: the same workspace can hold a team's own knowledge. */
function Offer() {
  const subject = encodeURIComponent("Ono-Sendai for our team")
  return (
    <aside className={styles.offer} aria-labelledby="ono-offer-title">
      <Reveal className={styles.offerGrid}>
        <div className={styles.offerTags}>
          <span className={styles.offerSoon}><i aria-hidden="true" />Built for a thesis</span>
          <span className={styles.offerAny}>Adaptable to any team</span>
        </div>
        <div className={styles.offerBody}>
          <h2 id="ono-offer-title" className={styles.offerTitle}>Your documents, <em>one question away.</em></h2>
          <p className={styles.offerText}>
            The same workspace can hold a team’s own knowledge: reports, partner contracts, meeting recordings, guidelines.
            Ask a question, get the answer with the page it comes from. I can set it up inside your organisation.
          </p>
          <ul className={styles.offerSectors} aria-label="Example teams">
            {SECTORS.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </div>
        <a href={`mailto:${PROFILE.email}?subject=${subject}`} className={styles.offerCta} data-cursor="mail">
          <span>Set it up with your team</span>
          <span className={styles.offerArrow} aria-hidden="true">↗</span>
        </a>
      </Reveal>
    </aside>
  )
}

/* ---------------------------------------------------------------- §01 */

const SCATTERED = ["Word", "Zotero", "PDF reader", "Notes app", "Voice memos", "Flashcards", "Drive", "Chat AI"]

function Problem() {
  return (
    <LabSection
      n="01"
      kicker="The problem"
      title={<>Scattered tools, <em>none knew the whole year.</em></>}
      intro="A master’s year is one long piece of work: lectures feed the reading, the reading feeds the thesis. My tools each held one slice, and none of them could answer a question across the rest."
    >
      <Reveal className={ono.before}>
        <div className={ono.scattered} aria-label="Before: separate tools">
          {SCATTERED.map((tool, i) => (
            <span key={tool} className={ono.chip} style={{ ["--r" as string]: `${((i * 37) % 9) - 4}deg` }}>{tool}</span>
          ))}
        </div>
        <span className={ono.beforeArrow} aria-hidden="true">→</span>
        <div className={ono.unified}>
          <span className={ono.unifiedName}>Ono-Sendai</span>
          <span className={ono.unifiedSub}>Thesis · Library · Lectures · Ask</span>
        </div>
      </Reveal>

      <Stagger className={styles.margins} stagger={0.08}>
        {[
          ["i", "Two languages", "Most sport-management research is in English, my thesis is in French. Keyword search misses half of what I own."],
          ["ii", "Citations by hand", "APA 7 in its French form, page numbers, a reference list that matches the text: hours of checking at the end of every chapter."],
          ["iii", "The same constraint", "My thesis studies what generative AI can do with one person and almost no budget. The app is built and run under exactly that constraint."],
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

/* ---------------------------------------------------------------- §04 */

const MODELS = [
  { name: "multilingual-e5-small", size: "135 MB", verdict: "Mostly off-topic French passages", kept: false },
  { name: "multilingual-e5-base", size: "280 MB", verdict: "Mostly off-topic French passages", kept: false },
  { name: "bge-m3", size: "570 MB", verdict: "The English passages that actually discuss sponsorship", kept: true },
]

/** The embedding test that decided the library's search model. */
function Meaning() {
  return (
    <LabSection
      n="04"
      kicker="Search by meaning"
      title={<>“Parrainage” <em>finds sponsorship.</em></>}
      intro="Before picking the model behind semantic search, I tested three on my own sport-management books with short French questions. Only one connected them to the English passages that answer them."
    >
      <div className={ono.query}>
        <span className={ono.queryLabel}>Test question</span>
        <span className={ono.queryText}>“parrainage sportif”</span>
      </div>
      <Stagger className={ono.models} stagger={0.08}>
        {MODELS.map((m) => (
          <div key={m.name} className={cn(ono.model, m.kept && ono.modelKept)}>
            <div className={ono.modelTop}>
              <span className={ono.modelName}>{m.name}</span>
              <span className={ono.modelSize}>{m.size}</span>
            </div>
            <p className={ono.modelVerdict}>{m.verdict}</p>
            <span className={ono.modelTag}>{m.kept ? "✓ Chosen · runs locally" : "Dropped"}</span>
          </div>
        ))}
      </Stagger>
      <p className={styles.simNote}>
        Search combines both methods: keywords (accents, case and plurals ignored) and meaning. Results found by meaning alone are tagged as such.
        The model runs on my Mac with onnxruntime: indexing the whole library takes about an hour once, then two to three minutes per new book.
      </p>
    </LabSection>
  )
}

/* ---------------------------------------------------------------- §05 */

function Principles() {
  return (
    <LabSection n="05" kicker="Design choices" title={<>Useful, <em>and still mine.</em></>}>
      <Stagger className={ono.principles} stagger={0.08}>
        {[
          ["Grounded", "The copilot reads and never edits. Every answer is built on passages from my own documents, points to the exact page, and marks anything that is not in them."],
          ["Plain files", "Chapters, notes and sources are ordinary Markdown and CSL-JSON in my own folders. Obsidian, Zotero and git open them as they are."],
          ["Local first", "Transcription and semantic search run on my Mac. Lecture audio never leaves it; only the few passages a question needs are sent to the model."],
          ["Never lost", "An hourly versioned backup in a separate history, an optional copy to iCloud or a disk, and a bin instead of deletion."],
        ].map(([title, body]) => (
          <div key={title} className={ono.principle}>
            <span className={ono.principleTitle}>{title}</span>
            <p>{body}</p>
          </div>
        ))}
      </Stagger>
    </LabSection>
  )
}

/* ---------------------------------------------------------------- §06 */

function EngineStats() {
  return (
    <Stagger className={ono.engineStats} stagger={0.06}>
      {[
        ["90", "Candidate sources a day"],
        ["×3", "Scans: Scholar, OpenAlex, Cairn"],
        ["~5%", "Kept by a local Qwen3 4B"],
        ["≈ €0", "A month, a few cents of DeepSeek"],
      ].map(([value, label]) => (
        <div key={label} className={ono.engineStat}>
          <span className={ono.engineValue}>{value}</span>
          <span className={styles.readLabel}>{label}</span>
        </div>
      ))}
    </Stagger>
  )
}

/* ---------------------------------------------------------------- §07 */

const TOOLS: { id?: LogoId; word?: string; name: string; role: string }[] = [
  { word: "El", name: "Electron", role: "macOS app shell" },
  { word: "oc", name: "OpenCode", role: "AI agents & model routing" },
  { word: "wh", name: "whisper.cpp", role: "Local lecture transcription" },
  { word: "m3", name: "bge-m3", role: "Local search by meaning" },
  { word: "pdf", name: "pdf.js", role: "Reading slides & books" },
  { id: "obsidian", name: "Obsidian", role: "Same folders, opened as a vault" },
  { id: "qwen", name: "Qwen3 4B", role: "Thesis Engine · local triage" },
  { id: "ollama", name: "Ollama", role: "Thesis Engine · local runtime" },
  { id: "deepseek", name: "DeepSeek V4-Pro", role: "Depth when a question needs it" },
]

function Toolchain() {
  return (
    <LabSection n="07" kicker="Toolchain" title={<>Nine pieces, <em>one desk.</em></>}>
      <Stagger className={styles.tools} stagger={0.05}>
        {TOOLS.map((t) => (
          <div key={t.name} className={cn(styles.tool, styles.dots)} style={{ ["--brand" as string]: t.id ? LOGOS[t.id].color : "#9cc8e6" }}>
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

/* ---------------------------------------------------------------- §08 */

function Closing() {
  return (
    <LabSection n="08" kicker="Why it matters" title={<>The thesis, <em>tested on myself.</em></>}>
      <Reveal className={styles.closing}>
        <p className={styles.closingQuote}>
          One person, almost no budget, and a workspace that reads, searches, transcribes and cites.
          <em> A working answer to the thesis question: what generative AI can do when time and money are scarce.</em>
        </p>
        <dl className={styles.facts}>
          <div><dt>Status</dt><dd><span className={styles.liveDot} aria-hidden="true" />In daily use for my M2</dd></div>
          <div><dt>Built with</dt><dd>Claude Code, no formal coding background</dd></div>
          <div><dt>Platform</dt><dd>macOS app (Apple Silicon), or a local web page</dd></div>
          <div><dt>Fed by</dt><dd>Thesis Engine, running 24/7 since October 2026</dd></div>
          <div><dt>Code</dt><dd>Private repository while the thesis is in progress</dd></div>
        </dl>
      </Reveal>
    </LabSection>
  )
}
