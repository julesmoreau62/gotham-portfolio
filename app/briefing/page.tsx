import type { Metadata } from "next"
import Image from "next/image"
import { PROFILE } from "@/lib/profile"
import { CONTRACTS, FEATURED_CONTRACTS } from "@/lib/contracts"
import { TopBar } from "@/components/home/top-bar"
import { Footer } from "@/components/home/footer"
import { Btn, Chip, Kv, SectionHead, RegMarks, Barcode, ArrowUpRight } from "@/components/ui/primitives"
import { WipeLink } from "@/components/fx/page-wipe"
import { Reveal, Lines, Stagger } from "@/components/fx/reveal"
import { pad2 } from "@/lib/utils"

export const metadata: Metadata = {
  title: "30-second recruiter briefing",
  description:
    "Short recruiter briefing for Jules Moreau: event management, event logistics, sponsor activation, digital communication and competitive intelligence.",
}

const FOCUS = [
  "Event management",
  "Sport communication and sponsor activation",
  "AI-augmented digital products and intelligence workflows",
]

const CAPABILITIES = [
  "Event logistics",
  "Crisis management",
  "Sponsor activation",
  "Sport governance",
  "Content strategy",
  "Photography and visual production",
  "AI-assisted web delivery",
  "Competitive intelligence",
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
                  30-second recruiter briefing
                </Chip>
                <span className="label text-mute">Read time · 00:30</span>
              </Reveal>
              <Lines as="h1" play className="display-black mt-6 text-[clamp(48px,9vw,140px)]" lines={["Jules", "Moreau"]} />
              <Reveal className="mt-6 max-w-2xl display text-[clamp(18px,2.2vw,28px)]">
                Seeking an <span className="text-acid">{PROFILE.seeking.toLowerCase()}</span>, {PROFILE.window}.
              </Reveal>
              <Reveal delay={0.05} className="mt-4 max-w-2xl mono text-[13px] leading-relaxed text-mute">
                M2 International Sport Administration student (Université de Lille) focused on event management,
                event logistics, sponsor activation and AI-augmented digital systems. Former French Navy Reserve NCO.
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
                  Full experience
                </Btn>
              </Reveal>
            </div>
            <Reveal className="lg:col-span-4" delay={0.15}>
              <div className="border border-line bg-surface p-5">
                <Kv k="Status" v="Seeking internship" accent="#c8ff00" />
                <Kv k="Window" v={PROFILE.window} />
                <Kv k="Location" v={PROFILE.location} />
                <Kv k="Areas" v="FR · BE · EU" />
                <Kv k="Languages" v="FR native · EN C1" />
                <Kv k="Clearance" v="NATO Secret" />
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
          <SectionHead index="01" kicker="Focus" title="Three areas" />
          <Stagger className="mt-8 grid grid-cols-1 gap-px bg-line md:grid-cols-3" stagger={0.08}>
            {FOCUS.map((f, i) => (
              <div key={f} className="bg-bg p-5">
                <span className="label text-acid">0{i + 1}</span>
                <p className="display mt-3 text-[20px] leading-tight">{f}</p>
              </div>
            ))}
          </Stagger>
        </section>

        <section className="px-5 py-12 md:px-8">
          <SectionHead index="02" kicker="Best evidence" title="Three case files" right={<span>Full index on the home page</span>} />
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
              <SectionHead index="03" kicker="Capability stack" title="What I bring" />
              <Reveal className="mt-8 flex flex-wrap gap-2">
                {CAPABILITIES.map((c) => (
                  <Chip key={c} tone="ghost">
                    {c}
                  </Chip>
                ))}
              </Reveal>
              <Reveal className="mt-8 max-w-xl mono text-[12px] leading-relaxed text-mute">
                Fast read: hybrid profile combining sport management training, military reserve discipline, field
                operations, photography, digital communication and practical AI tooling.
              </Reveal>
            </div>
            <Reveal className="lg:col-span-5" delay={0.1}>
              <WipeLink href="/contracts/daring" className="group block border border-line bg-surface" data-cursor="open">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={CONTRACTS[0].cover} alt="Royal Daring HC case study" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover grayscale contrast-125 transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 mix-blend-multiply opacity-50" style={{ background: CONTRACTS[0].accent }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="label" style={{ color: CONTRACTS[0].accent2 }}>
                      Featured case
                    </div>
                    <div className="display mt-1 text-[28px]">Royal Daring HC</div>
                  </div>
                </div>
                <div className="p-4 mono text-[12px] leading-relaxed text-mute">
                  The strongest proof of combined sport communication, sponsor strategy, visual identity and digital
                  delivery.
                </div>
              </WipeLink>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
