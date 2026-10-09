import { BriefingPage, briefingMetadata } from "@/components/briefing/briefing-page"

export const metadata = briefingMetadata("fr")

export default function Page() {
  return <BriefingPage locale="fr" />
}
