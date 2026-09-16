"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { PROFILE } from "@/lib/profile"
import { Btn } from "@/components/ui/primitives"
import { navigateWithWipe } from "@/components/fx/page-wipe"

const NAV = [
  { id: "operator", label: "Operator", n: "01" },
  { id: "contracts", label: "Contracts", n: "02" },
  { id: "log", label: "Log", n: "03" },
  { id: "loadout", label: "Loadout", n: "04" },
  { id: "more-about-me", label: "About me", n: "05" },
  { id: "extraction", label: "Contact", n: "06" },
]

export function Clock() {
  const [t, setT] = useState("--:--:--")
  useEffect(() => {
    const tick = () =>
      setT(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Europe/Paris",
        })
      )
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <span className="mono tnum text-[11px] text-mute" suppressHydrationWarning>
      {t} <span className="text-dim">CET</span>
    </span>
  )
}

export function TopBar({ variant = "home" }: { variant?: "home" | "page" }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const go = (id: string) => (e: React.MouseEvent) => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    if (variant === "home") {
      const el = document.getElementById(id)
      el?.scrollIntoView({ behavior: "smooth", block: "start" })
      history.replaceState(null, "", `#${id}`)
    } else {
      navigateWithWipe(`/#${id}`)
    }
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[120] h-14 transition-colors duration-300",
        scrolled ? "bg-bg/85 backdrop-blur-md border-b border-line" : "border-b border-transparent"
      )}
    >
      <div className="flex h-full items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Home">
          <span className="grid h-7 w-7 place-items-center bg-acid text-black mono text-[10px] font-bold">JM</span>
          <span className="display text-[15px] tracking-[0.02em]">Moreau</span>
          <span className="label text-mute hidden lg:inline">{"// Runner profile"}</span>
        </Link>

        <nav className="hidden xl:flex items-center gap-1" aria-label="Sections">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`/#${n.id}`}
              onClick={go(n.id)}
              className="group flex items-center gap-2 px-3 py-2 label text-mute hover:text-ink transition-colors"
            >
              <span className="text-acid opacity-0 group-hover:opacity-100 transition-opacity">{n.n}</span>
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 md:gap-4">
          <span className="hidden md:inline-flex">
            <Clock />
          </span>
          <span className="hidden sm:inline-flex items-center gap-2 label text-crimson">
            <span className="h-1.5 w-1.5 rounded-full bg-crimson animate-pulse2" />
            Live
          </span>
          <Btn href={PROFILE.cv} download tone="acid" size="sm">
            CV
          </Btn>
        </div>
      </div>
    </header>
  )
}
