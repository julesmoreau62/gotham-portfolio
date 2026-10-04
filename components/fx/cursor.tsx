"use client"

import { useEffect, useRef, useState } from "react"

/** A soft glow follows the mouse while the browser keeps its native cursor. */
export function Cursor() {
  const glow = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)")
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
    let raf = 0
    let x = 0
    let y = 0

    const hide = () => {
      cancelAnimationFrame(raf)
      raf = 0
      if (glow.current) glow.current.style.opacity = "0"
    }
    const update = () => {
      hide()
      setEnabled(fine.matches && !reduce.matches)
    }
    const draw = () => {
      raf = 0
      if (!glow.current) return
      glow.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      glow.current.style.opacity = "1"
    }
    const onMove = (event: PointerEvent) => {
      if (!fine.matches || reduce.matches || event.pointerType !== "mouse") {
        hide()
        return
      }
      x = event.clientX
      y = event.clientY
      if (!raf) raf = requestAnimationFrame(draw)
    }

    update()
    fine.addEventListener("change", update)
    reduce.addEventListener("change", update)
    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("blur", hide)
    document.documentElement.addEventListener("mouseleave", hide)
    return () => {
      hide()
      fine.removeEventListener("change", update)
      reduce.removeEventListener("change", update)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("blur", hide)
      document.documentElement.removeEventListener("mouseleave", hide)
    }
  }, [])

  if (!enabled) return null

  return <div ref={glow} className="cursor-glow" aria-hidden="true" />
}
