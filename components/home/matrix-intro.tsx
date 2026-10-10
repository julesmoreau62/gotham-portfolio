"use client"

import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react"
import { Scramble } from "@/components/fx/scramble"
import { COPY } from "@/lib/copy"
import type { Locale } from "@/lib/i18n"
import { GLYPHS } from "./matrix-portrait"
import styles from "./matrix-intro.module.css"

/* ------------------------------------------------------------------
   MATRIX INTRO — plays once per tab session before the home page.
   A terminal types the wake-up lines, then digital rain pours down:
   every drop that crosses the name leaves it lit, so the code writes
   JULES MOREAU. The screen then drains from the top onto the hero.
   ------------------------------------------------------------------ */

export type IntroPhase = "wake" | "rain" | "exit"

/** When each phase starts, in ms from the first frame. */
export const INTRO_MS = { rain: 1450, exit: 2950, end: 3570 }
const TYPING = { start: 160, char: 22, pause: 200 }
const ACID = "#c8ff00"
const FPS = 30
/** However slow the device, the name is fully written this long after the rain starts. */
const WRITE_MS = 1100

type Drop = { head: number; speed: number; trail: number }

/** Types the lines one character at a time; returns how many are shown. */
function useTyping(lines: readonly string[]) {
  const [typed, setTyped] = useState(0)
  useEffect(() => {
    const total = lines.join("").length
    let count = 0
    let timer = 0
    const tick = () => {
      count += 1
      setTyped(count)
      if (count < total) timer = window.setTimeout(tick, count === lines[0].length ? TYPING.pause : TYPING.char)
    }
    timer = window.setTimeout(tick, TYPING.start)
    return () => window.clearTimeout(timer)
  }, [lines])
  return typed
}

