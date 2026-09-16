"use client"

import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { CONTRACTS, siblingContracts, type Contract } from "@/lib/contracts"
import { pad2 } from "@/lib/utils"
import { navigateWithWipe, WipeLink } from "@/components/fx/page-wipe"
import { Lines } from "@/components/fx/reveal"
import { Chip, Kv, Btn, Arrow, RegMarks, Barcode } from "@/components/ui/primitives"
import { Clock } from "@/components/home/top-bar"
import { ContractEntrance } from "@/components/contracts/contract-entrance"
import { hasContractEntrance } from "@/lib/contract-entrances"

const EASE = [0.2, 1, 0.3, 1] as const

export function ContractShell({ contract: c, children }: { contract: Contract; children: React.ReactNode }) {
  const hasEntrance = hasContractEntrance(c.slug)
  const [entryStage, setEntryStage] = useState<"intro" | "reveal" | "ready">(hasEntrance ? "intro" : "ready")
  const entered = entryStage !== "intro"
  const ready = entryStage === "ready"
  const reveal = useCallback(() => setEntryStage("reveal"), [])
  const complete = useCallback(() => setEntryStage("ready"), [])
  const { prev, next } = siblingContracts(c.slug)
  const light = c.accent === "#f2f1ec"
  const longestWord = Math.max(...c.title.split(" ").map((w) => w.length))
  const titleSize = longestWord >= 9 ? "text-[clamp(40px,6.3vw,110px)]" : "text-[clamp(48px,7.6vw,132px)]"

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!ready) return
      if (e.key === "Escape") navigateWithWipe("/#contracts")
      if (e.key === "ArrowRight") navigateWithWipe(`/contracts/${next.slug}`)
      if (e.key === "ArrowLeft") navigateWithWipe(`/contracts/${prev.slug}`)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [ready, next.slug, prev.slug])

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 12 },
    animate: entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 },
    transition: { duration: 0.7, ease: EASE, delay },
  })

  return (
    <>
    {hasEntrance && <ContractEntrance slug={c.slug} onReveal={reveal} onComplete={complete} />}
    <div inert={!ready} className="min-h-screen bg-bg text-ink" style={{ ["--accent" as string]: c.accent }}>
      {/* Top bar */}
      <header className="fixed inset-x-0 top-0 z-[120] h-14 border-b border-line bg-bg/85 backdrop-blur-md">
        <div className="flex h-full items-center justify-between px-4 md:px-8">
          <WipeLink href="/#contracts" className="group flex min-h-11 min-w-11 items-center gap-3 label text-ink" aria-label="Back to contract index" data-cursor="back">
            <span className="grid h-7 w-7 place-items-center bg-ink text-black mono text-[10px] font-bold group-hover:bg-acid transition-colors">
              ←
            </span>
            <span className="hidden sm:inline">Index</span>
          </WipeLink>

          <div className="flex items-center gap-3 label">
            <span className="text-mute hidden sm:inline">Contract</span>
            <span className="tnum text-ink">
              {pad2(c.index)}/{pad2(CONTRACTS.length)}
            </span>
            <span className="h-3 w-px bg-line" />
            <span style={{ color: c.accent }}>{c.code}</span>
            <span className="hidden md:inline text-mute">— {c.title}</span>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <span className="hidden lg:inline-flex">
              <Clock />
            </span>
            <WipeLink href={`/contracts/${prev.slug}`} className="grid h-8 w-8 place-items-center border border-line hover:border-ink transition-colors" aria-label={`Previous: ${prev.title}`} data-cursor="prev">
              <Arrow className="h-3.5 w-3.5 rotate-180" />
            </WipeLink>
            <WipeLink href={`/contracts/${next.slug}`} className="grid h-8 w-8 place-items-center border border-line hover:border-ink transition-colors" aria-label={`Next: ${next.title}`} data-cursor="next">
              <Arrow className="h-3.5 w-3.5" />
            </WipeLink>
            <span className="hidden md:inline label text-mute ml-2">ESC · close</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-[92svh] overflow-hidden pt-14">
        <RegMarks className="z-20" />
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.08, opacity: 0 }}
          animate={entered ? { scale: 1, opacity: 1 } : { scale: 1.08, opacity: 0 }}
          transition={{ duration: 1.4, ease: EASE }}
        >
          <Image
            src={c.cover}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover grayscale contrast-125"
            style={{ objectPosition: c.coverPosition ?? "center" }}
          />
          <div className="absolute inset-0 mix-blend-multiply" style={{ background: c.accent, opacity: light ? 0.12 : 0.45 }} />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg/70 via-transparent to-transparent" />
          <div className="halftone absolute inset-0 opacity-25 mix-blend-overlay" />
        </motion.div>

        <div className="relative z-10 flex min-h-[calc(92svh-3.5rem)] flex-col justify-end px-5 pb-10 md:px-8 md:pb-14">
          <motion.div {...fade(0.2)} className="mb-6 flex flex-wrap items-center gap-3">
            <Chip tone="solid" color={c.accent} dot className="text-black">
              {c.status}
            </Chip>
            <span className="label text-ink/80">{c.org}</span>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <Lines
                as="h1"
                play={entered}
                delay={0.3}
                lines={c.title.split(" ").length > 2 ? [c.title] : c.title.split(" ")}
                className={`display-black ${titleSize}`}
              />
              <motion.p {...fade(0.8)} className="mt-5 display text-[clamp(16px,2vw,26px)]" style={{ color: c.accent }}>
                {c.role}
              </motion.p>
              <motion.p {...fade(0.9)} className="mt-4 max-w-2xl mono text-[13px] leading-relaxed text-ink/80">
                {c.summary}
              </motion.p>
            </div>

            <motion.aside {...fade(1.0)} className="lg:col-span-4">
              <div className="border border-ink/25 bg-bg/70 p-5 backdrop-blur-md">
                <div className="flex items-end justify-between gap-4 border-b border-line pb-4">
                  <div>
                    <div className="display tnum text-[clamp(40px,5vw,72px)] leading-none" style={{ color: c.accent }}>
                      {c.metric}
                    </div>
                    <div className="label text-mute mt-2">{c.metricLabel}</div>
                  </div>
                  <Barcode seed={c.slug} className="w-20 text-ink/80" height={34} />
                </div>
                <div className="mt-2">
                  <Kv k="Period" v={c.period} />
                  <Kv k="Location" v={c.location} />
                  <Kv k="Role" v={c.role} />
                  {c.stack && <Kv k="Stack" v={c.stack.slice(0, 4).join(" · ")} />}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {c.tags.map((t) => (
                    <span key={t} className="label border border-line px-2 py-1 text-ink/70">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.aside>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 h-1.5 hazard opacity-80" aria-hidden="true" />
      </section>

      <main>{children}</main>

      {/* Footer nav */}
      <footer className="border-t border-line">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <WipeLink
            href={`/contracts/${prev.slug}`}
            className="group flex items-center justify-between gap-4 border-b border-line p-6 md:border-b-0 md:border-r md:p-10 hover:bg-surface transition-colors"
            data-cursor="prev"
          >
            <div>
              <div className="label text-mute">← Previous · {pad2(prev.index)}</div>
              <div className="display mt-2 text-[clamp(24px,3vw,44px)] group-hover:text-acid transition-colors">{prev.title}</div>
            </div>
          </WipeLink>
          <WipeLink
            href={`/contracts/${next.slug}`}
            className="group flex items-center justify-between gap-4 p-6 md:p-10 text-right hover:bg-surface transition-colors"
            data-cursor="next"
          >
            <div className="w-full">
              <div className="label text-mute">Next · {pad2(next.index)} →</div>
              <div className="display mt-2 text-[clamp(24px,3vw,44px)] group-hover:text-acid transition-colors">{next.title}</div>
            </div>
          </WipeLink>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line px-5 py-5 md:px-8">
          <Btn href="/#contracts" tone="ghost" wipe>
            All contracts
          </Btn>
          <span className="label text-mute">
            Contract {pad2(c.index)} · {c.code} · Jules Moreau
          </span>
        </div>
      </footer>
    </div>
    </>
  )
}
