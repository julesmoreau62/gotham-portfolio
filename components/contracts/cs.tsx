"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { Reveal, Stagger, Wipe } from "@/components/fx/reveal"
import { Btn, ArrowUpRight } from "@/components/ui/primitives"

/* ------------------------------------------------------------------
   CASE-STUDY PRIMITIVES — all colored through the shell's --accent var
   ------------------------------------------------------------------ */

export function Section({
  n,
  title,
  kicker,
  children,
  id,
  className,
  intro,
}: {
  n: string
  title: string
  kicker?: string
  children: React.ReactNode
  id?: string
  className?: string
  intro?: React.ReactNode
}) {
  return (
    <section id={id} className={cn("px-5 py-16 md:px-8 md:py-24 scroll-mt-16", className)}>
      <Reveal>
        <div className="border-t border-ink/60 pt-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4 flex items-start gap-4">
              <span className="mono text-[11px] tracking-[0.2em] text-[var(--accent)] pt-1">{n}</span>
              <div>
                {kicker && <div className="label text-mute mb-2">{kicker}</div>}
                <h2 className="display text-[clamp(26px,3.6vw,48px)]">{title}</h2>
              </div>
            </div>
            {intro && <div className="lg:col-span-8 mono text-[13px] leading-relaxed text-mute max-w-2xl lg:pt-1">{intro}</div>}
          </div>
        </div>
      </Reveal>
      <div className="mt-10">{children}</div>
    </section>
  )
}

export function Stats({
  items,
  className,
  size = "md",
}: {
  items: { v: React.ReactNode; l: string; color?: string }[]
  className?: string
  size?: "sm" | "md" | "lg"
}) {
  const sizes = { sm: "text-[clamp(22px,2.4vw,32px)]", md: "text-[clamp(28px,3.6vw,52px)]", lg: "text-[clamp(36px,5vw,80px)]" }
  return (
    <Stagger className={cn("grid grid-cols-2 gap-px bg-line border border-line md:grid-cols-4", className)} stagger={0.05}>
      {items.map((s) => (
        <div key={s.l} className="bg-bg px-4 py-5">
          <div className={cn("display tnum", sizes[size])} style={{ color: s.color ?? "var(--accent)" }}>
            {s.v}
          </div>
          <div className="label text-mute mt-2">{s.l}</div>
        </div>
      ))}
    </Stagger>
  )
}

export function Card({
  title,
  kicker,
  n,
  children,
  className,
  tone = "line",
}: {
  title?: string
  kicker?: string
  n?: string
  children?: React.ReactNode
  className?: string
  tone?: "line" | "accent" | "fill" | "surface"
}) {
  const tones = {
    line: "border border-line bg-bg",
    accent: "border border-[var(--accent)] bg-bg",
    fill: "bg-[var(--accent)] text-black",
    surface: "border border-line bg-surface",
  }
  return (
    <div className={cn("relative p-5 md:p-6", tones[tone], className)}>
      {(n || kicker) && (
        <div className="mb-3 flex items-center justify-between gap-3">
          {kicker && <span className={cn("label", tone === "fill" ? "text-black/70" : "text-[var(--accent)]")}>{kicker}</span>}
          {n && <span className={cn("mono text-[10px] tracking-[0.2em]", tone === "fill" ? "text-black/60" : "text-mute")}>{n}</span>}
        </div>
      )}
      {title && <h3 className="display text-[clamp(18px,1.8vw,24px)] leading-tight">{title}</h3>}
      {children && <div className={cn("mono text-[12px] leading-relaxed", tone === "fill" ? "text-black/80" : "text-mute", title && "mt-3")}>{children}</div>}
    </div>
  )
}

export function Figure({
  src,
  alt,
  ratio = "16/10",
  caption,
  fit = "cover",
  className,
  position,
  label,
  priority,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  duotone = false,
}: {
  src: string
  alt: string
  ratio?: string
  caption?: string
  fit?: "cover" | "contain"
  className?: string
  position?: string
  label?: string
  priority?: boolean
  sizes?: string
  duotone?: boolean
}) {
  return (
    <Wipe className={cn("group", className)}>
      <figure>
        <div className={cn("relative overflow-hidden border border-line bg-black", duotone && "duotone-wrap")} style={{ aspectRatio: ratio }}>
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className={cn(
              "transition-transform duration-700 group-hover:scale-[1.03]",
              fit === "cover" ? "object-cover" : "object-contain p-2",
              duotone && "duotone"
            )}
            style={position ? { objectPosition: position } : undefined}
          />
          {label && <span className="absolute left-3 top-3 z-10 label bg-black/70 px-2 py-1 text-ink">{label}</span>}
          <span className="pointer-events-none absolute right-3 top-3 z-10 h-3 w-3 border-r border-t border-ink/60" />
          <span className="pointer-events-none absolute bottom-3 left-3 z-10 h-3 w-3 border-b border-l border-ink/60" />
        </div>
        {caption && <figcaption className="mono mt-2 text-[11px] leading-relaxed text-mute">{caption}</figcaption>}
      </figure>
    </Wipe>
  )
}

