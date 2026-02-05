"use client"

import React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  X,
  Crosshair,
  Globe,
  ShieldCheck,
  FileText,
  Download,
  AlertTriangle,
  Activity,
  TrendingUp,
  Zap,
  Target,
  Users,
  DollarSign,
  ChevronRight,
  Smartphone,
} from "lucide-react"

/* ================================================================
   STRATEGY PANEL  -  Full-screen immersive mission briefing
   ================================================================ */

interface StrategyPanelProps {
  open: boolean
  onClose: () => void
}

/* ---------- Animated counter hook ---------- */
function useCountUp(end: number, duration: number, start: boolean, suffix = "") {
  const [val, setVal] = useState("0")
  useEffect(() => {
    if (!start) { setVal("0"); return }
    let raf: number
    const t0 = performance.now()
    const tick = (now: number) => {
      const elapsed = now - t0
      const p = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(end * eased).toLocaleString() + suffix)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [end, duration, start, suffix])
  return val
}

export function StrategyPanel({ open, onClose }: StrategyPanelProps) {
  const [phase, setPhase] = useState<"intro" | "brief">("intro")
  const [introStep, setIntroStep] = useState(0)
  const [briefReady, setBriefReady] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  /* Reset on close */
  useEffect(() => {
    if (!open) {
      setPhase("intro")
      setIntroStep(0)
      setBriefReady(false)
      return
    }
    const t1 = setTimeout(() => setIntroStep(1), 200)
    const t2 = setTimeout(() => setIntroStep(2), 700)
    const t3 = setTimeout(() => setIntroStep(3), 1300)
    const t4 = setTimeout(() => setIntroStep(4), 2000)
    const t5 = setTimeout(() => {
      setPhase("brief")
      setTimeout(() => setBriefReady(true), 80)
    }, 2800)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5) }
  }, [open])

  /* Escape to close */
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, onClose])

  const skipIntro = useCallback(() => {
    setPhase("brief")
    setTimeout(() => setBriefReady(true), 80)
  }, [])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] bg-background overflow-hidden">
      {/* ========== INTRO SEQUENCE ========== */}
      {phase === "intro" && (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          {/* Radar grid */}
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle at 50% 50%, hsl(186 100% 50% / 0.03) 0%, transparent 70%), linear-gradient(hsl(186 100% 50% / 0.06) 1px, transparent 1px), linear-gradient(90deg, hsl(186 100% 50% / 0.06) 1px, transparent 1px)",
            backgroundSize: "100% 100%, 60px 60px, 60px 60px",
          }} />

          <div className="relative flex flex-col items-center gap-8">
            {/* Radar dish */}
            <div className="relative w-48 h-48 md:w-56 md:h-56">
              {/* Sweep */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div className="absolute inset-0" style={{
                  background: "conic-gradient(from 0deg, transparent 0deg, hsl(186 100% 50% / 0.15) 30deg, transparent 60deg)",
                  animation: "radar-sweep 3s linear infinite",
                }} />
              </div>
              {/* Concentric rings */}
              <div className="absolute inset-0 rounded-full border border-[hsl(var(--neon-cyan))]/10" />
              <div className="absolute inset-6 rounded-full border border-[hsl(var(--neon-cyan))]/8" />
              <div className="absolute inset-12 rounded-full border border-[hsl(var(--neon-cyan))]/6" />
              <div className="absolute inset-[4.5rem] rounded-full border border-[hsl(var(--neon-cyan))]/15 flex items-center justify-center">
                <Crosshair className={`w-10 h-10 text-[hsl(var(--neon-cyan))] transition-all duration-500 ${introStep >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-50"}`} />
              </div>
              {/* Blips */}
              <div className={`absolute top-[25%] left-[70%] w-1.5 h-1.5 rounded-full bg-accent transition-all duration-300 ${introStep >= 2 ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}>
                <div className="absolute inset-0 rounded-full bg-accent animate-ping" />
              </div>
              <div className={`absolute top-[60%] left-[20%] w-1 h-1 rounded-full bg-red-500 transition-all duration-300 ${introStep >= 3 ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}>
                <div className="absolute inset-0 rounded-full bg-red-500 animate-ping" style={{ animationDelay: "0.5s" }} />
              </div>
              {/* Glow */}
              <div className="absolute inset-0 rounded-full bg-[hsl(var(--neon-cyan))]/5 blur-3xl" />
            </div>

            {/* Text sequence */}
            <div className="text-center space-y-2">
              <p className={`text-[10px] font-mono text-[hsl(var(--neon-cyan))]/70 tracking-[0.4em] transition-all duration-500 ${introStep >= 1 ? "opacity-100" : "opacity-0"}`}>
                SCANNING THREAT LANDSCAPE
              </p>
              <p className={`text-sm md:text-base font-tech text-foreground tracking-[0.2em] transition-all duration-500 ${introStep >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
                OPERATION <span className="text-[hsl(var(--neon-cyan))]">BLUE OCEAN</span>
              </p>
              <p className={`text-[10px] font-mono text-muted-foreground transition-all duration-500 ${introStep >= 3 ? "opacity-100" : "opacity-0"}`}>
                BLAST.tv Strategic Audit // CLASSIFIED
              </p>
              <div className={`flex items-center justify-center gap-3 pt-2 transition-all duration-500 ${introStep >= 4 ? "opacity-100" : "opacity-0"}`}>
                <span className="text-[8px] font-mono text-accent tracking-wider">THREAT LEVEL: HIGH</span>
                <span className="w-1 h-1 rounded-full bg-accent animate-pulse" />
                <span className="text-[8px] font-mono text-muted-foreground tracking-wider">MUMBAI HQ // 19.07N 72.87E</span>
              </div>
            </div>
          </div>

          <button type="button" onClick={skipIntro} className="absolute bottom-8 text-[9px] font-mono text-muted-foreground hover:text-foreground transition-colors tracking-[0.2em]">
            [ SKIP ]
          </button>
        </div>
      )}

      {/* ========== MISSION BRIEFING ========== */}
      {phase === "brief" && (
        <div className="flex flex-col h-full">
          {/* Sticky top bar */}
          <header className={`h-11 border-b border-border/50 bg-card/60 backdrop-blur-xl flex items-center px-4 md:px-6 justify-between shrink-0 z-50 transition-all duration-700 ${briefReady ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}>
            <div className="flex items-center gap-2">
              <Crosshair className="w-3.5 h-3.5 text-accent" />
              <span className="text-[10px] font-tech text-foreground tracking-[0.15em] hidden sm:inline">STRATEGY</span>
              <span className="text-[8px] font-mono text-accent tracking-wider">// OPERATION BLUE OCEAN</span>
            </div>
            <button type="button" onClick={onClose} className="flex items-center gap-1.5 text-[9px] font-mono text-muted-foreground hover:text-foreground border border-border/50 hover:border-foreground/30 px-3 py-1.5 rounded transition-all group">
              <X className="w-3 h-3 group-hover:rotate-90 transition-transform duration-300" />
              <span className="hidden sm:inline tracking-wider">CLOSE</span>
            </button>
          </header>

          {/* Scrollable content */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto">
            <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10 space-y-8 md:space-y-12">

              {/* ---- SECTION 1: THE SITUATION ---- */}
              <SectionBlock title="SITUATION ASSESSMENT" icon={AlertTriangle} iconColor="text-red-500" delay={100} ready={briefReady}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Financials headline */}
                  <div className="md:col-span-2 space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      BLAST.tv faces a <strong className="text-red-400">critical asymmetry</strong> against EFG (Saudi PIF-backed ESL). With $11M cash reserves versus EFG{"'"}s $1.5Bn valuation, a direct Western confrontation is unwinnable. The &quot;Louvre Agreement&quot; barrier is collapsing under Valve{"'"}s 2025 regulation banning franchised partner leagues.
                    </p>

                    {/* Financial bars */}
                    <div className="bg-card/80 border border-red-500/20 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-mono text-red-400 tracking-wider flex items-center gap-1.5">
                          <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" /></span>
                          FINANCIAL FIREPOWER
                        </span>
                        <span className="text-[7px] text-red-500/60 font-mono border border-red-500/30 px-1.5 py-0.5 rounded">DEFCON 1</span>
                      </div>
                      <BarCompare label1="BLAST (11M Cash)" pct1={5} color1="bg-primary" label2="EFG ($1.5Bn Val)" pct2={95} color2="bg-red-600" />
                      <div className="grid grid-cols-3 gap-2 pt-1">
                        <MetricPill label="REVENUE FY24" value="82.1M" change="+13%" changeColor="text-[hsl(var(--field-green))]" />
                        <MetricPill label="NET RESULT" value="-3.96M" change="" changeColor="text-red-500" negative />
                        <MetricPill label="GROSS MARGIN" value="15.7%" change="CRITICAL" changeColor="text-accent" />
                      </div>
                    </div>
                  </div>

                  {/* Threat cards */}
                  <div className="space-y-3">
                    <ThreatCard icon={<Zap className="w-3.5 h-3.5" />} tag="THREAT" color="red" title="David vs Goliath 2.0" desc='Cannot win a price war. EFG dominates volume & vertical integration. BLAST&apos;s "Boutique" model faces cost inflation limits.' />
                    <ThreatCard icon={<AlertTriangle className="w-3.5 h-3.5" />} tag="REGULATION" color="orange" title="Valve 2025 Ban" desc='End of franchised "Partner Leagues" kills the Louvre Agreement. BLAST loses its main competitive barrier.' />
                    <ThreatCard icon={<Globe className="w-3.5 h-3.5" />} tag="OPPORTUNITY" color="cyan" title="Blue Ocean Access" desc="JV with Reliance to access 600M Indian gamers. Bypassing EFG's Western saturation via mobile-first." />
                  </div>
                </div>
              </SectionBlock>

              {/* ---- SECTION 2: THE PIVOT ---- */}
              <SectionBlock title="STRATEGIC PIVOT: INDIA" icon={Globe} iconColor="text-[hsl(var(--neon-cyan))]" delay={200} ready={briefReady}>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  {/* Map */}
                  <div className="lg:col-span-3 relative bg-card/50 border border-[hsl(var(--neon-cyan))]/15 rounded-lg overflow-hidden h-64 md:h-80">
                    {/* Dot grid bg */}
                    <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "radial-gradient(hsl(215 25% 40%) 1px, transparent 1px)", backgroundSize: "12px 12px" }} />

                    {/* World map SVG */}
                    <svg viewBox="0 0 1000 450" className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                      <g transform="translate(0, 20)">
                        {/* North America */}
                        <path d="M 70 60 C 70 60 150 40 280 40 C 320 40 300 120 250 160 C 230 180 200 170 180 140 C 150 120 70 100 70 60" fill="hsl(215 25% 18% / 0.5)" stroke="hsl(215 25% 30%)" strokeWidth="0.8" />
                        {/* South America */}
                        <path d="M 260 170 L 320 180 L 300 320 L 260 280 Z" fill="hsl(215 25% 18% / 0.5)" stroke="hsl(215 25% 30%)" strokeWidth="0.8" />
                        {/* Eurasia */}
                        <path d="M 430 70 L 550 60 L 650 60 L 850 60 L 900 100 L 850 180 L 780 220 L 720 280 L 680 300 L 600 350 L 520 300 L 450 150 L 420 120 Z" fill="hsl(215 25% 18% / 0.5)" stroke="hsl(215 25% 30%)" strokeWidth="0.8" />
                        {/* Australia */}
                        <path d="M 800 300 L 900 300 L 900 380 L 800 380 Z" fill="hsl(215 25% 18% / 0.5)" stroke="hsl(215 25% 30%)" strokeWidth="0.8" />
                      </g>

                      {/* Flight path: Copenhagen to Mumbai */}
                      <path d="M 490 80 Q 620 100 720 190" fill="none" stroke="hsl(186 100% 50%)" strokeWidth="1.5" strokeDasharray="6 4" strokeOpacity="0.5">
                        <animate attributeName="stroke-dashoffset" from="30" to="0" dur="2s" repeatCount="indefinite" />
                      </path>

                      {/* Copenhagen dot */}
                      <circle cx="490" cy="80" r="3" fill="hsl(217 91% 60%)" />
                      <circle cx="490" cy="80" r="6" fill="none" stroke="hsl(217 91% 60%)" strokeWidth="0.5" strokeOpacity="0.5" />

                      {/* Mumbai dot */}
                      <circle cx="720" cy="190" r="4" fill="hsl(186 100% 50%)">
                        <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
                      </circle>
                      <circle cx="720" cy="190" r="12" fill="none" stroke="hsl(186 100% 50%)" strokeWidth="0.8" strokeOpacity="0.3">
                        <animate attributeName="r" values="10;18;10" dur="3s" repeatCount="indefinite" />
                        <animate attributeName="stroke-opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite" />
                      </circle>
                    </svg>

                    {/* Labels */}
                    <div className="absolute top-[15%] left-[42%] bg-card/90 border border-primary/30 px-2 py-0.5 backdrop-blur-sm rounded-sm">
                      <span className="text-[7px] text-primary font-mono tracking-wider">COPENHAGEN HQ</span>
                    </div>
                    <div className="absolute top-[30%] right-[16%] bg-card/90 border border-[hsl(var(--neon-cyan))]/50 px-2 py-1 backdrop-blur-sm shadow-[0_0_20px_rgba(0,240,255,0.12)] rounded-sm">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-[hsl(var(--neon-cyan))] rounded-full animate-pulse" />
                        <span className="text-[8px] text-[hsl(var(--neon-cyan))] font-mono font-bold tracking-wider">TARGET: MUMBAI</span>
                      </div>
                      <div className="h-px w-full bg-[hsl(var(--neon-cyan))]/20 my-0.5" />
                      <span className="text-[6px] text-muted-foreground font-mono">600M GAMERS // 19% CAGR</span>
                    </div>
                    <div className="absolute top-[15%] left-[38%] hidden md:block">
                      <span className="text-[7px] text-muted-foreground/60 font-mono">EUROPE: SATURATED</span>
                    </div>
                  </div>

                  {/* KPIs */}
                  <div className="lg:col-span-2 grid grid-cols-2 gap-3">
                    <KPICard icon={<TrendingUp className="w-4 h-4" />} label="MARKET CAGR" value={19} suffix="%" sub="$9.2Bn by 2029" color="cyan" ready={briefReady} />
                    <KPICard icon={<Users className="w-4 h-4" />} label="TARGET AUDIENCE" value={600} suffix="M" sub="Mobile Gamers" color="white" ready={briefReady} />
                    <KPICard icon={<Smartphone className="w-4 h-4" />} label="DISTRIBUTION" value={480} suffix="M" sub="JioGames Subscribers" color="green" ready={briefReady} />
                    <KPICard icon={<DollarSign className="w-4 h-4" />} label="COST STRUCTURE" value={-80} suffix="%" sub="Vs European Prod." color="orange" ready={briefReady} />

                    {/* Net loss chart spanning full width */}
                    <div className="col-span-2 bg-card/60 border border-border/40 rounded-lg p-3">
                      <span className="text-[8px] text-muted-foreground uppercase tracking-wider font-mono block mb-2">NET LOSS REDUCTION TRAJECTORY</span>
                      <AnimatedBarChart ready={briefReady} />
                    </div>
                  </div>
                </div>

                {/* Subtitle */}
                <div className="bg-[hsl(var(--neon-cyan))]/5 border border-[hsl(var(--neon-cyan))]/15 rounded-lg p-4 mt-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                  <div className="flex-1">
                    <h4 className="text-sm font-tech text-foreground tracking-wide mb-1">
                      FROM &quot;BOUTIQUE&quot; TO &quot;MASS PREMIUM&quot;
                    </h4>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      Bypassing EFG{"'"}s Western saturation via a <strong className="text-foreground">Joint Venture with Reliance (April 2025)</strong>. Deploying a Mobile-First ecosystem for 600M gamers.
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <span className="border border-[hsl(var(--neon-cyan))]/50 text-[hsl(var(--neon-cyan))] text-[8px] font-bold px-2.5 py-1 rounded font-mono">EXPANSION</span>
                    <span className="bg-[hsl(var(--neon-cyan))] text-background text-[8px] font-bold px-2.5 py-1 rounded font-mono">MOBILE FIRST</span>
                  </div>
                </div>
              </SectionBlock>

              {/* ---- SECTION 3: EXECUTION ROADMAP ---- */}
              <SectionBlock title="EXECUTION ROADMAP" icon={Activity} iconColor="text-[hsl(var(--neon-cyan))]" delay={300} ready={briefReady}>
                <div className="relative">
                  {/* Horizontal timeline line */}
                  <div className="hidden md:block absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-[hsl(var(--neon-cyan))]/50 via-border/50 to-transparent" />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    <PhaseCard
                      phase="01"
                      timeframe="H1 2026"
                      title="INFRASTRUCTURE"
                      tag="INDIA LAUNCH"
                      active
                      items={[
                        { icon: <Target className="w-3 h-3" />, label: "Local Studio", value: "Mumbai Production Hub" },
                        { icon: <Users className="w-3 h-3" />, label: "Partners", value: "Jio / Paytm Integration" },
                      ]}
                      actions={["Mobile Test Event", "-5% Ops Logistics"]}
                    />
                    <PhaseCard
                      phase="02"
                      timeframe="H2 2026"
                      title="D2C & GAMIFICATION"
                      tag="MONETIZATION"
                      items={[
                        { icon: <Zap className="w-3 h-3" />, label: "Feature", value: "Fantasy Live Platform" },
                        { icon: <DollarSign className="w-3 h-3" />, label: "Model", value: "Watch-to-Earn Rewards" },
                      ]}
                      actions={["ARPU +50%", "10k Transactions Target"]}
                    />
                    <PhaseCard
                      phase="03"
                      timeframe="2027"
                      title="PROFITABILITY"
                      tag="BREAK-EVEN"
                      dimmed
                      items={[
                        { icon: <TrendingUp className="w-3 h-3" />, label: "Goal", value: "Break-Even Target" },
                        { icon: <Globe className="w-3 h-3" />, label: "Mix", value: "EU 60% / India 20% / MENA 20%" },
                      ]}
                      actions={["Sustained Growth", "Global Diversification"]}
                    />
                  </div>
                </div>

                {/* CSR footer */}
                <div className="mt-6 bg-[hsl(var(--field-green))]/5 border border-[hsl(var(--field-green))]/20 rounded-lg p-4 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[hsl(var(--field-green))] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-[10px] font-bold text-[hsl(var(--field-green))] uppercase tracking-[0.15em] mb-1">CSR DIFFERENTIATION</h5>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      Leveraging &quot;Brand Safety Shield&quot; to attract Western sponsors subject to CSRD, avoiding EFG{"'"}s reputational risks linked to Saudi PIF ownership.
                    </p>
                  </div>
                </div>
              </SectionBlock>

              {/* ---- DOSSIER DOWNLOAD ---- */}
              <div className={`transition-all duration-700 ${briefReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: "600ms" }}>
                <a
                  href="/assets/blast-case-study.pdf"
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 bg-card/50 backdrop-blur-md border border-accent/20 border-l-2 border-l-accent rounded-lg p-4 hover:bg-accent/5 hover:border-accent/40 transition-all group"
                >
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors shrink-0">
                    <FileText className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground font-bold font-mono text-[10px] tracking-wider">ACCESS FULL DOSSIER</p>
                    <p className="text-[9px] text-accent/70 truncate">&quot;David vs Goliath 2.0&quot; - Complete BLAST.tv Strategic Audit (PDF)</p>
                  </div>
                  <Download className="w-5 h-5 text-accent opacity-40 group-hover:opacity-100 transition-opacity shrink-0" />
                </a>
              </div>

              {/* Source footer */}
              <div className={`flex items-start gap-2 pb-8 transition-all duration-700 ${briefReady ? "opacity-60 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: "700ms" }}>
                <AlertTriangle className="w-3 h-3 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-[8px] text-muted-foreground font-mono leading-relaxed">
                  Source: Dossier BLAST - Analysis based on 2024 Financials & 2025 Strategic Outlook. Confidential Academic Analysis.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


/* ================================================================
   SUB-COMPONENTS
   ================================================================ */

/* Section wrapper with animated reveal */
function SectionBlock({
  title, icon: Icon, iconColor, delay, ready, children,
}: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
  delay: number
  ready: boolean
  children: React.ReactNode
}) {
  return (
    <section
      className={`transition-all duration-700 ${ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-8 h-8 rounded-lg border border-border/50 bg-card/80 flex items-center justify-center ${iconColor}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 flex items-center gap-3">
          <h2 className="text-sm md:text-base font-tech text-foreground tracking-[0.15em]">{title}</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-border/60 to-transparent" />
        </div>
      </div>
      {children}
    </section>
  )
}

/* Threat card */
function ThreatCard({ icon, tag, color, title, desc }: {
  icon: React.ReactNode; tag: string; color: "red" | "orange" | "cyan"; title: string; desc: string
}) {
  const styles = {
    red: { border: "border-red-500/30 hover:border-red-500/60", tag: "bg-red-500/15 text-red-400", dot: "bg-red-500" },
    orange: { border: "border-accent/30 hover:border-accent/60", tag: "bg-accent/15 text-accent", dot: "bg-accent" },
    cyan: { border: "border-[hsl(var(--neon-cyan))]/30 hover:border-[hsl(var(--neon-cyan))]/60", tag: "bg-[hsl(var(--neon-cyan))]/15 text-[hsl(var(--neon-cyan))]", dot: "bg-[hsl(var(--neon-cyan))]" },
  }
  const s = styles[color]
  return (
    <div className={`bg-card/60 border ${s.border} rounded-lg p-3 transition-colors group`}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <div className={`w-1 h-1 rounded-full ${s.dot}`} />
        <span className={`text-[7px] ${s.tag} px-1.5 py-0.5 rounded font-mono font-bold tracking-wider`}>{tag}</span>
      </div>
      <div className="flex items-start gap-2">
        <div className={`shrink-0 mt-0.5 ${s.tag.split(" ")[1]}`}>{icon}</div>
        <div>
          <h4 className="text-[11px] text-foreground font-bold uppercase mb-0.5">{title}</h4>
          <p className="text-[9px] text-muted-foreground leading-relaxed">{desc}</p>
        </div>
      </div>
    </div>
  )
}

/* Bar comparison */
function BarCompare({ label1, pct1, color1, label2, pct2, color2 }: {
  label1: string; pct1: number; color1: string; label2: string; pct2: number; color2: string
}) {
  return (
    <div>
      <div className="w-full bg-secondary h-2 rounded-full overflow-hidden flex">
        <div className={`${color1} h-full transition-all duration-1000`} style={{ width: `${pct1}%` }} />
        <div className={`${color2} h-full transition-all duration-1000 shadow-[0_0_10px_#ef4444]`} style={{ width: `${pct2}%` }} />
      </div>
      <div className="flex justify-between text-[7px] font-mono mt-1 text-muted-foreground">
        <span>{label1}</span>
        <span>{label2}</span>
      </div>
    </div>
  )
}

/* Metric pill */
function MetricPill({ label, value, change, changeColor, negative }: {
  label: string; value: string; change: string; changeColor: string; negative?: boolean
}) {
  return (
    <div className="bg-secondary/50 rounded-lg p-2 border border-border/30">
      <div className="text-[7px] text-muted-foreground uppercase tracking-wider mb-0.5 font-mono">{label}</div>
      <div className={`text-sm font-tech ${negative ? "text-red-500" : "text-foreground"}`}>{value}</div>
      {change && <div className={`text-[7px] font-mono ${changeColor}`}>{change}</div>}
    </div>
  )
}

/* KPI card with animated counter */
function KPICard({ icon, label, value, suffix, sub, color, ready }: {
  icon: React.ReactNode; label: string; value: number; suffix: string; sub: string
  color: "cyan" | "white" | "green" | "orange"; ready: boolean
}) {
  const absVal = Math.abs(value)
  const display = useCountUp(absVal, 1200, ready, suffix)
  const prefix = value < 0 ? "-" : ""
  const valueColor = {
    cyan: "text-[hsl(var(--neon-cyan))]",
    white: "text-foreground",
    green: "text-[hsl(var(--field-green))]",
    orange: "text-accent",
  }
  const borderColor = color === "cyan" ? "border-[hsl(var(--neon-cyan))]/20" : "border-border/40"
  const glowColor = color === "cyan" ? "hover:shadow-[0_0_20px_rgba(0,240,255,0.08)]" : ""

  return (
    <div className={`bg-card/70 p-3 border ${borderColor} rounded-lg backdrop-blur-sm group hover:bg-card/90 transition-all ${glowColor}`}>
      <div className="flex items-center justify-between mb-1.5">
        <div className="text-[7px] text-muted-foreground uppercase tracking-[0.15em] font-mono">{label}</div>
        <div className="text-muted-foreground/40 group-hover:text-muted-foreground/70 transition-colors">{icon}</div>
      </div>
      <div className={`text-2xl font-tech ${valueColor[color]} tabular-nums`}>
        {prefix}{display}
      </div>
      <div className="text-[8px] text-muted-foreground mt-0.5 font-mono">{sub}</div>
    </div>
  )
}

/* Animated bar chart */
function AnimatedBarChart({ ready }: { ready: boolean }) {
  const [animate, setAnimate] = useState(false)
  useEffect(() => { if (ready) { const t = setTimeout(() => setAnimate(true), 600); return () => clearTimeout(t) } }, [ready])

  const bars = [
    { label: "2024", value: 80, color: "bg-red-500", tooltip: "-3.96M" },
    { label: "2025", value: 60, color: "bg-red-400/70", tooltip: "-2.8M (proj)" },
    { label: "2026", value: 35, color: "bg-accent/70", tooltip: "-2.0M (proj)" },
    { label: "2027", value: 4, color: "bg-[hsl(var(--field-green))]", tooltip: "BREAK-EVEN" },
  ]

  return (
    <div className="space-y-2">
      <div className="flex items-end gap-2.5 h-20">
        {bars.map((bar, i) => (
          <div key={bar.label} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
            <div className="relative w-full flex justify-center">
              <div className="opacity-0 group-hover:opacity-100 absolute -top-5 text-[7px] bg-card px-1.5 py-0.5 border border-border whitespace-nowrap font-mono rounded z-10 transition-opacity">
                {bar.tooltip}
              </div>
              <div
                className={`w-full max-w-[2.5rem] ${bar.color} rounded-t transition-all duration-1000 ease-out`}
                style={{ height: animate ? `${bar.value}%` : "0%", transitionDelay: `${i * 150}ms` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2.5">
        {bars.map((bar) => (
          <div key={bar.label} className="flex-1 text-center text-[7px] text-muted-foreground font-mono">{bar.label}</div>
        ))}
      </div>
    </div>
  )
}

/* Phase card for roadmap */
function PhaseCard({ phase, timeframe, title, tag, active, dimmed, items, actions }: {
  phase: string; timeframe: string; title: string; tag: string
  active?: boolean; dimmed?: boolean
  items: { icon: React.ReactNode; label: string; value: string }[]
  actions: string[]
}) {
  return (
    <div className={`relative ${dimmed ? "opacity-60" : ""}`}>
      {/* Timeline dot */}
      <div className="hidden md:flex items-center justify-center mb-4">
        <div className={`w-4 h-4 rounded-full ring-4 ring-background ${
          active ? "bg-[hsl(var(--neon-cyan))] shadow-[0_0_12px_hsl(186_100%_50%)]" : dimmed ? "bg-secondary border border-border" : "bg-muted-foreground/30"
        }`} />
      </div>

      <div className={`bg-card/60 border rounded-lg overflow-hidden transition-colors ${
        active ? "border-[hsl(var(--neon-cyan))]/40 shadow-[0_0_20px_rgba(0,240,255,0.06)]" : "border-border/40"
      }`}>
        {/* Header */}
        <div className={`p-3 border-b flex items-center justify-between ${
          active ? "bg-[hsl(var(--neon-cyan))]/5 border-[hsl(var(--neon-cyan))]/20" : "bg-card/30 border-border/30"
        }`}>
          <div>
            <span className={`text-[8px] font-mono tracking-[0.3em] ${active ? "text-[hsl(var(--neon-cyan))]" : "text-muted-foreground"}`}>
              PHASE {phase}
            </span>
            <div className="text-[10px] font-tech text-foreground tracking-wider">{timeframe}</div>
          </div>
          {tag && (
            <span className={`text-[7px] font-mono font-bold px-1.5 py-0.5 rounded ${
              active ? "bg-[hsl(var(--neon-cyan))]/15 text-[hsl(var(--neon-cyan))]" : "bg-secondary/50 text-muted-foreground"
            }`}>{tag}</span>
          )}
        </div>

        <div className="p-3 space-y-2.5">
          <h4 className="text-xs text-foreground font-bold uppercase tracking-wider">{title}</h4>

          {items.map((item) => (
            <div key={item.label} className="flex items-start gap-2 bg-secondary/30 p-2 rounded border border-border/20">
              <div className="text-muted-foreground/60 mt-0.5 shrink-0">{item.icon}</div>
              <div>
                <div className="text-[7px] text-muted-foreground uppercase font-mono">{item.label}</div>
                <div className="text-[9px] text-foreground/80 font-mono">{item.value}</div>
              </div>
            </div>
          ))}

          <div className="space-y-1 pt-1">
            {actions.map((a) => (
              <div key={a} className="flex items-center gap-1.5 text-[8px] font-mono">
                <ChevronRight className={`w-2.5 h-2.5 ${active ? "text-[hsl(var(--neon-cyan))]" : "text-muted-foreground/50"}`} />
                <span className={active ? "text-[hsl(var(--neon-cyan))]" : "text-muted-foreground"}>{a}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
