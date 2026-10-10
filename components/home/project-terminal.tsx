"use client"

import { Fragment, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { CONTRACTS, type ContractSlug } from "@/lib/contracts"
import { STORY_PROJECT_SLUGS } from "@/lib/journey"
import { COPY } from "@/lib/copy"
import { PROFILE } from "@/lib/profile"
import { BRIEFING_PATH, type Locale } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { WipeLink, navigateWithWipe } from "@/components/fx/page-wipe"
import { getLenis } from "@/components/fx/smooth-scroll"
import { ArrowUpRight } from "@/components/ui/primitives"
import { ProjectMonitor } from "@/components/home/project-monitor"
import styles from "./selected-work.module.css"

/* ------------------------------------------------------------------
   PROJECT TERMINAL — the selected work as a working shell. It types
   `ls` on its own once it scrolls into view, so every project is one
   click away; anyone curious can type `open daring`, `cat signal`,
   `help`... The monitor beside it decodes the project in focus, and
   suggested commands cover phones, where typing is a chore.
   ------------------------------------------------------------------ */

const FEATURED = ["thesis-engine", ...STORY_PROJECT_SLUGS] as const
const ARCHIVE = ["strategy", "build", "imagery"] as const
const COMMANDS = ["help", "ls", "cat", "open", "whoami", "contact", "clear"]
const PROJECT_COMMANDS = ["open", "cat", "cd", "info"]
const SUGGESTIONS = ["help", "ls -a", "cat thesis-engine", "open daring", "whoami", "contact"]
/** Boot timeline in seconds: the login screen, then `ls` typed, then its output. */
const BOOT = { command: 0.75, output: 1.15, ready: 2 }
const LOGO = [
  "     ██╗███╗   ███╗",
  "     ██║████╗ ████║",
  "     ██║██╔████╔██║",
  "██   ██║██║╚██╔╝██║",
  "╚█████╔╝██║ ╚═╝ ██║",
  " ╚════╝ ╚═╝     ╚═╝",
].join("\n")

/** Each project's colour and the picture its monitor shows. Thesis Engine keeps its night-lab violet. */
const LOOK: Record<ContractSlug, { accent: string; image: string; position?: string }> = {
  "thesis-engine": { accent: "#b99bff", image: "/assets/thesis-engine/cover.jpg", position: "64% 42%" },
  daring: { accent: "#f1c780", image: "/assets/portfolio/daring-sponsor-site.webp", position: "0% 0%" },
  "field-ops": { accent: "#a9edee", image: "/assets/photo/asi-1.jpg", position: "50% 62%" },
  signal: { accent: "#c8ff00", image: "/signal/group_sponsor.webp", position: "50% 45%" },
  strategy: { accent: "#ff8a4c", image: "/assets/photo/corporate-8.jpg" },
  build: { accent: "#ffc247", image: "/assets/photo/corporate-2.jpg" },
  imagery: { accent: "#f2f1ec", image: "/assets/photo/kite-3.jpg" },
}

/** Other names people may type for a project, on top of its slug, code and number. */
const ALIASES: Record<ContractSlug, string[]> = {
  "thesis-engine": ["thesis", "engine"],
  daring: ["royal", "royal-daring"],
  "field-ops": ["asi", "field", "tournament"],
  signal: ["asn95", "asn"],
  strategy: ["blast"],
  build: ["builds", "sites", "web"],
  imagery: ["photo", "photos", "photography"],
}

export type Entry = {
  slug: ContractSlug
  n: string
  code: string
  featured: boolean
  name: string
  chapter: string
  verb?: string
  text: string
  proof: string
  proofLabel: string
  note?: string
  tags?: readonly string[]
  status?: string
  open: string
  accent: string
  image: string
  position?: string
}

type Out =
  | { type: "fetch" | "hint" | "help" | "whoami" | "contact" | "hire" | "exit" }
  | { type: "ls"; all: boolean }
  | { type: "cat" | "open"; slug: ContractSlug }
  | { type: "notFound" | "sudo"; word: string }
  | { type: "noProject"; word: string; query?: string }
  | { type: "matches"; items: string[] }
  | { type: "text"; text: string }
type Block = { id: number; cmd?: string; out: Out[]; boot?: boolean }

/** The terminal starts on the login screen, then `ls`, both played when it scrolls into view. */
const BOOT_BLOCKS: Block[] = [
  { id: 0, out: [{ type: "fetch" }], boot: true },
  { id: 1, cmd: "ls", out: [{ type: "ls", all: false }, { type: "hint" }], boot: true },
]

function buildEntries(locale: Locale): Entry[] {
  const t = COPY[locale].work
  const contract = (slug: ContractSlug) => CONTRACTS.find(c => c.slug === slug)!
  const featured = FEATURED.map((slug): Omit<Entry, "n"> => {
    const base = { slug, code: contract(slug).code, featured: true, status: t.status[slug], ...LOOK[slug] }
    if (slug === "thesis-engine") {
      const lab = t.lab
      return { ...base, name: lab.identity, chapter: lab.chapter, verb: lab.verb.join(" "), text: lab.text, proof: lab.proof, proofLabel: lab.proofLabel, note: `${lab.cost} ${lab.costLabel}`, tags: lab.offer, open: lab.open }
    }
    const story = t.stories[slug]
    return { ...base, name: slug === "signal" ? "ASN95" : t.titles[slug] ?? contract(slug).title, chapter: story.chapter, verb: story.verb, text: story.text, proof: story.proof, proofLabel: story.proofLabel, open: t.open }
  })
  const archive = ARCHIVE.map((slug): Omit<Entry, "n"> => ({
    slug, code: contract(slug).code, featured: false, name: t.titles[slug] ?? contract(slug).title, chapter: t.more[slug].chapter,
    text: t.archive[slug] ?? "", proof: t.more[slug].proof, proofLabel: t.more[slug].proofLabel, open: t.open, ...LOOK[slug],
  }))
  return [...featured, ...archive].map((entry, i) => ({ ...entry, n: String(i + 1).padStart(2, "0") }))
}

/** Finds a project by slug, alias, code, number or a unique start of its slug. */
function resolve(entries: Entry[], raw?: string) {
  if (!raw) return undefined
  const q = raw.toLowerCase().replace(/^(\.\/|~\/projects\/|projects\/)/, "").replace(/\/$/, "")
  const exact = entries.find(e => e.slug === q || e.code.toLowerCase() === q || e.n === q || String(Number(e.n)) === q || ALIASES[e.slug].includes(q))
  if (exact || q.length < 2) return exact
  const starts = entries.filter(e => e.slug.startsWith(q))
  return starts.length === 1 ? starts[0] : undefined
}

const commonPrefix = (items: string[]) => items.reduce((a, b) => { let i = 0; while (i < a.length && a[i] === b[i]) i++; return a.slice(0, i) })

function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const lenis = getLenis()
  if (lenis) lenis.scrollTo(el, { offset: -20 })
  else el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })
}

