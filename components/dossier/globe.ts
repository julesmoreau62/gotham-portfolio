import { WORLD_DOTS } from "@/lib/world-dots"
import { PLACES, type PlaceId } from "@/lib/journey"
import { easeInOut, hash, lerp, ramp } from "./timing"

/* ------------------------------------------------------------------
   GLOBE — the site's 2° land grid resampled to 1° and wrapped on a
   sphere, drawn on a canvas with an orthographic camera. Everything
   is a function of time so the film can be paused and scrubbed.
   ------------------------------------------------------------------ */

const RAD = Math.PI / 180

/** Land dots at 1°, thinned towards the poles so the density looks even on the sphere. */
export const DOTS = (() => {
  const { bits, cols, rows, step, lonStart, latStart } = WORLD_DOTS
  const bytes = Uint8Array.from(atob(bits), c => c.charCodeAt(0))
  const cell = (c: number, r: number) => {
    if (r < 0 || r >= rows) return 0
    const i = r * cols + ((c % cols) + cols) % cols
    return bytes[i >> 3] & (0x80 >> (i & 7)) ? 1 : 0
  }
  const lons: number[] = [], lats: number[] = []
  for (let lat = latStart + 0.5; lat > latStart - rows * step; lat -= 1) {
    for (let lon = -179.5; lon < 180; lon += 1) {
      const fc = (lon - lonStart) / step, fr = (latStart - lat) / step
      const c0 = Math.floor(fc), r0 = Math.floor(fr), dx = fc - c0, dy = fr - r0
      const v = lerp(lerp(cell(c0, r0), cell(c0 + 1, r0), dx), lerp(cell(c0, r0 + 1), cell(c0 + 1, r0 + 1), dx), dy)
      if (v < 0.5 || hash(lon * 7.13 + lat * 131.7) > Math.cos(lat * RAD)) continue
      lons.push(lon)
      lats.push(lat)
    }
  }
  const n = lons.length
  const data = { n, sinLon: new Float32Array(n), cosLon: new Float32Array(n), sinLat: new Float32Array(n), cosLat: new Float32Array(n), seed: new Float32Array(n) }
  for (let i = 0; i < n; i++) {
    data.sinLon[i] = Math.sin(lons[i] * RAD)
    data.cosLon[i] = Math.cos(lons[i] * RAD)
    data.sinLat[i] = Math.sin(lats[i] * RAD)
    data.cosLat[i] = Math.cos(lats[i] * RAD)
    data.seed[i] = hash(i * 3.7)
  }
  return data
})()

export type Vec = [number, number, number]

/** World unit vector: x east at lon 90°, y north, z out of the screen at lon 0°. */
export const toVec = (lon: number, lat: number): Vec => [Math.cos(lat * RAD) * Math.sin(lon * RAD), Math.sin(lat * RAD), Math.cos(lat * RAD) * Math.cos(lon * RAD)]

export const placeVec = (id: PlaceId) => toVec(PLACES[id].lon, PLACES[id].lat)

export const angleBetween = (a: Vec, b: Vec) => Math.acos(Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])))

/** Spherical interpolation between two unit vectors. */
export function slerp(a: Vec, b: Vec, s: number, omega = angleBetween(a, b)): Vec {
  if (omega < 1e-5) return a
  const k = Math.sin(omega)
  const wa = Math.sin((1 - s) * omega) / k, wb = Math.sin(s * omega) / k
  return [a[0] * wa + b[0] * wb, a[1] * wa + b[1] * wb, a[2] * wa + b[2] * wb]
}

export type Camera = { lon: number; lat: number; zoom: number }

/** Rotates a world vector into camera space: [x right, y up, z towards the viewer]. */
export function rotate(v: Vec, cam: Camera): Vec {
  const sl = Math.sin(cam.lon * RAD), cl = Math.cos(cam.lon * RAD)
  const sp = Math.sin(cam.lat * RAD), cp = Math.cos(cam.lat * RAD)
  const x1 = v[0] * cl - v[2] * sl
  const z1 = v[0] * sl + v[2] * cl
  return [x1, v[1] * cp - z1 * sp, v[1] * sp + z1 * cp]
}

export type Shot = Camera & { at: number; dur: number }

const shortest = (from: number, to: number) => ((to - from + 540) % 360) - 180

/** The camera at time t: eased moves between shots, pulling out on long flights. */
export function cameraAt(shots: Shot[], t: number): Camera {
  let i = 0
  while (i + 1 < shots.length && shots[i + 1].at <= t) i++
  const shot = shots[i]
  const prev = shots[Math.max(0, i - 1)]
  const p = shot.dur ? easeInOut(ramp(t, shot.at, shot.at + shot.dur)) : 1
  const omega = angleBetween(toVec(prev.lon, prev.lat), toVec(shot.lon, shot.lat))
  // Only quick flights pull out; slow drifts keep their altitude.
  const lift = shot.dur < 2 ? Math.sin(Math.PI * p) * Math.min(0.8, (omega / Math.PI) * 1.3) : 0
  return {
    lon: prev.lon + shortest(prev.lon, shot.lon) * p,
    lat: lerp(prev.lat, shot.lat, p),
    zoom: Math.max(0.55, lerp(prev.zoom, shot.zoom, p) - lift),
  }
}

