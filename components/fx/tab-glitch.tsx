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

// Drawn at 64px but shown at 16px, so every defect has to be chunky to read.
function drawFavicon(ctx: CanvasRenderingContext2D, amount: number) {
  const s = 64
  const inverted = Math.random() < 0.3
  const tile = inverted ? "#070707" : "#c8ff00"
  const ink = inverted ? "#00ff46" : "#070707"
  ctx.fillStyle = "#070707"
  ctx.fillRect(0, 0, s, s)
  ctx.font = "800 30px Arial, Helvetica, sans-serif"
  ctx.textAlign = "center"

  // Torn "JM" tile: thick horizontal bands shoved sideways, with an RGB split.
  for (let y = 0; y < s; y += 16) {
    const shift = Math.random() < amount ? (Math.random() - 0.5) * 40 : 0
    ctx.save()
    ctx.beginPath()
    ctx.rect(0, y, s, 16)
    ctx.clip()
    ctx.translate(shift, 0)
    ctx.fillStyle = tile
    ctx.fillRect(0, 0, s, s)
    ctx.fillStyle = "#ff0055"
    ctx.fillText("JM", 27, 43)
    ctx.fillStyle = "#00e5ff"
    ctx.fillText("JM", 37, 43)
    ctx.fillStyle = ink
    ctx.fillText("JM", 32, 43)
    ctx.restore()
  }

  // Dead pixel blocks.
  const blocks = 1 + Math.floor(amount * 5)
  for (let i = 0; i < blocks; i++) {
    ctx.fillStyle = ["#070707", "#00ff46", "#eaffea", "#c8ff00"][Math.floor(Math.random() * 4)]
    ctx.fillRect(Math.random() * s, Math.random() * s, 8 + Math.random() * 18, 4 + Math.random() * 10)
  }

  // Green rain bleeding through in fat glyphs.
  ctx.font = "bold 22px monospace"
  ctx.textAlign = "left"
  for (let x = 0; x < s; x += 16) {
    if (Math.random() > amount) continue
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
