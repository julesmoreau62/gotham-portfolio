import React from "react"
import type { Metadata, Viewport } from "next"
import { Rajdhani, JetBrains_Mono, Share_Tech_Mono } from "next/font/google"

import "./globals.css"

const rajdhani = Rajdhani({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-rajdhani",
  display: "swap",
})
const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"], 
  variable: "--font-jetbrains-mono",
  display: "swap",
})
const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-share-tech-mono",
  display: "optional",
})

export const metadata: Metadata = {
  title: "Jules Moreau | Esports Operations Portfolio",
  description:
    "M2 International Sport Administration student seeking an Esports Operations / Event Management internship, February to June 2027. Event logistics, sponsor activation, digital communication and competitive intelligence.",
  alternates: {
    canonical: "https://www.julesmoreau.eu",
  },
  openGraph: {
    title: "Jules Moreau | Esports Operations Portfolio",
    description:
      "Seeking an Esports Operations / Event Management internship, February to June 2027. Event logistics, sponsor activation, digital communication and AI-augmented intelligence workflows.",
    url: "https://www.julesmoreau.eu",
    siteName: "Jules Moreau Portfolio",
    type: "profile",
  },
}

export const viewport: Viewport = {
  themeColor: "#0b1121",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${rajdhani.variable} ${jetbrainsMono.variable} ${shareTechMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Jules Moreau",
              "url": "https://www.julesmoreau.eu",
              "email": "mailto:jules.moreau1@outlook.com",
              "jobTitle": "M2 International Sport Administration — Esports Operations",
              "description": "Hybrid sport-management and esports operations profile. Former French Navy Reserve NCO, M2 ISA Université de Lille. Seeking an Esports Operations / Event Management internship from February to June 2027, focused on event logistics, sponsor activation, digital communication and competitive intelligence.",
              "seeks": {
                "@type": "Demand",
                "name": "Esports Operations / Event Management internship",
                "availabilityStarts": "2027-02-01",
                "availabilityEnds": "2027-06-30",
                "areaServed": ["FR", "BE", "EU"]
              },
              "knowsAbout": ["Esports Management", "Event Operations", "Sport Governance", "Sponsor Activation", "Strategic Analysis", "Crisis Management", "Sport Photography"],
              "alumniOf": [
                {"@type": "CollegeOrUniversity", "name": "Université de Lille (STAPS/ISA)"},
                {"@type": "CollegeOrUniversity", "name": "ULCO"}
              ],
              "nationality": "French",
              "address": {"@type": "PostalAddress", "addressLocality": "Lille", "addressCountry": "FR"},
              "sameAs": ["https://www.linkedin.com/in/jules-moreau-25405b363"]
            })
          }}
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
