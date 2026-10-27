import { TopBar } from "@/components/home/top-bar"
import { SideHud } from "@/components/home/side-hud"
import { Hero } from "@/components/home/hero"
import { ContractsIndex } from "@/components/home/contracts-index"
import { Footer } from "@/components/home/footer"
import { HomeEntrance } from "@/components/home/home-entrance"
import { DocumentLang } from "@/components/fx/document-lang"
import { COPY } from "@/lib/copy"
import { HOME_PATH, type Locale } from "@/lib/i18n"

export function HomePage({ locale }: { locale: Locale }) {
  const other: Locale = locale === "en" ? "fr" : "en"
  const page = (
    <HomeEntrance locale={locale}>
      <a href="#main-content" className="skip-link">{COPY[locale].nav.skip}</a>
      <TopBar locale={locale} alternate={HOME_PATH[other]} />
      <SideHud locale={locale} />
      <main id="main-content" tabIndex={-1} className="lg:pr-12">
        <Hero locale={locale} />
        <ContractsIndex locale={locale} />
      </main>
      <Footer locale={locale} />
    </HomeEntrance>
  )
  if (locale === "en") return page
  return <div lang={locale}><DocumentLang lang={locale} />{page}</div>
}
