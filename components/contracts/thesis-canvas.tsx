"use client"

import { useEffect, useRef, useState } from "react"
import { useInView } from "framer-motion"
import { cn } from "@/lib/utils"
import { Logo, type LogoId } from "@/components/contracts/thesis-logos"
import styles from "./thesis-engine.module.css"

/* ------------------------------------------------------------------
   THESIS ENGINE — what the vault looks like, as an Obsidian Canvas.
   The concepts are the ones in the research question; the notes are
   skeletons, because this is an illustration and not a screenshot.
   ------------------------------------------------------------------ */

const W = 1100
const H = 640

type Concept = { id: string; label: string; x: number; y: number }
type Note = { concept: string; x: number; y: number; source: LogoId; lines: number[]; deep?: boolean }

const QUESTION = { x: 550, y: 300, w: 320, h: 132 }
const CONCEPTS: Concept[] = [
  { id: "ai", label: "Generative AI", x: 200, y: 112 },
  { id: "nocode", label: "No-code tools", x: 550, y: 70 },
  { id: "pro", label: "Professionalisation", x: 900, y: 112 },
  { id: "eff", label: "Organisational efficiency", x: 915, y: 470 },
  { id: "res", label: "Limited resources", x: 185, y: 480 },
]
const NOTES: Note[] = [
  { concept: "ai", x: 85, y: 238, source: "scholar", lines: [92, 70, 80] },
  { concept: "ai", x: 300, y: 228, source: "openalex", lines: [80, 96, 54] },
  { concept: "nocode", x: 395, y: 166, source: "openalex", lines: [88, 62] },
  { concept: "nocode", x: 705, y: 166, source: "cairn", lines: [74, 90, 60] },
  { concept: "pro", x: 1010, y: 236, source: "cairn", lines: [90, 66, 84] },
  { concept: "eff", x: 1000, y: 352, source: "scholar", lines: [70, 92] },
  { concept: "eff", x: 790, y: 566, source: "openalex", lines: [96, 74, 88], deep: true },
  { concept: "res", x: 90, y: 360, source: "cairn", lines: [84, 60, 76] },
  { concept: "res", x: 330, y: 572, source: "scholar", lines: [66, 90] },
]
const BIB = { x: 560, y: 560, w: 230, h: 96 }
const CONCEPT_W = 210
const CONCEPT_H = 52
const NOTE_W = 150
const NOTE_H = 74

const curve = (x1: number, y1: number, x2: number, y2: number) => {
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  return `M${x1} ${y1} Q ${mx + (y2 - y1) * 0.12} ${my - (x2 - x1) * 0.12}, ${x2} ${y2}`
}

