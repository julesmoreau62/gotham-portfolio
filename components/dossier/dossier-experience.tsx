"use client"

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react"
import { useRouter } from "next/navigation"
import { getLenis } from "@/components/fx/smooth-scroll"
import { CAREER_START, CUE, DOSSIER_DURATION } from "@/lib/dossier"
import { DossierEngine } from "./audio-engine"
import { EndScreen } from "./end-screen"
import { Backdrop } from "./backdrop"
import { BOARD_IMAGES } from "./board"
import { Controls, Hud, Subtitles } from "./hud"
import { IdCard } from "./id-card"
import { DaringScene } from "./scene-daring"
import { FieldScene } from "./scene-field"
import { GlobeScene } from "./scene-globe"
import { INTEREST_IMAGES, InterestScene } from "./scene-interest"
import { KourouScene } from "./scene-kourou"
import { LilleScene } from "./scene-lille"
import { Moments, focusAt } from "./moments"
import { MissionScene } from "./scene-mission"
import { BootScene, MatchFlash, SearchScene } from "./scene-search"
import { ShiftScene } from "./scene-shift"
import { SoundCheck } from "./sound-check"
import { Locator, Timeline } from "./timeline"
import { easeInOut, easeOut, hash, ramp } from "./timing"
import { isLite } from "@/lib/quality"
import styles from "./dossier.module.css"

/* ------------------------------------------------------------------
   DOSSIER EXPERIENCE — sound check, then the narrated file. The audio
   clock drives one render per frame; every scene derives its state
   from that time alone.
   ------------------------------------------------------------------ */

type Phase = "gate" | "live" | "end"

/** Moments that tear the picture, in global seconds. */
const GLITCHES = [
  CUE.search.at - 0.12, CUE.match.at, CUE.rebuild.at, CUE.childhood.at, CUE.interest.at - 0.15, CUE.gaming.at, CUE.around.at,
  CAREER_START - 0.2, CUE.kourou.signal.at, CUE.lille.incidents.at, CUE.daring.border.at, CUE.shift.shift.at, CUE.mission.world.at, CUE.mission.out.end,
]
/** Lite mode renders the film at about 30 fps; the audio clock keeps it in sync. */
const LITE_FRAME_MS = 1000 / 36
const FLASHES = [
  { at: 0, color: "#f2f1ec" },
  { at: CUE.match.at, color: "#c8ff00" },
  { at: CUE.unusual.at, color: "#ff2a3c" },
  { at: CUE.gaming.at, color: "#c8ff00" },
  { at: CUE.field.year.at, color: "#c8ff00" },
  { at: CUE.lille.incidents.at, color: "#ff2a3c" },
  { at: CUE.daring.border.at, color: "#f2f1ec" },
  { at: CUE.shift.shift.at, color: "#ff2a3c" },
  { at: CUE.mission.contact.at, color: "#c8ff00" },
]

function Glitch({ t }: { t: number }) {
  const at = GLITCHES.find(g => t >= g && t < g + 0.22)
  if (at === undefined) return null
  const seed = Math.floor(t * 45)
  return (
    <div className={styles.glitch} aria-hidden="true">
      {Array.from({ length: 7 }, (_, i) => (
        <span key={i} style={{
          top: `${hash(seed + i) * 100}%`,
          height: `${2 + hash(seed + i + 20) * 9}%`,
          transform: `translateX(${(hash(seed + i + 40) - 0.5) * 12}%)`,
          background: i % 3 === 0 ? "rgba(255,42,60,.18)" : i % 3 === 1 ? "rgba(200,255,0,.16)" : "rgba(242,241,236,.08)",
        }} />
      ))}
    </div>
  )
}

function Flash({ t }: { t: number }) {
  const flash = FLASHES.find(f => t >= f.at && t < f.at + 0.45)
  if (!flash) return null
  return <div className={styles.flash} style={{ background: flash.color, opacity: (1 - ramp(t, flash.at, flash.at + 0.45)) * 0.26 }} aria-hidden="true" />
}

