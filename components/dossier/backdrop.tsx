"use client"

import { useEffect, useRef } from "react"
import { GLYPHS } from "@/components/home/matrix-portrait"
import styles from "./dossier.module.css"

/** Faint digital rain behind the whole dossier. It runs on its own clock: pure ambience. */
export function Backdrop({ running }: { running: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const live = useRef(running)
  live.current = running

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    const font = getComputedStyle(document.documentElement).getPropertyValue("--font-mono").trim() || "monospace"
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches
    let cols = 0, rows = 0, cell = 0, frame = 0, last = 0
    let drops: { head: number; speed: number; trail: number }[] = []

    const setup = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2)
      cell = Math.round(14 * dpr)
      canvas.width = canvas.clientWidth * dpr
      canvas.height = canvas.clientHeight * dpr
      cols = Math.ceil(canvas.width / cell)
      rows = Math.ceil(canvas.height / cell)
      drops = Array.from({ length: cols }, () => ({ head: Math.random() * rows, speed: 4 + Math.random() * 10, trail: 6 + Math.random() * 20 }))
    }
    const draw = (now: number) => {
      frame = requestAnimationFrame(draw)
      if (now - last < 1000 / 20) return
      const dt = last ? Math.min((now - last) / 1000, 0.2) : 0
      last = now
      if (!live.current && !still) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.font = `${Math.round(cell * 0.8)}px ${font}`
      ctx.textAlign = "center"
      for (let c = 0; c < cols; c++) {
        const drop = drops[c]
        drop.head += drop.speed * dt
        if (drop.head - drop.trail > rows) Object.assign(drop, { head: -Math.random() * 10, speed: 4 + Math.random() * 10 })
        for (let k = 0; k < drop.trail; k++) {
          const r = Math.floor(drop.head) - k
          if (r < 0 || r >= rows) continue
          ctx.fillStyle = k === 0 ? "rgba(242,241,236,.5)" : `rgba(200,255,0,${0.28 * (1 - k / drop.trail)})`
          ctx.fillText(GLYPHS[(r * 7 + c * 13 + Math.floor(now / 160)) % GLYPHS.length], c * cell + cell / 2, r * cell + cell)
        }
      }
      if (still) cancelAnimationFrame(frame)
    }
    setup()
    const resize = new ResizeObserver(setup)
    resize.observe(canvas)
    frame = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(frame); resize.disconnect() }
  }, [])

  return <canvas ref={ref} className={styles.backdrop} aria-hidden="true" />
}
