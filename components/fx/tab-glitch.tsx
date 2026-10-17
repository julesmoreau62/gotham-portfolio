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

function drawFavicon(ctx: CanvasRenderingContext2D, amount: number) {
  const s = 64
  ctx.fillStyle = "#070707"
  ctx.fillRect(0, 0, s, s)

  // Torn "JM" tile: horizontal slices shifted sideways.
  for (let y = 0; y < s; y += 8) {
    const shift = Math.random() < amount ? (Math.random() - 0.5) * 24 : 0
    ctx.save()
    ctx.beginPath()
    ctx.rect(0, y, s, 8)
    ctx.clip()
    ctx.translate(shift, 0)
    ctx.fillStyle = "#c8ff00"
    ctx.fillRect(0, 0, s, s)
    ctx.fillStyle = "#070707"
    ctx.font = "800 26px Arial, Helvetica, sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("JM", 32, 40)
    ctx.restore()
  }

  // Green rain bleeding through.
  ctx.font = "bold 14px monospace"
  ctx.textAlign = "left"
  for (let x = 0; x < s; x += 11) {
    if (Math.random() > amount) continue
    const head = Math.random() * s
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = i === 0 ? "#eaffea" : `rgba(0, 255, 70, ${0.9 - i * 0.2})`
      ctx.fillText(pick(), x, head - i * 14)
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
        drawFavicon(ctx, Math.max(amount, 0.2))
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
