import { TopBar } from "@/components/home/top-bar"
import { SideHud } from "@/components/home/side-hud"
import { Hero } from "@/components/home/hero"
import { Journey } from "@/components/home/journey"
import { Operator } from "@/components/home/operator"
import { ContractsIndex } from "@/components/home/contracts-index"
import { DeploymentLog } from "@/components/home/deployment-log"
import { Extraction } from "@/components/home/extraction"
import { Footer } from "@/components/home/footer"
import { HomeEntrance } from "@/components/home/home-entrance"

export default function HomePage() {
  return (
    <HomeEntrance>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <TopBar />
      <SideHud />
      <main id="main-content" tabIndex={-1} className="lg:pr-12">
        <Hero />
        <ContractsIndex />
        <Journey />
        <Operator />
        <DeploymentLog />
        <Extraction />
      </main>
      <Footer />
    </HomeEntrance>
  )
}
