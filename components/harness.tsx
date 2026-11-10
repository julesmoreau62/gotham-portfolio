"use client"

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import {
  ArrowLeft, ArrowUp, Check, Coffee, FileText, Mail, Menu, MessageSquare, PanelLeft,
  PanelRight, Plus, Square, Trash2, X, ExternalLink, Sparkles,
} from "lucide-react"
import { Markdown } from "@/components/markdown"
import { Linkedin } from "@/components/icons"
import { ProjectArtifact } from "@/components/artifact"
import { OffTheClock } from "@/components/shelf"
import { CONTACT, CV_URL, PROJECTS, getProject, type ProjectId, type SectionId } from "@/lib/projects"
import { WELCOME } from "@/lib/starters"
import { MAX_INPUT_CHARS, type Action, type StreamEvent } from "@/lib/protocol"

type Notice = Extract<StreamEvent, { t: "notice" }>["kind"]
type Msg = { id: string; role: "user" | "assistant"; content: string; actions: Action[]; notice?: Notice; streaming?: boolean }
type Conv = { id: string; title: string; messages: Msg[]; updatedAt: number }
type Panel = { kind: "project"; id: ProjectId; section?: SectionId; nonce: number } | { kind: "cv"; nonce: number } | { kind: "off"; nonce: number } | null

const STORE = "moreau-harness:conversations:v1"
const uid = () => Math.random().toString(36).slice(2, 10)

const NOTICE_TEXT: Record<Notice, string> = {
  rate: "You've reached the message limit for now. Come back in a few minutes, or write to the real Jules directly.",
  budget: "My AI budget for today is used up (Jules keeps it at €1 a day). Every project is still one click away in the sidebar, or you can write to the real Jules.",
  offline: "The live AI isn't connected right now. You can still open every project from the sidebar.",
  error: "Something went wrong on my side. Try again in a moment, or write to the real Jules.",
}

const FOLLOW_UPS = ["What was your role exactly?", "What were the results?", "Which tools did you use?"]

