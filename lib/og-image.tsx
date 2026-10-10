/* ------------------------------------------------------------------
   OG IMAGE — the 1200×630 card shown when the site is shared on
   LinkedIn, by email or in a messaging app. Rendered once at build time
   by app/opengraph-image.tsx (EN) and app/fr/opengraph-image.tsx (FR).
   ------------------------------------------------------------------ */

import { readFile } from "node:fs/promises"
import path from "node:path"
import { ImageResponse } from "next/og"
import sharp from "sharp"
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
const PHOTO_WIDTH = 520

const file = (relative: string) => path.join(process.cwd(), relative)

export async function renderOgImage(locale: Locale) {
  const t = COPY[locale].hero
  const [black, semibold, mono, photo] = await Promise.all([
    readFile(file("assets/fonts/Archivo-SemiExpanded-Black.ttf")),
    readFile(file("assets/fonts/Archivo-SemiBold.ttf")),
    readFile(file("assets/fonts/JetBrainsMono-Medium.ttf")),
    // Same photo and treatment as the hero: grayscale, darkened.
    sharp(file("public/assets/portfolio/volleyball-6.webp"))
      .resize(PHOTO_WIDTH, OG_SIZE.height, { fit: "cover", position: "top" })
      .grayscale()
      .modulate({ brightness: 0.62 })
      .jpeg({ quality: 82 })
      .toBuffer(),
  ])
  const specialty = t.specialty.replace(/\. /g, " · ").replace(/\.$/, "")

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: BG, color: INK, fontFamily: "Archivo" }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- rendered by Satori, not the browser */}
        <img src={`data:image/jpeg;base64,${photo.toString("base64")}`} width={PHOTO_WIDTH} height={OG_SIZE.height} alt="" style={{ position: "absolute", right: 0, top: 0 }} />
        <div style={{ position: "absolute", right: 0, top: 0, width: PHOTO_WIDTH, height: OG_SIZE.height, display: "flex", backgroundImage: `linear-gradient(90deg, ${BG} 0%, rgba(7,7,7,0.55) 45%, rgba(7,7,7,0.1) 100%)` }} />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", padding: "52px 64px 58px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 18, borderBottom: "1px solid rgba(242,241,236,0.16)", fontFamily: "JetBrains Mono", fontSize: 17, letterSpacing: 1.5, textTransform: "uppercase" }}>
            <span style={{ color: ACID }}>{t.kicker}</span>
            <span style={{ color: MUTE }}>julesmoreau.eu</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: "JetBrains Mono", fontSize: 19, color: MUTE }}>
              <div style={{ width: 10, height: 10, background: ACID }} />
              <span>{t.availability}</span>
              <span style={{ color: ACID }}>{t.window}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", marginTop: 26, fontFamily: "Archivo Black", fontSize: 104, lineHeight: 0.9, letterSpacing: -4, textTransform: "uppercase" }}>
              <span>{t.title[0]}</span>
              <span style={{ color: ACID }}>{t.title[1]}</span>
            </div>
            <div style={{ display: "flex", marginTop: 30, fontSize: 27, fontWeight: 600 }}>{specialty}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: "JetBrains Mono", fontSize: 19 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 42, height: 42, background: ACID, color: BG, fontSize: 15 }}>JM</div>
            <span>Jules Moreau</span>
            <span style={{ color: MUTE }}>/ {t.role}</span>
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, bottom: 0, width: "100%", height: 8, background: ACID }} />
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Archivo Black", data: black, weight: 900, style: "normal" },
        { name: "Archivo", data: semibold, weight: 600, style: "normal" },
        { name: "JetBrains Mono", data: mono, weight: 500, style: "normal" },
      ],
    },
  )
}
