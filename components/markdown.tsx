import { Fragment, type ReactNode } from "react"

/* A deliberately small Markdown renderer for chat answers: paragraphs,
   bullet and numbered lists, **bold**, *italic*, `code` and links.
   No raw HTML is ever injected. */

const SAFE_URL = /^(https?:\/\/|mailto:|\/)/i

function inline(text: string, key: string): ReactNode[] {
  const out: ReactNode[] = []
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\)|\*[^*\s][^*]*\*|https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.]+)/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const tok = m[0]
    const k = `${key}-${i++}`
    if (tok.startsWith("**")) out.push(<strong key={k}>{tok.slice(2, -2)}</strong>)
    else if (tok.startsWith("`")) out.push(<code key={k}>{tok.slice(1, -1)}</code>)
    else if (tok.startsWith("[")) {
      const [, label, href] = tok.match(/\[([^\]]+)\]\(([^)\s]+)\)/) ?? []
      out.push(SAFE_URL.test(href) ? <a key={k} href={href} target={href.startsWith("/") ? undefined : "_blank"} rel="noreferrer">{label}</a> : label)
    } else if (tok.startsWith("*")) out.push(<em key={k}>{tok.slice(1, -1)}</em>)
    else if (tok.startsWith("http")) {
      const clean = tok.replace(/[.,;:]+$/, "")
      out.push(<a key={k} href={clean} target="_blank" rel="noreferrer">{clean.replace(/^https?:\/\//, "")}</a>)
      if (clean.length < tok.length) out.push(tok.slice(clean.length))
    } else {
      const clean = tok.replace(/[.]+$/, "")
      out.push(<a key={k} href={`mailto:${clean}`}>{clean}</a>)
      if (clean.length < tok.length) out.push(tok.slice(clean.length))
    }
    last = m.index + tok.length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

export function Markdown({ text, cursor }: { text: string; cursor?: boolean }) {
  const blocks = text.replace(/\r/g, "").split(/\n{2,}/)
  return (
    <div className="prose">
      {blocks.map((block, bi) => {
        const lines = block.split("\n").filter((l) => l.trim() !== "")
        const isLast = bi === blocks.length - 1
        const tail = isLast && cursor ? <span className="cursor" aria-hidden /> : null
        if (lines.length && lines.every((l) => /^\s*[-*•]\s+/.test(l))) {
          return (
            <ul key={bi}>
              {lines.map((l, li) => (
                <li key={li}>
                  {inline(l.replace(/^\s*[-*•]\s+/, ""), `${bi}-${li}`)}
                  {li === lines.length - 1 && tail}
                </li>
              ))}
            </ul>
          )
        }
        if (lines.length && lines.every((l) => /^\s*\d+[.)]\s+/.test(l))) {
          return (
            <ol key={bi}>
              {lines.map((l, li) => (
                <li key={li}>
                  {inline(l.replace(/^\s*\d+[.)]\s+/, ""), `${bi}-${li}`)}
                  {li === lines.length - 1 && tail}
                </li>
              ))}
            </ol>
          )
        }
        return (
          <p key={bi}>
            {lines.map((l, li) => (
              <Fragment key={li}>
                {li > 0 && <br />}
                {inline(l.replace(/^#+\s*/, ""), `${bi}-${li}`)}
              </Fragment>
            ))}
            {tail}
          </p>
        )
      })}
    </div>
  )
}
