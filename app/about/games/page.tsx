import type { Metadata } from "next"
import { GamesPage } from "@/components/about/games-page"

export const metadata: Metadata = {
  title: "Games That Shaped Me",
  description: "The personal side of Jules Moreau: two years in Overwatch's Top 20–200, FACEIT level 10 on Counter-Strike, Rainbow Six Siege and a Minecraft city project.",
  alternates: { canonical: "/about/games" },
  openGraph: {
    title: "Games That Shaped Me — Jules Moreau",
    description: "Competition, creativity, and the games that are part of my story.",
    url: "/about/games",
    type: "website",
  },
}

export default function Page() {
  return <GamesPage />
}
