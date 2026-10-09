"use client"

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react"
import { usePathname } from "next/navigation"
import { getLenis } from "@/components/fx/smooth-scroll"

export type EntranceCallbacks = { onReveal: () => void; onComplete: () => void }

const REVEAL_MS = 450
const EXIT_MS = 400

export const entranceTiming = {
  "--intro-hold": `${REVEAL_MS}ms`,
  "--intro-exit": `${EXIT_MS}ms`,
} as CSSProperties

/** Shared timing, scroll lock and skip behavior for the three case intros. */
export function useContractEntrance({ onReveal, onComplete }: EntranceCallbacks) {
  const pathname = usePathname()
  const [visible, setVisible] = useState(true)
  const decision = useRef<{ key: string; play: boolean } | null>(null)
  const skip = useCallback(() => {
    onComplete()
    setVisible(false)
  }, [onComplete])

  useEffect(() => {
    if (!visible) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
    const key = `jm-contract-entrance-v2:${pathname}`
    if (decision.current?.key !== key) {
      let seen = false
      try {
        seen = !!sessionStorage.getItem(key)
      } catch {}
      const play = !seen && !reduce.matches && !window.location.hash
      decision.current = { key, play }
      if (play) {
        try {
          sessionStorage.setItem(key, "1")
        } catch {}
      }
    }
    if (!decision.current.play || reduce.matches) {
      onReveal()
      skip()
      return
    }

    const overflow = document.documentElement.style.overflow
    const lenis = getLenis()
    document.documentElement.style.overflow = "hidden"
    lenis?.stop()

    // The hero begins as the overlay exits; interaction resumes after the exit.
    const reveal = window.setTimeout(onReveal, REVEAL_MS)
    const end = window.setTimeout(skip, REVEAL_MS + EXIT_MS + 50)
    const onPreference = () => { if (reduce.matches) skip() }
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      event.preventDefault()
      event.stopImmediatePropagation()
      skip()
    }
    reduce.addEventListener("change", onPreference)
    window.addEventListener("keydown", onKey, true)

    return () => {
      window.clearTimeout(reveal)
      window.clearTimeout(end)
      reduce.removeEventListener("change", onPreference)
      window.removeEventListener("keydown", onKey, true)
      document.documentElement.style.overflow = overflow
      lenis?.start()
    }
  }, [onReveal, pathname, skip, visible])

  return { visible, skip }
}
