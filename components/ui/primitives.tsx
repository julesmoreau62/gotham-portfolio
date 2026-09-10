import Link from "next/link"
import { cn, pad2, seeded } from "@/lib/utils"
import { WipeLink } from "@/components/fx/page-wipe"

/* ---------------- Labels / chips ---------------- */

export function Label({
  children,
  className,
  dot,
  color,
}: {
  children: React.ReactNode
  className?: string
  dot?: boolean
  color?: string
}) {
  return (
    <span className={cn("label inline-flex items-center gap-2 text-mute", className)} style={color ? { color } : undefined}>
      {dot && <span className="inline-block h-1.5 w-1.5 animate-pulse2" style={{ background: color ?? "var(--acid)" }} />}
      {children}
    </span>
  )
}

export function Chip({
  children,
  tone = "ghost",
  color,
  className,
  dot,
}: {
  children: React.ReactNode
  tone?: "acid" | "ghost" | "ink" | "solid"
  color?: string
  className?: string
  dot?: boolean
}) {
  const base = "inline-flex items-center gap-2 rounded-full px-3 py-1.5 label whitespace-nowrap"
  const tones = {
    acid: "bg-acid text-black",
    ghost: "border border-line text-ink",
    ink: "bg-ink text-black",
    solid: "text-black",
  }
  return (
    <span
      className={cn(base, tones[tone], className)}
      style={tone === "solid" && color ? { background: color } : color && tone === "ghost" ? { color, borderColor: color } : undefined}
    >
      {dot && (
        <span
          className="inline-block h-1.5 w-1.5 rounded-full animate-pulse2"
          style={{ background: tone === "acid" || tone === "solid" || tone === "ink" ? "#000" : color ?? "var(--acid)" }}
        />
      )}
      {children}
    </span>
  )
}

/* ---------------- Buttons ---------------- */

export function Btn({
  href,
  children,
  tone = "ghost",
  className,
  download,
  external,
  wipe,
  onClick,
  cursor,
  size = "md",
}: {
  href?: string
  children: React.ReactNode
  tone?: "acid" | "ghost" | "ink" | "line"
  className?: string
  download?: boolean
  external?: boolean
  wipe?: boolean
  onClick?: () => void
  cursor?: string
  size?: "sm" | "md" | "lg"
}) {
  const base =
    "group/btn relative inline-flex items-center justify-center gap-2 mono uppercase font-semibold tracking-[0.16em] transition-colors duration-200 select-none"
  const sizes = {
    sm: "h-9 px-4 text-[10px]",
    md: "h-11 px-5 text-[11px]",
    lg: "h-14 px-7 text-[12px]",
  }
  const tones = {
    acid: "bg-acid text-black hover:bg-ink",
    ink: "bg-ink text-black hover:bg-acid",
    ghost: "border border-ink/40 text-ink hover:bg-ink hover:text-black hover:border-ink",
    line: "border border-line text-mute hover:text-ink hover:border-ink",
  }
  const cls = cn(base, sizes[size], tones[tone], className)
  const inner = (
    <>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <span
        className="absolute right-1.5 top-1.5 h-1 w-1 bg-current opacity-60"
        aria-hidden="true"
      />
    </>
  )
  if (!href) {
    return (
      <button type="button" onClick={onClick} className={cls} data-cursor={cursor}>
        {inner}
      </button>
    )
  }
  if (external || download || href.startsWith("mailto:") || href.startsWith("http")) {
    return (
      <a
        href={href}
        className={cls}
        download={download}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        data-cursor={cursor}
      >
        {inner}
      </a>
    )
  }
  const L = wipe ? WipeLink : Link
  return (
    <L href={href} className={cls} data-cursor={cursor}>
      {inner}
    </L>
  )
}

/* ---------------- Decor ---------------- */

