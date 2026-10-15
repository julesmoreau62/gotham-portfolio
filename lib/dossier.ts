/* ------------------------------------------------------------------
   DOSSIER — the narrated intelligence file. Each segment is one
   ElevenLabs recording in public/Elevenlabs; line times are where the
   speech actually sits in the file (measured from its waveform), so
   every visual cue lands on the word it illustrates.
   ------------------------------------------------------------------ */

export type DossierLine = { at: number; end: number; text: string }

export type DossierSegment = {
  id: string
  src: string
  chapter: string
  /** Global time when the recording starts. */
  start: number
  duration: number
  lines: DossierLine[]
}

type RawSegment = { id: string; chapter: string; gap: number; duration: number; lines: [number, number, string][] }

const RAW: RawSegment[] = [
  {
    id: "SEG01", chapter: "Identification", gap: 2.6, duration: 6.84,
    lines: [
      [0.16, 1.2, "Looking for target."],
      [2.0, 2.82, "Jules Moreau."],
      [3.76, 4.52, "Match found."],
      [4.98, 6.64, "Reconstructing movement history."],
    ],
  },
  {
    id: "SEG02", chapter: "Movement history", gap: 0.8, duration: 12.59,
    lines: [
      [0.1, 1.46, "Unusual history."],
      [2.0, 5.08, "From childhood, the target never stays in one place."],
      [5.7, 6.42, "France."],
      [6.96, 7.94, "French Guiana."],
      [8.56, 9.18, "Corsica."],
      [9.76, 10.78, "New Caledonia."],
      [11.36, 12.4, "Congo-Brazzaville."],
    ],
  },
  {
    id: "SEG03", chapter: "Interest profile", gap: 0.9, duration: 10.27,
    lines: [
      [0.04, 1.08, "Back in France."],
      [1.68, 3.12, "First interest detected:"],
      [3.54, 4.7, "competitive gaming."],
      [5.74, 7.88, "The target cares less about the match..."],
      [8.4, 10.12, "...than about everything around it."],
    ],
  },
  {
    id: "SEG04", chapter: "Field record", gap: 1.4, duration: 30.35,
    lines: [
      [0.12, 1.12, "2022."],
      [1.7, 5.16, "Base of operations: the Opal Coast, Northern France."],
      [5.78, 7.38, "Bachelor’s in sport management."],
      [7.92, 11.56, "Enlisted in the French Navy Reserve, rank: petty officer."],
      [12.26, 14.72, "Meanwhile, youth volleyball coach in Calais."],
      [15.72, 16.82, "2025."],
      [17.4, 21.8, "The target takes over communications at AS Nortkerque, an amateur football club."],
      [22.28, 23.0, "One season."],
      [23.9, 25.56, "Over one million views."],
      [26.36, 30.22, "Sponsor click-through rate up 467 percent."],
    ],
  },
  {
    id: "SEG05", chapter: "Operation Kourou", gap: 1.2, duration: 15.88,
    lines: [
      [0.08, 1.68, "Summer 2025."],
      [2.22, 5.3, "New signal in French Guiana: Kourou."],
      [5.96, 12.78, "The target builds the VIP hospitality area for the Kourou Beach Festival and the sponsor arches for the Tour de Guyane."],
      [13.3, 14.24, "Tight deadlines."],
      [14.72, 15.74, "Mission accomplished."],
    ],
  },
  {
    id: "SEG06", chapter: "Base Lille", gap: 1.2, duration: 20.04,
    lines: [
      [0.04, 1.76, "September 2025."],
      [2.26, 3.5, "Relocation to Lille."],
      [4.02, 6.54, "Master’s in International Sport Administration."],
      [7.78, 8.34, "December."],
      [8.96, 12.24, "Head of communications for a university multisport tournament."],
      [12.78, 15.32, "Over 500 photos and videos delivered."],
      [16.3, 17.84, "Two critical incidents."],
      [18.68, 19.8, "Zero disruption."],
    ],
  },
  {
    id: "SEG07", chapter: "Operation Daring", gap: 1.2, duration: 21.63,
    lines: [
      [0.16, 1.72, "May 2026."],
      [2.26, 3.04, "Border crossing."],
      [3.62, 5.08, "Position: Brussels."],
      [5.7, 10.18, "The target joins Royal Daring Hockey Club ahead of its promotion to Division Honneur."],
      [10.72, 11.32, "Results:"],
      [11.8, 17.1, "A first visual identity, a five-tier sponsorship offer, a bilingual partner website,"],
      [17.58, 21.42, "and a handover system so everything keeps running after departure."],
    ],
  },
  {
    id: "SEG08", chapter: "Profile shift", gap: 1.3, duration: 21.63,
    lines: [
      [0.06, 1.18, "Last known position: Lille."],
      [1.68, 2.1, "… Lille."],
      [3.3, 4.88, "Profile shift detected."],
      [5.44, 7.46, "The target no longer just communicates."],
      [7.9, 11.34, "He builds AI tools, automations, local models."],
      [11.6, 16.78, "His research engine scans 90 sources a day, around the clock."],
      [17.44, 18.3, "Thesis topic:"],
      [18.8, 21.4, "Generative AI in sports associations."],
    ],
  },
  {
    id: "SEG09", chapter: "Next mission", gap: 1.4, duration: 16.04,
    lines: [
      [0.22, 1.36, "Next mission sought:"],
      [1.86, 5.86, "Digital transformation and AI inside a sport organisation."],
      [6.4, 8.62, "February to June 2027."],
      [9.26, 10.72, "Anywhere around the world."],
      [11.38, 12.28, "Recommendation:"],
      [12.92, 14.08, "Make contact."],
      [14.74, 15.8, "End of transmission."],
    ],
  },
]

