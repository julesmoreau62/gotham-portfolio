"use client"

import { useEffect, useState } from "react"
import { Aperture, Linkedin, Mail, Download, Wifi } from "lucide-react"

export function HudHeader() {
  const [time, setTime] = useState("")

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      )
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="h-14 bg-card/80 backdrop-blur border-b border-border flex items-center justify-between px-4 md:px-6 z-50 shrink-0">
      <div className="flex items-center gap-3 md:gap-6">
        <div className="flex items-center gap-2">
          <Aperture className="w-5 h-5 text-primary" />
          <span className="font-bold tracking-widest text-foreground text-base md:text-lg font-tech">
            GOTHAM
          </span>
          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-mono border border-primary/30 hidden sm:inline">
            V.2.7.1
          </span>
        </div>
        <div className="h-6 w-px bg-border hidden sm:block" />
        <div className="text-[10px] text-muted-foreground font-mono hidden lg:block">
          OP: J.MOREAU // ID: 884-B // LOC: FRANCE
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="flex items-center gap-1 md:gap-2">
          <a
            href="https://www.linkedin.com/in/jules-moreau-25405b363"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded border border-primary/30 bg-primary/10 hover:bg-primary/30 hover:border-primary transition-all group"
            aria-label="LinkedIn Profile"
          >
            <Linkedin className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
          </a>
          <a
            href="mailto:jules.moreau1@outlook.com"
            className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded border border-[hsl(var(--field-green))]/30 bg-[hsl(var(--field-green))]/10 hover:bg-[hsl(var(--field-green))]/30 hover:border-[hsl(var(--field-green))] transition-all group"
            aria-label="Send Email"
          >
            <Mail className="w-4 h-4 text-[hsl(var(--field-green))] group-hover:scale-110 transition-transform" />
          </a>
          <button
            className="hidden sm:flex h-8 md:h-9 px-3 items-center gap-2 rounded border border-accent/30 bg-accent/10 hover:bg-accent/30 hover:border-accent transition-all group"
            aria-label="Download CV"
          >
            <Download className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" />
            <span className="text-[9px] font-mono text-accent hidden md:inline">CV</span>
          </button>
        </div>

        <div className="h-6 w-px bg-border hidden md:block" />

        <div className="flex items-center gap-1.5 md:gap-2 bg-destructive/10 border border-destructive/30 px-2 md:px-3 py-1 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
          <span className="text-[8px] md:text-[10px] font-bold text-destructive tracking-wider">LIVE</span>
          <span className="text-[8px] md:text-[10px] font-bold text-destructive tracking-wider hidden sm:inline">
            MONITORING
          </span>
        </div>

        <div className="text-[10px] font-mono text-muted-foreground hidden md:block tabular-nums">
          <Wifi className="w-3 h-3 text-[hsl(var(--field-green))] inline mr-1" />
          {time}
        </div>
      </div>
    </header>
  )
}
