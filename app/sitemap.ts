import type { MetadataRoute } from "next"
import { CONTRACT_SLUGS } from "@/lib/contracts"
import { SITE } from "@/lib/profile"
import { BRIEFING_PATH, HOME_PATH } from "@/lib/i18n"

/** The same page in English and French, with hreflang alternates. */
function bilingual(paths: typeof HOME_PATH, priority: number, now: Date): MetadataRoute.Sitemap {
  const languages = { en: `${SITE.url}${paths.en === "/" ? "" : paths.en}`, fr: `${SITE.url}${paths.fr}` }
  return [languages.en, languages.fr].map(url => ({ url, lastModified: now, changeFrequency: "monthly" as const, priority, alternates: { languages } }))
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    ...bilingual(HOME_PATH, 1, now),
    ...bilingual(BRIEFING_PATH, 0.9, now),
    { url: `${SITE.url}/about/games`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    ...CONTRACT_SLUGS.map((slug) => ({
      url: `${SITE.url}/contracts/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ]
}
