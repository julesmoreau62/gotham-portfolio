"use client"

import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react"
import { Captions, Pause, Play, Volume2, VolumeX, X } from "lucide-react"
import { CUE, DOSSIER_DURATION, SEGMENTS } from "@/lib/dossier"
import { decode, pad, ramp, timecode, typed } from "./timing"
import styles from "./dossier.module.css"

/* HUD — the surveillance frame around the film: chapter, timecode,
   the voice on an oscilloscope, the operations log, subtitles and the
   transport controls. */

const PLACE_NAMES = ["FRANCE", "FRENCH GUIANA", "CORSICA", "NEW CALEDONIA", "CONGO-BRAZZAVILLE", "FRANCE"]

const LOG = [
  { at: 0.3, text: "SECURE LINK ESTABLISHED" },
  { at: CUE.search.at, text: "FACIAL INDEX QUERY STARTED" },
  { at: CUE.name.end, text: "NAME FILTER APPLIED" },
  { at: CUE.match.at, text: "SUBJECT IDENTIFIED · 99.2%" },
  { at: CUE.rebuild.at, text: "CROSS-REFERENCING TRAVEL RECORDS" },
  { at: CUE.unusual.at, text: "ANOMALY FLAGGED · MOBILITY" },
  ...CUE.places.map((place, i) => ({ at: place.at, text: `LOCATION ${pad(i + 1)} CONFIRMED · ${PLACE_NAMES[i]}` })),
  { at: CUE.interest.at, text: "BEHAVIOURAL SCAN STARTED" },
  { at: CUE.gaming.at, text: "INTEREST MATCHED · COMPETITIVE GAMING" },
  { at: CUE.game.at, text: "WEIGHT · MATCH OUTCOME · LOW" },
  { at: CUE.around.at, text: "WEIGHT · ECOSYSTEM · HIGH" },
  { at: CUE.field.year.at, text: "FIELD RECORD OPENED · 2022" },
  { at: CUE.field.opal, text: "BASE CONFIRMED · OPAL COAST" },
  { at: CUE.field.navy.at, text: "SERVICE RECORD · FRENCH NAVY RESERVE" },
  { at: CUE.field.club.at, text: "ASSIGNMENT · AS NORTKERQUE 95" },
  { at: CUE.field.views.at, text: "REACH VERIFIED · 1M+ VIEWS" },
  { at: CUE.field.ctrUp, text: "SPONSOR CTR · +467%" },
  { at: CUE.kourou.signal.at, text: "NEW SIGNAL · FRENCH GUIANA" },
  { at: CUE.kourou.done.at, text: "OPERATION KOUROU · COMPLETE" },
  { at: CUE.lille.move.at, text: "RELOCATION · LILLE" },
  { at: CUE.lille.comms.at, text: "ASSIGNMENT · ASI TOURNAMENT" },
  { at: CUE.lille.incidents.at, text: "ALERT · 2 CRITICAL INCIDENTS" },
  { at: CUE.lille.zero.at, text: "INCIDENTS CLOSED · 0 DISRUPTION" },
  { at: CUE.daring.border.at, text: "BORDER CROSSING · FR → BE" },
  { at: CUE.daring.join.at, text: "ASSIGNMENT · ROYAL DARING HC" },
  { at: CUE.daring.handover.at, text: "HANDOVER SYSTEM · DELIVERED" },
  { at: CUE.shift.shift.at, text: "PROFILE SHIFT DETECTED" },
  { at: CUE.shift.engine.at, text: "RESEARCH ENGINE · 90 SOURCES / DAY" },
  { at: CUE.shift.thesis.at, text: "THESIS · GENERATIVE AI IN SPORT" },
  { at: CUE.mission.sought.at, text: "NEXT MISSION · BRIEF OPENED" },
  { at: CUE.mission.contact.at, text: "RECOMMENDATION · MAKE CONTACT" },
  { at: CUE.mission.out.at, text: "END OF TRANSMISSION" },
]

function chapterAt(t: number) {
  let index = 0
  SEGMENTS.forEach((segment, i) => { if (t >= segment.start - 0.4) index = i })
  return index
}

