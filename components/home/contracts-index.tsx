"use client"

import Image from "next/image"
import { useRef, useState } from "react"
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion"
import { CONTRACTS, FEATURED_CONTRACTS, OTHER_CONTRACTS, type Contract } from "@/lib/contracts"
import { pad2, cn } from "@/lib/utils"
import { WipeLink } from "@/components/fx/page-wipe"
import { Reveal, Stagger } from "@/components/fx/reveal"
import { SectionHead, Arrow } from "@/components/ui/primitives"

export function ContractsIndex() {
  const [hover, setHover] = useState<Contract | null>(null)
  const wrap = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 260, damping: 28, mass: 0.5 })
  const sy = useSpring(my, { stiffness: 260, damping: 28, mass: 0.5 })

  const onMove = (e: React.MouseEvent) => {
    const r = wrap.current?.getBoundingClientRect()
    if (!r) return
    mx.set(e.clientX - r.left)
    my.set(e.clientY - r.top)
  }

  return (
    <section id="contracts" className="relative px-5 py-20 md:px-8 md:py-28 scroll-mt-14">
      <SectionHead
        index={2}
        kicker="Case files"
        title="Contracts"
        right={
          <span>
            {pad2(CONTRACTS.length)} files · {pad2(FEATURED_CONTRACTS.length)} featured
          </span>
        }
      />

      <Reveal className="mt-6 max-w-2xl mono text-[14px] leading-relaxed text-mute">
        Sport communication, sponsor activation and AI intelligence. Three featured projects, with the results
        and assets behind each one.
      </Reveal>

      <div className="mt-10">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h3 className="display text-[20px] text-acid">Featured contracts</h3>
          <span className="mono text-[12px] tracking-[0.12em] text-mute">{pad2(FEATURED_CONTRACTS.length)} / {pad2(CONTRACTS.length)}</span>
        </div>
        <Stagger className="grid grid-cols-1 gap-5 lg:grid-cols-3" stagger={0.1} amount={0.08}>
          {FEATURED_CONTRACTS.map((c) => (
            <FeaturedCard key={c.slug} c={c} />
          ))}
        </Stagger>
      </div>

      <div ref={wrap} onMouseMove={onMove} onMouseLeave={() => setHover(null)} className="relative mt-14">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h3 className="display text-[18px] text-mute">More contracts</h3>
          <span className="mono text-[12px] tracking-[0.12em] text-mute">{pad2(OTHER_CONTRACTS.length)} files</span>
        </div>
        {/* Column headers */}
        <div className="hidden md:grid grid-cols-12 gap-4 border-b border-ink/60 pb-3 label text-mute">
          <span className="col-span-1">No.</span>
          <span className="col-span-4">Contract</span>
          <span className="col-span-3">Role</span>
          <span className="col-span-2">Key metric</span>
          <span className="col-span-2 text-right">Status</span>
        </div>

        <Stagger stagger={0.06} amount={0.1}>
          {OTHER_CONTRACTS.map((c) => (
            <Row key={c.slug} c={c} onHover={setHover} active={hover?.slug === c.slug} />
          ))}
        </Stagger>

        {/* Floating preview (desktop) */}
        <motion.div
          className="pointer-events-none absolute left-0 top-0 z-30 hidden lg:block"
          style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
          aria-hidden="true"
        >
          <AnimatePresence>
            {hover && (
              <motion.div
                key={hover.slug}
                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.94, rotate: 2 }}
                transition={{ duration: 0.35, ease: [0.2, 1, 0.3, 1] }}
                className="relative h-[220px] w-[330px] overflow-hidden border border-ink/30 bg-black shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
              >
                <Image
                  src={hover.cover}
                  alt=""
                  fill
                  sizes="330px"
                  className="object-cover"
                  style={{ objectPosition: hover.coverPosition ?? "center" }}
                />
                <div className="absolute inset-0 mix-blend-multiply opacity-40" style={{ background: hover.accent }} />
                <div className="absolute left-3 top-3 label text-black bg-ink px-2 py-1">{hover.code}</div>
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <span className="display text-[20px] text-ink">{hover.title}</span>
                  <span className="label text-ink/80">{pad2(hover.index)}/{pad2(CONTRACTS.length)}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

function FeaturedCard({ c }: { c: Contract }) {
  return (
    <WipeLink
      href={`/contracts/${c.slug}`}
      data-cursor="open"
      aria-labelledby={`featured-${c.slug}`}
      className="group relative flex h-full min-w-0 flex-col border border-line bg-surface transition-colors duration-300 hover:border-[var(--accent)] focus-visible:border-[var(--accent)]"
      style={{ ["--accent" as string]: c.accent }}
    >
      <div className="relative aspect-[16/10] overflow-hidden border-t-[3px] border-[var(--accent)]">
        <Image
          src={c.cover}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover grayscale-[35%] transition-[transform,filter] duration-700 group-hover:scale-105 group-hover:grayscale-0 group-focus-visible:scale-105 group-focus-visible:grayscale-0 motion-reduce:transform-none motion-reduce:transition-none"
          style={{ objectPosition: c.coverPosition ?? "center" }}
        />
        <div className="absolute inset-0 bg-[var(--accent)] opacity-25 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-black/30" />
        <div className="absolute inset-x-4 top-4 flex flex-wrap items-start justify-between gap-2 mono text-[12px] uppercase tracking-[0.1em]">
          <span className="bg-bg/85 px-2.5 py-1.5 text-ink">{pad2(c.index)} / {c.code}</span>
          <span className="bg-bg/85 px-2.5 py-1.5 text-[var(--accent)]">Featured</span>
        </div>
        <div className="absolute bottom-4 left-5 right-5 mono text-[12px] uppercase tracking-[0.1em] text-ink/80">
          {c.status}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 pt-3 xl:p-6 xl:pt-3">
        <h4 id={`featured-${c.slug}`} className="display text-[clamp(30px,3.2vw,46px)] leading-[0.98]">
          {c.title}
        </h4>
        <p className="mono mt-3 text-[14px] leading-relaxed text-[var(--accent)]">{c.role}</p>
        <p className="mt-4 mb-7 text-[16px] leading-relaxed text-ink/70">{c.featured?.summary}</p>

        <div className="mt-auto border-t border-line pt-5">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="display tnum text-[clamp(36px,4vw,56px)] text-[var(--accent)]">{c.metric}</span>
            <span className="mono text-[12px] uppercase tracking-[0.08em] text-ink/70">{c.metricLabel}</span>
          </div>
          <div className="mt-6 flex items-center justify-between gap-4 mono text-[12px] uppercase tracking-[0.12em]">
            <span>Open case file</span>
            <Arrow className="h-5 w-5 text-[var(--accent)] transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transform-none" />
          </div>
        </div>
      </div>
    </WipeLink>
  )
}

function Row({ c, onHover, active }: { c: Contract; onHover: (c: Contract | null) => void; active: boolean }) {
  const light = c.accent === "#f2f1ec"
  return (
    <WipeLink
      href={`/contracts/${c.slug}`}
      data-cursor="open"
      onMouseEnter={() => onHover(c)}
      onFocus={() => onHover(c)}
      className={cn(
        "group relative grid grid-cols-1 gap-2 border-b border-line py-5 transition-colors duration-200 md:grid-cols-12 md:items-center md:gap-4 md:py-6",
        active ? "text-black" : "text-ink"
      )}
      style={{ ["--accent" as string]: c.accent, background: active ? c.accent : "transparent" }}
    >
      <span className="mono text-[11px] tracking-[0.2em] md:col-span-1 flex items-center gap-2">
        {pad2(c.index)}
        <span className={cn("h-1.5 w-1.5", active ? "bg-black" : "")} style={!active ? { background: c.accent } : undefined} />
      </span>

      <span className="md:col-span-4 flex items-center gap-3">
        <span
          className="glitch display text-[clamp(24px,2.6vw,34px)] leading-none"
          data-text={c.title}
        >
          {c.title}
        </span>
      </span>

      <span className={cn("md:col-span-3 mono text-[11px] uppercase tracking-[0.12em]", active ? "text-black/80" : "text-mute")}>
        {c.role}
        <span className="block normal-case tracking-normal text-[11px] opacity-70">{c.org}</span>
      </span>

      <span className="md:col-span-2 flex items-baseline gap-2">
        <span className="display tnum text-[clamp(22px,2.6vw,34px)]">{c.metric}</span>
        <span className={cn("label", active ? "text-black/70" : "text-mute")}>{c.metricLabel}</span>
      </span>

      <span className="md:col-span-2 flex items-center justify-between md:justify-end gap-3">
        <span className={cn("label", active ? "text-black" : light ? "text-ink" : "")} style={!active && !light ? { color: c.accent } : undefined}>
          {c.status}
        </span>
        <Arrow className={cn("h-5 w-5 transition-transform duration-300 group-hover:translate-x-1", active ? "text-black" : "text-ink")} />
      </span>
    </WipeLink>
  )
}
