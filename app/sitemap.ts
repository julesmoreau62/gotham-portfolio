import type { MetadataRoute } from "next"
import { CONTRACT_SLUGS } from "@/lib/contracts"
import { SITE } from "@/lib/profile"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: SITE.url, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE.url}/briefing`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...CONTRACT_SLUGS.map((slug) => ({
      url: `${SITE.url}/contracts/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ]
}
