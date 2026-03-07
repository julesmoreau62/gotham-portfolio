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
  title: "CLASSIFIED // AGENT PROFILE - Jules Moreau",
  description:
    "Jules Moreau - M1 STAPS ISA Sport Management Student. Specialized in event management, digital communication & strategic business analysis.",
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
              "jobTitle": "M1 International Sport Administration — Esports Operations",
              "description": "Hybrid sport-management/esports strategist. Former French Navy Reserve NCO (NATO Secret). M1 ISA Université de Lille. Seeking esports operations internship Apr–Aug 2026.",
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
