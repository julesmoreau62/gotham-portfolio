"use client"

import { SmoothScroll } from "@/components/fx/smooth-scroll"
import { Cursor } from "@/components/fx/cursor"
import { Grain } from "@/components/fx/grain"
import { PageWipe } from "@/components/fx/page-wipe"
import { MotionConfig } from "framer-motion"
import { useReducedMotion } from "@/hooks/use-media"

export function Providers({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion()
  return (
    <MotionConfig reducedMotion={reduced ? "always" : "never"}>
      <SmoothScroll />
      {children}
      <Cursor />
      <Grain />
      <PageWipe />
    </MotionConfig>
  )
}
