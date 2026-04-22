"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Shield } from "lucide-react"
import { NoiseOverlay } from "@/components/noise-overlay"
import { ParticleNetwork } from "@/components/particle-network"
import { BuildProcessFlowchart } from "@/components/build-process-flowchart"
import { useIsMobile } from "@/hooks/use-mobile"

export default function BuildProcessPage() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [headerVisible, setHeaderVisible] = useState(false)
  const [legendVisible, setLegendVisible] = useState(false)
  const [contentVisible, setContentVisible] = useState(false)
  const [footerVisible, setFooterVisible] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setHeaderVisible(true), 100)
    const t2 = setTimeout(() => setLegendVisible(true), 300)
    const t3 = setTimeout(() => setContentVisible(true), 500)
    const t4 = setTimeout(() => setFooterVisible(true), 800)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [])

  return (
    <div className="min-h-screen w-full bg-background relative tactical-grid cursor-crosshair">
      {/* Ambient layers */}
      {!isMobile && <ParticleNetwork />}
      {!isMobile && <NoiseOverlay />}

      {/* Radial ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, hsl(217 91% 60% / 0.04) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, hsl(186 100% 50% / 0.03) 0%, transparent 50%)",
        }}
        aria-hidden="true"
      />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-10">
        {/* Back navigation */}
        <div
          className="transition-all duration-700"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(-12px)",
          }}
        >
          <button
            type="button"
            onClick={() => {
              router.push("/")
              // Wait for navigation then set the hash so hashchange fires on the homepage
              setTimeout(() => {
                window.location.hash = "intel"
              }, 100)
            }}
            className="inline-flex items-center gap-2 text-[10px] font-mono text-[hsl(var(--neon-cyan))]/70 hover:text-[hsl(var(--neon-cyan))] tracking-[0.2em] uppercase transition-colors duration-200 cursor-pointer bg-transparent border-none"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {'BACK TO INTEL CORE'}
          </button>
        </div>

        {/* Header */}
        <header
          className="mt-8 mb-10 transition-all duration-700"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(16px)",
            transitionDelay: "100ms",
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-5 h-5 text-[hsl(var(--neon-cyan))]" style={{ filter: "drop-shadow(0 0 8px hsl(186 100% 50%))" }} />
            <div className="h-px flex-1 bg-gradient-to-r from-[hsl(var(--neon-cyan))]/30 to-transparent" />
          </div>
          <h1 className="font-tech text-2xl md:text-4xl text-foreground tracking-[0.15em] mb-2">
            {'INTEL CORE // BUILD PROCESS'}
          </h1>
          <p className="font-tech text-sm md:text-base text-[hsl(var(--neon-cyan))] tracking-[0.25em] mb-1">
            AI-AUGMENTED DEVELOPMENT
          </p>
          <p className="text-[10px] font-mono text-muted-foreground tracking-[0.2em]">
            {'Telegram Veille \u2014 Creation Methodology'}
          </p>
          <div className="mt-4 h-px bg-gradient-to-r from-[hsl(var(--neon-cyan))]/20 via-border/30 to-transparent" />
        </header>

        {/* Legend bar */}
        <div
          className="flex flex-wrap items-center justify-center gap-6 md:gap-8 mb-10 py-3 px-4 rounded border border-border/30 bg-card/40 transition-all duration-700"
          style={{
            opacity: legendVisible ? 1 : 0,
            transform: legendVisible ? "translateY(0)" : "translateY(12px)",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent" />
            <span className="text-[10px] font-mono text-muted-foreground tracking-[0.15em]">Personal work</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--neon-cyan))]" />
            <span className="text-[10px] font-mono text-muted-foreground tracking-[0.15em]">AI-assisted</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--field-green))]" />
            <span className="text-[10px] font-mono text-muted-foreground tracking-[0.15em]">{'Human + AI collaboration'}</span>
          </div>
        </div>

        {/* Flowchart */}
        <div
          className="transition-all duration-700"
          style={{
            opacity: contentVisible ? 1 : 0,
            transform: contentVisible ? "translateY(0)" : "translateY(16px)",
          }}
        >
          <BuildProcessFlowchart />
        </div>

        {/* Footer */}
        <footer
          className="mt-12 py-6 border-t border-border/20 text-center transition-all duration-700"
          style={{
            opacity: footerVisible ? 1 : 0,
            transform: footerVisible ? "translateY(0)" : "translateY(8px)",
          }}
        >
          <p className="text-[8px] font-mono text-muted-foreground/40 tracking-[0.3em]">
            {'CLASSIFICATION: OPERATIONAL // AI-AUGMENTED BUILD PROCESS // TELEGRAM VEILLE v2.0'}
          </p>
        </footer>
      </div>
    </div>
  )
}
