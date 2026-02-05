"use client"

import { useEffect, useRef, useState } from "react"
import { Activity } from "lucide-react"

const DATA_ENTRIES = [
  { key: "REVENUE", val: "€82.1M (+13%)", alert: false },
  { key: "VIEWERSHIP", val: "Peak 1.2M concurrent", alert: false },
  { key: "SPONSOR_ROI", val: "3.2x avg return", alert: false },
  { key: "ALERT", val: "Margin below 16%", alert: true },
  { key: "TICKET_SALES", val: "94% capacity", alert: false },
  { key: "SOCIAL_REACH", val: "12.4M impressions", alert: false },
  { key: "BROADCAST", val: "147 territories", alert: false },
  { key: "ALERT", val: "Copenhagen Major incoming", alert: true },
  { key: "MERCH_REV", val: "€4.2M Q3", alert: false },
  { key: "AUDIENCE_AGE", val: "18-34 primary demo", alert: false },
  { key: "DIGITAL", val: "Twitch partner active", alert: false },
  { key: "ALERT", val: "Competitor analysis pending", alert: true },
  { key: "STAFF", val: "142 FTE (+12)", alert: false },
  { key: "EVENTS", val: "12 planned FY25", alert: false },
  { key: "PRIZE_POOL", val: "$2.5M allocated", alert: false },
  { key: "ENGAGEMENT", val: "↑ 23% YoY", alert: false },
  { key: "OPS_STATUS", val: "All systems nominal", alert: false },
  { key: "ALERT", val: "Budget review Q4", alert: true },
  { key: "BROADCAST", val: "4K production ready", alert: false },
  { key: "PARTNERS", val: "32 active sponsors", alert: false },
]

export function DataStream() {
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const doubled = [...DATA_ENTRIES, ...DATA_ENTRIES]

  return (
    <aside className="w-72 hidden md:flex flex-col z-20 relative pointer-events-none p-4 justify-center">
      <div className="bg-background/60 backdrop-blur border border-border p-4 rounded w-full h-[70vh] flex flex-col pointer-events-auto relative overflow-hidden shadow-2xl">
        <div className="text-[9px] font-bold text-foreground/70 mb-3 border-b border-border pb-2 uppercase flex items-center gap-2 shrink-0">
          <Activity className="w-3 h-3 text-primary" />
          INCOMING INTEL: BLAST.TV
        </div>

        <div
          ref={containerRef}
          className="flex-1 overflow-hidden relative"
          style={{
            maskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
          }}
        >
          <div className="flex flex-col animate-data-stream">
            {doubled.map((entry, i) => (
              <div
                key={`${entry.key}-${i}`}
                className={`whitespace-nowrap overflow-hidden text-ellipsis border-l ${entry.alert ? "border-accent/40" : "border-primary/20"} pl-2 mb-1.5 font-tech text-[10px] text-muted-foreground`}
              >
                <span className={`font-bold ${entry.alert ? "text-accent" : "text-primary"}`}>
                  {entry.key}
                </span>
                {" // "}
                {entry.val}
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        <div className="absolute bottom-2 right-3 text-[8px] text-primary animate-pulse shrink-0">
          LIVE FEED // SCROLLING
        </div>
      </div>
    </aside>
  )
}
