/* ------------------------------------------------------------------
   IMAGE LOADER — maps next/image requests to the WebP variants that
   scripts/build-images.mjs writes to public/_img/<width>/ before every
   dev and build run. No runtime image service is needed.
   Keep WIDTHS in sync with images.deviceSizes + images.imageSizes.
   ------------------------------------------------------------------ */

const RASTER = /\.(jpe?g|png|webp)$/i

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  if (!src.startsWith("/") || src.startsWith("/_img/") || !RASTER.test(src)) return src
  return `/_img/${width}${src.replace(RASTER, ".webp")}`
}