export function ThesisCanvas() {
  const outer = useRef<HTMLDivElement>(null)
  const inView = useInView(outer, { once: true, amount: 0.25 })
  const [scale, setScale] = useState(1)
  const [focus, setFocus] = useState<string | null>(null)

  useEffect(() => {
    const el = outer.current
    if (!el) return
    const fit = () => setScale(Math.min(1, Math.max(el.clientWidth / W, 0.62)))
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const dim = (concept: string) => focus !== null && focus !== concept
  const pannable = scale <= 0.62 + 0.001

  return (
    <div className={styles.canvasWrap}>
      <div className={styles.canvasBar}>
        <span className={styles.canvasDots} aria-hidden="true"><i /><i /><i /></span>
        <span className={styles.canvasTab}>
          <Logo id="obsidian" tone="brand" className={styles.canvasTabLogo} /> Canvas · research map
        </span>
        <span className={styles.canvasFlag}>Illustration · structure, not a screenshot</span>
      </div>
      <div ref={outer} className={cn(styles.canvasViewport, pannable && styles.canvasPan)}>
        {/* The sizer takes the scaled footprint, so the viewport only scrolls when the board really overflows. */}
        <div className={styles.boardSizer} style={{ width: W * scale, height: H * scale }}>
        <div className={cn(styles.board, styles.dots, inView && styles.boardIn)} style={{ width: W, height: H, transform: `scale(${scale})` }}>
          <svg className={styles.boardEdges} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
            {CONCEPTS.map((c, i) => (
              <path key={c.id} d={curve(QUESTION.x, QUESTION.y, c.x, c.y)} className={cn(styles.edge, dim(c.id) && styles.edgeDim, focus === c.id && styles.edgeOn)} style={{ animationDelay: `${0.15 + i * 0.08}s` }} />
            ))}
            {NOTES.map((n, i) => {
              const c = CONCEPTS.find((k) => k.id === n.concept)!
              return <path key={i} d={curve(c.x, c.y, n.x, n.y)} className={cn(styles.edge, styles.edgeThin, n.deep && styles.edgeCoral, dim(n.concept) && styles.edgeDim, focus === n.concept && styles.edgeOn)} style={{ animationDelay: `${0.55 + i * 0.06}s` }} />
            })}
            {NOTES.map((n, i) => (
              <path key={`b${i}`} d={curve(n.x, n.y, BIB.x, BIB.y)} className={cn(styles.edge, styles.edgeBib, focus !== null && styles.edgeDim)} style={{ animationDelay: `${1 + i * 0.04}s` }} />
            ))}
          </svg>

          <div className={cn(styles.card, styles.cardQuestion)} style={{ left: QUESTION.x - QUESTION.w / 2, top: QUESTION.y - QUESTION.h / 2, width: QUESTION.w, height: QUESTION.h }}>
            <span className={styles.cardKicker}>Research question</span>
            <p className={styles.cardQ}>Generative AI &amp; no-code as levers for sports associations with <em>limited resources.</em></p>
          </div>

          {CONCEPTS.map((c, i) => (
            <button
              key={c.id}
              type="button"
              className={cn(styles.card, styles.cardConcept, dim(c.id) && styles.cardDim, focus === c.id && styles.cardOn)}
              style={{ left: c.x - CONCEPT_W / 2, top: c.y - CONCEPT_H / 2, width: CONCEPT_W, height: CONCEPT_H, animationDelay: `${0.2 + i * 0.07}s` }}
              onMouseEnter={() => setFocus(c.id)}
              onMouseLeave={() => setFocus(null)}
              onFocus={() => setFocus(c.id)}
              onBlur={() => setFocus(null)}
              aria-label={`${c.label}: ${NOTES.filter((n) => n.concept === c.id).length} linked source notes`}
            >
              {c.label}
            </button>
          ))}

          {NOTES.map((n, i) => (
            <div
              key={i}
              className={cn(styles.card, styles.cardNote, n.deep && styles.cardDeep, dim(n.concept) && styles.cardDim)}
              style={{ left: n.x - NOTE_W / 2, top: n.y - NOTE_H / 2, width: NOTE_W, height: NOTE_H, animationDelay: `${0.6 + i * 0.06}s` }}
              aria-hidden="true"
            >
              <div className={styles.noteTop}>
                <Logo id={n.source} tone="brand" className={styles.noteLogo} />
                <span>{n.deep ? "Deep dive" : "Summary"}</span>
                {n.deep && <Logo id="claude" tone="brand" className={styles.noteLogo} />}
              </div>
              {n.lines.map((w, j) => <span key={j} className={styles.skel} style={{ width: `${w}%` }} />)}
            </div>
          ))}

          <div className={cn(styles.card, styles.cardBib)} style={{ left: BIB.x - BIB.w / 2, top: BIB.y - BIB.h / 2, width: BIB.w, height: BIB.h }} aria-hidden="true">
            <div className={styles.noteTop}>
              <span>Bibliography</span>
              <span className={styles.bibBadge}>+ updated</span>
            </div>
            {[86, 72, 94, 64].map((w, j) => <span key={j} className={styles.skel} style={{ width: `${w}%` }} />)}
          </div>
        </div>
        </div>
      </div>
      {pannable && <p className={styles.panHint} aria-hidden="true">← Swipe to pan the canvas →</p>}
    </div>
  )
}
