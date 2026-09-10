import Link from "next/link"
import { PROFILE, SITE } from "@/lib/profile"
import { Marquee } from "@/components/fx/marquee"

export function Footer() {
  return (
    <footer className="relative border-t border-line">
      <div className="grid grid-cols-1 gap-8 px-5 py-12 md:grid-cols-12 md:px-8">
        <div className="md:col-span-5">
          <div className="label text-acid">Colophon</div>
          <p className="mono mt-3 max-w-md text-[11px] leading-relaxed text-mute">
            Designed and shipped by Jules Moreau with an AI-augmented workflow (Claude Code), with zero coding
            background. Next.js 15, React 19, Tailwind, framer-motion and three.js. Art direction inspired by
            graphic-realism game UI: acid green on black, wide grotesk, registration marks.
          </p>
        </div>
        <div className="md:col-span-3">
          <div className="label text-mute">Links</div>
          <ul className="mt-3 flex flex-col gap-2 mono text-[12px]">
            <li><Link href="/briefing" className="hover:text-acid transition-colors">Recruiter briefing</Link></li>
            <li><a href={PROFILE.cv} download className="hover:text-acid transition-colors">CV · PDF</a></li>
            <li><a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-acid transition-colors">LinkedIn</a></li>
            <li><a href={`mailto:${PROFILE.email}`} className="hover:text-acid transition-colors">{PROFILE.email}</a></li>
            <li><a href="/llms.txt" className="hover:text-acid transition-colors">llms.txt</a></li>
          </ul>
        </div>
        <div className="md:col-span-4 flex flex-col justify-between gap-6">
          <div className="grid grid-cols-2 gap-4 label text-mute">
            <span>{`${SITE.version} // ${SITE.year}`}</span>
            <span className="text-right">{PROFILE.coords}</span>
            <span>Lille // FR</span>
            <span className="text-right">© {SITE.year} Jules Moreau</span>
          </div>
          <a href="#hero" className="label text-acid self-start md:self-end hover:text-ink transition-colors">
            ↑ Back to top
          </a>
        </div>
      </div>

      <div className="overflow-hidden border-t border-line py-4">
        <Marquee
          items={["Jules Moreau", PROFILE.role, "Feb → Jun 2027", "Lille, France"]}
          className="display-black text-[clamp(40px,8vw,120px)] leading-none outline-text"
          itemClassName="pr-10 gap-10"
          speed="40s"
          separator={<span className="text-acid -webkit-text-stroke-0" style={{ WebkitTextStroke: "0", color: "#c8ff00" }}>■</span>}
        />
      </div>
      <div className="h-2 hazard" style={{ ["--accent" as string]: "#c8ff00" }} aria-hidden="true" />
    </footer>
  )
}
