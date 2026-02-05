"use client"

import { useState } from "react"
import {
  User,
  X,
  Download,
  MapPin,
  Shield,
  Anchor,
  GraduationCap,
  Briefcase,
  ChevronRight,
} from "lucide-react"

const DEPLOYMENTS = [
  {
    date: "AUG 2025 // FRENCH GUIANA",
    title: "INFRASTRUCTURE TECH // BOLT ECHAFAUDAGE",
    desc: "Kourou Beach Festival & Tour de Guyane. Heavy material handling (Telehandlers), VIP complex construction under strict timing constraints.",
    color: "primary",
  },
  {
    date: "JUN - JUL 2025 // FRENCH GUIANA",
    title: "SALES & OPS SUPPORT // GUYANE MATERIELS",
    desc: "Managed customer ops in tropical environment. Produced product photography assets.",
    color: "primary",
  },
  {
    date: "JAN - JUN 2025 // FRANCE",
    title: "COMMS & DEV INTERN // ASN95",
    desc: "Club development strategy. Coordinated matchday operations to increase visibility.",
    color: "primary",
  },
  {
    date: "SINCE JUL 2022",
    title: "FRENCH NAVY RESERVIST // PETTY OFFICER",
    desc: "Ecole de Maistrance. Trained in military rigor, crisis management and team leadership.",
    color: "accent",
  },
]

const EDUCATION = [
  {
    period: "2025 - 2027",
    degree: "MASTER'S IN SPORT SCIENCES",
    school: "Intl. Sport Administration // Lille",
  },
  {
    period: "2022 - 2025",
    degree: "BACHELOR'S IN SPORT SCIENCES",
    school: "Sport Management // ULCO",
  },
]

