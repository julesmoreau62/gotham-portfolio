"use client"

import { useEffect, useRef, type CSSProperties } from "react"
import { onoFonts } from "@/components/contracts/thesis-font"
import { CUE } from "@/lib/dossier"
import { clamp, decode, easeIn, easeInOut, easeOut, hash, pad, ramp, typed } from "./timing"
import styles from "./scene-ono.module.css"

/* OPERATION ONO-SENDAI (SEG08.5) — the one chapter that leaves the
   surveillance terminal. The file opens a hole in the board and falls
   into the app's own world, taken from its landing page: the NASA
   black hole on pure black, ice-blue light, Martian Mono with an
   accretion-disc glow, a blueprint grid rising from below.

   It tells the case in order: the eight scattered tools the hole
   swallows, the four spaces orbiting it (each explained in plain words
   on the left while its card swings to the front), the Thesis Engine
   feeding it in a stream of light, why it answers the thesis. On "his
   answer" the app's logo takes the whole screen; then the picture
   glitches in the dossier's red and acid and tears away onto the next
   mission. */

const { ono } = CUE

/** The landing's black hole; the film warms the cache with it during the sound check. */
export const ONO_VIDEO = "/assets/ono-sendai/blackhole.webm"
/** The app's logo: the lambda and the name, white on transparent. */
const ONO_LOGO = "/assets/ono-sendai/logo.svg"

/** The cues that are whole spoken lines, as opposed to moments inside one. */
type Key = { [K in keyof typeof ono]: (typeof ono)[K] extends number ? never : K }[keyof typeof ono]
type At = (k: Key) => number
const SPACES = ["thesis", "library", "lectures", "ask"] as const
type Space = (typeof SPACES)[number]

/** The landing's black hole, held on the film's clock: it plays while the film plays and stops when it pauses. */
function Hole({ t, start, on, push }: { t: number; start: number; on: number; push: number }) {
  const video = useRef<HTMLVideoElement>(null)
  const now = useRef(t - start)
  now.current = t - start
  // Seek to the film's time; also run once the file loads, so a seek before then still lands.
  const seek = () => {
    const v = video.current
    if (!v || !v.duration) return
    const target = now.current % v.duration
    if (Math.abs(v.currentTime - target) > 0.3) v.currentTime = Math.max(0, target)
  }
  useEffect(() => {
    const v = video.current
    if (!v) return
    seek()
    if (v.paused && v.duration) v.play().catch(() => {})
    const stop = setTimeout(() => v.pause(), 150)
    return () => clearTimeout(stop)
  }, [t, start])
  return (
    <div className={styles.hole}>
      {/* Kept in lite quality too: one video costs less than the film's canvases, and it is the chapter. */}
      <video ref={video} className={styles.video} style={{ opacity: on, transform: `scale(${(1.25 - 0.17 * on) * (1 + 0.25 * push)})` }} muted playsInline preload="auto" aria-hidden="true" tabIndex={-1} onLoadedMetadata={seek}>
        <source src={ONO_VIDEO} type="video/webm" />
      </video>
      <div className={styles.vignette} />
      {/* Under the logo, the hole steps back into the dark. */}
      {push > 0 && <div className={styles.dark} style={{ opacity: push * 0.55 }} />}
    </div>
  )
}

/** Light falling in: streaks on log spirals toward the horizon, in a flattened disc like the video's. */
function Infall({ t, from, to, count = 90, speed = 0.55 }: { t: number; from: number; to: number; count?: number; speed?: number }) {
  const amount = Math.min(ramp(t, from, from + 0.4), 1 - ramp(t, to - 0.4, to))
  if (amount <= 0) return null
  const point = (a: number, r: number) => [800 + Math.cos(a) * r, 430 + Math.sin(a) * r * 0.42] as const
  return (
    <svg className={styles.infall} viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" style={{ opacity: amount }}>
      {Array.from({ length: count }, (_, i) => {
        const phase = ((t - from) * speed * (0.7 + hash(i + 3) * 0.6) + hash(i)) % 1
        const r0 = 520 + hash(i + 1) * 520
        const a0 = hash(i + 2) * Math.PI * 2
        const r = (k: number) => 70 + r0 * Math.pow(1 - k, 1.6)
        const head = point(a0 + phase * 2.6, r(phase))
        const tail = point(a0 + Math.max(0, phase - 0.07) * 2.6, r(Math.max(0, phase - 0.07)))
        // Warm near the horizon, ice-blue far out, as on the disc.
        const warm = phase > 0.75
        return <line key={i} x1={tail[0]} y1={tail[1]} x2={head[0]} y2={head[1]} className={warm ? styles.streakWarm : styles.streak} opacity={Math.sin(phase * Math.PI)} />
      })}
    </svg>
  )
}

