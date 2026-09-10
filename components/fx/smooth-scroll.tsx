"use client"

import { useEffect } from "react"
import Lenis from "lenis"
import { usePathname } from "next/navigation"

let lenis: Lenis | null = null

export function getLenis() {
  return lenis
}

export function SmoothScroll() {
  const pathname = usePathname()

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (coarse || reduce) return

    lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
    })
    let raf = 0
    const loop = (time: number) => {
      lenis?.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis?.destroy()
      lenis = null
    }
  }, [])

  // Reset to top on route change (Lenis keeps its own scroll state).
  useEffect(() => {
    if (window.location.hash) return
    lenis?.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
