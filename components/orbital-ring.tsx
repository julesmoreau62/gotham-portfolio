"use client"

interface SatelliteProps {
  label: string
  position: "top" | "bottom" | "left" | "right"
  color?: "blue" | "orange"
}

function Satellite({ label, position, color = "blue" }: SatelliteProps) {
  const posClasses = {
    top: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
    bottom: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
    left: "top-1/2 left-0 -translate-x-1/2 -translate-y-1/2",
    right: "top-1/2 right-0 translate-x-1/2 -translate-y-1/2",
  }

  const dotColor = color === "orange" ? "bg-accent shadow-[0_0_10px_hsl(var(--alert-orange))]" : "bg-primary shadow-[0_0_10px_hsl(var(--primary))]"
  const labelColor = color === "orange" ? "text-accent/80" : "text-primary/70"
  const pingColor = color === "orange" ? "border-accent" : "border-primary"

  return (
    <div className={`absolute flex items-center gap-2 ${posClasses[position]}`}>
      <div className={`w-2 h-2 rounded-full relative ${dotColor}`}>
        <div className={`absolute inset-[-4px] rounded-full border ${pingColor} opacity-0 animate-node-ping`} />
        <div className="absolute inset-[2px] bg-foreground/80 rounded-full" />
      </div>
      <span className={`font-mono text-[9px] ${labelColor} whitespace-nowrap tracking-wider`}>
        {label}
      </span>
    </div>
  )
}

export function OrbitalRings() {
  return (
    <div className="absolute inset-0 pointer-events-none hidden md:block">
      {/* Inner ring */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-primary/15"
        style={{ width: 280, height: 280 }}
      >
        <div className="absolute inset-0 rounded-full animate-orbit-slow">
          <Satellite label="CRISIS MGMT" position="top" />
          <Satellite label="ENGLISH C1" position="bottom" />
        </div>
      </div>

      {/* Middle ring */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-foreground/5"
        style={{ width: 450, height: 450 }}
      >
        <div className="absolute inset-0 rounded-full animate-orbit-rev-med">
          <Satellite label="ADOBE SUITE" position="right" color="orange" />
          <Satellite label="DATA ANALYSIS" position="left" color="orange" />
        </div>
      </div>

      {/* Outer ring */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-foreground/5"
        style={{ width: 620, height: 620 }}
      >
        <div className="absolute inset-0 rounded-full animate-orbit-fast">
          <div className="absolute top-[15%] right-[15%] translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary))] relative">
              <div className="absolute inset-[-4px] rounded-full border border-primary opacity-0 animate-node-ping" />
              <div className="absolute inset-[2px] bg-foreground/80 rounded-full" />
            </div>
            <span className="font-mono text-[9px] text-primary/70 whitespace-nowrap tracking-wider">
              TEAM LEADERSHIP
            </span>
          </div>
          <div className="absolute bottom-[15%] left-[15%] -translate-x-1/2 translate-y-1/2 flex items-center gap-2">
            <span className="font-mono text-[9px] text-primary/70 whitespace-nowrap tracking-wider">
              OSINT INTEL
            </span>
            <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary))] relative">
              <div className="absolute inset-[-4px] rounded-full border border-primary opacity-0 animate-node-ping" />
              <div className="absolute inset-[2px] bg-foreground/80 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
