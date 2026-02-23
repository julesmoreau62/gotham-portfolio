"use client"

import { useEffect, useState } from "react"
import { RefreshCw, Zap } from "lucide-react"

/* ================================================================
   BUILD PROCESS FLOWCHART — Vertical phase timeline
   ================================================================ */

type PhaseTag = "personal" | "ai" | "collab"

const TAG_STYLES: Record<PhaseTag, { dot: string; text: string; label: string }> = {
  personal: {
    dot: "bg-accent",
    text: "text-accent",
    label: "Personal work",
  },
  ai: {
    dot: "bg-[hsl(var(--neon-cyan))]",
    text: "text-[hsl(var(--neon-cyan))]",
    label: "AI-assisted",
  },
  collab: {
    dot: "bg-[hsl(var(--field-green))]",
    text: "text-[hsl(var(--field-green))]",
    label: "Human + AI collaboration",
  },
}

function Tag({ type }: { type: PhaseTag }) {
  const s = TAG_STYLES[type]
  return (
    <span className={`inline-flex items-center gap-1.5 text-[9px] font-mono ${s.text} tracking-[0.15em] uppercase`}>
      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  )
}

/* ---------- Phase connector ---------- */
function Connector({ visible }: { visible: boolean }) {
  return (
    <div className="flex flex-col items-center py-2">
      <div
        className="w-px h-10 transition-all duration-700"
        style={{
          background: visible ? "hsl(186 100% 50% / 0.3)" : "hsl(215 25% 22% / 0.2)",
        }}
      />
      <svg
        className="w-3 h-3 transition-colors duration-500"
        viewBox="0 0 12 12"
        fill="none"
        style={{ color: visible ? "hsl(186 100% 50% / 0.5)" : "hsl(215 25% 22% / 0.3)" }}
      >
        <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

/* ---------- Phase wrapper ---------- */
function PhaseCard({
  index,
  visible,
  children,
  borderColor,
  borderSide = "left",
  dashed = false,
  bgTint,
}: {
  index: number
  visible: boolean
  children: React.ReactNode
  borderColor: string
  borderSide?: "left" | "top"
  dashed?: boolean
  bgTint?: string
}) {
  return (
    <div
      className="w-full transition-all duration-700"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transitionDelay: `${index * 150}ms`,
      }}
    >
      <div
        className={`relative rounded-lg bg-card/60 p-5 md:p-6 transition-all duration-300 hover:shadow-[0_0_20px_hsl(186_100%_50%/0.08)] group ${
          bgTint ?? ""
        }`}
        style={{
          borderWidth: borderSide === "left" ? "0 0 0 3px" : "3px 0 0 0",
          borderStyle: dashed ? "dashed" : "solid",
          borderColor,
          boxShadow: "inset 0 0 0 1px hsl(215 25% 22% / 0.3)",
        }}
      >
        {/* Hover glow */}
        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ boxShadow: `inset 0 0 30px ${borderColor.replace(")", " / 0.06)")}` }} />
        {children}
      </div>
    </div>
  )
}

/* ================================================================
   MAIN FLOWCHART
   ================================================================ */

