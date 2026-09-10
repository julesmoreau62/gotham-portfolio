"use client"

import { Section, Stats, Links } from "@/components/contracts/cs"
import { Stagger } from "@/components/fx/reveal"
import { Marquee } from "@/components/fx/marquee"

const CHANNELS = [
  { label: "Bloomberg", domain: "Finance · Markets" },
  { label: "SCMP", domain: "Asia · Geopolitics" },
  { label: "BBC Breaking", domain: "World news" },
  { label: "Reuters World", domain: "International" },
  { label: "Politico Europe", domain: "Europe · Politics" },
  { label: "Al Jazeera EN", domain: "Middle East · Global" },
  { label: "Clash Report", domain: "Conflicts" },
  { label: "Our Wars Today", domain: "Conflicts" },
  { label: "Intel Slava", domain: "Conflicts", bias: "Pro-Russian ⚠ cross-referenced" },
]

const PIPELINE = [
  { id: "cron", label: "GitHub Actions", sub: "Archived schedule — daily 18:00 Paris build documented", badge: "ARCHIVED" },
  { id: "crawler", label: "Telegram crawler", sub: "telegram_veille.py — Telethon API" },
  { id: "channels", label: "Channel aggregation", sub: "9 sources — messages since midnight Paris time", roster: true },
  { id: "filter", label: "AI top-10 selector", sub: "OpenRouter → Gemini 2.0 Flash, single pass", badge: "AI PASS" },
  { id: "notion", label: "Notion database", sub: "Auto-rotation — max 100 entries — indexed & categorized" },
  { id: "dash", label: "Intelligence dashboard", sub: "Next.js 14 // intel-dashboard-telegram.netlify.app" },
]

const PHASES = [
  { n: "01", tag: "Personal work", c: "#ff5c1a", title: "Need identification", body: "Replace manual monitoring with an AI-ranked daily top 10 from nine Telegram channels." },
  { n: "02", tag: "AI-assisted", c: "#2ee6ff", title: "Architecture", body: "Telethon for collection, Gemini for ranking and Notion for storage." },
  { n: "03", tag: "Personal work", c: "#ff5c1a", title: "Specifications", body: "Define dashboard UX, source list, ranking rules, schedule and database rotation." },
  { n: "04", tag: "AI-assisted", c: "#2ee6ff", title: "Parallel build", body: "Next.js dashboard and Python pipeline developed as two connected workstreams." },
  { n: "05", tag: "Human + AI collaboration", c: "#c8ff00", title: "Iteration loop", body: "Test → identify limits → refine specs → prompt → validate." },
  { n: "06", tag: "Human + AI collaboration", c: "#c8ff00", title: "Operational result", body: "Nine channels, eight categories, one daily top 10 for about $1 per month." },
]