export type View = { cam: Camera; cx: number; cy: number; R: number }

const ACID = "200,255,0"
const INK = "242,241,236"

/** Atmosphere and the dark body of the planet, hiding whatever is behind it; `ring` draws the outline in. */
export function paintPlanet(ctx: CanvasRenderingContext2D, { cx, cy, R }: View, dpr: number, ring = 1, glow = 1) {
  const halo = ctx.createRadialGradient(cx, cy, R * 0.92, cx, cy, R * 1.28)
  halo.addColorStop(0, `rgba(${ACID},${0.16 * glow})`)
  halo.addColorStop(0.35, `rgba(${ACID},${0.05 * glow})`)
  halo.addColorStop(1, `rgba(${ACID},0)`)
  ctx.fillStyle = halo
  ctx.beginPath(); ctx.arc(cx, cy, R * 1.28, 0, Math.PI * 2); ctx.fill()
  const body = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.35, R * 0.1, cx, cy, R)
  body.addColorStop(0, "rgba(16,20,10,0.96)")
  body.addColorStop(1, "rgba(5,6,4,0.96)")
  ctx.fillStyle = body
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill()
  ctx.strokeStyle = `rgba(${ACID},0.45)`
  ctx.lineWidth = 1 * dpr
  ctx.beginPath(); ctx.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ring); ctx.stroke()
}

/** Meridians and parallels every 30°, front side only. */
export function paintGraticule(ctx: CanvasRenderingContext2D, { cam, cx, cy, R }: View, dpr: number) {
  ctx.strokeStyle = `rgba(${INK},0.07)`
  ctx.lineWidth = 1 * dpr
  ctx.beginPath()
  const line = (points: Vec[]) => {
    let pen = false
    for (const v of points) {
      const r = rotate(v, cam)
      if (r[2] <= 0) { pen = false; continue }
      if (pen) ctx.lineTo(cx + R * r[0], cy - R * r[1]); else ctx.moveTo(cx + R * r[0], cy - R * r[1])
      pen = true
    }
  }
  for (let lon = -180; lon < 180; lon += 30) line(Array.from({ length: 46 }, (_, k) => toVec(lon, -90 + k * 4)))
  for (let lat = -60; lat <= 60; lat += 30) line(Array.from({ length: 91 }, (_, k) => toVec(-180 + k * 4, lat)))
  ctx.stroke()
}

let buffers: Float32Array[] = []

/**
 * Paints the land dots facing the camera, batched by style. `pick` returns a
 * style index for each dot (from its depth, screen position and world vector),
 * or -1 to leave it out.
 */
export function paintLand(
  ctx: CanvasRenderingContext2D,
  { cam, cx, cy, R }: View,
  palette: string[],
  pick: (i: number, z: number, x: number, y: number, vx: number, vy: number, vz: number) => number,
  size = Math.max(1.4, R * 0.0105),
) {
  if (buffers.length < palette.length) buffers = palette.map((_, k) => buffers[k] ?? new Float32Array(DOTS.n * 3))
  const counts = new Uint32Array(palette.length)
  const sl = Math.sin(cam.lon * RAD), cl = Math.cos(cam.lon * RAD)
  const sp = Math.sin(cam.lat * RAD), cp = Math.cos(cam.lat * RAD)
  const W = ctx.canvas.width, H = ctx.canvas.height
  for (let i = 0; i < DOTS.n; i++) {
    const vx = DOTS.cosLat[i] * DOTS.sinLon[i], vy = DOTS.sinLat[i], vz = DOTS.cosLat[i] * DOTS.cosLon[i]
    const x1 = vx * cl - vz * sl
    const z1 = vx * sl + vz * cl
    const z = vy * sp + z1 * cp
    if (z <= 0.02) continue
    const x = cx + R * x1, y = cy - R * (vy * cp - z1 * sp)
    if (x < -size || x > W + size || y < -size || y > H + size) continue
    const style = pick(i, z, x, y, vx, vy, vz)
    if (style < 0) continue
    const b = buffers[style]
    const k = counts[style]++ * 3
    b[k] = x; b[k + 1] = y; b[k + 2] = size * (0.55 + 0.45 * z)
  }
  palette.forEach((fill, style) => {
    ctx.fillStyle = fill
    const b = buffers[style]
    for (let k = 0; k < counts[style] * 3; k += 3) ctx.fillRect(b[k] - b[k + 2] / 2, b[k + 1] - b[k + 2] / 2, b[k + 2], b[k + 2])
  })
}

/** Points of a flight arc that leaves the surface, from 0 to `progress`. */
export function arcPoints(a: Vec, b: Vec, progress: number, samples = 72): Vec[] {
  const omega = angleBetween(a, b)
  const height = 0.05 + 0.32 * (omega / Math.PI)
  const points: Vec[] = []
  const last = Math.max(1, Math.round(samples * progress))
  for (let k = 0; k <= last; k++) {
    const s = (k / samples)
    const p = slerp(a, b, Math.min(s, progress), omega)
    const h = 1 + height * Math.sin(Math.PI * Math.min(s, progress))
    points.push([p[0] * h, p[1] * h, p[2] * h])
  }
  return points
}
