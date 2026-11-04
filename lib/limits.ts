import "server-only"

/* ------------------------------------------------------------------
   LIMITS — per-IP rate limit and a global daily spend cap.
   Uses Upstash Redis (REST) when configured so counters are shared by
   every serverless instance; falls back to process memory otherwise
   (fine for local dev and a single instance).
   ------------------------------------------------------------------ */

const URL_ = process.env.UPSTASH_REDIS_REST_URL
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN
const hasRedis = Boolean(URL_ && TOKEN)

const mem = new Map<string, { v: number; exp: number }>()

async function redis(cmds: (string | number)[][]) {
  const res = await fetch(`${URL_}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmds),
    cache: "no-store",
  })
  if (!res.ok) throw new Error(`redis ${res.status}`)
  return (await res.json()) as { result: unknown }[]
}

/** Increment a counter that expires after `ttl` seconds; returns the new value. */
async function incr(key: string, by: number, ttl: number): Promise<number> {
  if (hasRedis) {
    const cmd = Number.isInteger(by) ? ["INCRBY", key, by] : ["INCRBYFLOAT", key, by]
    const out = await redis([cmd, ["EXPIRE", key, ttl, "NX"]])
    return Number(out[0].result)
  }
  const now = Date.now()
  const cur = mem.get(key)
  const entry = cur && cur.exp > now ? cur : { v: 0, exp: now + ttl * 1000 }
  entry.v += by
  mem.set(key, entry)
  return entry.v
}

async function get(key: string): Promise<number> {
  if (hasRedis) {
    const out = await redis([["GET", key]])
    return Number(out[0].result ?? 0)
  }
  const cur = mem.get(key)
  return cur && cur.exp > Date.now() ? cur.v : 0
}

const day = () => new Date().toISOString().slice(0, 10)

const PER_10_MIN = Number(process.env.RATE_LIMIT_PER_10_MIN ?? 15)
const PER_DAY = Number(process.env.RATE_LIMIT_PER_DAY ?? 60)
const BUDGET_USD = Number(process.env.DAILY_BUDGET_EUR ?? 1) * Number(process.env.EUR_TO_USD ?? 1.15)

export type LimitResult = { ok: true } | { ok: false; reason: "rate" | "budget" }

/** Counts the message against the visitor and checks today's spend. */
export async function checkLimits(ip: string): Promise<LimitResult> {
  try {
    if ((await get(`spend:${day()}`)) >= BUDGET_USD) return { ok: false, reason: "budget" }
    const slot = Math.floor(Date.now() / 600_000)
    const [short, long] = await Promise.all([
      incr(`rl:${ip}:${slot}`, 1, 600),
      incr(`rl:${ip}:${day()}`, 1, 86_400),
    ])
    if (short > PER_10_MIN || long > PER_DAY) return { ok: false, reason: "rate" }
    return { ok: true }
  } catch {
    // If the counter store is down, fail closed on spend: better a quiet chat than a surprise bill.
    return { ok: false, reason: "budget" }
  }
}

/** Records the real cost OpenRouter reports for a completion (USD). */
export async function recordSpend(usd: number) {
  if (!usd || usd < 0) return
  try {
    await incr(`spend:${day()}`, usd, 2 * 86_400)
  } catch {
    /* counted on next success */
  }
}
