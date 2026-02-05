"use client"

import { useEffect, useState } from "react"
import { Crosshair, Wifi, Database, Satellite } from "lucide-react"

interface SectionNodeProps {
  id: string
  title: string
  subtitle: string
  status: string
  statusColor: "orange" | "green" | "blue" | "muted" | "cyan"
  icon: "crosshair" | "wifi" | "database" | "satellite"
  priority?: boolean
  delay?: number
  onClick?: () => void
}

const iconMap = {
  crosshair: Crosshair,
  wifi: Wifi,
  database: Database,
  satellite: Satellite,
}

export function SectionNode({
  title,
  subtitle,
  status,
  statusColor,
  icon,
  priority = false,
  delay = 0,
  onClick,
}: SectionNodeProps) {
  const [visible, setVisible] = useState(false)
  const Icon = iconMap[icon]

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 600 + delay)
    return () => clearTimeout(timer)
  }, [delay])

  const colorClasses = {
    orange: {
      border: "border-accent",
      text: "text-accent",
      bg: "bg-accent/10",
      borderLight: "border-accent/30",
      glow: "animate-glow-pulse",
      icon: "text-accent",
    },
    green: {
      border: "border-[hsl(var(--field-green))]",
      text: "text-[hsl(var(--field-green))]",
      bg: "bg-[hsl(var(--field-green))]/10",
      borderLight: "border-[hsl(var(--field-green))]/30",
      glow: "",
      icon: "text-[hsl(var(--field-green))]",
    },
    blue: {
      border: "border-primary",
      text: "text-primary",
      bg: "bg-primary/10",
      borderLight: "border-primary/30",
      glow: "",
      icon: "text-primary",
    },
    muted: {
      border: "border-border",
      text: "text-muted-foreground",
      bg: "bg-muted/10",
      borderLight: "border-border",
      glow: "",
      icon: "text-muted-foreground",
    },
    cyan: {
      border: "border-[hsl(var(--neon-cyan))]/50",
      text: "text-[hsl(var(--neon-cyan))]",
      bg: "bg-[hsl(var(--neon-cyan))]/10",
      borderLight: "border-[hsl(var(--neon-cyan))]/30",
      glow: "shadow-[0_0_12px_hsl(var(--neon-cyan)/0.22)]",
      icon: "text-[hsl(var(--neon-cyan))]",
    },
  }

  const c = colorClasses[statusColor]

  return (
    <div
      className={`cursor-pointer transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      style={{ transitionDelay: `${delay}ms` }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
    >
      <div
        className={`bg-card ${priority ? "border-2" : "border"} ${c.border} p-4 rounded-sm relative overflow-hidden group hover:brightness-125 transition-all ${c.glow}`}
      >
        {/* Scan line effect on hover */}
        <div className="absolute left-0 w-full h-[2px] bg-primary/30 opacity-0 group-hover:opacity-100 group-hover:animate-scan-line pointer-events-none" />

        {/* Corner accent */}
        {priority && (
          <div className={`absolute top-0 right-0 w-4 h-4 ${c.bg}`} style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }} />
        )}

        <div className="flex justify-between items-start mb-2">
          <span
            className={`text-[9px] font-bold ${c.text} uppercase tracking-wider ${priority ? `border ${c.borderLight} px-1 ${c.bg}` : ""}`}
          >
            {status}
          </span>
          {statusColor === "green" ? (
            <div className="w-2 h-2 rounded-full bg-[hsl(var(--field-green))] shadow-[0_0_10px_hsl(var(--field-green))] animate-pulse" />
          ) : (
            <Icon className={`w-4 h-4 ${c.icon} ${priority ? "animate-pulse" : ""}`} />
          )}
        </div>

        <h3 className={`font-bold text-foreground ${priority ? "text-xl" : "text-lg"} font-tech leading-none mb-1`}>
          {title}
        </h3>
        <p className="text-[10px] text-muted-foreground font-mono">{subtitle}</p>

        {/* Data flow bar for special nodes */}
        {statusColor === "cyan" && (
          <div className="relative h-[2px] bg-[hsl(var(--neon-cyan))]/15 rounded-full mt-2 overflow-hidden">
            <div
              className="absolute top-0 h-full w-[30%] bg-gradient-to-r from-transparent via-[hsl(var(--neon-cyan))]/90 to-transparent"
              style={{ animation: "data-flow 1.6s linear infinite" }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
