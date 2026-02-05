"use client"

import { useState, useEffect } from "react"
import {
  X,
  Crosshair,
  Globe,
  ShieldCheck,
  FileText,
  Download,
  AlertTriangle,
  Activity,
  FileWarning,
} from "lucide-react"

interface StrategyPanelProps {
  open: boolean
  onClose: () => void
}

export function StrategyPanel({ open, onClose }: StrategyPanelProps) {
  const [phase, setPhase] = useState<"intro" | "dashboard">("intro")
  const [introStep, setIntroStep] = useState(0)
  const [dashVisible, setDashVisible] = useState(false)

  useEffect(() => {
    if (!open) {
      setPhase("intro")
      setIntroStep(0)
      setDashVisible(false)
      return
    }

    // Intro sequence
    const t1 = setTimeout(() => setIntroStep(1), 300)
    const t2 = setTimeout(() => setIntroStep(2), 900)
    const t3 = setTimeout(() => setIntroStep(3), 1500)
    const t4 = setTimeout(() => {
      setPhase("dashboard")
      setTimeout(() => setDashVisible(true), 50)
    }, 2800)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-background">
      {/* Intro screen */}
      {phase === "intro" && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background overflow-hidden">
          {/* Grid background */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(hsl(186 100% 50% / 0.1) 1px, transparent 1px), linear-gradient(90deg, hsl(186 100% 50% / 0.1) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />

          {/* Globe-like element */}
          <div className="relative flex flex-col items-center gap-6">
            {/* Spinning rings */}
            <div className="relative w-40 h-40 md:w-52 md:h-52">
              <div
                className="absolute inset-0 rounded-full border border-[hsl(var(--neon-cyan))]/20"
                style={{ animation: "orbit-spin 12s linear infinite" }}
              >
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[hsl(var(--neon-cyan))] shadow-[0_0_12px_hsl(186_100%_50%)]" />
              </div>
              <div
                className="absolute inset-4 rounded-full border border-dashed border-[hsl(var(--neon-cyan))]/15"
                style={{ animation: "orbit-reverse 8s linear infinite" }}
              />
              <div className="absolute inset-8 rounded-full border border-[hsl(var(--neon-cyan))]/10 flex items-center justify-center">
                <div className="relative">
                  <Crosshair
                    className={`w-12 h-12 text-[hsl(var(--neon-cyan))] transition-all duration-700 ${introStep >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
                  />
                  {introStep >= 2 && (
                    <div className="absolute inset-0 rounded-full border border-[hsl(var(--neon-cyan))]/40 animate-ping" />
                  )}
                </div>
              </div>
              {/* Glow */}
              <div className="absolute inset-0 rounded-full bg-[hsl(var(--neon-cyan))]/5 blur-3xl" />
            </div>

            {/* Text */}
            <div
              className={`text-center transition-all duration-700 ${introStep >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <p className="text-[10px] font-mono text-[hsl(var(--neon-cyan))] tracking-[0.3em] mb-2">
                ACQUIRING TARGET...
              </p>
              <p
                className={`text-xs font-mono text-[hsl(var(--neon-cyan))] font-bold tracking-wider transition-all duration-700 ${introStep >= 2 ? "opacity-100" : "opacity-0"}`}
              >
                MUMBAI HQ, INDIA
              </p>
              <p
                className={`text-[9px] font-mono text-muted-foreground mt-1 transition-all duration-500 ${introStep >= 2 ? "opacity-100" : "opacity-0"}`}
              >
                LAT: 19.07N | LONG: 72.87E
              </p>
            </div>

            <p
              className={`text-[10px] font-mono text-accent tracking-[0.25em] transition-all duration-500 ${introStep >= 3 ? "opacity-100" : "opacity-0"}`}
            >
              OPERATION: BLUE OCEAN
            </p>
          </div>

          {/* Skip button */}
          <button
            type="button"
            onClick={() => {
              setPhase("dashboard")
              setTimeout(() => setDashVisible(true), 50)
            }}
            className="absolute bottom-8 text-[9px] font-mono text-muted-foreground hover:text-foreground transition-colors tracking-[0.2em]"
          >
            [ SKIP ]
          </button>
        </div>
      )}

      {/* Dashboard */}
      {phase === "dashboard" && (
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Top KPI bar */}
          <header
            className={`h-12 md:h-14 border-b border-border/50 bg-card/40 backdrop-blur-md flex items-center px-4 md:px-6 justify-between shrink-0 z-40 transition-all duration-700 ${dashVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}
          >
            <div className="flex items-center gap-4 md:gap-6 text-xs font-mono">
              <div className="flex flex-col">
                <span className="text-muted-foreground text-[8px] uppercase tracking-wider">FY 2024 Revenue</span>
                <span className="text-foreground font-bold text-[11px]">
                  {"82.1M (+13%)"}
                </span>
              </div>
              <div className="w-px h-7 bg-border/50 hidden sm:block" />
              <div className="hidden sm:flex flex-col">
                <span className="text-muted-foreground text-[8px] uppercase tracking-wider">Net Result</span>
                <span className="text-red-500 font-bold text-[11px]">
                  {"-3.96M"}
                </span>
              </div>
              <div className="w-px h-7 bg-border/50 hidden md:block" />
              <div className="hidden md:flex flex-col">
                <span className="text-muted-foreground text-[8px] uppercase tracking-wider">Gross Margin</span>
                <span className="text-accent font-bold text-[11px] animate-pulse">15.7% (CRITICAL)</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 bg-red-600 hover:bg-foreground text-white hover:text-background font-bold text-[10px] px-4 py-2 transition-all uppercase tracking-[0.15em] shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] rounded-sm group"
            >
              <X className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-300" />
              <span className="hidden sm:inline">CLOSE MISSION</span>
            </button>
          </header>

          {/* Dashboard grid */}
          <div className="flex-1 p-3 md:p-5 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 overflow-y-auto">
            {/* LEFT COLUMN: Asymmetric Warfare */}
            <div className="col-span-12 md:col-span-3 flex flex-col gap-3">
              <div
                className={`flex-1 flex flex-col bg-card/50 backdrop-blur-md border border-red-500/30 rounded-lg overflow-hidden shadow-[0_0_20px_rgba(239,68,68,0.08)] transition-all duration-700 ${dashVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionDelay: "100ms" }}
              >
                {/* Header */}
                <div className="p-3 border-b border-red-500/20 bg-gradient-to-r from-red-900/20 to-transparent flex justify-between items-center shrink-0">
                  <span className="text-red-500 font-bold font-mono text-[9px] uppercase tracking-wider flex items-center gap-2">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
                    </span>
                    ASYMMETRIC WARFARE
                  </span>
                  <span className="text-[7px] text-red-500/60 font-mono border border-red-500/30 px-1 rounded">
                    DEFCON 1
                  </span>
                </div>

                {/* Financial comparison */}
                <div className="px-3 pt-3 pb-2">
                  <div className="mb-3">
                    <div className="flex justify-between text-[7px] font-mono mb-1">
                      <span className="text-muted-foreground">FINANCIAL FIREPOWER</span>
                      <span className="text-red-500">EFG (SAUDI PIF)</span>
                    </div>
                    <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden flex">
                      <div className="bg-primary h-full w-[5%]" />
                      <div className="bg-red-600 h-full w-[95%] shadow-[0_0_10px_#ef4444]" />
                    </div>
                    <div className="flex justify-between text-[6px] font-mono mt-1 text-muted-foreground">
                      <span>{"BLAST (11M Cash)"}</span>
                      <span>{"EFG ($1.5Bn Val)"}</span>
                    </div>
                  </div>

                  {/* Metrics table */}
                  <div className="bg-secondary/50 rounded p-2 border border-border/50">
                    <div className="flex justify-between text-[7px] font-mono text-muted-foreground mb-1 border-b border-border/50 pb-1">
                      <span>METRIC</span>
                      <span>STATUS</span>
                    </div>
                    <div className="flex justify-between text-[8px] font-mono text-foreground/80 mb-0.5">
                      <span>{"Margin '24"}</span>
                      <span className="text-red-500 font-bold">{"15.7% (\u2193)"}</span>
                    </div>
                    <div className="flex justify-between text-[8px] font-mono text-foreground/80">
                      <span>Net Loss</span>
                      <span className="text-red-500">{"-3.96M"}</span>
                    </div>
                  </div>
                </div>

                {/* Threat cards */}
                <div className="px-3 pb-3 flex-1 flex flex-col gap-3 overflow-y-auto">
                  <ThreatCard
                    tag="THREAT: DAVID VS GOLIATH 2.0"
                    tagColor="red"
                    title="Resource Asymmetry"
                    desc='Cannot win a price war. EFG (ESL) dominates volume & vertical integration. BLAST&apos;s "Boutique" model faces cost inflation limits.'
                  />
                  <ThreatCard
                    tag="REGULATION: VALVE 2025"
                    tagColor="orange"
                    title='End of "Partner Leagues"'
                    desc='Ban on franchised leagues kills the "Louvre Agreement". BLAST loses its main competitive barrier (guaranteed Tier 1 teams).'
                  />
                  <ThreatCard
                    tag="OPPORTUNITY: BLUE OCEAN"
                    tagColor="cyan"
                    title="Virgin Market Access"
                    desc="Joint Venture with Reliance to access 600M Indian gamers. Bypassing EFG's saturation in the West through a mobile-first ecosystem."
                  />
                </div>

                {/* Source footer */}
                <div className="p-2.5 bg-red-950/20 border-t border-red-500/20 mt-auto shrink-0">
                  <div className="flex gap-2 items-start">
                    <FileWarning className="w-3 h-3 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-[8px] font-bold text-red-400 uppercase tracking-wider">
                        Source: Dossier BLAST
                      </h5>
                      <p className="text-[8px] text-muted-foreground font-mono leading-tight">
                        Analysis based on 2024 Financials & 2025 Strategic Outlook. Confidential Academic Analysis.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CENTER COLUMN: Operation Blue Ocean */}
            <div className="col-span-12 md:col-span-6 flex flex-col gap-3">
              {/* Title bar */}
              <div
                className={`bg-[hsl(var(--neon-cyan))]/5 border border-[hsl(var(--neon-cyan))]/20 rounded-lg p-3 flex items-center justify-between transition-all duration-700 ${dashVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionDelay: "250ms" }}
              >
                <h2 className="text-lg md:text-xl font-tech text-foreground uppercase tracking-[0.15em]">
                  OPERATION{" "}
                  <span className="text-[hsl(var(--neon-cyan))]">BLUE OCEAN</span>
                </h2>
                <div className="flex gap-2">
                  <span className="border border-[hsl(var(--neon-cyan))] text-[hsl(var(--neon-cyan))] text-[8px] font-bold px-2 py-0.5 rounded">
                    EXPANSION
                  </span>
                  <span className="bg-[hsl(var(--neon-cyan))] text-background text-[8px] font-bold px-2 py-0.5 rounded">
                    MOBILE FIRST
                  </span>
                </div>
              </div>

              {/* Main strategic card */}
              <div
                className={`flex-1 flex flex-col bg-card/50 backdrop-blur-md border border-[hsl(var(--neon-cyan))]/25 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.06)] transition-all duration-700 ${dashVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionDelay: "350ms" }}
              >
                {/* Geo Map area */}
                <div className="relative h-40 md:h-48 w-full border-b border-border/30 overflow-hidden bg-card/80">
                  {/* Dot grid */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: "radial-gradient(hsl(215 25% 30%) 1px, transparent 1px)",
                      backgroundSize: "10px 10px",
                    }}
                  />

                  {/* Simplified world map silhouette via SVG */}
                  <svg
                    viewBox="0 0 1000 450"
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    preserveAspectRatio="xMidYMid slice"
                    aria-hidden="true"
                  >
                    <g transform="translate(0, 20)">
                      <path
                        d="M 70 60 C 70 60 150 40 280 40 C 320 40 300 120 250 160 C 230 180 200 170 180 140 C 150 120 70 100 70 60"
                        fill="hsl(215 25% 22% / 0.3)"
                        stroke="hsl(215 25% 30%)"
                        strokeWidth="1"
                      />
                      <path
                        d="M 260 170 L 320 180 L 300 320 L 260 280 Z"
                        fill="hsl(215 25% 22% / 0.3)"
                        stroke="hsl(215 25% 30%)"
                        strokeWidth="1"
                      />
                      <path
                        d="M 430 70 L 550 60 L 650 60 L 850 60 L 900 100 L 850 180 L 780 220 L 720 280 L 680 300 L 600 350 L 520 300 L 450 150 L 420 120 Z"
                        fill="hsl(215 25% 22% / 0.3)"
                        stroke="hsl(215 25% 30%)"
                        strokeWidth="1"
                      />
                      <path
                        d="M 800 300 L 900 300 L 900 380 L 800 380 Z"
                        fill="hsl(215 25% 22% / 0.3)"
                        stroke="hsl(215 25% 30%)"
                        strokeWidth="1"
                      />
                    </g>
                  </svg>

                  {/* India target glow */}
                  <div className="absolute top-[38%] left-[72%] w-20 h-20 bg-[hsl(var(--neon-cyan))]/10 rounded-full blur-xl animate-pulse -translate-x-1/2 -translate-y-1/2" />
                  <div className="absolute top-[38%] left-[72%] w-3 h-3 bg-[hsl(var(--neon-cyan))] rounded-full shadow-[0_0_15px_hsl(186_100%_50%)] animate-ping -translate-x-1/2 -translate-y-1/2" />
                  <div
                    className="absolute top-[38%] left-[72%] w-14 h-14 border border-[hsl(var(--neon-cyan))]/30 rounded-full -translate-x-1/2 -translate-y-1/2"
                    style={{ animation: "orbit-spin 10s linear infinite" }}
                  />

                  {/* Connection line */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
                    <line
                      x1="48%"
                      y1="30%"
                      x2="72%"
                      y2="38%"
                      stroke="hsl(186 100% 50%)"
                      strokeWidth="1"
                      strokeOpacity="0.4"
                      strokeDasharray="4 4"
                    />
                  </svg>

                  {/* India label */}
                  <div className="absolute top-[22%] right-[12%] bg-card/90 border border-[hsl(var(--neon-cyan))]/50 px-2 py-1 backdrop-blur-sm shadow-[0_0_15px_rgba(0,240,255,0.15)] rounded-sm">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-[hsl(var(--neon-cyan))] rounded-full animate-pulse" />
                      <span className="text-[7px] text-[hsl(var(--neon-cyan))] font-mono font-bold tracking-wider">
                        TARGET: 600M USERS
                      </span>
                    </div>
                    <div className="h-px w-full bg-[hsl(var(--neon-cyan))]/30 my-0.5" />
                    <span className="text-[6px] text-muted-foreground font-mono">GROWTH: +19% CAGR</span>
                  </div>

                  {/* Europe label */}
                  <div className="absolute top-[20%] left-[38%] bg-card/80 border border-border/30 px-2 py-1 backdrop-blur-sm rounded-sm">
                    <span className="text-[7px] text-muted-foreground font-mono tracking-wider">
                      EUROPE: SATURATED
                    </span>
                  </div>
                </div>

                {/* Strategic pivot text */}
                <div className="p-4 relative z-10">
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="text-[hsl(var(--neon-cyan))] font-bold font-mono text-[10px] tracking-wider">
                      {">"} STRATEGIC PIVOT: INDIA
                    </span>
                    <Globe className="w-5 h-5 text-[hsl(var(--neon-cyan))]" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-tech text-foreground uppercase tracking-tight mb-1.5">
                    {"FROM \"BOUTIQUE\" TO \"MASS PREMIUM\""}
                  </h3>
                  <p className="text-[10px] text-muted-foreground max-w-lg leading-relaxed">
                    Bypassing EFG{"'"}s Western saturation via a{" "}
                    <strong className="text-foreground">Joint Venture with Reliance (April 2025)</strong>.
                    Deploying a Mobile-First ecosystem for 600M gamers.
                  </p>
                </div>

                {/* KPI grid + Net Loss chart */}
                <div className="p-4 pt-0 grid grid-cols-12 gap-4 relative z-10 flex-1">
                  <div className="col-span-12 md:col-span-8 grid grid-cols-2 gap-2">
                    <KPICard label="MARKET CAGR" value="19%" sub="$9.2Bn by 2029" color="cyan" />
                    <KPICard label="TARGET AUDIENCE" value="600M" sub="Mobile Gamers" color="white" />
                    <KPICard label="DISTRIBUTION" value="480M" sub="JioGames Subscribers" color="green" />
                    <KPICard label="COST STRUCTURE" value="-80%" sub="Vs European Prod." color="orange" />
                  </div>

                  <div className="col-span-12 md:col-span-4 flex flex-col justify-end border-l border-border/30 md:pl-4 gap-1.5">
                    <span className="text-[8px] text-muted-foreground uppercase text-right font-mono">
                      NET LOSS REDUCTION
                    </span>
                    <div className="flex items-end gap-2 h-20 w-full pb-1 border-b border-border/30">
                      <div className="w-1/3 bg-red-900/40 h-[80%] relative group border-t border-red-500 rounded-t-sm">
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] bg-card px-1 border border-border whitespace-nowrap font-mono rounded-sm">
                          {"-3.96M (2024)"}
                        </div>
                      </div>
                      <div className="w-1/3 bg-[hsl(var(--field-green))]/20 h-[40%] relative group border-t border-[hsl(var(--field-green))]/50 rounded-t-sm">
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] bg-card px-1 border border-border whitespace-nowrap font-mono rounded-sm">
                          {"-2.0M (2026)"}
                        </div>
                      </div>
                      <div className="w-1/3 bg-[hsl(var(--field-green))] h-[5%] relative group border-t border-[hsl(var(--field-green))] rounded-t-sm">
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] bg-card px-1 border border-border whitespace-nowrap font-mono rounded-sm">
                          BREAKEVEN (2027)
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between text-[7px] text-muted-foreground font-mono">
                      <span>2024</span>
                      <span>2026</span>
                      <span>2027</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Download dossier */}
              <a
                href="assets/blast-case-study.pdf"
                download
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 bg-card/50 backdrop-blur-md border border-[hsl(var(--neon-cyan))]/20 border-l-2 border-l-[hsl(var(--neon-cyan))] rounded-lg p-3 hover:bg-[hsl(var(--neon-cyan))]/5 transition-all group ${dashVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionDelay: "450ms", transition: "all 0.7s cubic-bezier(0.2, 1, 0.3, 1)" }}
              >
                <div className="h-8 w-8 rounded bg-[hsl(var(--neon-cyan))]/10 flex items-center justify-center group-hover:bg-[hsl(var(--neon-cyan))]/20 transition-colors">
                  <FileText className="w-4 h-4 text-[hsl(var(--neon-cyan))]" />
                </div>
                <div>
                  <p className="text-foreground font-bold font-mono text-[9px]">
                    {">"} ACCESS FULL DOSSIER
                  </p>
                  <p className="text-[8px] text-[hsl(var(--neon-cyan))]/70">
                    {"\"David vs Goliath 2.0\" Strategy (PDF)"}
                  </p>
                </div>
                <Download className="w-4 h-4 text-[hsl(var(--neon-cyan))] ml-auto opacity-40 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>

            {/* RIGHT COLUMN: Execution Roadmap */}
            <div className="col-span-12 md:col-span-3 flex flex-col gap-3">
              <div
                className={`flex-1 flex flex-col bg-card/50 backdrop-blur-md border border-border/40 rounded-lg overflow-hidden transition-all duration-700 ${dashVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionDelay: "500ms" }}
              >
                {/* Header */}
                <div className="p-3 border-b border-border/40 flex justify-between items-center bg-card/30 shrink-0">
                  <h3 className="text-foreground uppercase font-tech text-sm flex items-center gap-2">
                    Execution Roadmap
                    <Activity className="w-3 h-3 text-[hsl(var(--neon-cyan))] animate-pulse" />
                  </h3>
                  <div className="flex flex-col items-end">
                    <span className="text-[8px] font-mono text-muted-foreground">ID: BLAST_2027</span>
                    <span className="text-[7px] font-mono text-[hsl(var(--neon-cyan))]">LIVE</span>
                  </div>
                </div>

                {/* Timeline */}
                <div className="relative space-y-4 p-3 flex-1 overflow-y-auto">
                  {/* Vertical line */}
                  <div className="absolute left-[22px] top-3 bottom-3 w-px bg-gradient-to-b from-[hsl(var(--neon-cyan))] via-border to-transparent" />

                  <RoadmapPhase
                    phase="PHASE 1: H1 2026"
                    tag="INDIA LAUNCH"
                    title="INFRASTRUCTURE"
                    active
                    details={[
                      { label: "Studio", value: "Local Prod." },
                      { label: "Partners", value: "Jio / Paytm" },
                    ]}
                    actions={[
                      { label: "Action:", value: "Mobile Test Event" },
                      { label: "Cost:", value: "-5% Ops Logistics", highlight: true },
                    ]}
                  />

                  <RoadmapPhase
                    phase="PHASE 2: H2 2026"
                    tag="MONETIZATION"
                    title="D2C & GAMIFICATION"
                    details={[
                      { label: "Feature", value: "Fantasy Live" },
                      { label: "Model", value: "Watch-to-Earn" },
                    ]}
                    actions={[
                      { label: "Target:", value: "\u2191 ARPU +50%", highlight: true },
                      { label: "KPI:", value: "10k Transacs" },
                    ]}
                  />

                  <RoadmapPhase
                    phase="PHASE 3: 2027"
                    tag=""
                    title="PROFITABILITY"
                    dimmed
                    actions={[
                      { label: "Goal:", value: "BREAK-EVEN", highlight: true },
                      { label: "Mix:", value: "Europe 60% / India 20%" },
                    ]}
                  />
                </div>

                {/* CSR footer */}
                <div className="p-2.5 bg-[hsl(var(--field-green))]/5 border-t border-[hsl(var(--field-green))]/20 mt-auto shrink-0">
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck className="w-3 h-3 text-[hsl(var(--field-green))]" />
                    <span className="text-[8px] font-bold text-[hsl(var(--field-green))] uppercase tracking-[0.15em]">
                      CSR DIFFERENTIATION
                    </span>
                  </div>
                  <p className="text-[7px] text-muted-foreground font-mono leading-tight">
                    Leveraging &quot;Brand Safety Shield&quot; to attract Western sponsors subject to CSRD,
                    avoiding EFG{"'"}s reputational risks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------- Sub-components ---------- */

function ThreatCard({
  tag,
  tagColor,
  title,
  desc,
}: {
  tag: string
  tagColor: "red" | "orange" | "cyan"
  title: string
  desc: string
}) {
  const borderColors = {
    red: "border-red-500",
    orange: "border-accent",
    cyan: "border-[hsl(var(--neon-cyan))]",
  }
  const tagBg = {
    red: "bg-red-500/15 text-red-400 hover:bg-red-500 hover:text-background",
    orange: "bg-accent/15 text-accent hover:bg-accent hover:text-background",
    cyan: "bg-[hsl(var(--neon-cyan))]/15 text-[hsl(var(--neon-cyan))] hover:bg-[hsl(var(--neon-cyan))] hover:text-background",
  }

  return (
    <div className={`relative pl-3 border-l-2 ${borderColors[tagColor]} group`}>
      <span
        className={`text-[7px] ${tagBg[tagColor]} px-1 rounded mb-1 inline-block font-mono font-bold transition-colors cursor-default`}
      >
        {tag}
      </span>
      <h4 className="text-foreground font-bold text-[11px] uppercase mb-0.5">{title}</h4>
      <p className="text-[9px] text-muted-foreground leading-tight">{desc}</p>
    </div>
  )
}

function KPICard({
  label,
  value,
  sub,
  color,
}: {
  label: string
  value: string
  sub: string
  color: "cyan" | "white" | "green" | "orange"
}) {
  const valueColor = {
    cyan: "text-[hsl(var(--neon-cyan))]",
    white: "text-foreground",
    green: "text-[hsl(var(--field-green))]",
    orange: "text-accent",
  }
  const borderStyle = color === "cyan" ? "border-[hsl(var(--neon-cyan))]/25" : "border-border/40"

  return (
    <div
      className={`bg-card/80 p-2 border ${borderStyle} rounded backdrop-blur-sm group hover:bg-[hsl(var(--neon-cyan))]/5 transition-colors`}
    >
      <div className="text-[7px] text-muted-foreground uppercase tracking-[0.15em] mb-0.5">{label}</div>
      <div className={`text-xl font-tech ${valueColor[color]} group-hover:scale-105 transition-transform origin-left`}>
        {value}
      </div>
      <div className="text-[7px] text-muted-foreground">{sub}</div>
    </div>
  )
}

function RoadmapPhase({
  phase,
  tag,
  title,
  active,
  dimmed,
  details,
  actions,
}: {
  phase: string
  tag: string
  title: string
  active?: boolean
  dimmed?: boolean
  details?: { label: string; value: string }[]
  actions?: { label: string; value: string; highlight?: boolean }[]
}) {
  return (
    <div className={`relative pl-6 group ${dimmed ? "opacity-60" : ""}`}>
      {/* Dot */}
      <div
        className={`absolute left-[-1px] top-1.5 w-2 h-2 rounded-full ring-2 ring-background ${
          active
            ? "bg-[hsl(var(--neon-cyan))] shadow-[0_0_8px_hsl(186_100%_50%)]"
            : dimmed
              ? "bg-secondary border border-border/30"
              : "bg-muted-foreground/40 border border-foreground/20"
        }`}
      />

      <div className="flex justify-between items-baseline mb-1 border-b border-border/30 pb-1">
        <span className={`text-[9px] font-bold font-mono ${active ? "text-[hsl(var(--neon-cyan))]" : "text-foreground"}`}>
          {phase}
        </span>
        {tag && (
          <span className="text-[7px] text-muted-foreground font-mono bg-secondary/50 px-1 rounded">
            {tag}
          </span>
        )}
      </div>
      <div className="text-[11px] text-foreground font-bold mb-1">{title}</div>

      {details && (
        <div className="grid grid-cols-2 gap-1.5 mb-1.5">
          {details.map((d) => (
            <div key={d.label} className="bg-card/60 p-1 rounded border border-border/30">
              <div className="text-[7px] text-muted-foreground uppercase">{d.label}</div>
              <div className="text-[8px] text-foreground/80 font-mono">{d.value}</div>
            </div>
          ))}
        </div>
      )}

      {actions && (
        <ul className="text-[8px] text-muted-foreground font-mono space-y-0.5 pl-1">
          {actions.map((a) => (
            <li key={a.label} className="flex justify-between">
              <span>{">"} {a.label}</span>
              <span className={a.highlight ? "text-[hsl(var(--neon-cyan))] font-bold" : "text-foreground"}>
                {a.value}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
