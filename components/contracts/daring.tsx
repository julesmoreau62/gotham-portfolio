"use client"

import Image from "next/image"
import { useState } from "react"
import { Section, Stats, Card, Figure, Gallery, Quote, Bullets, Chips, Links, Prose, Note, Kv } from "@/components/contracts/cs"
import { Reveal, Stagger, Wipe } from "@/components/fx/reveal"
import { Btn, ArrowUpRight } from "@/components/ui/primitives"

const B = "/assets/Royal%20daring%20"
const V = `${B}/Daring%20Vitrine%20Marketing`
const LIVE = "https://leafy-pavlova-69305b.netlify.app"
const PDF = `${V}/Royal_Daring_Partenaires_2025-26.pdf`

export function DaringCase() {
  const [interactive, setInteractive] = useState(false)

  return (
    <>
      {/* 01 PROBLEM */}
      <Section
        n="01"
        kicker="Problem statement"
        title="An institution with no voice"
        intro="Royal Daring Club de Molenbeek, founded in 1922, is one of Brussels’ historic hockey clubs: 19 teams from youth squads to senior sides, around 620 members, a strong local footprint and a promotion to Division Honneur on the horizon. Its communication, sponsor offer and funding materials had not kept up."
      >
        <Quote by="Core problem statement · ISA internship report">
          How can an amateur club transform scattered communication assets into a coherent, credible, sponsor-ready
          identity capable of supporting partner acquisition and long-term club development?
        </Quote>

        <Stagger className="mt-10 grid grid-cols-1 gap-px bg-line md:grid-cols-3" stagger={0.08}>
          <Card kicker="Context" n="A">
            19 teams, from youth squads to senior sides, with a strong local footprint in Molenbeek and a century of
            heritage.
          </Card>
          <Card kicker="Gap" n="B">
            No structured visual identity, no sponsorship material beyond a static 3-tier PDF, no institutional
            LinkedIn presence, no reusable production workflow.
          </Card>
          <Card kicker="System" n="C">
            Brand guidelines, website, brochure, social templates and an editorial handover designed to work together
            and to outlast the internship.
          </Card>
        </Stagger>

        <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
          <Reveal className="border border-line p-6">
            <div className="label text-mute mb-5">Before</div>
            <Bullets
              items={[
                "Fragmented visual communication",
                "No sponsor-ready digital surface",
                "No structured partner argument",
                "No reusable production workflow",
              ]}
            />
          </Reveal>
          <div className="hidden lg:flex items-center px-2 display text-[40px] text-[var(--accent)]">→</div>
          <Reveal delay={0.1} className="border border-[var(--accent)] p-6">
            <div className="label text-[var(--accent)] mb-5">After</div>
            <Bullets
              check
              items={[
                "Live bilingual FR/NL sponsor website",
                "Complete brand guidelines + Canva template system",
                "Programmatic 9-page PDF brochure",
                "Reusable social, signage and editorial templates",
              ]}
            />
          </Reveal>
        </div>

        <Reveal className="mt-10">
          <div className="label text-mute mb-3">Strategic angle</div>
          <Prose>
            <p>
              Reposition the club as a historic Brussels hockey institution with a clear partner narrative: heritage
              since 1922, local roots in Molenbeek, youth development, social impact, matchday visibility and
              business-network value for sponsors.
            </p>
          </Prose>
        </Reveal>
      </Section>

      {/* 02 PARTNER WEBSITE */}
      <Section
        n="02"
        kicker="Partner website"
        title="From sponsorship deck to conversion website"
        intro="A bilingual FR/NL website designed as a sponsor acquisition tool: audiences, visibility assets, CSR patronage, Business Club narrative and a direct contact flow in one clear experience. Deployed on Netlify."
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Figure src={`${V}/img/sponsor-terrain.jpg`} alt="Pitch-side partner visibility at Royal Daring" ratio="16/10" label="FIELD_ASSETS" caption="Pitch-side partner visibility. The website turns each physical asset into a line item of the sponsor offer." />
          </div>
          <div className="lg:col-span-5 flex flex-col gap-4">
            <Card kicker="Content architecture" tone="surface">
              Homepage hero, club figures, “Why Daring”, sponsor visibility formats, partner packages, CSR / youth
              program, Business Club & network, contact section, existing partner logos.
            </Card>
            <Chips items={["Live Netlify deploy", "FR/NL structure", "Sponsor funnel", "CSR patronage", "Business Club", "Contact flow"]} />
            <Links
              links={[
                { label: "Live website", href: LIVE },
                { label: "FR archive", href: `${V}/index.html` },
                { label: "NL archive", href: `${V}/index-nl.html` },
                { label: "PDF brochure", href: PDF, download: true },
              ]}
            />
          </div>
        </div>

        <div className="mt-12">
          <div className="label text-mute mb-4">Sponsor funnel · each asset has a job</div>
          <Stagger className="grid grid-cols-1 gap-px bg-line md:grid-cols-4" stagger={0.07}>
            {[
              ["Awareness", "Social visuals", "Make the club visible and recognizable."],
              ["Credibility", "Brand system", "Create consistency across every touchpoint."],
              ["Offer", "Website + brochure", "Turn sponsor packages into a clear value proposition."],
              ["Contact", "Live deployment", "Give prospects a direct path to act."],
            ].map(([stage, asset, job], i) => (
              <div key={stage} className={i === 2 ? "bg-[var(--accent)] text-black p-5 min-h-[180px]" : "bg-bg p-5 min-h-[180px]"}>
                <span className={i === 2 ? "mono text-[10px] tracking-[0.2em] text-black/60" : "mono text-[10px] tracking-[0.2em] text-[var(--accent)]"}>0{i + 1}</span>
                <h3 className="display mt-4 text-[22px]">{stage}</h3>
                <p className={i === 2 ? "label mt-2 text-black/70" : "label mt-2 text-[var(--accent)]"}>{asset}</p>
                <p className={i === 2 ? "mono mt-4 text-[12px] text-black/80" : "mono mt-4 text-[12px] text-mute"}>{job}</p>
              </div>
            ))}
          </Stagger>
        </div>
      </Section>

      {/* 03 LIVE BUILD */}
      <Section
        n="03"
        kicker="Live web build"
        title="AI-augmented delivery"
        intro="AI-assisted implementation with Claude Code and Codex, directed through product framing, content architecture, visual QA, integration decisions and final delivery. I owned every decision; the tools accelerated execution."
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <Wipe>
            <div className="border border-line bg-surface">
              <div className="flex h-10 items-center justify-between gap-4 border-b border-line px-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-gold" />
                  <span className="h-2.5 w-2.5 rounded-full bg-ink/25" />
                </div>
                <span className="label text-mute truncate">{LIVE.replace("https://", "")}</span>
                <div className="hidden sm:flex items-center gap-1">
                  {(["Static", "Interactive"] as const).map((l) => {
                    const on = (l === "Interactive") === interactive
                    return (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setInteractive(l === "Interactive")}
                        className={on ? "label bg-ink px-2 py-1 text-black" : "label px-2 py-1 text-mute hover:text-ink"}
                      >
                        {l}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="relative aspect-[16/10] bg-black">
                {interactive ? (
                  <iframe src={`${V}/index.html`} title="Royal Daring partner website — interactive preview" loading="lazy" className="absolute inset-0 h-full w-full" data-lenis-prevent />
                ) : (
                  <>
                    <Image src={`${B}/sponsor-site-preview.jpg`} alt="Royal Daring sponsor website preview" fill sizes="(min-width: 1024px) 65vw, 100vw" className="object-cover object-top" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <button
                      type="button"
                      onClick={() => setInteractive(true)}
                      className="absolute bottom-4 left-4 inline-flex h-10 items-center gap-2 border border-ink/50 bg-black/70 px-4 label text-ink hover:bg-ink hover:text-black transition-colors"
                      data-cursor="load"
                    >
                      Interactive preview
                    </button>
                  </>
                )}
              </div>
            </div>
          </Wipe>

          <div className="flex flex-col gap-4">
            <Card kicker="Built with" title="Claude Code + Codex" tone="accent">
              Prompting and iteration, front-end integration, visual QA and Netlify deployment. Content structure and
              editorial decisions stayed human.
            </Card>
            <Card kicker="My role">
              <Chips items={["Product direction", "Brand system", "Prompting & iteration", "Front-end integration", "Visual QA", "Deployment"]} />
            </Card>
            <Card kicker="Stack">
              <Chips items={["HTML5", "CSS3", "Vanilla JS", "Python", "ReportLab", "Netlify", "GitHub", "Claude Code", "Codex"]} />
            </Card>
            <Stats size="sm" className="md:grid-cols-3" items={[{ v: "2", l: "Languages" }, { v: "10+", l: "Sections" }, { v: "1", l: "Sponsor funnel" }]} />
            <Card kicker="Process">
              {["Strategy", "UX structure", "AI-assisted implementation", "Visual QA", "Netlify deployment"].map((s, i) => (
                <Kv key={s} k={`0${i + 1}`} v={s} />
              ))}
            </Card>
          </div>
        </div>
      </Section>

      {/* 04 SPONSOR OFFER */}
      <Section
        n="04"
        kicker="Sponsor offer"
        title="From a static 3-tier PDF to a 5-tier package"
        intro="The sponsorship offer was rebuilt from a static three-tier PDF into a five-tier package plus a Youth Pack, each with explicit visibility formats: field assets, jersey placements, LED board, match posters, social placements and a CSR / youth program framing."
      >
        <Gallery
          cols={4}
          items={[
            { src: `${V}/img/panneauled.jpg`, alt: "LED board sponsor visibility", label: "LED BOARD", ratio: "4/5" },
            { src: `${V}/img/sponsor-maillot.png`, alt: "Jersey sponsor placement", label: "JERSEY", ratio: "4/5", fit: "contain" },
            { src: `${V}/img/affiche-match.png`, alt: "Match poster with sponsor placements", label: "MATCH POSTER", ratio: "4/5", fit: "contain" },
            { src: `${V}/img/rse-1.jpg`, alt: "CSR youth program", label: "CSR / YOUTH", ratio: "4/5" },
          ]}
        />
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card kicker="Packages" title="Gold · Silver · Bronze + 2 tiers · Youth Pack">
            Storytelling per tier: visibility formats, field assets, jersey assets, LED board, match posters, social
            media placements, CSR / youth program framing, Business Club access.
          </Card>
          <Card kicker="Institutional" title="LinkedIn page & positioning">
            Creation of the club’s LinkedIn page and a professional positioning for partner outreach.
          </Card>
          <Card kicker="Partners" title="22 existing partner logos">
            Integrated on the website and the brochure as social proof for prospects.
          </Card>
        </div>
        <Reveal className="mt-8">
          <div className="label text-mute mb-3">Existing partners</div>
          <div className="grid grid-cols-4 gap-px bg-line border border-line sm:grid-cols-6 lg:grid-cols-11">
            {Array.from({ length: 22 }, (_, i) => (
              <div key={i} className="relative aspect-square bg-ink p-2">
                <Image src={`${V}/img/logo%20sponsor/logo${i + 1}.jpg`} alt={`Partner logo ${i + 1}`} fill sizes="90px" className="object-contain p-2" />
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* 05 BRAND */}
      <Section
        n="05"
        kicker="Brand guidelines"
        title="A system a volunteer can use"
        intro="Colors, typography, tone, logo usage, visual hierarchy and social media adaptation rules, delivered with a Canva template system across four content formats: matchday, institutional, event, recruitment."
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr] lg:items-start">
          <Wipe from="left" className="mx-auto w-full max-w-[220px] lg:mx-0">
            <div className="relative aspect-square border border-[var(--accent)] bg-black">
              <Image src={`${B}/logo-DARING.png`} alt="Royal Daring HC logo" fill sizes="220px" className="object-contain p-6" />
            </div>
          </Wipe>
          <div className="space-y-8">
            <Stagger className="grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-4" stagger={0.06}>
              {[
                { c: "#C8102E", n: "Daring Red", r: "Action & impact" },
                { c: "#0D0D0D", n: "Black", r: "Structure" },
                { c: "#C9A84C", n: "Gold", r: "Prestige" },
                { c: "#F4F0E8", n: "Off-white", r: "Breathing space" },
              ].map((s) => (
                <div key={s.c} className="bg-bg">
                  <div className="h-24" style={{ background: s.c }} />
                  <div className="p-3">
                    <div className="mono text-[12px] font-semibold">{s.n}</div>
                    <div className="label text-mute mt-1">{s.c}</div>
                    <div className="mono text-[11px] text-mute mt-1">{s.r}</div>
                  </div>
                </div>
              ))}
            </Stagger>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card kicker="Headlines & posters">
                <p className="text-[34px] leading-tight text-ink" style={{ fontFamily: "Georgia, 'Playfair Display', serif" }}>
                  Playfair Display
                </p>
                <p className="mt-2">High-contrast serif. Bold & Black.</p>
              </Card>
              <Card kicker="UI & body copy">
                <p className="text-[34px] leading-tight text-ink" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
                  DM Sans
                </p>
                <p className="mt-2">Geometric sans-serif. Regular, Medium, Bold.</p>
              </Card>
            </div>
            <Chips items={["Logo", "Colors", "Typography", "Tone", "Templates", "Social adaptation rules"]} />
            <Btn href={`${B}/chartegraphiquedemo.pdf`} download tone="ink">
              Download full guidelines · PDF
            </Btn>
          </div>
        </div>
      </Section>

      {/* 06 HANDOVER */}
      <Section
        n="06"
        kicker="Continuity system"
        title="Editorial handover, built to outlast the internship"
        intro="A Notion workspace for the club’s volunteers and the next intern: a diagnostic of the starting point, a prescriptive editorial charter, 11 ready-to-use post templates and a live task tracker, exported in Markdown so any AI assistant can reuse it directly."
      >
        <Gallery
          cols={3}
          items={[
            { src: `${B}/notion/playbook.png`, alt: "Notion PlayBook", ratio: "4/3", label: "PLAYBOOK", caption: "Mission, space contents and reading priorities for the incoming intern." },
            { src: `${B}/notion/charte-editoriale.png`, alt: "Editorial charter", ratio: "4/3", label: "EDITORIAL CHARTER", caption: "Diagnostic of the starting point (reach, video, storytelling, cadence) versus the prescriptive target." },
            { src: `${B}/notion/typologies.png`, alt: "Post typology", ratio: "4/3", label: "POST TYPOLOGY", caption: "11 formats, each with context, visual brief, caption template and channel." },
          ]}
        />
      </Section>

      {/* 07 BROCHURE + SKILLS */}
      <Section n="07" kicker="Brochure & skills" title="Nine pages, generated by code">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card kicker="Brochure PDF" title="9 pages · Python + ReportLab" tone="accent">
            Generated programmatically. The club can update figures and content without desktop publishing software:
            edit the data, rerun the script.
            <Stats size="sm" className="mt-5 md:grid-cols-3" items={[{ v: "9", l: "Pages" }, { v: "PY", l: "ReportLab" }, { v: "AUTO", l: "Updates" }]} />
            <div className="mt-5">
              <Btn href={PDF} download tone="ink">
                Download brochure
              </Btn>
            </div>
          </Card>
          <Card kicker="Skills mobilized" tone="surface">
            <Bullets
              cols={2}
              check
              items={[
                "Art direction",
                "Brand identity",
                "Responsive web design",
                "Vanilla front-end",
                "Python PDF (ReportLab)",
                "Social media strategy",
                "FR/NL production",
                "Design system",
                "Physical signage",
                "Sponsor storytelling",
                "Visual QA",
                "AI-assisted workflow",
              ]}
            />
          </Card>
        </div>
      </Section>

      {/* 08 VISUALS */}
      <Section
        n="08"
        kicker="Visual adaptations"
        title="Every visual fits the system"
        intro="The goal: enable a volunteer to produce a new asset without breaking brand consistency. Weekly recaps, matchday stories, playoff posters, merchandising, bilingual camps and physical signage."
      >
        <div className="label text-mute mb-4">Social media · weekend recap — weekly Instagram carousel, every Monday</div>
        <Gallery
          cols={4}
          items={[1, 2, 3, 4].map((n) => ({
            src: `${B}/recap%20du%20weekend/${n}.png`,
            alt: `Weekend recap slide ${n}`,
            ratio: "4/5",
            fit: "contain" as const,
            label: `SLIDE_0${n}`,
          }))}
        />

        <div className="label text-mute mt-12 mb-4">Events & match day — playoff posters, real-time stories, merchandising</div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          <Figure className="md:col-span-5" src={`${B}/affiche_final.png`} alt="Playoff final poster" ratio="4/5" label="PLAYOFF POSTER" />
          <Figure className="md:col-span-3" src={`${B}/story%20match/H1/score_final.png`} alt="Match day story — final score" ratio="9/16" label="STORY · MATCH DAY" />
          <Figure className="md:col-span-4" src={`${B}/tshirt_playoffs.png`} alt="Playoffs T-shirt" ratio="4/5" label="MERCHANDISING" />
        </div>

        <div className="label text-mute mt-12 mb-4">Bilingual FR/NL & templates — each visual exists in French and Dutch</div>
        <Gallery
          cols={3}
          items={[
            { src: `${B}/stage_ete_fr.png`, alt: "Summer camp — French version", label: "FR" },
            { src: `${B}/stage_ete_nl.png`, alt: "Summer camp — Dutch version", label: "NL" },
            { src: `${B}/portrait.png`, alt: "Player portrait template", label: "TEMPLATE · PORTRAIT" },
          ]}
        />

        <div className="label text-mute mt-12 mb-4">Club signage — physical brand communication, every piece bilingual</div>
        <Gallery
          cols={4}
          items={[
            { src: `${B}/info_general_zonefumeur.jpg`, alt: "Smoking area sign", ratio: "3/4", label: "SIGNAGE_01" },
            { src: `${B}/info_general_chien.png`, alt: "Dogs on leash sign", ratio: "3/4", label: "SIGNAGE_02" },
            { src: `${B}/info_general_cartsnack.png`, alt: "Snack menu", ratio: "3/4", label: "SIGNAGE_03" },
            { src: `${B}/info_general_portecuisine.png`, alt: "Daring is Cooking kitchen door", ratio: "3/4", label: "SIGNAGE_04" },
          ]}
        />

        <div className="mt-12">
          <Figure src={`${V}/img/hero.jpg`} alt="Royal Daring pitch at Wemmel" ratio="21/9" label="TERRAIN · WEMMEL" sizes="100vw" />
        </div>

        <Note className="mt-10">
          Season 2025-26 · Molenbeek, Brussels · Skills demonstrated: sport sponsorship strategy, amateur club
          communication, brand identity, web design, front-end development, bilingual FR/NL production, PDF
          generation, sponsor storytelling, visual QA, social media asset direction, sports marketing.
        </Note>

        <div className="mt-8">
          <Btn href={LIVE} external tone="acid" size="lg">
            Open live deployment <ArrowUpRight className="h-3.5 w-3.5" />
          </Btn>
        </div>
      </Section>
    </>
  )
}
