/* ------------------------------------------------------------------
   I18N — the home page and the briefing exist in English and French.
   Case studies and the games page stay in English.
   ------------------------------------------------------------------ */

export type Locale = "en" | "fr"

export const HOME_PATH: Record<Locale, string> = { en: "/", fr: "/fr" }
export const BRIEFING_PATH: Record<Locale, string> = { en: "/briefing", fr: "/fr/briefing" }

/** Link to a home section, e.g. `/#contracts` or `/fr#contracts`. */
export function homeSection(locale: Locale, id: string) {
  return `${locale === "en" ? "/" : HOME_PATH[locale]}#${id}`
}

/** hreflang alternates for a page that exists in both languages. */
export function languageAlternates(paths: Record<Locale, string>) {
  return { en: paths.en, fr: paths.fr, "x-default": paths.en }
}
