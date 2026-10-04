import { BootProvider } from "@/components/home/boot"
import { TopBar } from "@/components/home/top-bar"
import { SideHud } from "@/components/home/side-hud"
import { Hero } from "@/components/home/hero"
import { Journey } from "@/components/home/journey"
import { Operator } from "@/components/home/operator"
import { ContractsIndex } from "@/components/home/contracts-index"
import { DeploymentLog } from "@/components/home/deployment-log"
import { Extraction } from "@/components/home/extraction"
import { Footer } from "@/components/home/footer"

export default function HomePage() {
  return (
    <BootProvider>
      <TopBar />
      <SideHud />
      <main className="lg:pr-12">
        <Hero />
        <Journey />
        <ContractsIndex />
        <Operator />
        <DeploymentLog />
        <Extraction />
      </main>
      <Footer />
    </BootProvider>
  )
}
