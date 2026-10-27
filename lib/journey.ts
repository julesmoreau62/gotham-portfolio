/** Recruiter-first reading order; project URLs stay stable. */
export const HOME_SECTIONS = [
  { id: "hero", n: "00" },
  { id: "contracts", n: "01" },
] as const

export type HomeSectionId = (typeof HOME_SECTIONS)[number]["id"]

export type ProjectStory = { verb: string; chapter: string; text: string; takeaway: string; proof: string; proofLabel: string }

export const PROJECT_STORIES = {
  "field-ops": {
    verb: "Make it run.", chapter: "Event operations",
    text: "Communication and field operations for a 500+ person university tournament: one bilingual briefing for every participant, and a new venue secured in 45 minutes when plans changed.",
    takeaway: "An event works when the people, information and timing work together.",
    proof: "500+", proofLabel: "people · one tournament",
  },
  signal: {
    verb: "Make it seen.", chapter: "Digital & sponsor activation",
    text: "A club's digital presence built from scratch, with no content calendar or guidelines to start from: three recurring formats, a weekly sponsor prediction game and a first app concept.",
    takeaway: "The experience starts before matchday and continues after the final whistle.",
    proof: "1M+", proofLabel: "views · one season",
  },
  daring: {
    verb: "Make it last.", chapter: "Tools & handover",
    text: "A sponsor system built to outlive my internship: brand guidelines, a bilingual partner website, Canva templates and a Notion workspace so volunteers can keep producing on their own, exported in Markdown for any AI assistant.",
    takeaway: "A project should leave the next team with something they can build on.",
    proof: "11", proofLabel: "ready-to-use post templates",
  },
} as const

export const STORY_PROJECT_SLUGS = ["daring", "field-ops", "signal"] as const

export type StorySlug = keyof typeof PROJECT_STORIES

/** Where each move happened, for the map. France is its geographic centre. */
export const PLACES = {
  france: { lat: 46.6, lon: 2.4 },
  guiana: { lat: 4.94, lon: -52.33 },
  corsica: { lat: 42.15, lon: 9.1 },
  caledonia: { lat: -22.27, lon: 166.45 },
  congo: { lat: -4.27, lon: 15.28 },
} as const

export type PlaceId = keyof typeof PLACES

export type PlaceStop = { place: string; at: PlaceId; lesson: string; text: string }

/** The eight moves, in order, as the dossier globe names them. */
export const PLACE_STOPS: PlaceStop[] = [
  { place: "France", at: "france", lesson: "The start", text: "Born here. Twenty-four days later, passport in hand, off to French Guiana." },
  { place: "French Guiana", at: "guiana", lesson: "Nature", text: "Growing up close to nature, and to the golden-handed tamarins on our balcony." },
  { place: "Corsica", at: "corsica", lesson: "Trail running", text: "Where trail running started for me." },
  { place: "New Caledonia", at: "caledonia", lesson: "The ocean", text: "Surfing and va'a, the outrigger canoe." },
  { place: "Congo · Brazzaville", at: "congo", lesson: "Perspective", text: "Realising how lucky I was." },
  { place: "France", at: "france", lesson: "Back home", text: "A first return." },
  { place: "French Guiana", at: "guiana", lesson: "Games", text: "Minecraft, then Counter-Strike, then Overwatch." },
  { place: "France", at: "france", lesson: "Sport", text: "Studies, volleyball, golf and competitive gaming. Then sport management." },
]
