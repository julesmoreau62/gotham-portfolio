"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

const HeroArtifact = dynamic(() => import("@/components/fx/hero-artifact"), {
  ssr: false,
  loading: () => null,
})

/** Static reticle used on mobile / reduced-motion / while WebGL loads. */
export function Reticle({ className }: { className?: string }) {
  return (
    <div className={cn("relative aspect-square", className)} aria-hidden="true">
      <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
        <circle cx="200" cy="200" r="190" fill="none" stroke="rgba(242,241,236,0.14)" strokeWidth="1" strokeDasharray="2 10" />
        <g className="origin-center animate-spin-slow">
          <circle cx="200" cy="200" r="150" fill="none" stroke="#c8ff00" strokeWidth="1" strokeDasharray="60 30" strokeOpacity="0.7" />
        </g>
        <g className="origin-center animate-spin-rev">
          <circle cx="200" cy="200" r="112" fill="none" stroke="rgba(242,241,236,0.35)" strokeWidth="1" strokeDasharray="4 8" />
        </g>
        {Array.from({ length: 36 }, (_, i) => {
          const a = (i * 10 * Math.PI) / 180
          const r1 = i % 9 === 0 ? 162 : 168
          const p = (v: number) => Number(v.toFixed(2))
          return (
            <line
              key={i}
              x1={p(200 + Math.cos(a) * r1)}
              y1={p(200 + Math.sin(a) * r1)}
              x2={p(200 + Math.cos(a) * 176)}
              y2={p(200 + Math.sin(a) * 176)}
              stroke="rgba(242,241,236,0.35)"
              strokeWidth="1"
            />
          )
        })}
        <polygon points="200,130 262,165 262,235 200,270 138,235 138,165" fill="none" stroke="#c8ff00" strokeWidth="1.5" />
        <polygon points="200,150 245,175 245,225 200,250 155,225 155,175" fill="rgba(200,255,0,0.08)" stroke="rgba(242,241,236,0.5)" strokeWidth="1" />
        <line x1="200" y1="8" x2="200" y2="60" stroke="#c8ff00" strokeWidth="1" />
        <line x1="200" y1="340" x2="200" y2="392" stroke="#c8ff00" strokeWidth="1" />
        <line x1="8" y1="200" x2="60" y2="200" stroke="#c8ff00" strokeWidth="1" />
        <line x1="340" y1="200" x2="392" y2="200" stroke="#c8ff00" strokeWidth="1" />
      </svg>
    </div>
  )
}

export function Artifact({ className }: { className?: string }) {
  const [webgl, setWebgl] = useState<boolean | null>(null)

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const small = window.innerWidth < 900
    if (coarse || reduce || small) {
      setWebgl(false)
      return
    }
    try {
      const c = document.createElement("canvas")
      const ok = !!(c.getContext("webgl2") || c.getContext("webgl"))
      setWebgl(ok)
    } catch {
      setWebgl(false)
    }
  }, [])

  if (webgl === null) return <div className={className} />
  if (!webgl) {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <Reticle className="w-[68%] max-w-[420px]" />
      </div>
    )
  }
  return <HeroArtifact className={className} />
}
