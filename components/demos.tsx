"use client"

import { useEffect, useState } from "react"
import { BookOpen, FileText, Mic, Search, Radar, Filter, Cpu, Database } from "lucide-react"

/* Small interactive recreations shown inside artifacts. They illustrate
   how a project works; they are not the real apps. */

const SPACES = [
  {
    id: "thesis",
    label: "Thesis",
    icon: FileText,
    text: "Markdown chapters in a plain folder, APA 7 citations in French or English, Word and PDF export with cover page and references.",
    screen: [
      "chapters/02-ai-in-associations.md",
      "> …a quoted passage (Author, 2021, p. 48).",
      "copilot ▸ check source → found on p. 48 ✓",
    ],
  },
  {
    id: "library",
    label: "Library",
    icon: BookOpen,
    text: "31 books and reports searchable passage by passage, by keyword and by meaning (local bge-m3 model). A French question finds the English passage that answers it.",
    screen: ["query: « comment fidéliser les bénévoles ? »", "1. matching English passage · book A, p. 112", "2. matching English passage · report B, p. 37"],
  },
  {
    id: "lectures",
    label: "Lectures",
    icon: Mic,
    text: "Recording with slide timing, local whisper.cpp transcription pinned to each slide, a written course, revision sheets and spaced-repetition flashcards (1 → 120 days).",
    screen: ["slide 14 · 00:23:41 ⚑ flagged", "transcript line pinned to slide 14", "flashcards due today: 12"],
  },
  {
    id: "ask",
    label: "Ask ⌘K",
    icon: Search,
    text: "One question across books, thesis and lecture notes. Every answer cites its page or section.",
    screen: ["⌘K  what did I write about no-code tools?", "→ thesis §2.3, lecture 6 slide 9, library p. 204"],
  },
]

export function OnoSpaces() {
  const [tab, setTab] = useState(0)
  const s = SPACES[tab]
  return (
    <div className="demo">
      <div className="demo-tabs" role="tablist">
        {SPACES.map((x, i) => (
          <button key={x.id} role="tab" aria-selected={i === tab} className={i === tab ? "on" : ""} onClick={() => setTab(i)}>
            <x.icon size={14} aria-hidden /> {x.label}
          </button>
        ))}
      </div>
      <div className="demo-body" role="tabpanel">
        <p>{s.text}</p>
        <div className="demo-screen" aria-label="Illustration">
          {s.screen.map((l, i) => (
            <div key={i} className={i === 0 ? "hl" : undefined}>{l}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

const INCIDENTS = [
  { t: "H-2h", title: "Main gym double-booked", badge: "critical", detail: "Alternate gymnasium secured in 45 minutes, equipment moved, on-time start. Zero participant impact." },
  { t: "H-30min", title: "Heavy rain on disc golf", badge: "adapted", detail: "Indoor fallback in 30 minutes, course redesigned, full competition kept with adapted rules." },
  { t: "H+0", title: "Kick-off", badge: "on time", detail: "500+ people across disc golf, wheelchair basketball, laser tag and spikeball." },
]

export function AsiIncidents() {
  const [open, setOpen] = useState(0)
  return (
    <div className="demo timeline">
      {INCIDENTS.map((x, i) => (
        <button key={x.t} className="tl-item" onClick={() => setOpen(i)} aria-expanded={open === i}>
          <span className="t">{x.t}</span>
          <span>
            <b>{x.title} <span className="badge">{x.badge}</span></b>
            {open === i && <div className="detail">{x.detail}</div>}
          </span>
        </button>
      ))}
    </div>
  )
}

const PIPE = [
  { icon: Radar, k: "01", title: "Scan", text: "Google Scholar, OpenAlex, Cairn · 3× a day", num: "~90" },
  { icon: Filter, k: "02", title: "Triage", text: "Qwen3 4B fine-tuned with LoRA, on Ollama, grounded with RAG", num: "~5%" },
  { icon: Cpu, k: "03", title: "Deep analysis", text: "Complex cases escalated to DeepSeek V4-Pro", num: "cents" },
  { icon: Database, k: "04", title: "Into Ono-Sendai", text: "Summaries and sources land in the library", num: "≈ €0/mo" },
]

export function ThesisEngine() {
  const [on, setOn] = useState(0)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const t = setInterval(() => setOn((v) => (v + 1) % PIPE.length), 1600)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="demo pipe">
      {PIPE.map((p, i) => (
        <div key={p.k} className={`pipe-step${i === on ? " on" : ""}`} onMouseEnter={() => setOn(i)}>
          <p.icon size={16} aria-hidden />
          <div>
            <b>{p.title}</b>
            <span>{p.text}</span>
          </div>
          <span className="num">{p.num}</span>
        </div>
      ))}
    </div>
  )
}
