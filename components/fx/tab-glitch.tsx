"use client"

import { useEffect } from "react"

// The browser tab is permanently broken: the title keeps scrambling into Matrix
// glyphs and the favicon tears into green rain, worse when you look away.
const GLYPHS = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ01<>/#*+=_"
const FRAME_MS = 70

const pick = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]

function scramble(title: string, amount: number) {
  const chars = Array.from(title, (ch) => (ch !== " " && Math.random() < amount ? pick() : ch))
  // Never a fully clean frame.
  chars[Math.floor(Math.random() * chars.length)] = pick()
  return chars.join("")
}

// Same broken J/M monogram as app/icon.svg, redrawn with fresh damage each frame.
// Drawn at 64px but shown at 16px, so every defect has to be chunky to read.
const MONOGRAM = "M24 12V42Q24 52 14 52H8M24 12L38 34L52 12V52"
let monogram: Path2D | null = null

function drawFavicon(ctx: CanvasRenderingContext2D, amount: number) {
  const s = 64
  monogram ??= new Path2D(MONOGRAM)
  const inverted = Math.random() < 0.2
  const bg = inverted ? "#c8ff00" : "#070707"
  const ink = inverted ? "#070707" : "#c8ff00"
  const split = 2 + Math.random() * 6 * amount

  const stroke = (color: string, dx: number) => {
    ctx.save()
    ctx.translate(dx, 0)
    ctx.strokeStyle = color
    ctx.stroke(monogram!)
    ctx.restore()
  }

  // Thick bands shoved sideways, each with its own RGB split.
  ctx.lineWidth = 8
  for (let y = 0; y < s; y += 13) {
    const shift = Math.random() < amount ? (Math.random() - 0.5) * 36 : 0
    ctx.save()
    ctx.beginPath()
    ctx.rect(0, y, s, 13)
    ctx.clip()
    ctx.fillStyle = bg
    ctx.fillRect(0, y, s, 13)
    stroke("#ff0055", shift - split)
    stroke("#00e5ff", shift + split)
    stroke(ink, shift)
    ctx.restore()
  }

  // Dead pixel blocks.
  const blocks = Math.floor(amount * 5)
  for (let i = 0; i < blocks; i++) {
    ctx.fillStyle = ["#070707", "#00ff46", "#eaffea", "#c8ff00"][Math.floor(Math.random() * 4)]
    ctx.fillRect(Math.random() * s, Math.random() * s, 8 + Math.random() * 18, 4 + Math.random() * 10)
  }

  // Green rain bleeding through in fat glyphs.
  ctx.font = "bold 22px monospace"
  ctx.textAlign = "left"
  for (let x = 0; x < s; x += 16) {
    if (Math.random() > amount * 0.7) continue
    const head = Math.random() * s
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = i === 0 ? "#eaffea" : `rgba(0, 255, 70, ${0.9 - i * 0.25})`
      ctx.fillText(pick(), x, head - i * 20)
    }
  }
}

export function TabGlitch() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const canvas = document.createElement("canvas")
    canvas.width = canvas.height = 64
    const ctx = canvas.getContext("2d")

    let baseTitle = document.title
    let written = ""
    let iconLink: HTMLLinkElement | null = null
    let iconHref = ""
    let spike = 0
    let timer = 0

    // Next.js rewrites the title and icon on navigation: adopt whatever it set.
    const sync = () => {
      if (document.title !== written) baseTitle = document.title
      const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
      if (link !== iconLink || (link && !link.href.startsWith("data:"))) {
        iconLink = link
        iconHref = link?.href ?? ""
      }
    }

    const restore = () => {
      sync()
      if (document.title === written) document.title = baseTitle
      written = ""
      if (iconLink && iconHref) iconLink.href = iconHref
    }

    // Always a little corrupted, with frequent heavier spikes on top.
    const tick = () => {
      sync()
      if (spike <= 0 && Math.random() < (document.hidden ? 0.5 : 0.18)) spike = 3 + Math.floor(Math.random() * 6)
      const amount = spike > 0 ? 0.35 + Math.random() * 0.5 : 0.04 + Math.random() * 0.08
      if (spike > 0) spike--
      written = scramble(baseTitle, amount)
      document.title = written
      if (ctx && iconLink) {
        drawFavicon(ctx, Math.max(amount, 0.45))
        iconLink.href = canvas.toDataURL("image/png")
      }
      timer = window.setTimeout(tick, FRAME_MS)
    }
    tick()

    return () => {
      window.clearTimeout(timer)
      restore()
    }
  }, [])

  return null
}
