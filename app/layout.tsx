import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"

const url = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: "Moreau Harness · Jules Moreau, digital transformation and AI",
  description:
    "Chat with the AI double of Jules Moreau: digital transformation and AI for sport organisations. M2 International Sport Administration, open to an internship from February to June 2027.",
  openGraph: { title: "Moreau Harness", description: "Chat with Jules Moreau's AI double and explore his projects.", type: "website" },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#161616" },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
