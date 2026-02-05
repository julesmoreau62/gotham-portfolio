"use client"

import { useEffect, useState } from "react"

export function CenterCore() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`relative z-40 transition-all duration-700 ${visible ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
    >
      {/* Outer glow ring */}
      <div className="absolute -inset-4 rounded-full bg-primary/5 blur-xl animate-pulse" />

      {/* Main circle */}
      <div className="w-24 h-24 bg-card border-2 border-primary rounded-full flex items-center justify-center shadow-[0_0_40px_hsl(var(--primary)/0.4)] relative group cursor-pointer">
        <span className="font-bold text-foreground text-2xl font-tech select-none">JM</span>

        {/* Ping ring */}
        <div className="absolute inset-0 rounded-full border border-primary animate-node-ping opacity-20" />

        {/* Secondary ping ring with delay */}
        <div
          className="absolute inset-0 rounded-full border border-primary opacity-10"
          style={{
            animation: "node-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite 0.5s",
          }}
        />
      </div>

      {/* Status text */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <span className="text-[9px] font-mono text-muted-foreground tracking-widest">
          OPERATIVE ACTIVE
        </span>
      </div>
    </div>
  )
}