/** The narrator's voice, live, as a waveform. */
function VoiceScope({ analyser, t }: { analyser: AnalyserNode | null; t: number }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const data = useRef<Uint8Array<ArrayBuffer> | null>(null)
  useEffect(() => {
    const el = canvas.current
    if (!el) return
    const dpr = Math.min(devicePixelRatio || 1, 2)
    if (el.width !== el.clientWidth * dpr) { el.width = el.clientWidth * dpr; el.height = el.clientHeight * dpr }
    const ctx = el.getContext("2d")!
    ctx.clearRect(0, 0, el.width, el.height)
    ctx.strokeStyle = "rgba(242,241,236,.12)"
    ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(0, el.height / 2); ctx.lineTo(el.width, el.height / 2); ctx.stroke()
    if (!analyser) return
    if (!data.current || data.current.length !== analyser.fftSize) data.current = new Uint8Array(analyser.fftSize)
    analyser.getByteTimeDomainData(data.current)
    const samples = data.current
    ctx.strokeStyle = "#c8ff00"
    ctx.shadowColor = "#c8ff00"
    ctx.shadowBlur = 6 * dpr
    ctx.lineWidth = 1.3 * dpr
    ctx.beginPath()
    for (let x = 0; x < el.width; x++) {
      const v = (samples[Math.floor((x / el.width) * samples.length)] - 128) / 128
      const y = el.height / 2 + v * el.height * 1.6
      if (x) ctx.lineTo(x, y); else ctx.moveTo(x, y)
    }
    ctx.stroke()
  }, [analyser, t])
  return <canvas ref={canvas} className={styles.scope} />
}

export function Hud({ t, analyser }: { t: number; analyser: AnalyserNode | null }) {
  const index = chapterAt(t)
  const segment = SEGMENTS[index]
  const label = `${pad(index + 1)} / ${segment.chapter.toUpperCase()}`
  const entries = LOG.filter(entry => t >= entry.at).slice(-6)
  return (
    <div className={styles.hud} aria-hidden="true">
      <div className={styles.hudTop}>
        <span className={styles.rec}><i />REC · DOSSIER JM-0624 · EYES ONLY</span>
        <span className={styles.chapter}>{decode(label, ramp(t, segment.start - 0.4, segment.start + 0.1), t)}</span>
        <span>T+{timecode(t)}</span>
      </div>
      <div className={styles.intercept}>
        <span>AUDIO INTERCEPT · TARGET VOICE</span>
        <VoiceScope analyser={analyser} t={t} />
      </div>
      <ol className={styles.log}>
        {entries.map((entry, i) => (
          <li key={entry.text + entry.at} style={{ opacity: 0.3 + (0.7 * (i + 1)) / entries.length }}>
            <span>{timecode(entry.at).slice(0, 5)}</span> {typed(entry.text, ramp(t, entry.at, entry.at + 0.35))}
          </li>
        ))}
      </ol>
      <span className={styles.corner} data-at="tl" /><span className={styles.corner} data-at="tr" />
      <span className={styles.corner} data-at="bl" /><span className={styles.corner} data-at="br" />
    </div>
  )
}

export function Subtitles({ t }: { t: number }) {
  const line = SEGMENTS.flatMap(segment => segment.lines).find(l => t >= l.at - 0.05 && t <= l.end + 0.5)
  return (
    <p className={styles.subtitle} aria-live="off">
      {line && <span>{typed(line.text, ramp(t, line.at - 0.05, line.end - 0.1))}</span>}
    </p>
  )
}

export function Controls({ t, paused, captions, muted, onToggle, onSeek, onCaptions, onMute, onExit }: {
  t: number
  paused: boolean
  captions: boolean
  muted: boolean
  onToggle: () => void
  onSeek: (t: number) => void
  onCaptions: () => void
  onMute: () => void
  onExit: () => void
}) {
  const seek = (event: ReactPointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    onSeek(((event.clientX - box.left) / box.width) * DOSSIER_DURATION)
  }
  return (
    <div className={styles.controls}>
      <button type="button" onClick={onToggle} aria-label={paused ? "Play" : "Pause"}>{paused ? <Play size={16} /> : <Pause size={16} />}</button>
      <div className={styles.track} onPointerDown={seek} role="slider" aria-label="Position in the dossier" aria-valuemin={0} aria-valuemax={Math.round(DOSSIER_DURATION)} aria-valuenow={Math.round(t)} tabIndex={-1}>
        <span className={styles.trackFill} style={{ transform: `scaleX(${t / DOSSIER_DURATION})` }} />
        {SEGMENTS.map(segment => <i key={segment.id} style={{ left: `${(segment.start / DOSSIER_DURATION) * 100}%` }} />)}
      </div>
      <span className={styles.clock}>{timecode(t).slice(0, 5)} / {timecode(DOSSIER_DURATION).slice(0, 5)}</span>
      <button type="button" onClick={onCaptions} aria-pressed={captions} aria-label="Subtitles"><Captions size={16} /></button>
      <button type="button" onClick={onMute} aria-pressed={muted} aria-label={muted ? "Unmute" : "Mute"}>{muted ? <VolumeX size={16} /> : <Volume2 size={16} />}</button>
      <button type="button" onClick={onExit} aria-label="Exit the dossier"><X size={16} /></button>
    </div>
  )
}
