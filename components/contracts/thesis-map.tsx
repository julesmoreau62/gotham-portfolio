"use client"

import { useEffect, useId, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { useIsMobile, useReducedMotion } from "@/hooks/use-media"
import { Logo, LogoGlyph, type LogoId } from "@/components/contracts/thesis-logos"
import styles from "./thesis-engine.module.css"

/* ------------------------------------------------------------------
   THESIS ENGINE — the system map. Every dot is one candidate source:
   it is scanned, read by the local model, then dropped, kept in the
   vault or escalated to Claude first. Rates follow the real pipeline
   (90 a day, three passes, about 5% kept); the rest is a simulation.
   ------------------------------------------------------------------ */

type NodeId = "scholar" | "openalex" | "cairn" | "scan" | "rag" | "core" | "drop" | "claude" | "vault"
type PathId = "s0" | "s1" | "s2" | "scanCore" | "ragCore" | "coreDrop" | "coreVault" | "coreClaude" | "claudeVault"
type OutId = "notes" | "canvas" | "biblio"
type Fate = "drop" | "keep" | "escalate"
type Box = { x: number; y: number; w: number; h: number }
type Circle = { x: number; y: number; r: number }

type Layout = {
  view: [number, number]
  stacked: boolean
  sources: Record<"scholar" | "openalex" | "cairn", Box>
  scan: Circle
  scanLabel: { x: number; y: number; anchor: "middle" | "start" }
  core: Circle
  vault: Circle
  rag: Box
  drop: Box
  claude: Box
  outputs: Record<OutId, Box>
  paths: Record<PathId, string>
  outPaths: Record<OutId, string>
  speed: number
}

const DESKTOP: Layout = {
  view: [1260, 620],
  stacked: false,
  sources: {
    scholar: { x: 150, y: 150, w: 200, h: 64 },
    openalex: { x: 150, y: 310, w: 200, h: 64 },
    cairn: { x: 150, y: 470, w: 200, h: 64 },
  },
  scan: { x: 410, y: 310, r: 56 },
  scanLabel: { x: 410, y: 410, anchor: "middle" },
  core: { x: 680, y: 310, r: 96 },
  vault: { x: 1070, y: 330, r: 70 },
  rag: { x: 680, y: 80, w: 224, h: 56 },
  drop: { x: 680, y: 560, w: 244, h: 52 },
  claude: { x: 960, y: 140, w: 230, h: 72 },
  outputs: {
    notes: { x: 945, y: 492, w: 118, h: 38 },
    canvas: { x: 1065, y: 540, w: 118, h: 38 },
    biblio: { x: 1180, y: 492, w: 140, h: 38 },
  },
  paths: {
    s0: "M250 150 C 305 150, 300 310, 354 310",
    s1: "M250 310 L354 310",
    s2: "M250 470 C 305 470, 300 310, 354 310",
    scanCore: "M466 310 L584 310",
    ragCore: "M680 108 L680 214",
    coreDrop: "M680 406 L680 534",
    coreVault: "M776 310 C 880 310, 900 330, 1000 330",
    coreClaude: "M748 242 C 790 196, 800 140, 845 140",
    claudeVault: "M1010 176 C 1015 215, 1045 228, 1052 262",
  },
  outPaths: {
    notes: "M1048 397 C 1020 440, 950 440, 945 473",
    canvas: "M1068 400 L1065 521",
    biblio: "M1092 397 C 1120 440, 1176 440, 1180 473",
  },
  speed: 250,
}

const MOBILE: Layout = {
  view: [420, 1000],
  stacked: true,
  sources: {
    scholar: { x: 75, y: 62, w: 124, h: 84 },
    openalex: { x: 210, y: 62, w: 124, h: 84 },
    cairn: { x: 345, y: 62, w: 124, h: 84 },
  },
  scan: { x: 210, y: 218, r: 46 },
  scanLabel: { x: 270, y: 222, anchor: "start" },
  core: { x: 210, y: 430, r: 80 },
  vault: { x: 210, y: 800, r: 66 },
  rag: { x: 345, y: 330, w: 140, h: 52 },
  drop: { x: 84, y: 600, w: 152, h: 52 },
  claude: { x: 334, y: 630, w: 164, h: 70 },
  outputs: {
    notes: { x: 76, y: 935, w: 124, h: 40 },
    canvas: { x: 210, y: 958, w: 124, h: 40 },
    biblio: { x: 344, y: 935, w: 128, h: 40 },
  },
  paths: {
    s0: "M75 104 C 75 150, 205 130, 208 172",
    s1: "M210 104 L210 172",
    s2: "M345 104 C 345 150, 215 130, 212 172",
    scanCore: "M210 264 L210 350",
    ragCore: "M345 356 C 345 380, 300 375, 267 374",
    coreDrop: "M153 487 C 115 520, 84 535, 84 574",
    coreClaude: "M267 487 C 305 520, 334 545, 334 595",
    coreVault: "M210 510 L210 734",
    claudeVault: "M334 665 C 334 710, 290 735, 257 753",
  },
  outPaths: {
    notes: "M192 864 C 170 895, 90 890, 76 915",
    canvas: "M210 866 L210 938",
    biblio: "M228 864 C 250 895, 330 890, 344 915",
  },
  speed: 210,
}

const PATH_IDS = Object.keys(DESKTOP.paths) as PathId[]
const PATH_ENDS: Record<PathId, [NodeId, NodeId]> = {
  s0: ["scholar", "scan"],
  s1: ["openalex", "scan"],
  s2: ["cairn", "scan"],
  scanCore: ["scan", "core"],
  ragCore: ["rag", "core"],
  coreDrop: ["core", "drop"],
  coreVault: ["core", "vault"],
  coreClaude: ["core", "claude"],
  claudeVault: ["claude", "vault"],
}

const INFO: Record<NodeId, { kicker: string; title: string; body: string; logos?: LogoId[] }> = {
  scholar: { kicker: "Source 01", title: "Google Scholar", body: "The broadest academic index: articles, theses, books and the citations between them.", logos: ["scholar"] },
  openalex: { kicker: "Source 02", title: "OpenAlex", body: "An open catalogue of the world’s research: works, authors, institutions and topics.", logos: ["openalex"] },
  cairn: { kicker: "Source 03", title: "Cairn.info", body: "French-language journals in the humanities and social sciences, essential for French research on sport and management.", logos: ["cairn"] },
  scan: { kicker: "Collection", title: "Scheduled scan", body: "Runs three times a day and brings in about 90 candidate sources daily from the three databases." },
  rag: { kicker: "Grounding", title: "RAG corpus", body: "Reference documents retrieved at analysis time, so every judgement leans on real material rather than on the model’s memory." },
  core: { kicker: "Local triage", title: "Qwen3 4B · LoRA", body: "A 4-billion-parameter open model, fine-tuned with LoRA and served by Ollama on my own machine, around the clock. It reads every candidate, keeps roughly 5% and summarises the ones that matter most.", logos: ["qwen", "ollama"] },
  drop: { kicker: "Filtered out", title: "~95% dropped", body: "Candidates that do not serve the research question never reach the vault." },
  claude: { kicker: "Escalation", title: "Claude Sonnet 5.5", body: "Called only when an analysis is complex: deeper explanations and visuals. A few cents a month.", logos: ["claude"] },
  vault: { kicker: "Single source of truth", title: "Obsidian vault", body: "Everything lands here: summarised source notes, Canvas mind maps and an up-to-date bibliography.", logos: ["obsidian"] },
}

const SOURCE_SUB = { scholar: "Academic index", openalex: "Open catalogue", cairn: "FR journals" } as const
const OUT_LABEL: Record<OutId, string> = { notes: "Notes", canvas: "Canvas", biblio: "Bibliography" }

function makeDay(): Fate[][] {
  // Five keeps over 90 candidates (~5%), one of them escalated.
  const keeps = [2, 1, 2]
  const escalatePass = 1 + Math.floor(Math.random() * 2)
  return keeps.map((k, pass) => {
    const fates: Fate[] = Array.from({ length: 30 }, () => "drop")
    const slots = Array.from({ length: 30 }, (_, i) => i).sort(() => Math.random() - 0.5).slice(0, k)
    slots.forEach((slot, j) => { fates[slot] = pass === escalatePass && j === 0 ? "escalate" : "keep" })
    return fates
  })
}

type Particle = {
  g: SVGGElement
  dot: SVGCircleElement
  halo: SVGCircleElement
  route: PathId[]
  seg: number
  dist: number
  wait: number
  fade: number
  end: { x: number; y: number }
  fate: Fate
  rag: boolean
  manual: boolean
  dead: boolean
}

export function ThesisMap() {
  const mobile = useIsMobile(768)
  const reduced = useReducedMotion()
  const L = mobile ? MOBILE : DESKTOP
  const uid = useId().replace(/:/g, "")
  const wrapRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const layerRef = useRef<SVGGElement>(null)
  const hudRef = useRef<HTMLDivElement>(null)
  const sendRef = useRef<(fate: Fate) => void>(() => {})
  const [playing, setPlaying] = useState(true)
  const playingRef = useRef(true)
  const [hover, setHover] = useState<NodeId | null>(null)
  const [pinned, setPinned] = useState<NodeId | null>(null)
  const focus = hover ?? pinned

  useEffect(() => { if (reduced) setPlaying(false) }, [reduced])
  useEffect(() => { playingRef.current = playing }, [playing])

  useEffect(() => {
    const svg = svgRef.current
    const layer = layerRef.current
    const wrap = wrapRef.current
    const hudEl = hudRef.current
    if (!svg || !layer || !wrap || !hudEl) return
    const NS = "http://www.w3.org/2000/svg"
    const paths = {} as Record<PathId, { el: SVGPathElement; len: number }>
    for (const id of PATH_IDS) {
      const el = svg.querySelector<SVGPathElement>(`[data-path="${id}"]`)
      if (!el) return
      paths[id] = { el, len: el.getTotalLength() }
    }
    const field = (name: string) => hudEl.querySelector<HTMLElement>(`[data-hud="${name}"]`)
    const counts = { notes: 0, canvas: 0, biblio: 0 }
    // A layout switch keeps the same text nodes, so clear what the previous run wrote.
    svg.querySelectorAll("[data-count]").forEach((el) => { el.textContent = "0" })
    let particles: Particle[] = []
    let sim = 0
    let last = 0
    let raf = 0
    let running = false
    let day = 1
    let pass = 0
    let slot = 0
    let gap = false
    let next = 500
    let plan = makeDay()
    let scanned = 0
    let kept = 0
    let escalated = 0

    const flash = (id: string) => {
      svg.querySelector<SVGElement>(`[data-flash="${id}"]`)?.animate(
        [{ opacity: 0.95, transform: "scale(1)" }, { opacity: 0, transform: "scale(1.28)" }],
        { duration: 760, easing: "cubic-bezier(0.2, 1, 0.3, 1)" }
      )
    }
    const hud = () => {
      const set = (k: string, v: string) => { const el = field(k); if (el) el.textContent = v }
      set("day", String(day).padStart(2, "0"))
      set("pass", String(pass + 1))
      set("scanned", String(scanned))
      set("kept", String(kept))
      set("escalated", String(escalated))
      svg.querySelectorAll("[data-tick]").forEach((t) => t.classList.toggle(styles.tickOn, t.getAttribute("data-tick") === String(pass)))
    }
    const bump = (id: OutId) => {
      counts[id] += 1
      const el = svg.querySelector(`[data-count="${id}"]`)
      if (el) el.textContent = String(counts[id])
      flash(`out-${id}`)
    }
    const paint = (p: Particle) => {
      const tone = p.fate === "drop" ? "drop" : p.fate === "keep" ? "keep" : "escalate"
      p.dot.setAttribute("fill", tone === "drop" ? "#8d8999" : tone === "keep" ? "#9d6bff" : "#d4744f")
      p.halo.setAttribute("fill", `url(#${uid}-halo-${tone})`)
      if (tone === "drop") p.halo.setAttribute("opacity", "0.4")
    }
    const place = (p: Particle) => {
      const seg = paths[p.route[p.seg]]
      const pt = seg.el.getPointAtLength(Math.min(p.dist, seg.len))
      p.g.setAttribute("transform", `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`)
      p.end = { x: pt.x, y: pt.y }
    }
    const spawn = (route: PathId[], fate: Fate, opts: { rag?: boolean; manual?: boolean; label?: string } = {}) => {
      const g = document.createElementNS(NS, "g")
      const halo = document.createElementNS(NS, "circle")
      const dot = document.createElementNS(NS, "circle")
      halo.setAttribute("r", opts.rag ? "6" : opts.manual ? "15" : "9")
      halo.setAttribute("fill", `url(#${uid}-halo-${opts.rag ? "keep" : "paper"})`)
      dot.setAttribute("r", opts.rag ? "1.8" : opts.manual ? "4.2" : "2.7")
      dot.setAttribute("fill", opts.rag ? "#d6c6ff" : "#f2f1ec")
      g.append(halo, dot)
      if (opts.label) {
        const t = document.createElementNS(NS, "text")
        t.textContent = opts.label
        t.setAttribute("y", "-20")
        t.setAttribute("text-anchor", "middle")
        t.setAttribute("class", styles.pLabel)
        g.append(t)
      }
      layer.append(g)
      const p: Particle = { g, dot, halo, route, seg: 0, dist: 0, wait: 0, fade: -1, end: { x: 0, y: 0 }, fate, rag: !!opts.rag, manual: !!opts.manual, dead: false }
      place(p)
      particles.push(p)
    }
    const routeFor = (fate: Fate): PathId[] => {
      const src = (["s0", "s1", "s2"] as const)[Math.floor(Math.random() * 3)]
      return [src, "scanCore", ...(fate === "drop" ? (["coreDrop"] as const) : fate === "keep" ? (["coreVault"] as const) : (["coreClaude", "claudeVault"] as const))]
    }
    const hide = (p: Particle, ms: number) => {
      p.wait = ms
      p.g.style.opacity = "0"
    }
    const advance = (p: Particle) => {
      p.seg += 1
      p.dist = 0
      place(p)
    }
    const remove = (p: Particle) => {
      p.dead = true
      p.g.remove()
    }
    const arrive = (p: Particle) => {
      const done = p.route[p.seg]
      if (p.rag) return remove(p)
      if (done === "s0" || done === "s1" || done === "s2") {
        flash("scan")
        hide(p, 220)
        advance(p)
      } else if (done === "scanCore") {
        flash("core")
        spawn(["ragCore"], "keep", { rag: true })
        hide(p, 340)
        paint(p)
        if (!p.manual && p.fate !== "drop") {
          kept += 1
          if (p.fate === "escalate") escalated += 1
          hud()
        }
        advance(p)
      } else if (done === "coreDrop") {
        flash("drop")
        p.fade = 0
      } else if (done === "coreClaude") {
        flash("claude")
        hide(p, 700)
        advance(p)
      } else {
        flash("vault")
        bump("notes")
        bump("biblio")
        if (done === "claudeVault") bump("canvas")
        remove(p)
      }
    }

    const schedule = () => {
      while (sim >= next) {
        if (gap) {
          gap = false
          slot = 0
          pass += 1
          if (pass === 3) {
            pass = 0
            day += 1
            plan = makeDay()
            scanned = 0
            kept = 0
            escalated = 0
          }
          hud()
          next += 200
          continue
        }
        const fate = plan[pass][slot]
        spawn(routeFor(fate), fate)
        scanned += 1
        slot += 1
        hud()
        if (slot === 30) {
          gap = true
          next += pass === 2 ? 3600 : 2200
        } else {
          next += 85 + Math.random() * 45
        }
      }
    }

    const step = (dt: number) => {
      sim += dt
      schedule()
      for (const p of particles) {
        if (p.dead) continue
        if (p.fade >= 0) {
          p.fade += dt
          const k = Math.min(p.fade / 650, 1)
          p.g.setAttribute("transform", `translate(${p.end.x.toFixed(1)} ${(p.end.y + k * 16).toFixed(1)})`)
          p.g.style.opacity = String(1 - k)
          if (k >= 1) remove(p)
          continue
        }
        if (p.wait > 0) {
          p.wait -= dt
          if (p.wait > 0) continue
          p.g.style.opacity = "1"
        }
        p.dist += (L.speed * dt) / 1000 * (p.rag ? 1.4 : p.manual ? 0.85 : 1)
        if (p.dist >= paths[p.route[p.seg]].len) arrive(p)
        else place(p)
      }
      particles = particles.filter((p) => !p.dead)
    }

    const loop = (now: number) => {
      const dt = last ? Math.min(now - last, 50) : 16
      last = now
      if (playingRef.current && !document.hidden) step(dt)
      raf = requestAnimationFrame(loop)
    }
    const start = () => {
      if (running) return
      running = true
      last = 0
      raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    sendRef.current = (fate: Fate) => {
      spawn(routeFor(fate), fate, { manual: true, label: fate === "escalate" ? "complex" : "routine" })
    }

    hud()
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), { threshold: 0.05 })
    io.observe(wrap)
    return () => {
      io.disconnect()
      stop()
      particles.forEach((p) => p.g.remove())
      particles = []
    }
  }, [L, uid])

  const lit = new Set<NodeId>()
  const wiresOn = new Set<PathId>()
  if (focus) {
    lit.add(focus)
    PATH_IDS.forEach((id) => {
      const [a, b] = PATH_ENDS[id]
      if (a === focus || b === focus) {
        wiresOn.add(id)
        lit.add(a)
        lit.add(b)
      }
    })
  }

  const nodeProps = (id: NodeId) => ({
    className: cn(styles.node, focus && !lit.has(id) && styles.nodeDim, focus === id && styles.nodeOn),
    tabIndex: 0,
    role: "button" as const,
    "aria-label": `${INFO[id].title}. ${INFO[id].body}`,
    "aria-pressed": pinned === id,
    onMouseEnter: () => setHover(id),
    onMouseLeave: () => setHover(null),
    onFocus: () => setHover(id),
    onBlur: () => setHover(null),
    onClick: () => setPinned((p) => (p === id ? null : id)),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key !== "Enter" && e.key !== " ") return
      e.preventDefault()
      setPinned((p) => (p === id ? null : id))
    },
  })

  const rectOf = (b: Box, extra = 0) => ({ x: b.x - b.w / 2 - extra, y: b.y - b.h / 2 - extra, width: b.w + extra * 2, height: b.h + extra * 2 })
  const info = focus ? INFO[focus] : null
  const sendManual = (fate: Fate) => {
    setPlaying(true)
    sendRef.current(fate)
  }

  return (
    <div className={styles.mapBlock}>
      <div ref={wrapRef} className={cn(styles.mapFrame, styles.dots)}>
        <div ref={hudRef} className={styles.hud} aria-hidden="true">
          <div className={styles.hudTop}>
            <span className={styles.hudTag}>Sim</span>
            <span>Day <b data-hud="day">01</b></span>
            <span>Pass <b data-hud="pass">1</b>/3</span>
          </div>
          <div className={styles.hudRow}>
            <span>Scanned <b data-hud="scanned">0</b>/90</span>
            <span>Kept <b data-hud="kept" className={styles.hudKeep}>0</b></span>
            <span>Escalated <b data-hud="escalated" className={styles.hudEsc}>0</b></span>
          </div>
        </div>

        <svg
          ref={svgRef}
          viewBox={`0 0 ${L.view[0]} ${L.view[1]}`}
          className={styles.mapSvg}
          data-stacked={L.stacked}
          role="group"
          aria-label="Thesis Engine system map: three sources feed a scheduled scan, a local Qwen3 4B model triages every candidate, complex ones go to Claude Sonnet 5.5, and the results are written into an Obsidian vault."
        >
          <defs>
            {[
              ["paper", "242,241,236"],
              ["keep", "157,107,255"],
              ["escalate", "212,116,79"],
              ["drop", "141,137,153"],
            ].map(([k, rgb]) => (
              <radialGradient key={k} id={`${uid}-halo-${k}`}>
                <stop offset="0%" stopColor={`rgb(${rgb})`} stopOpacity="0.75" />
                <stop offset="100%" stopColor={`rgb(${rgb})`} stopOpacity="0" />
              </radialGradient>
            ))}
            <radialGradient id={`${uid}-core`} cx="50%" cy="40%" r="65%">
              <stop offset="0%" stopColor="#2a1c4a" />
              <stop offset="100%" stopColor="#110c1c" />
            </radialGradient>
          </defs>

          {/* Wires */}
          {PATH_IDS.map((id) => (
            <g key={id}>
              <path d={L.paths[id]} className={cn(styles.wire, id === "ragCore" && styles.wireRag, id.startsWith("coreClaude") || id === "claudeVault" ? styles.wireCoral : undefined, id === "coreDrop" && styles.wireDrop, wiresOn.has(id) && styles.wireOn, focus && !wiresOn.has(id) && styles.wireDim)} />
              <path d={L.paths[id]} data-path={id} className={cn(styles.wireFlow, id === "ragCore" && styles.wireFlowRag, focus && !wiresOn.has(id) && styles.wireDim)} />
            </g>
          ))}
          {(Object.keys(L.outPaths) as OutId[]).map((id) => (
            <path key={id} d={L.outPaths[id]} className={cn(styles.wire, styles.wireOut, focus && focus !== "vault" && styles.wireDim)} />
          ))}

          {/* Particles live between the wires and the nodes */}
          <g ref={layerRef} className={styles.particles} />

          {/* Sources */}
          {(["scholar", "openalex", "cairn"] as const).map((id) => {
            const b = L.sources[id]
            const left = b.x - b.w / 2
            return (
              <g key={id} {...nodeProps(id)}>
                <rect {...rectOf(b)} rx={12} className={styles.tile} />
                <rect {...rectOf(b, 4)} rx={15} className={styles.flash} data-flash={id} />
                {L.stacked ? (
                  <>
                    <LogoGlyph id={id} cx={b.x} cy={b.y - 14} size={26} tone="brand" />
                    <text x={b.x} y={b.y + 26} textAnchor="middle" className={cn(styles.t, styles.tName)}>{INFO[id].title.replace(".info", "")}</text>
                  </>
                ) : (
                  <>
                    <LogoGlyph id={id} cx={left + 34} cy={b.y} size={28} tone="brand" />
                    <text x={left + 62} y={b.y - 2} className={cn(styles.t, styles.tName)}>{INFO[id].title}</text>
                    <text x={left + 62} y={b.y + 16} className={cn(styles.t, styles.tSub)}>{SOURCE_SUB[id]}</text>
                  </>
                )}
              </g>
            )
          })}

          {/* Scan */}
          <g {...nodeProps("scan")}>
            <circle cx={L.scan.x} cy={L.scan.y} r={L.scan.r} className={styles.tile} />
            <circle cx={L.scan.x} cy={L.scan.y} r={L.scan.r + 4} className={styles.flash} data-flash="scan" />
            <g className={styles.spin} style={{ transformOrigin: `${L.scan.x}px ${L.scan.y}px` }}>
              <path d={`M${L.scan.x} ${L.scan.y - L.scan.r - 9} A ${L.scan.r + 9} ${L.scan.r + 9} 0 0 1 ${L.scan.x + (L.scan.r + 9) * 0.866} ${L.scan.y - (L.scan.r + 9) * 0.5}`} className={styles.sweep} />
            </g>
            {[0, 1, 2].map((i) => {
              const a = -Math.PI / 2 + (i * Math.PI * 2) / 3
              const r1 = L.scan.r + 6
              const r2 = L.scan.r + 14
              return <line key={i} data-tick={i} x1={L.scan.x + Math.cos(a) * r1} y1={L.scan.y + Math.sin(a) * r1} x2={L.scan.x + Math.cos(a) * r2} y2={L.scan.y + Math.sin(a) * r2} className={styles.tick} />
            })}
            <text x={L.scan.x} y={L.scan.y + 6} textAnchor="middle" className={styles.tSerif}>×3</text>
            <text x={L.scan.x} y={L.scan.y + 26} textAnchor="middle" className={cn(styles.t, styles.tMicro)}>PER DAY</text>
            <text x={L.scanLabel.x} y={L.scanLabel.y} textAnchor={L.scanLabel.anchor} className={cn(styles.t, styles.tSub)}>≈ 90 sources / day</text>
          </g>

          {/* RAG */}
          <g {...nodeProps("rag")}>
            <rect {...rectOf(L.rag)} rx={12} className={cn(styles.tile, styles.tileRag)} />
            <rect {...rectOf(L.rag, 4)} rx={15} className={styles.flash} data-flash="rag" />
            <g transform={`translate(${L.rag.x - L.rag.w / 2 + 22} ${L.rag.y - 11})`} className={styles.docIcon}>
              <rect x="0" y="4" width="14" height="18" rx="2" />
              <rect x="5" y="0" width="14" height="18" rx="2" />
            </g>
            <text x={L.rag.x - L.rag.w / 2 + 50} y={L.rag.y - (L.stacked ? 2 : 1)} className={cn(styles.t, styles.tName)}>RAG corpus</text>
            <text x={L.rag.x - L.rag.w / 2 + 50} y={L.rag.y + 15} className={cn(styles.t, styles.tSub)}>{L.stacked ? "grounding" : "reference documents"}</text>
          </g>

          {/* Core */}
          <g {...nodeProps("core")}>
            <circle cx={L.core.x} cy={L.core.y} r={L.core.r + 16} className={styles.coreAura} />
            <g className={styles.spinSlow} style={{ transformOrigin: `${L.core.x}px ${L.core.y}px` }}>
              <circle cx={L.core.x} cy={L.core.y} r={L.core.r + 12} className={styles.coreOrbit} />
            </g>
            <circle cx={L.core.x} cy={L.core.y} r={L.core.r} fill={`url(#${uid}-core)`} className={styles.coreBody} />
            <circle cx={L.core.x} cy={L.core.y} r={L.core.r + 4} className={styles.flash} data-flash="core" />
            <LogoGlyph id="qwen" cx={L.core.x - 22} cy={L.core.y - 30} size={L.stacked ? 26 : 30} tone="brand" />
            <LogoGlyph id="ollama" cx={L.core.x + 22} cy={L.core.y - 30} size={L.stacked ? 26 : 30} className={styles.glyphPaper} />
            <text x={L.core.x} y={L.core.y + 14} textAnchor="middle" className={cn(styles.t, styles.tCore)}>QWEN3 4B</text>
            <text x={L.core.x} y={L.core.y + 34} textAnchor="middle" className={cn(styles.t, styles.tMicro)}>LoRA · RAG · OLLAMA</text>
            <text x={L.core.x} y={L.core.y + 50} textAnchor="middle" className={cn(styles.t, styles.tMicro, styles.tViolet)}>LOCAL · 24/7</text>
          </g>

          {/* Drop */}
          <g {...nodeProps("drop")}>
            <rect {...rectOf(L.drop)} rx={12} className={cn(styles.tile, styles.tileDrop)} />
            <rect {...rectOf(L.drop, 4)} rx={15} className={cn(styles.flash, styles.flashDim)} data-flash="drop" />
            <text x={L.drop.x - L.drop.w / 2 + 22} y={L.drop.y + 6} className={cn(styles.t, styles.tCross)}>×</text>
            <text x={L.drop.x - L.drop.w / 2 + 44} y={L.drop.y - 1} className={cn(styles.t, styles.tName, styles.tMuted)}>{L.stacked ? "Dropped ~95%" : "Dropped · ~95%"}</text>
            <text x={L.drop.x - L.drop.w / 2 + 44} y={L.drop.y + 15} className={cn(styles.t, styles.tSub)}>{L.stacked ? "off-topic" : "not relevant enough"}</text>
          </g>

          {/* Claude */}
          <g {...nodeProps("claude")}>
            <rect {...rectOf(L.claude)} rx={12} className={cn(styles.tile, styles.tileCoral)} />
            <rect {...rectOf(L.claude, 4)} rx={15} className={cn(styles.flash, styles.flashCoral)} data-flash="claude" />
            <LogoGlyph id="claude" cx={L.claude.x - L.claude.w / 2 + 32} cy={L.claude.y} size={L.stacked ? 26 : 30} tone="brand" />
            <text x={L.claude.x - L.claude.w / 2 + 58} y={L.claude.y - 4} className={cn(styles.t, styles.tName)}>{L.stacked ? "Sonnet 5.5" : "Claude Sonnet 5.5"}</text>
            <text x={L.claude.x - L.claude.w / 2 + 58} y={L.claude.y + 14} className={cn(styles.t, styles.tSub, styles.tCoral)}>{L.stacked ? "if complex" : "complex analyses only"}</text>
          </g>

          {/* Vault */}
          <g {...nodeProps("vault")}>
            <circle cx={L.vault.x} cy={L.vault.y} r={L.vault.r + 14} className={styles.vaultAura} />
            <circle cx={L.vault.x} cy={L.vault.y} r={L.vault.r} className={cn(styles.tile, styles.tileVault)} />
            <circle cx={L.vault.x} cy={L.vault.y} r={L.vault.r + 4} className={styles.flash} data-flash="vault" />
            <LogoGlyph id="obsidian" cx={L.vault.x} cy={L.vault.y - 14} size={L.stacked ? 36 : 42} tone="brand" />
            <text x={L.vault.x} y={L.vault.y + 24} textAnchor="middle" className={cn(styles.t, styles.tName)}>Obsidian</text>
            <text x={L.vault.x} y={L.vault.y + 40} textAnchor="middle" className={cn(styles.t, styles.tMicro)}>VAULT</text>
          </g>

          {/* Outputs */}
          {(Object.keys(L.outputs) as OutId[]).map((id) => {
            const b = L.outputs[id]
            return (
              <g key={id} className={cn(styles.out, focus && focus !== "vault" && styles.nodeDim)}>
                <rect {...rectOf(b)} rx={b.h / 2} className={styles.outPill} />
                <rect {...rectOf(b, 3)} rx={b.h / 2 + 3} className={styles.flash} data-flash={`out-${id}`} />
                <text x={b.x - b.w / 2 + 16} y={b.y + 4} className={cn(styles.t, styles.tOut)}>{OUT_LABEL[id]}</text>
                {id !== "biblio" && <text x={b.x + b.w / 2 - 14} y={b.y + 4} textAnchor="end" className={cn(styles.t, styles.tOutCount)} data-count={id}>0</text>}
                {id === "biblio" && !L.stacked && <text x={b.x + b.w / 2 - 14} y={b.y + 4} textAnchor="end" className={cn(styles.t, styles.tOutCount)}>↻</text>}
              </g>
            )
          })}
        </svg>
      </div>

      <div className={styles.mapBelow}>
        <div className={styles.controls}>
          <div className={styles.ctrlRow}>
            <button type="button" className={styles.ctrlBtn} onClick={() => setPlaying((p) => !p)} aria-pressed={!playing}>
              <span aria-hidden="true">{playing ? "❚❚" : "▶"}</span> {playing ? "Pause" : reduced ? "Play simulation" : "Play"}
            </button>
            <button type="button" className={styles.ctrlBtn} onClick={() => sendManual("keep")}>
              <span className={styles.lgKeep} aria-hidden="true" /> Send a routine source
            </button>
            <button type="button" className={styles.ctrlBtn} onClick={() => sendManual("escalate")}>
              <span className={styles.lgEsc} aria-hidden="true" /> Send a complex source
            </button>
          </div>
          <ul className={styles.legend} aria-label="Legend">
            <li><span className={styles.lgPaper} aria-hidden="true" />Candidate</li>
            <li><span className={styles.lgKeep} aria-hidden="true" />Kept → vault</li>
            <li><span className={styles.lgEsc} aria-hidden="true" />Escalated → Sonnet</li>
            <li><span className={styles.lgDrop} aria-hidden="true" />Dropped</li>
          </ul>
          <p className={styles.simNote}>Simulation at the pipeline’s real rates: about 90 candidates a day over three passes, roughly 5% kept. The escalation frequency is illustrative.</p>
        </div>

        <div className={styles.detail} aria-live="polite">
          {info ? (
            <>
              <div className={styles.detailTop}>
                <span className={styles.detailKicker}>{info.kicker}</span>
                {info.logos && (
                  <span className={styles.detailLogos}>
                    {info.logos.map((l) => <Logo key={l} id={l} tone={l === "ollama" || l === "openalex" ? "mono" : "brand"} className={styles.detailLogo} />)}
                  </span>
                )}
              </div>
              <h3 className={styles.detailTitle}>{info.title}</h3>
              <p className={styles.detailBody}>{info.body}</p>
              {pinned && <button type="button" className={styles.detailClose} onClick={() => setPinned(null)}>Unpin ×</button>}
            </>
          ) : (
            <>
              <span className={styles.detailKicker}>Inspect the engine</span>
              <h3 className={styles.detailTitle}>Hover, tap or tab through any node.</h3>
              <ol className={styles.steps}>
                <li><b>01</b> Scan three databases, three times a day</li>
                <li><b>02</b> Triage locally with a fine-tuned Qwen3 4B</li>
                <li><b>03</b> Escalate complex analyses to Claude Sonnet 5.5</li>
                <li><b>04</b> Write notes, canvases and bibliography to the vault</li>
              </ol>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
