"use client"

import { useEffect, useRef } from "react"
import { preload } from "react-dom"
import imageLoader from "@/lib/image-loader"
import { isLite } from "@/lib/quality"
import styles from "./matrix-portrait.module.css"

/* ------------------------------------------------------------------
   MATRIX PORTRAIT — the hero background on desktop: Jules's cut-out
   photo standing in digital rain. The face is blurred in the image
   file itself (scripts/build-hero-portrait.mjs) and glitches again
   every few seconds. Phones keep a plain background, and the rain
   waits while the home intro covers it.
   ------------------------------------------------------------------ */

const PHOTO = "/assets/portfolio/jules-portrait.webp"
const SRC_SET = [828, 1080, 1440].map(width => `${imageLoader({ src: PHOTO, width })} ${width}w`).join(", ")
const SIZES = "45vw"
/** Face box as a share of the photo, for the runtime glitch. */
const FACE = { x: 0.37, y: 0.175, w: 0.27, h: 0.175 }
export const GLYPHS = [..."ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ0123456789JM:=+*<>"]
const ACID = "#c8ff00"
/** Share of the canvas height the figure fills, and where its centre sits across. */
const FIGURE = { height: 0.86, center: 0.63 }
const DESKTOP = "(min-width: 801px)"
const SLICES = 7
/** The rain steps 24 times a second, or about 15 in lite mode. */
const FULL_MS = 1000 / 24
const LITE_MS = 1000 / 16

type Drop = { head: number; speed: number; trail: number }

