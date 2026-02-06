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

  // Skip boot sequence on mobile
  useEffect(() => {
    if (isMobile) {
      setBooting(false)
      setMainVisible(true)
    }
  }, [isMobile])

  const handleBootComplete = () => {
    setBooting(false)
    // Small delay for the boot sequence exit animation to finish
    setTimeout(() => setMainVisible(true), 100)
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-background relative tactical-grid cursor-crosshair">
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
      <HexCommandGrid visible={mainVisible} />
    </div>
  )
}
