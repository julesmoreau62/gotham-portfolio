import type { Metadata } from "next"
import { PROFILE } from "@/lib/profile"
import { CONTRACTS } from "@/lib/contracts"
import { TopBar } from "@/components/home/top-bar"
import { Footer } from "@/components/home/footer"
import { Btn, Chip, Kv, SectionHead, RegMarks, Barcode, ArrowUpRight } from "@/components/ui/primitives"
import { WipeLink } from "@/components/fx/page-wipe"
import { Reveal, Lines, Stagger } from "@/components/fx/reveal"
import { pad2 } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Event Management internship · February–June 2027",
  description:
    "Jules Moreau is seeking an Event Management internship from February to June 2027. Experience in field operations, event logistics, club communication and sponsor activation.",
  alternates: { canonical: "/briefing" },
  openGraph: {
    title: "Jules Moreau · Event Management internship",
    description: "February–June 2027 · Event logistics, field coordination and sponsor activation · France, Belgium and Europe.",
    url: "/briefing",
    type: "website",
    images: [{ url: "/assets/photo/volleyball-6.jpg", alt: "Volleyball photography by Jules Moreau" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jules Moreau · Event Management internship",
    description: "February–June 2027 · Event logistics, field coordination and sponsor activation.",
    images: ["/assets/photo/volleyball-6.jpg"],
  },
}

const FOCUS = [
  { title: "Event operations", body: "Prepare logistics, coordinate on site and adapt when plans change." },
  { title: "Communication & partners", body: "Keep participants informed and make sponsor commitments visible." },
  { title: "Useful production", body: "Deliver photos, content and reusable tools the team can keep using." },
]

const FEATURED_CONTRACTS = ["field-ops", "daring", "signal"].map(slug => CONTRACTS.find(c => c.slug === slug)!)

const CAPABILITIES = [
  "Event logistics",
  "Field coordination",
  "Venue & equipment coordination",
  "Sponsor activation",
  "Bilingual communication",
  "Photography and visual production",
  "Reusable content & digital tools",
]

export default function BriefingPage() {
  return (
    <>
      <TopBar variant="page" />
      <main className="min-h-screen pt-14">
        <section id="hero" className="relative px-5 pt-12 pb-10 md:px-8 md:pt-20">
          <RegMarks />
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <Reveal className="flex flex-wrap items-center gap-3">
                <Chip tone="acid" dot>
                  Recruiter overview
                </Chip>
                <span className="label text-mute">The essentials · 00:30</span>
              </Reveal>
              <Lines as="h1" play className="display-black mt-6 text-[clamp(44px,8vw,112px)]" lines={["Jules Moreau"]} />
              <Reveal className="mt-6 max-w-2xl display text-[clamp(18px,2.2vw,28px)] leading-[1.2]">
                Seeking an <span className="text-acid">{PROFILE.seeking.toLowerCase()}</span>, {PROFILE.window}.
              </Reveal>
              <Reveal delay={0.05} className="mt-4 max-w-2xl mono text-[13px] leading-relaxed text-mute">
                I help event teams prepare logistics, keep participants informed and make partners visible.
                My experience spans a campus tournament, club sponsorship and event infrastructure in French Guiana.
              </Reveal>
              <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-3">
                <Btn href={PROFILE.cv} download tone="acid">
                  Download CV
                </Btn>
                <Btn href={`mailto:${PROFILE.email}`} tone="ghost">
                  Email
                </Btn>
                <Btn href={PROFILE.linkedin} external tone="line">
                  LinkedIn
                </Btn>
                <Btn href="/" tone="line" wipe>
                  Follow my story
                </Btn>
              </Reveal>
            </div>
            <Reveal className="lg:col-span-4" delay={0.15}>
              <div className="border border-line bg-surface p-5">
                <Kv k="Status" v="Seeking internship" accent="#c8ff00" />
                <Kv k="Window" v={PROFILE.window} />
                <Kv k="Location" v={PROFILE.location} />
                <Kv k="Languages" v="FR native · EN C1" />
                <Kv k="Mobility" v="France · Belgium · Europe" />
                <Kv k="Degree" v="M2 ISA · Lille" />
                <div className="mt-5 flex items-end justify-between border-t border-line pt-4">
                  <Barcode seed="BRIEFING-2027" className="w-28 text-ink" height={26} />
                  <span className="label text-mute">ID · JM-2026</span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="px-5 py-12 md:px-8">
          <SectionHead index="01" kicker="Contribution" title="Where I can help" />
          <Stagger className="mt-8 grid grid-cols-1 gap-px bg-line md:grid-cols-3" stagger={0.08}>
            {FOCUS.map((f, i) => (
              <div key={f.title} className="bg-bg p-5">
                <span className="label text-acid">0{i + 1}</span>
                <h3 className="display mt-3 text-[20px] leading-tight">{f.title}</h3>
                <p className="mono mt-3 text-[12px] leading-relaxed text-mute">{f.body}</p>
              </div>
            ))}
          </Stagger>
        </section>

        <section className="px-5 py-12 md:px-8">
          <SectionHead index="02" kicker="Experience in practice" title="Three projects" right={<span>Event operations · Partners · Communication</span>} />
          <Stagger className="mt-8" stagger={0.08}>
            {FEATURED_CONTRACTS.map((c) => (
              <WipeLink
                key={c.slug}
                href={`/contracts/${c.slug}`}
                data-cursor="open"
                className="group grid grid-cols-1 gap-4 border-t border-line py-6 transition-colors hover:bg-surface md:grid-cols-12 md:items-center"
              >
                <div className="md:col-span-1 mono text-[11px] tracking-[0.2em]" style={{ color: c.accent }}>
                  {pad2(c.index)}
                </div>
                <div className="md:col-span-5">
                  <div className="display text-[clamp(24px,3vw,40px)] group-hover:text-acid transition-colors">{c.title}</div>
                  <div className="label text-mute mt-1">{c.role}</div>
                </div>
                <p className="md:col-span-4 mono text-[12px] leading-relaxed text-mute">{c.summary}</p>
                <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-3">
                  <Chip tone="ghost" color={c.accent === "#f2f1ec" ? undefined : c.accent}>
                    {c.metric} · {c.metricLabel}
                  </Chip>
                  <ArrowUpRight className="h-5 w-5" />
                </div>
              </WipeLink>
            ))}
          </Stagger>
        </section>

        <section className="px-5 py-12 md:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <SectionHead index="03" kicker="On the ground" title="Beyond the case studies" />
              <Reveal className="mt-8 flex flex-wrap gap-2">
                {CAPABILITIES.map((c) => (
                  <Chip key={c} tone="ghost">
                    {c}
                  </Chip>
                ))}
              </Reveal>
              <Reveal className="mt-8 max-w-xl mono text-[12px] leading-relaxed text-mute">
                M2 International Sport Administration, Université de Lille. Coaching, event infrastructure work
                and the Navy Reserve shape how I prepare, coordinate and take responsibility.
              </Reveal>
            </div>
            <Reveal className="lg:col-span-5" delay={0.1}>
              <div className="space-y-6 border border-line bg-surface p-5">
                <div>
                  <span className="label text-acid">French Guiana · August 2025</span>
                  <h3 className="display mt-3 text-[22px]">Kourou Beach Festival & Tour de Guyane</h3>
                  <p className="mono mt-3 text-[12px] leading-relaxed text-mute">Built VIP hospitality structures and installed sponsor arches under event deadlines.</p>
                </div>
                <div className="border-t border-line pt-5">
                  <span className="label text-acid">LISSP Calais · 2024–2025</span>
                  <h3 className="display mt-3 text-[22px]">Team travel & tournament logistics</h3>
                  <p className="mono mt-3 text-[12px] leading-relaxed text-mute">Handled team transport and accommodation alongside U15 and U13 coaching responsibilities.</p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
