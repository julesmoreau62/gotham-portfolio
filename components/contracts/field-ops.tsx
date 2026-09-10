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
        <div className="label text-acid">Resolution executed</div>
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
      <Section n="01" kicker="Mission brief" title="Field operation · ASI Tournament" intro="Comms Chief for the ASI Multisports Tournament at UFR3S Lille, December 2025: 500+ personnel, four disciplines, one day, and a live communication plan that had to survive two critical incidents.">
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
            <Card kicker="Mission brief" tone="accent">
              <Kv k="Role" v="Comms Chief" />
              <Kv k="Date" v="December 2025" />
              <Kv k="Location" v="UFR3S · Lille" />
              <Kv k="Personnel" v="500+" />
              <Kv k="Coordinates" v="50.6292 N · 3.0573 E" />
              <Kv k="Status" v="Completed" />
              <div className="mt-4 label text-mute">Sports disciplines</div>
              <Chips className="mt-2" items={["Disc golf", "Wheelchair BBL", "Laser tag", "Spikeball"]} />
            </Card>
            <Card kicker="Equipment loadout">
              <div className="grid grid-cols-2 gap-px bg-line">
                <div className="bg-bg p-3">
                  <div className="label text-mute">Primary unit</div>
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
                <span className="label text-mute">All equipment operational</span>
              </div>
            </Card>
          </div>
        </div>
      </Section>

      {/* 02 INCIDENTS */}
      <Section n="02" kicker="Critical incidents log" title="Crisis management" intro="Two major incidents in the final hours before kick-off. Both resolved with zero participant impact and an on-time start.">
        <Stagger className="grid grid-cols-1 gap-4 lg:grid-cols-2" stagger={0.12}>
          <Incident
            time="H-0200"
            title="Facility conflict"
            severity="CRITICAL"
            color="#ff2a3c"
            description="Administration scheduled a university match in the primary gymnasium. Venue unavailable 2 hours before event start. Immediate relocation required."
            resolution="Emergency relocation protocol activated. Secured an alternate gymnasium within 45 minutes. Coordinated equipment transfer. Zero participant impact. On-time event start maintained."
            stats={[
              ["Response", "45 min"],
              ["Impact", "Zero"],
              ["Status", "OK"],
            ]}
          />
          <Incident
            time="H-0030"
            title="Weather hazard"
            severity="ADAPTED"
            color="#2ee6ff"
            description="Heavy rainfall compromising the outdoor disc golf area. Equipment damage risk detected, participant safety concern raised. Forecast: continuous rain."
            resolution="Indoor fallback protocol activated. Disc golf relocated to the secured gymnasium. Modified course layout implemented. Equipment protected. Full competition maintained with adapted rules."
            stats={[
              ["Relocation", "30 min"],
              ["Adaptability", "100%"],
              ["Safety", "OK"],
            ]}
          />
        </Stagger>
        <Reveal className="mt-6 flex flex-col gap-4 border border-acid/40 bg-surface p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="label text-acid">Crisis management: successful</div>
            <div className="mono mt-1 text-[12px] text-mute">Two major incidents resolved. Zero event disruption. Perfect operational continuity.</div>
          </div>
          <div className="flex gap-8">
            {[
              ["2", "Incidents"],
              ["0", "Impact"],
              ["100%", "Success"],
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
        <Stats className="mt-10" items={[{ v: "500+", l: "Personnel" }, { v: "4", l: "Disciplines" }, { v: "2", l: "Incidents solved" }, { v: "0", l: "Event disruption" }]} />
        <Note className="mt-8">Mission status: completed. Lille, France · 50.6292 N / 3.0573 E · December 2025.</Note>
      </Section>
    </>
  )
}
