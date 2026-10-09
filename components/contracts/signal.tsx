"use client"

import Image from "next/image"
import { Section, Stats, Card, Figure, Gallery, Quote, Bullets, Chips, Prose, Note } from "@/components/contracts/cs"
import { Reveal, Stagger, Wipe } from "@/components/fx/reveal"
import { Counter } from "@/components/fx/counter"

const KPI = [
  { v: 1, suffix: "M+", l: "Views" },
  { v: 93.8, prefix: "+", suffix: "%", l: "Interactions · 24.2K", d: 1 },
  { v: 162, prefix: "+", suffix: "%", l: "Watch time" },
  { v: 44, suffix: "K", l: "Accounts reached · +24%" },
  { v: 28.2, prefix: "+", suffix: "%", l: "Follower growth", d: 1 },
  { v: 467, prefix: "+", suffix: "%", l: "Sponsor CTR growth", d: 0 },
]

function Frame({ src, alt, ratio = "3/4", fit = "cover" }: { src: string; alt: string; ratio?: string; fit?: "cover" | "contain" }) {
  return (
    <Wipe>
      <div className="relative overflow-hidden border border-line bg-black frame" style={{ aspectRatio: ratio }}>
        <Image src={src} alt={alt} fill sizes="(min-width: 768px) 33vw, 100vw" className={fit === "cover" ? "object-cover" : "object-contain"} />
      </div>
    </Wipe>
  )
}

