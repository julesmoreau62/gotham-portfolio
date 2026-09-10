import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CONTRACT_SLUGS, getContract, type ContractSlug } from "@/lib/contracts"
import { ContractShell } from "@/components/contracts/shell"
import { DaringCase } from "@/components/contracts/daring"
import { SignalCase } from "@/components/contracts/signal"
import { StrategyCase } from "@/components/contracts/strategy"
import { FieldOpsCase } from "@/components/contracts/field-ops"
import { IntelCoreCase } from "@/components/contracts/intel-core"
import { BuildCase } from "@/components/contracts/build"
import { ImageryCase } from "@/components/contracts/imagery"

const CASES: Record<ContractSlug, React.ComponentType> = {
  daring: DaringCase,
  signal: SignalCase,
  strategy: StrategyCase,
  "field-ops": FieldOpsCase,
  "intel-core": IntelCoreCase,
  build: BuildCase,
  imagery: ImageryCase,
}

type Params = Promise<{ slug: string }>

export function generateStaticParams() {
  return CONTRACT_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const c = getContract(slug)
  if (!c) return {}
  return {
    title: `${c.title} · ${c.role}`,
    description: c.summary,
    openGraph: { title: `${c.title} — Jules Moreau`, description: c.summary, images: [c.cover] },
  }
}

export default async function ContractPage({ params }: { params: Params }) {
  const { slug } = await params
  const c = getContract(slug)
  if (!c) notFound()
  const Body = CASES[c.slug]
  return (
    <ContractShell key={c.slug} contract={c}>
      <Body />
    </ContractShell>
  )
}
