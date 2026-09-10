"use client"

import { useEffect, useState } from "react"

/** True when the viewport is narrower than `max` px. Always false on the server. */
export function useIsMobile(max = 768) {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${max - 1}px)`)
    const update = () => setMobile(mql.matches)
    update()
    mql.addEventListener("change", update)
    return () => mql.removeEventListener("change", update)
  }, [max])
  return mobile
}

/** True when the device has no fine pointer (touch) or asks for reduced motion. */
export function useLowFx() {
  const [low, setLow] = useState(false)
  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)")
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setLow(coarse.matches || reduce.matches)
    update()
    coarse.addEventListener("change", update)
    reduce.addEventListener("change", update)
    return () => {
      coarse.removeEventListener("change", update)
      reduce.removeEventListener("change", update)
    }
  }, [])
  return low
}

export function useReducedMotion() {
  const [reduce, setReduce] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduce(mql.matches)
    update()
    mql.addEventListener("change", update)
    return () => mql.removeEventListener("change", update)
  }, [])
  return reduce
}
