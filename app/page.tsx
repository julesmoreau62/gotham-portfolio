import type { Metadata } from "next"
import { HomePage } from "@/components/home/home-page"
import { HOME_PATH, languageAlternates } from "@/lib/i18n"

export const metadata: Metadata = {
  alternates: { canonical: HOME_PATH.en, languages: languageAlternates(HOME_PATH) },
}

export default function Page() {
  return <HomePage locale="en" />
}
