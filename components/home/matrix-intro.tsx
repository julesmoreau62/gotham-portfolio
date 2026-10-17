"use client"

import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react"
import Link from "next/link"
import { Headphones } from "lucide-react"
import { Scramble } from "@/components/fx/scramble"
import { COPY } from "@/lib/copy"
import { DOSSIER_DURATION } from "@/lib/dossier"
import { type Locale } from "@/lib/i18n"
import { GLYPHS } from "./matrix-portrait"
import styles from "./matrix-intro.module.css"

/* ------------------------------------------------------------------
   MATRIX INTRO — plays once per tab session before the home page.
   The screen powers on like an old monitor and a terminal types the
   wake-up lines. Then digital rain sweeps from left to right, in three
   layers of depth: every drop that crosses the name leaves it lit, so
   the code writes JULES MOREAU letter by letter. The visitor then picks
   an access: the narrated dossier, or the portfolio itself, which
   the camera reaches by diving through the O.
   ------------------------------------------------------------------ */

export type IntroPhase = "wake" | "rain" | "choose" | "exit"

/** When each phase starts, in ms from the first frame; `exit` is the dive's length. */
export const INTRO_MS = { rain: 1450, choose: 3550, exit: 760 }

const DOSSIER_LENGTH = DOSSIER_DURATION >= 60
  ? `${Math.floor(DOSSIER_DURATION / 60)} min ${String(Math.round(DOSSIER_DURATION % 60)).padStart(2, "0")}`
  : `${Math.round(DOSSIER_DURATION)} s`
/** Typing waits for the screen to power on. */
const TYPING = { start: 380, char: 18, pause: 180 }
/** The role decodes once the name is written, in ms after the rain starts. */
const ROLE_DELAY = 1600
const ACID = "#c8ff00"
const FPS = 30
/** The first wave sweeps left to right, in seconds: when each column starts, and how long a drop takes to cross. */
const SWEEP = { start: 0.1, span: 1.15, jitter: 0.12, cross: 0.55 }
/** However slow the device, the name is fully written this long after the rain starts. */
const WRITE_MS = 1900
/** How long a finished letter, then the whole name, flares. */
const FLARE_MS = { letter: 320, name: 560 }
/** Katakana are mirrored, as on the film's screens. */
const MIRRORED = /[ｦ-ﾝ]/

