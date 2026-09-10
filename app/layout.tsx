import type { Metadata, Viewport } from "next"
import { Archivo, JetBrains_Mono } from "next/font/google"
import { Providers } from "@/components/fx/providers"
import { PROFILE, SITE } from "@/lib/profile"
import "./globals.css"

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
})

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: "%s — Jules Moreau",
  },
  description: SITE.description,
  alternates: { canonical: SITE.url },
  openGraph: {
    title: SITE.title,
    description: SITE.description,
    url: SITE.url,
    siteName: "Jules Moreau",
    type: "profile",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: "#070707",
  colorScheme: "dark",
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Jules Moreau",
  url: SITE.url,
  email: `mailto:${PROFILE.email}`,
  jobTitle: `${PROFILE.degree} — ${PROFILE.role}`,
  description: SITE.description,
  seeks: {
    "@type": "Demand",
    name: PROFILE.seeking,
    availabilityStarts: "2027-02-01",
    availabilityEnds: "2027-06-30",
    areaServed: ["FR", "BE", "EU"],
  },
  knowsAbout: [
    "Esports Management",
    "Event Operations",
    "Sport Governance",
    "Sponsor Activation",
    "Strategic Analysis",
    "Crisis Management",
    "Sport Photography",
  ],
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "Université de Lille (STAPS/ISA)" },
    { "@type": "CollegeOrUniversity", name: "ULCO" },
  ],
  nationality: "French",
  address: { "@type": "PostalAddress", addressLocality: "Lille", addressCountry: "FR" },
  sameAs: [PROFILE.linkedin],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${mono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-bg text-ink antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