export function Gallery({
  items,
  cols = 3,
  className,
}: {
  items: { src: string; alt: string; caption?: string; ratio?: string; fit?: "cover" | "contain"; label?: string; position?: string; span?: number }[]
  cols?: 2 | 3 | 4
  className?: string
}) {
  const colCls = { 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "md:grid-cols-4" }[cols]
  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2", colCls, className)}>
      {items.map((it, i) => (
        <Figure
          key={it.src + i}
          src={it.src}
          alt={it.alt}
          caption={it.caption}
          ratio={it.ratio ?? "4/5"}
          fit={it.fit}
          label={it.label}
          position={it.position}
          className={it.span ? `md:col-span-${it.span}` : undefined}
          sizes="(min-width: 768px) 33vw, 100vw"
        />
      ))}
    </div>
  )
}

export function Quote({ children, by, className }: { children: React.ReactNode; by?: string; className?: string }) {
  return (
    <Reveal className={cn("relative border-l-2 border-[var(--accent)] pl-6 py-2", className)}>
      <p className="display text-[clamp(20px,2.6vw,36px)] leading-tight">{children}</p>
      {by && <div className="label text-mute mt-4">{by}</div>}
    </Reveal>
  )
}

export function Bullets({ items, cols = 1, className, check }: { items: React.ReactNode[]; cols?: 1 | 2 | 3; className?: string; check?: boolean }) {
  const colCls = { 1: "", 2: "md:grid-cols-2", 3: "md:grid-cols-3" }[cols]
  return (
    <ul className={cn("grid grid-cols-1 gap-x-8 gap-y-2", colCls, className)}>
      {items.map((it, i) => (
        <li key={i} className="flex items-start gap-3 border-t border-line pt-2 mono text-[12px] leading-relaxed text-ink/80">
          <span className="mt-[7px] h-1.5 w-1.5 shrink-0" style={{ background: check ? "var(--accent)" : "rgba(242,241,236,0.4)" }} />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  )
}

export function Chips({ items, className, fill }: { items: string[]; className?: string; fill?: boolean }) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {items.map((it) => (
        <span
          key={it}
          className={cn(
            "label rounded-full px-3 py-1.5",
            fill ? "bg-[var(--accent)] text-black" : "border border-line text-ink/80"
          )}
        >
          {it}
        </span>
      ))}
    </div>
  )
}

export function Timeline({ items, className }: { items: { t: string; title: string; body?: React.ReactNode; tag?: string }[]; className?: string }) {
  return (
    <Stagger className={cn("relative", className)} stagger={0.08}>
      {items.map((it, i) => (
        <div key={i} className="grid grid-cols-1 gap-2 border-t border-line py-5 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-3 flex items-center gap-3">
            <span className="h-2 w-2" style={{ background: "var(--accent)" }} />
            <span className="mono tnum text-[12px] tracking-[0.12em] text-[var(--accent)]">{it.t}</span>
          </div>
          <div className="md:col-span-9">
            <div className="flex flex-wrap items-center gap-3">
              <h4 className="display text-[18px]">{it.title}</h4>
              {it.tag && <span className="label border border-line px-2 py-1 text-mute">{it.tag}</span>}
            </div>
            {it.body && <div className="mono mt-2 text-[12px] leading-relaxed text-mute max-w-2xl">{it.body}</div>}
          </div>
        </div>
      ))}
    </Stagger>
  )
}

export function Links({ links, className }: { links: { label: string; href: string; download?: boolean; internal?: boolean }[]; className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {links.map((l, i) => (
        <Btn key={l.href} href={l.href} download={l.download} external={!l.download && !l.internal} tone={i === 0 ? "ink" : "ghost"} wipe={l.internal}>
          {l.label} {!l.download && <ArrowUpRight className="h-3.5 w-3.5" />}
        </Btn>
      ))}
    </div>
  )
}

export function Prose({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mono text-[13px] leading-relaxed text-ink/80 max-w-2xl space-y-4", className)}>{children}</div>
}

export function Note({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("border-l-2 border-[var(--accent)] bg-surface px-4 py-3 mono text-[11px] leading-relaxed text-mute italic", className)}>
      {children}
    </div>
  )
}

export function Bar({ label, value, max = 100, color, right }: { label: string; value: number; max?: number; color?: string; right?: string }) {
  return (
    <Reveal>
      <div className="flex items-center justify-between label text-mute mb-2">
        <span>{label}</span>
        <span className="text-ink">{right ?? `${value}%`}</span>
      </div>
      <div className="h-1.5 w-full bg-ink/10">
        <div className="h-full" style={{ width: `${(value / max) * 100}%`, background: color ?? "var(--accent)" }} />
      </div>
    </Reveal>
  )
}

export function Kv({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t border-line py-2">
      <span className="label text-mute shrink-0">{k}</span>
      <span className="mono text-[11px] text-right text-ink/85">{v}</span>
    </div>
  )
}
