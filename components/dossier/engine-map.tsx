import { DESKTOP, type OutId, type PathId } from "@/components/contracts/thesis-map"
import { LogoGlyph } from "@/components/contracts/thesis-logos"
import { CUE } from "@/lib/dossier"
import { decode, easeInOut, easeOut, hash, ramp, window01 } from "./timing"
import styles from "./dossier.module.css"

const { shift } = CUE

/* The research engine: the Thesis Engine's system map, drawn in the
   dossier's colours and run on the film's clock. Ninety candidates
   stream in from the three databases; the local model drops most in
   red, keeps a few in acid and hands one to DeepSeek on the way. */

const MAP = DESKTOP
type Pt = readonly [number, number]

/** A point along one of the map's single-segment paths (a line or one cubic), k from 0 to 1. */
function along(d: string, k: number): Pt {
  const n = d.match(/-?[\d.]+/g)!.map(Number)
  const u = 1 - k
  if (n.length === 4) return [n[0] + (n[2] - n[0]) * k, n[1] + (n[3] - n[1]) * k]
  const c = (i: number) => u * u * u * n[i] + 3 * u * u * k * n[i + 2] + 3 * u * k * k * n[i + 4] + k * k * k * n[i + 6]
  return [c(0), c(1)]
}

const FEEDS = ["s0", "s1", "s2"] as const
const CANDIDATES = 90
/** About 5% kept, as in the real pipeline; one of them escalated first. */
const KEPT = new Set([11, 34, 57, 79])
const ESCALATED = 46
const LEG = { feed: 0.38, scan: 0.28, read: 0.16, fate: 0.42 }

type Fate = "drop" | "keep" | "escalate"
type Run = { legs: { path: PathId; from: number }[]; fate: Fate; end: number }

/** Each candidate's trip, from the moment the scans start. */
const RUNS: Run[] = Array.from({ length: CANDIDATES }, (_, i) => {
  const fate: Fate = i === ESCALATED ? "escalate" : KEPT.has(i) ? "keep" : "drop"
  let at = (i / CANDIDATES) * 2.7 + hash(i + 40) * 0.08
  const legs: { path: PathId; from: number }[] = []
  const go = (path: PathId, dur: number) => { legs.push({ path, from: at }); at += dur }
  go(FEEDS[i % 3], LEG.feed)
  go("scanCore", LEG.scan)
  at += LEG.read
  if (fate === "drop") go("coreDrop", LEG.fate)
  else if (fate === "keep") go("coreVault", LEG.fate)
  else { go("coreDeepseek", LEG.fate * 0.8); go("deepseekVault", LEG.fate * 0.8) }
  return { legs, fate, end: at }
})
const LEG_DUR = (path: PathId, fate: Fate) => path === "scanCore" ? LEG.scan : FEEDS.includes(path as (typeof FEEDS)[number]) ? LEG.feed : fate === "escalate" ? LEG.fate * 0.8 : LEG.fate

/** Where a candidate is at film time t (null when not on a wire). */
function dot(run: Run, t: number): Pt | null {
  for (const leg of run.legs) {
    const k = (t - leg.from) / LEG_DUR(leg.path, run.fate)
    if (k >= 0 && k <= 1) return along(MAP.paths[leg.path], easeInOut(k))
  }
  return null
}

const box = (b: { x: number; y: number; w: number; h: number }) => ({ x: b.x - b.w / 2, y: b.y - b.h / 2, width: b.w, height: b.h })
const SOURCE_NAMES = { scholar: "Google Scholar", openalex: "OpenAlex", cairn: "Cairn.info" } as const

/** When the map has the whole screen: from the first word of the line to just after its last. */
export const ENGINE_WINDOW = [shift.engine.at - 0.1, shift.engine.end + 0.3] as const

