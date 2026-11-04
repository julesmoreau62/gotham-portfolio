/** @type {import('next').NextConfig} */
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.dirname(fileURLToPath(import.meta.url))

const nextConfig = {
  outputFileTracingRoot: root,
  // The chat route reads the reference folder at runtime: ship it with the function.
  outputFileTracingIncludes: { "/api/chat": ["./knowledge/**/*"] },
}
export default nextConfig
