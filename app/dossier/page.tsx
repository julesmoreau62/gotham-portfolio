import type { Metadata } from "next"
import { DossierExperience } from "@/components/dossier/dossier-experience"

export const metadata: Metadata = {
  title: "Dossier",
  description: "A narrated intelligence file on Jules Moreau: where he grew up, what drives him and what he builds.",
  // Kept out of search results until every segment is in.
  robots: { index: false, follow: true },
}

export default function Page() {
  return <DossierExperience />
}
