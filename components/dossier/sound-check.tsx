"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { DOSSIER_DURATION } from "@/lib/dossier"
import type { DossierEngine } from "./audio-engine"
import styles from "./dossier.module.css"

/* SOUND CHECK — nobody gets the narration at full blast: the visitor
   hears the voice at its real level and sets the volume first. */

const BARS = 24

export function SoundCheck({ engine, loaded, volume, onVolume, onBegin }: {
  engine: DossierEngine | null
  loaded: number
  volume: number
  onVolume: (volume: number) => void
  onBegin: (muted: boolean) => void
}) {
  const meter = useRef<HTMLDivElement>(null)
  const [tested, setTested] = useState(false)
  const ready = loaded >= 1
  const minutes = Math.floor(DOSSIER_DURATION / 60)
  const seconds = String(Math.round(DOSSIER_DURATION % 60)).padStart(2, "0")

  // The level meter reads the master output, so it moves with the test signal.
  useEffect(() => {
    const analyser = engine?.analyser
    if (!analyser) return
    const data = new Uint8Array(analyser.frequencyBinCount)
    let frame = 0
    const draw = () => {
      frame = requestAnimationFrame(draw)
      analyser.getByteFrequencyData(data)
      const bars = meter.current?.children
      if (!bars) return
      for (let i = 0; i < BARS; i++) {
        const v = data[Math.floor((i / BARS) * data.length * 0.6)] / 255
        ;(bars[i] as HTMLElement).style.transform = `scaleY(${0.06 + v * 0.94})`
      }
    }
    frame = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frame)
  }, [engine])

  const test = async () => {
    if (!engine) return
    await engine.unlock()
    engine.testSignal()
    setTested(true)
  }

  return (
    <div className={styles.gate}>
      <div className={styles.gatePanel}>
        <p className={styles.gateKicker}><i /> INCOMING TRANSMISSION · CLASSIFIED</p>
        <h1 className={styles.gateTitle}>Subject file:<br />Jules Moreau</h1>
        <p className={styles.gateCopy}>This dossier is narrated. Set a comfortable volume before the decryption starts.</p>
        <p className={styles.desktopNote}><b>DESKTOP ONLY ·</b> This file is built for a computer screen. Open it on a laptop or desktop for the full experience.</p>

        <div className={styles.calibration}>
          <div className={styles.calRow}>
            <span>01 · TEST SIGNAL</span>
            <button type="button" onClick={test} disabled={!ready} className={styles.testButton}>
              {ready ? (tested ? "▶ Play again" : "▶ Play the test voice") : `Decrypting archive ${Math.round(loaded * 100)}%`}
            </button>
          </div>
          <div className={styles.meter} ref={meter} aria-hidden="true">
            {Array.from({ length: BARS }, (_, i) => <span key={i} />)}
          </div>
          <label className={styles.calRow}>
            <span>02 · VOLUME <b>{Math.round(volume * 100)}%</b></span>
            <input type="range" min={0} max={1} step={0.01} value={volume} onChange={event => onVolume(Number(event.target.value))} className={styles.volume} />
          </label>
        </div>

        <button type="button" className={styles.begin} disabled={!ready} onClick={() => onBegin(false)}>
          Begin decryption <span aria-hidden="true">▸</span>
        </button>
        <button type="button" className={styles.silent} disabled={!ready} onClick={() => onBegin(true)}>
          No sound? Watch with subtitles
        </button>
        <p className={styles.gateMeta}>{minutes ? `${minutes} min ${seconds}` : `${seconds} s`} · headphones recommended · Space to pause · Esc to leave</p>
      </div>
      <Link href="/" className={styles.gateBack}>← Back to the portfolio</Link>
    </div>
  )
}
