import { onoFonts } from "@/components/contracts/thesis-font"
import styles from "./ono-backdrop.module.css"

/* Kept out of the "use client" backdrop so the server page receives plain class strings. */

/** The Ono-Sendai skin for the contract shell: the landing's fonts and frame, its hero title and role line. */
export const onoSkin = {
  className: `${onoFonts} ${styles.frame}`,
  title: styles.title,
  role: styles.role,
}
