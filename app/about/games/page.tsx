import type { Metadata } from "next"
import { GamesPage } from "@/components/about/games-page"
import { ogImages } from "@/lib/og-image"

export const metadata: Metadata = {
  title: "Games That Shaped Me",
  description: "The personal side of Jules Moreau: competitive gaming and a hand-built Minecraft city shaped over more than 250 hours.",
  alternates: { canonical: "/about/games" },
  openGraph: {
    title: "Games That Shaped Me — Jules Moreau",
    description: "Competition, creativity, and a unique Minecraft city built by hand over more than 250 hours.",
    url: "/about/games",
    type: "website",
    images: ogImages("en").openGraph,
  },
}

export default function Page() {
  return <GamesPage />
}
