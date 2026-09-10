"use client"

import { motion } from "framer-motion"
import { PROFILE, SITE, TICKER } from "@/lib/profile"
import { useBooted } from "@/components/home/boot"
import { Lines } from "@/components/fx/reveal"
import { Scramble } from "@/components/fx/scramble"
import { Marquee } from "@/components/fx/marquee"
import { Artifact } from "@/components/fx/artifact"
import { Btn, Chip, RegMarks, Barcode, ArrowUpRight } from "@/components/ui/primitives"

const EASE = [0.2, 1, 0.3, 1] as const

export function Hero() {
  const booted = useBooted()
  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 14 },
    animate: booted ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
    transition: { duration: 0.8, ease: EASE, delay },
  })

  return (
    <section id="hero" className="relative min-h-[100svh] overflow-hidden pt-14">
      <RegMarks className="z-20" />

      {/* 3D artifact — right side, behind the type */}
      <Artifact className="pointer-events-none absolute right-[-12%] top-20 z-0 w-[78%] opacity-70 md:right-[-6%] md:top-14 md:bottom-24 md:w-[62%] md:opacity-100 lg:right-[-2%] lg:w-[56%]" />

      {/* Ambient acid glow */}
      <div
        className="pointer-events-none absolute right-[8%] top-[30%] z-0 h-[520px] w-[520px] rounded-full opacity-[0.18] blur-[120px]"
        style={{ background: "radial-gradient(circle, #c8ff00 0%, transparent 60%)" }}
        aria-hidden="true"
      />

      {/* Vertical meta on the right edge */}
      <motion.div
        {...fade(1.1)}
        className="absolute left-3 top-24 z-20 hidden lg:flex flex-col items-center gap-4"
        aria-hidden="true"
      >
        <span className="label text-mute [writing-mode:vertical-rl] rotate-180">
          Operator file — JM / {SITE.year} — {SITE.version}
        </span>
        <span className="h-16 w-px bg-line" />
        <span className="label text-acid [writing-mode:vertical-rl] rotate-180">Lille // FR</span>
      </motion.div>

      <div className="relative z-10 flex min-h-[calc(100svh-3.5rem)] flex-col justify-between px-5 md:px-8">
        {/* Top telemetry row */}
        <motion.div {...fade(0.15)} className="flex flex-wrap items-center justify-between gap-3 pt-6 label text-mute">
          <span className="flex items-center gap-3">
            <span className="text-acid">
              <Scramble text="RUNNER PROFILE" play={booted} delay={200} />
            </span>
            <span className="hidden sm:inline">{"// "}{SITE.year}</span>
          </span>
          <span className="hidden md:inline">{PROFILE.coords}</span>
          <span className="hidden sm:inline">
            <Scramble text="SECURE CHANNEL" play={booted} delay={400} />
          </span>
        </motion.div>

        {/* Headline block */}
        <div className="flex flex-1 flex-col justify-center py-10 md:py-8">
          <motion.div {...fade(0.35)} className="mb-5 flex flex-wrap items-center gap-3">
            <Chip tone="acid" dot>
              Seeking internship · {PROFILE.windowShort}
            </Chip>
            <span className="label text-mute">{PROFILE.degree}</span>
          </motion.div>

          <Lines
            as="h1"
            play={booted}
            delay={0.45}
            lines={[
              <span key="j">{PROFILE.firstName}</span>,
              <span key="m" className="inline-flex items-baseline">
                {PROFILE.lastName}
                <span className="ml-[0.08em] inline-block h-[0.12em] w-[0.12em] bg-acid translate-y-[-0.05em]" aria-hidden="true" />
              </span>,
            ]}
            className="display-black text-[clamp(54px,14.5vw,220px)] text-ink"
          />

          <motion.p {...fade(0.9)} className="mt-6 max-w-2xl display text-[clamp(18px,2.4vw,30px)] text-ink/90">
            <span className="text-acid">{PROFILE.role}</span>
          </motion.p>

          <motion.div {...fade(1.0)} className="mt-6 flex">
            <Btn
              href="/briefing"
              tone="acid"
              size="lg"
              wipe
              className="h-16 w-full px-6 text-[14px] tracking-[0.12em] shadow-[0_0_32px_rgba(200,255,0,0.18)] sm:w-auto sm:min-w-[320px]"
            >
              30-sec briefing <ArrowUpRight className="ml-3 h-5 w-5" />
            </Btn>
          </motion.div>

          <motion.p {...fade(1.1)} className="mt-6 max-w-xl mono text-[13px] leading-relaxed text-mute">
            {PROFILE.focus} Former French Navy Reserve NCO. Builds production-grade tools and client websites with
            an AI-augmented workflow.
          </motion.p>

          <motion.div {...fade(1.2)} className="mt-6 flex flex-wrap items-center gap-3">
            <Btn href="/#contracts" tone="ghost" wipe cursor="open">
              Featured contracts <ArrowUpRight className="h-3.5 w-3.5" />
            </Btn>
            <Btn href={PROFILE.cv} download tone="ghost">
              Download CV
            </Btn>
            <Btn href={`mailto:${PROFILE.email}`} tone="line">
              Email
            </Btn>
            <Btn href={PROFILE.linkedin} external tone="line">
              LinkedIn
            </Btn>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div {...fade(1.3)} className="flex items-end justify-between gap-6 pb-6">
          <div className="flex flex-col gap-2">
            <span className="label text-mute">Available</span>
            <span className="display text-[clamp(20px,2.6vw,34px)] text-acid tnum">{PROFILE.windowShort}</span>
          </div>
          <div className="hidden sm:flex flex-col items-end gap-2">
            <Barcode seed="JULES-MOREAU-2026" className="w-40 text-ink/80" height={26} />
            <span className="label text-mute">ID · JM-2026-EVENT</span>
          </div>
        </motion.div>
      </div>

      {/* Ticker */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: booted ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        className="relative z-10 border-y border-line bg-bg/70 backdrop-blur-sm"
      >
        <Marquee
          items={TICKER}
          className="py-3 display text-[13px] tracking-[0.06em] text-ink/85"
          speed="34s"
        />
      </motion.div>
    </section>
  )
}
