"use client"

import Image from "next/image"
import { PROFILE } from "@/lib/profile"
import { Reveal, Lines, Wipe, Stagger } from "@/components/fx/reveal"
import { Counter } from "@/components/fx/counter"
import { SectionHead, Kv, Barcode, Chip } from "@/components/ui/primitives"

const STRIP = [
  { v: 500, suffix: "+", label: "Personnel · ASI tournament" },
  { v: 467, prefix: "+", suffix: "%", label: "Sponsor CTR · ASN95" },
  { v: 1650, suffix: "+", label: "Edited photos · one season" },
  { v: 23, suffix: "p", label: "BLAST strategic dossier" },
]

export function Operator() {
  return (
    <section id="operator" className="relative px-5 py-20 md:px-8 md:py-28 scroll-mt-14">
      <SectionHead index={1} kicker="Operator file" title="Who is on the line" right={<span>Clearance · NATO Secret</span>} />

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
        {/* Portrait */}
        <div className="lg:col-span-4">
          <Wipe from="left" className="frame">
            <div className="duotone-wrap relative aspect-[3/4] overflow-hidden [container-type:inline-size]" style={{ ["--accent" as string]: "#c8ff00" }}>
              <Image
                src={PROFILE.photo}
                alt="Jules Moreau with a confidential band covering his eyes"
                fill
                priority={false}
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="duotone object-cover object-top"
              />
              <div className="halftone absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none" />
              <div
                className="pointer-events-none absolute left-[25%] top-[42.5%] z-10 flex h-[8%] w-[48%] items-center justify-center border-y border-acid/70 bg-black text-acid"
                aria-hidden="true"
              >
                <span className="mono text-[clamp(9px,3.5cqw,22px)] font-bold uppercase leading-none tracking-[0.14em]">
                  Confidential
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-4 pt-16">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <div className="display text-[22px] leading-none">{PROFILE.firstName} {PROFILE.lastName}</div>
                    <div className="label text-acid mt-2">Second Maître · Navy reserve</div>
                  </div>
                  <Barcode seed="JM-OPERATOR" className="w-20 text-ink" height={22} />
                </div>
              </div>
              <span className="absolute left-3 top-3 label text-ink/80 bg-black/60 px-2 py-1">IMG_CV_01</span>
              <span className="absolute right-3 top-3 label text-acid bg-black/60 px-2 py-1">hover · decode</span>
            </div>
          </Wipe>

          <div className="mt-6">
            {PROFILE.facts.map((f) => (
              <Kv key={f.k} k={f.k} v={f.v} />
            ))}
          </div>
        </div>

        {/* Bio + differentiators */}
        <div className="lg:col-span-8">
          <Lines
            as="h3"
            className="display text-[clamp(30px,4.6vw,62px)]"
            lines={["Sport-management training,", "military discipline,", <span key="k" className="text-acid">field-tested execution.</span>]}
          />

          <Stagger className="mt-8 grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-3" stagger={0.1}>
            {PROFILE.bio.map((b, i) => (
              <p key={i} className="mono text-[12px] leading-relaxed text-mute border-t border-line pt-3">
                {b}
              </p>
            ))}
          </Stagger>

          <Reveal className="mt-8 flex flex-wrap gap-2" delay={0.1}>
            <Chip tone="ghost">M2 ISA · Université de Lille</Chip>
            <Chip tone="ghost">{PROFILE.location}</Chip>
            {PROFILE.languages.map((l) => (
              <Chip key={l.label} tone="ghost">
                {l.label} · {l.level}
              </Chip>
            ))}
            <Chip tone="ghost">Overwatch 2 Grandmaster</Chip>
          </Reveal>

          <Stagger className="mt-12 grid grid-cols-1 gap-px bg-line md:grid-cols-2" stagger={0.08}>
            {PROFILE.differentiators.map((d) => (
              <article key={d.n} className="group relative h-full bg-bg p-6 transition-colors hover:bg-surface">
                <span className="label text-acid">{d.n}</span>
                <h4 className="display mt-3 text-[22px]">{d.title}</h4>
                <p className="mono mt-3 text-[12px] leading-relaxed text-mute">{d.body}</p>
                <span className="absolute right-4 top-4 h-1.5 w-1.5 bg-ink/20 group-hover:bg-acid transition-colors" />
              </article>
            ))}
          </Stagger>
        </div>
      </div>

      {/* Stat strip */}
      <Reveal className="mt-16 grid grid-cols-2 gap-px border-y border-line bg-line md:grid-cols-4">
        {STRIP.map((s) => (
          <div key={s.label} className="bg-bg px-5 py-6">
            <div className="display tnum text-[clamp(32px,4vw,56px)] text-ink">
              <Counter to={s.v} prefix={s.prefix} suffix={s.suffix} />
            </div>
            <div className="label text-mute mt-2">{s.label}</div>
          </div>
        ))}
      </Reveal>
    </section>
  )
}
