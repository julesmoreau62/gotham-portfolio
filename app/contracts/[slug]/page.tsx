import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CONTRACT_SLUGS, getContract, type ContractSlug } from "@/lib/contracts"
import { ContractShell } from "@/components/contracts/shell"
import { DaringCase } from "@/components/contracts/daring"
import { SignalCase } from "@/components/contracts/signal"
import { StrategyCase } from "@/components/contracts/strategy"
import { FieldOpsCase } from "@/components/contracts/field-ops"
import { ThesisEngineCase } from "@/components/contracts/thesis-engine"
import { ThesisBackdrop } from "@/components/contracts/thesis-backdrop"
import { BuildCase } from "@/components/contracts/build"
import { ImageryCase } from "@/components/contracts/imagery"

const CASES: Record<ContractSlug, React.ComponentType> = {
  daring: DaringCase,
  signal: SignalCase,
  strategy: StrategyCase,
  "field-ops": FieldOpsCase,
  "thesis-engine": ThesisEngineCase,
  build: BuildCase,
  imagery: ImageryCase,
}

/** Cases that replace the hero photo with a live backdrop. */
const BACKDROPS: Partial<Record<ContractSlug, React.ComponentType>> = {
  "thesis-engine": ThesisBackdrop,
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
    alternates: { canonical: `/contracts/${c.slug}` },
    openGraph: {
      title: `${c.title} — Jules Moreau`,
      description: c.summary,
      url: `/contracts/${c.slug}`,
      type: "article",
      images: [{ url: c.cover, alt: `${c.title} case study by Jules Moreau` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${c.title} — Jules Moreau`,
      description: c.summary,
      images: [c.cover],
    },
  }
}

export default async function ContractPage({ params }: { params: Params }) {
  const { slug } = await params
  const c = getContract(slug)
  if (!c) notFound()
  const Body = CASES[c.slug]
  const Backdrop = BACKDROPS[c.slug]
  return (
    <ContractShell key={c.slug} contract={c} backdrop={Backdrop ? <Backdrop /> : undefined}>
      <Body />
    </ContractShell>
  )
}
