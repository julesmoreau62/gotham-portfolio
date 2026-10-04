import Link from "next/link"
import { PROFILE, SITE } from "@/lib/profile"
import { Marquee } from "@/components/fx/marquee"

export function Footer() {
  return (
    <footer className="relative border-t border-line">
      <div className="flex flex-wrap items-center justify-between gap-6 px-[5vw] py-8">
        <p className="mono max-w-sm text-[11px] leading-relaxed text-mute">Jules Moreau / From playing to making it happen.<br />Built with curiosity, field experience and AI-assisted tools.</p>
        <nav aria-label="Footer" className="flex flex-wrap gap-5 mono text-[11px] text-mute">
          <Link href="/#origin" className="hover:text-acid">My story</Link><Link href="/#contracts" className="hover:text-acid">Projects</Link><a href={PROFILE.cv} download className="hover:text-acid">CV</a><Link href="/briefing" className="hover:text-acid">Briefing</Link><Link href="/#hero" className="text-acid">Back to top ↑</Link>
        </nav>
      </div>
      <div className="overflow-hidden border-y border-line py-5" aria-hidden="true"><Marquee items={["PLAY", "UNDERSTAND", "MAKE IT HAPPEN"]} className="display-black text-[clamp(40px,8vw,120px)] leading-none outline-text" itemClassName="pr-10 gap-10" speed="40s" separator={<span style={{ WebkitTextStroke: "0", color: "#c8ff00" }}>↗</span>} /></div>
      <div className="flex flex-wrap justify-between gap-4 px-[5vw] py-5 label text-mute"><span>© {SITE.year} Jules Moreau</span><span>Lille / France · {SITE.version}</span></div>
      <div className="h-1 hazard" aria-hidden="true" />
    </footer>
  )
}