export function DossierExperience() {
  const router = useRouter()
  const engine = useRef<DossierEngine | null>(null)
  const stage = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState<DossierEngine | null>(null)
  const [loaded, setLoaded] = useState(0)
  const [pictures, setPictures] = useState(0)
  const [phase, setPhase] = useState<Phase>("gate")
  const [t, setT] = useState(0)
  const [paused, setPaused] = useState(false)
  const [captions, setCaptions] = useState(true)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(0.6)
  const [size, setSize] = useState({ w: 1440, h: 900 })

  useEffect(() => {
    const instance = new DossierEngine()
    engine.current = instance
    setReady(instance)
    void instance.load(setLoaded)
    // Lets a review script freeze any frame: __dossier.pause(); __dossier.seek(12).
    if (process.env.NODE_ENV !== "production") (window as unknown as { __dossier: DossierEngine }).__dossier = instance
    return () => instance.dispose()
  }, [])

  // The evidence is fetched during the sound check, so no exhibit pops in late.
  useEffect(() => {
    let done = 0
    const sources = [...BOARD_IMAGES, ...INTEREST_IMAGES]
    const images = sources.map(src => {
      const image = new Image()
      image.onload = image.onerror = () => setPictures(++done / sources.length)
      image.src = src
      return image
    })
    return () => images.forEach(image => { image.onload = image.onerror = null })
  }, [])

  // The dossier owns the whole screen: no page scroll behind it.
  useEffect(() => {
    const root = document.documentElement
    const overflow = root.style.overflow
    const lenis = getLenis()
    root.style.overflow = "hidden"
    lenis?.stop()
    return () => {
      root.style.overflow = overflow
      lenis?.start()
    }
  }, [])

  useEffect(() => {
    const el = stage.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => setSize({ w: entry.contentRect.width, h: entry.contentRect.height }))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (phase !== "live") return
    let frame = 0, drawn = 0
    const loop = (now: number) => {
      frame = requestAnimationFrame(loop)
      const e = engine.current
      if (!e) return
      e.update()
      const time = e.time
      const ending = time >= DOSSIER_DURATION - 0.01
      if (!ending && isLite() && now - drawn < LITE_FRAME_MS) return
      drawn = now
      setT(time)
      if (ending) setPhase("end")
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [phase])

  const changeVolume = (value: number) => {
    setVolume(value)
    engine.current?.setVolume(value)
  }

  const begin = (silent: boolean) => {
    const e = engine.current
    if (!e) return
    void e.unlock()
    e.setMuted(silent)
    setMuted(silent)
    if (silent) setCaptions(true)
    // ?t=12 starts the film at 12 s, for reviewing a single moment.
    const from = Number(new URLSearchParams(window.location.search).get("t")) || 0
    e.start(from)
    setT(from)
    setPaused(false)
    setPhase("live")
  }

  const toggle = useCallback(() => {
    const e = engine.current
    if (!e) return
    if (e.paused) { void e.resume(); setPaused(false) } else { void e.pause(); setPaused(true) }
  }, [])

  const seek = useCallback((to: number) => {
    engine.current?.seek(to)
    setT(engine.current?.time ?? to)
    setPhase("live")
  }, [])

  const replay = () => {
    const e = engine.current
    if (!e) return
    if (e.paused) void e.resume()
    e.seek(0)
    setPaused(false)
    setPhase("live")
  }

  const toggleMute = useCallback(() => {
    setMuted(m => {
      engine.current?.setMuted(!m)
      return !m
    })
  }, [])

  const exit = useCallback(() => router.push("/"), [router])

  useEffect(() => {
    if (phase === "gate") return
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement) return
      if (event.key === " ") { event.preventDefault(); toggle() }
      else if (event.key === "Escape") exit()
      else if (event.key === "ArrowLeft") seek((engine.current?.time ?? 0) - 5)
      else if (event.key === "ArrowRight") seek((engine.current?.time ?? 0) + 5)
      else if (event.key.toLowerCase() === "c") setCaptions(c => !c)
      else if (event.key.toLowerCase() === "m") toggleMute()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [phase, toggle, seek, exit, toggleMute])

  // The film switches on like a cathode tube: a line that opens to the full screen.
  const on = phase === "gate" ? 1 : ramp(t, 0, 0.32)
  const power = on < 1 ? `scaleY(${0.004 + 0.996 * easeOut(on)})` : undefined
  // Once the transmission ends, the frame clears away while the camera dives into the closing screen.
  const outro = phase === "live" ? easeInOut(ramp(t, CUE.mission.out.end, CUE.mission.out.end + 0.7)) : 0
  const shake = FLASHES.some(f => t >= f.at && t < f.at + 0.25) ? `translate(${(hash(Math.floor(t * 60)) - 0.5) * 8}px, ${(hash(Math.floor(t * 60) + 7) - 0.5) * 8}px)` : undefined
  // A full-screen moment: the subject file slides away and the board steps back.
  const focus = phase === "gate" ? 0 : focusAt(t)

  return (
    <main className={styles.root} data-phase={phase} style={{ transform: power, "--focus": focus, "--outro": outro } as CSSProperties}>
      <h1 className="sr-only">Jules Moreau, narrated dossier</h1>
      <Backdrop running={!paused} />
      <div ref={stage} className={styles.stage} style={{ transform: shake }}>
        {phase === "live" && (
          <>
            <BootScene t={t} />
            <GlobeScene t={t} size={size} />
            <SearchScene t={t} />
            <InterestScene t={t} />
            <MissionScene t={t} />
            <div className={styles.desk} style={focus ? { opacity: 1 - focus * 0.9, transform: `scale(${1 - focus * 0.04})` } : undefined}>
              <Timeline t={t} />
              <FieldScene t={t} />
              <KourouScene t={t} />
              <LilleScene t={t} />
              <DaringScene t={t} />
              <ShiftScene t={t} />
            </div>
            <Moments t={t} size={size} />
            <div className={styles.side} style={focus || outro ? { transform: `translateX(${-focus * 40}vw)`, opacity: (1 - focus) * (1 - outro) } : undefined}>
              <IdCard t={t} />
              <Locator t={t} />
            </div>
            <MatchFlash t={t} />
          </>
        )}
      </div>
      {phase === "live" && (
        <>
          <Flash t={t} />
          <Glitch t={t} />
          <Hud t={t} analyser={ready?.scope ?? null} />
          {captions && <Subtitles t={t} />}
          <Controls t={t} paused={paused} captions={captions} muted={muted} onToggle={toggle} onSeek={seek} onCaptions={() => setCaptions(c => !c)} onMute={toggleMute} onExit={exit} />
        </>
      )}
      {/* The closing screen takes over from the very frame the film's dive ends on. */}
      {phase === "end" && <EndScreen onReplay={replay} sound={kind => engine.current?.play(kind)} />}
      {phase === "gate" && <SoundCheck engine={ready} loaded={loaded * 0.75 + pictures * 0.25} volume={volume} onVolume={changeVolume} onBegin={begin} />}
      <div className={styles.crt} aria-hidden="true" />
    </main>
  )
}
