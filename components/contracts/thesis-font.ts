import { Instrument_Serif } from "next/font/google"

/** The thesis voice: an editorial serif used only by the Thesis Engine case and its intro. */
export const thesisSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
})
