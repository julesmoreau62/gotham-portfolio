/* Pure helpers: every visual is a function of the film's time, so pausing
   and seeking render exactly the same frame. */

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v))

/** 0 before `from`, 1 after `to`, linear in between. */
export const ramp = (t: number, from: number, to: number) => clamp((t - from) / (to - from))

export const lerp = (a: number, b: number, p: number) => a + (b - a) * p

export const easeIn = (p: number) => p * p * p
export const easeOut = (p: number) => 1 - Math.pow(1 - p, 3)
export const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2)

/** Visible between `from` and `to`, fading over `fade` seconds at both ends. */
export const window01 = (t: number, from: number, to: number, fade = 0.25) =>
  Math.min(ramp(t, from, from + fade), 1 - ramp(t, to - fade, to))

/** A stable pseudo-random number in [0, 1) for an integer seed. */
export const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/<>[]=_-"

/** Text decoding left to right: locked characters, then noise that changes every frame. */
export function decode(text: string, p: number, t: number) {
  if (p >= 1) return text
  if (p <= 0) return ""
  const locked = Math.floor(p * text.length)
  const tick = Math.floor(t * 30)
  let out = ""
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (i < locked || ch === " ") out += ch
    else if (i < locked + 6) out += GLYPHS[Math.floor(hash(i * 13 + tick) * GLYPHS.length)]
  }
  return out
}

/** Typewriter text for progress p. */
export const typed = (text: string, p: number) => text.slice(0, Math.round(clamp(p) * text.length))

export const pad = (n: number, size = 2) => String(Math.floor(n)).padStart(size, "0")

export const timecode = (t: number) => `${pad(t / 60)}:${pad(t % 60)}.${pad((t % 1) * 100)}`