type Drop = { col: number; head: number; speed: number; trail: number }
/** One depth of rain: its own glyph size, grid and drops. */
type Layer = { cell: number; cols: number; rows: number; atlas: HTMLCanvasElement; glyphs: Uint8Array; drops: Drop[] }
type Letter = { char: string; x0: number; x1: number; y0: number; y1: number; baseline: number }

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
  const phaseNow = useRef(phase)

  useEffect(() => {
    phaseNow.current = phase
    if (phase !== "wake" && !rainSince.current) rainSince.current = performance.now()
  }, [phase])

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext("2d")
    const host = canvas?.parentElement
    if (!canvas || !ctx || !host) return
    const root = document.documentElement
    const css = getComputedStyle(root)
    const mono = css.getPropertyValue("--font-mono").trim() || "monospace"
    const display = css.getPropertyValue("--font-archivo").trim() || "sans-serif"
    const nameFont = (px: number) => `900 ${px}px ${display}`
    const layer = document.createElement("canvas")
    const fill = document.createElement("canvas")
    /** The letters already written, glowing. */
    const glow = document.createElement("canvas")
    const bloom = [document.createElement("canvas"), document.createElement("canvas")]

    let measured = ""
    let far: Layer, mid: Layer, near: Layer
    let total = 0, locked = 0, writtenAt = 0
    let name = new Uint8Array(0), edges = new Uint8Array(0)
    let cells = new Uint32Array(0), letterOf = new Int16Array(0)
    let lockedAt = new Float64Array(0)
    let letters: Letter[] = [], letterLocked: number[] = [], letterTotal: number[] = [], letterDoneAt: number[] = []
    let nameTop = 0, nameBottom = 0, namePx = 0, dpr = 1
    let pace = 1, nextGlitch = 0, glitchUntil = 0, glitchY = 0, glitchH = 0
    let frame = 0, last = 0

    const randomGlyphs = (count: number) => Uint8Array.from({ length: count }, () => Math.floor(Math.random() * GLYPHS.length))

    function makeAtlas(cell: number, blur: number) {
      const atlas = document.createElement("canvas")
      atlas.width = GLYPHS.length * cell
      atlas.height = cell
      const a = atlas.getContext("2d")!
      a.font = `600 ${Math.round(cell * 0.92)}px ${mono}`
      a.textAlign = "center"
      a.textBaseline = "middle"
      a.fillStyle = "#fff"
      if (blur) a.filter = `blur(${blur}px)`
      GLYPHS.forEach((char, i) => {
        a.save()
        a.translate(i * cell + cell / 2, cell / 2)
        if (MIRRORED.test(char)) a.scale(-1, 1)
        a.fillText(char, 0, 0)
        a.restore()
      })
      return atlas
    }

    function makeLayer(size: number, dpr: number, width: number, height: number, blur = 0): Layer {
      const cell = size * dpr
      const cols = Math.ceil(width / size)
      const rows = Math.ceil(height / size)
      return { cell, cols, rows, atlas: makeAtlas(cell, blur * dpr), glyphs: randomGlyphs(cols * rows), drops: [] }
    }

    // Speeds are in rows per second. The first wave sweeps across the
    // screen, so the name is written from its first letter to its last.
    const pour = (col: number): Drop => {
      const delay = SWEEP.start + (col / mid.cols) * SWEEP.span + Math.random() * SWEEP.jitter
      const speed = mid.rows / (SWEEP.cross + Math.random() * 0.15)
      return { col, head: -delay * speed, speed, trail: 8 + Math.random() * 18 }
    }
    const drizzle = (col: number): Drop => ({ col, head: -Math.random() * mid.rows * 0.4, speed: mid.rows / (1.3 + Math.random() * 1.3), trail: 10 + Math.random() * 22 })
    const distant = (col: number): Drop => ({ col, head: -Math.random() * far.rows * 0.5, speed: far.rows / (2.4 + Math.random() * 2.2), trail: 6 + Math.random() * 16 })
    const close = (): Drop => ({ col: Math.floor(Math.random() * near.cols), head: -Math.random() * near.rows * 0.8, speed: near.rows / (0.8 + Math.random() * 0.6), trail: 3 + Math.random() * 6 })

    function setup() {
      if (!canvas || !host) return
      const width = host.clientWidth
      const height = host.clientHeight
      if (!width || !height) { measured = ""; return }
      dpr = Math.min(devicePixelRatio || 1, 2)
      // The observer also reports the first size: keep the name being written.
      if (`${width}x${height}@${dpr}` === measured) return
      measured = `${width}x${height}@${dpr}`
      const size = Math.min(13, Math.max(7, Math.round(width / 140)))
      mid = makeLayer(size, dpr, width, height)
      far = makeLayer(Math.max(5, Math.round(size * 0.62)), dpr, width, height)
      near = makeLayer(Math.round(size * 2.2), dpr, width, height, 1.2)
      const { cols, rows, cell } = mid
      canvas.width = layer.width = fill.width = glow.width = cols * cell
      canvas.height = layer.height = fill.height = glow.height = rows * cell
      canvas.style.width = `${cols * size}px`
      canvas.style.height = `${rows * size}px`
      bloom[0].width = Math.ceil(canvas.width / 4)
      bloom[0].height = Math.ceil(canvas.height / 4)
      bloom[1].width = Math.ceil(bloom[0].width / 4)
      bloom[1].height = Math.ceil(bloom[0].height / 4)

      // The name, as large as the screen allows: one line, or two on phones.
      const lines = width < 700 ? ["JULES", "MOREAU"] : ["JULES MOREAU"]
      const f = fill.getContext("2d")!
      f.font = nameFont(100)
      f.fontStretch = "semi-expanded"
      const widest = Math.max(...lines.map(line => f.measureText(line).width))
      const px = Math.min((100 * canvas.width * (lines.length > 1 ? 0.84 : 0.86)) / widest, (canvas.height * 0.34) / lines.length / 0.9)
      namePx = px
      f.font = nameFont(px)
      f.fontStretch = "semi-expanded"
      f.textAlign = "center"
      f.textBaseline = "alphabetic"
      f.fillStyle = ACID
      const cap = f.measureText("JM").actualBoundingBoxAscent
      const gap = px * 0.16
      const block = cap * lines.length + gap * (lines.length - 1)
      const top = canvas.height * 0.44 - block / 2
      nameTop = top
      nameBottom = top + block
      const write = () => lines.forEach((line, k) => f.fillText(line, canvas.width / 2, top + cap * (k + 1) + gap * k))
      write()
      host.style.setProperty("--name-bottom", `${(top + block) / dpr}px`)

      // Where each letter sits, so it glows once written, and the O the exit dives through.
      letters = []
      lines.forEach((line, k) => {
        const baseline = top + cap * (k + 1) + gap * k
        const left = canvas.width / 2 - f.measureText(line).width / 2
        const o = line.indexOf("MOREAU") + 1
        for (let j = 0; j < line.length; j++) {
          if (line[j] === " ") continue
          const x0 = left + f.measureText(line.slice(0, j)).width
          const x1 = left + f.measureText(line.slice(0, j + 1)).width
          letters.push({ char: line[j], x0, x1, y0: baseline - cap, y1: baseline, baseline })
          if (o > 0 && j === o) {
            root.style.setProperty("--intro-dive-x", `${(x0 + x1) / 2 / dpr}px`)
            root.style.setProperty("--intro-dive-y", `${(baseline - cap / 2) / dpr}px`)
          }
        }
      })

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
      const list: number[] = []
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let sum = 0
          for (let y = 0; y < K; y++) for (let x = 0; x < K; x++) sum += alpha[((r * K + y) * sample.width + c * K + x) * 4 + 3]
          if (sum / (K * K * 255) > 0.42) { name[r * cols + c] = 1; list.push(r * cols + c) }
        }
      }
      cells = Uint32Array.from(list)
      total = cells.length
      edges = new Uint8Array(cols * rows)
      for (const i of cells) {
        if (i % cols === 0 || i % cols === cols - 1 || i < cols || i >= cols * (rows - 1)) continue
        if (!name[i - 1] || !name[i + 1] || !name[i - cols] || !name[i + cols]) edges[i] = 1
      }

      // Each cell belongs to the letter it sits closest to.
      letterOf = new Int16Array(cols * rows).fill(-1)
      letterTotal = letters.map(() => 0)
      for (const i of cells) {
        const x = (i % cols + 0.5) * cell
        const y = (Math.floor(i / cols) + 0.5) * cell
        let best = 0, score = Infinity
        letters.forEach((letter, k) => {
          const d = Math.max(letter.x0 - x, 0, x - letter.x1) + Math.max(letter.y0 - y, 0, y - letter.y1)
          if (d < score) { score = d; best = k }
        })
        letterOf[i] = best
        letterTotal[best]++
      }

      glow.getContext("2d")!.clearRect(0, 0, glow.width, glow.height)
      lockedAt = new Float64Array(cols * rows)
      letterLocked = letters.map(() => 0)
      letterDoneAt = letters.map(() => 0)
      locked = 0
      writtenAt = 0
      // A resize mid-sequence redraws the name already written, without flares.
      if (rainSince.current) {
        mid.drops = Array.from({ length: cols }, (_, c) => drizzle(c))
        far.drops = Array.from({ length: far.cols }, (_, c) => distant(c))
        near.drops = Array.from({ length: Math.max(3, Math.round(near.cols * 0.12)) }, close)
        const before = performance.now() - 10000
        for (const i of cells) { lockedAt[i] = before; locked++ }
        letterDoneAt = letters.map(() => before)
        letters.forEach(letter => paint(glow.getContext("2d")!, letter, ACID, 40))
        writtenAt = before
      }
    }

    /** Draws one letter of the solid name, haloed. */
    function paint(target: CanvasRenderingContext2D, letter: Letter, color: string, blur: number) {
      target.font = nameFont(namePx)
      target.fontStretch = "semi-expanded"
      target.textAlign = "left"
      target.textBaseline = "alphabetic"
      target.fillStyle = color
      target.shadowColor = ACID
      target.shadowBlur = blur * dpr
      target.fillText(letter.char, letter.x0, letter.baseline)
    }

    function lock(i: number, now: number) {
      if (!name[i] || lockedAt[i]) return
      lockedAt[i] = now
      locked++
      const k = letterOf[i]
      if (++letterLocked[k] === letterTotal[k]) {
        letterDoneAt[k] = now
        paint(glow.getContext("2d")!, letters[k], ACID, 40)
      }
      if (locked === total) {
        writtenAt = now
        host!.dataset.written = ""
      }
    }

    function fall(target: Layer, dt: number, respawn: (col: number) => Drop) {
      for (let d = 0; d < target.drops.length; d++) {
        const drop = target.drops[d]
        drop.head += drop.speed * dt
        if (drop.head - drop.trail > target.rows) target.drops[d] = respawn(drop.col)
      }
    }

    function step(dt: number, now: number) {
      // The matrix slows down while it waits for a choice.
      const waiting = phaseNow.current === "choose" || phaseNow.current === "exit"
      pace += ((waiting ? 0.55 : 1) - pace) * Math.min(1, dt * 2)
      dt *= pace

      const { cols, rows } = mid
      for (let c = 0; c < cols; c++) {
        const drop = mid.drops[c]
        const from = Math.max(0, Math.floor(drop.head))
        drop.head += drop.speed * dt
        const to = Math.min(rows - 1, Math.floor(drop.head))
        for (let r = from; r <= to; r++) lock(r * cols + c, now)
        if (drop.head - drop.trail > rows) mid.drops[c] = drizzle(c)
      }
      if (locked < total && now - rainSince.current > WRITE_MS) for (const i of cells) lock(i, now)
      fall(far, dt, distant)
      fall(near, dt, close)

      for (const target of [mid, far, near]) {
        const churn = target === far ? 0.02 : 0.035
        for (let i = 0; i < target.glyphs.length; i++) {
          if (Math.random() < churn) target.glyphs[i] = Math.floor(Math.random() * GLYPHS.length)
        }
      }
    }

    function glyph(g: CanvasRenderingContext2D, target: Layer, i: number, alpha: number) {
      const { cell, cols, atlas, glyphs } = target
      g.globalAlpha = alpha
      g.drawImage(atlas, glyphs[i] * cell, 0, cell, cell, (i % cols) * cell, Math.floor(i / cols) * cell, cell, cell)
    }

    /** A drop's fading trail; the name's own cells are drawn apart. */
    function trails(g: CanvasRenderingContext2D, target: Layer, strength: number, skipName: boolean) {
      for (const drop of target.drops) {
        const top = Math.max(0, Math.ceil(drop.head - drop.trail))
        const bottom = Math.min(target.rows - 1, Math.floor(drop.head))
        for (let r = top; r <= bottom; r++) {
          const i = r * target.cols + drop.col
          if (skipName && lockedAt[i]) continue
          const alpha = (1 - (drop.head - r) / drop.trail) * strength
          if (alpha >= 0.03) glyph(g, target, i, alpha)
        }
      }
    }

    function heads(g: CanvasRenderingContext2D, target: Layer, alpha: number) {
      for (const drop of target.drops) {
        const r = Math.floor(drop.head)
        if (r >= 0 && r < target.rows) glyph(g, target, r * target.cols + drop.col, alpha)
      }
    }

    function draw(now: number) {
      if (!canvas || !ctx) return
      const { width, height } = canvas
      ctx.clearRect(0, 0, width, height)
      // The fog of glow and bloom would turn green as the camera dives through it.
      const diving = phaseNow.current === "exit"

      // Written letters glow behind their glyphs, white-hot for a moment; the whole name breathes once written.
      if (locked && !diving) {
        let halo = 0.16
        if (writtenAt) {
          const age = now - writtenAt
          halo += 0.06 * Math.sin(age / 700) ** 2
          if (age < FLARE_MS.name) halo += 0.4 * (1 - age / FLARE_MS.name)
        }
        ctx.globalAlpha = Math.min(1, halo)
        ctx.drawImage(glow, 0, 0)
        ctx.save()
        ctx.globalCompositeOperation = "lighter"
        letters.forEach((letter, k) => {
          const age = now - letterDoneAt[k]
          if (!letterDoneAt[k] || age > FLARE_MS.letter) return
          ctx.globalAlpha = 0.55 * (1 - age / FLARE_MS.letter) ** 2
          paint(ctx, letter, "#efffc4", 24)
        })
        ctx.restore()
        ctx.globalAlpha = 1
      }

      // Glyphs are drawn white, far to near, then tinted acid in one pass.
      const g = layer.getContext("2d")!
      g.globalCompositeOperation = "source-over"
      g.clearRect(0, 0, layer.width, layer.height)
      trails(g, far, 0.3, false)
      trails(g, mid, 0.5, true)
      // Written cells stay lit, and the rain still runs through them.
      for (const i of cells) {
        if (!lockedAt[i]) continue
        const drop = mid.drops[i % mid.cols]
        const dist = drop.head - Math.floor(i / mid.cols)
        const boost = dist >= 0 && dist < drop.trail ? 1 - dist / drop.trail : 0
        glyph(g, mid, i, Math.min(1, (edges[i] ? 0.95 : 0.58) + boost * 0.45))
      }
      trails(g, near, 0.32, false)
      g.globalAlpha = 1
      g.globalCompositeOperation = "source-in"
      g.fillStyle = ACID
      g.fillRect(0, 0, layer.width, layer.height)

      // Drop heads stay white, and so does each letter cell for a moment as it locks.
      g.globalCompositeOperation = "source-over"
      heads(g, far, 0.3)
      heads(g, mid, 0.85)
      heads(g, near, 0.55)
      for (const i of cells) {
        const age = now - lockedAt[i]
        if (lockedAt[i] && age < 180) glyph(g, mid, i, 1 - age / 180)
      }
      g.globalAlpha = 1
      ctx.drawImage(layer, 0, 0)

      // A glitch now and then once the name waits: a slice of it jumps sideways.
      if (writtenAt && phaseNow.current === "choose") {
        if (!nextGlitch) nextGlitch = now + 1400 + Math.random() * 1600
        if (now > nextGlitch) {
          glitchUntil = now + 90 + Math.random() * 90
          glitchH = (nameBottom - nameTop) * (0.08 + Math.random() * 0.16)
          glitchY = nameTop + Math.random() * (nameBottom - nameTop - glitchH)
          nextGlitch = now + 2200 + Math.random() * 2600
        }
        if (now < glitchUntil) {
          const dx = (Math.random() < 0.5 ? -1 : 1) * (6 + Math.random() * 18) * (mid.cell / 10)
          ctx.save()
          ctx.beginPath()
          ctx.rect(0, glitchY, width, glitchH)
          ctx.clip()
          ctx.clearRect(0, glitchY, width, glitchH)
          ctx.globalAlpha = 0.16
          ctx.drawImage(glow, dx, 0)
          ctx.globalAlpha = 1
          ctx.drawImage(layer, dx, 0)
          ctx.globalCompositeOperation = "lighter"
          ctx.globalAlpha = 0.4
          ctx.drawImage(layer, -dx * 0.6, 0)
          ctx.restore()
        }
      }

      // Bloom: the frame, shrunk twice and stretched back, glows over itself.
      if (diving) return
      const [b0, b1] = bloom
      const s0 = b0.getContext("2d")!
      const s1 = b1.getContext("2d")!
      s0.imageSmoothingQuality = "high"
      s1.imageSmoothingQuality = "high"
      s0.clearRect(0, 0, b0.width, b0.height)
      s0.drawImage(canvas, 0, 0, b0.width, b0.height)
      s1.clearRect(0, 0, b1.width, b1.height)
      s1.drawImage(b0, 0, 0, b1.width, b1.height)
      ctx.globalCompositeOperation = "lighter"
      ctx.globalAlpha = 0.32
      ctx.drawImage(b0, 0, 0, width, height)
      ctx.globalAlpha = 0.5
      ctx.drawImage(b1, 0, 0, width, height)
      ctx.globalCompositeOperation = "source-over"
      ctx.globalAlpha = 1
    }

    function loop(now: number) {
      frame = requestAnimationFrame(loop)
      if (now - last < 1000 / FPS) return
      const dt = last ? Math.min((now - last) / 1000, 0.25) : 0
      last = now
      if (!rainSince.current || !measured) return
      if (!mid.drops.length) {
        mid.drops = Array.from({ length: mid.cols }, (_, c) => pour(c))
        far.drops = Array.from({ length: far.cols }, (_, c) => distant(c))
        near.drops = Array.from({ length: Math.max(3, Math.round(near.cols * 0.12)) }, close)
      }
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
      root.style.removeProperty("--intro-dive-x")
      root.style.removeProperty("--intro-dive-y")
    }
  }, [])

  return <canvas ref={ref} className={styles.rain} aria-hidden="true" />
}

