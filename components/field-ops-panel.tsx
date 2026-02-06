"use client"

import React from "react"

import { useState, useEffect, useCallback } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import Image from "next/image"
import {
  X, ArrowLeft, MapPin, Calendar, Users, Camera, AlertTriangle,
  ShieldCheck, Trophy, Target, CloudRain, Play, CheckCircle, Crosshair
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  FIELD OPS PANEL - ASI Tournament Command Center                   */
/* ------------------------------------------------------------------ */

export function FieldOpsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const isMobile = useIsMobile()
  const [phase, setPhase] = useState<"intro" | "main">("intro")
  const [introStep, setIntroStep] = useState(0)
  const [visible, setVisible] = useState(false)

  // ESC to close
  const handleKey = useCallback((e: KeyboardEvent) => { if (e.key === "Escape") onClose() }, [onClose])
  useEffect(() => {
    if (open) { document.addEventListener("keydown", handleKey) }
    return () => document.removeEventListener("keydown", handleKey)
  }, [open, handleKey])

  // Reset on open
  useEffect(() => {
    if (open) {
      setPhase("intro")
      setIntroStep(0)
      setVisible(false)
    }
  }, [open])

  // Intro sequence - Mobile: 1.2s / Desktop: 3s
  useEffect(() => {
    if (!open || phase !== "intro") return
    const timings = isMobile
      ? [100, 300, 600, 900, 1200]
      : [300, 900, 1600, 2300, 3000]
    
    const timers = [
      setTimeout(() => setIntroStep(1), timings[0]),
      setTimeout(() => setIntroStep(2), timings[1]),
      setTimeout(() => setIntroStep(3), timings[2]),
      setTimeout(() => setIntroStep(4), timings[3]),
      setTimeout(() => { setPhase("main"); setTimeout(() => setVisible(true), 50) }, timings[4]),
    ]
    return () => timers.forEach(clearTimeout)
  }, [open, phase, isMobile])

  const skipIntro = () => { setPhase("main"); setTimeout(() => setVisible(true), 50) }

  if (!open) return null

  const green = "hsl(160 84% 39%)"

  /* ===== INTRO ===== */
  if (phase === "intro") {
    return (
      <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(hsl(160 84% 39% / 0.12) 1px, transparent 1px), linear-gradient(90deg, hsl(160 84% 39% / 0.12) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Crosshair acquisition */}
        <div className="relative flex flex-col items-center gap-6">
          {/* Spinning crosshair ring */}
          <div className={`relative w-32 h-32 md:w-40 md:h-40 transition-all duration-1000 ${introStep >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}>
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed"
              style={{ borderColor: `hsl(160 84% 39% / 0.4)`, animation: "orbit-spin 8s linear infinite" }}
            />
            {/* Inner ring */}
            <div className="absolute inset-4 rounded-full border"
              style={{ borderColor: `hsl(160 84% 39% / 0.6)`, animation: "orbit-spin 6s linear infinite reverse" }}
            />
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`transition-all duration-700 ${introStep >= 2 ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}>
                <Crosshair className="w-10 h-10 md:w-12 md:h-12" style={{ color: green, filter: `drop-shadow(0 0 15px ${green})` }} />
              </div>
            </div>
            {/* Ping */}
            {introStep >= 2 && <div className="absolute inset-0 rounded-full border animate-node-ping" style={{ borderColor: `hsl(160 84% 39% / 0.5)` }} />}
          </div>

          {/* Location text */}
          <div className={`text-center transition-all duration-700 ${introStep >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <div className="flex items-center justify-center gap-2 mb-1">
              <MapPin className="w-3 h-3" style={{ color: green }} />
              <span className="font-mono text-xs tracking-[0.3em]" style={{ color: green }}>LILLE, FRANCE</span>
            </div>
            <span className="font-mono text-[9px] text-muted-foreground tracking-widest">
              LAT: 50.6292 N | LONG: 3.0573 E
            </span>
          </div>

          {/* Mission designation */}
          <div className={`text-center transition-all duration-700 ${introStep >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <h2 className="font-tech text-2xl md:text-3xl font-bold text-foreground tracking-[0.15em]">
              FIELD OPERATION
            </h2>
            <div className="font-tech text-lg md:text-xl font-bold tracking-[0.2em] mt-1" style={{ color: green, textShadow: `0 0 20px hsl(160 84% 39% / 0.5)` }}>
              ASI TOURNAMENT
            </div>
          </div>

          {/* Status */}
          <div className={`flex items-center gap-3 transition-all duration-700 ${introStep >= 4 ? "opacity-100" : "opacity-0"}`}>
            <div className="w-2 h-2 rounded-full bg-[hsl(var(--field-green))] animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.2em]" style={{ color: green }}>MISSION STATUS: COMPLETED</span>
          </div>
        </div>

        {/* Skip */}
        <button type="button" onClick={skipIntro}
          className="absolute bottom-8 right-8 font-mono text-[9px] text-muted-foreground hover:text-foreground transition-colors tracking-widest">
          SKIP [{'>'}]
        </button>
      </div>
    )
  }

  /* ===== MAIN VIEW ===== */
  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col overflow-hidden">
      {/* Subtle grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(${green} 1px, transparent 1px), linear-gradient(90deg, ${green} 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
        }}
      />

      {/* Top bar */}
      <header className={`h-11 flex items-center justify-between px-4 md:px-6 border-b border-[hsl(var(--field-green))]/30 bg-card/40 backdrop-blur-md z-50 shrink-0 transition-all duration-700 ${visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}>
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-sm shadow-[0_0_10px_hsl(160_84%_39%)]" style={{ background: green }} />
          <h2 className="font-tech text-sm tracking-[0.15em] text-foreground">
            FIELD OPS: <span style={{ color: green }}>ASI TOURNAMENT</span>
          </h2>
        </div>
        <div className="hidden md:flex items-center gap-4 text-[8px] font-mono text-muted-foreground">
          <span>STATUS: <span className="font-bold" style={{ color: green }}>COMPLETED</span></span>
          <span>DATE: DEC 2025</span>
          <span>LOC: UFR3S LILLE</span>
        </div>
        <button type="button" onClick={onClose}
          className="flex items-center gap-2 px-3 py-1.5 rounded border border-[hsl(var(--field-green))]/40 hover:bg-[hsl(var(--field-green))]/10 transition-all group">
          <ArrowLeft className="w-3.5 h-3.5 text-[hsl(var(--field-green))] group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-[9px] font-mono tracking-widest" style={{ color: green }}>RETURN TO BASE</span>
        </button>
      </header>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 z-10">
        <div className="max-w-6xl mx-auto flex flex-col gap-5 md:gap-6">

          {/* ============= VIDEO + MISSION BRIEF ROW ============= */}
          <div className={`grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-5 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            style={{ transitionDelay: "200ms" }}>

            {/* Video Feed - 3 cols */}
            <div className="lg:col-span-3 border-2 border-[hsl(var(--field-green))]/40 rounded-lg overflow-hidden bg-card/50 group hover:border-[hsl(var(--field-green))]/70 transition-colors">
              {/* Video header */}
              <div className="flex items-center justify-between px-3 py-2 bg-card/80 border-b border-[hsl(var(--field-green))]/20">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-red-400 font-mono text-[8px] font-bold tracking-widest">REC</span>
                  </div>
                  <div className="h-3 w-px bg-border" />
                  <span className="font-mono text-[8px] font-bold tracking-wider" style={{ color: green }}>LIVE FOOTAGE</span>
                </div>
                <span className="text-muted-foreground font-mono text-[7px]">SONY_A6400</span>
              </div>

              {/* Video embed */}
              <div className="relative w-full aspect-video bg-secondary overflow-hidden">
                {/* Corner brackets */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 z-10" style={{ borderColor: `hsl(160 84% 39% / 0.6)` }} />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 z-10" style={{ borderColor: `hsl(160 84% 39% / 0.6)` }} />
                <div className="absolute bottom-9 left-2 w-4 h-4 border-b-2 border-l-2 z-10" style={{ borderColor: `hsl(160 84% 39% / 0.6)` }} />
                <div className="absolute bottom-9 right-2 w-4 h-4 border-b-2 border-r-2 z-10" style={{ borderColor: `hsl(160 84% 39% / 0.6)` }} />

                {/* Scan lines overlay */}
                <div className="absolute inset-0 z-10 pointer-events-none opacity-20"
                  style={{ backgroundImage: "linear-gradient(transparent 50%, rgba(0,0,0,0.3) 50%)", backgroundSize: "100% 4px" }}
                />

                <iframe
                  src="https://player.vimeo.com/video/1153484782?background=1&autoplay=1&loop=1&muted=1&quality=auto"
                  className="w-full h-full"
                  style={{ border: "none", pointerEvents: "none" }}
                  allow="autoplay; fullscreen"
                  title="ASI Tournament body cam footage"
                />

                {/* Play overlay on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/20 z-20 pointer-events-none">
                  <div className="w-12 h-12 rounded-full border-2 flex items-center justify-center" style={{ borderColor: green, background: `hsl(160 84% 39% / 0.15)` }}>
                    <Play className="w-5 h-5" style={{ color: green }} />
                  </div>
                </div>
              </div>

              {/* Video footer */}
              <div className="flex items-center justify-between px-3 py-1.5 bg-card/80 border-t border-border/30">
                <span className="font-mono text-[8px] text-foreground">TC: <span style={{ color: green }}>00:00:00</span></span>
                <span className="text-muted-foreground font-mono text-[7px]">ASI_DEC25</span>
              </div>
            </div>

            {/* Right column - Mission Brief + Equipment */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {/* Mission Brief */}
              <div className="border rounded-lg p-4 bg-card/40 border-[hsl(var(--field-green))]/30 hover:border-[hsl(var(--field-green))]/50 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-3.5 h-3.5" style={{ color: green }} />
                  <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] font-tech" style={{ color: green }}>Mission Brief</h4>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  {[
                    { label: "ROLE", value: "COMMS CHIEF", highlight: true },
                    { label: "DATE", value: "DEC 2025", highlight: false },
                    { label: "LOCATION", value: "UFR3S", highlight: false },
                    { label: "PERSONNEL", value: "500+", highlight: true },
                  ].map((item) => (
                    <div key={item.label} className={`flex justify-between items-center p-2 rounded bg-secondary/50 ${item.highlight ? "border-l-2" : ""}`}
                      style={item.highlight ? { borderColor: green } : {}}>
                      <span className="text-[7px] text-muted-foreground font-mono">{item.label}</span>
                      <span className={`text-[9px] font-bold font-mono ${item.highlight ? "" : "text-foreground"}`}
                        style={item.highlight ? { color: green } : {}}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Sports */}
                <div className="p-2.5 rounded border border-[hsl(var(--field-green))]/20 bg-[hsl(var(--field-green))]/5">
                  <div className="text-[7px] text-muted-foreground uppercase mb-1.5 font-mono">SPORTS DISCIPLINES</div>
                  <div className="flex flex-wrap gap-1.5">
                    {["DISC GOLF", "WHEELCHAIR BBL", "LASER TAG", "SPIKEBALL"].map((sport) => (
                      <span key={sport} className="text-[7px] bg-secondary/80 text-foreground px-2 py-0.5 rounded font-mono border border-border/50">
                        {sport}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Equipment Loadout */}
              <div className="border rounded-lg p-4 bg-card/40 border-[hsl(var(--field-green))]/30 hover:border-[hsl(var(--field-green))]/50 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <Camera className="w-3.5 h-3.5" style={{ color: green }} />
                  <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] font-tech" style={{ color: green }}>Equipment Loadout</h4>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="p-2.5 rounded bg-secondary/40 border border-border/30 hover:bg-secondary/60 transition-colors">
                    <span className="text-[7px] text-muted-foreground uppercase block mb-0.5 font-mono">Primary Unit</span>
                    <span className="text-[10px] font-bold text-foreground font-mono block">SONY a6400</span>
                    <span className="text-[7px] uppercase font-mono" style={{ color: green }}>MIRRORLESS APS-C</span>
                  </div>
                  <div className="p-2.5 rounded bg-secondary/40 border border-border/30 hover:bg-secondary/60 transition-colors">
                    <span className="text-[7px] text-muted-foreground uppercase block mb-0.5 font-mono">Action Cams</span>
                    <span className="text-[10px] font-bold text-foreground font-mono block">GOPRO x2</span>
                    <span className="text-[7px] uppercase font-mono" style={{ color: green }}>WIDE ANGLE POV</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded bg-[hsl(var(--field-green))]/5 border border-[hsl(var(--field-green))]/20">
                  <div>
                    <div className="text-[7px] text-muted-foreground uppercase mb-0.5 font-mono">Photo Output</div>
                    <div className="text-xl font-bold font-mono" style={{ color: green }}>50</div>
                  </div>
                  <Camera className="w-6 h-6" style={{ color: `hsl(160 84% 39% / 0.25)` }} />
                </div>

                <div className="text-[7px] text-muted-foreground font-mono mt-2 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" style={{ color: green }} />
                  All equipment operational
                </div>
              </div>
            </div>
          </div>

          {/* ============= CRITICAL INCIDENTS ============= */}
          <div className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            style={{ transitionDelay: "400ms" }}>
            <div className="border-2 border-destructive/30 rounded-lg overflow-hidden bg-card/30 hover:border-destructive/50 transition-colors">
              {/* Header */}
              <div className="h-10 border-b border-destructive/20 bg-gradient-to-r from-destructive/10 to-transparent flex items-center justify-between px-4">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  <span className="text-[10px] font-bold text-foreground uppercase tracking-[0.15em] font-tech">CRITICAL INCIDENTS LOG</span>
                </div>
                <span className="text-[8px] font-mono text-muted-foreground hidden sm:inline">CRISIS_MANAGEMENT</span>
              </div>

              <div className="p-4 md:p-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 mb-4">

                  {/* INCIDENT 1: FACILITY CONFLICT */}
                  <IncidentCard
                    time="H-0200"
                    title="FACILITY CONFLICT"
                    severity="CRITICAL"
                    severityColor="destructive"
                    description="Administration scheduled university match in primary gymnasium. Venue unavailable 2 hours before event start. Immediate relocation required."
                    resolution="Emergency relocation protocol activated. Secured alternate gymnasium within 45 minutes. Coordinated equipment transfer. Zero participant impact. On-time event start maintained."
                    stats={[
                      { label: "Response Time", value: "45min" },
                      { label: "Impact", value: "ZERO" },
                      { label: "Status", value: "OK" },
                    ]}
                    visible={visible}
                    delay={500}
                  />

                  {/* INCIDENT 2: WEATHER HAZARD */}
                  <IncidentCard
                    time="H-0030"
                    title="WEATHER HAZARD"
                    severity="ADAPTED"
                    severityColor="primary"
                    description="Heavy rainfall compromising outdoor Disc Golf area. Equipment damage risk detected. Participant safety concern raised. Weather forecast: continuous rain."
                    resolution="Indoor fallback protocol activated. Disc Golf relocated to secured gymnasium. Modified course layout implemented. Equipment protected. Full competition maintained with adapted rules."
                    stats={[
                      { label: "Relocation", value: "30min" },
                      { label: "Adaptability", value: "100%" },
                      { label: "Safety", value: "OK" },
                    ]}
                    visible={visible}
                    delay={650}
                    icon={<CloudRain className="w-4 h-4 text-primary" />}
                  />
                </div>

                {/* Crisis Summary */}
                <div className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-3 p-4 rounded-lg border transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                  style={{ transitionDelay: "800ms", background: `hsl(160 84% 39% / 0.05)`, borderColor: `hsl(160 84% 39% / 0.3)` }}>
                  <div className="flex items-center gap-3">
                    <Trophy className="w-6 h-6 shrink-0" style={{ color: green }} />
                    <div>
                      <div className="text-[10px] font-bold font-mono tracking-wider" style={{ color: green }}>CRISIS MANAGEMENT: SUCCESSFUL</div>
                      <div className="text-[8px] text-muted-foreground font-mono mt-0.5">Two major incidents resolved. Zero event disruption. Perfect operational continuity.</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 text-center">
                    {[
                      { value: "2", label: "Incidents" },
                      { value: "0", label: "Impact" },
                      { value: "100%", label: "Success" },
                    ].map((stat) => (
                      <div key={stat.label}>
                        <div className="text-xl font-bold font-mono" style={{ color: green }}>{stat.value}</div>
                        <div className="text-[7px] text-muted-foreground uppercase font-mono">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============= VISUAL ASSETS ============= */}
          <div className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            style={{ transitionDelay: "600ms" }}>
            <div className="flex items-center gap-2 mb-3">
              <Camera className="w-3.5 h-3.5" style={{ color: green }} />
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] font-tech" style={{ color: green }}>Visual Assets</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { file: "VISUAL_ID.PNG", title: "GRAPHIC CHARTER", desc: "Color palette & typography system.", src: "/assets/events/charte.png", fit: "object-contain p-2" },
                { file: "RULES.JPG", title: "PARTICIPANT BRIEFING", desc: "Bilingual rules (FR/EN).", src: "/assets/events/regles.jpg", fit: "object-cover object-top" },
                { file: "POSTER.PNG", title: "EVENT POSTER", desc: "Campus & social media promo.", src: "/assets/events/affiche.png", fit: "object-contain" },
              ].map((asset, i) => (
                <div key={asset.file}
                  className={`border rounded-lg overflow-hidden bg-card/40 border-border/40 hover:border-[hsl(var(--field-green))]/50 transition-all duration-700 group ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                  style={{ transitionDelay: `${700 + i * 120}ms` }}>
                  <div className="relative h-40 bg-muted overflow-hidden">
                    <div className="absolute top-2 left-2 z-10 px-2 py-0.5 text-[7px] font-mono rounded bg-card/80 border border-[hsl(var(--field-green))]/30"
                      style={{ color: green }}>
                      {asset.file}
                    </div>
                    <Image
                      src={asset.src || "/placeholder.svg"}
                      alt={asset.title}
                      fill
                      className={`${asset.fit} opacity-70 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500`}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {/* Scan line on hover */}
                    <div className="absolute left-0 w-full h-[1px] pointer-events-none opacity-0 group-hover:opacity-40 transition-opacity"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${green}, transparent)`,
                        animation: "scan-line 2s linear infinite",
                      }}
                    />
                    {/* Corner brackets */}
                    <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t border-l opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ borderColor: green }} />
                    <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t border-r opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ borderColor: green }} />
                    <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b border-l opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ borderColor: green }} />
                    <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b border-r opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ borderColor: green }} />
                  </div>
                  <div className="p-3 border-t border-border/20">
                    <h4 className="text-xs font-bold text-foreground font-tech mb-0.5">{asset.title}</h4>
                    <p className="text-[8px] text-muted-foreground font-mono">{asset.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* Close button - floating */}
      <button type="button" onClick={onClose}
        className="fixed top-3 right-3 md:hidden z-[110] w-8 h-8 rounded-full bg-card/80 border border-border flex items-center justify-center backdrop-blur-md hover:bg-card transition-colors"
        aria-label="Close panel">
        <X className="w-4 h-4 text-foreground" />
      </button>
    </div>
  )
}

