import type { Metadata } from "next"
import { PROFILE } from "@/lib/profile"
import { CONTRACTS } from "@/lib/contracts"
import { COPY } from "@/lib/copy"
import { BRIEFING_PATH, HOME_PATH, languageAlternates, type Locale } from "@/lib/i18n"
import { TopBar } from "@/components/home/top-bar"
import { Footer } from "@/components/home/footer"
import { DocumentLang } from "@/components/fx/document-lang"
import { Btn, Chip, Kv, SectionHead, RegMarks, Barcode, ArrowUpRight } from "@/components/ui/primitives"
import { WipeLink } from "@/components/fx/page-wipe"
import { Reveal, Lines, Stagger } from "@/components/fx/reveal"
import { pad2 } from "@/lib/utils"

const FEATURED_CONTRACTS = ["field-ops", "daring", "signal"].map(slug => CONTRACTS.find(c => c.slug === slug)!)

export function briefingMetadata(locale: Locale): Metadata {
  const { meta } = COPY[locale].briefing
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: BRIEFING_PATH[locale], languages: languageAlternates(BRIEFING_PATH) },
    openGraph: {
      title: meta.ogTitle,
      description: meta.ogDescription,
      url: BRIEFING_PATH[locale],
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_US",
    },
    twitter: { card: "summary_large_image", title: meta.ogTitle, description: meta.ogDescription },
  }
}

export function BriefingPage({ locale }: { locale: Locale }) {
  const t = COPY[locale].briefing
  const other: Locale = locale === "en" ? "fr" : "en"
  const page = (
    <>
      <TopBar variant="page" locale={locale} alternate={BRIEFING_PATH[other]} />
      <main className="min-h-screen pt-14">
        <section id="hero" className="relative px-5 pt-12 pb-10 md:px-8 md:pt-20">
          <RegMarks />
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <Reveal className="flex flex-wrap items-center gap-3">
                <Chip tone="acid" dot>
                  {t.chip}
                </Chip>
                <span className="label text-mute">{t.essentials}</span>
              </Reveal>
              <Lines as="h1" play className="display-black mt-6 text-[clamp(44px,8vw,112px)]" lines={["Jules Moreau"]} />
              <Reveal className="mt-6 max-w-2xl display text-[clamp(18px,2.2vw,28px)] leading-[1.2]">
                {t.seeking[0]}<span className="text-acid">{t.seeking[1]}</span>{t.seeking[2]}
              </Reveal>
              <Reveal delay={0.05} className="mt-4 max-w-2xl mono text-[13px] leading-relaxed text-mute">
                {t.intro}
              </Reveal>
              <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-3">
                <Btn href={PROFILE.cv} download tone="acid">
                  {t.cta.cv}
                </Btn>
                <Btn href={`mailto:${PROFILE.email}`} tone="ghost">
                  {t.cta.email}
                </Btn>
                <Btn href={PROFILE.linkedin} external tone="line">
                  LinkedIn
                </Btn>
                <Btn href={HOME_PATH[locale]} tone="line" wipe>
                  {t.cta.story}
                </Btn>
              </Reveal>
            </div>
            <Reveal className="lg:col-span-4" delay={0.15}>
              <div className="border border-line bg-surface p-5">
                {t.facts.map((fact, i) => <Kv key={fact.k} k={fact.k} v={fact.v} accent={i === 0 ? "#c8ff00" : undefined} />)}
                <div className="mt-5 flex items-end justify-between border-t border-line pt-4">
                  <Barcode seed="BRIEFING-2027" className="w-28 text-ink" height={26} />
                  <span className="label text-mute">ID · JM-2026</span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="px-5 py-12 md:px-8">
          <SectionHead index="01" kicker={t.focusKicker} title={t.focusTitle} />
          <Stagger className="mt-8 grid grid-cols-1 gap-px bg-line md:grid-cols-3" stagger={0.08}>
            {t.focus.map((f, i) => (
              <div key={f.title} className="bg-bg p-5">
                <span className="label text-acid">0{i + 1}</span>
                <h3 className="display mt-3 text-[20px] leading-tight">{f.title}</h3>
                <p className="mono mt-3 text-[12px] leading-relaxed text-mute">{f.body}</p>
              </div>
            ))}
          </Stagger>
        </section>

        <section className="px-5 py-12 md:px-8">
          <SectionHead index="02" kicker={t.projectsKicker} title={t.projectsTitle} right={<span>{t.projectsRight}</span>} />
          <Stagger className="mt-8" stagger={0.08}>
            {FEATURED_CONTRACTS.map((c) => {
              const local = { ...c, ...t.contracts[c.slug] }
              return (
                <WipeLink
                  key={c.slug}
                  href={`/contracts/${c.slug}`}
                  data-cursor="open"
                  className="group grid grid-cols-1 gap-4 border-t border-line py-6 transition-colors hover:bg-surface md:grid-cols-12 md:items-center"
                >
                  <div className="md:col-span-1 mono text-[11px] tracking-[0.2em]" style={{ color: c.accent }}>
                    {pad2(c.index)}
                  </div>
                  <div className="md:col-span-5">
                    <div className="display text-[clamp(24px,3vw,40px)] group-hover:text-acid transition-colors">{local.title}</div>
                    <div className="label text-mute mt-1">{local.role}</div>
                  </div>
                  <p className="md:col-span-4 mono text-[12px] leading-relaxed text-mute">{local.summary}</p>
                  <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-3">
                    <Chip tone="ghost" color={c.accent === "#f2f1ec" ? undefined : c.accent}>
                      {c.metric} · {local.metricLabel}
                    </Chip>
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                </WipeLink>
              )
            })}
          </Stagger>
        </section>

        <section className="px-5 py-12 md:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <SectionHead index="03" kicker={t.groundKicker} title={t.groundTitle} />
              <Reveal className="mt-8 flex flex-wrap gap-2">
                {t.capabilities.map((c) => (
                  <Chip key={c} tone="ghost">
                    {c}
                  </Chip>
                ))}
              </Reveal>
              <Reveal className="mt-8 max-w-xl mono text-[12px] leading-relaxed text-mute">
                {t.degree}
              </Reveal>
            </div>
            <Reveal className="lg:col-span-5" delay={0.1}>
              <div className="space-y-6 border border-line bg-surface p-5">
                {t.cards.map((card, i) => (
                  <div key={card.title} className={i > 0 ? "border-t border-line pt-5" : undefined}>
                    <span className="label text-acid">{card.label}</span>
                    <h3 className="display mt-3 text-[22px]">{card.title}</h3>
                    <p className="mono mt-3 text-[12px] leading-relaxed text-mute">{card.body}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
    </>
  )
  if (locale === "en") return page
  return <div lang={locale}><DocumentLang lang={locale} />{page}</div>
}