export function RegMarks({ className, color = "rgba(242,241,236,0.5)" }: { className?: string; color?: string }) {
  const mark = (pos: string) => (
    <span key={pos} className={cn("pointer-events-none absolute h-3 w-3", pos)} aria-hidden="true">
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2" style={{ background: color }} />
      <span className="absolute top-1/2 left-0 w-full h-px -translate-y-1/2" style={{ background: color }} />
    </span>
  )
  return (
    <div className={cn("pointer-events-none absolute inset-0", className)} aria-hidden="true">
      {[
        "left-3 top-3",
        "right-3 top-3",
        "left-3 bottom-3",
        "right-3 bottom-3",
      ].map(mark)}
    </div>
  )
}

export function Barcode({
  seed = "JULES-MOREAU",
  className,
  height = 28,
  color = "currentColor",
}: {
  seed?: string
  className?: string
  height?: number
  color?: string
}) {
  const rnd = seeded(seed)
  const bars: { x: number; w: number }[] = []
  let x = 0
  while (x < 200) {
    const w = 1 + Math.floor(rnd() * 3)
    const gap = 1 + Math.floor(rnd() * 2)
    bars.push({ x, w })
    x += w + gap
  }
  return (
    <svg viewBox={`0 0 200 ${height}`} className={className} preserveAspectRatio="none" aria-hidden="true" style={{ height }}>
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y={0} width={b.w} height={height} fill={color} />
      ))}
    </svg>
  )
}

export function Hazard({ className, color }: { className?: string; color?: string }) {
  return (
    <div
      className={cn("h-2 w-full", className)}
      aria-hidden="true"
      style={{
        backgroundImage: `repeating-linear-gradient(-45deg, ${color ?? "var(--accent)"} 0 10px, transparent 10px 22px)`,
      }}
    />
  )
}

export function Rule({ className }: { className?: string }) {
  return <hr className={cn("border-0 border-t border-line", className)} />
}

/* ---------------- Section header ---------------- */

export function SectionHead({
  index,
  title,
  kicker,
  right,
  className,
  id,
}: {
  index: number | string
  title: string
  kicker?: string
  right?: React.ReactNode
  className?: string
  id?: string
}) {
  return (
    <div id={id} className={cn("relative border-t border-ink/60 pt-4", className)}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-start gap-4 md:gap-6">
          <span className="mono text-[11px] tracking-[0.2em] text-acid pt-1">
            {typeof index === "number" ? pad2(index) : index}
          </span>
          <div>
            {kicker && <div className="label text-mute mb-2">{kicker}</div>}
            <h2 className="display text-[clamp(28px,5vw,64px)]">{title}</h2>
          </div>
        </div>
        {right && <div className="label text-mute">{right}</div>}
      </div>
    </div>
  )
}

/* ---------------- Data ---------------- */

export function Stat({
  value,
  label,
  color,
  className,
  size = "md",
}: {
  value: React.ReactNode
  label: string
  color?: string
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
}) {
  const sizes = {
    sm: "text-2xl",
    md: "text-[clamp(28px,3.4vw,44px)]",
    lg: "text-[clamp(40px,5vw,72px)]",
    xl: "text-[clamp(56px,8vw,120px)]",
  }
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className={cn("display tnum leading-none", sizes[size])} style={color ? { color } : undefined}>
        {value}
      </span>
      <span className="label text-mute">{label}</span>
    </div>
  )
}

export function Kv({ k, v, className, accent }: { k: string; v: React.ReactNode; className?: string; accent?: string }) {
  return (
    <div className={cn("flex items-baseline justify-between gap-4 border-t border-line py-2.5", className)}>
      <span className="label text-mute shrink-0">{k}</span>
      <span className="mono text-[12px] text-right uppercase tracking-[0.06em]" style={accent ? { color: accent } : undefined}>
        {v}
      </span>
    </div>
  )
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-4 w-4", className)} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="square" />
    </svg>
  )
}

export function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-4 w-4", className)} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M7 17L17 7M8 7h9v9" strokeLinecap="square" />
    </svg>
  )
}
