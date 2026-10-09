/** Recruiter-first reading order; project URLs stay stable. */
export const HOME_SECTIONS = [
  { id: "hero", n: "00", label: "Start" },
  { id: "contracts", n: "01", label: "Selected work" },
  { id: "origin", n: "02", label: "My story" },
  { id: "operator", n: "03", label: "My approach" },
  { id: "log", n: "04", label: "Experience" },
  { id: "extraction", n: "05", label: "Contact" },
] as const

export const PROJECT_STORIES = {
  "field-ops": {
    verb: "Make it run.", chapter: "Event operations",
    text: "Communication and field operations for a 500+ person university tournament. Keeping the event moving when plans changed.",
    takeaway: "An event works when the people, information and timing work together.",
    proof: "500+", proofLabel: "people · one tournament",
  },
  signal: {
    verb: "Make it seen.", chapter: "Communication & activation",
    text: "A season of content, photography and sponsor activation. Building a club's presence around the people who make it live.",
    takeaway: "The experience starts before matchday and continues after the final whistle.",
    proof: "1M+", proofLabel: "views · one season",
  },
  daring: {
    verb: "Make it last.", chapter: "Branding & partnerships",
    text: "A complete sponsor acquisition system: visual identity, a bilingual partner website, a nine-page brochure and a club handover. Giving the next team tools it can keep using.",
    takeaway: "A project should leave the next team with something they can build on.",
    proof: "FR / NL", proofLabel: "a complete partner system",
  },
} as const

export const STORY_PROJECT_SLUGS = ["daring", "field-ops", "signal"] as const
