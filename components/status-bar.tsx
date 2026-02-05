"use client"

import { useEffect, useState } from "react"

export function StatusBar() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <footer className="h-8 bg-card/60 backdrop-blur border-t border-border flex items-center justify-between px-4 md:px-6 z-50 shrink-0">
      <div className="flex items-center gap-4 text-[9px] font-mono text-muted-foreground">
        <span>
          SYS:{" "}
          <span className="text-[hsl(var(--field-green))]">OPERATIONAL</span>
        </span>
        <span className="hidden sm:inline">
          UPLINK:{" "}
          <span className="text-primary">STABLE</span>
        </span>
        <span className="hidden md:inline">
          THREAT:{" "}
          <span className="text-accent">LOW</span>
        </span>
      </div>
      <div className="flex items-center gap-4 text-[9px] font-mono text-muted-foreground">
        <span className="hidden sm:inline">ENCRYPTION: AES-256</span>
        <span>
          NODE:{" "}
          <span className="text-foreground">FR-LIL-01</span>
        </span>
      </div>
    </footer>
  )
}