/* ---- Incident Card Sub-component ---- */
function IncidentCard({
  time, title, severity, severityColor, description, resolution, stats, visible, delay, icon,
}: {
  time: string
  title: string
  severity: string
  severityColor: string
  description: string
  resolution: string
  stats: { label: string; value: string }[]
  visible: boolean
  delay: number
  icon?: React.ReactNode
}) {
  const green = "hsl(160 84% 39%)"
  const isRed = severityColor === "destructive"

  return (
    <div className={`relative p-4 rounded-r-lg border-l-4 transition-all duration-700 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
      style={{
        transitionDelay: `${delay}ms`,
        borderColor: isRed ? `hsl(0 84% 60% / 0.6)` : `hsl(217 91% 60% / 0.6)`,
        background: isRed
          ? `linear-gradient(to right, hsl(0 84% 60% / 0.08), transparent)`
          : `linear-gradient(to right, hsl(217 91% 60% / 0.08), transparent)`,
      }}>
      {/* Pulse dot */}
      <div className={`absolute -left-[9px] top-5 w-[14px] h-[14px] rounded-full border-[3px] border-background ${isRed ? "bg-destructive animate-pulse" : "bg-primary"}`} />

      {/* Header */}
      <div className="flex justify-between items-start mb-2.5">
        <div className="flex items-center gap-2.5">
          {icon || <AlertTriangle className="w-3.5 h-3.5 text-destructive" />}
          <span className={`text-[9px] font-bold font-mono tracking-wider ${isRed ? "text-destructive" : "text-primary"}`}>{time}</span>
          <span className="text-[10px] text-foreground font-bold font-tech">{title}</span>
        </div>
        <span className={`text-[7px] px-2 py-0.5 rounded border font-mono font-bold ${isRed ? "bg-destructive/10 text-destructive border-destructive/30" : "bg-primary/10 text-primary border-primary/30"}`}>
          {severity}
        </span>
      </div>

      <p className="text-[10px] text-muted-foreground leading-relaxed mb-3">{description}</p>

      {/* Resolution */}
      <div className="p-3 rounded border bg-[hsl(var(--field-green))]/5 border-[hsl(var(--field-green))]/20">
        <div className="flex items-start gap-2.5 mb-2">
          <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" style={{ color: green }} />
          <div className="flex-1">
            <div className="text-[8px] font-mono font-bold tracking-wider mb-1" style={{ color: green }}>RESOLUTION EXECUTED</div>
            <div className="text-[9px] text-muted-foreground font-mono leading-relaxed">{resolution}</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-2.5 pt-2.5 border-t border-border/20">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-[7px] text-muted-foreground uppercase font-mono">{s.label}</div>
              <div className="text-sm font-bold font-mono" style={{ color: green }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
