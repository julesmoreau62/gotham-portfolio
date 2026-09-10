"use client"

import { motion, useInView, type Variants } from "framer-motion"
import { useRef } from "react"
import { cn } from "@/lib/utils"

const EASE = [0.2, 1, 0.3, 1] as const

/** Fade + rise when scrolled into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  once = true,
  amount = 0.2,
  as: Tag = "div",
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  y?: number
  once?: boolean
  amount?: number
  as?: "div" | "section" | "li" | "span" | "p" | "article"
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once, amount })
  const M = motion[Tag] as typeof motion.div
  return (
    <M
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </M>
  )
}

/** Line-by-line masked reveal for display headlines. */
export function Lines({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.08,
  as: Tag = "h2",
  play,
}: {
  lines: (string | React.ReactNode)[]
  className?: string
  lineClassName?: string
  delay?: number
  stagger?: number
  as?: "h1" | "h2" | "h3" | "p" | "div"
  /** Force play (e.g. after boot). When undefined, plays on scroll into view. */
  play?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const active = play ?? inView
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  }
  const line: Variants = {
    hidden: { y: "125%", rotate: 1.5 },
    show: { y: "0%", rotate: 0, transition: { duration: 0.95, ease: EASE } },
  }
  const M = motion[Tag] as typeof motion.div
  return (
    <M ref={ref} className={className} variants={container} initial="hidden" animate={active ? "show" : "hidden"}>
      {lines.map((l, i) => (
        <span key={i} className="block [clip-path:inset(-0.15em_-100vw_-0.12em_-100vw)]">
          <motion.span variants={line} className={cn("block origin-left will-change-transform", lineClassName)}>
            {l}
          </motion.span>
        </span>
      ))}
    </M>
  )
}

/** Clip-path wipe reveal for media blocks. */
export function Wipe({
  children,
  className,
  delay = 0,
  from = "bottom",
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  from?: "bottom" | "left" | "top"
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.25 })
  const hidden =
    from === "bottom"
      ? "inset(100% 0 0 0)"
      : from === "top"
        ? "inset(0 0 100% 0)"
        : "inset(0 100% 0 0)"
  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={{ clipPath: hidden }}
        animate={{ clipPath: inView ? "inset(0 0 0 0)" : hidden }}
        transition={{ duration: 1.1, ease: EASE, delay }}
      >
        {children}
      </motion.div>
    </div>
  )
}

/** Stagger children (each child wrapped) */
export function Stagger({
  children,
  className,
  stagger = 0.06,
  delay = 0,
  amount = 0.15,
}: {
  children: React.ReactNode[]
  className?: string
  stagger?: number
  delay?: number
  amount?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {children.map((c, i) => (
        <motion.div
          key={i}
          variants={{
            hidden: { opacity: 0, y: 18 },
            show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
          }}
        >
          {c}
        </motion.div>
      ))}
    </motion.div>
  )
}
