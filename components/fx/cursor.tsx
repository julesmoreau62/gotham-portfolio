"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Marathon-style reticle cursor. Elements can hint the cursor with
 * `data-cursor="open"` (label) or `data-cursor="hide"`.
 */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null)
  const dot = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!fine || reduce) return
    setEnabled(true)
    document.documentElement.classList.add("has-cursor")

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let rx = x
    let ry = y
    let raf = 0
    let hover: string | null = null
    let visible = false

    const onMove = (e: MouseEvent) => {
      x = e.clientX
      y = e.clientY
      if (!visible) {
        visible = true
        ring.current?.style.setProperty("opacity", "1")
        dot.current?.style.setProperty("opacity", "1")
      }
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        "a, button, [role='button'], [data-cursor]"
      )
      const next = target ? target.dataset.cursor ?? "link" : null
      if (next !== hover) {
        hover = next
        const r = ring.current
        const l = labelRef.current
        if (!r || !l) return
        if (hover === "hide") {
          r.style.opacity = "0"
          dot.current?.style.setProperty("opacity", "0")
          return
        }
        r.style.opacity = "1"
        dot.current?.style.setProperty("opacity", "1")
        const isLabel = hover && hover !== "link"
        r.dataset.state = hover ? (isLabel ? "label" : "hover") : "idle"
        l.textContent = isLabel ? (hover as string).toUpperCase() : ""
      }
    }
    const onLeave = () => {
      visible = false
      ring.current?.style.setProperty("opacity", "0")
      dot.current?.style.setProperty("opacity", "0")
    }
    const onDown = () => ring.current?.setAttribute("data-down", "1")
    const onUp = () => ring.current?.removeAttribute("data-down")

    const loop = () => {
      rx += (x - rx) * 0.18
      ry += (y - ry) * 0.18
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    window.addEventListener("mousemove", onMove, { passive: true })
    document.documentElement.addEventListener("mouseleave", onLeave)
    window.addEventListener("mousedown", onDown)
    window.addEventListener("mouseup", onUp)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("mousemove", onMove)
      document.documentElement.removeEventListener("mouseleave", onLeave)
      window.removeEventListener("mousedown", onDown)
      window.removeEventListener("mouseup", onUp)
      document.documentElement.classList.remove("has-cursor")
    }
  }, [])

  if (!enabled) return null

  return (
    <>
      <div
        ref={ring}
        data-state="idle"
        aria-hidden="true"
        className="cursor-ring pointer-events-none fixed left-0 top-0 z-[200] opacity-0"
        style={{ willChange: "transform" }}
      >
        <div className="cursor-ring__shape" />
        <span ref={labelRef} className="cursor-ring__label label" />
      </div>
      <div
        ref={dot}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[201] h-1 w-1 bg-acid opacity-0 mix-blend-difference"
        style={{ willChange: "transform" }}
      />
      <style jsx global>{`
        .cursor-ring__shape {
          width: 28px;
          height: 28px;
          border: 1px solid var(--acid);
          border-radius: 50%;
          position: relative;
          transition: width 0.25s cubic-bezier(0.2, 1, 0.3, 1), height 0.25s cubic-bezier(0.2, 1, 0.3, 1),
            border-radius 0.25s, background 0.25s, border-color 0.25s;
          mix-blend-mode: difference;
        }
        .cursor-ring__shape::before,
        .cursor-ring__shape::after {
          content: "";
          position: absolute;
          background: var(--acid);
          left: 50%;
          top: 50%;
          transition: opacity 0.2s;
        }
        .cursor-ring__shape::before {
          width: 1px;
          height: 40px;
          transform: translate(-50%, -50%);
        }
        .cursor-ring__shape::after {
          width: 40px;
          height: 1px;
          transform: translate(-50%, -50%);
        }
        .cursor-ring[data-state="hover"] .cursor-ring__shape {
          width: 52px;
          height: 52px;
          border-radius: 4px;
          background: rgba(200, 255, 0, 0.08);
        }
        .cursor-ring[data-state="hover"] .cursor-ring__shape::before,
        .cursor-ring[data-state="hover"] .cursor-ring__shape::after {
          opacity: 0;
        }
        .cursor-ring[data-state="label"] .cursor-ring__shape {
          width: 76px;
          height: 76px;
          border-radius: 50%;
          background: var(--acid);
          border-color: var(--acid);
        }
        .cursor-ring[data-state="label"] .cursor-ring__shape::before,
        .cursor-ring[data-state="label"] .cursor-ring__shape::after {
          opacity: 0;
        }
        .cursor-ring[data-down="1"] .cursor-ring__shape {
          transform: scale(0.85);
        }
        .cursor-ring__label {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
          font-weight: 700;
          letter-spacing: 0.14em;
          font-size: 9px;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .cursor-ring[data-state="label"] .cursor-ring__label {
          opacity: 1;
        }
      `}</style>
    </>
  )
}