function CodeRain({ phase }: { phase: IntroPhase }) {
  const ref = useRef<HTMLCanvasElement>(null)
  /** When the rain phase began, or 0 before it. */
  const rainSince = useRef(0)

  useEffect(() => {
    if (phase !== "wake" && !rainSince.current) rainSince.current = performance.now()
  }, [phase])

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext("2d")
    const host = canvas?.parentElement
    if (!canvas || !ctx || !host) return
    const css = getComputedStyle(document.documentElement)
    const mono = css.getPropertyValue("--font-mono").trim() || "monospace"
    const display = css.getPropertyValue("--font-archivo").trim() || "sans-serif"
    const nameFont = (px: number) => `900 ${px}px ${display}`
    const atlas = document.createElement("canvas")
    const layer = document.createElement("canvas")
    const fill = document.createElement("canvas")

    let cols = 0, rows = 0, cell = 0, total = 0, locked = 0, measured = ""
    let name = new Uint8Array(0), edges = new Uint8Array(0), glyphs = new Uint8Array(0)
    let lockedAt = new Float64Array(0)
    let drops: Drop[] = []
    let frame = 0, last = 0

    // Speeds are in rows per second. The first wave pours fast enough to
    // write the whole name in under a second; later drops fall slower.
    const pour = (): Drop => ({ head: -Math.random() * rows * 0.25, speed: rows / (0.7 + Math.random() * 0.45), trail: 8 + Math.random() * 18 })
    const drizzle = (): Drop => ({ head: -Math.random() * rows * 0.4, speed: rows / (1.3 + Math.random() * 1.3), trail: 10 + Math.random() * 22 })

    function setup() {
      if (!canvas || !host) return
      const width = host.clientWidth
      const height = host.clientHeight
      if (!width || !height) { cols = 0; return }
      const dpr = Math.min(devicePixelRatio || 1, 2)
      // The observer also reports the first size: keep the name being written.
      if (`${width}x${height}@${dpr}` === measured) return
      measured = `${width}x${height}@${dpr}`
      const size = Math.min(13, Math.max(7, Math.round(width / 140)))
      cell = size * dpr
      cols = Math.ceil(width / size)
      rows = Math.ceil(height / size)
      canvas.width = layer.width = fill.width = cols * cell
      canvas.height = layer.height = fill.height = rows * cell
      canvas.style.width = `${cols * size}px`
      canvas.style.height = `${rows * size}px`

      // The name, as large as the screen allows: one line, or two on phones.
      const lines = width < 700 ? ["JULES", "MOREAU"] : ["JULES MOREAU"]
      const f = fill.getContext("2d")!
      f.font = nameFont(100)
      f.fontStretch = "semi-expanded"
      const widest = Math.max(...lines.map(line => f.measureText(line).width))
      const px = Math.min((100 * canvas.width * (lines.length > 1 ? 0.84 : 0.86)) / widest, (canvas.height * 0.34) / lines.length / 0.9)
      f.font = nameFont(px)
      f.fontStretch = "semi-expanded"
      f.textAlign = "center"
      f.textBaseline = "alphabetic"
      f.fillStyle = ACID
      const cap = f.measureText("JM").actualBoundingBoxAscent
      const gap = px * 0.16
      const block = cap * lines.length + gap * (lines.length - 1)
      const top = canvas.height * 0.44 - block / 2
      const write = () => lines.forEach((line, k) => f.fillText(line, canvas.width / 2, top + cap * (k + 1) + gap * k))
      write()
      host.style.setProperty("--name-bottom", `${(top + block) / dpr}px`)

      // Three samples a side per glyph cell decide which cells belong to a letter.
      const K = 3
      const sample = document.createElement("canvas")
      sample.width = cols * K
      sample.height = rows * K
      const s = sample.getContext("2d", { willReadFrequently: true })!
      s.imageSmoothingQuality = "high"
      s.drawImage(fill, 0, 0, sample.width, sample.height)
      const alpha = s.getImageData(0, 0, sample.width, sample.height).data
      name = new Uint8Array(cols * rows)
      total = 0
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let sum = 0
          for (let y = 0; y < K; y++) for (let x = 0; x < K; x++) sum += alpha[((r * K + y) * sample.width + c * K + x) * 4 + 3]
          if (sum / (K * K * 255) > 0.42) { name[r * cols + c] = 1; total++ }
        }
      }
      edges = new Uint8Array(cols * rows)
      for (let r = 1; r < rows - 1; r++) {
        for (let c = 1; c < cols - 1; c++) {
          const i = r * cols + c
          if (name[i] && (!name[i - 1] || !name[i + 1] || !name[i - cols] || !name[i + cols])) edges[i] = 1
        }
      }

      // The solid name, glowing, shows faintly behind its glyphs once written.
      f.clearRect(0, 0, fill.width, fill.height)
      f.shadowColor = ACID
      f.shadowBlur = 40 * dpr
      write()

      atlas.width = GLYPHS.length * cell
      atlas.height = cell
      const a = atlas.getContext("2d")!
      a.font = `600 ${Math.round(cell * 0.92)}px ${mono}`
      a.textAlign = "center"
      a.textBaseline = "middle"
      a.fillStyle = "#fff"
      GLYPHS.forEach((glyph, i) => a.fillText(glyph, i * cell + cell / 2, cell / 2))

      glyphs = Uint8Array.from({ length: cols * rows }, () => Math.floor(Math.random() * GLYPHS.length))
      lockedAt = new Float64Array(cols * rows)
      locked = 0
      drops = []
      // A resize mid-sequence redraws the name already written.
      if (rainSince.current) {
        drops = Array.from({ length: cols }, drizzle)
        const now = performance.now() - 1000
        for (let i = 0; i < name.length; i++) if (name[i]) { lockedAt[i] = now; locked++ }
      }
    }

    function step(dt: number, now: number) {
      for (let c = 0; c < cols; c++) {
        const drop = drops[c]
        const from = Math.max(0, Math.floor(drop.head))
        drop.head += drop.speed * dt
        const to = Math.min(rows - 1, Math.floor(drop.head))
        for (let r = from; r <= to; r++) {
          const i = r * cols + c
          if (name[i] && !lockedAt[i]) { lockedAt[i] = now; locked++ }
        }
        if (drop.head - drop.trail > rows) drops[c] = drizzle()
      }
      if (locked < total && now - rainSince.current > WRITE_MS) {
        for (let i = 0; i < name.length; i++) if (name[i] && !lockedAt[i]) { lockedAt[i] = now; locked++ }
      }
      for (let i = 0; i < glyphs.length; i++) {
        if (Math.random() < 0.035) glyphs[i] = Math.floor(Math.random() * GLYPHS.length)
      }
    }

    function draw(now: number) {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (locked) {
        ctx.globalAlpha = 0.16 * (locked / total)
        ctx.drawImage(fill, 0, 0)
        ctx.globalAlpha = 1
      }

      // Glyphs are drawn white, then tinted acid in one pass.
      const g = layer.getContext("2d")!
      g.globalCompositeOperation = "source-over"
      g.globalAlpha = 1
      g.clearRect(0, 0, layer.width, layer.height)
      for (let c = 0; c < cols; c++) {
        const drop = drops[c]
        for (let r = 0; r < rows; r++) {
          const i = r * cols + c
          let alpha: number
          if (lockedAt[i]) alpha = edges[i] ? 1 : 0.62
          else {
            const dist = drop.head - r
            alpha = dist >= 0 && dist < drop.trail ? (1 - dist / drop.trail) * 0.5 : 0
          }
          if (alpha < 0.03) continue
          g.globalAlpha = alpha
          g.drawImage(atlas, glyphs[i] * cell, 0, cell, cell, c * cell, r * cell, cell, cell)
        }
      }
      g.globalAlpha = 1
      g.globalCompositeOperation = "source-in"
      g.fillStyle = ACID
      g.fillRect(0, 0, layer.width, layer.height)

      // Drop heads stay white, and so does each letter cell for a moment as it locks.
      g.globalCompositeOperation = "source-over"
      for (let c = 0; c < cols; c++) {
        const r = Math.floor(drops[c].head)
        if (r < 0 || r >= rows) continue
        g.globalAlpha = 0.85
        g.drawImage(atlas, glyphs[r * cols + c] * cell, 0, cell, cell, c * cell, r * cell, cell, cell)
      }
      for (let i = 0; i < lockedAt.length; i++) {
        const age = now - lockedAt[i]
        if (!lockedAt[i] || age > 180) continue
        g.globalAlpha = 1 - age / 180
        g.drawImage(atlas, glyphs[i] * cell, 0, cell, cell, (i % cols) * cell, Math.floor(i / cols) * cell, cell, cell)
      }
      g.globalAlpha = 1
      ctx.drawImage(layer, 0, 0)
    }

    function loop(now: number) {
      frame = requestAnimationFrame(loop)
      if (now - last < 1000 / FPS) return
      const dt = last ? Math.min((now - last) / 1000, 0.25) : 0
      last = now
      if (!rainSince.current || !cols) return
      if (!drops.length) drops = Array.from({ length: cols }, pour)
      step(dt, now)
      draw(now)
    }

    let resizeFrame = 0
    const resize = new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame)
      resizeFrame = requestAnimationFrame(setup)
    })

    // The name is measured in Archivo, so wait for it, but never for long.
    let cancelled = false
    const fontLoaded = document.fonts.load(nameFont(100)).catch(() => [])
    const timeout = new Promise(resolve => window.setTimeout(resolve, 1000))
    Promise.race([fontLoaded, timeout]).then(() => {
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
  }, [])

  return <canvas ref={ref} className={styles.rain} aria-hidden="true" />
}

