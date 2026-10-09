"use client"

import { useEffect, useRef } from "react"

/* ------------------------------------------------------------------
   THESIS ENGINE — hero backdrop. A living graph view in the spirit of
   Obsidian: one cluster per concept of the research question, sources
   pulsing in along the links, neighbours lit up under the pointer.
   ------------------------------------------------------------------ */

const CONCEPTS = [
  { label: "Generative AI", x: 0.6, y: 0.2 },
  { label: "No-code tools", x: 0.85, y: 0.24 },
  { label: "Professionalisation", x: 0.72, y: 0.47 },
  { label: "Organisational efficiency", x: 0.9, y: 0.6 },
  { label: "Limited resources", x: 0.52, y: 0.4 },
  { label: "Sport associations", x: 0.78, y: 0.78 },
]
const CONCEPT_LINKS = [[0, 1], [0, 4], [1, 2], [2, 3], [2, 4], [3, 5], [4, 5], [1, 3], [2, 5]]

type Node = { bx: number; by: number; x: number; y: number; r: number; amp: number; phase: number; speed: number; kind: "hub" | "leaf" | "field"; kept: boolean; label?: string; links: number[] }
type Edge = { a: number; b: number; kind: "hub" | "leaf" | "field" }
type Pulse = { edge: number; from: number; t0: number; dur: number }

