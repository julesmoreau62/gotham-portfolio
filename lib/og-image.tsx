/* ------------------------------------------------------------------
   OG IMAGE — the 1200×630 card shown when the site is shared on
   LinkedIn, by email or in a messaging app. Rendered once at build time
   by app/opengraph-image.tsx (EN) and app/fr/opengraph-image.tsx (FR).
   ------------------------------------------------------------------ */

import { readFile } from "node:fs/promises"
import path from "node:path"
import { ImageResponse } from "next/og"
import { COPY } from "@/lib/copy"
import type { Locale } from "@/lib/i18n"

export const OG_SIZE = { width: 1200, height: 630 }

export const OG_ALT: Record<Locale, string> = {
  en: "Jules Moreau — Digital transformation & AI internship, February to June 2027",
  fr: "Jules Moreau — Stage transformation digitale & IA, février à juin 2027",
}

/** For pages whose own openGraph metadata would otherwise drop the card. */
export function ogImages(locale: Locale) {
  const base = locale === "en" ? "" : `/${locale}`
  return {
    openGraph: [{ url: `${base}/opengraph-image`, ...OG_SIZE, alt: OG_ALT[locale] }],
    twitter: [{ url: `${base}/twitter-image`, ...OG_SIZE, alt: OG_ALT[locale] }],
  }
}

const INK = "#f2f1ec"
const MUTE = "rgba(242,241,236,0.62)"
const ACID = "#c8ff00"
const BG = "#070707"

const file = (relative: string) => path.join(process.cwd(), relative)

/* The card is the intro's last frame: digital rain, and the name it has
   just written in the middle. The intro's katakana are left out, as the
   bundled mono font has none; digits and symbols carry the rain. */
const RAIN = { cell: 20, cols: 60, rows: 32 }
const RAIN_GLYPHS = [..."0123456789JM:=+*<>"]

/** A small seeded generator, so every build draws the same rain. */
function seeded(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }
}

/** Each column: its glyphs, the row its drop has reached, and how long its trail is. */
function rainColumns() {
  const random = seeded(2026)
  return Array.from({ length: RAIN.cols }, () => ({
    glyphs: Array.from({ length: RAIN.rows }, () => RAIN_GLYPHS[Math.floor(random() * RAIN_GLYPHS.length)]),
    head: Math.floor(random() * (RAIN.rows + 8)) - 4,
    trail: 6 + Math.floor(random() * 14),
  }))
}

export async function renderOgImage(locale: Locale) {
  const t = COPY[locale].hero
  const [black, mono] = await Promise.all([
    readFile(file("assets/fonts/Archivo-SemiExpanded-Black.ttf")),
    readFile(file("assets/fonts/JetBrainsMono-Medium.ttf")),
  ])

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: BG, color: INK, fontFamily: "JetBrains Mono" }}>
        {rainColumns().map((column, x) => (
          <div key={x} style={{ position: "absolute", left: x * RAIN.cell, top: 0, display: "flex", flexDirection: "column", fontSize: 15, lineHeight: `${RAIN.cell}px` }}>
            {column.glyphs.map((glyph, y) => {
              const behind = column.head - y
              const lit = behind >= 0 && behind < column.trail
              const opacity = behind === 0 ? 0.95 : lit ? 0.42 * (1 - behind / column.trail) + 0.05 : 0.04
              return <span key={y} style={{ width: RAIN.cell, justifyContent: "center", color: behind === 0 ? INK : ACID, opacity }}>{glyph}</span>
            })}
          </div>
        ))}
        {/* The rain dims behind the name, as it does under the intro's choice. */}
        <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", display: "flex", backgroundImage: `radial-gradient(ellipse 70% 42% at 50% 50%, rgba(7,7,7,0.95) 0%, rgba(7,7,7,0.75) 55%, rgba(7,7,7,0.2) 100%)` }} />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", padding: "44px 56px 52px", textShadow: `0 0 8px ${BG}, 0 0 16px ${BG}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 17, letterSpacing: 1.5, textTransform: "uppercase" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 12, color: MUTE }}><span style={{ width: 9, height: 9, background: ACID }} />JM / Portfolio 2026</span>
            <span style={{ color: MUTE }}>julesmoreau.eu</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ display: "flex", fontFamily: "Archivo Black", fontSize: 92, lineHeight: 1, letterSpacing: -1, whiteSpace: "nowrap", color: ACID, textShadow: `0 0 28px rgba(200,255,0,0.55), 0 0 60px rgba(200,255,0,0.25)` }}>JULES MOREAU</div>
            <div style={{ display: "flex", width: 980, height: 2, marginTop: 22, background: ACID, opacity: 0.55 }} />
            <div style={{ display: "flex", marginTop: 24, fontSize: 22, letterSpacing: 5, textTransform: "uppercase", color: INK }}>{t.role} · Lille</div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 14, fontSize: 19, color: MUTE }}>
            <span>{t.availability}</span>
            <span style={{ color: ACID }}>{t.window}</span>
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, bottom: 0, width: "100%", height: 8, background: ACID }} />
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Archivo Black", data: black, weight: 900, style: "normal" },
        { name: "JetBrains Mono", data: mono, weight: 500, style: "normal" },
      ],
    },
  )
}