export function IntelCoreCase() {
  return (
    <>
      <div className="border-b border-line">
        <Marquee items={CHANNELS.map((c) => `// ${c.label.toUpperCase()}`)} className="py-3 label text-[var(--accent)]" separator="" speed="30s" />
      </div>

      {/* 00 STATUS */}
      <Section n="00" kicker="Project status" title="Priority shifted">
        <div className="border border-[var(--accent)] bg-[var(--accent)] p-5 text-black md:p-7">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:items-end">
            <div className="display text-[clamp(44px,8vw,104px)] leading-[0.8] md:col-span-7">Standby</div>
            <p className="mono text-[13px] font-semibold leading-relaxed md:col-span-5 md:border-l md:border-black/25 md:pl-6">
              Paused for the sport-management fine-tuning project. Archive online · code intact · ready to reactivate.
            </p>
          </div>
        </div>
      </Section>

      {/* 01 PIPELINE */}
      <Section n="01" kicker="Intelligence gathering engine" title="End-to-end automated pipeline">
        <div className="mx-auto max-w-3xl">
          <Stagger stagger={0.1} amount={0.05}>
            {PIPELINE.map((node, i) => (
              <div key={node.id}>
                {i > 0 && (
                  <div className="flex flex-col items-center py-1">
                    <span className="h-6 w-px bg-[var(--accent)]/60" />
                    <span className="text-[var(--accent)] text-[10px]">▼</span>
                  </div>
                )}
                <div className="relative border border-line bg-bg p-4 md:p-5 hover:border-[var(--accent)] transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center border border-[var(--accent)] mono text-[10px] text-[var(--accent)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="display text-[16px]">{node.label}</span>
                        {node.badge && <span className="label border border-[var(--accent)]/60 px-1.5 py-0.5 text-[var(--accent)]">{node.badge}</span>}
                        <span className="ml-auto h-1.5 w-1.5 bg-acid" />
                      </div>
                      <p className="mono mt-1 text-[11px] text-mute">{node.sub}</p>
                    </div>
                  </div>
                </div>
                {node.roster && (
                  <div className="mt-3 grid grid-cols-2 gap-px bg-line border border-line sm:grid-cols-3">
                    {CHANNELS.map((ch) => (
                      <div key={ch.label} className={ch.bias ? "bg-bg p-3 border-l-2 border-crimson" : "bg-bg p-3"}>
                        <div className="mono text-[11px] font-semibold">{ch.label}</div>
                        <div className="label text-mute mt-1">{ch.domain}</div>
                        {ch.bias && <div className="label text-crimson mt-1">{ch.bias}</div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </Stagger>
          <Links
            className="mt-8"
            links={[
              { label: "Live demo", href: "https://intel-dashboard-telegram.netlify.app" },
              { label: "Dashboard repo", href: "https://github.com/julesmoreau62/sport-business-watch" },
              { label: "Intel engine repo", href: "https://github.com/julesmoreau62/veille-sport-biz" },
            ]}
          />
        </div>
      </Section>

      {/* 02 BUILD PROCESS */}
      <Section id="build-process" n="02" kicker="Build process" title="Human + AI workflow">
        <div className="mb-8 flex flex-wrap gap-4 border border-line p-4">
          {[
            ["#ff5c1a", "Personal work"],
            ["#2ee6ff", "AI-assisted"],
            ["#c8ff00", "Human + AI collaboration"],
          ].map(([c, l]) => (
            <span key={l} className="flex items-center gap-2 label text-mute">
              <span className="h-2 w-2" style={{ background: c }} />
              {l}
            </span>
          ))}
        </div>
        <Stagger className="mx-auto max-w-3xl" stagger={0.1} amount={0.05}>
          {PHASES.map((p, i) => (
            <div key={p.n}>
              {i > 0 && (
                <div className="flex flex-col items-center py-1">
                  <span className="h-8 w-px bg-line" />
                </div>
              )}
              <div className="border border-line bg-bg p-5 md:p-6" style={{ borderLeftColor: p.c, borderLeftWidth: 3 }}>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="mono text-[10px] tracking-[0.3em] text-mute">PHASE {p.n}</span>
                  <span className="text-dim">{"///"}</span>
                  <span className="label flex items-center gap-2" style={{ color: p.c }}>
                    <span className="h-2 w-2" style={{ background: p.c }} />
                    {p.tag}
                  </span>
                </div>
                <h4 className="display mt-3 text-[20px]">{p.title}</h4>
                <p className="mono mt-2 text-[12px] leading-relaxed text-mute">{p.body}</p>
                {p.n === "06" && (
                  <Stats size="sm" className="mt-5" items={[{ v: "9", l: "Channels", color: "#c8ff00" }, { v: "8", l: "Categories", color: "#c8ff00" }, { v: "18:00", l: "Daily Paris", color: "#c8ff00" }, { v: "~$1", l: "/ month", color: "#c8ff00" }]} />
                )}
              </div>
            </div>
          ))}
        </Stagger>
      </Section>
    </>
  )
}