export function EngineMap({ t }: { t: number }) {
  const { engine, scans } = shift
  const a = engine.at
  const visible = window01(t, ENGINE_WINDOW[0], ENGINE_WINDOW[1], 0.25)
  if (!visible) return null
  const since = t - scans
  const count = Math.round(easeOut(ramp(t, scans, scans + 3.4)) * 90)
  // The map builds itself left to right while the voice starts the line.
  const node = (k: number) => easeOut(ramp(t, a + k * 0.16, a + k * 0.16 + 0.35))
  const wire = (k: number) => easeInOut(ramp(t, a + k * 0.16 + 0.1, a + k * 0.16 + 0.55))
  const hit = (fate: Fate | "all", path: PathId) => Math.max(0, ...RUNS.filter(r => fate === "all" || r.fate === fate).map(r => {
    const leg = r.legs.find(l => l.path === path)
    if (!leg) return 0
    const d = since - (leg.from + LEG_DUR(path, r.fate))
    return d >= 0 && d < 0.3 ? 1 - d / 0.3 : 0
  }))
  const landed = (fate: Fate) => RUNS.filter(r => r.fate === fate && since >= r.end).length
  const kept = landed("keep") + landed("escalate")
  const flash = { core: hit("all", "scanCore"), drop: hit("drop", "coreDrop"), deepseek: hit("escalate", "coreDeepseek"), vault: Math.max(hit("keep", "coreVault"), hit("escalate", "deepseekVault")) }
  const WIRES: [PathId, number][] = [["s0", 0], ["s1", 0], ["s2", 0], ["scanCore", 1], ["ragCore", 2.4], ["coreDrop", 2], ["coreVault", 3], ["coreDeepseek", 2.6], ["deepseekVault", 3.3]]
  return (
    <div className={styles.engine} style={{ opacity: visible }}>
      <div className={styles.engineHead}>
        <p className={styles.heroKicker}><i />{decode("RESEARCH ENGINE · THESIS ENGINE", ramp(t, a, a + 0.5), t)}</p>
        <span>{decode("3 SCANS A DAY · ≈ 5% KEPT", ramp(t, a + 0.3, a + 0.9), t)}</span>
        {t >= engine.end - 1.4 && <em>{decode("24/7 · AROUND THE CLOCK", ramp(t, engine.end - 1.4, engine.end - 0.8), t)}</em>}
      </div>
      <svg viewBox={`0 0 ${MAP.view[0]} ${MAP.view[1]}`} className={styles.engineMap} aria-hidden="true">
        {WIRES.map(([id, k]) => (
          <path key={id} d={MAP.paths[id]} pathLength={1} className={styles.engineWire} data-tone={id === "coreDrop" ? "red" : id === "coreVault" || id === "deepseekVault" || id === "coreDeepseek" ? "acid" : undefined} style={{ strokeDashoffset: 1 - wire(k) }} />
        ))}
        {(Object.keys(MAP.outPaths) as OutId[]).map(id => <path key={id} d={MAP.outPaths[id]} pathLength={1} className={styles.engineWire} style={{ strokeDashoffset: 1 - wire(3.8) }} />)}

        {(Object.keys(MAP.sources) as (keyof typeof MAP.sources)[]).map((id, i) => {
          const b = MAP.sources[id]
          const lit = t >= scans + i * 0.5
          return (
            <g key={id} className={styles.engineNode} data-lit={lit || undefined} style={{ opacity: node(0) }}>
              <rect {...box(b)} />
              <LogoGlyph id={id} cx={b.x - b.w / 2 + 30} cy={b.y} size={26} />
              <text x={b.x - b.w / 2 + 56} y={b.y + 5} className={styles.engineName}>{lit ? decode(SOURCE_NAMES[id].toUpperCase(), ramp(t, scans + i * 0.5, scans + i * 0.5 + 0.4), t) : SOURCE_NAMES[id].toUpperCase()}</text>
            </g>
          )
        })}

        <g className={styles.engineNode} style={{ opacity: node(1) }}>
          <circle cx={MAP.scan.x} cy={MAP.scan.y} r={MAP.scan.r} />
          <text x={MAP.scan.x} y={MAP.scan.y + 12} textAnchor="middle" className={styles.engineCount}>{count}</text>
          <text x={MAP.scanLabel.x} y={MAP.scanLabel.y - 18} textAnchor="middle" className={styles.engineUnit}>SOURCES / DAY</text>
        </g>

        <g className={styles.engineNode} style={{ opacity: node(2.4) }}>
          <rect {...box(MAP.rag)} />
          <text x={MAP.rag.x} y={MAP.rag.y + 5} textAnchor="middle" className={styles.engineName}>RAG · REFERENCE CORPUS</text>
        </g>

        <g className={styles.engineNode} data-core style={{ opacity: node(2) }}>
          <circle cx={MAP.core.x} cy={MAP.core.y} r={MAP.core.r + 10 + flash.core * 6} className={styles.engineAura} style={{ opacity: 0.25 + flash.core * 0.5 }} />
          <circle cx={MAP.core.x} cy={MAP.core.y} r={MAP.core.r} />
          <LogoGlyph id="qwen" cx={MAP.core.x - 20} cy={MAP.core.y - 30} size={30} />
          <LogoGlyph id="ollama" cx={MAP.core.x + 20} cy={MAP.core.y - 30} size={30} />
          <text x={MAP.core.x} y={MAP.core.y + 14} textAnchor="middle" className={styles.engineCore}>QWEN3 4B</text>
          <text x={MAP.core.x} y={MAP.core.y + 36} textAnchor="middle" className={styles.engineUnit}>LORA · LOCAL · OLLAMA</text>
        </g>

        <g className={styles.engineNode} data-tone="red" style={{ opacity: node(3), filter: flash.drop ? `brightness(${1 + flash.drop * 0.6})` : undefined }}>
          <rect {...box(MAP.drop)} />
          <text x={MAP.drop.x} y={MAP.drop.y + 5} textAnchor="middle" className={styles.engineName}>{landed("drop")} DROPPED · ≈ 95%</text>
        </g>

        <g className={styles.engineNode} data-tone="acid" style={{ opacity: node(3.6), filter: flash.deepseek ? `brightness(${1 + flash.deepseek * 0.8})` : undefined }}>
          <rect {...box(MAP.deepseek)} />
          <LogoGlyph id="deepseek" cx={MAP.deepseek.x - MAP.deepseek.w / 2 + 32} cy={MAP.deepseek.y} size={30} />
          <text x={MAP.deepseek.x - MAP.deepseek.w / 2 + 58} y={MAP.deepseek.y - 3} className={styles.engineName}>DEEPSEEK V4-PRO</text>
          <text x={MAP.deepseek.x - MAP.deepseek.w / 2 + 58} y={MAP.deepseek.y + 16} className={styles.engineUnit}>COMPLEX ANALYSES ONLY</text>
        </g>

        <g className={styles.engineNode} data-tone="acid" data-core style={{ opacity: node(4.2) }}>
          <circle cx={MAP.vault.x} cy={MAP.vault.y} r={MAP.vault.r + 10 + flash.vault * 8} className={styles.engineAura} style={{ opacity: 0.2 + flash.vault * 0.7 }} />
          <circle cx={MAP.vault.x} cy={MAP.vault.y} r={MAP.vault.r} />
          <LogoGlyph id="onosendai" cx={MAP.vault.x} cy={MAP.vault.y - 18} size={34} />
          <text x={MAP.vault.x} y={MAP.vault.y + 20} textAnchor="middle" className={styles.engineName}>ONO-SENDAI</text>
          <text x={MAP.vault.x} y={MAP.vault.y + 40} textAnchor="middle" className={styles.engineUnit}>{kept} KEPT</text>
        </g>

        {(Object.keys(MAP.outputs) as OutId[]).map(id => (
          <g key={id} className={styles.engineNode} style={{ opacity: node(5) }}>
            <rect {...box(MAP.outputs[id])} rx={MAP.outputs[id].h / 2} />
            <text x={MAP.outputs[id].x} y={MAP.outputs[id].y + 5} textAnchor="middle" className={styles.engineUnit}>{{ notes: "NOTES", canvas: "CANVAS", biblio: "BIBLIOGRAPHY" }[id]}</text>
          </g>
        ))}

        {since > 0 && RUNS.map((r, i) => {
          const at = dot(r, since)
          return at && <circle key={i} cx={at[0]} cy={at[1]} r={r.fate === "drop" ? 4.5 : 7} className={styles.engineDot} data-fate={r.fate} />
        })}
      </svg>
    </div>
  )
}
