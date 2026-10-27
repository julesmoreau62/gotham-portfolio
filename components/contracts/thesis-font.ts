import { Instrument_Sans, Martian_Mono, Newsreader } from "next/font/google"

/* The Ono-Sendai voice, taken from its landing page: the app speaks in
   Martian Mono, explains in Instrument Sans, and quotes in Newsreader. */

const onoMono = Martian_Mono({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-ono-mono",
  display: "swap",
})

const onoSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-ono-sans",
  display: "swap",
})

const onoSerif = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-serif",
  display: "swap",
})

/** Class string that exposes the three Ono-Sendai font variables to a subtree. */
export const onoFonts = [onoMono.variable, onoSans.variable, onoSerif.variable].join(" ")
