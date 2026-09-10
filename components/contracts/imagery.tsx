"use client"

import Image from "next/image"
import { useCallback, useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Section, Stats, Chips, Note } from "@/components/contracts/cs"
import { Reveal } from "@/components/fx/reveal"
import { cn, pad2 } from "@/lib/utils"

type Photo = { src: string; title: string; cat: "corporate" | "events" | "sport"; set: string }

const BASE = "/assets/photo"
const mk = (prefix: string, n: number, cat: Photo["cat"], set: string, title: string): Photo[] =>
  Array.from({ length: n }, (_, i) => ({ src: `${BASE}/${prefix}-${i + 1}.jpg`, title: `${title}_${pad2(i + 1)}`, cat, set }))

const PHOTOS: Photo[] = [
  ...mk("corporate", 15, "corporate", "Corporate & industrial", "CORP_INDUS"),
  ...mk("asi", 5, "events", "ASI tournament", "ASI_EVENT"),
  ...mk("football", 10, "sport", "Football", "FOOTBALL_MATCH"),
  ...mk("golf", 6, "sport", "Golf", "GOLF_TOUR"),
  ...mk("kite", 8, "sport", "Kitesurf", "KITESURF_OPS"),
  ...mk("volleyball", 6, "sport", "Volleyball", "VOLLEY_CHAMP"),
]

const SECTORS = [
  { id: "all", label: "All sectors" },
  { id: "corporate", label: "Corporate" },
  { id: "events", label: "Events" },
  { id: "sport", label: "Sport" },
] as const

const SPANS = [
  "md:col-span-2 md:row-span-2",
  "",
  "",
  "md:col-span-2",
  "",
  "md:row-span-2",
  "",
  "",
  "md:col-span-2",
  "",
]

export function ImageryCase() {
  const [sector, setSector] = useState<(typeof SECTORS)[number]["id"]>("all")
  const [open, setOpen] = useState<number | null>(null)

  const list = useMemo(() => (sector === "all" ? PHOTOS : PHOTOS.filter((p) => p.cat === sector)), [sector])

  const go = useCallback(
    (d: number) => {
      setOpen((o) => (o === null ? null : (o + d + list.length) % list.length))
    },
    [list.length]
  )

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (!["Escape", "ArrowRight", "ArrowLeft"].includes(e.key)) return
      e.preventDefault()
      e.stopPropagation()
      if (e.key === "Escape") {
        setOpen(null)
      }
      if (e.key === "ArrowRight") go(1)
      if (e.key === "ArrowLeft") go(-1)
    }
    window.addEventListener("keydown", onKey, true)
    return () => window.removeEventListener("keydown", onKey, true)
  }, [open, go])

  return (
    <>
      <Section n="01" kicker="Archive hub" title="Fifty frames, three sectors" intro="Industrial and corporate environments, tournament coverage, and action sports. Shot on a Sony α6400 (E 18-135mm f/3.5-5.6, SEL70350G) and two GoPros; edited in Lightroom and Premiere. RAW backups on site.">
        <Stats items={[{ v: PHOTOS.length, l: "Total files" }, { v: "3", l: "Sectors" }, { v: "50+", l: "Field shots" }, { v: "6", l: "Series" }]} />

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {SECTORS.map((s) => {
              const on = sector === s.id
              const count = s.id === "all" ? PHOTOS.length : PHOTOS.filter((p) => p.cat === s.id).length
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSector(s.id)}
                  className={cn("label h-9 px-4 border transition-colors", on ? "bg-ink text-black border-ink" : "border-line text-mute hover:text-ink hover:border-ink")}
                >
                  {s.label} <span className={on ? "text-black/60" : "text-dim"}>{pad2(count)}</span>
                </button>
              )
            })}
          </div>
          <span className="label text-mute">Click to open · arrows to navigate · ESC to close</span>
        </div>

        <motion.div layout className="mt-6 grid grid-cols-2 gap-2 md:grid-cols-4 md:auto-rows-[180px] lg:auto-rows-[220px]">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.button
                layout
                key={p.src}
                type="button"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.2, 1, 0.3, 1] }}
                onClick={() => setOpen(i)}
                className={cn("group relative aspect-square md:aspect-auto overflow-hidden border border-line bg-black", SPANS[i % SPANS.length])}
                data-cursor="view"
              >
                <Image src={p.src} alt={p.title} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover grayscale-[35%] transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" />
                <span className="absolute left-2 top-2 label bg-black/70 px-2 py-1 text-ink/80 opacity-0 group-hover:opacity-100 transition-opacity">{p.title}</span>
                <span className="absolute bottom-2 right-2 label bg-black/70 px-2 py-1 text-acid opacity-0 group-hover:opacity-100 transition-opacity">{p.set}</span>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>

        <Reveal className="mt-10">
          <Chips items={["Sony α6400", "E 18-135mm", "SEL70350G", "GoPro ×2", "Lightroom", "Premiere", "JPEG · RAW backup"]} />
        </Reveal>
        <Note className="mt-6">
          Corporate: industrial and corporate photography, professional environments, product shots. Events: ASI
          Tournament, matchday operations, competition documentation. Sport: football, golf, kitesurfing, volleyball
          across multiple events. Archive: declassified.
        </Note>
      </Section>

      <AnimatePresence>
        {open !== null && list[open] && (
          <motion.div
            className="fixed inset-0 z-[180] flex flex-col bg-bg/95 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
            data-lenis-prevent
          >
            <div className="flex h-12 items-center justify-between border-b border-line px-4 md:px-6">
              <div className="flex items-center gap-3 label">
                <span className="text-acid">{list[open].title}</span>
                <span className="text-mute">
                  {pad2(open + 1)} / {pad2(list.length)}
                </span>
                <span className="text-mute hidden sm:inline">· {list[open].set}</span>
              </div>
              <button type="button" onClick={() => setOpen(null)} className="label border border-line px-3 py-1.5 hover:bg-ink hover:text-black transition-colors" data-cursor="close">
                Close
              </button>
            </div>
            <div className="relative flex flex-1 items-center justify-center p-4 md:p-8">
              <button type="button" onClick={() => go(-1)} className="absolute left-3 md:left-6 z-10 grid h-11 w-11 place-items-center border border-line bg-bg/70 hover:bg-ink hover:text-black transition-colors" aria-label="Previous" data-cursor="prev">
                ←
              </button>
              <button type="button" onClick={() => go(1)} className="absolute right-3 md:right-6 z-10 grid h-11 w-11 place-items-center border border-line bg-bg/70 hover:bg-ink hover:text-black transition-colors" aria-label="Next" data-cursor="next">
                →
              </button>
              <AnimatePresence mode="wait">
                <motion.div
                  key={list[open].src}
                  className="relative h-full w-full max-w-6xl frame"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image src={list[open].src} alt={list[open].title} fill sizes="100vw" className="object-contain" priority />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex h-9 items-center justify-between border-t border-line px-4 label text-mute md:px-6">
              <span>
                Sector: <span className="text-ink uppercase">{list[open].cat}</span>
              </span>
              <span>ESC to close // arrows to navigate</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