export function AboutPanel({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-background/80 backdrop-blur-md transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-8 transition-all duration-500 ${open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Agent Profile"
      >
        <div className="relative w-full max-w-4xl max-h-[90vh] bg-card/95 backdrop-blur-xl border border-border rounded-xl overflow-hidden flex flex-col shadow-[0_0_80px_hsl(217_91%_60%/0.15)]">
          {/* Scan line */}
          <div
            className="absolute left-0 w-full h-[1px] pointer-events-none opacity-30 z-50"
            style={{
              background: "linear-gradient(90deg, transparent, hsl(217 91% 60%), transparent)",
              animation: "scan-line 5s linear infinite",
            }}
          />

          {/* Header */}
          <header className="flex items-center justify-between px-5 md:px-6 py-3 border-b border-border/50 bg-card/50 shrink-0">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-primary" />
              <h2 className="font-tech text-sm md:text-base text-foreground tracking-[0.15em] uppercase">
                Agent Profile: <span className="text-primary">J. Moreau</span>
              </h2>
            </div>
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-3 py-1.5 rounded border border-border/50 bg-card/50 hover:bg-destructive/10 hover:border-destructive/50 transition-all group"
              aria-label="Close dossier"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground group-hover:text-destructive transition-colors group-hover:rotate-90 duration-300" />
              <span className="text-[9px] font-mono text-muted-foreground group-hover:text-destructive tracking-wider hidden sm:inline">
                CLOSE DOSSIER
              </span>
            </button>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
              {/* Left column - Identity card */}
              <div className="col-span-1 md:col-span-4 flex flex-col gap-4">
                {/* Agent photo placeholder */}
                <div className="relative bg-secondary/50 border border-border p-1 rounded overflow-hidden">
                  <div className="w-full aspect-[3/4] bg-card flex flex-col items-center justify-center gap-3 relative overflow-hidden">
                    {/* Grid overlay */}
                    <div
                      className="absolute inset-0 opacity-[0.04] pointer-events-none"
                      style={{
                        backgroundImage:
                          "linear-gradient(hsl(217 91% 60%) 1px, transparent 1px), linear-gradient(90deg, hsl(217 91% 60%) 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                      }}
                    />
                    <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center relative">
                      <User className="w-10 h-10 text-primary/60" />
                      <div className="absolute inset-0 rounded-full border border-primary/20 animate-node-ping" />
                    </div>
                    <div className="text-center relative z-10">
                      <div className="font-tech text-lg text-foreground tracking-wider">
                        JULES MOREAU
                      </div>
                      <div className="text-[9px] font-mono text-primary tracking-wider">
                        RANK: SECOND MAITRE (NCO)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick facts */}
                <div className="bg-secondary/30 border border-border/50 rounded p-3 font-mono text-[11px] space-y-2.5">
                  <div className="flex justify-between items-center border-b border-border/30 pb-2">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Shield className="w-3 h-3" />
                      CLEARANCE
                    </span>
                    <span className="text-accent font-bold">NATO SECRET</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-border/30 pb-2">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Anchor className="w-3 h-3" />
                      STATUS
                    </span>
                    <span className="text-[hsl(var(--field-green))] font-bold">ACTIVE RESERVE</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" />
                      LOCATION
                    </span>
                    <span className="text-foreground font-bold">LILLE, FR</span>
                  </div>
                </div>

                {/* Download CV */}
                <a
                  href="#"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded border border-primary/40 bg-primary/5 text-primary hover:bg-primary hover:text-background transition-all text-[10px] font-mono font-bold tracking-widest uppercase"
                >
                  <Download className="w-3 h-3" />
                  Download Full CV
                </a>
              </div>

              {/* Right column - Timeline & Education */}
              <div className="col-span-1 md:col-span-8 flex flex-col gap-6">
                {/* Deployment History */}
                <section>
                  <h3 className="flex items-center gap-2 font-tech text-base text-primary uppercase tracking-wider mb-4 border-b border-border/30 pb-2">
                    <Briefcase className="w-4 h-4" />
                    Deployment History
                  </h3>

                  <div className="relative border-l border-border/40 pl-5 ml-1.5 space-y-5">
                    {DEPLOYMENTS.map((dep, i) => (
                      <div
                        key={i}
                        className="relative group"
                        onMouseEnter={() => setHoveredIdx(i)}
                        onMouseLeave={() => setHoveredIdx(null)}
                      >
                        {/* Timeline dot */}
                        <div
                          className={`absolute -left-[25px] top-1 w-2.5 h-2.5 rounded-full border-2 border-background transition-all duration-300 ${
                            hoveredIdx === i
                              ? dep.color === "accent"
                                ? "bg-accent shadow-[0_0_10px_hsl(24_95%_53%/0.5)]"
                                : "bg-primary shadow-[0_0_10px_hsl(217_91%_60%/0.5)]"
                              : "bg-muted-foreground/30"
                          }`}
                        />

                        <div
                          className={`text-[9px] font-mono font-bold tracking-wider mb-0.5 transition-colors duration-300 ${
                            dep.color === "accent" ? "text-accent" : "text-primary"
                          }`}
                        >
                          {dep.date}
                        </div>
                        <h4 className="text-foreground font-bold text-xs uppercase mb-1 flex items-center gap-1.5">
                          {dep.title}
                          <ChevronRight
                            className={`w-3 h-3 text-muted-foreground transition-all duration-300 ${
                              hoveredIdx === i
                                ? "opacity-100 translate-x-0"
                                : "opacity-0 -translate-x-1"
                            }`}
                          />
                        </h4>
                        <p className="text-[10px] text-muted-foreground font-mono leading-relaxed">
                          {dep.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Academic Training */}
                <section>
                  <h3 className="flex items-center gap-2 font-tech text-base text-foreground uppercase tracking-wider mb-4 border-b border-border/30 pb-2">
                    <GraduationCap className="w-4 h-4" />
                    Academic Training
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {EDUCATION.map((edu, i) => (
                      <div
                        key={i}
                        className="bg-secondary/20 border border-border/30 rounded p-3 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 group"
                      >
                        <div className="text-[9px] font-mono text-muted-foreground mb-1">
                          {edu.period}
                        </div>
                        <div className="text-xs font-bold text-foreground mb-0.5 group-hover:text-primary transition-colors">
                          {edu.degree}
                        </div>
                        <div className="text-[9px] font-mono text-primary uppercase">
                          {edu.school}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="px-5 md:px-6 py-2 border-t border-border/30 bg-card/30 flex items-center justify-between shrink-0">
            <span className="text-[8px] font-mono text-muted-foreground">
              ENCRYPTION: AES-256 // CLASSIFICATION: CONFIDENTIAL
            </span>
            <span className="text-[8px] font-mono text-muted-foreground">
              DOSSIER REF: JM-2025-ALPHA
            </span>
          </footer>

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/40 rounded-tl-xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/40 rounded-tr-xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/40 rounded-bl-xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/40 rounded-br-xl pointer-events-none" />
        </div>
      </div>
    </>
  )
}
