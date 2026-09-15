"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { getLenis } from "@/components/fx/smooth-scroll"
import { hasContractEntrance } from "@/lib/contract-entrances"

const EVENT = "mrtn:wipe"
const BARS = 6
const IN_MS = 520

/** Trigger a full-screen wipe, then navigate. Falls back to a plain push. */
export function navigateWithWipe(href: string) {
  if (typeof window === "undefined") return
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (reduce) {
    window.location.assign(href)
    return
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: href }))
}

export function PageWipe() {
  const router = useRouter()
  const pathname = usePathname()
  const [state, setState] = useState<"idle" | "in" | "out">("idle")
  const pending = useRef<string | null>(null)
  const lastPath = useRef(pathname)

  useEffect(() => {
    const onWipe = (e: Event) => {
      const href = (e as CustomEvent<string>).detail
      if (state !== "idle") return
      // These cases own their entrance, including direct visits and reloads.
      const targetPath = href.split(/[?#]/)[0].replace(/\/$/, "")
      const slug = targetPath.startsWith("/contracts/") ? targetPath.slice("/contracts/".length) : ""
      if ((hasContractEntrance(slug) || targetPath === "/about/games") && targetPath !== pathname) {
        router.push(href)
        return
      }
      pending.current = href
      setState("in")
      getLenis()?.stop()
      window.setTimeout(() => {
        const [path, hash] = href.split("#")
        // Same path: just scroll, then release.
        if ((path || "/") === pathname) {
          setState("out")
          getLenis()?.start()
          if (hash) {
            const el = document.getElementById(hash)
            if (el) {
              const lenis = getLenis()
              if (lenis) {
                lenis.resize()
                lenis.scrollTo(el, { immediate: true, offset: -56 })
              }
              else el.scrollIntoView()
            }
          } else {
            window.scrollTo(0, 0)
          }
          return
        }
        router.push(href)
      }, IN_MS + 40)
    }
    window.addEventListener(EVENT, onWipe)
    return () => window.removeEventListener(EVENT, onWipe)
  }, [state, pathname, router])

  // Route changed: reveal the new page.
  useEffect(() => {
    if (lastPath.current === pathname) return
    lastPath.current = pathname
    if (state === "in") {
      getLenis()?.start()
      const hash = window.location.hash.replace("#", "")
      if (hash) {
        window.setTimeout(() => {
          const el = document.getElementById(hash)
          if (el) {
            const lenis = getLenis()
              if (lenis) {
                // The destination can be much taller than the page we just left.
                // Refresh the scroll limit before jumping to a deep section.
                lenis.resize()
                lenis.scrollTo(el, { immediate: true, offset: -56 })
              }
            else el.scrollIntoView()
          }
        }, 30)
      }
      const t = window.setTimeout(() => setState("out"), 60)
      return () => window.clearTimeout(t)
    }
  }, [pathname, state])

  // Finish the exit in its own effect so entering "out" cannot cancel this timer.
  useEffect(() => {
    if (state !== "out") return
    const timer = window.setTimeout(() => setState("idle"), IN_MS)
    return () => window.clearTimeout(timer)
  }, [state])

  if (state === "idle") return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[150]" aria-hidden="true">
      {Array.from({ length: BARS }, (_, i) => (
        <div
          key={i}
          className="absolute left-0 w-full"
          style={{
            top: `${(i / BARS) * 100}%`,
            height: `${100 / BARS + 0.2}%`,
            background: i % 2 === 0 ? "#000" : "#050505",
            transformOrigin: state === "in" ? "left" : "right",
            transform: state === "in" ? "scaleX(1)" : "scaleX(0)",
            transition: `transform ${IN_MS - 120}ms cubic-bezier(0.76, 0, 0.24, 1) ${i * 36}ms`,
          }}
        >
          <div
            className="absolute inset-y-0 w-2 bg-acid"
            style={{ [state === "in" ? "right" : "left"]: 0 }}
          />
        </div>
      ))}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          opacity: state === "in" ? 1 : 0,
          transition: `opacity 200ms ${state === "in" ? IN_MS - 160 : 0}ms`,
        }}
      >
        <span className="label text-acid">Loading contract</span>
      </div>
    </div>
  )
}

/** Anchor that plays the wipe before navigating (internal links only). */
export function WipeLink({
  href,
  children,
  className,
  onClick,
  ...rest
}: React.ComponentProps<typeof Link>) {
  return (
    <Link
      href={href}
      className={className}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented) return
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
        const target = typeof href === "string" ? href : href.pathname ?? "/"
        if (!target.startsWith("/")) return
        e.preventDefault()
        navigateWithWipe(target)
      }}
      {...rest}
    >
      {children}
    </Link>
  )
}
