"use client"

import { SmoothScroll } from "@/components/fx/smooth-scroll"
import { Cursor } from "@/components/fx/cursor"
import { Grain } from "@/components/fx/grain"
import { PageWipe } from "@/components/fx/page-wipe"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SmoothScroll />
      {children}
      <Cursor />
      <Grain />
      <PageWipe />
    </>
  )
}