/** Time kept after the last recording, for the dive into the closing screen. */
const TAIL = 1.8

export const SEGMENTS: DossierSegment[] = (() => {
  let clock = 0
  return RAW.map(({ id, chapter, gap, duration, lines }) => {
    const start = clock + gap
    clock = start + duration
    return {
      id, chapter, start, duration,
      src: `/Elevenlabs/${id}.mp3`,
      lines: lines.map(([at, end, text]) => ({ at: start + at, end: start + end, text })),
    }
  })
})()

const last = SEGMENTS[SEGMENTS.length - 1]
export const DOSSIER_DURATION = last.start + last.duration + TAIL

const line = (segment: number, index: number) => SEGMENTS[segment].lines[index]
/** A moment inside a recording, for cues that fall mid-sentence. */
const at = (segment: number, local: number) => SEGMENTS[segment].start + local

/** Named cues, in global seconds. */
export const CUE = {
  boot: 0,
  search: line(0, 0),
  name: line(0, 1),
  match: line(0, 2),
  rebuild: line(0, 3),
  unusual: line(1, 0),
  childhood: line(1, 1),
  places: [line(1, 2), line(1, 3), line(1, 4), line(1, 5), line(1, 6), line(2, 0)],
  interest: line(2, 1),
  gaming: line(2, 2),
  game: line(2, 3),
  around: line(2, 4),
  field: {
    year: line(3, 0), base: line(3, 1), opal: at(3, 3.18), bachelor: line(3, 2), navy: line(3, 3), rank: at(3, 10.16),
    coach: line(3, 4), calais: at(3, 13.18), year2025: line(3, 5), club: line(3, 6), season: line(3, 7), views: line(3, 8),
    ctr: line(3, 9), ctrUp: at(3, 27.98),
  },
  kourou: { summer: line(4, 0), signal: line(4, 1), guiana: at(4, 3.42), place: at(4, 4.94), build: line(4, 2), arches: at(4, 10.64), deadline: line(4, 3), done: line(4, 4) },
  lille: { september: line(5, 0), move: line(5, 1), master: line(5, 2), december: line(5, 3), comms: line(5, 4), files: line(5, 5), incidents: line(5, 6), zero: line(5, 7) },
  daring: {
    may: line(6, 0), border: line(6, 1), position: line(6, 2), brussels: at(6, 4.52), join: line(6, 3), results: line(6, 4),
    identity: at(6, 11.8), tiers: at(6, 13.58), website: at(6, 15.52), handover: line(6, 6),
  },
  shift: {
    last: line(7, 0), again: line(7, 1), shift: line(7, 2), communicates: line(7, 3), builds: line(7, 4), automations: at(7, 9.3), models: at(7, 10.5),
    engine: line(7, 5), scans: at(7, 13.04), topic: line(7, 6), thesis: line(7, 7),
  },
  mission: { sought: line(8, 0), objective: line(8, 1), sport: at(8, 4.14), window: line(8, 2), world: line(8, 3), recommend: line(8, 4), contact: line(8, 5), out: line(8, 6) },
  end: last.start + last.duration + 0.3,
}

