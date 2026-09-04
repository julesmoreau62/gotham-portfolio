"use client"

import { useState, useEffect } from "react"
import { BootSequence } from "@/components/boot-sequence"
import { ParticleNetwork } from "@/components/particle-network"
import { NoiseOverlay } from "@/components/noise-overlay"
import { HexCommandGrid } from "@/components/hex-command-grid"
import { useIsMobile } from "@/hooks/use-mobile"

export default function Page() {
  const isMobile = useIsMobile()
  const [booting, setBooting] = useState(true)
  const [mainVisible, setMainVisible] = useState(false)
  const [alreadyBooted, setAlreadyBooted] = useState(false)

  // Read sessionStorage only after mount to avoid SSR/client hydration mismatch
  useEffect(() => {
    const booted = !!sessionStorage.getItem("booted")
    if (booted) {
      setAlreadyBooted(true)
      setBooting(false)
      setMainVisible(true)
    }
  }, [])

  // Skip boot sequence on mobile
  useEffect(() => {
    if (isMobile) {
      setBooting(false)
      setMainVisible(true)
      sessionStorage.setItem("booted", "1")
    }
  }, [isMobile])

  const handleBootComplete = () => {
    setBooting(false)
    sessionStorage.setItem("booted", "1")
    // Small delay for the boot sequence exit animation to finish
    setTimeout(() => setMainVisible(true), 100)
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-background relative tactical-grid cursor-crosshair">
      {/* Concise accessible summary; full text version lives at /briefing. */}
      <div className="sr-only">
        <h2>Jules Moreau — Esports &amp; Sport Operations Portfolio</h2>
        <p>
          M2 International Sport Administration student seeking an Esports Operations /
          Event Management internship from February to June 2027, focused on event logistics,
          sponsor activation and competitive intelligence.
        </p>
        <p>
          Featured work includes the Royal Daring HC sponsor system, ASN95 digital
          communication, BLAST strategic analysis, ASI event operations, AI intelligence
          tooling and sport photography.
        </p>
        <p>
          Open the concise recruiter version at <a href="/briefing">/briefing</a>,
          download the CV at <a href="/assets/cv-julesmoreau.pdf">/assets/cv-julesmoreau.pdf</a>,
          or contact Jules at <a href="mailto:jules.moreau1@outlook.com">jules.moreau1@outlook.com</a>.
        </p>
      </div>

      {/* Ambient layers (disabled on mobile for performance) */}
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

      {/* Boot sequence (disabled on mobile) */}
      {booting && !isMobile && <BootSequence onComplete={handleBootComplete} />}

      {/* Main interface */}
      <HexCommandGrid visible={mainVisible} skipTransitions={alreadyBooted} />
    </div>
  )
}
