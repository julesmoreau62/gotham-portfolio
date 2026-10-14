"use client"

import { useEffect, useRef } from "react"
import { ArrowUpRight, FileDown, Mail } from "lucide-react"
import { CUE } from "@/lib/dossier"
import { PROFILE } from "@/lib/profile"
import { DOTS, paintGraticule, paintLand, paintPlanet, rotate } from "./globe"
import { decode, easeOut, hash, ramp, window01 } from "./timing"
import styles from "./dossier.module.css"

/* NEXT MISSION (SEG09) — the brief for the next posting, the whole
   planet lit up for "anywhere around the world", and a way to make
   contact that works while the film is still running. */

const { mission } = CUE

const PALETTE = [...Array.from({ length: 6 }, (_, k) => `rgba(242,241,236,${0.1 + k * 0.07})`), "rgba(200,255,0,.45)", "rgba(200,255,0,.75)", "rgba(200,255,0,1)"]
/** Land dots that ping, picked once. */
const PINGS = Array.from({ length: 16 }, (_, k) => Math.floor(hash(k * 7.3 + 1) * DOTS.n))

function drawWorld(canvas: HTMLCanvasElement, t: number) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return
  const W = canvas.width, H = canvas.height, dpr = Math.min(devicePixelRatio || 1, 2)
  ctx.clearRect(0, 0, W, H)
  const since = t - mission.world.at
  const cam = { lon: -30 + since * 24, lat: 16, zoom: 1 }
  const grow = easeOut(ramp(t, mission.world.at - 0.3, mission.world.at + 0.5))
  const view = { cam, cx: W * 0.64, cy: H * 0.54, R: Math.min(H * 0.42, W * 0.3) * (0.7 + 0.3 * grow) }
  paintPlanet(ctx, view, dpr, 1, 1.2)
  paintGraticule(ctx, view, dpr)
  // "Anywhere": the lit area spreads across every continent.
  const lit = ramp(t, mission.world.at, mission.world.end + 0.8)
  paintLand(ctx, view, PALETTE, (i, z) => {
    const depth = Math.min(5, Math.floor(z * 6))
    if (DOTS.seed[i] > lit) return depth
    const wave = 0.5 + 0.5 * Math.sin(since * 3 + DOTS.seed[i] * 12)
    return wave > 0.8 ? 8 : wave > 0.45 ? 7 : 6
  })
  PINGS.forEach((i, k) => {
    const v: [number, number, number] = [DOTS.cosLat[i] * DOTS.sinLon[i], DOTS.sinLat[i], DOTS.cosLat[i] * DOTS.cosLon[i]]
    const r = rotate(v, cam)
    if (r[2] <= 0.1 || DOTS.seed[i] > lit) return
    const pulse = (((since + k * 0.37) % 1.6) + 1.6) % 1.6 / 1.6
    ctx.strokeStyle = `rgba(200,255,0,${(1 - pulse) * 0.9})`
    ctx.lineWidth = 1.2 * dpr
    ctx.beginPath(); ctx.arc(view.cx + view.R * r[0], view.cy - view.R * r[1], (3 + pulse * 18) * dpr, 0, Math.PI * 2); ctx.stroke()
  })
}

function WorldGlobe({ t }: { t: number }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const visible = ramp(t, mission.world.at - 0.3, mission.world.at + 0.3)
  useEffect(() => {
    const el = canvas.current
    if (!el || !visible) return
    const dpr = Math.min(devicePixelRatio || 1, 2)
    const w = Math.round(el.clientWidth * dpr), h = Math.round(el.clientHeight * dpr)
    if (el.width !== w || el.height !== h) { el.width = w; el.height = h }
    drawWorld(el, t)
  }, [t, visible])
  if (!visible) return null
  return <canvas ref={canvas} className={styles.worldCanvas} style={{ opacity: visible }} aria-hidden="true" />
}

const BRIEF = [
  { at: mission.objective.at, label: "OBJECTIVE", value: "DIGITAL TRANSFORMATION & AI" },
  { at: mission.sport, label: "THEATRE", value: "A SPORT ORGANISATION" },
  { at: mission.window.at, label: "WINDOW", value: "FEBRUARY → JUNE 2027" },
  { at: mission.world.at, label: "AREA", value: "ANYWHERE · WORLDWIDE" },
  { at: mission.recommend.at, label: "RECOMMENDATION", value: "MAKE CONTACT" },
]

/** The three ways to reach Jules, usable during the film and on the closing card. */
export function ContactActions({ className }: { className?: string }) {
  return (
    <div className={className ?? styles.contactActions}>
      <a href={`mailto:${PROFILE.email}`} className={styles.contactPrimary}><Mail size={16} aria-hidden="true" /> {PROFILE.email}</a>
      <a href={PROFILE.linkedin} target="_blank" rel="noreferrer"><ArrowUpRight size={16} aria-hidden="true" /> LinkedIn</a>
      <a href={PROFILE.cv} download><FileDown size={16} aria-hidden="true" /> CV · PDF</a>
    </div>
  )
}

export function MissionScene({ t }: { t: number }) {
  const visible = window01(t, mission.sought.at - 0.3, CUE.end + 30, 0.3)
  if (!visible) return null
  const contact = ramp(t, mission.contact.at, mission.contact.at + 0.3)
  return (
    <>
      <WorldGlobe t={t} />
      <div className={styles.board} style={{ opacity: visible }}>
        <div className={styles.brief} aria-hidden="true">
          <p className={styles.briefHead}><i />{decode("NEXT MISSION · SOUGHT", ramp(t, mission.sought.at, mission.sought.at + 0.5), t)}</p>
          {BRIEF.map(row => t >= row.at && (
            <div key={row.label} className={styles.briefRow} data-key={row.label === "RECOMMENDATION" || undefined} style={{ opacity: ramp(t, row.at, row.at + 0.25) }}>
              <span>{row.label}</span>
              <b>{decode(row.value, ramp(t, row.label === "RECOMMENDATION" ? mission.contact.at : row.at, (row.label === "RECOMMENDATION" ? mission.contact.at : row.at) + 0.6), t) || "…"}</b>
            </div>
          ))}
        </div>
        {contact > 0 && (
          <div className={styles.contact} style={{ opacity: contact, transform: `translateY(${(1 - easeOut(contact)) * 20}px)` }}>
            <h3 aria-hidden="true">{decode("MAKE CONTACT", ramp(t, mission.contact.at, mission.contact.at + 0.5), t)}</h3>
            <ContactActions />
          </div>
        )}
        {t >= mission.out.at && (
          <p className={styles.transmission} aria-hidden="true">{decode("END OF TRANSMISSION", ramp(t, mission.out.at, mission.out.end), t)}<i className={styles.caret} /></p>
        )}
      </div>
    </>
  )
}