/** When the career chapters (SEG04 → SEG09) take over the screen. */
export const CAREER_START = SEGMENTS[3].start

/** The flights to each new base on the large globe: when each leaves, and how long it flies. */
export const FLIGHTS = {
  opal: { at: CUE.field.base.at, flight: 1.5 },
  kourou: { at: CUE.kourou.signal.at, flight: 1.7 },
  lille: { at: CUE.lille.september.end - 0.5, flight: 1.4 },
  back: { at: CUE.shift.last.at - 0.05, flight: 1.1 },
}

/** The numbers given a whole screen: when each starts counting, and for how long. */
export const COUNTS = {
  views: { at: CUE.field.views.at, count: 1.4 },
  ctr: { at: CUE.field.ctr.at, count: CUE.field.ctrUp - CUE.field.ctr.at + 0.5 },
  sources: { at: CUE.shift.scans, count: 3.4 },
}

/** The gaming montage cuts to a new frame this often, from "competitive gaming" to "the match". */
export const MONTAGE_CUT = 0.3

export type SfxKind = "tick" | "beep" | "lock" | "thump" | "whoosh" | "glitch" | "shutter" | "ping" | "boot" | "riser" | "alarm"
  | "flight" | "reticle" | "impact" | "cut" | "shrink" | "deny"
/** `dur` sets how long a sound lasts, for the ones that follow a movement on screen. */
export type SfxEvent = { at: number; kind: SfxKind; dur?: number }

/** Sound design, scheduled on the same clock as the voice. */
export const SFX: SfxEvent[] = (() => {
  const events: SfxEvent[] = [
    { at: 0.05, kind: "boot" },
    ...[0.35, 0.95, 1.55].map(at => ({ at, kind: "tick" as const })),
    ...[0.8, 1.4, 2.0].map(at => ({ at, kind: "beep" as const })),
    { at: CUE.search.at - 0.1, kind: "whoosh" },
    // The name is typed into the query field while it is spoken.
    ...Array.from({ length: 12 }, (_, i) => ({ at: CUE.name.at + (i * (CUE.name.end - CUE.name.at)) / 12, kind: "tick" as const })),
    { at: CUE.name.end - 0.05, kind: "riser" },
    { at: CUE.match.at, kind: "lock" },
    { at: CUE.rebuild.at, kind: "whoosh" },
    { at: CUE.unusual.at + 0.05, kind: "thump" },
    { at: CUE.childhood.at, kind: "glitch" },
    ...CUE.places.map(place => ({ at: place.at, kind: "ping" as const })),
    { at: CUE.interest.at - 0.15, kind: "glitch" },
    { at: CUE.interest.at, kind: "whoosh" },
    { at: CUE.gaming.at, kind: "thump" },
    // Every cut of the CS2 montage hits, under the three cards slamming in.
    ...Array.from({ length: 12 }, (_, k) => ({ at: CUE.gaming.at + (k + 1) * MONTAGE_CUT, kind: "cut" as const })).filter(cut => cut.at < CUE.game.at - 0.2),
    ...[0.1, 0.42, 0.74].map(d => ({ at: CUE.gaming.at + d, kind: "shutter" as const })),
    { at: CUE.game.at - 0.15, kind: "shrink" },
    { at: CUE.game.at + 0.9, kind: "deny" },
    { at: CUE.around.at, kind: "whoosh" },
    ...Array.from({ length: 7 }, (_, i) => ({ at: CUE.around.at + 0.25 + i * 0.2, kind: "tick" as const })),
    { at: CUE.around.at + 1.2, kind: "ping" },
    ...careerSfx(),
  ]
  return events.sort((a, b) => a.at - b.at)
})()

