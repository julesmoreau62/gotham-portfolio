"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Section, Stats, Card, Quote, Bullets, Chips, Links, Prose, Note, Kv } from "@/components/contracts/cs"
import { Reveal, Stagger } from "@/components/fx/reveal"
import { Counter } from "@/components/fx/counter"
import { Scramble } from "@/components/fx/scramble"

function NetLossChart() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const bars = [
    { label: "2024", v: 80, tip: "-3.96M", color: "#ff2a3c" },
    { label: "2025", v: 60, tip: "-2.8M proj.", color: "rgba(255,42,60,0.7)" },
    { label: "2026", v: 35, tip: "-2.0M proj.", color: "#ff5c1a" },
    { label: "2027", v: 4, tip: "BREAK-EVEN", color: "#c8ff00" },
  ]
  return (
    <div ref={ref} className="border border-line bg-surface p-5">
      <div className="label text-mute mb-4">Net loss reduction trajectory</div>
      <div className="flex h-36 items-end gap-3">
        {bars.map((b, i) => (
          <div key={b.label} className="flex flex-1 flex-col items-center justify-end h-full">
            <motion.span
              className="label mb-2"
              style={{ color: i === 3 ? "#c8ff00" : "var(--mute)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: inView ? 1 : 0 }}
              transition={{ delay: 0.5 + i * 0.15 }}
            >
              {b.tip}
            </motion.span>
            <motion.div
              className="w-full max-w-[56px]"
              style={{ background: b.color }}
              initial={{ height: 0 }}
              animate={{ height: inView ? `${b.v}%` : 0 }}
              transition={{ duration: 1, ease: [0.2, 1, 0.3, 1], delay: i * 0.12 }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-3">
        {bars.map((b) => (
          <div key={b.label} className="flex-1 text-center label text-mute">
            {b.label}
          </div>
        ))}
      </div>
    </div>
  )
}

function Map() {
  return (
    <div className="relative overflow-hidden border border-line bg-surface" style={{ aspectRatio: "16/9" }}>
      <div className="halftone absolute inset-0 opacity-30" />
      <svg viewBox="0 0 1000 450" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g transform="translate(0, 20)" fill="rgba(242,241,236,0.06)" stroke="rgba(242,241,236,0.25)" strokeWidth="0.8">
          <path d="M 70 60 C 70 60 150 40 280 40 C 320 40 300 120 250 160 C 230 180 200 170 180 140 C 150 120 70 100 70 60" />
          <path d="M 260 170 L 320 180 L 300 320 L 260 280 Z" />
          <path d="M 430 70 L 550 60 L 650 60 L 850 60 L 900 100 L 850 180 L 780 220 L 720 280 L 680 300 L 600 350 L 520 300 L 450 150 L 420 120 Z" />
          <path d="M 800 300 L 900 300 L 900 380 L 800 380 Z" />
        </g>
        <path d="M 490 80 Q 620 100 720 190" fill="none" stroke="#2ee6ff" strokeWidth="1.5" strokeDasharray="6 4" strokeOpacity="0.7">
          <animate attributeName="stroke-dashoffset" from="30" to="0" dur="2s" repeatCount="indefinite" />
        </path>
        <circle cx="490" cy="80" r="3" fill="#f2f1ec" />
        <circle cx="490" cy="80" r="7" fill="none" stroke="#f2f1ec" strokeWidth="0.6" strokeOpacity="0.5" />
        <circle cx="720" cy="190" r="4" fill="#ff5c1a">
          <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="720" cy="190" r="14" fill="none" stroke="#ff5c1a" strokeWidth="0.8">
          <animate attributeName="r" values="10;22;10" dur="3s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" values="0.5;0;0.5" dur="3s" repeatCount="indefinite" />
        </circle>
      </svg>
      <div className="absolute left-[42%] top-[14%] label bg-bg/90 border border-line px-2 py-1">Copenhagen HQ</div>
      <div className="absolute right-[14%] top-[36%] border border-[var(--accent)] bg-bg/90 px-2 py-1.5">
        <div className="label text-[var(--accent)] flex items-center gap-2">
          <span className="h-1.5 w-1.5 bg-[var(--accent)] animate-pulse2" />
          Target: Mumbai
        </div>
        <div className="label text-mute mt-1">600M gamers // 19% CAGR</div>
      </div>
      <div className="absolute left-[34%] top-[5%] label text-dim hidden md:block">Europe: saturated</div>
      <div className="absolute bottom-3 left-3 label text-mute">19.07 N · 72.87 E</div>
    </div>
  )
}

export function StrategyCase() {
  return (
    <>
      <div className="border-b border-line px-5 py-6 md:px-8 flex flex-wrap items-center justify-between gap-4">
        <div className="label text-[var(--accent)]">
          <Scramble text="OPERATION BLUE OCEAN // BLAST.TV STRATEGIC AUDIT" />
        </div>
        <Chips items={["PESTEL", "VRIO", "SWOT", "23 pages", "Academic analysis"]} />
      </div>

      {/* 01 SITUATION */}
      <Section
        n="01"
        kicker="Situation assessment"
        title="A critical asymmetry"
        intro="BLAST.tv faces a critical asymmetry against EFG (the Saudi PIF-backed ESL). With $11M in cash reserves versus EFG’s $1.5Bn valuation, a direct Western confrontation is unwinnable. The “Louvre Agreement” barrier is collapsing under Valve’s 2025 regulation banning franchised partner leagues."
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <Reveal className="border border-crimson/40 bg-surface p-5">
              <div className="flex items-center justify-between label">
                <span className="flex items-center gap-2 text-crimson">
                  <span className="h-1.5 w-1.5 bg-crimson animate-pulse2" />
                  Financial firepower
                </span>
                <span className="border border-crimson/40 px-1.5 py-0.5 text-crimson">DEFCON 1</span>
              </div>
              <div className="mt-4 flex h-2.5 w-full overflow-hidden bg-ink/10">
                <div className="h-full bg-ink" style={{ width: "5%" }} />
                <div className="h-full bg-crimson" style={{ width: "95%" }} />
              </div>
              <div className="mt-2 flex justify-between label text-mute">
                <span>BLAST · $11M cash</span>
                <span>EFG · $1.5Bn valuation</span>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-px bg-line">
                {[
                  { l: "Revenue FY24", v: "82.1M", s: "+13%", c: "#c8ff00" },
                  { l: "Net result", v: "-3.96M", s: "", c: "#ff2a3c" },
                  { l: "Gross margin", v: "15.7%", s: "CRITICAL", c: "#ff5c1a" },
                ].map((m) => (
                  <div key={m.l} className="bg-bg p-3">
                    <div className="label text-mute">{m.l}</div>
                    <div className="display mt-1 text-[22px]" style={{ color: m.l === "Net result" ? m.c : undefined }}>
                      {m.v}
                    </div>
                    {m.s && (
                      <div className="label mt-1" style={{ color: m.c }}>
                        {m.s}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          <Stagger className="lg:col-span-5 flex flex-col gap-3" stagger={0.1}>
            <Card kicker="Threat" title="David vs Goliath 2.0" tone="line">
              Cannot win a price war. EFG dominates volume and vertical integration. BLAST’s “boutique” model faces cost
              inflation limits.
            </Card>
            <Card kicker="Regulation" title="Valve 2025 ban" tone="line">
              End of franchised “Partner Leagues” kills the Louvre Agreement. BLAST loses its main competitive barrier.
            </Card>
            <Card kicker="Opportunity" title="Blue ocean access" tone="accent">
              JV with Reliance to access 600M Indian gamers, bypassing EFG’s Western saturation via mobile-first.
            </Card>
          </Stagger>
        </div>
      </Section>

      {/* 02 PIVOT */}
      <Section
        n="02"
        kicker="Strategic pivot"
        title="India, mobile-first"
        intro="From “boutique” to “mass premium”: bypassing EFG’s Western saturation via a joint venture with Reliance (April 2025), deploying a mobile-first ecosystem for 600M gamers."
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <Map />
          </Reveal>
          <div className="lg:col-span-5 grid grid-cols-2 gap-px bg-line border border-line">
            {[
              { l: "Market CAGR", v: 19, s: "%", sub: "$9.2Bn by 2029", c: "#2ee6ff" },
              { l: "Target audience", v: 600, s: "M", sub: "Mobile gamers", c: "#f2f1ec" },
              { l: "Distribution", v: 480, s: "M", sub: "JioGames subscribers", c: "#c8ff00" },
              { l: "Cost structure", v: 80, s: "%", p: "-", sub: "vs European production", c: "#ff5c1a" },
            ].map((k) => (
              <div key={k.l} className="bg-bg p-4">
                <div className="label text-mute">{k.l}</div>
                <div className="display tnum mt-2 text-[clamp(28px,3vw,40px)]" style={{ color: k.c }}>
                  <Counter to={k.v} prefix={k.p} suffix={k.s} />
                </div>
                <div className="label text-mute mt-1">{k.sub}</div>
              </div>
            ))}
            <div className="col-span-2 bg-bg">
              <NetLossChart />
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border border-line bg-surface p-5">
          <div>
            <div className="display text-[18px]">From “boutique” to “mass premium”</div>
            <div className="mono text-[12px] text-mute mt-1">Joint venture with Reliance · April 2025 · mobile-first ecosystem for 600M gamers.</div>
          </div>
          <Chips fill items={["Expansion", "Mobile first"]} />
        </div>
      </Section>

      {/* 03 ROADMAP */}
      <Section n="03" kicker="Execution roadmap" title="Three phases to break-even">
        <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-3" stagger={0.1}>
          {[
            {
              phase: "01",
              t: "H1 2026",
              title: "Infrastructure",
              tag: "India launch",
              on: true,
              items: [
                ["Local studio", "Mumbai production hub"],
                ["Partners", "Jio / Paytm integration"],
              ],
              actions: ["Mobile test event", "-5% ops logistics"],
            },
            {
              phase: "02",
              t: "H2 2026",
              title: "D2C & gamification",
              tag: "Monetization",
              items: [
                ["Feature", "Fantasy Live platform"],
                ["Model", "Watch-to-Earn rewards"],
              ],
              actions: ["ARPU +50%", "10k transactions target"],
            },
            {
              phase: "03",
              t: "2027",
              title: "Profitability",
              tag: "Break-even",
              items: [
                ["Goal", "Break-even target"],
                ["Mix", "EU 60% / India 20% / MENA 20%"],
              ],
              actions: ["Sustained growth", "Global diversification"],
            },
          ].map((p) => (
            <div key={p.phase} className={p.on ? "border border-[var(--accent)] bg-bg" : "border border-line bg-bg"}>
              <div className="flex items-center justify-between border-b border-line p-4">
                <div>
                  <div className="label" style={{ color: p.on ? "var(--accent)" : "var(--mute)" }}>
                    Phase {p.phase}
                  </div>
                  <div className="display text-[20px] mt-1">{p.t}</div>
                </div>
                <span className="label border border-line px-2 py-1">{p.tag}</span>
              </div>
              <div className="p-4">
                <h4 className="display text-[18px]">{p.title}</h4>
                <div className="mt-3">
                  {p.items.map(([k, v]) => (
                    <Kv key={k} k={k} v={v} />
                  ))}
                </div>
                <ul className="mt-4 space-y-1">
                  {p.actions.map((a) => (
                    <li key={a} className="mono text-[11px] text-[var(--accent)] flex items-center gap-2">
                      <span className="h-px w-3 bg-current" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </Stagger>

        <Reveal className="mt-8 border border-acid/40 bg-surface p-5 flex items-start gap-4">
          <span className="mt-1 h-3 w-3 shrink-0 bg-acid" />
          <div>
            <div className="label text-acid">CSR differentiation</div>
            <p className="mono mt-2 text-[12px] leading-relaxed text-mute">
              Leveraging a “Brand Safety Shield” to attract Western sponsors subject to CSRD, avoiding EFG’s reputational
              risks linked to Saudi PIF ownership.
            </p>
          </div>
        </Reveal>
      </Section>

      {/* 04 DOSSIER */}
      <Section n="04" kicker="Full dossier" title="Access the complete audit">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <Prose>
              <p>
                “David vs Goliath 2.0” is a 23-page strategic audit built on PESTEL, VRIO and SWOT analyses of BLAST.tv,
                with a market-entry recommendation and a three-phase execution roadmap. It extends an M1 thesis on
                LEC/GRP versus CS2 economic models, which included an interview with BLAST VP James Woollard.
              </p>
            </Prose>
            <div className="mt-6">
              <Links links={[{ label: "Download the dossier · PDF", href: "/assets/blast-case-study.pdf", download: true }]} />
            </div>
          </div>
          <Stats className="lg:col-span-5 md:grid-cols-2" size="sm" items={[{ v: "23", l: "Pages" }, { v: "3", l: "Frameworks" }, { v: "3", l: "Roadmap phases" }, { v: "2027", l: "Break-even target" }]} />
        </div>
        <Note className="mt-8">
          Source: Dossier BLAST — analysis based on 2024 financials and the 2025 strategic outlook. Confidential academic
          analysis.
        </Note>
      </Section>
    </>
  )
}