/** The name as on the landing hero: condensed Martian Mono, warm glow, tracking collapsing onto it. */
function Title({ t, at, dock }: { t: number; at: At; dock: number }) {
  const p = ramp(t, at("codename") + 0.55, at("codename") + 1.5)
  if (t < at("codename") + 0.5) return null
  const track = 1.4 - 1.34 * easeOut(p)
  return (
    <div className={styles.titleWrap} style={{
      opacity: 1 - ramp(t, at("answer") - 0.3, at("answer")),
      left: `${50 - 45 * dock}%`, top: `${46 - 37 * dock}%`,
      transform: `translate(${-50 * (1 - dock)}%, -50%) scale(${1 - 0.6 * dock})`,
      transformOrigin: dock ? "0 50%" : "50% 50%",
    }}>
      <p className={styles.kicker} style={{ opacity: ramp(t, at("codename"), at("codename") + 0.3) }}>
        {decode("EXHIBIT K · CODENAME", ramp(t, at("codename"), at("codename") + 0.5), t)}
      </p>
      <h3 className={styles.title} style={{ letterSpacing: `${track}em`, opacity: easeOut(p) }}>
        {decode("ONO-SENDAI", ramp(t, at("codename") + 0.55, at("codename") + 1.3), t)}
      </h3>
    </div>
  )
}

/** The line under the docked name: what it is, once the voice says he built it. */
function Role({ t, at }: { t: number; at: At }) {
  const from = at("built")
  if (t < from) return null
  const away = ramp(t, at("why") - 0.3, at("why") + 0.2)
  return (
    <div className={styles.role} style={{ opacity: 1 - away }}>
      <p>{typed("His own app for the whole master’s year.", ramp(t, from, from + 1.4))}</p>
      <i className={styles.horizon} style={{ transform: `scaleX(${easeInOut(ramp(t, from + 0.6, from + 1.6))})` }} />
      <span>{decode("ONE WORKSPACE · FOUR SPACES · MACOS APP", ramp(t, from + 1.6, from + 2.4), t)}</span>
    </div>
  )
}

const SCATTERED = ["Word", "Zotero", "PDF reader", "Notes app", "Voice memos", "Flashcards", "Drive", "Chat AI"]

/** The problem: eight tools adrift around the hole, struck out one by one, then swallowed. */
function Scattered({ t, at }: { t: number; at: At }) {
  const from = at("problem")
  const swallow = easeIn(ramp(t, at("built") - 0.2, at("built") + 1))
  if (t < from || swallow >= 1) return null
  return (
    <div className={styles.scattered}>
      <div className={styles.problemHead} style={{ opacity: 1 - swallow }}>
        <span className={styles.kicker}>{decode("THE PROBLEM", ramp(t, from, from + 0.3), t)}</span>
        <b>{typed("One year of work, eight tools.", ramp(t, from + 0.3, from + 1.6))}</b>
        {t >= at("none") && <em>{decode("NONE OF THEM SEES THE WHOLE YEAR", ramp(t, at("none"), at("none") + 0.6), t)}</em>}
      </div>
      {SCATTERED.map((tool, i) => {
        const born = easeOut(ramp(t, from + 0.4 + i * 0.25, from + 0.8 + i * 0.25))
        if (!born) return null
        const angle = (i / SCATTERED.length) * Math.PI * 2 + (t - from) * 0.05 + swallow * 2.4
        const reach = (1 - swallow) * (0.85 + hash(i) * 0.15)
        const struck = ramp(t, at("none") + 0.3 + i * 0.12, at("none") + 0.55 + i * 0.12)
        return (
          <span key={tool} className={styles.tool} style={{
            left: `${50 + Math.cos(angle) * 34 * reach}%`, top: `${50 + Math.sin(angle) * 30 * reach}%`,
            opacity: born * (1 - swallow * 0.6), transform: `translate(-50%, -50%) rotate(${((i * 37) % 9) - 4 + swallow * 90}deg) scale(${born * (1 - swallow)})`,
            "--strike": struck,
          } as CSSProperties}>{tool}</span>
        )
      })}
    </div>
  )
}

