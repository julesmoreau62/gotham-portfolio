import type { Metadata } from "next"
import { HomePage } from "@/components/home/home-page"
import { HOME_PATH, languageAlternates } from "@/lib/i18n"

const title = "Jules Moreau — Transformation digitale & IA"
const description =
  "Étudiant en M2 International Sport Administration, je cherche un stage en transformation digitale & IA dans une structure sportive, de février à juin 2027. Cartographie des process, automatisation, outils IA et adoption par les équipes."

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: HOME_PATH.fr, languages: languageAlternates(HOME_PATH) },
  openGraph: { title, description, url: HOME_PATH.fr, siteName: "Jules Moreau", type: "profile", locale: "fr_FR", alternateLocale: ["en_US"] },
  twitter: { card: "summary_large_image", title, description },
}

export default function Page() {
  return <HomePage locale="fr" />
}
