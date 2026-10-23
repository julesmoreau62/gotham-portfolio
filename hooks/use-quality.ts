"use client"

import { useSyncExternalStore } from "react"
import { getQuality, subscribeQuality, type QualityState } from "@/lib/quality"

const SERVER: QualityState = { quality: "full", forced: false, dismissed: false }

/** The current rendering quality; always "full" on the server. */
export function useQuality() {
  return useSyncExternalStore(subscribeQuality, getQuality, () => SERVER)
}