/* The four spaces: a card each for the orbit, and the plain-words explainer on the left. */

const TOOLBAR = ["CHECK", "PROOFREAD", "SOURCE", "REWRITE", "JURY"]

/** The writing space: a draft sentence, the copilot reviewing it against the library, then the cited rewrite. */
function ThesisCard({ t, at }: { t: number; at: At }) {
  const { flag, rewrite, page } = ono
  const check = at("check"), cite = at("cite")
  const flagged = ramp(t, flag, flag + 0.3)
  return (
    <>
      <span className={styles.meta}>1.1 · GENERATIVE AI IN SPORT CLUBS · DRAFT</span>
      {t >= check - 0.2 && (
        <div className={styles.toolbar} style={{ opacity: ramp(t, check - 0.2, check + 0.1) }}>
          {TOOLBAR.map((b, i) => <span key={b} data-on={(i === 0 && t < rewrite) || (i === 3 && t >= rewrite && t < cite) || undefined}>{b}</span>)}
        </div>
      )}
      {t < cite - 0.1 ? (
        <p className={styles.serif}>
          <span className={styles.nuance} style={{ "--flag": flagged } as CSSProperties}>
            {typed("Generative AI lets a single volunteer run a whole club’s communication.", ramp(t, at("thesis") + 1.2, at("thesis") + 3.2))}
          </span>
        </p>
      ) : (
        <p className={styles.serif}>
          {typed("Generative AI can let one volunteer handle a large share of a club’s day-to-day communication ", ramp(t, cite - 0.1, cite + 1.2))}
          {t >= cite + 1.2 && <mark className={styles.cite}>{typed("(Bayle, 2021, p. 265)", ramp(t, cite + 1.2, cite + 1.7))}</mark>}
        </p>
      )}
      {t >= check + 0.4 && t < cite - 0.1 && (
        <div className={styles.copilot} style={{ opacity: ramp(t, check + 0.4, check + 0.7) * (1 - ramp(t, cite - 0.4, cite - 0.1)) }}>
          <span className={styles.kicker}>COPILOT · REVIEWER</span>
          {t >= flag && <span className={styles.verdict}>TO NUANCE</span>}
          <p>{typed("Checked against your library: nothing measures this for a whole club.", ramp(t, check + 0.6, flag + 0.4))}</p>
          {t >= rewrite && <p className={styles.suggest}>{typed("“… can let one volunteer handle a large share of day-to-day communication.”", ramp(t, rewrite, rewrite + 1.2))}</p>}
          {t >= rewrite + 1.3 && <span className={styles.srcChip}>Bayle, 2021 · p. 265 ↗</span>}
        </div>
      )}
      {t >= page && (
        <div className={styles.check}>
          <span>{decode("✓ APA 7 · PAGE 265 FOUND IN THE SOURCE PDF", ramp(t, page, page + 0.4), t)}</span>
          {t >= page + 0.6 && <span>{decode("✓ ADDED TO THE REFERENCE LIST", ramp(t, page + 0.6, page + 1), t)}</span>}
        </div>
      )}
    </>
  )
}

const RESULTS = [
  { title: "IOC Sustainability Strategy", page: "p. 14", score: 0.91 },
  { title: "Sport & Sustainable Development", page: "p. 203", score: 0.87 },
  { title: "Global Sport Regulation", page: "p. 61", score: 0.79 },
]

function LibraryCard({ t, at, bilingual }: { t: number; at: number; bilingual: number }) {
  return (
    <>
      <div className={styles.search}>
        <span>⌕</span>{typed("qui décide de l’héritage des grands événements ?", ramp(t, at + 0.3, at + 1.3))}<em>FR</em>
      </div>
      {RESULTS.map((r, i) => {
        const from = at + 1.4 + i * 0.25
        if (t < from) return null
        const fill = easeOut(ramp(t, from, from + 0.5)) * r.score
        return (
          <div key={r.title} className={styles.result}>
            <span>{r.title}<b>{r.page}</b></span>
            <i><b style={{ transform: `scaleX(${fill})` }} /></i>
            <em>{fill.toFixed(2)}</em>
          </div>
        )
      })}
      {t >= bilingual && <span className={styles.tag}>{decode("ASKED IN FRENCH → FOUND IN ENGLISH · BY MEANING", ramp(t, bilingual, bilingual + 0.6), t)}</span>}
    </>
  )
}

