"use client"

import { useEffect } from "react"
import { Analytics } from "@vercel/analytics/next"
import { track } from "@vercel/analytics"

/**
 * Cookie-free page views (Vercel Web Analytics), plus the clicks that tell
 * whether a visit turned into contact: CV and PDF downloads, email,
 * LinkedIn and language switches. Custom events need a Vercel Pro plan;
 * on Hobby only page views are recorded and these calls are ignored.
 */
export function SiteAnalytics() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null
      if (!link) return
      const href = link.getAttribute("href") ?? ""
      const page = window.location.pathname
      if (href.endsWith(".pdf")) track("Download", { file: decodeURIComponent(href.split("/").pop() ?? href), page })
      else if (href.startsWith("mailto:")) track("Email", { page })
      else if (href.includes("linkedin.com")) track("LinkedIn", { page })
      else if (link.hreflang) track("Language", { to: link.hreflang, page })
    }
    document.addEventListener("click", onClick, { capture: true })
    return () => document.removeEventListener("click", onClick, { capture: true })
  }, [])
  return <Analytics />
}