export function SignalCase() {
  return (
    <>
      {/* KPI strip */}
      <div className="border-b border-line px-5 py-8 md:px-8">
        <Stagger className="grid grid-cols-2 gap-px bg-line md:grid-cols-6" stagger={0.05}>
          {KPI.map((k) => (
            <div key={k.l} className="bg-bg px-4 py-5">
              <div className="display tnum text-[clamp(26px,3vw,44px)] text-[var(--accent)]">
                <Counter to={k.v} prefix={k.prefix} suffix={k.suffix} decimals={k.d ?? 0} />
              </div>
              <div className="label text-mute mt-2">{k.l}</div>
            </div>
          ))}
        </Stagger>
        <div className="label text-mute mt-4">January → June 2025 · Instagram & Facebook · sponsor activation measured through click-through rate</div>
        <p className="mono mt-3 max-w-3xl text-[11px] leading-relaxed text-mute">The +467% figure is relative growth in sponsor click-through rate. Absolute before-and-after rates are not included in this case study.</p>
      </div>

      {/* 00 MISSION */}
      <Section
        n="00"
        kicker="Context & responsibilities"
        title="Communication for a local football club"
        intro="During my third-year Sport Management internship, I led communication for AS Nortkerque (ASN95), January to June 2025. My responsibilities covered sponsor activation, recurring content, visual identity and matchday photography."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card kicker="Starting point" tone="surface">
            The club had no content calendar, visual guidelines or recurring formats. Social posts were sporadic,
            and sponsor visibility was limited to pitch-side banners. I built a consistent production routine
            around club news, matchday content and partner activation.
          </Card>
          <Card kicker="My contribution" tone="accent" title="Content, partners and matchdays">
            I coordinated the communication schedule, created recurring visual formats, organised sponsor content
            and photographed the club on the ground.
          </Card>
        </div>
      </Section>

      {/* ACT I */}
      <Section n="01" kicker="Sponsor activation" title="A prediction game that brings people back">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Card kicker="Original activation" title="“Les Pronos du Sultan”" tone="accent">
              A weekly score-prediction game with sponsor Sultan Kebab: a Google Form, a manually maintained leaderboard
              and a free meal for the top three. The activation gave the sponsor a recurring place in club communication,
              with <span className="text-[var(--accent)] font-semibold">+467% growth in click-through rate</span>.
              <div className="mt-6 flex items-baseline gap-3">
                <span className="display tnum text-[clamp(44px,6vw,90px)] text-[var(--accent)]">
                  <Counter to={467} prefix="+" suffix="%" />
                </span>
                <span className="label text-mute">relative growth in CTR</span>
              </div>
            </Card>
          </div>
          <div className="lg:col-span-5">
            <Figure src="/assets/comms/sponsor.png" alt="Les Pronos du Sultan — Sultan Kebab campaign visual" ratio="4/3" fit="contain" label="PRONOS_DU_SULTAN" />
          </div>
        </div>

        <Quote className="mt-12">Give partners a role in the weekly club experience.</Quote>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Card kicker="Platform prototype" title="ASN95 Predict" n="BETA">
              A beta project exploring how to reduce manual tracking with rankings, user profiles and a sponsor data
              layer. It extends the original activation; the results above belong to the original campaign.
              <Chips className="mt-5" items={["Live rankings", "User profiles", "Sponsor data layer"]} />
            </Card>
          </div>
          <div className="lg:col-span-5 flex items-center justify-center">
            <Reveal>
              <div className="relative w-40 aspect-[9/18] border-2 border-[var(--accent)]/60 bg-black p-3" aria-label="ASN95 Predict interface concept with illustrative data">
                <div className="mx-auto h-1.5 w-12 rounded-b bg-[var(--accent)]/30" />
                <div className="mt-3 flex items-center justify-between">
                  <span className="label text-[var(--accent)] text-[7px]">ASN95 Predict</span>
                  <span className="h-2 w-2 rounded-full border border-[var(--accent)]/50" />
                </div>
                <div className="mt-2 border border-[var(--accent)]/30 p-1.5">
                  <div className="label text-[6px] text-mute">Next match</div>
                  <div className="flex justify-between mono text-[8px] mt-1">
                    <b>ASN</b>
                    <span className="text-mute">vs</span>
                    <b>FCM</b>
                  </div>
                  <div className="mt-1 h-3 bg-[var(--accent)]/20 grid place-items-center label text-[5px] text-[var(--accent)]">Submit prediction</div>
                </div>
                <div className="mt-2 label text-[6px] text-mute">Live rankings</div>
                {[
                  ["1", "Karim M.", "42"],
                  ["2", "Sofiane L.", "38"],
                  ["3", "Julien D.", "35"],
                ].map((r) => (
                  <div key={r[0]} className="flex justify-between border-b border-line py-0.5 mono text-[7px]">
                    <span>
                      <span className="text-mute mr-1">{r[0]}</span>
                      {r[1]}
                    </span>
                    <span className="text-[var(--accent)] font-bold">{r[2]}</span>
                  </div>
                ))}
                <div className="absolute bottom-2 inset-x-2 label text-[5px] text-center text-mute">Interface concept · illustrative data</div>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* ACT II */}
      <Section
        n="02"
        kicker="Recurring communication"
        title="Building a visual identity week after week"
        intro="Match announcements, results and interviews gave the club a consistent visual identity and a regular publishing rhythm."
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex flex-col gap-3">
            <div className="label text-[var(--accent)]">Match posters</div>
            <Frame src="/signal/affiche_match_1.webp" alt="Match poster — pre-game announcement" />
            <p className="mono text-[11px] leading-relaxed text-mute">
              Pre-game announcements. Team identity meets local branding. Date, venue, opponent, sponsors, all in one
              visual asset.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="label text-[var(--accent)]">Result graphics</div>
            <Frame src="/signal/brise_légère.webp" alt="Result graphic — Brise légère" ratio="16/9" fit="contain" />
            <Frame src="/signal/le_soleil_tape.webp" alt="Result graphic — Le soleil tape" ratio="16/9" fit="contain" />
            <div className="border-l-2 border-[var(--accent)] bg-surface px-3 py-2.5 mono text-[11px] leading-relaxed">
              <p>
                <b className="text-ink">“Brise légère, 3 points dans l’air”</b>
                <span className="text-mute"> — Light breeze, 3 points in the air</span>
              </p>
              <p className="mt-1">
                <b className="text-ink">“Le soleil tape ? Nous aussi.”</b>
                <span className="text-mute"> — The sun hits hard? So do we.</span>
              </p>
              <p className="label text-mute mt-2">Every result tells a story, not just a score.</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="label text-[var(--accent)]">Interview series</div>
            <Frame src="/signal/interview.webp" alt="Interview series — weekly content" />
            <p className="mono text-[11px] leading-relaxed text-mute">
              Serialized weekly content. Building recurring engagement around club figures and coaches.
            </p>
          </div>
        </div>

        <Stats className="mt-10 md:grid-cols-3" size="sm" items={[{ v: "15+", l: "Visuals per season" }, { v: "3", l: "Recurring formats" }, { v: "5+", l: "Sponsors per visual" }]} />

        <Note className="mt-8">
          There was no brand book when I started, just a badge and a set of colors. The visual language was built week
          by week: testing layouts, refining typography, finding a tone that felt like the club. By mid-season, the
          templates were locked and every post was instantly recognizable as ASN95.
        </Note>

        <div className="label text-mute mt-12 mb-4">More formats · championship posters, results, sponsor dossier</div>
        <Gallery
          cols={4}
          items={[
            { src: "/assets/comms/match-championnat.png", alt: "Championship match poster", label: "MATCH_01", fit: "contain" },
            { src: "/assets/comms/match-championnat-2.png", alt: "Championship match poster 2", label: "MATCH_02", fit: "contain" },
            { src: "/assets/comms/resultat-match.jpg", alt: "Match result graphic", label: "RESULT_01", fit: "contain" },
            { src: "/assets/comms/dossier-sponsoring.jpg", alt: "Sponsoring dossier cover", label: "SPONSOR DOSSIER", fit: "contain" },
          ]}
        />
      </Section>

      {/* ACT III */}
      <Section
        n="03"
        kicker="Photography on site"
        title="Capturing the club from the sidelines"
        intro="I produced the photography used in the club’s communication, from match coverage to sponsor and youth academy portraits."
      >
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <div className="label text-[var(--accent)]">Match coverage</div>
            <div className="grid grid-cols-2 gap-3">
              <Frame src="/signal/fond.webp" alt="Match coverage — senior team" />
              <Frame src="/signal/photo_senior_1.jpg" alt="Match coverage — senior team" />
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mono text-[11px] font-semibold text-[var(--accent)]">
              <span>33 events covered</span>
              <span className="opacity-40">—</span>
              <span>500+ shots per match</span>
              <span className="opacity-40">—</span>
              <span>~50 delivered per session</span>
              <span className="opacity-40">—</span>
              <span>1,650+ edited photos</span>
            </div>
            <p className="mono text-[11px] leading-relaxed text-mute">
              26 league matches, 4 youth training camps, 2 general assemblies and the club’s 30th anniversary event.
            </p>
            <Note>
              A repeatable matchday routine: prepare batteries and lenses, arrive early, shoot the event, select and edit
              the images, then deliver a set ready for publication.
            </Note>
          </div>
          <div className="flex flex-col gap-4">
            <div className="label text-[var(--accent)]">Sponsor photoshoot</div>
            <Frame src="/signal/group_sponsor.webp" alt="Youth academy photoshoot — 50+ players in branded Senlecq kits" ratio="16/9" />
            <div className="grid grid-cols-3 gap-3">
              {["photoshoot_individuel_1.jpg", "photoshoot_individuel_2.jpg", "photoshoot_individuel_5.webp"].map((f) => (
                <Frame key={f} src={`/signal/${f}`} alt="Individual player portrait — sponsor photoshoot" />
              ))}
            </div>
            <p className="mono text-[11px] leading-relaxed text-mute">
              A youth academy photoshoot connected sponsor visibility with the club’s players and the branded kits
              they use on the pitch.
            </p>
            <Note>
              More than 50 young players photographed in one afternoon on their training pitch. The session produced
              group and individual portraits for club and sponsor communication.
            </Note>
          </div>
        </div>
        <div className="label text-mute mt-8 text-center">Gear // Sony α6400 + SEL70350G</div>
      </Section>

      {/* DEBRIEF */}
      <Section n="04" kicker="What I learned" title="A routine the club can build on" intro="Consistent content, practical sponsor activations and reliable production matter across the whole season.">
        <Stagger className="grid grid-cols-1 gap-px bg-line md:grid-cols-3" stagger={0.08}>
          <Card kicker="01 — Consistency wins">
            Showing up every week matters more than any single viral post. The audience grew because they knew what to
            expect and when to expect it.
          </Card>
          <Card kicker="02 — Sponsors need stories">
            Prediction games, photoshoots and recurring content give partners more ways to participate in the club’s
            community than logo placement alone.
          </Card>
          <Card kicker="03 — Build, then scale">
            The prediction game started with a Google Form. Running it manually showed what a future platform would
            need to simplify before developing the beta.
          </Card>
        </Stagger>
        <Prose className="mt-8">
          <p>These principles now guide how I approach every project.</p>
        </Prose>
        <Reveal className="mt-8">
          <Bullets
            cols={2}
            items={[
              "Built complete digital presence from scratch (no prior content calendar, no visual guidelines)",
              "Created “Les Pronos du Sultan”: weekly sponsor prediction game, +467% CTR",
              "Explored ASN95 Predict (beta): rankings, user profiles and a sponsor data layer",
              "15+ visuals per season across 3 recurring formats, 5+ sponsors integrated per visual",
              "Match photography: 33 events, 500+ shots per match, 1,650+ edited photos",
              "Managed matchday operations, visual identity and sponsor activation",
            ]}
          />
        </Reveal>
      </Section>
    </>
  )
}
