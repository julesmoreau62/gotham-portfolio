"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { GLYPHS } from "@/components/home/matrix-portrait"
import { WipeLink } from "@/components/fx/page-wipe"
import { ArrowUpRight } from "@/components/ui/primitives"
import { cn } from "@/lib/utils"
import type { Entry } from "./project-terminal"
import styles from "./selected-work.module.css"

/* ------------------------------------------------------------------
   PROJECT MONITOR — the screen beside the terminal. It shows the
   project in focus (hovered line, `cat`, `open`) and decodes each new
   one through a short burst of digital rain, the same glyphs as the
   hero.
   ------------------------------------------------------------------ */

const CELL = 12
const TRAIL = 7

/** Plays one decode pass on the canvas; the image is revealed column by column behind the falling heads. */
function decode(canvas: HTMLCanvasElement, color: string) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return () => {}
  const dpr = Math.min(devicePixelRatio || 1, 2)
  const w = canvas.clientWidth, h = canvas.clientHeight
  canvas.width = Math.round(w * dpr)
  canvas.height = Math.round(h * dpr)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  const font = getComputedStyle(document.documentElement).getPropertyValue("--font-mono").trim() || "monospace"
  ctx.font = `600 ${CELL - 1}px ${font}`
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  const cols = Math.ceil(w / CELL), rows = Math.ceil(h / CELL)
  const delay = Array.from({ length: cols }, () => Math.random() * 200)
  const speed = Array.from({ length: cols }, () => (rows + TRAIL) / (320 + Math.random() * 260))
  const glyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
  const t0 = performance.now()
  let raf = 0

  const draw = (now: number) => {
    const t = now - t0
    let done = true
    ctx.clearRect(0, 0, w, h)
    for (let c = 0; c < cols; c++) {
      const head = (t - delay[c]) * speed[c]
      if (head < rows + TRAIL) done = false
      // Below the head the image is still hidden, with faint code on it.
      const cover = Math.max(0, Math.ceil(head))
      if (cover < rows) {
        ctx.globalAlpha = 1
        ctx.fillStyle = "#070707"
        ctx.fillRect(c * CELL, cover * CELL, CELL, h - cover * CELL)
        ctx.fillStyle = color
        ctx.globalAlpha = 0.16
        for (let r = cover; r < rows; r++) if ((c * 31 + r * 17) % 7 === 0) ctx.fillText(glyph(), c * CELL + CELL / 2, r * CELL + CELL / 2)
      }
      ctx.fillStyle = color
      const tip = Math.floor(head)
      for (let r = Math.max(0, Math.floor(head - TRAIL)); r <= Math.min(rows - 1, tip); r++) {
        ctx.globalAlpha = r === tip ? 1 : Math.max(0, 1 - (head - r) / TRAIL) * 0.75
        ctx.fillText(glyph(), c * CELL + CELL / 2, r * CELL + CELL / 2)
      }
    }
    if (done) ctx.clearRect(0, 0, w, h)
    else raf = requestAnimationFrame(draw)
  }

  draw(t0)
  return () => {
    cancelAnimationFrame(raf)
    ctx.clearRect(0, 0, w, h)
  }
}

export function ProjectMonitor({ entries, selected, on, label }: { entries: Entry[]; selected: number; on: boolean; label: string }) {
  const rain = useRef<HTMLCanvasElement>(null)
  // Only projects already shown keep an image in the frame, so the section loads one picture up front.
  const [seen, setSeen] = useState([selected])
  if (!seen.includes(selected)) setSeen([...seen, selected])

  useEffect(() => {
    const canvas = rain.current
    if (!on || !canvas || matchMedia("(prefers-reduced-motion: reduce)").matches) return
    return decode(canvas, entries[selected].accent)
  }, [on, selected, entries])

  const entry = entries[selected]
  return (
    <div className={styles.monitor} data-on={on} style={{ "--accent": entry.accent } as React.CSSProperties}>
      <div className={styles.monitorBar}>
        <span>{`${label} // ${entry.n} / ${entry.code}`}</span>
        {entry.status && <span className={styles.monitorStatus}>{entry.slug === "thesis-engine" && <i className={styles.live} aria-hidden="true" />}{entry.status}</span>}
      </div>
      <div className={styles.monitorScreen} aria-hidden="true">
        {seen.map(i => (
          <Image key={entries[i].slug} src={entries[i].image} alt="" fill sizes="(min-width: 1001px) 34vw, (min-width: 801px) 44vw, 40vw" className={cn(styles.monitorImage, i === selected && styles.monitorImageOn)} style={{ objectPosition: entries[i].position }} />
        ))}
        <canvas ref={rain} className={styles.monitorRain} />
      </div>
      <div className={styles.monitorInfo}>
        <p className={styles.monitorName}>{entry.name}</p>
        <p className={styles.monitorChapter}>{entry.chapter}</p>
        <p className={styles.monitorStat}><strong>{entry.proof}</strong><span>{entry.proofLabel}</span></p>
        <WipeLink href={`/contracts/${entry.slug}`} className={styles.monitorOpen} data-cursor="open">
          <span>{entry.open}</span><span className={styles.openIcon}><ArrowUpRight /></span>
        </WipeLink>
      </div>
    </div>
  )
}