function LecturesCard({ t, at }: { t: number; at: number }) {
  const rec = Math.max(0, t - at) * 140
  const slide = 12 + Math.floor(ramp(t, at, at + 4) * 3)
  return (
    <>
      <span className={styles.meta}><i className={styles.rec} />REC {pad(rec / 3600)}:{pad((rec / 60) % 60)}:{pad(rec % 60)} · SLIDE {slide} / 38</span>
      <div className={styles.wave}>
        {Array.from({ length: 56 }, (_, i) => {
          const h = 0.12 + hash(i * 7 + Math.floor(t * 16)) * 0.88 * (0.55 + 0.45 * Math.sin(i * 0.37 + t * 5))
          return <i key={i} data-slide={i % 14 === 0 || undefined} style={{ transform: `scaleY(${clamp(h, 0.08, 1)})` }} />
        })}
      </div>
      <p className={styles.serif} data-quote>{typed("“Three questions for any club board: who decides, who pays, who answers for it.”", ramp(t, at + 1, at + 2.6))}</p>
      {t >= at + 2.8 && <span className={styles.tag}>{decode("TRANSCRIBED ON THE MAC · LINKED TO SLIDE 14", ramp(t, at + 2.8, at + 3.3), t)}</span>}
    </>
  )
}

function AskCard({ t, at }: { t: number; at: number }) {
  return (
    <>
      <p className={styles.question}><span>›</span> {typed("Who disagrees with Chappelet on board autonomy?", ramp(t, at + 0.2, at + 1))}</p>
      {t >= at + 1.2 && (
        <p className={styles.serif}>
          {typed("Bayle does, in a book from your library, and so did Tuesday’s lecture. ", ramp(t, at + 1.2, at + 2.4))}
          {t >= at + 2.4 && <><mark className={styles.cite}>Bayle, 2021, p. 118</mark> <mark className={styles.cite}>Lecture 14 · 32:10</mark></>}
        </p>
      )}
      {t >= at + 3 && <span className={styles.tag}>{decode("EVERY CLAIM LINKED · NOTHING INVENTED", ramp(t, at + 3, at + 3.5), t)}</span>}
    </>
  )
}

const INFO: Record<Space, { n: string; name: string; line: string; facts: string[] }> = {
  thesis: { n: "01", name: "Thesis", line: "He writes. A copilot reviews every sentence.", facts: ["CHECKS EACH CLAIM AGAINST HIS BOOKS", "FLAGS, NUANCES, REWORDS, PLAYS THE JURY", "APA 7 CITATIONS, PAGE VERIFIED"] },
  library: { n: "02", name: "Library", line: "31 books and reports, searched by meaning.", facts: ["ASK IN FRENCH, FIND ENGLISH", "OPENS AT THE RIGHT PAGE", "SEARCH MODEL RUNS LOCALLY"] },
  lectures: { n: "03", name: "Lectures", line: "Every class recorded, transcribed, matched to the slides.", facts: ["WHISPER · ON THE MAC", "SLIDE CHANGES TIMED", "BECOMES A WRITTEN COURSE"] },
  ask: { n: "04", name: "Ask", line: "One question across thesis, books and lectures.", facts: ["ANSWERS WITH PAGE OR TIMESTAMP", "READS, NEVER EDITS", "FLAGS WHAT ISN’T IN THE SOURCES"] },
}

/** Which space the voice is on, from the moment it names it. */
const activeSpace = (t: number, at: At) => [...SPACES].reverse().find(s => t >= at(s) - 0.3) ?? null

