"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import styles from "./ono-backdrop.module.css"

/** The landing page's black hole, looping behind the Ono-Sendai hero. NASA visualisation, credited as on the landing. */
export function OnoBackdrop() {
  const [playing, setPlaying] = useState(false)
  return (
    <div className={styles.stage}>
      <video
        className={cn(styles.video, playing && styles.videoOn)}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
        onPlaying={() => setPlaying(true)}
      >
        <source src="/assets/ono-sendai/blackhole.webm" type="video/webm" />
      </video>
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />
      <p className={styles.credit}>
        Visualisation: <a href="https://svs.gsfc.nasa.gov/13326" target="_blank" rel="noopener noreferrer">NASA Goddard / J.&nbsp;Schnittman</a>
      </p>
    </div>
  )
}
