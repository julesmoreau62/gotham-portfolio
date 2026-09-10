"use client"

import { useState } from "react"
import { Section, Stats, Card, Figure, Bullets, Chips, Links, Note, Kv, Bar } from "@/components/contracts/cs"
import { Reveal, Stagger } from "@/components/fx/reveal"
import { cn } from "@/lib/utils"

function Tabs<T extends string>({ tabs, value, onChange, color }: { tabs: T[]; value: T; onChange: (t: T) => void; color: string }) {
  return (
    <div className="flex gap-1 border-b border-line">
      {tabs.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange(t)}
          className={cn("label px-3 py-2 -mb-px border-b-2 transition-colors", value === t ? "text-ink" : "border-transparent text-mute hover:text-ink")}
          style={value === t ? { borderColor: color, color } : undefined}
        >
          {t}
        </button>
      ))}
    </div>
  )
}

function Swatches({ items, fonts }: { items: [string, string][]; fonts: string }) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {items.map(([c, l]) => (
        <span key={l} className="flex items-center gap-2 mono text-[11px] text-mute">
          <span className="h-5 w-5 border border-ink/10" style={{ background: c }} />
          {l}
        </span>
      ))}
      <span className="mono text-[11px] text-mute border-l border-line pl-4">{fonts}</span>
    </div>
  )
}

const GOLD = "#C5A065"
const YELLOW = "#F0C000"

