/* ------------------------------------------------------------------
   HERO PORTRAIT — writes the photo behind the home hero's digital rain
   (public/assets/portfolio/jules-portrait.webp). Run once, by hand,
   with a cut-out photo that has a transparent background:

     node scripts/build-hero-portrait.mjs path/to/portrait.webp

   The face is blurred before anything is written, so the sharp
   likeness never reaches the repository or the site. Keep the source
   photo out of the repository.
   ------------------------------------------------------------------ */

import sharp from "sharp"

const OUTPUT = new URL("../public/assets/portfolio/jules-portrait.webp", import.meta.url)
// Face ellipse in source pixels for the 1500×2000 portrait: below the cap brim, ear to ear, down to the chin.
const FACE = { cx: 760, cy: 525, rx: 205, ry: 175 }
const BLUR = 30
const FEATHER = 22

const input = process.argv[2]
if (!input) throw new Error("Usage: node scripts/build-hero-portrait.mjs path/to/portrait.webp")

const { width, height } = await sharp(input).metadata()
const blurred = await sharp(input).ensureAlpha().blur(BLUR).png().toBuffer()
const mask = await sharp(Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><ellipse cx="${FACE.cx}" cy="${FACE.cy}" rx="${FACE.rx}" ry="${FACE.ry}" fill="#fff"/></svg>`,
)).blur(FEATHER).png().toBuffer()
const face = await sharp(blurred).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer()

// sharp composites last, so the blurred face is merged first and the result turned grey after.
const merged = await sharp(input).ensureAlpha().composite([{ input: face, blend: "over" }]).png().toBuffer()
await sharp(merged)
  .grayscale()
  .webp({ quality: 84, alphaQuality: 90 })
  .toFile(OUTPUT.pathname.replace(/^\/([A-Za-z]:)/, "$1"))
console.log(`Wrote public/assets/portfolio/jules-portrait.webp (${width}×${height}, face blurred)`)
