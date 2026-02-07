"use client"

import { useEffect, useRef, useCallback } from "react"
import createGlobe from "cobe"

export function TacticalGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const phiRef = useRef(0)
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null)
  const frameRef = useRef(0)

  const initGlobe = useCallback(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current

    // Match the display size for crisp rendering
    const width = canvas.offsetWidth * 2
    const height = canvas.offsetHeight * 2
    canvas.width = width
    canvas.height = height

    globeRef.current = createGlobe(canvas, {
      devicePixelRatio: 2,
      width,
      height,
      phi: 0,
      theta: 0.25,
      dark: 1,
      diffuse: 0.4,
      mapSamples: 20000,
      mapBrightness: 1.8,
      mapBaseBrightness: 0.05,
      baseColor: [0.05, 0.1, 0.18],     // dark navy matching bg
      markerColor: [0.3, 0.7, 1],        // cyan/blue markers
      glowColor: [0.08, 0.2, 0.4],       // subtle blue glow
      scale: 1.05,
      offset: [0, 0],
      markers: [
        // Key locations
        { location: [50.6292, 3.0573], size: 0.08 },   // Lille, France
        { location: [48.8566, 2.3522], size: 0.06 },   // Paris
        { location: [51.5074, -0.1278], size: 0.05 },  // London
        { location: [40.7128, -74.006], size: 0.05 },  // New York
        { location: [35.6762, 139.6503], size: 0.04 }, // Tokyo
        { location: [55.7558, 37.6173], size: 0.04 },  // Moscow
        { location: [-33.8688, 151.2093], size: 0.04 },// Sydney
      ],
      onRender: (state) => {
        state.phi = phiRef.current
        // Slow auto-rotation
        phiRef.current += 0.003
      },
    })
  }, [])

  useEffect(() => {
    // Small delay for DOM to settle
    frameRef.current = requestAnimationFrame(() => {
      initGlobe()
    })

    return () => {
      cancelAnimationFrame(frameRef.current)
      globeRef.current?.destroy()
    }
  }, [initGlobe])

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Outer tactical ring */}
      <div className="absolute w-[85%] aspect-square rounded-full border border-dashed border-primary/15" 
        style={{ animation: "orbit-spin 60s linear infinite" }}
      >
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary/40" />
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[hsl(var(--neon-cyan))]/40" />
      </div>

      {/* Inner tactical ring */}
      <div className="absolute w-[70%] aspect-square rounded-full border border-primary/10"
        style={{ animation: "orbit-spin-reverse 45s linear infinite" }}
      >
        <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-1 h-1 rounded-full bg-accent/50" />
      </div>

      {/* Crosshair lines */}
      <div className="absolute w-[90%] h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
      <div className="absolute h-[90%] w-px bg-gradient-to-b from-transparent via-primary/10 to-transparent" />

      {/* Globe canvas */}
      <canvas
        ref={canvasRef}
        className="w-[75%] aspect-square"
        style={{ 
          contain: "layout paint size",
          opacity: 0.85,
        }}
      />

      {/* Glow behind globe */}
      <div className="absolute w-[60%] aspect-square rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      {/* HUD labels */}
      <div className="absolute top-4 left-4 flex flex-col gap-1">
        <span className="text-xs font-mono text-primary/50 tracking-[0.2em]">GLOBAL NETWORK</span>
        <span className="text-xs font-mono text-muted-foreground tracking-wider">NODES: 7 ACTIVE</span>
      </div>
      <div className="absolute bottom-4 right-4 flex flex-col items-end gap-1">
        <span className="text-xs font-mono text-[hsl(var(--neon-cyan))]/50 tracking-[0.2em]">UPLINK</span>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--field-green))] animate-pulse" />
          <span className="text-xs font-mono text-[hsl(var(--field-green))]">CONNECTED</span>
        </div>
      </div>

      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-primary/20" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-primary/20" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-primary/20" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-primary/20" />
    </div>
  )
}
