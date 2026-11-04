"use client"

import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"
import { ArrowUpRight, ChevronLeft, ChevronRight, Download, ExternalLink, X } from "lucide-react"
import type { Block, Media, Project, SectionId } from "@/lib/projects"
import { AsiIncidents, OnoSpaces, ThesisEngine } from "@/components/demos"

const SECTION_LABEL: Record<SectionId, string> = {
  overview: "Overview",
  context: "Context",
  role: "Role",
  approach: "Approach",
  results: "Results",
  gallery: "Gallery",
  demo: "Demo",
  links: "Links",
}

export function ProjectArtifact({ project, section, nonce }: { project: Project; section?: SectionId; nonce?: number }) {
  const root = useRef<HTMLDivElement>(null)
  const [lightbox, setLightbox] = useState<{ items: Media[]; i: number } | null>(null)
  const sections = useMemo(() => {
    const seen = new Set<SectionId>()
    for (const b of project.blocks) seen.add(b.section)
    return [...seen]
  }, [project])
  const [current, setCurrent] = useState<SectionId | null>(null)

  // Scroll to the section the AI asked for (or the top on a new project).
  useEffect(() => {
    const scroller = root.current?.closest(".panel-body, .page-wrap") as HTMLElement | null
    if (!section) {
      scroller?.scrollTo({ top: 0 })
      setCurrent(null)
      return
    }
    const el = root.current?.querySelector(`[data-section="${section}"]`)
    el?.scrollIntoView({ behavior: "smooth", block: "start" })
    setCurrent(section)
  }, [project.id, section, nonce])

  const jump = (s: SectionId) => {
    setCurrent(s)
    root.current?.querySelector(`[data-section="${s}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  let firstOfSection = new Set<SectionId>()
  return (
    <article className="artifact" ref={root} style={{ ["--accent" as string]: project.accent }}>
      <div className="art-status">
        <span className="dot" style={{ background: project.accent }} />
        <span>{project.code}</span>
        <span>·</span>
        <span>{project.status}</span>
      </div>
      <h2 className="art-title">{project.title}</h2>
      <div className="art-meta">
        <span>{project.role}</span>
        <span>{project.org}</span>
        <span>{project.period}</span>
        <span>{project.location}</span>
      </div>
      <p className="art-summary">{project.summary}</p>

      {sections.length > 1 && (
        <nav className="art-nav" aria-label="Sections">
          {sections.map((s) => (
            <button key={s} className={current === s ? "on" : ""} onClick={() => jump(s)}>
              {SECTION_LABEL[s]}
            </button>
          ))}
        </nav>
      )}

      <div className="art-cover">
        <Image src={project.cover.src} alt={project.cover.alt} fill sizes="(max-width: 860px) 100vw, 680px" style={{ objectFit: "cover" }} priority />
      </div>

      {project.blocks.map((b, i) => {
        const anchor = !firstOfSection.has(b.section)
        firstOfSection.add(b.section)
        return (
          <section key={i} className="art-block" data-section={anchor ? b.section : undefined}>
            {b.title && <h3>{b.title}</h3>}
            <BlockView block={b} onOpenMedia={(items, idx) => setLightbox({ items, i: idx })} />
          </section>
        )
      })}

      {project.stack && (
        <section className="art-block">
          <h3>Tools</h3>
          <div className="stack">
            {project.stack.map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
        </section>
      )}

      {lightbox && <Lightbox {...lightbox} onClose={() => setLightbox(null)} onMove={(i) => setLightbox({ ...lightbox, i })} />}
    </article>
  )
}

function BlockView({ block: b, onOpenMedia }: { block: Block; onOpenMedia: (items: Media[], i: number) => void }) {
  switch (b.type) {
    case "text":
      return <p className="art-text">{b.body}</p>
    case "list":
      return (
        <ul className="art-list">
          {b.items.map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </ul>
      )
    case "metrics":
      return (
        <div className="metrics">
          {b.items.map((m) => (
            <div key={m.label} className="metric">
              <b>{m.value}</b>
              <span>{m.label}</span>
            </div>
          ))}
        </div>
      )
    case "steps":
      return (
        <div className="steps">
          {b.items.map((s, i) => (
            <div key={s.label} className="step">
              <span className="n">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <b>{s.label}</b>
                <p>{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      )
    case "gallery":
      return (
        <div className="gallery">
          {b.items.map((m, i) => (
            <button key={m.src} className="thumb" onClick={() => onOpenMedia(b.items, i)} aria-label={`Open image: ${m.alt}`}>
              <Image src={m.src} alt={m.alt} fill sizes="(max-width: 860px) 50vw, 220px" style={{ objectFit: "cover" }} />
            </button>
          ))}
        </div>
      )
    case "site":
      return <SiteFrame url={b.url} label={b.label} note={b.note} />
    case "pdf":
      return (
        <div className="links">
          <a className="chip-btn" href={b.src} target="_blank" rel="noreferrer">
            <ExternalLink size={14} aria-hidden /> {b.label}
          </a>
          <a className="chip-btn" href={b.src} download>
            <Download size={14} aria-hidden /> Download
          </a>
        </div>
      )
    case "links":
      return (
        <div className="links">
          {b.items.map((l) => (
            <a key={l.href} className="chip-btn" href={l.href} target="_blank" rel="noreferrer">
              {l.label} <ArrowUpRight size={14} aria-hidden />
            </a>
          ))}
        </div>
      )
    case "demo":
      if (b.demo === "ono-spaces") return <OnoSpaces />
      if (b.demo === "asi-incidents") return <AsiIncidents />
      return <ThesisEngine />
  }
}

function SiteFrame({ url, label, note }: { url: string; label: string; note?: string }) {
  const [load, setLoad] = useState(false)
  return (
    <div className="frame">
      <div className="frame-bar">
        <span className="lights"><i /><i /><i /></span>
        <span className="url">{label}</span>
        <a className="icon-btn" href={url} target="_blank" rel="noreferrer" aria-label="Open in a new tab">
          <ExternalLink size={14} />
        </a>
      </div>
      {load ? (
        <iframe src={url} title={label} style={{ height: 460 }} loading="lazy" sandbox="allow-scripts allow-same-origin allow-popups" />
      ) : (
        <button className="chip-btn" style={{ margin: 14 }} onClick={() => setLoad(true)}>
          Load the live preview
        </button>
      )}
      {note && <div className="note">{note}</div>}
    </div>
  )
}

function Lightbox({ items, i, onClose, onMove }: { items: Media[]; i: number; onClose: () => void; onMove: (i: number) => void }) {
  const m = items[i]
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") onMove((i + 1) % items.length)
      if (e.key === "ArrowLeft") onMove((i - 1 + items.length) % items.length)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [i, items.length, onClose, onMove])
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={m.alt} onClick={onClose}>
      <button className="lb-btn" style={{ right: 12, top: 10 }} onClick={onClose} aria-label="Close"><X size={18} /></button>
      <div className="stage" onClick={(e) => e.stopPropagation()}>
        <Image src={m.src} alt={m.alt} fill sizes="100vw" style={{ objectFit: "contain" }} />
        {items.length > 1 && (
          <>
            <button className="lb-btn" style={{ left: -4, top: "50%" }} onClick={() => onMove((i - 1 + items.length) % items.length)} aria-label="Previous"><ChevronLeft size={18} /></button>
            <button className="lb-btn" style={{ right: -4, top: "50%" }} onClick={() => onMove((i + 1) % items.length)} aria-label="Next"><ChevronRight size={18} /></button>
          </>
        )}
      </div>
      <div className="cap">{m.alt} · {i + 1} / {items.length}</div>
    </div>
  )
}
