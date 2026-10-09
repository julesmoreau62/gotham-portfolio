"use client"

import { Section, Stats, Card, Figure, Gallery, Chips, Note, Kv } from "@/components/contracts/cs"
import { Reveal, Stagger, Wipe } from "@/components/fx/reveal"
import { Counter } from "@/components/fx/counter"

function Incident({
  time,
  title,
  severity,
  color,
  description,
  resolution,
  stats,
}: {
  time: string
  title: string
  severity: string
  color: string
  description: string
  resolution: string
  stats: [string, string][]
}) {
  return (
    <div className="relative border border-line bg-bg p-5" style={{ borderLeftColor: color, borderLeftWidth: 3 }}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="mono text-[11px] tracking-[0.2em]" style={{ color }}>
            {time}
          </span>
          <h4 className="display text-[18px]">{title}</h4>
        </div>
        <span className="label border px-2 py-1" style={{ color, borderColor: color }}>
          {severity}
        </span>
      </div>
      <p className="mono mt-3 text-[12px] leading-relaxed text-mute">{description}</p>
      <div className="mt-4 border border-acid/30 bg-surface p-4">
        <div className="label text-acid">What changed</div>
        <p className="mono mt-2 text-[11px] leading-relaxed text-mute">{resolution}</p>
        <div className="mt-3 grid grid-cols-3 gap-px bg-line border-t border-line pt-3">
          {stats.map(([l, v]) => (
            <div key={l} className="text-center">
              <div className="label text-mute">{l}</div>
              <div className="display text-[18px] text-acid mt-1">{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function FieldOpsCase() {
  return (
    <>
      {/* 01 MISSION */}
      <Section n="01" kicker="Context & responsibilities" title="Communication and coordination on site" intro="I led communication and contributed to field operations for the ASI Multisports Tournament at UFR3S Lille, December 2025. The event brought together 500+ people across four disciplines, with venue and weather changes to handle before the start.">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <Wipe className="lg:col-span-7">
            <div className="border border-[var(--accent)]/50 bg-black">
              <div className="flex items-center justify-between border-b border-line px-3 py-2">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 label text-crimson">
                    <span className="h-1.5 w-1.5 rounded-full bg-crimson animate-pulse2" />
                    REC
                  </span>
                  <span className="h-3 w-px bg-line" />
                  <span className="label text-[var(--accent)]">Live footage</span>
                </div>
                <span className="label text-mute">SONY_A6400 · GOPRO</span>
              </div>
              <div className="relative aspect-video scanlines">
                <iframe
                  src="https://player.vimeo.com/video/1153484782?background=1&autoplay=1&loop=1&muted=1&quality=auto"
                  className="absolute inset-0 h-full w-full"
                  style={{ border: "none" }}
                  allow="autoplay; fullscreen"
                  title="ASI Tournament body cam footage"
                />
                <span className="pointer-events-none absolute left-3 top-3 h-4 w-4 border-l-2 border-t-2 border-[var(--accent)]" />
                <span className="pointer-events-none absolute right-3 top-3 h-4 w-4 border-r-2 border-t-2 border-[var(--accent)]" />
                <span className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b-2 border-l-2 border-[var(--accent)]" />
                <span className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 border-b-2 border-r-2 border-[var(--accent)]" />
              </div>
              <div className="flex items-center justify-between border-t border-line px-3 py-1.5 label text-mute">
                <span>
                  TC: <span className="text-[var(--accent)]">00:00:00</span>
                </span>
                <span>ASI_DEC25 · body cam</span>
              </div>
            </div>
          </Wipe>
          <div className="lg:col-span-5 flex flex-col gap-4">
            <Card kicker="At a glance" tone="accent">
              <Kv k="Role" v="Communication lead · field operations" />
              <Kv k="Date" v="December 2025" />
              <Kv k="Location" v="UFR3S · Lille" />
              <Kv k="Attendance" v="500+ people" />
              <Kv k="Format" v="4 disciplines · 1 day" />
              <Kv k="Status" v="Completed" />
              <div className="mt-4 label text-mute">Sports disciplines</div>
              <Chips className="mt-2" items={["Disc golf", "Wheelchair BBL", "Laser tag", "Spikeball"]} />
            </Card>
            <Card kicker="Photo & video production">
              <div className="grid grid-cols-2 gap-px bg-line">
                <div className="bg-bg p-3">
                  <div className="label text-mute">Camera</div>
                  <div className="display mt-1 text-[16px]">Sony α6400</div>
                  <div className="label text-[var(--accent)] mt-1">Mirrorless APS-C</div>
                </div>
                <div className="bg-bg p-3">
                  <div className="label text-mute">Action cams</div>
                  <div className="display mt-1 text-[16px]">GoPro ×2</div>
                  <div className="label text-[var(--accent)] mt-1">Wide angle POV</div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border border-line p-3">
                <div>
                  <div className="label text-mute">Photo output</div>
                  <div className="display text-[26px] text-[var(--accent)]">
                    <Counter to={50} />
                  </div>
                </div>
                <span className="label text-mute">Photos produced</span>
              </div>
            </Card>
          </div>
        </div>
      </Section>

      {/* 02 INCIDENTS */}
      <Section n="02" kicker="Decisions on the day" title="Adapting when plans changed" intro="A venue conflict and heavy rainfall required changes in the hours before the event. Both were handled while maintaining the scheduled start and the competition.">
        <Stagger className="grid grid-cols-1 gap-4 lg:grid-cols-2" stagger={0.12}>
          <Incident
            time="2 HOURS BEFORE"
            title="Facility conflict"
            severity="RELOCATED"
            color="#ff2a3c"
            description="A university match was scheduled in the main gymnasium, leaving the tournament without its planned venue two hours before the start."
            resolution="An alternate gymnasium was secured within 45 minutes and equipment transfers were coordinated. The tournament started on time."
            stats={[
              ["Response", "45 min"],
              ["Start", "On time"],
              ["Venue", "Secured"],
            ]}
          />
          <Incident
            time="30 MINUTES BEFORE"
            title="Weather hazard"
            severity="ADAPTED"
            color="#2ee6ff"
            description="Heavy rain made the outdoor disc golf area unsuitable, raising concerns about participant safety and equipment damage."
            resolution="Disc golf moved into the gymnasium with an adapted course and rules. Equipment was protected and the competition continued indoors."
            stats={[
              ["Relocation", "30 min"],
              ["Format", "Indoor"],
              ["Competition", "Continued"],
            ]}
          />
        </Stagger>
        <Reveal className="mt-6 flex flex-col gap-4 border border-acid/40 bg-surface p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="label text-acid">Result</div>
            <div className="mono mt-1 text-[12px] text-mute">Two changes handled before the start. The event ran on schedule with all four disciplines maintained.</div>
          </div>
          <div className="flex gap-8">
            {[
              ["2", "Changes handled"],
              ["4", "Disciplines"],
              ["0", "Event disruption"],
            ].map(([v, l]) => (
              <div key={l} className="text-center">
                <div className="display text-[28px] text-acid">{v}</div>
                <div className="label text-mute">{l}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* 03 ASSETS */}
      <Section n="03" kicker="Visual assets" title="Charter, briefing, poster" intro="The event identity was produced in-house: a graphic charter, a bilingual FR/EN participant briefing and a campus / social media poster.">
        <Gallery
          cols={3}
          items={[
            { src: "/assets/events/charte.png", alt: "ASI graphic charter", ratio: "4/3", fit: "contain", label: "VISUAL_ID.PNG", caption: "Graphic charter — color palette and typography system." },
            { src: "/assets/events/regles.jpg", alt: "Bilingual participant briefing", ratio: "4/3", position: "top", label: "RULES.JPG", caption: "Participant briefing — bilingual rules (FR/EN)." },
            { src: "/assets/events/affiche.png", alt: "Event poster", ratio: "4/3", fit: "contain", label: "POSTER.PNG", caption: "Event poster — campus and social media promo." },
          ]}
        />
        <div className="label text-mute mt-12 mb-4">On site · ASI event coverage</div>
        <Gallery
          cols={4}
          items={[1, 2, 3, 4].map((n) => ({ src: `/assets/photo/asi-${n}.jpg`, alt: `ASI tournament photo ${n}`, ratio: "4/5", label: `ASI_EVENT_0${n}` }))}
        />
        <div className="mt-6">
          <Figure src="/assets/photo/asi-5.jpg" alt="ASI tournament photo 5" ratio="21/9" label="ASI_EVENT_05" sizes="100vw" />
        </div>
        <Stats className="mt-10" items={[{ v: "500+", l: "People at the event" }, { v: "4", l: "Disciplines" }, { v: "2", l: "Changes handled" }, { v: "0", l: "Event disruption" }]} />
        <Note className="mt-8">Communication, field coordination and visual production · UFR3S Lille · December 2025.</Note>
      </Section>
    </>
  )
}
