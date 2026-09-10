"use client"

import { PROFILE } from "@/lib/profile"
import { Reveal, Lines } from "@/components/fx/reveal"
import { SectionHead, Btn, Barcode, RegMarks, Kv, ArrowUpRight } from "@/components/ui/primitives"

export function Extraction() {
  return (
    <section id="extraction" className="relative px-5 py-20 md:px-8 md:py-28 scroll-mt-14">
      <SectionHead index={5} kicker="Extraction point" title="Contact" right={<span>Response within 24h · FR / EN</span>} />

      <div className="relative mt-12 overflow-hidden border border-line bg-surface">
        <RegMarks />
        <div className="grid-fine absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="relative grid grid-cols-1 gap-10 p-6 md:p-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Lines
              as="h3"
              className="display-black text-[clamp(40px,6.6vw,110px)] leading-[0.85]"
              lines={[
                <span key="a" className="outline-text">Available</span>,
                <span key="b" className="text-acid">{PROFILE.windowShort}</span>,
              ]}
            />
            <Reveal className="mt-8 max-w-xl mono text-[13px] leading-relaxed text-mute">
              Final ISA Master internship. Looking for an event management team in France,
              Belgium or elsewhere in Europe. Event logistics, sponsor activation, digital communication, intelligence.
            </Reveal>
            <Reveal delay={0.1} className="mt-8">
              <a
                href={`mailto:${PROFILE.email}`}
                className="glitch display text-[clamp(16px,2.3vw,32px)] break-all lg:break-normal lg:whitespace-nowrap text-ink hover:text-acid transition-colors"
                data-text={PROFILE.email}
                data-cursor="mail"
              >
                {PROFILE.email}
              </a>
            </Reveal>
            <Reveal delay={0.15} className="mt-8 flex flex-wrap gap-3">
              <Btn href={`mailto:${PROFILE.email}`} tone="acid" size="lg">
                Send a message <ArrowUpRight className="h-3.5 w-3.5" />
              </Btn>
              <Btn href={PROFILE.linkedin} external tone="ghost" size="lg">
                LinkedIn
              </Btn>
              <Btn href={PROFILE.cv} download tone="ghost" size="lg">
                CV · PDF
              </Btn>
              <Btn href="/briefing" tone="line" size="lg" wipe>
                Recruiter briefing
              </Btn>
            </Reveal>
          </div>

          <Reveal className="lg:col-span-4" delay={0.2}>
            <div className="border border-line bg-bg p-5">
              <Kv k="Location" v={PROFILE.location} />
              <Kv k="Coordinates" v={PROFILE.coords} />
              <Kv k="Window" v={PROFILE.window} />
              <Kv k="Areas" v="FR · BE · EU" />
              <Kv k="Languages" v="FR native · EN C1" />
              <Kv k="Format" v="On-site · hybrid" />
              <div className="mt-6 flex items-end justify-between gap-4 border-t border-line pt-4">
                <Barcode seed="EXTRACTION-2027" className="w-32 text-ink" height={30} />
                <span className="label text-mute text-right">
                  EXTRACT
                  <br />
                  JM / 2027
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
