import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  Brain,
  Camera,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  Globe2,
  Mail,
  Radio,
  ShieldCheck,
  Target,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Recruiter Briefing | Jules Moreau",
  description:
    "Short recruiter briefing for Jules Moreau: esports operations, event logistics, sponsor activation, digital communication and competitive intelligence.",
}

const focusAreas = [
  "Esports operations and event management",
  "Sport communication and sponsor activation",
  "AI-augmented digital products and intelligence workflows",
]

const proofPoints = [
  {
    title: "Royal Daring HC",
    role: "Communication and Sponsoring - ISA internship",
    result:
      "Built a sponsor-ready system: bilingual partner website, 9-page PDF brochure, brand guidelines, social assets and editorial handover.",
    metric: "FR/NL site + 30+ visuals",
    href: "/#daring",
    icon: ShieldCheck,
  },
  {
    title: "ASN95 Signal",
    role: "Head of Communications",
    result:
      "Rebuilt club communication from scratch with sponsor-led formats, matchday photography and recurring digital activations.",
    metric: "+467% CTR / 1.0M reach",
    href: "/#signal",
    icon: Radio,
  },
  {
    title: "BLAST Strategy",
    role: "Strategic esports case study",
    result:
      "Produced a 23-page analysis using PESTEL, VRIO and SWOT, with a market entry recommendation and execution roadmap.",
    metric: "23-page dossier",
    href: "/#strategy",
    icon: Target,
  },
]

const capabilities = [
  "Event logistics",
  "Crisis management",
  "Sponsor activation",
  "Sport governance",
  "Content strategy",
  "Photography and visual production",
  "AI-assisted web delivery",
  "Competitive intelligence",
]

const quickLinks = [
  { label: "Immersive portfolio", href: "/", icon: Globe2 },
  { label: "Featured case", href: "/#daring", icon: ShieldCheck },
  { label: "CV PDF", href: "/assets/cv-julesmoreau.pdf", icon: Download, download: true },
  { label: "Email", href: "mailto:jules.moreau1@outlook.com", icon: Mail },
]

export default function BriefingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border/50 bg-card/35 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Gotham
          </Link>
          <div className="hidden items-center gap-2 sm:flex">
            <a
              href="/assets/cv-julesmoreau.pdf"
              download
              className="inline-flex min-h-9 items-center gap-2 rounded border border-accent/35 bg-accent/10 px-3 text-[10px] font-mono font-bold uppercase tracking-[0.16em] text-accent transition-colors hover:bg-accent/20"
            >
              <Download className="h-3.5 w-3.5" />
              CV
            </a>
            <a
              href="mailto:jules.moreau1@outlook.com"
              className="inline-flex min-h-9 items-center gap-2 rounded border border-[hsl(var(--field-green))]/35 bg-[hsl(var(--field-green))]/10 px-3 text-[10px] font-mono font-bold uppercase tracking-[0.16em] text-[hsl(var(--field-green))] transition-colors hover:bg-[hsl(var(--field-green))]/20"
            >
              <Mail className="h-3.5 w-3.5" />
              Contact
            </a>
          </div>
        </div>
      </div>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-10 md:grid-cols-[1fr_340px] md:py-14">
        <div className="space-y-7">
          <div className="space-y-4">
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.28em] text-primary">
              30-second recruiter briefing
            </p>
            <div className="space-y-3">
              <h1 className="font-tech text-4xl font-bold uppercase tracking-wide text-foreground md:text-6xl">
                Jules Moreau
              </h1>
              <p className="max-w-3xl text-base leading-relaxed text-foreground md:text-lg">
                Seeking an{" "}
                <span className="font-semibold text-[hsl(var(--field-green))]">
                  Esports Operations / Event Management internship
                </span>
                , February to June 2027.
              </p>
              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
                M2 International Sport Administration student focused on esports operations,
                event logistics, sponsor activation and AI-augmented digital systems.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {focusAreas.map((item) => (
              <div key={item} className="rounded border border-border/50 bg-card/45 p-4">
                <CheckCircle2 className="mb-3 h-4 w-4 text-[hsl(var(--field-green))]" />
                <p className="text-sm leading-relaxed text-foreground/80">{item}</p>
              </div>
            ))}
          </div>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-primary" />
              <h2 className="font-tech text-xl font-bold uppercase tracking-[0.14em]">
                Best Evidence
              </h2>
            </div>
            <div className="grid gap-3">
              {proofPoints.map((point) => {
                const Icon = point.icon
                return (
                  <Link
                    key={point.title}
                    href={point.href}
                    className="group rounded border border-border/50 bg-card/45 p-4 transition-colors hover:border-primary/45 hover:bg-primary/[0.06]"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-primary/30 bg-primary/10">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-tech text-lg font-bold uppercase tracking-[0.1em] text-foreground">
                            {point.title}
                          </h3>
                          <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.18em] text-primary/80">
                            {point.role}
                          </p>
                          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                            {point.result}
                          </p>
                        </div>
                      </div>
                      <span className="w-fit rounded border border-accent/30 bg-accent/10 px-2.5 py-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.14em] text-accent">
                        {point.metric}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="overflow-hidden rounded border border-border/50 bg-card/55">
            <div className="relative aspect-[4/3]">
              <Image
                src="/assets/Royal%20daring%20/Daring%20Vitrine%20Marketing/img/hero.jpg"
                alt="Royal Daring HC case study"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 340px, 100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/85 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#C9A84C]">
                  Featured case
                </p>
                <p className="mt-1 font-tech text-xl font-bold uppercase tracking-wide text-white">
                  Royal Daring HC
                </p>
              </div>
            </div>
            <div className="space-y-3 p-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                The strongest proof of combined sport communication, sponsor strategy,
                visual identity and digital delivery.
              </p>
              <a
                href="https://leafy-pavlova-69305b.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full min-h-10 items-center justify-center gap-2 rounded border border-[#C8102E]/45 bg-[#C8102E]/12 px-3 text-[10px] font-mono font-bold uppercase tracking-[0.16em] text-[#F4F0E8] transition-colors hover:bg-[#C8102E]/24"
              >
                <ExternalLink className="h-3.5 w-3.5 text-[#C9A84C]" />
                View live website
              </a>
            </div>
          </div>

          <div className="rounded border border-border/50 bg-card/45 p-4">
            <div className="mb-4 flex items-center gap-2">
              <Brain className="h-4 w-4 text-[hsl(var(--neon-cyan))]" />
              <h2 className="font-tech text-base font-bold uppercase tracking-[0.14em]">
                Capability Stack
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {capabilities.map((capability) => (
                <span
                  key={capability}
                  className="rounded border border-border/50 bg-background/35 px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-[0.12em] text-muted-foreground"
                >
                  {capability}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {quickLinks.map((link) => {
              const Icon = link.icon
              return (
                <a
                  key={link.label}
                  href={link.href}
                  download={link.download}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded border border-border/50 bg-card/45 px-3 text-center text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-foreground/80 transition-colors hover:border-primary/45 hover:bg-primary/10 hover:text-primary"
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  {link.label}
                </a>
              )
            })}
          </div>

          <div className="rounded border border-border/50 bg-card/45 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Camera className="h-4 w-4 text-accent" />
              <h2 className="font-tech text-base font-bold uppercase tracking-[0.14em]">
                Fast Read
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Hybrid profile: sport management training, military reserve discipline,
              field operations, photography, digital communication and practical AI tooling.
            </p>
          </div>
        </aside>
      </section>
    </main>
  )
}
