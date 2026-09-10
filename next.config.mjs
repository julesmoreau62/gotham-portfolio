import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  transpilePackages: ["three"],
  reactStrictMode: true,
  outputFileTracingRoot: root,
}

export default nextConfig
