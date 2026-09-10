"use client"

import { useEffect, useRef, useState } from "react"

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/<>[]=_-"

/** Decodes text glyph-by-glyph. `play` restarts the effect when it flips to true. */
export function Scramble({
  text,
  className,
  play = true,
  duration = 900,
  delay = 0,
}: {
  text: string
  className?: string
  play?: boolean
  duration?: number
  delay?: number
}) {
  const [out, setOut] = useState(text)
  const ran = useRef(false)

  useEffect(() => {
    if (!play) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOut(text)
      return
    }
    ran.current = true
    let raf = 0
    let t0 = 0
    const start = window.setTimeout(() => {
      t0 = performance.now()
      const tick = (now: number) => {
        const p = Math.min((now - t0) / duration, 1)
        const locked = Math.floor(p * text.length)
        let s = ""
        for (let i = 0; i < text.length; i++) {
          const ch = text[i]
          if (ch === " " || i < locked) s += ch
          else s += GLYPHS[(i * 7 + Math.floor(now / 40)) % GLYPHS.length]
        }
        setOut(s)
        if (p < 1) raf = requestAnimationFrame(tick)
        else setOut(text)
      }
      raf = requestAnimationFrame(tick)
    }, delay)
    return () => {
      window.clearTimeout(start)
      cancelAnimationFrame(raf)
    }
  }, [play, text, duration, delay])

  return (
    <span className={className} aria-label={text}>
      {out}
    </span>
  )
}