export function Harness() {
  const [convs, setConvs] = useState<Conv[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [panel, setPanel] = useState<Panel>(null)
  const [panelVisible, setPanelVisible] = useState(false) // mobile overlay
  const [drawer, setDrawer] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [input, setInput] = useState("")
  const [busy, setBusy] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const threadRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const stickRef = useRef(true)

  const active = convs.find((c) => c.id === activeId) ?? null
  const messages = active?.messages ?? []

  /* ---------- persistence ---------- */
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE) || "[]") as Conv[]
      setConvs(saved.map((c) => ({ ...c, messages: c.messages.map((m) => ({ ...m, streaming: false })) })))
    } catch {}
    const p = new URLSearchParams(location.search).get("project")
    if (p && getProject(p)) {
      setPanel({ kind: "project", id: p as ProjectId, nonce: Date.now() })
      setPanelVisible(true)
    }
  }, [])
  useEffect(() => {
    if (busy) return
    try {
      localStorage.setItem(STORE, JSON.stringify(convs.filter((c) => c.messages.length).slice(0, 20)))
    } catch {}
  }, [convs, busy])

  /* ---------- scrolling ---------- */
  useEffect(() => {
    const el = threadRef.current
    if (el && stickRef.current) el.scrollTop = el.scrollHeight
  }, [messages])
  const onScroll = () => {
    const el = threadRef.current
    if (!el) return
    setScrolled(el.scrollTop > 4)
    stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80
  }

  const isMobile = () => typeof window !== "undefined" && window.matchMedia("(max-width: 860px)").matches

  /* ---------- panel ---------- */
  const openProject = useCallback((id: ProjectId, section?: SectionId, show = true) => {
    setPanel({ kind: "project", id, section, nonce: Date.now() })
    if (show) setPanelVisible(true)
    setDrawer(false)
  }, [])
  const openCv = useCallback((show = true) => {
    setPanel({ kind: "cv", nonce: Date.now() })
    if (show) setPanelVisible(true)
    setDrawer(false)
  }, [])
  const openOff = useCallback((show = true) => {
    setPanel({ kind: "off", nonce: Date.now() })
    if (show) setPanelVisible(true)
    setDrawer(false)
  }, [])
  const closePanel = () => {
    setPanel(null)
    setPanelVisible(false)
  }

  /** Applies what the AI asked for. On phones the panel is a full screen,
      so it never opens by itself: the visitor taps the tool line. */
  const applyAction = useCallback(
    (a: Action) => {
      const show = !isMobile()
      if (a.type === "open_project") openProject(a.id, a.section, show)
      if (a.type === "open_cv") openCv(show)
      if (a.type === "open_off_the_clock") openOff(show)
    },
    [openProject, openCv, openOff],
  )

  /* ---------- conversation helpers ---------- */
  const patchMsg = (convId: string, msgId: string, fn: (m: Msg) => Msg) =>
    setConvs((all) => all.map((c) => (c.id === convId ? { ...c, updatedAt: Date.now(), messages: c.messages.map((m) => (m.id === msgId ? fn(m) : m)) } : c)))

  const startTurn = (text: string) => {
    let convId = activeId
    const user: Msg = { id: uid(), role: "user", content: text, actions: [] }
    const reply: Msg = { id: uid(), role: "assistant", content: "", actions: [], streaming: true }
    if (!convId || !convs.some((c) => c.id === convId)) {
      convId = uid()
      const conv: Conv = { id: convId, title: text.slice(0, 48), messages: [user, reply], updatedAt: Date.now() }
      setConvs((all) => [conv, ...all])
      setActiveId(convId)
    } else {
      setConvs((all) => all.map((c) => (c.id === convId ? { ...c, updatedAt: Date.now(), messages: [...c.messages, user, reply] } : c)))
    }
    stickRef.current = true
    return { convId, reply, history: [...messages, user] }
  }

  const send = async (raw: string) => {
    const text = raw.trim()
    if (!text || busy) return
    if (text.length > MAX_INPUT_CHARS) return
    setInput("")

    // Local commands, no API call.
    const cmd = text.toLowerCase()
    if (cmd === "/cv" || cmd === "/resume") return openCv()
    if (cmd === "/off") return openOff()
    if (cmd === "/contact") {
      const { convId, reply } = startTurn(text)
      patchMsg(convId, reply.id, (m) => ({ ...m, content: "Here's how to reach the real Jules.", actions: [{ type: "show_contact" }], streaming: false }))
      return
    }

    const { convId, reply, history } = startTurn(text)
    setBusy(true)
    const ctrl = new AbortController()
    abortRef.current = ctrl
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: ctrl.signal,
        body: JSON.stringify({
          messages: history.filter((m) => !m.notice && m.content.trim()).map((m) => ({ role: m.role, content: m.content })),
          openProject: panel?.kind === "project" ? panel.id : null,
        }),
      })
      if (!res.ok || !res.body) throw new Error(String(res.status))
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buf = ""
      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        buf += decoder.decode(value, { stream: true })
        const lines = buf.split("\n")
        buf = lines.pop() ?? ""
        for (const line of lines) {
          if (!line.trim()) continue
          const ev = JSON.parse(line) as StreamEvent
          if (ev.t === "text") patchMsg(convId, reply.id, (m) => ({ ...m, content: m.content + ev.v }))
          if (ev.t === "action") {
            patchMsg(convId, reply.id, (m) => ({ ...m, actions: [...m.actions, ev.action] }))
            applyAction(ev.action)
          }
          if (ev.t === "notice") patchMsg(convId, reply.id, (m) => ({ ...m, notice: ev.kind }))
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") patchMsg(convId, reply.id, (m) => ({ ...m, notice: m.content ? undefined : "error" }))
    } finally {
      patchMsg(convId, reply.id, (m) => ({ ...m, streaming: false }))
      setBusy(false)
      abortRef.current = null
    }
  }

  const stop = () => abortRef.current?.abort()
  const newChat = () => {
    stop()
    setActiveId(null)
    setInput("")
    setDrawer(false)
    inputRef.current?.focus()
  }
  const deleteChat = (id: string) => {
    setConvs((all) => all.filter((c) => c.id !== id))
    if (id === activeId) setActiveId(null)
  }

  /* ---------- composer ---------- */
  const hasMessages = messages.length > 0
  useEffect(() => {
    if (hasMessages && !isMobile()) inputRef.current?.focus()
  }, [hasMessages])
  useLayoutEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = Math.min(el.scrollHeight, 200) + "px"
  }, [input])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "TEXTAREA" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === "Escape" && panelVisible && isMobile()) setPanelVisible(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [panelVisible])

  const sorted = useMemo(() => [...convs].filter((c) => c.messages.length).sort((a, b) => b.updatedAt - a.updatedAt), [convs])
  const openProj = panel?.kind === "project" ? getProject(panel.id) : null
  const last = messages[messages.length - 1]

  const composer = (
        <div className="composer-wrap">
          <form
            className="composer"
            onSubmit={(e) => {
              e.preventDefault()
              send(input)
            }}
          >
            <label htmlFor="composer" className="sr-only">Ask Jules's AI double</label>
            <textarea
              id="composer"
              ref={inputRef}
              rows={1}
              value={input}
              placeholder={openProj ? `Ask about ${openProj.title}…` : "Ask me anything about my work…"}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault()
                  send(input)
                }
              }}
            />
            <div className="composer-bar">
              {openProj ? (
                <span className="hint">
                  <span className="dot" style={{ background: openProj.accent }} aria-hidden /> Context: {openProj.title}
                </span>
              ) : (
                <span className="hint hide-mobile"><Sparkles size={13} aria-hidden /> Try /cv, /contact or /off</span>
              )}
              <span className={`count${input.length > MAX_INPUT_CHARS ? " over" : ""}`}>
                {input.length > MAX_INPUT_CHARS * 0.75 ? `${input.length}/${MAX_INPUT_CHARS}` : ""}
              </span>
              {busy ? (
                <button type="button" className="send" onClick={stop} aria-label="Stop"><Square size={12} fill="currentColor" /></button>
              ) : (
                <button type="submit" className="send" disabled={!input.trim() || input.length > MAX_INPUT_CHARS} aria-label="Send"><ArrowUp size={16} /></button>
              )}
            </div>
          </form>
          <div className="disclaimer">
            AI double of Jules, answering from his own notes. It can be wrong:{" "}
            <a href={`mailto:${CONTACT.email}`} className="real-jules"><Mail size={12} aria-hidden /> the real Jules reads his email</a>
          </div>
        </div>
  )

  const cls = [
    "app",
    panel ? "has-panel" : "",
    panel && panelVisible ? "panel-visible" : "",
    drawer ? "drawer-open" : "",
    collapsed ? "sidebar-collapsed" : "",
  ].join(" ")

  return (
    <div className={cls}>
      {/* ---------------- sidebar ---------------- */}
      <aside className="sidebar" aria-label="Navigation">
        <div className="sidebar-inner">
          <div className="brand">
            <div className="brand-mark" aria-hidden>M</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="brand-name">Moreau Harness</div>
              <div className="brand-sub">Jules Moreau · AI double</div>
            </div>
            <button className="icon-btn hide-mobile" onClick={() => setCollapsed(true)} aria-label="Hide sidebar"><PanelLeft size={16} /></button>
            <button className="icon-btn show-mobile" onClick={() => setDrawer(false)} aria-label="Close menu"><X size={16} /></button>
          </div>

          <button className="nav-item" onClick={newChat}>
            <Plus size={16} aria-hidden /> <span className="label">New chat</span>
          </button>

          <div className="nav-scroll">
            <div className="nav-group">
              <div className="nav-title">Projects</div>
              {PROJECTS.map((p) => (
                <button
                  key={p.id}
                  className={`nav-item${openProj?.id === p.id ? " active" : ""}`}
                  onClick={() => openProject(p.id)}
                >
                  <span className="dot" style={{ background: p.accent }} aria-hidden />
                  <span className="label">{p.title}</span>
                  <span className="meta">{p.code}</span>
                </button>
              ))}
            </div>

            <div className="nav-group">
              <div className="nav-title">Chats</div>
              {sorted.length === 0 && <div className="empty-note">Your chats stay in this browser.</div>}
              {sorted.map((c) => (
                <div key={c.id} className="chat-row">
                  <button
                    className={`nav-item${c.id === activeId ? " active" : ""}`}
                    onClick={() => {
                      setActiveId(c.id)
                      setDrawer(false)
                    }}
                  >
                    <MessageSquare size={15} aria-hidden /> <span className="label">{c.title}</span>
                  </button>
                  <button className="icon-btn del" style={{ width: 26, height: 26 }} onClick={() => deleteChat(c.id)} aria-label={`Delete chat ${c.title}`}>
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-foot">
            <button className={`nav-item${panel?.kind === "off" ? " active" : ""}`} onClick={() => openOff()}>
              <Coffee size={16} aria-hidden /> <span className="label">Off the clock</span>
            </button>
            <button className={`nav-item${panel?.kind === "cv" ? " active" : ""}`} onClick={() => openCv()}>
              <FileText size={16} aria-hidden /> <span className="label">CV</span> <span className="meta">PDF</span>
            </button>
            <a className="nav-item" href={`mailto:${CONTACT.email}`}>
              <Mail size={16} aria-hidden /> <span className="label">Contact</span>
            </a>
            <a className="nav-item" href={CONTACT.linkedin} target="_blank" rel="noreferrer">
              <Linkedin size={16} aria-hidden /> <span className="label">LinkedIn</span>
            </a>
          </div>
        </div>
      </aside>
      <div className="scrim" onClick={() => setDrawer(false)} aria-hidden />

      {/* ---------------- chat ---------------- */}
      <main className="main">
        <header className={`topbar${scrolled ? " scrolled" : ""}`}>
          <button className="icon-btn show-mobile" onClick={() => setDrawer(true)} aria-label="Open menu"><Menu size={18} /></button>
          {collapsed && (
            <button className="icon-btn hide-mobile" onClick={() => setCollapsed(false)} aria-label="Show sidebar"><PanelLeft size={16} /></button>
          )}
          <div className="topbar-title">{active?.title ?? "New chat"}</div>
          {panel && (
            <button className="icon-btn show-mobile" onClick={() => setPanelVisible(true)} aria-label="Show project"><PanelRight size={18} /></button>
          )}
        </header>

        <div className="thread" ref={threadRef} onScroll={onScroll}>
          {messages.length === 0 ? (
            <div className="welcome">
              <h1>{WELCOME.title}</h1>
              <div className="status-line">
                <span>Digital transformation and AI for sport organisations</span>
                <span>Open to an internship · Feb → Jun 2027</span>
              </div>
              {composer}
            </div>
          ) : (
            <div className="thread-inner" aria-live="polite">
              {messages.map((m) =>
                m.role === "user" ? (
                  <div key={m.id} className="msg msg-user">
                    <div className="bubble">{m.content}</div>
                  </div>
                ) : (
                  <div key={m.id} className="msg">
                    <div className="msg-ai-head">
                      <span className="avatar-sm" aria-hidden>JM</span> Jules · AI double
                    </div>
                    {m.notice ? (
                      <div className="notice">{NOTICE_TEXT[m.notice]}</div>
                    ) : m.content ? (
                      <Markdown text={m.content} cursor={m.streaming} />
                    ) : m.streaming ? (
                      <div className="thinking" aria-label="Thinking"><i /><i /><i /></div>
                    ) : null}
                    {m.actions.map((a, i) => (
                      <ActionView key={i} action={a} onOpen={() => (a.type === "open_project" ? openProject(a.id, a.section) : a.type === "open_cv" ? openCv() : a.type === "open_off_the_clock" ? openOff() : null)} />
                    ))}
                    {(m.notice === "budget" || m.notice === "rate" || m.notice === "offline" || m.notice === "error") && <ContactCard />}
                  </div>
                ),
              )}
              {last && last.role === "assistant" && !last.streaming && openProj && !last.notice && (
                <div className="followups">
                  {FOLLOW_UPS.map((q) => (
                    <button key={q} onClick={() => send(`${q} (${openProj.title})`)}>{q}</button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {messages.length > 0 && composer}
      </main>

      {/* ---------------- artifact panel ---------------- */}
      <aside className="panel" aria-label="Project" aria-hidden={!panel}>
        {panel && (
          <>
            <div className="panel-head">
              <button className="chip-btn panel-back" onClick={() => setPanelVisible(false)}><ArrowLeft size={14} aria-hidden /> Back to chat</button>
              <div className="crumb">
                {panel.kind === "project" && openProj ? (
                  <>
                    <span className="dot" style={{ background: openProj.accent }} aria-hidden />
                    <span className="hide-mobile">{openProj.code.toLowerCase()} · artifact</span>
                  </>
                ) : (
                  <span className="hide-mobile">{panel.kind === "off" ? "off-the-clock" : "cv-julesmoreau.pdf"}</span>
                )}
              </div>
              {panel.kind === "project" && (
                <a className="icon-btn" href={`/p/${panel.id}`} target="_blank" rel="noreferrer" aria-label="Open as a page"><ExternalLink size={15} /></a>
              )}
              <button className="icon-btn panel-close" onClick={closePanel} aria-label="Close panel"><X size={16} /></button>
            </div>
            <div className="panel-body">
              {panel.kind === "project" && openProj ? (
                <ProjectArtifact project={openProj} section={panel.section} nonce={panel.nonce} />
              ) : panel.kind === "off" ? (
                <OffTheClock />
              ) : (
                <div className="artifact">
                  <div className="links" style={{ marginBottom: 12 }}>
                    <a className="chip-btn solid" href={CV_URL} download><FileText size={14} aria-hidden /> Download the CV</a>
                    <a className="chip-btn" href={CV_URL} target="_blank" rel="noreferrer"><ExternalLink size={14} aria-hidden /> Open in a tab</a>
                  </div>
                  <iframe className="pdf" src={`${CV_URL}#view=FitH`} title="CV of Jules Moreau" />
                </div>
              )}
            </div>
          </>
        )}
      </aside>
    </div>
  )
}

function ActionView({ action: a, onOpen }: { action: Action; onOpen: () => void }) {
  if (a.type === "show_contact") return <ContactCard />
  const project = a.type === "open_project" ? getProject(a.id) : null
  return (
    <button className="tool" onClick={onOpen}>
      <PanelRight size={14} aria-hidden />
      <span className="name">{a.type}</span>
      <span className="arg">{a.type === "open_project" ? `${a.id}${a.section ? ` · ${a.section}` : ""}` : a.type === "open_off_the_clock" ? "off-the-clock" : "cv.pdf"}</span>
      <span className="state"><Check size={12} aria-hidden /> opened</span>
      <span className="open-cta">View {project ? project.title : a.type === "open_off_the_clock" ? "Off the clock" : "CV"} →</span>
    </button>
  )
}

function ContactCard() {
  return (
    <div className="contact-card">
      <div className="lead">Reach the real Jules: he answers within 24 hours, in French or English.</div>
      <a className="chip-btn solid" href={`mailto:${CONTACT.email}`}><Mail size={14} aria-hidden /> {CONTACT.email}</a>
      <a className="chip-btn" href={CONTACT.linkedin} target="_blank" rel="noreferrer"><Linkedin size={14} aria-hidden /> LinkedIn</a>
      <a className="chip-btn" href={CV_URL} download><FileText size={14} aria-hidden /> CV</a>
    </div>
  )
}