/** The left column: the space being named, in plain words, with three facts. */
function Explainer({ t, at }: { t: number; at: At }) {
  const s = activeSpace(t, at)
  const away = ramp(t, at("fed") - 0.3, at("fed") + 0.2)
  if (!s || away >= 1) return null
  const from = at(s) - 0.3
  const info = INFO[s]
  return (
    <div key={s} className={styles.explainer} style={{ opacity: ramp(t, from, from + 0.35) * (1 - away), transform: `translateY(${(1 - easeOut(ramp(t, from, from + 0.4))) * 14}px)` }}>
      <span className={styles.explainerN}>{info.n}<small>/ 04</small></span>
      <b>{decode(info.name.toUpperCase(), ramp(t, from, from + 0.4), t)}</b>
      <p>{typed(info.line, ramp(t, from + 0.3, from + 1.3))}</p>
      <ul>
        {info.facts.map((fact, i) => {
          const f = from + 1.2 + i * 0.35
          return t >= f && <li key={fact}>{decode(fact, ramp(t, f, f + 0.4), t)}</li>
        })}
      </ul>
    </div>
  )
}

/** The four spaces on a tilted orbit around the hole; the one being named swings round to the front. */
function Orbit({ t, at }: { t: number; at: At }) {
  const show = ramp(t, at("thesis") - 0.6, at("thesis") - 0.2)
  const recede = easeInOut(ramp(t, at("fed") - 0.3, at("fed") + 0.6))
  if (!show || recede >= 1) return null
  // How far round the orbit has turned: one quarter per space, eased into each new line.
  const turn = SPACES.slice(1).reduce((k, s) => k + easeInOut(ramp(t, at(s) - 0.6, at(s) + 0.1)), 0)
  return (
    <div className={styles.orbit} style={{ opacity: show * (1 - recede), transform: `scale(${1 - 0.35 * recede})` }}>
      <svg className={styles.orbitRing} viewBox="0 0 1000 300" preserveAspectRatio="none"><ellipse cx={500} cy={150} rx={498} ry={148} /></svg>
      {SPACES.map((s, i) => {
        const born = ramp(t, at(s) - 0.6, at(s) - 0.2)
        if (!born) return null
        const angle = Math.PI / 2 + (i - turn) * (Math.PI / 2)
        const depth = (Math.sin(angle) + 1) / 2 // 1 in front of the hole, 0 behind it
        return (
          <article key={s} className={styles.card} data-front={depth > 0.92 || undefined} style={{
            left: `${50 + Math.cos(angle) * 34}%`, top: `${50 + Math.sin(angle) * 30}%`, zIndex: Math.round(depth * 10),
            opacity: born * (0.18 + 0.82 * Math.pow(depth, 2)),
            transform: `translate(-50%, -50%) scale(${(0.5 + 0.5 * depth) * (0.9 + 0.1 * born)})`,
            filter: `brightness(${0.45 + 0.55 * depth})`,
          }}>
            <header><b>{INFO[s].n} · {INFO[s].name.toUpperCase()}</b><i /></header>
            {s === "thesis" && <ThesisCard t={t} at={at} />}
            {s === "library" && <LibraryCard t={t} at={at(s)} bilingual={at("bilingual")} />}
            {s === "lectures" && <LecturesCard t={t} at={at(s)} />}
            {s === "ask" && <AskCard t={t} at={at(s)} />}
          </article>
        )
      })}
    </div>
  )
}

/** Why it matters: the thesis question set in serif, and the app as its answer. */
function Why({ t, at }: { t: number; at: At }) {
  const from = at("why")
  if (t < from - 0.2) return null
  return (
    <div className={styles.why} style={{ opacity: ramp(t, from - 0.2, from + 0.2) * (1 - ramp(t, at("answer") - 0.3, at("answer"))) }}>
      <span className={styles.kicker}>{decode("THESIS QUESTION", ramp(t, from, from + 0.4), t)}</span>
      <p>{typed("What can generative AI do for one person with almost no budget?", ramp(t, from + 0.1, ono.why.end))}</p>
    </div>
  )
}

