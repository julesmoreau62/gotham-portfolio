import Link from "next/link"
import { PROFILE, SITE } from "@/lib/profile"
import { Marquee } from "@/components/fx/marquee"
import { COPY } from "@/lib/copy"
import { BRIEFING_PATH, homeSection, type Locale } from "@/lib/i18n"

export function Footer({ locale = "en" }: { locale?: Locale }) {
  const t = COPY[locale].footer
  return (
    <footer className="relative border-t border-line">
      <div className="flex flex-wrap items-center justify-between gap-6 px-[5vw] py-8">
        <p className="mono max-w-sm text-[11px] leading-relaxed text-mute">{t.line[0]}<br />{t.line[1]}</p>
        <nav aria-label={t.label} className="flex flex-wrap gap-5 mono text-[11px] text-mute">
          <Link href={homeSection(locale, "origin")} className="hover:text-acid">{t.story}</Link><Link href={homeSection(locale, "contracts")} className="hover:text-acid">{t.projects}</Link><a href={PROFILE.cv} download className="hover:text-acid">CV</a><Link href={BRIEFING_PATH[locale]} className="hover:text-acid">{t.briefing}</Link><Link href={homeSection(locale, "hero")} className="text-acid">{t.top}</Link>
        </nav>
      </div>
      <div className="overflow-hidden border-y border-line py-5" aria-hidden="true"><Marquee items={t.marquee} className="display-black text-[clamp(40px,8vw,120px)] leading-none outline-text" itemClassName="pr-10 gap-10" speed="40s" separator={<span style={{ WebkitTextStroke: "0", color: "#c8ff00" }}>↗</span>} /></div>
      <div className="flex flex-wrap justify-between gap-4 px-[5vw] py-5 label text-mute"><span>© {SITE.year} Jules Moreau</span><span>Lille / France · {SITE.version}</span></div>
      <div className="h-1 hazard" aria-hidden="true" />
    </footer>
  )
}
