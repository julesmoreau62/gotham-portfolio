"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { PROFILE } from "@/lib/profile"
import { Btn } from "@/components/ui/primitives"
import { navigateWithWipe } from "@/components/fx/page-wipe"
import { HOME_SECTIONS } from "@/lib/journey"
import { Menu, X } from "lucide-react"

const NAV = HOME_SECTIONS.slice(1)

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
      {t} <span className="text-dim">PAR</span>
    </span>
  )
}

export function TopBar({ variant = "home" }: { variant?: "home" | "page" }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuTrigger = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false)
        menuTrigger.current?.focus()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [menuOpen])
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const go = (id: string) => (e: React.MouseEvent) => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    setMenuOpen(false)
    if (variant === "home") {
      const el = document.getElementById(id)
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      el?.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "start" })
      history.replaceState(history.state, "", `#${id}`)
    } else {
      navigateWithWipe(`/#${id}`)
    }
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[120] h-14 transition-colors duration-300",
        scrolled || menuOpen ? "bg-bg/95 backdrop-blur-md border-b border-line" : "border-b border-transparent"
      )}
    >
      <div className="flex h-full items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Home">
          <span className="grid h-7 w-7 place-items-center bg-acid text-black mono text-[10px] font-bold">JM</span>
          <span className="display text-[15px] tracking-[0.02em]">Moreau</span>
          <span className="label text-mute hidden lg:inline">{"// A player's perspective"}</span>
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
          <Btn href={PROFILE.cv} download tone="acid" size="sm">
            CV
          </Btn>
          <button ref={menuTrigger} type="button" className="grid h-11 w-11 place-items-center border border-line xl:hidden" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="mobile-story-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={18} /> : <Menu size={18} />}</button>
        </div>
      </div>
      <nav id="mobile-story-nav" aria-label="Story navigation" hidden={!menuOpen} className="border-b border-line bg-bg px-5 py-5 xl:hidden">
        {NAV.map(n => <a key={n.id} href={`/#${n.id}`} onClick={go(n.id)} className="flex min-h-12 items-center gap-5 border-t border-line py-3 mono text-[13px]"><span className="text-acid text-[10px]">{n.n}</span>{n.label}</a>)}
        <a href="/briefing" className="flex min-h-12 items-center gap-5 border-t border-line py-3 mono text-[13px] text-mute">30-second briefing ↗</a>
      </nav>
    </header>
  )
}
