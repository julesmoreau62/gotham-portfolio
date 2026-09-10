"use client"

import { LOADOUT, SIDE_PROJECTS } from "@/lib/profile"
import { Reveal, Stagger } from "@/components/fx/reveal"
import { SectionHead } from "@/components/ui/primitives"

export function Loadout() {
  return (
    <section id="loadout" className="relative px-5 py-20 md:px-8 md:py-28 scroll-mt-14">
      <SectionHead index={4} kicker="Loadout" title="Skills & tools" right={<span>{LOADOUT.reduce((n, g) => n + g.items.length, 0)} modules equipped</span>} />

      <Stagger className="mt-12 grid grid-cols-1 gap-px bg-line sm:grid-cols-2 lg:grid-cols-5" stagger={0.08}>
        {LOADOUT.map((g, i) => (
          <div key={g.label} className="bg-bg p-5 min-h-[280px] flex flex-col" style={{ ["--accent" as string]: g.accent }}>
            <div className="flex items-center justify-between">
              <span className="label" style={{ color: g.accent }}>
                {String(i + 1).padStart(2, "0")} · {g.label}
              </span>
              <span className="h-2 w-2" style={{ background: g.accent }} />
            </div>
            <ul className="mt-6 flex flex-col gap-2">
              {g.items.map((it) => (
                <li
                  key={it}
                  className="group flex items-center gap-3 border-t border-line pt-2 mono text-[12px] text-ink/80 transition-colors hover:text-ink"
                >
                  <span className="h-px w-3 bg-ink/30 transition-all group-hover:w-5" style={{ background: undefined }} />
                  {it}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-6">
              <div className="h-1 w-full bg-ink/10">
                <div className="h-full" style={{ width: `${70 + i * 6}%`, background: g.accent }} />
              </div>
            </div>
          </div>
        ))}
      </Stagger>

      <Reveal className="mt-14">
        <div className="label text-mute">Side projects · R&D</div>
        <div className="mt-4 grid grid-cols-1 gap-px bg-line md:grid-cols-3">
          {SIDE_PROJECTS.map((p, i) => (
            <div key={p.title} className="bg-bg p-5">
              <span className="mono text-[11px] text-acid tracking-[0.2em]">R{i + 1}</span>
              <h4 className="display mt-2 text-[18px]">{p.title}</h4>
              <p className="mono mt-3 text-[11px] leading-relaxed text-mute">{p.body}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
