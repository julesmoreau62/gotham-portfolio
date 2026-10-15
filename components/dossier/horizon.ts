import { arcPoints, paintGraticule, paintLand, paintPlanet, rotate, toVec, type View, type Vec } from "./globe"

/* ------------------------------------------------------------------
   HORIZON — the planet under the closing slogan, Europe near its rim.
   The film's last globe zooms into exactly this view, so the end
   screen picks up the very frame the film left on.
   ------------------------------------------------------------------ */

type Spot = { lat: number; lon: number }
/** The long legs of the career route: Opal Coast, Kourou, Lille. The short hops would spike on the rim. */
const ROUTE: Spot[] = [
  { lat: 50.95, lon: 1.86 },
  { lat: 5.16, lon: -52.65 },
  { lat: 50.63, lon: 3.06 },
]
/** Lille, the current base. */
export const BASE = toVec(ROUTE[ROUTE.length - 1].lon, ROUTE[ROUTE.length - 1].lat)

const ACID = "200,255,0"
/** Six depth shades of ink, shared with the film's last globe so the handover does not flicker. */
export const INK = Array.from({ length: 6 }, (_, k) => `rgba(242,241,236,${0.1 + k * 0.07})`)
const PALETTE = [...INK, `rgba(${ACID},1)`]

/** The view at `s` seconds into the end screen: a slow sway over Europe. */
export function horizonView(W: number, H: number, s: number): View {
  const R = Math.max(W * 0.5, H * 0.85)
  return { cam: { lon: 2 + Math.sin(s * 0.1) * 14, lat: -12, zoom: 1 }, cx: W / 2, cy: H * 0.62 + R, R }
}

/** How big a land dot is drawn on the horizon. */
export const horizonDot = (R: number, dpr: number) => Math.max(1.4 * dpr, R * 0.0055)

/** Whether a land dot (as a world vector) belongs to Lille's highlight. */
export const nearBase = (vx: number, vy: number, vz: number) => vx * BASE[0] + vy * BASE[1] + vz * BASE[2] > 0.9993

/** The career route, a pulse running it base to base, and Lille pulsing; `alpha` fades them in. */
export function paintRoute(ctx: CanvasRenderingContext2D, view: View, dpr: number, s: number, alpha = 1) {
  if (alpha <= 0) return
  const { cam } = view
  const project = (v: Vec) => {
    const r = rotate(v, cam)
    return { x: view.cx + view.R * r[0], y: view.cy - view.R * r[1], z: r[2], out: r[0] ** 2 + r[1] ** 2 > 1 }
  }
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.lineCap = "round"
  ctx.strokeStyle = `rgba(${ACID},.85)`
  ctx.lineWidth = 1.8 * dpr
  ctx.shadowColor = `rgb(${ACID})`
  ctx.shadowBlur = 10 * dpr
  for (let k = 1; k < ROUTE.length; k++) {
    ctx.beginPath()
    let pen = false
    for (const q of arcPoints(toVec(ROUTE[k - 1].lon, ROUTE[k - 1].lat), toVec(ROUTE[k].lon, ROUTE[k].lat), 1, 48).map(project)) {
      if (q.z <= 0 && !q.out) { pen = false; continue }
      if (pen) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y)
      pen = true
    }
    ctx.stroke()
  }
  ctx.shadowBlur = 0

  const legs = ROUTE.length - 1
  const p = ((s / 1.3) % legs + legs) % legs
  const leg = Math.floor(p)
  const points = arcPoints(toVec(ROUTE[leg].lon, ROUTE[leg].lat), toVec(ROUTE[leg + 1].lon, ROUTE[leg + 1].lat), p - leg, 48)
  const head = project(points[points.length - 1])
  if (head.z > 0 || head.out) {
    ctx.fillStyle = "#fff"
    ctx.shadowColor = `rgb(${ACID})`
    ctx.shadowBlur = 14 * dpr
    ctx.beginPath(); ctx.arc(head.x, head.y, 3.2 * dpr, 0, Math.PI * 2); ctx.fill()
    ctx.shadowBlur = 0
  }

  const q = project(BASE)
  if (q.z > 0.02) {
    for (const delay of [0, 0.7]) {
      const pulse = (((s + delay) % 1.4) + 1.4) % 1.4 / 1.4
      ctx.strokeStyle = `rgba(${ACID},${(1 - pulse) * 0.9})`
      ctx.lineWidth = 1.4 * dpr
      ctx.beginPath(); ctx.ellipse(q.x, q.y, (8 + pulse * 52) * dpr, (8 + pulse * 52) * dpr * Math.max(0.35, q.z), 0, 0, Math.PI * 2); ctx.stroke()
    }
    ctx.fillStyle = "#fff"
    ctx.shadowColor = `rgb(${ACID})`
    ctx.shadowBlur = 12 * dpr
    ctx.fillRect(q.x - 3.5 * dpr, q.y - 3.5 * dpr, 7 * dpr, 7 * dpr)
    ctx.shadowBlur = 0
  }
  ctx.restore()
}

/** One frame of the end screen's planet. */
export function drawHorizon(canvas: HTMLCanvasElement, s: number) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return
  const W = canvas.width, H = canvas.height, dpr = Math.min(devicePixelRatio || 1, 2)
  ctx.clearRect(0, 0, W, H)
  const view = horizonView(W, H, s)
  paintPlanet(ctx, view, dpr, 1, 1.6)
  paintGraticule(ctx, view, dpr)
  paintLand(ctx, view, PALETTE, (_i, z, _x, _y, vx, vy, vz) => (nearBase(vx, vy, vz) ? 6 : Math.min(5, Math.floor(z * 6))), horizonDot(view.R, dpr))
  paintRoute(ctx, view, dpr, s)
}

