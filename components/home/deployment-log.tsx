"use client"

import { DEPLOYMENTS, EDUCATION } from "@/lib/profile"
import { Reveal, Stagger } from "@/components/fx/reveal"
import { SectionHead } from "@/components/ui/primitives"
import { pad2 } from "@/lib/utils"

export function DeploymentLog() {
  return (
    <section id="log" className="relative px-5 py-20 md:px-8 md:py-28 scroll-mt-14">
      <SectionHead index={3} kicker="Deployment log" title="Where I have been sent" right={<span>{pad2(DEPLOYMENTS.length)} entries</span>} />

      <div className="mt-10">
        {/* Column headers */}
        <div className="hidden md:grid grid-cols-12 gap-4 border-b border-ink/60 pb-3 label text-mute">
          <span className="col-span-2">Period</span>
          <span className="col-span-5">Role</span>
          <span className="col-span-3">Organisation</span>
          <span className="col-span-2 text-right">Location</span>
        </div>

        <Stagger stagger={0.06} amount={0.05}>
          {DEPLOYMENTS.map((d) => (
            <article
              key={d.title}
              className="group -mx-2 grid grid-cols-1 gap-1.5 border-b border-line px-2 py-5 transition-colors duration-200 hover:bg-surface md:grid-cols-12 md:items-baseline md:gap-4 md:py-5"
            >
              <div className="flex items-center justify-between gap-4 md:contents">
                <span className="mono tnum flex items-center gap-2.5 text-[11px] tracking-[0.16em] text-acid md:col-span-2 md:col-start-1 md:row-start-1">
                  <span
                    className="h-1.5 w-1.5 shrink-0 bg-acid opacity-30 transition-opacity duration-200 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                  {d.period}
                </span>
                <span className="mono text-[11px] tracking-[0.12em] text-mute md:col-span-2 md:col-start-11 md:row-start-1 md:text-right">
                  {d.where}
                </span>
              </div>

              <h3 className="display text-balance text-[clamp(16px,1.45vw,19px)] leading-tight md:col-span-5 md:col-start-3 md:row-start-1">
                {d.title}
              </h3>

              <span className="label text-mute md:col-span-3 md:col-start-8 md:row-start-1">{d.org}</span>
            </article>
          ))}
        </Stagger>
      </div>

      <Reveal className="mt-16">
        <div className="flex items-baseline justify-between border-t border-ink/60 pt-4">
          <span className="label text-acid">Academic training</span>
          <span className="label text-mute">{pad2(EDUCATION.length)} programmes</span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-px bg-line md:grid-cols-2">
          {EDUCATION.map((e) => (
            <div key={e.period} className="bg-bg py-5 md:px-6 md:py-6 md:first:pl-0">
              <div className="mono tnum text-[11px] tracking-[0.16em] text-mute">{e.period}</div>
              <h4 className="display mt-2 text-[18px] leading-tight">{e.degree}</h4>
              <div className="label text-acid mt-2">{e.school}</div>
            </div>
          ))}
        </div>

        <div className="mono mt-6 text-[11px] tracking-[0.06em] text-mute">
          M1 thesis · LEC/GRP vs CS2 economic models
        </div>
      </Reveal>
    </section>
  )
}
