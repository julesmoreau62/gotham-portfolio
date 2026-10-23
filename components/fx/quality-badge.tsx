"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { useQuality } from "@/hooks/use-quality"
import { chooseQuality, dismissQualityBadge, watchQuality } from "@/lib/quality"

const COPY = {
  en: {
    title: "Light mode",
    text: "Your device seems to be struggling, so the animations are simplified to keep the site smooth.",
    full: "Full quality",
    ok: "OK",
    more: "Why the light mode?",
  },
  fr: {
    title: "Mode allégé",
    text: "Votre appareil semble avoir du mal : les animations sont simplifiées pour que le site reste fluide.",
    full: "Qualité max",
    ok: "OK",
    more: "Pourquoi le mode allégé ?",
  },
}

/** The explanation folds into a small tag after this long, so it never sits on the page. */
const FOLD_MS = 12000

/** Watches the frame rate and, once the site has switched to lite mode, says so, then folds away. */
export function QualityBadge() {
  const { quality, forced, dismissed } = useQuality()
  const pathname = usePathname()
  const shown = quality === "lite" && !forced && !dismissed
  const [open, setOpen] = useState(true)

  useEffect(() => watchQuality(), [])
  useEffect(() => {
    if (!shown || !open) return
    const fold = window.setTimeout(() => setOpen(false), FOLD_MS)
    return () => window.clearTimeout(fold)
  }, [shown, open])

  if (!shown) return null
  const t = pathname === "/fr" || pathname.startsWith("/fr/") ? COPY.fr : COPY.en
  const place = pathname.startsWith("/dossier") ? "raised" : undefined

  if (!open) {
    return (
      <button type="button" className="quality-badge quality-badge-tag" data-place={place} onClick={() => setOpen(true)} aria-expanded={false} title={t.more}>
        <i aria-hidden="true" /> {t.title}
      </button>
    )
  }
  return (
    <aside className="quality-badge" data-place={place} role="status" aria-label={t.title}>
      <p className="quality-badge-title"><i aria-hidden="true" /> {t.title}</p>
      <p className="quality-badge-text">{t.text}</p>
      <div className="quality-badge-actions">
        <button type="button" onClick={() => chooseQuality("full")}>{t.full}</button>
        <button type="button" onClick={dismissQualityBadge}>{t.ok}</button>
      </div>
    </aside>
  )
}