function rng(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildGraph(w: number, h: number) {
  const rand = rng(1907)
  const gauss = () => (rand() + rand() + rand() - 1.5) / 1.5
  const nodes: Node[] = []
  const edges: Edge[] = []
  const add = (n: Omit<Node, "x" | "y" | "links" | "amp" | "phase" | "speed">) => {
    nodes.push({ ...n, x: n.bx, y: n.by, links: [], amp: 2 + rand() * 5, phase: rand() * Math.PI * 2, speed: 0.25 + rand() * 0.35 })
    return nodes.length - 1
  }
  const link = (a: number, b: number, kind: Edge["kind"]) => {
    edges.push({ a, b, kind })
    nodes[a].links.push(edges.length - 1)
    nodes[b].links.push(edges.length - 1)
  }
  const narrow = w < 768
  const spread = Math.min(w, h) * (narrow ? 0.16 : 0.13)
  const perCluster = narrow ? 8 : 14
  const hubs = CONCEPTS.map((c) => add({ bx: (narrow ? 0.15 + c.x * 0.8 : c.x) * w, by: c.y * h, r: 5.5, kind: "hub", kept: false, label: c.label }))
  const leaves: number[][] = hubs.map(() => [])
  hubs.forEach((hub, ci) => {
    for (let i = 0; i < perCluster; i++) {
      const id = add({ bx: nodes[hub].bx + gauss() * spread, by: nodes[hub].by + gauss() * spread, r: 1.6 + rand() * 1.6, kind: "leaf", kept: rand() < 0.09 })
      link(hub, id, "leaf")
      leaves[ci].push(id)
    }
    // A few sideways links inside the cluster.
    leaves[ci].forEach((a, i) => {
      if (rand() < 0.35) link(a, leaves[ci][(i + 1 + Math.floor(rand() * 3)) % leaves[ci].length], "leaf")
    })
  })
  CONCEPT_LINKS.forEach(([a, b]) => link(hubs[a], hubs[b], "hub"))
  // Loose sources across the frame, some of them wired into a concept.
  const fieldCount = Math.round((w * h) / (narrow ? 26000 : 19000))
  for (let i = 0; i < fieldCount; i++) {
    const id = add({ bx: rand() * w, by: rand() * h, r: 0.9 + rand() * 1.2, kind: "field", kept: false })
    if (rand() < 0.42) {
      let best = -1
      let bestD = Infinity
      leaves.flat().forEach((l) => {
        const d = Math.hypot(nodes[l].bx - nodes[id].bx, nodes[l].by - nodes[id].by)
        if (d < bestD) { bestD = d; best = l }
      })
      if (best >= 0 && bestD < Math.max(w, h) * 0.32) link(id, best, "field")
    }
  }
  // Degree drives size, as in a graph view.
  nodes.forEach((n) => { if (n.kind !== "field") n.r += Math.min(n.links.length, 12) * 0.22 })
  return { nodes, edges }
}

export function ThesisBackdrop() {
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const el = wrap.current
    const cv = canvas.current
    const ctx = cv?.getContext("2d")
    if (!el || !cv || !ctx) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const mono = getComputedStyle(el).getPropertyValue("--font-mono").trim() || "monospace"
    let w = 0
    let h = 0
    let graph = buildGraph(1, 1)
    let pulses: Pulse[] = []
    let lastPulse = 0
    let raf = 0
    let visible = true
    const pointer = { x: -9999, y: -9999 }
    let hovered = -1
    let hoverMix = 0

    const resize = () => {
      const rect = el.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = rect.width
      h = rect.height
      cv.width = Math.round(w * dpr)
      cv.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      graph = buildGraph(w, h)
      pulses = []
      if (reduce) draw(0)
    }

    const neighbours = (i: number) => {
      const set = new Set<number>([i])
      graph.nodes[i].links.forEach((e) => { set.add(graph.edges[e].a); set.add(graph.edges[e].b) })
      return set
    }

    const draw = (t: number) => {
      const { nodes, edges } = graph
      const time = t / 1000
      for (const n of nodes) {
        n.x = n.bx + Math.sin(time * n.speed + n.phase) * n.amp
        n.y = n.by + Math.cos(time * n.speed * 0.8 + n.phase) * n.amp
      }

      // Hover: nearest node under the pointer lights its neighbourhood.
      let near = -1
      let nearD = 30
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].kind === "field") continue
        const d = Math.hypot(nodes[i].x - pointer.x, nodes[i].y - pointer.y)
        if (d < nearD) { nearD = d; near = i }
      }
      if (near >= 0) hovered = near
      hoverMix += ((near >= 0 ? 1 : 0) - hoverMix) * 0.12
      const lit = hovered >= 0 && hoverMix > 0.01 ? neighbours(hovered) : null
      const dimFor = (i: number) => (lit && !lit.has(i) ? 1 - hoverMix * 0.7 : 1)

      ctx.clearRect(0, 0, w, h)

      for (let i = 0; i < edges.length; i++) {
        const e = edges[i]
        const a = nodes[e.a]
        const b = nodes[e.b]
        const on = lit && lit.has(e.a) && lit.has(e.b) && (e.a === hovered || e.b === hovered)
        const base = e.kind === "hub" ? 0.22 : e.kind === "leaf" ? 0.14 : 0.07
        ctx.strokeStyle = on ? `rgba(157,107,255,${0.35 + hoverMix * 0.5})` : `rgba(201,182,255,${base * Math.min(dimFor(e.a), dimFor(e.b))})`
        ctx.lineWidth = on ? 1.4 : e.kind === "hub" ? 1 : 0.7
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }

      // Pulses: sources travelling towards the concepts.
      if (!reduce && t - lastPulse > 260 && edges.length) {
        lastPulse = t
        const pick = edges.length > 0 ? Math.floor(Math.random() * edges.length) : 0
        const e = edges[pick]
        const from = nodes[e.a].kind === "hub" ? e.b : e.a
        pulses.push({ edge: pick, from, t0: t, dur: 1100 + Math.random() * 900 })
      }
      pulses = pulses.filter((p) => t - p.t0 < p.dur)
      for (const p of pulses) {
        const e = edges[p.edge]
        const a = nodes[p.from]
        const b = nodes[p.from === e.a ? e.b : e.a]
        const k = (t - p.t0) / p.dur
        const x = a.x + (b.x - a.x) * k
        const y = a.y + (b.y - a.y) * k
        const alpha = Math.sin(k * Math.PI)
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 9)
        glow.addColorStop(0, `rgba(196,176,255,${0.9 * alpha})`)
        glow.addColorStop(1, "rgba(157,107,255,0)")
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(x, y, 9, 0, Math.PI * 2)
        ctx.fill()
      }

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        const dim = dimFor(i)
        const isHover = i === hovered && hoverMix > 0.05
        if (n.kept || n.kind === "hub" || isHover) {
          const halo = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * (n.kind === "hub" ? 5 : 6))
          halo.addColorStop(0, n.kept || isHover ? `rgba(157,107,255,${0.45 * dim})` : `rgba(242,241,236,${0.12 * dim})`)
          halo.addColorStop(1, "rgba(157,107,255,0)")
          ctx.fillStyle = halo
          ctx.beginPath()
          ctx.arc(n.x, n.y, n.r * (n.kind === "hub" ? 5 : 6), 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.fillStyle = n.kept || isHover ? `rgba(176,140,255,${dim})` : n.kind === "field" ? `rgba(242,241,236,${0.32 * dim})` : `rgba(242,241,236,${(n.kind === "hub" ? 0.92 : 0.62) * dim})`
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fill()
      }

      if (w >= 640) {
        ctx.font = `10px ${mono}`
        ctx.textAlign = "center"
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i]
          if (!n.label) continue
          const on = lit?.has(i)
          ctx.fillStyle = on && hoverMix > 0.05 ? "rgba(214,198,255,0.95)" : `rgba(242,241,236,${0.42 * dimFor(i)})`
          ctx.fillText(n.label.toUpperCase(), n.x, n.y + n.r + 16)
        }
      }
    }

    const loop = (t: number) => {
      if (visible && !document.hidden) draw(t)
      raf = requestAnimationFrame(loop)
    }

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      pointer.x = e.clientX - rect.left
      pointer.y = e.clientY - rect.top
    }
    const onLeave = () => { pointer.x = -9999; pointer.y = -9999 }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(el)
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting }, { threshold: 0 })
    io.observe(el)
    if (!reduce) {
      raf = requestAnimationFrame(loop)
      window.addEventListener("pointermove", onMove, { passive: true })
      document.addEventListener("pointerleave", onLeave)
    }
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener("pointermove", onMove)
      document.removeEventListener("pointerleave", onLeave)
    }
  }, [])

  return (
    <div ref={wrap} className="absolute inset-0 bg-[#08070c]" aria-hidden="true">
      <div className="absolute inset-0 opacity-70" style={{ background: "radial-gradient(ellipse at 78% 30%, rgba(157,107,255,0.22), transparent 55%), radial-gradient(ellipse at 20% 90%, rgba(228,139,103,0.08), transparent 50%)" }} />
      <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(rgba(242,241,236,0.07) 1px, transparent 1.4px)", backgroundSize: "24px 24px" }} />
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" />
    </div>
  )
}
