/* ------------------------------------------------------------------
   Generates resized WebP variants of every raster image in public/
   into public/_img/<width>/<same path>.webp, for lib/image-loader.ts.
   Runs before `next dev` and `next build`; unchanged images are skipped.
   ------------------------------------------------------------------ */

import { mkdir, readdir, stat, writeFile } from "node:fs/promises"
import { availableParallelism } from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"
import config from "../next.config.mjs"

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")
const publicDir = path.join(root, "public")
const outDir = path.join(publicDir, "_img")
const WIDTHS = [...new Set([...config.images.imageSizes, ...config.images.deviceSizes])].sort((a, b) => a - b)
const RASTER = /\.(jpe?g|png|webp)$/i
const QUALITY = 80

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(entries.map((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return full === outDir ? [] : walk(full)
    return RASTER.test(entry.name) ? [full] : []
  }))
  return files.flat()
}

const variantPath = (source, width) =>
  path.join(outDir, String(width), path.relative(publicDir, source).replace(RASTER, ".webp"))

async function isFresh(source) {
  const { mtimeMs } = await stat(source)
  try {
    const outputs = await Promise.all(WIDTHS.map((width) => stat(variantPath(source, width))))
    return outputs.every((output) => output.mtimeMs >= mtimeMs)
  } catch {
    return false
  }
}

async function build(source) {
  const image = sharp(source, { failOn: "none" }).rotate()
  const { width: original = Math.max(...WIDTHS) } = await image.metadata()
  // Widths larger than the original reuse the original-size encode.
  const encoded = new Map()
  for (const width of WIDTHS) {
    const target = Math.min(width, original)
    if (!encoded.has(target)) {
      encoded.set(target, await image.clone().resize({ width: target, withoutEnlargement: true }).webp({ quality: QUALITY }).toBuffer())
    }
    const file = variantPath(source, width)
    await mkdir(path.dirname(file), { recursive: true })
    await writeFile(file, encoded.get(target))
  }
}

const sources = await walk(publicDir)

// foo.jpg and foo.png in one folder would both map to foo.webp.
const seen = new Map()
for (const source of sources) {
  const key = source.replace(RASTER, "").toLowerCase()
  if (seen.has(key)) throw new Error(`Image variants would collide: ${seen.get(key)} and ${source}`)
  seen.set(key, source)
}

const queue = []
for (const source of sources) if (!(await isFresh(source))) queue.push(source)

const started = performance.now()
let next = 0
await Promise.all(Array.from({ length: Math.min(availableParallelism(), 8) }, async () => {
  while (next < queue.length) await build(queue[next++])
}))

const seconds = ((performance.now() - started) / 1000).toFixed(1)
console.log(`images: ${queue.length} built, ${sources.length - queue.length} up to date (${WIDTHS.join(", ")} px) in ${seconds}s`)