export function MatrixPortrait() {
  const ref = useRef<HTMLCanvasElement>(null)
  preload(imageLoader({ src: PHOTO, width: 1080 }), { as: "image", imageSrcSet: SRC_SET, imageSizes: SIZES, media: DESKTOP, fetchPriority: "high" })

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches
    const desktop = matchMedia(DESKTOP)
    const font = getComputedStyle(document.documentElement).getPropertyValue("--font-mono").trim() || "monospace"
    const photo = new Image()
    photo.decoding = "async"
    photo.sizes = SIZES
    photo.srcset = SRC_SET
    photo.src = imageLoader({ src: PHOTO, width: 1080 })
    // The home intro covers the hero: the rain waits for it to finish.
    const entrance = canvas.closest<HTMLElement>("[data-intro-phase]")
    const covered = () => !!entrance && entrance.dataset.introPhase !== "ready"

    let cols = 0, rows = 0, cell = 0
    let fig = { x: 0, y: 0, w: 0, h: 0 }
    let inside = new Uint8Array(0), edges = new Uint8Array(0), face = new Uint8Array(0), glyphs = new Uint8Array(0)
    let faceCells = new Uint32Array(0)
    let drops: Drop[] = []
    let offsets: number[] = []
    /** White glyphs for the drop heads, and the same glyphs already tinted acid. */
    const atlas = document.createElement("canvas")
    const tinted = document.createElement("canvas")
    /** The silhouette's resting glyphs; only the cells whose glyph changes are repainted. */
    const base = document.createElement("canvas")
    const figure = document.createElement("canvas")
    let frame = 0, last = 0, glitchUntil = 0, nextGlitch = 0, visible = true

    const newDrop = (start: number): Drop => ({ head: start, speed: 0.25 + Math.random() * 0.6, trail: 10 + Math.random() * 24 })
    /** How bright a silhouette cell is with no rain on it. */
    const rest = (i: number) => (edges[i] ? 0.7 : inside[i] ? 0.14 : 0)

    function paintBase(i: number) {
      const g = base.getContext("2d")!
      const x = (i % cols) * cell, y = Math.floor(i / cols) * cell
      g.clearRect(x, y, cell, cell)
      g.globalAlpha = rest(i)
      g.drawImage(tinted, glyphs[i] * cell, 0, cell, cell, x, y, cell, cell)
    }

    function setup() {
      if (!canvas) return
      // Hidden on phones: nothing to lay out.
      if (!canvas.clientWidth || !canvas.clientHeight) { cols = 0; return }
      const dpr = Math.min(devicePixelRatio || 1, 2)
      cell = Math.round(10 * dpr)
      cols = Math.ceil((canvas.clientWidth * dpr) / cell)
      rows = Math.ceil((canvas.clientHeight * dpr) / cell)
      canvas.width = base.width = cols * cell
      canvas.height = base.height = rows * cell

      // The figure sits on the glyph grid, feet below the fold.
      const figRows = Math.round(rows * FIGURE.height)
      const figCols = Math.ceil((figRows * photo.naturalWidth) / photo.naturalHeight)
      const c0 = Math.round(cols * FIGURE.center - figCols / 2)
      const r0 = rows - figRows
      fig = { x: c0 * cell, y: r0 * cell, w: Math.round((figRows * cell * photo.naturalWidth) / photo.naturalHeight), h: figRows * cell }

      // The photo, darkened and faintly tinted so it sits in the site's palette.
      figure.width = fig.w
      figure.height = fig.h
      const f = figure.getContext("2d")!
      f.drawImage(photo, 0, 0, fig.w, fig.h)
      f.globalCompositeOperation = "source-atop"
      f.fillStyle = "rgba(7, 7, 7, 0.28)"
      f.fillRect(0, 0, fig.w, fig.h)
      f.fillStyle = "rgba(200, 255, 0, 0.07)"
      f.fillRect(0, 0, fig.w, fig.h)

      // One alpha sample per glyph cell gives the silhouette the code runs over.
      const sample = document.createElement("canvas")
      sample.width = figCols
      sample.height = figRows
      const s = sample.getContext("2d", { willReadFrequently: true })!
      s.drawImage(photo, 0, 0, figCols, figRows)
      const alpha = s.getImageData(0, 0, figCols, figRows).data
      inside = new Uint8Array(cols * rows)
      face = new Uint8Array(cols * rows)
      for (let r = r0; r < rows; r++) {
        for (let c = Math.max(0, c0); c < Math.min(cols, c0 + figCols); c++) {
          const fc = c - c0, fr = r - r0
          if (alpha[(fr * figCols + fc) * 4 + 3] < 128) continue
          const i = r * cols + c
          inside[i] = 1
          const u = fc / figCols, v = fr / figRows
          face[i] = u >= FACE.x && u < FACE.x + FACE.w && v >= FACE.y && v < FACE.y + FACE.h ? 1 : 0
        }
      }
      edges = new Uint8Array(cols * rows)
      for (let r = 1; r < rows - 1; r++) {
        for (let c = 1; c < cols - 1; c++) {
          const i = r * cols + c
          if (inside[i] && (!inside[i - 1] || !inside[i + 1] || !inside[i - cols] || !inside[i + cols])) edges[i] = 1
        }
      }
      faceCells = Uint32Array.from(face.keys()).filter(i => face[i])
      glyphs = Uint8Array.from({ length: cols * rows }, () => Math.floor(Math.random() * GLYPHS.length))
      drops = Array.from({ length: cols }, () => newDrop(Math.random() * rows * 1.4 - rows * 0.4))
      offsets = Array.from({ length: SLICES }, () => 0)

      atlas.width = tinted.width = GLYPHS.length * cell
      atlas.height = tinted.height = cell
      const a = atlas.getContext("2d")!
      a.font = `600 ${Math.round(cell * 0.92)}px ${font}`
      a.textAlign = "center"
      a.textBaseline = "middle"
      a.fillStyle = "#fff"
      GLYPHS.forEach((g, i) => a.fillText(g, i * cell + cell / 2, cell / 2))
      const t = tinted.getContext("2d")!
      t.drawImage(atlas, 0, 0)
      t.globalCompositeOperation = "source-in"
      t.fillStyle = ACID
      t.fillRect(0, 0, tinted.width, tinted.height)

      base.getContext("2d")!.clearRect(0, 0, base.width, base.height)
      for (let i = 0; i < inside.length; i++) if (inside[i]) paintBase(i)
    }

    /** Draws a glyph over its resting one so the two add up to `alpha`, as if drawn once. */
    function over(i: number, alpha: number) {
      const b = rest(i)
      if (alpha - b < 0.01) return
      ctx!.globalAlpha = Math.min(1, (alpha - b) / (1 - b))
      ctx!.drawImage(tinted, glyphs[i] * cell, 0, cell, cell, (i % cols) * cell, Math.floor(i / cols) * cell, cell, cell)
    }

    const rainAt = (i: number) => {
      const drop = drops[i % cols]
      const dist = drop.head - Math.floor(i / cols)
      return dist >= 0 && dist < drop.trail ? 1 - dist / drop.trail : 0
    }

    function draw(now: number) {
      if (!canvas || !ctx || !cols) return
      const glitching = now < glitchUntil
      ctx.globalAlpha = 1
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(figure, fig.x, fig.y)
      if (glitching) {
        // The face slips sideways in slices, like a corrupted frame.
        const sx = FACE.x * fig.w, sw = FACE.w * fig.w, sh = (FACE.h * fig.h) / SLICES
        offsets.forEach((offset, k) => {
          const sy = FACE.y * fig.h + k * sh
          ctx.drawImage(figure, sx, sy, sw, sh, fig.x + sx + offset * cell, fig.y + sy, sw, sh)
        })
      }

      // The resting silhouette, then only the cells a drop is running through.
      ctx.drawImage(base, 0, 0)
      for (let c = 0; c < cols; c++) {
        const drop = drops[c]
        const bottom = Math.min(rows - 1, Math.floor(drop.head))
        for (let r = Math.max(0, Math.floor(drop.head - drop.trail) + 1); r <= bottom; r++) {
          const i = r * cols + c
          const rain = 1 - (drop.head - r) / drop.trail
          if (edges[i]) over(i, 0.7 + rain * 0.3)
          else if (inside[i]) { if (!(glitching && face[i])) over(i, 0.14 + rain * 0.6) }
          else if (rain * 0.3 >= 0.03) {
            ctx.globalAlpha = rain * 0.3
            ctx.drawImage(tinted, glyphs[i] * cell, 0, cell, cell, c * cell, r * cell, cell, cell)
          }
        }
      }
      // A glitch lights the whole face, rain or not.
      if (glitching) for (const i of faceCells) if (!edges[i]) over(i, 0.14 + rainAt(i) * 0.6 + 0.35)

      for (let c = 0; c < cols; c++) {
        const r = Math.floor(drops[c].head)
        if (r < 0 || r >= rows) continue
        ctx.globalAlpha = inside[r * cols + c] ? 0.9 : 0.45
        ctx.drawImage(atlas, glyphs[r * cols + c] * cell, 0, cell, cell, c * cell, r * cell, cell, cell)
      }
      ctx.globalAlpha = 1
    }

    /** Advances the rain by `k` steps' worth (one step at full quality). */
    function step(now: number, k: number) {
      for (const [c, drop] of drops.entries()) {
        drop.head += drop.speed * k
        if (drop.head - drop.trail > rows) drops[c] = newDrop(-Math.random() * rows * 0.5)
      }
      if (now >= nextGlitch) {
        glitchUntil = now + 160 + Math.random() * 220
        nextGlitch = now + 1800 + Math.random() * 2600
        offsets = offsets.map(() => Math.round((Math.random() * 2 - 1) * 3))
      }
      const glitching = now < glitchUntil
      const chance = (p: number) => 1 - (1 - p) ** k
      const change = (i: number) => {
        glyphs[i] = Math.floor(Math.random() * GLYPHS.length)
        if (inside[i]) paintBase(i)
      }
      // 2% of the cells change glyph each step: pick that many at random rather than rolling every cell.
      const picks = Math.floor(glyphs.length * chance(0.02) + Math.random())
      for (let n = 0; n < picks; n++) {
        const i = Math.floor(Math.random() * glyphs.length)
        if (!face[i]) change(i)
      }
      const flicker = chance(glitching ? 0.6 : 0.08)
      for (const i of faceCells) if (Math.random() < flicker) change(i)
    }

    function loop(now: number) {
      frame = requestAnimationFrame(loop)
      const lite = isLite()
      if (now - last < (lite ? LITE_MS : FULL_MS)) return
      // Lite mode draws less often and moves the rain further each time, so it falls as fast.
      const k = lite && last ? Math.min(3, (now - last) / FULL_MS) : 1
      last = now
      step(now, k)
      draw(now)
    }

    function start() {
      cancelAnimationFrame(frame)
      if (!desktop.matches) return
      if (still || !visible || covered()) draw(0)
      else frame = requestAnimationFrame(loop)
    }

    let resizeFrame = 0
    const resize = new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame)
      resizeFrame = requestAnimationFrame(() => { setup(); start() })
    })
    const watch = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else cancelAnimationFrame(frame)
    })
    const intro = new MutationObserver(start)

    let cancelled = false
    Promise.all([document.fonts.ready, photo.decode()]).then(() => {
      if (cancelled) return
      setup()
      start()
      canvas.dataset.ready = "true"
      resize.observe(canvas)
      watch.observe(canvas)
      if (entrance) intro.observe(entrance, { attributes: true, attributeFilter: ["data-intro-phase"] })
    }, () => {})
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      cancelAnimationFrame(resizeFrame)
      resize.disconnect()
      watch.disconnect()
      intro.disconnect()
    }
  }, [])

  return <canvas ref={ref} className={styles.canvas} aria-hidden="true" />
}
