"use client"

import Image from "next/image"
import { Section, Stats, Card, Figure, Gallery, Quote, Bullets, Chips, Prose, Note, Bar } from "@/components/contracts/cs"
import { Reveal, Stagger, Wipe } from "@/components/fx/reveal"
import { Counter } from "@/components/fx/counter"

const KPI = [
  { v: 1, suffix: "M+", l: "Views" },
  { v: 93.8, prefix: "+", suffix: "%", l: "Interactions · 24.2K", d: 1 },
  { v: 162, prefix: "+", suffix: "%", l: "Watch time" },
  { v: 44, suffix: "K", l: "Accounts reached · +24%" },
  { v: 28.2, prefix: "+", suffix: "%", l: "Follower growth", d: 1 },
  { v: 467, prefix: "+", suffix: "%", l: "Sponsor CTR", d: 0 },
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
        <div className="label text-mute mt-4">Season Jan → Jun 2025 · Instagram & Facebook · sponsor activation measured in click-through</div>
      </div>

      {/* 00 MISSION */}
      <Section
        n="00"
        kicker="Mission brief"
        title="A club with a community, but no voice"
        intro="During my third year of Licence STAPS (Sport Management), I joined AS Nortkerque (ASN95) as Head of Communications for a full season. What started as an internship became a complete digital overhaul: sponsor activation, visual identity, match-day photography."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card kicker="Starting point" tone="surface">
            When I arrived, ASN95 had no structured digital presence. No content calendar, no visual guidelines, no
            recurring formats. Sponsors had zero visibility beyond pitch-side banners. Social media was sporadic: a
            post here, a score there, no identity. The club had the community, but no voice. My job was to build one
            from scratch.
          </Card>
          <Card kicker="Frequency" tone="accent" title="143.7 MHz // encrypted">
            Three roles across one season: sponsor activation, content and identity, field photography. Coordinated
            communication schedules and matchday operations to increase club visibility.
          </Card>
        </div>
      </Section>

      {/* ACT I */}
      <Section n="I" kicker="Act I · Activation" title="Sponsor engagement through prediction games">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Card kicker="V1 // Sponsor activation" title="“Les Pronos du Sultan”" tone="accent">
              In 2024, ASN95 partnered with Sultan Kebab on a simple bet: a weekly prediction game to turn passive
              followers into an active community. Low-tech by design: a Google Form, a manual leaderboard, a free meal
              for the top 3. It drove <span className="text-[var(--accent)] font-semibold">+467% CTR</span>. Followers
              came back. Every. Single. Week. The infrastructure couldn’t scale. The proof of concept was undeniable.
              <div className="mt-6 flex items-baseline gap-3">
                <span className="display tnum text-[clamp(44px,6vw,90px)] text-[var(--accent)]">
                  <Counter to={467} prefix="+" suffix="%" />
                </span>
                <span className="label text-mute">click-through rate</span>
              </div>
            </Card>
          </div>
          <div className="lg:col-span-5">
            <Figure src="/assets/comms/sponsor.png" alt="Les Pronos du Sultan — Sultan Kebab campaign visual" ratio="4/3" fit="contain" label="PRONOS_DU_SULTAN" />
          </div>
        </div>

        <Quote className="mt-12">The +467% wasn’t a campaign. It was a blueprint.</Quote>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Card kicker="V2 // Platform build" title="ASN95 Predict" n="BETA">
              ASN95 Predict is the real thing. Live rankings, user profiles, sponsor-ready data capture, built to make
              this activation replicable for any future partner. No more manual tracking. Just a model that scales.
              <div className="mt-6">
                <Bar label="Status — beta" value={80} />
              </div>
              <Chips className="mt-5" items={["Live rankings", "User profiles", "Sponsor data layer"]} />
            </Card>
          </div>
          <div className="lg:col-span-5 flex items-center justify-center">
            <Reveal>
              <div className="relative w-40 aspect-[9/18] border-2 border-[var(--accent)]/60 bg-black p-3">
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
                <div className="absolute bottom-2 inset-x-2 label text-[5px] text-center text-mute">Powered by Sultan Kebab</div>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* ACT II */}
      <Section
        n="II"
        kicker="Act II · Comms"
        title="Building a visual identity week after week"
        intro="The activation proved demand. Now the content had to match the ambition. From engagement to identity."
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
        n="III"
        kicker="Act III · Field"
        title="Capturing the club from the sidelines"
        intro="Every visual needed proof. So we shot it ourselves. From design to the pitch."
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
              Near-complete season coverage: 26 league matches, 4 youth training camps, 2 general assemblies and the
              club’s 30th anniversary event. From the pitch to the feed.
            </p>
            <Note>
              Every Sunday at 13:00, same routine: charge batteries, clean lenses, arrive early. Rain, wind, mud. 33
              match days, no excuses, no missed games. The players knew me by name by week five. That’s when the shots
              started getting real.
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
              Youth academy photoshoot: sponsor visibility through authentic club moments. Not a logo on a banner. A
              brand woven into the heartbeat of the club.
            </p>
            <Note>
              50+ kids in branded kits, one afternoon, no studio, just the pitch they train on every week. The sponsor
              got content they actually used. The kids got portraits they were proud of. That’s the ROI nobody puts in
              a deck.
            </Note>
          </div>
        </div>
        <div className="label text-mute mt-8 text-center">Gear // Sony α6400 + SEL70350G</div>
      </Section>

      {/* DEBRIEF */}
      <Section n="IV" kicker="Debrief" title="One season. Three roles. One mission." intro="Give a local club the digital presence it deserved. Signal ends, transmission complete.">
        <Stagger className="grid grid-cols-1 gap-px bg-line md:grid-cols-3" stagger={0.08}>
          <Card kicker="01 — Consistency wins">
            Showing up every week matters more than any single viral post. The audience grew because they knew what to
            expect and when to expect it.
          </Card>
          <Card kicker="02 — Sponsors need stories">
            A logo on a banner is invisible. A sponsor woven into weekly content, prediction games and photoshoots
            becomes part of the club’s identity.
          </Card>
          <Card kicker="03 — Build, then scale">
            The prediction game started with a Google Form. It didn’t need to be perfect, it needed to prove the
            concept. V2 exists because V1 worked.
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
              "Developed ASN95 Predict platform (beta): live rankings, user profiles, sponsor data layer",
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