export function MatrixIntro({ phase, skipButton, onSkip, onEnter, locale = "en" }: {
  phase: IntroPhase
  skipButton: RefObject<HTMLButtonElement | null>
  onSkip: () => void
  onEnter: () => void
  locale?: Locale
}) {
  const choosing = phase === "choose" || phase === "exit"
  const t = COPY[locale].intro
  const typed = useTyping(t.wake)
  let before = 0

  return (
    <div id="matrix-intro" className={styles.intro} data-phase={phase} style={{ "--duration": `${INTRO_MS.choose}ms` } as CSSProperties} role="dialog" aria-modal="true" aria-labelledby="matrix-intro-title" aria-describedby="matrix-intro-description" data-lenis-prevent>
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
        <Scramble text={t.role} play={phase !== "wake"} delay={ROLE_DELAY} duration={700} />
      </p>
      {choosing && (
        <nav className={styles.choice} aria-label={t.choose.label}>
          <p className={styles.choiceLabel} aria-hidden="true">{t.choose.label}</p>
          <div className={styles.choiceRow}>
            <Link href="/dossier" className={styles.option} data-choice="dossier">
              <Headphones size={18} aria-hidden="true" />
              <span>
                <b><span className="sr-only">{t.choose.dossier.title}</span><span aria-hidden="true"><Scramble text={t.choose.dossier.title} delay={120} duration={450} /></span></b>
                <small>{t.choose.dossier.meta} · ≈ {DOSSIER_LENGTH}</small>
              </span>
              <i aria-hidden="true">↗</i>
            </Link>
          </div>
        </nav>
      )}
      <div className={styles.bottomline}>
        <div className={styles.sequence} aria-hidden="true"><span className={styles.progress}><span /></span><span>{t.phases[phase]}</span></div>
        <button ref={skipButton} type="button" onClick={choosing ? onEnter : onSkip} className={styles.skip}>{choosing ? t.choose.enter : t.skip} <span aria-hidden="true">{choosing ? "↓" : "↗"}</span></button>
      </div>
      <span className={styles.power} aria-hidden="true" />
    </div>
  )
}
