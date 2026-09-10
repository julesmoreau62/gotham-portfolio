"use client"

import { useEffect, useRef, useState } from "react"
import { useInView } from "framer-motion"

export function Counter({
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1400,
  className,
  play,
}: {
  to: number
  decimals?: number
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
  play?: boolean
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const active = play ?? inView
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!active) return
    let raf = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 4)
      setVal(to * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
      else setVal(to)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, to, duration])

  const text = val.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
  return (
    <span ref={ref} className={className}>
      {prefix}
      {text}
      {suffix}
    </span>
  )
}
