"use client"

import { useEffect } from "react"

/**
 * The root layout renders <html lang="en">. Pages in another language wrap
 * their content in an element with `lang` (correct in the server HTML) and
 * mount this to align the document itself once hydrated.
 */
export function DocumentLang({ lang }: { lang: string }) {
  useEffect(() => {
    const root = document.documentElement
    const previous = root.lang
    root.lang = lang
    return () => { root.lang = previous }
  }, [lang])
  return null
}
