/* ------------------------------------------------------------------
   QUALITY — "full" everywhere, unless the device can't keep up. A
   machine without GPU rendering, or one that stays under 40 fps for
   two seconds in a row, switches to "lite": the heavy canvases run
   slower and skip their glows. The switch lasts for the tab session,
   and the visitor can force full quality back from the badge.
   ------------------------------------------------------------------ */

export type Quality = "full" | "lite"
export type QualityState = { quality: Quality; forced: boolean; dismissed: boolean }

const KEY = "jm-quality-v1"
/** One-second windows; two bad ones in a row mean the device is slow. */
const WINDOW_MS = 1000
const BAD_WINDOWS = 2
const MIN_FPS = 40
/** Share of a window spent in frames slower than 20 fps. */
const MAX_STALL = 0.25
/** Page load and hydration are always janky: start watching after this. */
const SETTLE_MS = 1500

let state: QualityState = { quality: "full", forced: false, dismissed: false }
const listeners = new Set<() => void>()

export const getQuality = () => state
export const isLite = () => state.quality === "lite"
/** A canvas glow radius, or none in lite mode. */
export const glow = (px: number) => (state.quality === "lite" ? 0 : px)

export function subscribeQuality(listener: () => void) {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

function update(next: Partial<QualityState>) {
  state = { ...state, ...next }
  if (state.quality === "lite") document.documentElement.dataset.quality = "lite"
  else delete document.documentElement.dataset.quality
  try { sessionStorage.setItem(KEY, JSON.stringify(state)) } catch {}
  listeners.forEach(listener => listener())
}

/** The visitor's own choice from the badge; automatic detection stops. */
export function chooseQuality(quality: Quality) {
  update({ quality, forced: true })
}

export function dismissQualityBadge() {
  update({ dismissed: true })
}

/** True when the browser would render WebGL in software: no usable GPU. */
function softwareRendering() {
  try {
    const probe = document.createElement("canvas")
    const gl = probe.getContext("webgl")
    // WebGL off entirely says nothing about speed: leave it to the frame watch.
    if (!gl) return false
    gl.getExtension("WEBGL_lose_context")?.loseContext()
    const fast = document.createElement("canvas").getContext("webgl", { failIfMajorPerformanceCaveat: true })
    fast?.getExtension("WEBGL_lose_context")?.loseContext()
    return !fast
  } catch {
    return false
  }
}

/** Starts detection once per page load; returns a cleanup. */
export function watchQuality() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(KEY) ?? "null") as QualityState | null
    if (saved?.quality === "full" || saved?.quality === "lite") update(saved)
  } catch {}
  // Reduced motion already stills every animation; a forced or detected lite mode is settled.
  if (state.forced || state.quality === "lite" || matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {}

  let frame = 0, timer = 0
  let start = 0, last = 0, frames = 0, stall = 0, bad = 0
  const downgrade = () => {
    if (state.forced || state.quality === "lite") return
    update({ quality: "lite" })
    stop()
  }
  const tick = (now: number) => {
    frame = requestAnimationFrame(tick)
    const gap = now - last
    last = now
    // A hidden tab, a sleep or a debugger pause is not slowness: start the window over.
    if (document.hidden || gap > 500 || !start) { start = now; frames = 0; stall = 0; return }
    frames++
    if (gap > 50) stall += gap
    const span = now - start
    if (span < WINDOW_MS) return
    const slow = (frames * 1000) / span < MIN_FPS || stall / span > MAX_STALL
    bad = slow ? bad + 1 : 0
    if (bad >= BAD_WINDOWS) downgrade()
    start = now; frames = 0; stall = 0
  }
  const begin = () => {
    timer = window.setTimeout(() => {
      if (softwareRendering()) { downgrade(); return }
      frame = requestAnimationFrame(tick)
    }, SETTLE_MS)
  }
  const stop = () => {
    cancelAnimationFrame(frame)
    window.clearTimeout(timer)
    window.removeEventListener("load", begin)
  }
  if (document.readyState === "complete") begin()
  else window.addEventListener("load", begin, { once: true })
  return stop
}
