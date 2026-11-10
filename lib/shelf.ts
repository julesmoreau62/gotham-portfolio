/* ------------------------------------------------------------------
   OFF THE CLOCK — who Jules is outside work: where he grew up, the
   teams he played in, coached and serves with, what he reads, watches
   and listens to. Shown in the side panel; the AI's version lives in
   knowledge/off-the-clock.md. Keep both in sync when you update.
   Notes may contain [label](https://…) links.
   ------------------------------------------------------------------ */

const M = "/media/shelf"

export const SHELF_UPDATED = "November 2026"

export const INTRO =
  "I grew up moving: eight moves across four continents. What I do off the clock is mostly about sharing something with people, and reading a lot of science fiction about how people learn to live with new technology. Which, honestly, is what my thesis is about too."

/** Where I grew up, in order. */
export const ROUTE: { place: string; note?: string }[] = [
  { place: "France", note: "born" },
  { place: "French Guiana" },
  { place: "Corsica" },
  { place: "New Caledonia" },
  { place: "Congo-Brazzaville" },
  { place: "France" },
  { place: "French Guiana" },
  { place: "Lille", note: "today" },
]

export type Team = {
  side: string // the role I had: being coached, coaching, serving
  title: string
  meta: string
  note: string
  when: string
  img?: string
  hue: number
}

/** Three teams, three different seats. */
export const TEAMS: Team[] = [
  {
    side: "Being coached",
    title: "Overwatch 2",
    meta: "DPS · Grandmaster, former Top 500",
    when: "Before",
    note: "The real school was team play: three practices a week, scrims, VOD reviews with a coach who took every mistake apart, and a final-stage run in the AFO French championship that we lost. That's where I learned to take criticism without taking it personally.",
    img: `${M}/game-overwatch.svg`,
    hue: 28,
  },
  {
    side: "Coaching",
    title: "Volleyball",
    meta: "Head coach U15, assistant U13 · Calais",
    when: "2024–25",
    note: "Then I switched seats. A season running a team of teenagers, down to organising the trip to a tournament in Ensisheim.",
    hue: 210,
  },
  {
    side: "Serving",
    title: "French Navy reserve",
    meta: "Petty Officer (Second Maître)",
    when: "Since 2022",
    note: "Trained at the École de Maistrance. It's where I learned rigour and how to stay calm when things go wrong, which came in handy on event days.",
    hue: 220,
  },
]

export type NowItem = { title: string; note: string; img?: string; hue: number }

export const NOW: NowItem[] = [
  { title: "Golf", note: "The sport that brings me closer to my dad. What I play most these days.", hue: 145 },
  { title: "Volleyball", note: "Still playing, on the court this time.", hue: 210 },
  { title: "Minecraft", note: "A forever world that grows up with me. It started as a medieval town; today it's surrounded by skyscrapers.", img: `${M}/game-minecraft.jpg`, hue: 95 },
]

export type Book = { title: string; by: string; note: string; tag: string; img: string; hue: number }

export const BOOKS: Book[] = [
  {
    title: "Neuromancer",
    by: "William Gibson",
    tag: "Favourite",
    note: "The way everything is described: you are 100% inside the story. My thesis app, Ono-Sendai, is named after its cyberdeck.",
    img: `${M}/book-neuromancer.jpg`,
    hue: 200,
  },
  {
    title: "Dune",
    by: "Frank Herbert",
    tag: "Reading now",
    note: "No good guys, no bad guys: only interests that shift over millennia. Currently on God Emperor of Dune.",
    img: `${M}/book-god-emperor.jpg`,
    hue: 38,
  },
  {
    title: "The Robot series",
    by: "Isaac Asimov",
    tag: "Reading now",
    note: "How rough his world is at first: big, clumsy robots, and people slowly learning to accept a new technology. A bit like AI right now.",
    img: `${M}/book-caves-of-steel.jpg`,
    hue: 260,
  },
]

export const THREAD =
  "The common thread: new technology, and how people come to live with it. It's also what my thesis studies, with AI in sports clubs."

export type Channel = { title: string; note: string; img: string }

export const WATCHING: Channel[] = [
  {
    title: "Fern",
    note: "Long documentaries about who really controls a system, and what they get out of it. Favourites: [ANØM: The Most Genius FBI Operation](https://www.youtube.com/watch?v=f6FRIDG8TPY) and [The Addiction That Is Ruining China](https://www.youtube.com/watch?v=MqCk9APctNk).",
    img: `${M}/yt-fern.jpg`,
  },
  {
    title: "Veritasium",
    note: "Science, explained properly. Best video: [The Closest Thing We Have to Alien Technology](https://www.youtube.com/watch?v=MiUHjLxm3V0), on the machines that print the chips AI runs on.",
    img: `${M}/yt-veritasium.jpg`,
  },
  {
    title: "WorldofAI",
    note: "Where I follow new AI models and tools as they ship.",
    img: `${M}/yt-worldofai.jpg`,
  },
]

export const FEED_INTRO = "I'd rather pick my sources than let an algorithm pick them for me."

export const FEED: { title: string; note: string; img: string; dark?: boolean }[] = [
  {
    title: "X",
    note: "A feed I trained on AI builders and open-source finds, like [public-apis](https://github.com/public-apis/public-apis).",
    img: `${M}/feed-x.svg`,
    dark: true,
  },
  {
    title: "Telegram",
    note: "News straight from the newsrooms: Bloomberg, Reuters, BBC News, SCMP.",
    img: `${M}/feed-telegram.svg`,
  },
]

export const MUSIC_INTRO = "Russian, Spanish, English: a playlist that moves around as much as I did."

export const MUSIC: { title: string; by: string; img: string }[] = [
  { title: "Иностранец", by: "LYRIQ", img: `${M}/music-lyriq.jpg` },
  { title: "La Luna y Carmela", by: "Luis Miguel Hernandez", img: `${M}/music-luna.jpg` },
  { title: "My Fire", by: "Jfarrari", img: `${M}/music-myfire.jpg` },
]