export function BuildProcessFlowchart() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto">
      {/* ===== PHASE 01 ===== */}
      <PhaseCard index={0} visible={visible} borderColor="hsl(var(--alert-orange))">
        <div className="flex items-center gap-3 mb-3">
          <span className="font-tech text-[10px] text-muted-foreground tracking-[0.3em]">PHASE 01</span>
          <span className="text-[9px] font-mono text-muted-foreground/60">{"///"}</span>
          <Tag type="personal" />
        </div>
        <h3 className="font-tech text-base md:text-lg text-foreground tracking-[0.1em] mb-2">NEED IDENTIFICATION</h3>
        <p className="text-xs font-mono text-muted-foreground leading-relaxed">
          Automate a daily sport business intelligence watch covering 35+ international sources across 6 geographic
          regions. Goal: replace 2 hours of manual monitoring with a smart, automated system.
        </p>
      </PhaseCard>

      <Connector visible={visible} />

      {/* ===== PHASE 02 ===== */}
      <PhaseCard index={1} visible={visible} borderColor="hsl(var(--neon-cyan))">
        <div className="flex items-center gap-3 mb-3">
          <span className="font-tech text-[10px] text-muted-foreground tracking-[0.3em]">PHASE 02</span>
          <span className="text-[9px] font-mono text-muted-foreground/60">{"///"}</span>
          <Tag type="ai" />
        </div>
        <h3 className="font-tech text-base md:text-lg text-foreground tracking-[0.1em] mb-2">
          {'FEASIBILITY STUDY & ARCHITECTURE'}
        </h3>
        <p className="text-xs font-mono text-muted-foreground leading-relaxed">
          {'AI consultation to validate the technical approach: RSS + AI filtering selected over scraping. API selection: OpenRouter \u2192 Gemini 2.0 Flash for processing, Notion API for storage. Output format and priority scoring system defined.'}
        </p>
      </PhaseCard>

      <Connector visible={visible} />

      {/* ===== PHASE 03 — Two parallel cards ===== */}
      <div
        className="w-full transition-all duration-700"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transitionDelay: "300ms",
        }}
      >
        <p className="text-center text-[9px] font-mono text-muted-foreground/50 tracking-[0.3em] uppercase mb-3">
          {'// Two parallel workstreams //'}
        </p>
        <div className="flex items-center gap-3 justify-center mb-3">
          <span className="font-tech text-[10px] text-muted-foreground tracking-[0.3em]">PHASE 03</span>
          <span className="text-[9px] font-mono text-muted-foreground/60">{"///"}</span>
          <Tag type="personal" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            className="relative rounded-lg bg-card/60 p-5 transition-all duration-300 hover:shadow-[0_0_20px_hsl(186_100%_50%/0.08)] group"
            style={{
              borderWidth: "3px 0 0 0",
              borderStyle: "solid",
              borderColor: "hsl(var(--alert-orange))",
              boxShadow: "inset 0 0 0 1px hsl(215 25% 22% / 0.3)",
            }}
          >
            <h4 className="font-tech text-sm text-accent tracking-[0.1em] mb-2">DASHBOARD SPECIFICATIONS</h4>
            <p className="text-[11px] font-mono text-muted-foreground leading-relaxed">
              Functional specs, UX, category filters, priority display, responsive layout.
            </p>
          </div>
          <div
            className="relative rounded-lg bg-card/60 p-5 transition-all duration-300 hover:shadow-[0_0_20px_hsl(186_100%_50%/0.08)] group"
            style={{
              borderWidth: "3px 0 0 0",
              borderStyle: "solid",
              borderColor: "hsl(var(--alert-orange))",
              boxShadow: "inset 0 0 0 1px hsl(215 25% 22% / 0.3)",
            }}
          >
            <h4 className="font-tech text-sm text-accent tracking-[0.1em] mb-2">PIPELINE SPECIFICATIONS</h4>
            <p className="text-[11px] font-mono text-muted-foreground leading-relaxed">
              RSS source list, AI filtering rules, CRON frequency, Notion DB structure.
            </p>
          </div>
        </div>
      </div>

      <Connector visible={visible} />

      {/* ===== PHASE 04 — Two parallel cards (AI) ===== */}
      <div
        className="w-full transition-all duration-700"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transitionDelay: "450ms",
        }}
      >
        <p className="text-center text-[9px] font-mono text-muted-foreground/50 tracking-[0.3em] uppercase mb-3">
          {'// AI-assisted development //'}
        </p>
        <div className="flex items-center gap-3 justify-center mb-3">
          <span className="font-tech text-[10px] text-muted-foreground tracking-[0.3em]">PHASE 04</span>
          <span className="text-[9px] font-mono text-muted-foreground/60">{"///"}</span>
          <Tag type="ai" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            className="relative rounded-lg bg-card/60 p-5 transition-all duration-300 hover:shadow-[0_0_20px_hsl(186_100%_50%/0.08)] group"
            style={{
              borderWidth: "3px 0 0 0",
              borderStyle: "solid",
              borderColor: "hsl(var(--neon-cyan))",
              boxShadow: "inset 0 0 0 1px hsl(215 25% 22% / 0.3)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-tech text-sm text-[hsl(var(--neon-cyan))] tracking-[0.1em]">DASHBOARD BUILD</h4>
              <span className="text-[8px] font-mono text-[hsl(var(--neon-cyan))]/70 border border-[hsl(var(--neon-cyan))]/30 px-1.5 py-0.5 rounded">
                {'v0.dev \u2192 Vercel'}
              </span>
            </div>
            <p className="text-[11px] font-mono text-muted-foreground leading-relaxed">
              Next.js 14, Netlify deployment, Notion API connection.
            </p>
          </div>
          <div
            className="relative rounded-lg bg-card/60 p-5 transition-all duration-300 hover:shadow-[0_0_20px_hsl(186_100%_50%/0.08)] group"
            style={{
              borderWidth: "3px 0 0 0",
              borderStyle: "solid",
              borderColor: "hsl(var(--neon-cyan))",
              boxShadow: "inset 0 0 0 1px hsl(215 25% 22% / 0.3)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-tech text-sm text-[hsl(var(--neon-cyan))] tracking-[0.1em]">PIPELINE BUILD</h4>
              <span className="text-[8px] font-mono text-[hsl(var(--neon-cyan))]/70 border border-[hsl(var(--neon-cyan))]/30 px-1.5 py-0.5 rounded">
                {'Claude \u2192 GitHub'}
              </span>
            </div>
            <p className="text-[11px] font-mono text-muted-foreground leading-relaxed">
              Python 3.11, GitHub Actions CRON, 2-pass AI filter.
            </p>
          </div>
        </div>
      </div>

      <Connector visible={visible} />

      {/* ===== PHASE 05 — Iteration Loop ===== */}
      <PhaseCard index={4} visible={visible} borderColor="hsl(var(--field-green))" dashed>
        <div className="flex items-center gap-3 mb-3">
          <span className="font-tech text-[10px] text-muted-foreground tracking-[0.3em]">PHASE 05</span>
          <span className="text-[9px] font-mono text-muted-foreground/60">{"///"}</span>
          <Tag type="collab" />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <RefreshCw className="w-4 h-4 text-[hsl(var(--field-green))]" />
          <h3 className="font-tech text-base md:text-lg text-foreground tracking-[0.1em]">ITERATION LOOP</h3>
        </div>
        <p className="text-xs font-mono text-muted-foreground leading-relaxed">
          {'Testing \u2192 Bug/limitation identification \u2192 Spec refinement \u2192 New AI prompt \u2192 Validation. Human oversight ensures quality at every iteration.'}
        </p>
      </PhaseCard>

      <Connector visible={visible} />

      {/* ===== PHASE 06 — Result ===== */}
      <div
        className="w-full transition-all duration-700"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transitionDelay: "750ms",
        }}
      >
        <div
          className="relative rounded-lg p-5 md:p-6 transition-all duration-300 hover:shadow-[0_0_25px_hsl(160_84%_39%/0.12)] group"
          style={{
            borderWidth: "0 0 0 3px",
            borderStyle: "solid",
            borderColor: "hsl(var(--field-green))",
            background: "hsl(160 84% 39% / 0.04)",
            boxShadow: "inset 0 0 0 1px hsl(160 84% 39% / 0.2)",
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="font-tech text-[10px] text-muted-foreground tracking-[0.3em]">PHASE 06</span>
            <span className="text-[9px] font-mono text-muted-foreground/60">{"///"}</span>
            <Tag type="collab" />
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-[hsl(var(--field-green))]" style={{ filter: "drop-shadow(0 0 6px hsl(160 84% 39%))" }} />
            <h3 className="font-tech text-base md:text-lg text-foreground tracking-[0.1em]">RESULT</h3>
          </div>

          {/* Status label */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[hsl(var(--field-green))]/40 rounded bg-[hsl(var(--field-green))]/10 mb-5">
            <Zap className="w-3 h-3 text-[hsl(var(--field-green))]" />
            <span className="text-[10px] font-mono text-[hsl(var(--field-green))] font-bold tracking-[0.15em]">
              {'PIPELINE OPERATIONAL \u2014 MISSION COMPLETE'}
            </span>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: "35+", label: "Sources" },
              { value: "6", label: "Regions" },
              { value: "06:00", label: "Daily UTC" },
              { value: "$1.17", label: "/month" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center p-3 rounded border border-[hsl(var(--field-green))]/20 bg-[hsl(var(--field-green))]/5"
              >
                <div className="font-tech text-xl md:text-2xl text-[hsl(var(--field-green))] font-bold leading-none mb-1">
                  {stat.value}
                </div>
                <div className="text-[8px] font-mono text-muted-foreground tracking-[0.2em] uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
