import { cn } from "@/lib/utils"

export function Marquee({
  items,
  className,
  itemClassName,
  reverse = false,
  separator = "✦",
  speed = "28s",
}: {
  items: React.ReactNode[]
  className?: string
  itemClassName?: string
  reverse?: boolean
  separator?: React.ReactNode
  speed?: string
}) {
  const row = (key: string, hidden?: boolean) => (
    <div key={key} className="flex shrink-0 items-center" aria-hidden={hidden ? "true" : undefined}>
      {items.map((it, i) => (
        <span key={i} className={cn("flex items-center gap-6 pr-6", itemClassName)}>
          <span>{it}</span>
          <span className="text-acid" aria-hidden="true">
            {separator}
          </span>
        </span>
      ))}
    </div>
  )
  return (
    <div className={cn("relative overflow-hidden whitespace-nowrap", className)}>
      <div
        className={cn("marquee-track", reverse ? "animate-marquee-rev" : "animate-marquee")}
        style={{ animationDuration: speed }}
      >
        {row("a")}
        {row("b", true)}
      </div>
    </div>
  )
}