export function MatrixIntro({ phase, skipButton, onSkip, locale = "en" }: {
  phase: IntroPhase
  skipButton: RefObject<HTMLButtonElement | null>
  onSkip: () => void
  locale?: Locale
}) {
  const t = COPY[locale].intro
  const typed = useTyping(t.wake)
  let before = 0

  return (
    <div className={styles.intro} data-phase={phase} style={{ "--duration": `${INTRO_MS.end}ms` } as CSSProperties} role="dialog" aria-modal="true" aria-labelledby="matrix-intro-title" aria-describedby="matrix-intro-description" data-lenis-prevent>
      <h2 id="matrix-intro-title" className="sr-only">{t.title}</h2>
      <p id="matrix-intro-description" className="sr-only">{t.description}</p>
      <CodeRain phase={phase} />
      <div className={styles.topline} aria-hidden="true">
        <span><i /> JM / Portfolio 2026</span>
        <span>{t.topline}</span>
      </div>
      <div className={styles.wake} aria-hidden="true">
        {t.wake.map((line, k) => {
          const start = before
          before += line.length
          const shown = Math.min(line.length, Math.max(0, typed - start))
          const cursor = typed >= start && (k === t.wake.length - 1 || typed < start + line.length)
          return <p key={line}>{line.slice(0, shown)}{cursor && <i className={styles.cursor} />}</p>
        })}
      </div>
      <p className={styles.role} aria-hidden="true">
        <Scramble text={t.role} play={phase !== "wake"} delay={650} duration={800} />
      </p>
      <div className={styles.bottomline}>
        <div className={styles.sequence} aria-hidden="true"><span className={styles.progress}><span /></span><span>{t.phases[phase]}</span></div>
        <button ref={skipButton} type="button" onClick={onSkip} className={styles.skip}>{t.skip} <span aria-hidden="true">↗</span></button>
      </div>
      <span className={styles.scan} aria-hidden="true" />
    </div>
  )
}
