"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { HomeIntro } from "./home-intro"

const BootCtx = createContext(false)
export const useBooted = () => useContext(BootCtx)

const KEY = "jm-story-intro-v2"

export function BootProvider({ children }: { children: React.ReactNode }) {
  const [booted, setBooted] = useState(false)
  const [showIntro, setShowIntro] = useState(true)

  useEffect(() => {
    let already = false
    try {
      already = !!sessionStorage.getItem(KEY)
    } catch {}
    if (already || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setBooted(true)
      setShowIntro(false)
    }
  }, [])

  const reveal = useCallback(() => {
    try {
      sessionStorage.setItem(KEY, "1")
    } catch {}
    setBooted(true)
  }, [])

  const complete = useCallback(() => setShowIntro(false), [])

  return (
    <BootCtx.Provider value={booted}>
      {showIntro && <HomeIntro onReveal={reveal} onComplete={complete} />}
      <div inert={showIntro}>{children}</div>
    </BootCtx.Provider>
  )
}
