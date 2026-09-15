// Replace this path with a hosted/optimised video URL when it is available.
// The file is requested only on the games page, never on the homepage.
export const GAMES_BACKGROUND_VIDEO = "/assets/games/CS/CSPORTFOLIO.mp4"

export const GAMES = [
  {
    id: "overwatch",
    code: "OW",
    title: "Overwatch",
    category: "The competitive side",
    accent: "#f5aa53",
    stat: "TOP 20–200",
    statLabel: "Ranked over two years",
    text: "Overwatch is a big part of my competitive gaming story. I played in the Top 20–200 for two years, spending a lot of time in ranked matches and pushing my level.",
    note: "Two years of high-level ranked play.",
    tags: ["Competitive", "Team play", "Ranked"],
  },
  {
    id: "counter-strike",
    code: "CS2",
    title: "Counter-Strike",
    category: "One round at a time",
    accent: "#c8ff00",
    stat: "LEVEL 10",
    statLabel: "FACEIT",
    text: "Counter-Strike is another game I’ve put a lot into, reaching level 10 on FACEIT. The film playing behind this page brings together some of my own CS2 plays.",
    note: "My gameplay, in the background of this page.",
    tags: ["Competitive", "FACEIT", "CS2 highlights"],
  },
  {
    id: "rainbow-six",
    code: "R6",
    title: "Rainbow Six Siege",
    category: "A different kind of tactical game",
    accent: "#8fb8ee",
    stat: "TACTICAL",
    statLabel: "Another part of my gaming history",
    text: "I’ve also spent time on Rainbow Six Siege. Alongside Overwatch and Counter-Strike, it’s part of the competitive games that have taken up a real place in my life.",
    note: "Another perspective on team-based competition.",
    tags: ["Tactical FPS", "Team play"],
  },
  {
    id: "minecraft",
    code: "MC",
    title: "Minecraft",
    category: "Room to create",
    accent: "#a6c9a0",
    stat: "MY OWN CITY",
    statLabel: "Personal building project",
    text: "I played a lot of Minecraft when I was younger. I also have a city project of my own: a more creative part of my gaming life, with a whole world to imagine and build.",
    note: "A personal world, built block by block.",
    tags: ["Creative", "Worldbuilding", "City project"],
  },
] as const
