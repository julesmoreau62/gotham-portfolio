import { DOSSIER_DURATION, SEGMENTS, SFX, VOICE_SAMPLE, type SfxKind } from "@/lib/dossier"

/* ------------------------------------------------------------------
   DOSSIER AUDIO — one AudioContext is the master clock. The voice
   segments are scheduled on it, the sound effects are synthesized on
   it a few frames ahead, and pausing suspends it, so picture and
   sound can never drift apart. Without Web Audio, a silent wall clock
   keeps the film running with subtitles.
   ------------------------------------------------------------------ */

const LOOKAHEAD = 0.12

export class DossierEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private voice: GainNode | null = null
  private fx: GainNode | null = null
  private bed: GainNode | null = null
  private noise: AudioBuffer | null = null
  private buffers: (AudioBuffer | null)[] = SEGMENTS.map(() => null)
  private sources: AudioBufferSourceNode[] = []
  private drone: { stop: () => void } | null = null
  private sample: AudioBufferSourceNode | null = null
  private origin = 0
  private fxFrom = 0
  private volume = 0.6
  private muted = false
  /** Wall clock fallback when the AudioContext is missing or blocked. */
  private wall = { origin: 0, pausedAt: 0, running: false }
  analyser: AnalyserNode | null = null
  /** The voice alone, for the HUD's oscilloscope. */
  scope: AnalyserNode | null = null
  started = false
  paused = false

  constructor() {
    try {
      const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Ctx) return
      const ctx = new Ctx()
      this.ctx = ctx
      this.master = ctx.createGain()
      this.master.gain.value = this.volume
      this.analyser = ctx.createAnalyser()
      this.analyser.fftSize = 256
      this.master.connect(this.analyser).connect(ctx.destination)
      this.voice = ctx.createGain()
      this.fx = ctx.createGain()
      this.fx.gain.value = 0.55
      this.bed = ctx.createGain()
      this.bed.gain.value = 0
      this.scope = ctx.createAnalyser()
      this.scope.fftSize = 1024
      this.voice.connect(this.scope).connect(this.master)
      this.fx.connect(this.master)
      this.bed.connect(this.master)
      const noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
      const data = noise.getChannelData(0)
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
      this.noise = noise
    } catch {
      this.ctx = null
    }
  }

  get audible() { return !!this.ctx }

  /** Fetches and decodes every segment; reports progress from 0 to 1. */
  async load(onProgress: (share: number) => void) {
    let done = 0
    await Promise.all(SEGMENTS.map(async (segment, i) => {
      try {
        const response = await fetch(segment.src)
        const bytes = await response.arrayBuffer()
        if (this.ctx) this.buffers[i] = await this.ctx.decodeAudioData(bytes)
      } catch {
        this.buffers[i] = null
      }
      done += 1
      onProgress(done / SEGMENTS.length)
    }))
  }

  /** Must run inside a user gesture: browsers keep audio locked until then. */
  async unlock() {
    if (this.ctx && this.ctx.state !== "running") {
      try { await this.ctx.resume() } catch {}
    }
  }

  get time() {
    if (!this.started) return 0
    if (this.ctx && this.ctx.state !== "closed") return Math.min(DOSSIER_DURATION, Math.max(0, this.ctx.currentTime - this.origin))
    const { origin, pausedAt, running } = this.wall
    return Math.min(DOSSIER_DURATION, running ? (performance.now() - origin) / 1000 : pausedAt)
  }

  setVolume(volume: number) {
    this.volume = volume
    this.applyGain()
  }

  setMuted(muted: boolean) {
    this.muted = muted
    this.applyGain()
  }

  private applyGain() {
    if (!this.ctx || !this.master) return
    this.master.gain.setTargetAtTime(this.muted ? 0 : this.volume, this.ctx.currentTime, 0.03)
  }

  /** The sound check: a soft chime, then the voice at its real level. */
  testSignal() {
    if (!this.ctx || !this.voice) return
    this.stopSample()
    const now = this.ctx.currentTime + 0.02
    this.synth("beep", now)
    const buffer = this.buffers[VOICE_SAMPLE.segment]
    if (!buffer) return
    const source = this.ctx.createBufferSource()
    source.buffer = buffer
    source.connect(this.voice)
    source.start(now + 0.35, VOICE_SAMPLE.from, VOICE_SAMPLE.to - VOICE_SAMPLE.from)
    this.sample = source
  }

  private stopSample() {
    try { this.sample?.stop() } catch {}
    this.sample = null
  }

  start(from = 0) {
    this.stopSample()
    this.started = true
    this.paused = false
    this.startDrone()
    this.seek(from)
  }

  seek(to: number) {
    const t = Math.min(Math.max(0, to), DOSSIER_DURATION)
    this.stopVoice()
    this.fxFrom = t
    if (!this.ctx) {
      this.wall = { origin: performance.now() - t * 1000, pausedAt: t, running: !this.paused }
      return
    }
    const now = this.ctx.currentTime
    this.origin = now - t
    SEGMENTS.forEach((segment, i) => {
      const buffer = this.buffers[i]
      if (!buffer || !this.ctx || !this.voice || segment.start + buffer.duration <= t) return
      const source = this.ctx.createBufferSource()
      source.buffer = buffer
      source.connect(this.voice)
      source.start(now + Math.max(0, segment.start - t), Math.max(0, t - segment.start))
      this.sources.push(source)
    })
  }

  async pause() {
    if (this.paused) return
    this.paused = true
    if (!this.ctx) {
      this.wall = { ...this.wall, pausedAt: this.time, running: false }
      return
    }
    try { await this.ctx.suspend() } catch {}
  }

  async resume() {
    if (!this.paused) return
    this.paused = false
    if (!this.ctx) {
      this.wall = { ...this.wall, origin: performance.now() - this.wall.pausedAt * 1000, running: true }
      return
    }
    try { await this.ctx.resume() } catch {}
  }

  /** A one-off effect outside the film's timeline, such as the closing screen powering on. */
  play(kind: SfxKind) {
    if (!this.ctx || this.paused) return
    this.synth(kind, this.ctx.currentTime + 0.02)
  }

  /** Called every frame: schedules the effects about to happen. */
  update() {
    if (!this.ctx || !this.started || this.paused) return
    const t = this.time
    const until = t + LOOKAHEAD
    for (const event of SFX) {
      if (event.at < this.fxFrom || event.at >= until) continue
      this.synth(event.kind, this.origin + event.at, event.dur)
    }
    this.fxFrom = Math.max(this.fxFrom, until)
    // The ambient bed fades out with the closing card.
    if (this.bed) this.bed.gain.setTargetAtTime(t > DOSSIER_DURATION - 1 ? 0 : 0.5, this.ctx.currentTime, 0.4)
  }

  private stopVoice() {
    for (const source of this.sources) { try { source.stop() } catch {} }
    this.sources = []
  }

  dispose() {
    this.stopVoice()
    this.stopSample()
    this.drone?.stop()
    try { void this.ctx?.close() } catch {}
  }

  /* ---------------------------- synthesis ---------------------------- */

  private startDrone() {
    if (!this.ctx || !this.bed || this.drone) return
    const ctx = this.ctx
    const low = ctx.createBiquadFilter()
    low.type = "lowpass"
    low.frequency.value = 260
    low.Q.value = 6
    const level = ctx.createGain()
    level.gain.value = 0.06
    low.connect(level).connect(this.bed)
    const oscillators = [55, 55.35, 82.4].map(freq => {
      const osc = ctx.createOscillator()
      osc.type = "sawtooth"
      osc.frequency.value = freq
      osc.connect(low)
      osc.start()
      return osc
    })
    // A slow sweep keeps the bed breathing.
    const lfo = ctx.createOscillator()
    const depth = ctx.createGain()
    lfo.frequency.value = 0.07
    depth.gain.value = 90
    lfo.connect(depth).connect(low.frequency)
    lfo.start()
    // Faint radio hiss on top.
    const hiss = ctx.createBufferSource()
    hiss.buffer = this.noise
    hiss.loop = true
    const band = ctx.createBiquadFilter()
    band.type = "bandpass"
    band.frequency.value = 2400
    band.Q.value = 0.8
    const hissLevel = ctx.createGain()
    hissLevel.gain.value = 0.012
    hiss.connect(band).connect(hissLevel).connect(this.bed)
    hiss.start()
    this.drone = {
      stop: () => {
        for (const node of [...oscillators, lfo, hiss]) { try { node.stop() } catch {} }
      },
    }
  }

  private envelope(at: number, peak: number, attack: number, release: number) {
    const gain = this.ctx!.createGain()
    gain.gain.setValueAtTime(0, at)
    gain.gain.linearRampToValueAtTime(peak, at + attack)
    gain.gain.exponentialRampToValueAtTime(0.0001, at + attack + release)
    gain.connect(this.fx!)
    return gain
  }

  private tone(at: number, type: OscillatorType, from: number, to: number, peak: number, release: number) {
    const ctx = this.ctx!
    const osc = ctx.createOscillator()
    osc.type = type
    osc.frequency.setValueAtTime(from, at)
    if (to !== from) osc.frequency.exponentialRampToValueAtTime(to, at + release)
    osc.connect(this.envelope(at, peak, 0.004, release))
    osc.start(at)
    osc.stop(at + release + 0.05)
  }

  private hiss(at: number, duration: number, peak: number, filter: BiquadFilterType, from: number, to: number) {
    const ctx = this.ctx!
    const source = ctx.createBufferSource()
    source.buffer = this.noise
    source.loop = true
    const shape = ctx.createBiquadFilter()
    shape.type = filter
    shape.Q.value = 1.2
    shape.frequency.setValueAtTime(from, at)
    shape.frequency.exponentialRampToValueAtTime(to, at + duration)
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, at)
    gain.gain.linearRampToValueAtTime(peak, at + duration * 0.35)
    gain.gain.exponentialRampToValueAtTime(0.0001, at + duration)
    source.connect(shape).connect(gain).connect(this.fx!)
    source.start(at, Math.random() * 0.5)
    source.stop(at + duration + 0.05)
  }

  /** Tension before a reveal: pitch and noise climb together, then cut dead. */
  private riser(at: number, duration: number) {
    const ctx = this.ctx!
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.0001, at)
    gain.gain.exponentialRampToValueAtTime(0.12, at + duration)
    gain.gain.setValueAtTime(0, at + duration + 0.01)
    gain.connect(this.fx!)
    const osc = ctx.createOscillator()
    osc.type = "sawtooth"
    osc.frequency.setValueAtTime(110, at)
    osc.frequency.exponentialRampToValueAtTime(880, at + duration)
    const tone = ctx.createGain()
    tone.gain.value = 0.25
    osc.connect(tone).connect(gain)
    const noise = ctx.createBufferSource()
    noise.buffer = this.noise
    noise.loop = true
    const band = ctx.createBiquadFilter()
    band.type = "bandpass"
    band.Q.value = 2
    band.frequency.setValueAtTime(400, at)
    band.frequency.exponentialRampToValueAtTime(6000, at + duration)
    noise.connect(band).connect(gain)
    osc.start(at)
    noise.start(at)
    osc.stop(at + duration + 0.05)
    noise.stop(at + duration + 0.05)
  }

  /** A jet across the stereo field, for a flight on the globe: rises, peaks mid-way, settles as it lands. */
  private flight(at: number, duration: number) {
    const ctx = this.ctx!
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.0001, at)
    gain.gain.exponentialRampToValueAtTime(0.34, at + duration * 0.55)
    gain.gain.exponentialRampToValueAtTime(0.0001, at + duration + 0.25)
    const pan = ctx.createStereoPanner?.()
    if (pan) {
      pan.pan.setValueAtTime(-0.8, at)
      pan.pan.linearRampToValueAtTime(0.8, at + duration)
      gain.connect(pan).connect(this.fx!)
    } else gain.connect(this.fx!)
    const noise = ctx.createBufferSource()
    noise.buffer = this.noise
    noise.loop = true
    const band = ctx.createBiquadFilter()
    band.type = "bandpass"
    band.Q.value = 1.4
    band.frequency.setValueAtTime(300, at)
    band.frequency.exponentialRampToValueAtTime(2600, at + duration * 0.55)
    band.frequency.exponentialRampToValueAtTime(700, at + duration + 0.25)
    noise.connect(band).connect(gain)
    const engine = ctx.createOscillator()
    engine.type = "triangle"
    engine.frequency.setValueAtTime(90, at)
    engine.frequency.exponentialRampToValueAtTime(180, at + duration * 0.55)
    engine.frequency.exponentialRampToValueAtTime(110, at + duration + 0.25)
    const hum = ctx.createGain()
    hum.gain.value = 0.35
    engine.connect(hum).connect(gain)
    noise.start(at, Math.random() * 0.5)
    engine.start(at)
    noise.stop(at + duration + 0.3)
    engine.stop(at + duration + 0.3)
  }

  private synth(kind: SfxKind, at: number, dur?: number) {
    if (!this.ctx || !this.fx) return
    const when = Math.max(at, this.ctx.currentTime)
    switch (kind) {
      case "tick": return this.tone(when, "square", 2200, 2200, 0.035, 0.018)
      case "beep": return this.tone(when, "sine", 1046, 1046, 0.16, 0.16)
      case "ping":
        this.tone(when, "sine", 1568, 1568, 0.14, 0.7)
        return this.tone(when + 0.09, "sine", 2093, 2093, 0.05, 0.5)
      case "lock":
        this.tone(when, "square", 880, 880, 0.07, 0.08)
        this.tone(when + 0.1, "square", 1320, 1320, 0.07, 0.08)
        this.tone(when + 0.2, "sine", 1760, 1760, 0.16, 0.5)
        return this.tone(when, "sine", 120, 40, 0.5, 0.35)
      case "thump":
        this.tone(when, "sine", 110, 36, 0.7, 0.4)
        return this.hiss(when, 0.12, 0.12, "lowpass", 1800, 300)
      case "whoosh": return this.hiss(when, 0.7, 0.16, "bandpass", 260, 3800)
      case "glitch":
        for (let i = 0; i < 5; i++) this.hiss(when + i * 0.035, 0.03, 0.14, "highpass", 900 + i * 600, 4000)
        return this.tone(when, "square", 160, 60, 0.05, 0.15)
      case "shutter":
        this.hiss(when, 0.035, 0.3, "highpass", 2500, 6000)
        return this.hiss(when + 0.07, 0.05, 0.22, "highpass", 1800, 5000)
      case "riser": return this.riser(when, 0.95)
      case "alarm":
        for (let i = 0; i < 4; i++) this.tone(when + i * 0.16, "square", i % 2 ? 660 : 880, i % 2 ? 660 : 880, 0.06, 0.13)
        return
      case "flight": return this.flight(when, dur ?? 1.4)
      case "reticle":
        // Three quick steps up as the reticle closes, then a soft confirmation.
        for (let i = 0; i < 3; i++) this.tone(when + i * 0.06, "square", 1800 + i * 600, 1800 + i * 600, 0.03, 0.03)
        return this.tone(when + 0.2, "sine", 1320, 1320, 0.12, 0.35)
      case "impact":
        this.tone(when, "sine", 70, 30, 0.7, 0.8)
        this.hiss(when, 0.4, 0.22, "lowpass", 2600, 180)
        this.tone(when, "triangle", 1760, 1760, 0.04, 0.6)
        return this.tone(when, "triangle", 2637, 2637, 0.025, 0.45)
      case "cut":
        this.hiss(when, 0.045, 0.16, "highpass", 3000, 7000)
        return this.tone(when, "sine", 95, 45, 0.22, 0.12)
      case "shrink":
        this.hiss(when, 0.65, 0.15, "bandpass", 3800, 240)
        return this.tone(when, "sine", 320, 80, 0.07, 0.55)
      case "deny":
        this.tone(when, "square", 440, 440, 0.05, 0.08)
        return this.tone(when + 0.11, "square", 330, 330, 0.05, 0.16)
      case "boot":
        this.tone(when, "sine", 60, 220, 0.25, 0.9)
        return this.hiss(when, 0.9, 0.06, "bandpass", 200, 2600)
    }
  }
}