/** "This is his answer": the logo full frame, the lambda first, then the name written out. */
function Hero({ t, at, g }: { t: number; at: At; g: number }) {
  const from = at("answer") - 0.1
  if (t < from) return null
  const land = easeOut(ramp(t, from, from + 0.35))
  const wipe = easeInOut(ramp(t, from + 0.25, from + 1.1))
  // The glitch splits the logo into the dossier's red and acid, a little further each frame.
  const split = g * (12 + hash(Math.floor(t * 24)) * 28)
  const style = { clipPath: `inset(0 ${(1 - wipe) * 80}% 0 0)` }
  return (
    <div className={styles.hero} style={{ opacity: land, transform: `translate(-50%, -50%) scale(${1.12 - 0.12 * land + 0.03 * ramp(t, from, from + 3)})` }}>
      {g > 0 && <i className={styles.heroSplit} data-tone="red" style={{ ...style, transform: `translateX(${-split}px)`, WebkitMaskImage: `url(${ONO_LOGO})`, maskImage: `url(${ONO_LOGO})` }} />}
      {g > 0 && <i className={styles.heroSplit} data-tone="acid" style={{ ...style, transform: `translateX(${split}px)`, WebkitMaskImage: `url(${ONO_LOGO})`, maskImage: `url(${ONO_LOGO})` }} />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={ONO_LOGO} alt="" style={style} />
      <i className={styles.horizon} style={{ transform: `scaleX(${easeInOut(ramp(t, from + 0.8, from + 1.6))})`, transformOrigin: "50% 50%" }} />
    </div>
  )
}

/** Horizontal bands of the frame, some dropped each frame as the glitch grows: a CSS polygon of the ones kept. */
function tornBands(t: number, g: number) {
  const frame = Math.floor(t * 24)
  const bands = 18
  let points = ""
  for (let k = 0; k < bands; k++) {
    if (hash(k * 13 + frame * 7) < Math.pow(g, 1.3)) continue
    const y0 = (k / bands) * 100, y1 = ((k + 1) / bands) * 100
    points += `0% ${y0}%, 100% ${y0}%, 100% ${y1}%, 0% ${y1}%, `
  }
  return points ? `polygon(${points.slice(0, -2)})` : "inset(50% 50% 50% 50%)"
}

export function OnoScene({ t }: { t: number }) {
  if (t < ono.exhibit.at - 0.2 || t > ono.cut) return null
  const at: At = k => ono[k].at
  const open = easeIn(ramp(t, at("exhibit") - 0.1, at("exhibit") + 0.9))
  const video = easeOut(ramp(t, at("codename") - 0.3, at("codename") + 1.2))
  const dock = easeInOut(ramp(t, at("problem") - 0.3, at("problem") + 0.4))
  const grid = easeOut(ramp(t, at("built") + 0.2, at("built") + 1.6))
  const push = easeInOut(ramp(t, at("answer") - 0.3, at("answer") + 0.6))
  // The way out: the frame jitters, re-tints and loses band after band until the next mission shows through.
  const g = ramp(t, ono.glitch, ono.cut)
  const frame = Math.floor(t * 24)
  const torn = g > 0 ? tornBands(t, g) : undefined
  const jolt = g > 0 ? {
    transform: `translateX(${(hash(frame) - 0.5) * 50 * g}px) skewX(${(hash(frame + 3) - 0.5) * 6 * g}deg)`,
    filter: hash(frame + 11) > 0.7 ? `hue-rotate(${Math.round(hash(frame + 5) * 180)}deg) contrast(1.5) saturate(1.6)` : undefined,
  } : undefined
  return (
    <div className={`${styles.root} ${onoFonts}`} aria-hidden="true" style={{ clipPath: torn ?? `circle(${open * 72}vmax at 50% 46%)`, ...jolt }}>
      <Hole t={t} start={at("exhibit")} on={video} push={push} />
      <div className={styles.grid} style={{ transform: `translateY(${(1 - grid) * 40}%)`, opacity: grid }} />
      <Infall t={t} from={at("exhibit") - 0.1} to={at("codename") + 1.4} count={120} speed={0.9} />
      <Infall t={t} from={at("built") - 0.2} to={at("built") + 1.6} count={70} speed={1.2} />
      <Infall t={t} from={at("fed")} to={at("local") + 0.5} />
      <Title t={t} at={at} dock={dock} />
      <Scattered t={t} at={at} />
      <Role t={t} at={at} />
      <Explainer t={t} at={at} />
      <Orbit t={t} at={at} />
      <Why t={t} at={at} />
      <Hero t={t} at={at} g={g} />
      {/* The rim of the opening: a hairline of ice-blue light, as on the landing. */}
      <i className={styles.rim} style={{ width: `${open * 144}vmax`, height: `${open * 144}vmax`, opacity: open > 0 && open < 1 && !g ? 1 : 0 }} />
    </div>
  )
}
