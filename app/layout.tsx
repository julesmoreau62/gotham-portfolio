import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono, Share_Tech_Mono } from "next/font/google"

import "./globals.css"

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
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
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${shareTechMono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
