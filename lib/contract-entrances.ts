const ENTRANCE_SLUGS = ["daring", "signal", "intel-core"] as const

export function hasContractEntrance(slug: string): slug is typeof ENTRANCE_SLUGS[number] {
  return ENTRANCE_SLUGS.some((value) => value === slug)
}
