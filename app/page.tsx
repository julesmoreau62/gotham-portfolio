"use client"

import { useState } from "react"
import { TypingIntro } from "@/components/typing-intro"
import { HudHeader } from "@/components/hud-header"
import { StatusBar } from "@/components/status-bar"
import { DataStream } from "@/components/data-stream"
import { OrbitalRings } from "@/components/orbital-ring"
import { ConnectorLines } from "@/components/connector-lines"
import { CenterCore } from "@/components/center-core"
import { SectionNode } from "@/components/section-node"

const SECTIONS = [
  {
    id: "strategy",
    title: "STRATEGY",
    subtitle: "Target: BLAST.tv",
    status: "Critical Priority",
    statusColor: "orange" as const,
    icon: "crosshair" as const,
    priority: true,
    desktop: { top: "25%", left: "20%", transform: "translate(-50%, -50%)" },
    delay: 0,
  },
  {
    id: "events",
    title: "FIELD OPS",
    subtitle: "Logistics",
    status: "Active",
    statusColor: "green" as const,
    icon: "crosshair" as const,
    priority: false,
    desktop: { top: "25%", right: "20%", transform: "translate(50%, -50%)" },
    delay: 100,
  },
  {
    id: "comms",
    title: "SIGNAL",
    subtitle: "Digital Activation",
    status: "Online",
    statusColor: "blue" as const,
    icon: "wifi" as const,
    priority: false,
    desktop: { bottom: "25%", left: "20%", transform: "translate(-50%, 50%)" },
    delay: 200,
  },
  {
    id: "photo",
    title: "IMAGERY",
    subtitle: "Archives",
    status: "Storage",
    statusColor: "muted" as const,
    icon: "database" as const,
    priority: false,
    desktop: { bottom: "25%", right: "20%", transform: "translate(50%, 50%)" },
    delay: 300,
  },
  {
    id: "intel",
    title: "INTEL CORE",
    subtitle: "Sport Biz + Spatial",
    status: "Intel System",
    statusColor: "cyan" as const,
    icon: "satellite" as const,
    priority: false,
    desktop: { top: "50%", left: "30%", transform: "translate(-50%, -50%)" },
    delay: 400,
  },
]

export default function Page() {
  const [showIntro, setShowIntro] = useState(true)
  const [mainVisible, setMainVisible] = useState(false)

  const handleIntroComplete = () => {
    setShowIntro(false)
    setTimeout(() => setMainVisible(true), 100)
  }

  return (
    <>
      {showIntro && <TypingIntro onComplete={handleIntroComplete} />}

      <div
        className={`flex flex-col h-screen transition-all duration-1000 bg-background tactical-grid relative ${mainVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
      >
        <HudHeader />

        <main className="flex-1 flex overflow-hidden relative z-10">
          <DataStream />

          {/* Main graph area */}
          <section className="flex-1 relative flex items-center justify-center overflow-y-auto" id="graph-container">
            {/* Decorative side markers */}
            <div className="absolute inset-0 pointer-events-none hidden md:block">
              <div className="absolute left-10 top-1/2 -translate-y-1/2 h-40 border-l border-border flex flex-col justify-between py-1">
                <div className="w-2 h-px bg-foreground/30" />
                <div className="w-2 h-px bg-foreground/30" />
                <div className="w-2 h-px bg-foreground/30" />
              </div>
              <div className="absolute right-10 top-1/2 -translate-y-1/2 h-40 border-r border-border flex flex-col justify-between py-1 items-end">
                <div className="w-2 h-px bg-foreground/30" />
                <div className="w-2 h-px bg-foreground/30" />
                <div className="w-2 h-px bg-foreground/30" />
              </div>
            </div>

            <ConnectorLines />
            <OrbitalRings />

            {/* DESKTOP: Center core */}
            <div className="hidden md:flex items-center justify-center relative z-40">
              <CenterCore />
            </div>

            {/* DESKTOP: Absolute positioned nodes */}
            {SECTIONS.map((section) => (
              <div
                key={section.id}
                className={`absolute cursor-pointer ${section.priority ? "w-64" : section.id === "intel" ? "w-36" : "w-56"} z-50 hidden md:block`}
                style={section.desktop}
              >
                <SectionNode
                  id={section.id}
                  title={section.title}
                  subtitle={section.subtitle}
                  status={section.status}
                  statusColor={section.statusColor}
                  icon={section.icon}
                  priority={section.priority}
                  delay={section.delay}
                />
              </div>
            ))}

            {/* MOBILE: Stacked layout */}
            <div className="flex flex-col items-center gap-5 p-6 md:hidden w-full max-w-sm mx-auto">
              {/* Mobile profile badge */}
              <div className="mb-2">
                <CenterCore />
              </div>

              <p className="text-[10px] text-muted-foreground font-mono text-center mt-6 mb-2">
                TAP A MODULE TO ACCESS
              </p>

              {/* Mobile node cards */}
              {SECTIONS.map((section) => (
                <div key={`mobile-${section.id}`} className="w-full">
                  <SectionNode
                    id={section.id}
                    title={section.title}
                    subtitle={section.subtitle}
                    status={section.status}
                    statusColor={section.statusColor}
                    icon={section.icon}
                    priority={section.priority}
                    delay={section.delay}
                  />
                </div>
              ))}

              {/* Mobile skills badges */}
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {["CRISIS MGMT", "ENGLISH C1", "ADOBE SUITE", "DATA ANALYSIS", "TEAM LEAD", "OSINT"].map((skill) => {
                  const isOrange = skill === "ADOBE SUITE" || skill === "DATA ANALYSIS"
                  return (
                    <span
                      key={skill}
                      className={`text-[8px] font-mono px-2 py-1 rounded border ${isOrange ? "text-accent/80 bg-accent/10 border-accent/30" : "text-primary/80 bg-primary/10 border-primary/30"}`}
                    >
                      {skill}
                    </span>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Right side decorative panel */}
          <aside className="w-16 hidden lg:flex flex-col items-center justify-center gap-4 border-l border-border relative overflow-hidden">
            {/* Animated data side strips */}
            <div className="absolute inset-0 opacity-30">
              <div
                className="absolute inset-0"
                style={{
                  background: "repeating-linear-gradient(180deg, hsl(186 100% 50% / 0.08) 0 2px, transparent 2px 12px)",
                  animation: "scan-line 6s linear infinite",
                }}
              />
            </div>
            <div className="w-[2px] h-6 bg-primary/20 relative overflow-hidden">
              <div
                className="absolute left-0 w-full h-[30%] bg-[hsl(var(--neon-cyan))]/80"
                style={{ animation: "scan-line 2.2s linear infinite" }}
              />
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-background border border-[hsl(var(--neon-cyan))]/60 shadow-[0_0_10px_hsl(var(--neon-cyan)/0.3)]" />
            <div className="w-[2px] h-6 bg-primary/20 relative overflow-hidden">
              <div
                className="absolute left-0 w-full h-[30%] bg-[hsl(var(--neon-cyan))]/80"
                style={{ animation: "scan-line 2.2s linear infinite reverse" }}
              />
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--neon-cyan))] shadow-[0_0_14px_hsl(var(--neon-cyan)/0.7)]" />
            <div className="w-[2px] h-6 bg-primary/20 relative overflow-hidden">
              <div
                className="absolute left-0 w-full h-[30%] bg-[hsl(var(--neon-cyan))]/80"
                style={{ animation: "scan-line 1.8s linear infinite" }}
              />
            </div>
          </aside>
        </main>

        <StatusBar />
      </div>
    </>
  )
}
