"use client"

import { useEffect, useState } from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"

const SECTIONS = [
  { id: "hero", n: "00", label: "Profile" },
  { id: "operator", n: "01", label: "Operator" },
  { id: "contracts", n: "02", label: "Contracts" },
  { id: "log", n: "03", label: "Log" },
  { id: "loadout", n: "04", label: "Loadout" },
  { id: "more-about-me", n: "05", label: "More about me" },
  { id: "extraction", n: "06", label: "Extraction" },
]

export function SideHud() {
  const [active, setActive] = useState("hero")
  const { scrollYProgress } = useScroll()
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[]
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <motion.div
        className="fixed right-0 top-0 z-[110] h-screen w-[2px] origin-top bg-acid hidden lg:block"
        style={{ scaleY }}
        aria-hidden="true"
      />
      <nav
        className="fixed right-3 top-1/2 z-[110] hidden -translate-y-1/2 flex-col items-end gap-2.5 lg:flex"
        aria-label="Section index"
      >
        {SECTIONS.map((s) => {
          const on = active === s.id
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" })
              }}
              className="group relative flex items-center gap-2 py-0.5"
              aria-current={on ? "true" : undefined}
            >
              <span
                className={cn(
                  "pointer-events-none absolute right-full mr-3 whitespace-nowrap label bg-bg/90 px-2 py-1 transition-opacity duration-200",
                  on ? "text-acid" : "text-ink",
                  "opacity-0 group-hover:opacity-100"
                )}
              >
                {s.label}
              </span>
              <span className={cn("mono text-[9px] tnum transition-colors", on ? "text-acid" : "text-dim group-hover:text-ink")}>{s.n}</span>
              <span
                className={cn(
                  "h-px transition-all duration-300",
                  on ? "w-5 bg-acid" : "w-2 bg-ink/30 group-hover:w-4 group-hover:bg-ink"
                )}
              />
            </a>
          )
        })}
      </nav>
    </>
  )
}
