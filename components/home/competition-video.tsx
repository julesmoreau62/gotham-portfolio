"use client"

import { useEffect, useRef, useState } from "react"
import MuxVideo from "@mux/mux-video-react"
import { useInView } from "framer-motion"
import { Pause, Play } from "lucide-react"
import { GAMES_BACKGROUND_POSTER, GAMES_MUX_PLAYBACK_ID } from "@/lib/games"
import { COPY } from "@/lib/copy"
import type { Locale } from "@/lib/i18n"
import styles from "./journey.module.css"

export function CompetitionVideo({ locale = "en" }: { locale?: Locale }) {
  const t = COPY[locale].story.video
  const frameRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement | undefined>(undefined)
  const inView = useInView(frameRef, { amount: 0.15 })
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [automaticPlayback, setAutomaticPlayback] = useState(false)
  const [requestedPlayback, setRequestedPlayback] = useState<boolean | null>(null)
  const [pageVisible, setPageVisible] = useState(true)
  const shouldPlay = inView && pageVisible && !failed && (requestedPlayback ?? automaticPlayback)

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)")
    const connection = (navigator as Navigator & { connection?: EventTarget & { saveData?: boolean } }).connection
    const updatePreference = () => setAutomaticPlayback(!preference.matches && !connection?.saveData)
    const updateVisibility = () => setPageVisible(!document.hidden)
    updatePreference()
    updateVisibility()
    preference.addEventListener("change", updatePreference)
    connection?.addEventListener("change", updatePreference)
    document.addEventListener("visibilitychange", updateVisibility)
    return () => {
      preference.removeEventListener("change", updatePreference)
      connection?.removeEventListener("change", updatePreference)
      document.removeEventListener("visibilitychange", updateVisibility)
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (!shouldPlay) {
      video.pause()
      return
    }
    let active = true
    void video.play().catch(() => {
      if (active) setRequestedPlayback(false)
    })
    return () => {
      active = false
      video.pause()
    }
  }, [shouldPlay])

  return (
    <figure className={styles.originVisual}>
      <div className={styles.originVisualHeader}>
        <span><span className={styles.statusDot} /> {t.header}</span>
        <span>01 / CS2</span>
      </div>
      <div ref={frameRef} className={styles.originFilmFrame}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.originFilmPoster} src={GAMES_BACKGROUND_POSTER} alt="" loading="lazy" decoding="async" />
        <MuxVideo
          ref={videoRef}
          className={styles.originFilm}
          data-ready={ready}
          playbackId={GAMES_MUX_PLAYBACK_ID}
          streamType="on-demand"
          capRenditionToPlayerSize
          muted
          loop
          playsInline
          preload="none"
          disablePictureInPicture
          aria-hidden="true"
          tabIndex={-1}
          onLoadedData={() => setReady(true)}
          onPlaying={() => setReady(true)}
          onError={() => { setFailed(true); setReady(false) }}
        />
        {!failed && <button type="button" className={styles.originFilmControl} onClick={() => setRequestedPlayback(!shouldPlay)} aria-label={shouldPlay ? t.pause : t.play}>
          {shouldPlay ? <Pause size={14} /> : <Play size={14} />}
        </button>}
      </div>
      <figcaption className={styles.originFilmCaption}><span>{t.caption[0]}</span><span>{t.caption[1]}</span></figcaption>
    </figure>
  )
}