function Ferrant() {
  const [tab, setTab] = useState<"Overview" | "Stack" | "Catalog">("Overview")
  return (
    <div className="border-2 p-5 md:p-7" style={{ borderColor: `${GOLD}99`, background: "#1A2F25cc" }}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 label" style={{ color: GOLD }}>
            <span className="h-1.5 w-1.5 rounded-full animate-pulse2" style={{ background: GOLD }} />
            Live // ferrantphe.fr
          </div>
          <h3 className="display mt-2 text-[clamp(28px,3.5vw,44px)]">Ferrant P.H.E</h3>
          <p className="mono text-[12px] text-mute mt-1">Essential oils & concentrates — family client — Rodelinghem, Hauts-de-France</p>
        </div>
        <Links links={[{ label: "Visit ferrantphe.fr", href: "https://ferrantphe.fr" }]} />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-px border md:grid-cols-4" style={{ borderColor: `${GOLD}44`, background: `${GOLD}22` }}>
        {[
          ["16", "Products"],
          ["1989", "Est."],
          ["30T", "Daily capacity"],
          ["FR/EN", "Bilingual"],
        ].map(([v, l]) => (
          <div key={l} className="p-3 text-center" style={{ background: "#1A2F25" }}>
            <div className="display tnum text-[24px]" style={{ color: GOLD }}>
              {v}
            </div>
            <div className="label text-mute mt-1">{l}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Figure src="/assets/build/ferrantphe.png" alt="ferrantphe.fr — homepage" ratio="16/9" fit="contain" label="HOME" />
        <Figure src="/assets/build/ferrantphe2.webp" alt="ferrantphe.fr — products" ratio="16/9" fit="contain" label="PRODUCTS" />
      </div>

      <div className="mt-6">
        <Tabs tabs={["Overview", "Stack", "Catalog"]} value={tab} onChange={setTab} color={GOLD} />
      </div>

      {tab === "Overview" && (
        <div className="mt-6 space-y-8">
          <div>
            <div className="label text-mute mb-3">Site sections</div>
            <div className="grid grid-cols-1 gap-px bg-line md:grid-cols-2">
              {[
                ["Home", "Hero with animated background, event badge (FIE Frankfurt), CTA"],
                ["Products", "16 products, filterable by category (Oils / Concentrates), PDF datasheets"],
                ["About", "3-act company history + industrial specs (4 extractors, 316L SS, biomass boiler)"],
                ["Contact", "Phone, email, address, Maps link — M. Adrien Ferrant"],
              ].map(([l, d]) => (
                <div key={l} className="bg-bg p-4">
                  <div className="label" style={{ color: GOLD }}>
                    {l}
                  </div>
                  <p className="mono mt-1 text-[12px] text-mute">{d}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="label text-mute mb-3">Company timeline</div>
            <div className="border-l pl-4 space-y-4" style={{ borderColor: `${GOLD}66` }}>
              {[
                ["1989", "The roots", "Patrice Ferrant founds the company on family lands in Rodelinghem (Hauts-de-France). Onion farming diversifies into distillation."],
                ["2000s", "Innovation", "Industrial scale-up with custom 316L stainless steel stills. World-first leek essential oil production launched."],
                ["Today", "Global leader", "30 metric tons processed daily. Supplies the world’s leading flavor houses. Kosher certified, biomass closed-loop sustainability."],
              ].map(([y, l, t]) => (
                <div key={y}>
                  <div className="flex items-center gap-2">
                    <span className="mono text-[11px] font-bold" style={{ color: GOLD }}>
                      {y}
                    </span>
                    <span className="label text-ink/70">{l}</span>
                  </div>
                  <p className="mono mt-1 text-[12px] text-mute">{t}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="label text-mute mb-3">Technical highlights</div>
            <Bullets
              cols={2}
              check
              items={[
                "Bilingual FR/EN — full UI, product names, datasheets",
                "16 downloadable PDF technical datasheets (FR + EN)",
                "Dynamic product catalog with category filter",
                "SEO: JSON-LD schema, Open Graph, sitemap.xml",
                "PWA-ready: manifest, theme-color, Apple touch icon",
                "LLM discoverability layer via /llms.txt",
                "No-JS fallback with full product & contact info",
                "Responsive: sidebar nav desktop / hamburger mobile",
                "Kosher certification & sustainability messaging",
                "Event badge (FIE Frankfurt) configurable via data.js",
              ]}
            />
          </div>
          <div>
            <div className="label text-mute mb-3">Design system</div>
            <Swatches
              items={[
                ["#1A2F25", "phe-green"],
                ["#C5A065", "phe-gold"],
                ["#233b30", "phe-surface"],
                ["#F9F9F7", "phe-light"],
              ]}
              fonts="Playfair Display + Lato"
            />
          </div>
        </div>
      )}

      {tab === "Stack" && (
        <div className="mt-6 space-y-4">
          {[
            ["Frontend", ["HTML5", "CSS3", "JavaScript (vanilla)"]],
            ["Styling", ["Tailwind CSS (CDN)", "Playfair Display", "Lato"]],
            ["Performance", ["PWA", "Manifest.json", "Lazy loading"]],
            ["SEO", ["JSON-LD", "Open Graph", "Sitemap.xml", "Robots.txt"]],
            ["Discoverability", ["llms.txt (LLM layer)", "Structured data"]],
            ["Tooling", ["Lucide Icons", "Google Fonts", "GitHub Codex", "Claude Code"]],
          ].map(([cat, items]) => (
            <div key={cat as string}>
              <div className="label mb-2" style={{ color: GOLD }}>
                {cat as string}
              </div>
              <Chips items={items as string[]} />
            </div>
          ))}
        </div>
      )}

      {tab === "Catalog" && (
        <div className="mt-6 space-y-6">
          <div>
            <div className="label mb-2" style={{ color: GOLD }}>
              Essential oils — 12 references
            </div>
            <Chips items={["Leek", "Garlic", "Onion", "Shallot", "Lovage leaf", "Lovage root", "Angelica root", "Angelica seed", "Thuya atrovirens", "Thuya occidentalis", "Carrot seed", "Garlic chives"]} />
          </div>
          <div>
            <div className="label mb-2" style={{ color: GOLD }}>
              Concentrates — 4 references
            </div>
            <Chips items={["Leek conc.", "Shallot conc.", "Onion conc.", "Garlic conc."]} />
          </div>
          <Note>All products ship with bilingual PDF technical datasheets (FR + EN): composition, process, origin, harvest calendar, ratio.</Note>
        </div>
      )}
    </div>
  )
}

function Asn() {
  const [tab, setTab] = useState<"Overview" | "Stack" | "Squads">("Overview")
  return (
    <div className="border-2 p-5 md:p-7" style={{ borderColor: `${YELLOW}99`, background: "#0D0D0Acc" }}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 label" style={{ color: YELLOW }}>
            <span className="h-1.5 w-1.5 rounded-full animate-pulse2" style={{ background: YELLOW }} />
            In dev // asnortkerque95
          </div>
          <h3 className="display mt-2 text-[clamp(28px,3.5vw,44px)]">AS Nortkerque 95</h3>
          <p className="mono text-[12px] text-mute mt-1">Football club — local client — Nortkerque, Pas-de-Calais</p>
        </div>
      </div>

      <div className="mt-6">
        <Bar label="Build progress — WIP" value={50} color={YELLOW} />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-px border md:grid-cols-4" style={{ borderColor: `${YELLOW}44`, background: `${YELLOW}22` }}>
        {[
          ["1995", "Founded"],
          ["250+", "Members"],
          ["14", "Squads"],
          ["U7-U17", "Youth academy"],
        ].map(([v, l]) => (
          <div key={l} className="p-3 text-center" style={{ background: "#0D0D0A" }}>
            <div className="display tnum text-[24px]" style={{ color: YELLOW }}>
              {v}
            </div>
            <div className="label text-mute mt-1">{l}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Figure src="/assets/build/ASN1.webp" alt="AS Nortkerque 95 website — home" ratio="16/9" fit="contain" label="HOME" />
        <Figure src="/assets/build/ASN2.webp" alt="AS Nortkerque 95 website — teams" ratio="16/9" fit="contain" label="TEAMS" />
      </div>

      <div className="mt-6">
        <Tabs tabs={["Overview", "Stack", "Squads"]} value={tab} onChange={setTab} color={YELLOW} />
      </div>

      {tab === "Overview" && (
        <div className="mt-6 space-y-8">
          <div>
            <div className="label text-mute mb-3">Site sections</div>
            <div className="grid grid-cols-1 gap-px bg-line md:grid-cols-2">
              {[
                ["Home", "Hero “More than a club, a family” — CTAs Join us / Our matches"],
                ["Teams", "All squads by category — Seniors A/B, U23, youth teams, women’s"],
                ["Gallery", "Match & training photos — integrated lightbox"],
                ["Football school", "Youth academy U7→U17 — qualified coaches, Wed & Sat sessions"],
                ["Contact", "Club info + contact form"],
              ].map(([l, d]) => (
                <div key={l} className="bg-bg p-4">
                  <div className="label" style={{ color: YELLOW }}>
                    {l}
                  </div>
                  <p className="mono mt-1 text-[12px] text-mute">{d}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="label text-mute mb-3">Club history</div>
            <div className="border-l pl-4 space-y-4" style={{ borderColor: `${YELLOW}66` }}>
              {[
                ["1995", "Founded", "AS Nortkerque is established in Pas-de-Calais. The club is built on values of solidarity, respect and enjoyment of the game."],
                ["30 yrs", "Local roots", "250+ registered members, 14 squads and a structured youth academy (U7→U17). A cornerstone of local sport for three decades."],
                ["2025", "Digital debut", "First ever official website, no prior web presence. Launching a modern digital identity to support the club’s development ambitions."],
              ].map(([y, l, t]) => (
                <div key={y}>
                  <div className="flex items-center gap-2">
                    <span className="mono text-[11px] font-bold" style={{ color: YELLOW }}>
                      {y}
                    </span>
                    <span className="label text-ink/70">{l}</span>
                  </div>
                  <p className="mono mt-1 text-[12px] text-mute">{t}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="label text-mute mb-3">Technical highlights</div>
            <Bullets
              cols={2}
              check
              items={[
                "Club’s first-ever website — full digital debut",
                "Dark design with club identity colors (green / yellow)",
                "Youth football school section U7→U17 front & center",
                "Integrated photo gallery — matches & training",
                "Mobile-first responsive layout",
                "Strategic CTAs: Join us / Our matches",
                "Local SEO — Nortkerque, Pas-de-Calais",
                "Integrated contact form",
              ]}
            />
          </div>
          <div>
            <div className="label text-mute mb-3">Design system</div>
            <Swatches
              items={[
                ["#0D0D0A", "asn-dark"],
                ["#F0C000", "asn-yellow"],
                ["#2E5C1A", "asn-green"],
                ["#F9F9F7", "asn-light"],
              ]}
              fonts="Bebas Neue + Inter"
            />
          </div>
        </div>
      )}

      {tab === "Stack" && (
        <div className="mt-6 space-y-4">
          {[
            ["Frontend", ["HTML5", "CSS3", "JavaScript (vanilla)"]],
            ["Styling", ["Tailwind CSS (CDN)", "Bebas Neue", "Inter"]],
            ["Performance", ["WebP images", "Lazy loading"]],
            ["SEO", ["Open Graph", "Meta tags", "Sitemap.xml"]],
            ["Tooling", ["Claude Code", "GitHub Codex"]],
          ].map(([cat, items]) => (
            <div key={cat as string}>
              <div className="label mb-2" style={{ color: YELLOW }}>
                {cat as string}
              </div>
              <Chips items={items as string[]} />
            </div>
          ))}
        </div>
      )}

      {tab === "Squads" && (
        <div className="mt-6 space-y-4">
          <div className="label" style={{ color: YELLOW }}>
            14 squads — season 2025-2026
          </div>
          <Chips items={["Seniors A", "Seniors B", "U23", "U18", "U17", "U15", "U13", "U11", "U9", "U7", "Women’s", "Futsal", "Veterans", "Animation football"]} />
          <Note>Football school U7→U17 — qualified coaches, Wednesday & Saturday sessions, technical focus and team spirit.</Note>
        </div>
      )}
    </div>
  )
}

export function BuildCase() {
  return (
    <>
      <Section n="01" kicker="Client web builds" title="Deployed assets" intro="Production-grade websites delivered to real clients, built through AI-augmented workflows (Codex + Claude Code). I owned the brief, the content, the structure, the QA and the deployment; the tools wrote the code.">
        <Stats items={[{ v: "2", l: "Client sites" }, { v: "1", l: "Live in production" }, { v: "1", l: "In development · 50%" }, { v: "16", l: "PDF datasheets shipped" }]} />
        <Reveal className="mt-8">
          <Kv k="Method" v="Brief → structure → AI implementation → visual QA → deploy" />
          <Kv k="Tooling" v="Claude Code · GitHub Codex · Tailwind CDN · Netlify / static hosting" />
          <Kv k="Extras" v="SEO, Open Graph, sitemaps, PWA manifest, llms.txt discoverability layer" />
        </Reveal>
      </Section>

      <Section n="02" kicker="Client 01 · live" title="Ferrant P.H.E">
        <Reveal>
          <Ferrant />
        </Reveal>
      </Section>

      <Section n="03" kicker="Client 02 · in development" title="AS Nortkerque 95">
        <Reveal>
          <Asn />
        </Reveal>
        <Stagger className="mt-10 grid grid-cols-1 gap-px bg-line md:grid-cols-3" stagger={0.08}>
          <Card kicker="Why it matters">
            A 30-year-old club with 250+ members had no web presence at all. The site is its digital debut.
          </Card>
          <Card kicker="Connection">
            Same club as the ASN95 Signal case: the communication work made the website necessary.
          </Card>
          <Card kicker="Next">
            Gallery and contact form integration, then launch alongside the 2025-26 season communication.
          </Card>
        </Stagger>
      </Section>
    </>
  )
}
