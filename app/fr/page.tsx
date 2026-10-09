import type { Metadata } from "next"
import { HomePage } from "@/components/home/home-page"
import { HOME_PATH, languageAlternates } from "@/lib/i18n"

const title = "Jules Moreau — Événementiel sportif"
const description =
  "Étudiant en M2 International Sport Administration, je cherche un stage en événementiel de février à juin 2027. Logistique événementielle, activation sponsors, communication digitale et veille."

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