function careerSfx(): SfxEvent[] {
  const { field, kourou, lille, daring, shift, mission } = CUE
  const e = (time: number, kind: SfxKind): SfxEvent => ({ at: time, kind })
  const burst = (from: number, count: number, step: number) => Array.from({ length: count }, (_, i) => e(from + i * step, "tick"))
  // A flight on the large globe: the jet across, then the reticle locking on the new base.
  const fly = ({ at, flight }: { at: number; flight: number }) => [{ at, kind: "flight" as const, dur: flight }, e(at + flight, "reticle")]
  // A full-screen number lands with a hit once it has counted up.
  const land = ({ at, count }: { at: number; count: number }) => e(at + count, "impact")
  const ctrLands = COUNTS.ctr.at + COUNTS.ctr.count
  return [
    e(CAREER_START - 0.2, "glitch"), e(field.year.at, "thump"), ...fly(FLIGHTS.opal),
    e(field.bachelor.at, "shutter"), e(field.navy.at, "shutter"), e(field.rank, "beep"), e(field.coach.at, "shutter"),
    e(field.year2025.at, "thump"), e(field.club.at, "whoosh"), e(field.club.at + 0.3, "shutter"), e(field.club.at + 1.5, "shutter"),
    e(field.season.at, "beep"), ...burst(field.views.at, 12, 0.12), land(COUNTS.views),
    ...burst(field.ctr.at, 7, 0.16), e(ctrLands - 0.95, "riser"), e(ctrLands, "impact"),
    e(kourou.summer.at, "thump"), e(kourou.signal.at, "ping"), ...fly(FLIGHTS.kourou), e(kourou.place, "beep"), e(kourou.build.at, "whoosh"),
    ...burst(kourou.build.at + 0.4, 16, 0.38), e(kourou.deadline.at, "alarm"), e(kourou.done.at, "thump"),
    e(lille.september.at, "thump"), ...fly(FLIGHTS.lille), e(lille.master.at, "shutter"),
    e(lille.december.at, "thump"), e(lille.comms.at, "shutter"), ...burst(lille.files.at, 14, 0.15), e(lille.incidents.at, "alarm"),
    e(lille.zero.at, "lock"),
    e(daring.may.at, "thump"), e(daring.border.at, "thump"), e(daring.border.at + 0.08, "shutter"), e(daring.brussels, "ping"),
    e(daring.join.at, "whoosh"), e(daring.join.at + 0.2, "shutter"), e(daring.results.at, "beep"),
    e(daring.identity, "tick"), e(daring.tiers, "tick"), e(daring.website, "tick"), e(daring.handover.at, "tick"), e(daring.handover.end - 0.3, "lock"),
    ...fly(FLIGHTS.back), e(shift.again.at, "ping"), e(shift.shift.at - 0.9, "riser"), e(shift.shift.at, "glitch"), e(shift.shift.at + 0.05, "thump"),
    e(shift.communicates.end - 0.4, "glitch"), ...burst(shift.builds.at, 10, 0.08), ...burst(shift.automations, 10, 0.08), ...burst(shift.models, 10, 0.08),
    e(shift.engine.at, "whoosh"), ...burst(shift.scans, 17, 0.2), land(COUNTS.sources), e(shift.topic.at, "beep"), e(shift.thesis.at, "lock"),
    e(mission.sought.at, "whoosh"), e(mission.objective.at, "beep"), e(mission.window.at, "thump"), e(mission.world.at, "whoosh"),
    e(mission.recommend.at, "tick"), e(mission.contact.at, "lock"),
    // The dive into the closing screen.
    { at: mission.out.end, kind: "flight" as const, dur: DOSSIER_DURATION - mission.out.end },
  ]
}

/** The sample played by the sound check: the voice saying the name. */
export const VOICE_SAMPLE = { segment: 0, from: 1.9, to: 2.95 }
