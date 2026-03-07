"use client"

import { useEffect, useRef } from "react"

export function NoiseOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 256
    canvas.height = 256

    let animFrame: number

    const drawNoise = () => {
      const imageData = ctx.createImageData(256, 256)
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        const val = Math.random() * 255
        data[i] = val
        data[i + 1] = val
        data[i + 2] = val
        data[i + 3] = 8 // Very subtle
      }
      ctx.putImageData(imageData, 0, 0)
      animFrame = requestAnimationFrame(drawNoise)
    }

    drawNoise()
    return () => cancelAnimationFrame(animFrame)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[5] opacity-40 mix-blend-overlay"
      style={{
        width: "100%",
        height: "100%",
        imageRendering: "pixelated",
      }}
      aria-hidden="true"
    />
  )
}