export function ProjectTerminal({ locale }: { locale: Locale }) {
  const copy = COPY[locale]
  const tt = copy.work.terminal
  const entries = useMemo(() => buildEntries(locale), [locale])
  const [blocks, setBlocks] = useState(BOOT_BLOCKS)
  const [phase, setPhase] = useState<"idle" | "boot" | "ready">("idle")
  const [input, setInput] = useState("")
  const [caret, setCaret] = useState(0)
  const [focused, setFocused] = useState(false)
  const [busy, setBusy] = useState(false)
  const [selected, setSelected] = useState(0)
  const root = useRef<HTMLDivElement>(null)
  const screen = useRef<HTMLDivElement>(null)
  const field = useRef<HTMLInputElement>(null)
  const nextId = useRef(BOOT_BLOCKS.length)
  const history = useRef<string[]>([])
  const cursor = useRef(-1)
  const timers = useRef<number[]>([])

  const later = useCallback((fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)) }, [])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  // The terminal boots once, when most of it is on screen.
  useEffect(() => {
    const el = root.current
    if (!el) return
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setPhase("ready"); return }
    const watch = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      watch.disconnect()
      setPhase("boot")
      later(() => setPhase("ready"), BOOT.ready * 1000)
    }, { threshold: 0.35 })
    watch.observe(el)
    return () => watch.disconnect()
  }, [later])

  // New output scrolls the screen, never the page.
  useEffect(() => {
    const el = screen.current
    if (el && blocks.length) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
  }, [blocks])

  const still = () => matchMedia("(prefers-reduced-motion: reduce)").matches
  const indexOf = (slug: ContractSlug) => entries.findIndex(e => e.slug === slug)
  const print = (block: Omit<Block, "id">) => setBlocks(b => [...b, { ...block, id: nextId.current++ }])
  const setValue = (value: string) => {
    setInput(value)
    setCaret(value.length)
    requestAnimationFrame(() => field.current?.setSelectionRange(value.length, value.length))
  }

  function run(raw: string) {
    const line = raw.trim()
    setValue("")
    cursor.current = -1
    if (line) history.current = [...history.current.filter(h => h !== line), line].slice(-30)
    const [word = "", ...args] = line.split(/\s+/)
    const cmd = word.toLowerCase()
    const show = (entry: Entry, type: "cat" | "open") => {
      setSelected(indexOf(entry.slug))
      print({ cmd: line, out: [{ type, slug: entry.slug }] })
    }
    const missing = (query?: string) => print({ cmd: line, out: [{ type: "noProject", word: cmd, query }] })

    switch (cmd) {
      case "": return print({ cmd: "", out: [] })
      case "help": case "man": case "?": return print({ cmd: line, out: [{ type: "help" }] })
      case "ls": case "ll": case "dir": {
        const target = args.find(a => !a.startsWith("-"))
        if (!target) return print({ cmd: line, out: [{ type: "ls", all: args.some(a => a === "--all" || /^-\w*a/.test(a)) }] })
        const entry = resolve(entries, target)
        return entry ? show(entry, "cat") : missing(target)
      }
      case "cat": case "info": case "less": case "more": {
        const entry = resolve(entries, args[0])
        return entry ? show(entry, "cat") : missing(args[0])
      }
      case "open": case "cd": case "start": {
        const entry = resolve(entries, args[0])
        if (!entry) return missing(args[0])
        show(entry, "open")
        setBusy(true)
        later(() => navigateWithWipe(`/contracts/${entry.slug}`), still() ? 0 : 900)
        later(() => setBusy(false), 4000)
        return
      }
      case "whoami": return print({ cmd: line, out: [{ type: "whoami" }] })
      case "contact": case "mail": case "email": return print({ cmd: line, out: [{ type: "contact" }] })
      case "clear": case "cls": return setBlocks([])
      case "pwd": return print({ cmd: line, out: [{ type: "text", text: "/home/jules/projects" }] })
      case "sudo": case "hire":
        if (cmd === "sudo" && args[0]?.toLowerCase() !== "hire") return print({ cmd: line, out: [{ type: "sudo", word: "sudo hire jules" }] })
        print({ cmd: line, out: [{ type: "hire" }] })
        later(() => scrollToId("extraction"), still() ? 300 : 1600)
        return
      case "exit": case "quit": case "logout": return print({ cmd: line, out: [{ type: "exit" }] })
      default: {
        // A bare project name reads its summary.
        const entry = resolve(entries, word)
        return entry ? show(entry, "cat") : print({ cmd: line, out: [{ type: "notFound", word }] })
      }
    }
  }

  /** Types a command into the prompt, then runs it: what suggestions and clicks do. */
  function typeOut(command: string) {
    if (busy) return
    if (still()) return run(command)
    setBusy(true)
    let i = 0
    const step = () => {
      i++
      setValue(command.slice(0, i))
      if (i < command.length) later(step, 30)
      else later(() => { setBusy(false); run(command) }, 160)
    }
    step()
  }

  function complete() {
    const parts = input.trimStart().split(/\s+/)
    let pool: string[], prefix = "", partial: string
    if (parts.length === 1) { pool = COMMANDS; partial = parts[0] }
    else if (parts.length === 2 && PROJECT_COMMANDS.includes(parts[0].toLowerCase())) { pool = entries.map(e => e.slug); prefix = `${parts[0]} `; partial = parts[1] }
    else return
    const matches = pool.filter(item => item.startsWith(partial.toLowerCase()))
    if (!matches.length) return
    if (matches.length === 1) return setValue(prefix + matches[0] + (parts.length === 1 && PROJECT_COMMANDS.includes(matches[0]) ? " " : ""))
    const common = commonPrefix(matches)
    if (common.length > partial.length) return setValue(prefix + common)
    print({ cmd: input, out: [{ type: "matches", items: matches }] })
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    const key = event.key
    if (key === "Enter") {
      event.preventDefault()
      if (!busy) run(input)
    } else if (key === "Tab") {
      // An empty prompt lets Tab move focus as usual.
      if (!input.trim()) return
      event.preventDefault()
      complete()
    } else if (key === "ArrowUp" || key === "ArrowDown") {
      const past = history.current
      if (!past.length) return
      event.preventDefault()
      if (key === "ArrowUp") cursor.current = cursor.current === -1 ? past.length - 1 : Math.max(0, cursor.current - 1)
      else if (cursor.current !== -1) cursor.current = cursor.current + 1 >= past.length ? -1 : cursor.current + 1
      setValue(cursor.current === -1 ? "" : past[cursor.current])
    } else if (event.ctrlKey && key.toLowerCase() === "l") {
      event.preventDefault()
      setBlocks([])
    } else if (event.ctrlKey && key.toLowerCase() === "c" && event.currentTarget.selectionStart === event.currentTarget.selectionEnd) {
      event.preventDefault()
      print({ cmd: `${input}^C`, out: [] })
      setValue("")
    } else if (key === "Escape") {
      setValue("")
    }
  }

  /* ---------------- Output ---------------- */

  /** A command name in the output; the runnable ones type themselves into the prompt. */
  const token = (label: string, command = label) =>
    /[<[]/.test(command)
      ? <code className={styles.token}>{label}</code>
      : <button type="button" className={styles.token} onClick={() => typeOut(command)}>{label}</button>
  const phrase = (parts: readonly string[]) => parts.map((part, i) => <Fragment key={i}>{i % 2 ? token(part) : part}</Fragment>)

  const projectLink = (entry: Entry, className: string, children: ReactNode) => (
    <WipeLink
      href={`/contracts/${entry.slug}`}
      className={className}
      style={{ "--accent": entry.accent } as React.CSSProperties}
      data-cursor="open"
      onPointerEnter={e => { if (e.pointerType === "mouse") setSelected(indexOf(entry.slug)) }}
      onFocus={() => setSelected(indexOf(entry.slug))}
      onClick={e => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
        e.preventDefault()
        typeOut(`open ${entry.slug}`)
      }}
    >
      {children}
    </WipeLink>
  )

  const lsRow = (entry: Entry) => projectLink(entry, styles.lsRow, <>
    <span className={styles.lsN}>{entry.n}</span>
    <span className={styles.lsSlug}>{entry.slug}{entry.slug === "thesis-engine" && <i className={styles.live} aria-hidden="true" />}</span>
    <span className={styles.lsVerb}>{entry.verb ?? entry.name}</span>
    <span className={styles.lsProof}><b>{entry.proof}</b> <span className={styles.lsLabel}>{entry.proofLabel}</span></span>
  </>)

  function render(out: Out): ReactNode[] {
    switch (out.type) {
      case "fetch": {
        const facts: [string, string][] = [
          [tt.fetch.role, copy.hero.role],
          [tt.fetch.field, tt.fetch.fieldValue],
          [tt.fetch.status, `${copy.hero.availability} · ${copy.hero.window}`],
          [tt.fetch.base, PROFILE.location],
          [tt.fetch.tools, copy.approach.tools[2]],
        ]
        return [
          <div key="fetch" className={styles.fetch}>
            <pre className={styles.logo} aria-hidden="true">{LOGO.split(/(█+)/).map((run, i) => i % 2 ? run : <span key={i} className={styles.logoShadow}>{run}</span>)}</pre>
            <div className={styles.facts}>
              <span className={styles.user}>jules@portfolio</span>
              <span className={styles.dim}>───────────────</span>
              {facts.map(([label, value]) => <span key={label} className={styles.fact}><b>{label}</b>{value}</span>)}
              <span className={styles.swatches} aria-hidden="true">{entries.map(e => <i key={e.slug} style={{ background: e.accent }} />)}</span>
            </div>
          </div>,
        ]
      }
      case "ls": {
        const featured = entries.filter(e => e.featured), archive = entries.filter(e => !e.featured)
        return [
          <span key="head" className={styles.dim}>{tt.featured} · {featured.length} {tt.projects}</span>,
          ...featured.map(e => <Fragment key={e.slug}>{lsRow(e)}</Fragment>),
          out.all
            ? <span key="archive" className={cn(styles.dim, styles.lsGap)}>{tt.archive} · {archive.length} {tt.projects}</span>
            : <span key="archive" className={styles.lsMore}><span className={styles.dim}>{tt.archive}</span>{archive.map(e => <Fragment key={e.slug}>{projectLink(e, styles.lsMoreLink, e.slug)}</Fragment>)}<span className={styles.dim}>({token("ls -a")})</span></span>,
          ...(out.all ? archive.map(e => <Fragment key={e.slug}>{lsRow(e)}</Fragment>) : []),
        ]
      }
      case "hint": return [<span key="hint" className={styles.hint}>→ {phrase(tt.hint)}</span>]
      case "help": return [
        <span key="title" className={styles.ink}>{tt.helpTitle}</span>,
        ...tt.help.map(([command, description]) => <span key={command} className={styles.helpRow}><span>{token(command, command.split(" ")[0])}</span><span>{description}</span></span>),
        <span key="tip" className={styles.dim}>{tt.tip}</span>,
      ]
      case "cat": {
        const e = entries[indexOf(out.slug)]
        return [
          <span key="head" className={styles.catHead} style={{ "--accent": e.accent } as React.CSSProperties}><span className={styles.accent}>{e.n} / {e.code}</span> <b className={styles.ink}>{e.name}</b> <span className={styles.dim}>— {e.chapter}</span></span>,
          ...(e.verb ? [<span key="verb" className={styles.catVerb} style={{ "--accent": e.accent } as React.CSSProperties}>{e.verb}</span>] : []),
          <span key="text" className={styles.catText}>{e.text}</span>,
          ...(e.tags ? [<span key="tags" className={styles.catTags}>{e.tags.map((tag, i) => <span key={tag} className={cn(i === 0 && styles.soon)}>{tag}</span>)}</span>] : []),
          <span key="proof" style={{ "--accent": e.accent } as React.CSSProperties}>▸ <b className={styles.accent}>{e.proof}</b> {e.proofLabel}</span>,
          ...(e.note ? [<span key="note">▸ {e.note}</span>] : []),
          <Fragment key="open">{projectLink(e, styles.catOpen, <>→ {e.open} <ArrowUpRight /></>)}</Fragment>,
        ]
      }
      case "open": {
        const e = entries[indexOf(out.slug)]
        return [
          <span key="opening">{tt.opening} <span className={styles.accent} style={{ "--accent": e.accent } as React.CSSProperties}>~/projects/{e.slug}</span>…</span>,
          <span key="bar" className={styles.progress} style={{ "--accent": e.accent } as React.CSSProperties}>[<span className={styles.bar}><i /></span>] <span className={styles.pct}>100%</span></span>,
        ]
      }
      case "whoami": return [
        <span key="name"><b className={styles.ink}>{PROFILE.firstName} {PROFILE.lastName}</b> — {copy.hero.role}</span>,
        <span key="what">{copy.hero.specialty}</span>,
        <span key="when" className={styles.acid}>● {copy.hero.availability} · {copy.hero.window}</span>,
        <span key="links" className={styles.links}>
          <a href="#origin" onClick={e => { e.preventDefault(); scrollToId("origin") }}>→ {tt.story}</a>
          <a href={BRIEFING_PATH[locale]}>→ {tt.briefing}</a>
        </span>,
      ]
      case "contact": return [
        <span key="email" className={styles.kv}><span>email</span><a href={`mailto:${PROFILE.email}`} data-cursor="mail">{PROFILE.email}</a></span>,
        <span key="linkedin" className={styles.kv}><span>linkedin</span><a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">{PROFILE.linkedin.replace(/^https:\/\/(www\.)?/, "")}</a></span>,
        <span key="cv" className={styles.kv}><span>cv</span><a href={PROFILE.cv} download>{tt.cv}</a></span>,
      ]
      case "hire": return [
        <span key="sudo">{tt.sudo} ********</span>,
        <span key="granted" className={cn(styles.acid, styles.late)}>{tt.granted}</span>,
      ]
      case "sudo": return [<span key="sudo">{tt.sudoDenied}{token(out.word)}</span>]
      case "exit": return [<span key="exit">{tt.exit}</span>, <span key="ls">{phrase(tt.tryLs)}</span>]
      case "notFound": return [<span key="err" className={styles.err}>zsh: {tt.notFound} {out.word}</span>, <span key="help">{phrase(tt.tryHelp)}</span>]
      case "noProject":
        if (!out.query) return [
          <span key="usage">{tt.usage} {out.word} &lt;project&gt;</span>,
          <span key="list" className={styles.matches}>{entries.map(e => <Fragment key={e.slug}>{token(e.slug, `${out.word} ${e.slug}`)}</Fragment>)}</span>,
        ]
        return [<span key="err" className={styles.err}>{out.word}: {tt.noProject} {out.query}</span>, <span key="ls">{phrase(tt.tryLs)}</span>]
      case "matches": return [<span key="matches" className={styles.matches}>{out.items.map(item => <span key={item}>{item}</span>)}</span>]
      case "text": return [<span key="text">{out.text}</span>]
    }
  }

  const prompt = (
    <span className={styles.prompt} aria-hidden="true"><span className={styles.user}>jules@portfolio</span><span className={styles.path}>~/projects</span><span className={styles.sigil}>$</span></span>
  )

  return (
    <div ref={root} className={styles.console} data-phase={phase}>
      <div className={styles.terminal} role="region" aria-label={tt.region}>
        <div className={styles.titleBar} aria-hidden="true">
          <span className={styles.dots}><i /><i /><i /></span>
          <span className={styles.titleText}>{tt.title}</span>
          <span className={styles.titleSize}>120×32</span>
        </div>
        <div
          ref={screen}
          className={styles.screen}
          data-lenis-prevent
          onClick={e => {
            if ((e.target as HTMLElement).closest("a, button") || window.getSelection()?.toString()) return
            field.current?.focus({ preventScroll: true })
          }}
        >
          <div role="log" aria-live="polite" aria-relevant="additions">
            {blocks.map(block => {
              const lines = block.out.flatMap(render)
              const base = block.boot ? (block.cmd ? BOOT.output : 0.1) : 0
              return (
                <div key={block.id} className={cn(styles.block, block.boot && styles.bootBlock)}>
                  {block.cmd !== undefined && (
                    <div className={styles.line} style={{ "--d": `${block.boot ? BOOT.command - 0.15 : 0}s` } as React.CSSProperties}>
                      {prompt}
                      {block.boot
                        ? <span className={styles.typed} style={{ "--n": block.cmd.length, "--d": `${BOOT.command}s` } as React.CSSProperties}>{block.cmd}</span>
                        : <span className={styles.cmd}>{block.cmd}</span>}
                    </div>
                  )}
                  {lines.map((node, i) => <div key={i} className={styles.line} style={{ "--d": `${base}s`, "--i": i } as React.CSSProperties}>{node}</div>)}
                </div>
              )
            })}
          </div>
          <label className={cn(styles.line, styles.inputLine)} style={{ "--d": `${BOOT.ready - 0.2}s` } as React.CSSProperties}>
            {prompt}
            <span className={styles.field}>
              <input
                ref={field}
                className={styles.input}
                value={input}
                onChange={e => { setInput(e.target.value); setCaret(e.target.selectionStart ?? e.target.value.length); cursor.current = -1 }}
                onSelect={e => setCaret(e.currentTarget.selectionStart ?? 0)}
                onKeyDown={onKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                aria-label={tt.inputLabel}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="go"
              />
              <span className={styles.mirror} aria-hidden="true">
                {input.slice(0, caret)}
                <span className={cn(styles.caret, focused && styles.caretOn)}>{input[caret] ?? " "}</span>
                {input.slice(caret + 1)}
              </span>
            </span>
          </label>
        </div>
        <div className={styles.chips}>
          <span className={styles.chipsLabel}>{tt.suggestions}</span>
          {SUGGESTIONS.map(command => <button key={command} type="button" className={styles.chip} onClick={() => typeOut(command)} disabled={busy}>{command}</button>)}
        </div>
      </div>
      <ProjectMonitor entries={entries} selected={selected} on={phase !== "idle"} label={tt.monitor} />
    </div>
  )
}
