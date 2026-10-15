"use client"

import { useEffect, useRef, type RefObject } from "react"
import { GLYPHS } from "@/components/home/matrix-portrait"
import styles from "./dossier.module.css"

/* ------------------------------------------------------------------
   MATRIX TITLE — writes a heading in code, the way the home intro
   writes Jules's name: rain sweeps across the screen from left to
   right, and every drop that crosses a letter leaves it lit in glyphs.
   The real heading stays in the page, transparent, for screen readers
   and selection; this canvas draws exactly over it.
   ------------------------------------------------------------------ */

type Line = { text: string; color: string }

const FPS = 30
/** The sweep, in seconds: when it starts, how long it takes across the screen, how fast a drop falls the full height. */
const SWEEP = { start: 0.05, span: 1.1, jitter: 0.12, cross: 0.6 }
/** However slow the device, the heading is complete this long after the sweep starts. */
const WRITE_S = 2.2
const MIRRORED = /[ｦ-ﾝ]/

type Drop = { head: number; speed: number; trail: number } | null

export function MatrixTitle({ heading, lines, onWritten }: { heading: RefObject<HTMLElement | null>; lines: Line[]; onWritten?: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const written = useRef(onWritten)
  written.current = onWritten

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext("2d")
    const host = canvas?.parentElement
    const title = heading.current
    if (!canvas || !ctx || !host || !title) return
    const root = getComputedStyle(document.documentElement)
    const mono = root.getPropertyValue("--font-mono").trim() || "monospace"
    const atlas = document.createElement("canvas")
    const glow = document.createElement("canvas")
    const layers = lines.map(() => document.createElement("canvas"))
    const bloom = [document.createElement("canvas"), document.createElement("canvas")]

    let cols = 0, rows = 0, cell = 0, total = 0, locked = 0, writtenAt = 0
    let lineOf = new Int8Array(0), edges = new Uint8Array(0), glyphs = new Uint8Array(0)
    let lockedAt = new Float64Array(0)
    let cells: number[] = []
    let drops: Drop[] = []
    let begin = 0, frame = 0, last = 0, ready = false

    function setup() {
      if (!canvas || !host || !title) return
      const dpr = Math.min(devicePixelRatio || 1, 2)
      const W = host.clientWidth, H = host.clientHeight
      if (!W || !H) return
      const style = getComputedStyle(title)
      const fs = parseFloat(style.fontSize)
      const size = Math.max(5, Math.round(fs / 11))
      cell = size * dpr
      cols = Math.ceil(W / size)
      rows = Math.ceil(H / size)
      for (const c of [canvas, glow, ...layers]) { c.width = cols * cell; c.height = rows * cell }
      bloom[0].width = Math.ceil(canvas.width / 4)
      bloom[0].height = Math.ceil(canvas.height / 4)
      bloom[1].width = Math.ceil(bloom[0].width / 4)
      bloom[1].height = Math.ceil(bloom[0].height / 4)
      canvas.style.width = `${cols * size}px`
      canvas.style.height = `${rows * size}px`

      // The heading's lines, set where the transparent heading sits.
      const box = title.getBoundingClientRect(), frameBox = host.getBoundingClientRect()
      const lineHeight = (parseFloat(style.lineHeight) || fs * 0.9) * dpr
      const centre = (box.left - frameBox.left + box.width / 2) * dpr
      const top = (box.top - frameBox.top) * dpr
      const setFont = (g: CanvasRenderingContext2D) => {
        g.font = `${style.fontWeight} ${fs * dpr}px ${style.fontFamily}`
        g.fontStretch = "semi-expanded"
        if ("letterSpacing" in g) g.letterSpacing = `${(parseFloat(style.letterSpacing) || 0) * dpr}px`
        g.textAlign = "center"
        g.textBaseline = "middle"
      }
      const paint = (g: CanvasRenderingContext2D, colour: (k: number) => string) => {
        setFont(g)
        lines.forEach((line, k) => {
          g.fillStyle = colour(k)
          g.fillText(line.text, centre, top + lineHeight * (k + 0.5))
        })
      }

      // Which cells belong to which line: each line drawn in its own channel, three samples a side per cell.
      const K = 3
      const mask = document.createElement("canvas")
      mask.width = cols * cell
      mask.height = rows * cell
      paint(mask.getContext("2d")!, k => (k ? "rgb(0,255,0)" : "rgb(255,0,0)"))
      const sample = document.createElement("canvas")
      sample.width = cols * K
      sample.height = rows * K
      const s = sample.getContext("2d", { willReadFrequently: true })!
      s.imageSmoothingQuality = "high"
      s.drawImage(mask, 0, 0, sample.width, sample.height)
      const data = s.getImageData(0, 0, sample.width, sample.height).data
      lineOf = new Int8Array(cols * rows).fill(-1)
      cells = []
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let red = 0, green = 0
          for (let y = 0; y < K; y++) for (let x = 0; x < K; x++) {
            const i = ((r * K + y) * sample.width + c * K + x) * 4
            red += data[i]; green += data[i + 1]
          }
          const n = K * K * 255
          const k = red / n > 0.42 ? 0 : green / n > 0.42 ? 1 : -1
          if (k >= 0) { lineOf[r * cols + c] = k; cells.push(r * cols + c) }
        }
      }
      total = cells.length
      edges = new Uint8Array(cols * rows)
      for (const i of cells) {
        const c = i % cols
        if (c === 0 || c === cols - 1 || i < cols || i >= cols * (rows - 1)) continue
        if (lineOf[i - 1] < 0 || lineOf[i + 1] < 0 || lineOf[i - cols] < 0 || lineOf[i + cols] < 0) edges[i] = 1
      }

      // The solid heading, glowing, behind its glyphs.
      const g = glow.getContext("2d")!
      g.shadowBlur = 34 * dpr
      paint(g, k => { g.shadowColor = lines[k].color; return lines[k].color })

      atlas.width = GLYPHS.length * cell
      atlas.height = cell
      const a = atlas.getContext("2d")!
      a.font = `600 ${Math.round(cell * 0.92)}px ${mono}`
      a.textAlign = "center"
      a.textBaseline = "middle"
      a.fillStyle = "#fff"
      GLYPHS.forEach((char, i) => {
        a.save()
        a.translate(i * cell + cell / 2, cell / 2)
        if (MIRRORED.test(char)) a.scale(-1, 1)
        a.fillText(char, 0, 0)
        a.restore()
      })
      glyphs = Uint8Array.from({ length: cols * rows }, () => Math.floor(Math.random() * GLYPHS.length))

      lockedAt = new Float64Array(cols * rows)
      locked = 0
      if (writtenAt) {
        // Resized once written: the heading comes back whole, without a new sweep.
        for (const i of cells) { lockedAt[i] = 1; locked++ }
        drops = []
      } else {
        drops = Array.from({ length: cols }, (_, c) => {
          const delay = SWEEP.start + (c / cols) * SWEEP.span + Math.random() * SWEEP.jitter
          const speed = rows / (SWEEP.cross + Math.random() * 0.15)
          return { head: -delay * speed, speed, trail: 8 + Math.random() * 16 }
        })
      }
      ready = true
    }

    function lock(i: number, now: number) {
      if (lineOf[i] < 0 || lockedAt[i]) return
      lockedAt[i] = now
      if (++locked === total) {
        writtenAt = now
        written.current?.()
      }
    }

    function draw(now: number, dt: number) {
      if (!canvas || !ctx) return
      for (let c = 0; c < cols; c++) {
        const drop = drops[c]
        if (!drop) continue
        const from = Math.max(0, Math.floor(drop.head))
        drop.head += drop.speed * dt
        const to = Math.min(rows - 1, Math.floor(drop.head))
        for (let r = from; r <= to; r++) lock(r * cols + c, now)
        // The rain passes once: the screen stays calm afterwards.
        if (drop.head - drop.trail > rows) drops[c] = null
      }
      if (locked < total && now - begin > WRITE_S * 1000) for (const i of cells) lock(i, now)
      for (const i of cells) if (Math.random() < 0.02) glyphs[i] = Math.floor(Math.random() * GLYPHS.length)

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const lit = total ? locked / total : 0
      let halo = 0.3 * lit
      if (writtenAt) {
        const age = (now - writtenAt) / 1000
        halo += 0.05 * Math.sin(age * 1.4) ** 2 + 0.5 * Math.max(0, 1 - age / 0.6)
      }
      ctx.globalAlpha = Math.min(1, halo)
      ctx.drawImage(glow, 0, 0)

      // Glyphs per line, drawn white then tinted to the line's colour; the rain's trails go with the last line's acid.
      const accents = layers.map(layer => {
        const g = layer.getContext("2d")!
        g.globalCompositeOperation = "source-over"
        g.clearRect(0, 0, layer.width, layer.height)
        return g
      })
      const put = (g: CanvasRenderingContext2D, i: number, alpha: number) => {
        g.globalAlpha = alpha
        g.drawImage(atlas, glyphs[i] * cell, 0, cell, cell, (i % cols) * cell, Math.floor(i / cols) * cell, cell, cell)
      }
      const rain = accents[accents.length - 1]
      for (let c = 0; c < cols; c++) {
        const drop = drops[c]
        if (!drop) continue
        const topRow = Math.max(0, Math.ceil(drop.head - drop.trail)), bottom = Math.min(rows - 1, Math.floor(drop.head))
        for (let r = topRow; r <= bottom; r++) {
          const i = r * cols + c
          if (lockedAt[i]) continue
          const alpha = (1 - (drop.head - r) / drop.trail) * 0.45
          if (alpha >= 0.03) put(rain, i, alpha)
        }
      }
      for (const i of cells) if (lockedAt[i]) put(accents[lineOf[i]], i, edges[i] ? 1 : 0.82)
      layers.forEach((layer, k) => {
        const g = accents[k]
        g.globalAlpha = 1
        g.globalCompositeOperation = "source-in"
        g.fillStyle = lines[k].color
        g.fillRect(0, 0, layer.width, layer.height)
        ctx.drawImage(layer, 0, 0)
      })

      // Drop heads stay white, and so does each letter cell for a moment as it locks.
      ctx.globalAlpha = 0.85
      for (let c = 0; c < cols; c++) {
        const drop = drops[c]
        const r = drop ? Math.floor(drop.head) : -1
        if (r >= 0 && r < rows) ctx.drawImage(atlas, glyphs[r * cols + c] * cell, 0, cell, cell, c * cell, r * cell, cell, cell)
      }
      for (const i of cells) {
        const age = now - lockedAt[i]
        if (!lockedAt[i] || age > 180) continue
        ctx.globalAlpha = 1 - age / 180
        ctx.drawImage(atlas, glyphs[i] * cell, 0, cell, cell, (i % cols) * cell, Math.floor(i / cols) * cell, cell, cell)
      }

      // Bloom: the frame, shrunk twice and stretched back, glows over itself.
      const [b0, b1] = bloom
      const s0 = b0.getContext("2d")!, s1 = b1.getContext("2d")!
      s0.imageSmoothingQuality = s1.imageSmoothingQuality = "high"
      s0.clearRect(0, 0, b0.width, b0.height)
      s0.drawImage(canvas, 0, 0, b0.width, b0.height)
      s1.clearRect(0, 0, b1.width, b1.height)
      s1.drawImage(b0, 0, 0, b1.width, b1.height)
      ctx.globalCompositeOperation = "lighter"
      ctx.globalAlpha = 0.35
      ctx.drawImage(b0, 0, 0, canvas.width, canvas.height)
      ctx.globalAlpha = 0.45
      ctx.drawImage(b1, 0, 0, canvas.width, canvas.height)
      ctx.globalCompositeOperation = "source-over"
      ctx.globalAlpha = 1
    }

    function loop(now: number) {
      frame = requestAnimationFrame(loop)
      if (!ready || now - last < 1000 / FPS) return
      const dt = last ? Math.min((now - last) / 1000, 0.25) : 0
      last = now
      if (!begin) begin = now
      draw(now, dt)
    }

    let cancelled = false
    let resizeFrame = 0
    const resize = new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame)
      resizeFrame = requestAnimationFrame(setup)
    })
    // The heading is measured in its own font, so wait for it.
    void document.fonts.ready.then(() => {
      if (cancelled) return
      setup()
      resize.observe(host)
      frame = requestAnimationFrame(loop)
    })
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      cancelAnimationFrame(resizeFrame)
      resize.disconnect()
    }
  }, [heading, lines])

  return <canvas ref={ref} className={styles.endCode} aria-hidden="true" />
}
