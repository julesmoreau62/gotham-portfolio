"use client"

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react"
import { ArrowDown, ArrowUpRight, Pause, Play, Volume2, VolumeX } from "lucide-react"
import { TopBar } from "@/components/home/top-bar"
import { WipeLink } from "@/components/fx/page-wipe"
import { GAMES, GAMES_BACKGROUND_VIDEO } from "@/lib/games"
import { GamesEntrance } from "./games-entrance"
import styles from "./games.module.css"

type Playback = "loading" | "playing" | "paused" | "error"

export function GamesPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const wantsPlayback = useRef(false)
  const playAttempt = useRef(0)
  const [introDone, setIntroDone] = useState(false)
  const [ready, setReady] = useState(false)
  const [playback, setPlayback] = useState<Playback>("loading")
  const [muted, setMuted] = useState(true)
  const [cinema, setCinema] = useState(false)

  const finishIntro = useCallback(() => {
    setIntroDone(true)
    window.requestAnimationFrame(() => headingRef.current?.focus({ preventScroll: true }))
  }, [])

  const play = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    wantsPlayback.current = true
    const attempt = ++playAttempt.current
    setPlayback("loading")
    if (!video.getAttribute("src")) video.src = GAMES_BACKGROUND_VIDEO
    if (video.error) video.load()
    void video.play().catch(() => {
      if (attempt !== playAttempt.current) return
      wantsPlayback.current = false
      setPlayback(video.error ? "error" : "paused")
    })
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)")
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (preference.matches || connection?.saveData) setPlayback("paused")
    else play()

    const onPreference = () => {
      if (!preference.matches) return
      wantsPlayback.current = false
      playAttempt.current += 1
      video.pause()
      setPlayback("paused")
    }
    const onVisibility = () => {
      if (document.hidden) video.pause()
      else if (wantsPlayback.current) play()
    }
    preference.addEventListener("change", onPreference)
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      preference.removeEventListener("change", onPreference)
      document.removeEventListener("visibilitychange", onVisibility)
      wantsPlayback.current = false
      playAttempt.current += 1
      video.pause()
      video.removeAttribute("src")
      video.load()
    }
  }, [play])

  useEffect(() => {
    if (!cinema) return
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setCinema(false) }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [cinema])

  const togglePlayback = () => {
    if (playback === "playing" || (playback === "loading" && wantsPlayback.current)) {
      wantsPlayback.current = false
      playAttempt.current += 1
      videoRef.current?.pause()
      setPlayback("paused")
    } else play()
  }
  const activePlayback = playback === "playing" || playback === "loading"
  const status = {
    loading: "Film loading",
    playing: "CS2 / My highlights",
    paused: "Film paused",
    error: "Film unavailable",
  }[playback]

  return (
    <div className={styles.page} data-cinema={cinema}>
      <div className={styles.background} aria-hidden="true">
        <div className={styles.fallback}><span>PLAY.</span><span>CREATE.</span><span>REPEAT.</span></div>
        <video
          ref={videoRef}
          className={styles.video}
          data-ready={ready}
          muted={muted}
          loop
          playsInline
          preload="none"
          disablePictureInPicture
          tabIndex={-1}
          onLoadedData={() => setReady(true)}
          onPlaying={() => { setReady(true); setPlayback("playing") }}
          onPause={() => setPlayback((current) => current === "error" ? "error" : "paused")}
          onWaiting={() => { if (wantsPlayback.current) setPlayback("loading") }}
          onError={() => { wantsPlayback.current = false; setPlayback("error"); setReady(false) }}
        />
        <div className={styles.shade} />
        <div className={styles.backgroundGrid} />
      </div>

      {!introDone && <GamesEntrance settled={ready || playback === "paused" || playback === "error"} onComplete={finishIntro} />}

      <div inert={!introDone}>
        <div className={styles.navigation}><TopBar variant="page" /></div>
        <main>
          <section className={styles.hero}>
            <div className={styles.heroTop}>
              <WipeLink href="/#more-about-me" className={styles.back}>← More about ME</WipeLink>
              <span className={styles.fileLabel}>Personal archive / 02</span>
            </div>
            <div className={styles.heroContent}>
              <div className={styles.heroCopy}>
                <p className={styles.eyebrow}><span /> Off duty. Still in the game.</p>
                <h1 ref={headingRef} tabIndex={-1} className={styles.title}>Games that<br /><span>shaped</span> me<span className={styles.period}>.</span></h1>
                <p className={styles.lead}>Some of my best memories start with<br className="hidden sm:block" /> “one more game”.</p>
                <p className={styles.description}>Gaming is a big part of who I am. From competitive matches to building a city of my own, these are the games that have been part of my story.</p>
                <a href="#game-stories" className={styles.explore}>Explore my games <ArrowDown size={16} /></a>
                <aside className={styles.filmCaption} aria-label="Background film">
                  <p>My plays. My perspective.</p>
                  <button type="button" onClick={() => setCinema(true)}>Watch the background film <ArrowUpRight size={15} /></button>
                </aside>
              </div>
            </div>
            <div className={styles.heroBottom}>
              <div><strong>Top 20–200</strong><span>Overwatch / 2 years</span></div>
              <div><strong>Level 10</strong><span>Counter-Strike / FACEIT</span></div>
              <div className={styles.heroFootnote}>A competitive streak.<br />A creative side, too.</div>
            </div>
          </section>

          <section id="game-stories" className={styles.stories} aria-labelledby="game-stories-title">
            <div className={styles.storiesHead}>
              <div><p className={styles.eyebrow}>Four games / Different parts of me</p><h2 id="game-stories-title">The games.<br />The stories.</h2></div>
              <p>A few ranks, a lot of time spent playing, and a world of my own. This is the personal side of my interest in gaming and esports.</p>
            </div>
            <nav className={styles.gameNav} aria-label="Jump to a game">
              {GAMES.map((game) => <a key={game.id} href={`#${game.id}`}>{game.title}<ArrowDown size={12} /></a>)}
            </nav>
            <div className={styles.gameCards}>
              {GAMES.map((game, index) => (
                <article key={game.id} id={game.id} className={styles.gameCard} style={{ "--game-accent": game.accent } as CSSProperties}>
                  <div className={styles.gameIdentity}>
                    <span className={styles.gameIndex}>0{index + 1} / {game.category}</span>
                    <span className={styles.gameCode} aria-hidden="true">{game.code}</span>
                    <h3>{game.title}</h3>
                    <div className={styles.tags}>{game.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  </div>
                  <div className={styles.gameStory}>
                    <div className={styles.gameStat}><strong>{game.stat}</strong><span>{game.statLabel}</span></div>
                    <p>{game.text}</p>
                    <div className={styles.gameNote}><span aria-hidden="true">↳</span> {game.note}</div>
                    {game.id === "minecraft" && <div className={styles.city} aria-hidden="true">{[35, 58, 43, 80, 61, 100, 48, 70, 42, 86, 53, 32].map((height, i) => <i key={i} style={{ height: `${height}%` }} />)}</div>}
                  </div>
                </article>
              ))}
            </div>
            <footer className={styles.footer}>
              <p>Same person.<br /><span>Different playgrounds.</span></p>
              <WipeLink href="/#more-about-me">Back to More about ME <ArrowUpRight size={18} /></WipeLink>
            </footer>
          </section>
        </main>

        <div className={styles.filmControls} aria-label="Background film controls">
          <span className={styles.filmStatus} role="status"><i data-playing={playback === "playing"} />{status}</span>
          <button type="button" onClick={togglePlayback} aria-label={activePlayback ? "Pause background video" : "Play background video"}>
            {activePlayback ? <Pause size={14} /> : <Play size={14} />}<span>{activePlayback ? "Pause" : "Play"}</span>
          </button>
          <button type="button" onClick={() => setMuted((value) => !value)} aria-label={muted ? "Unmute background video" : "Mute background video"} aria-pressed={!muted}>
            {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}<span>{muted ? "Sound off" : "Sound on"}</span>
          </button>
          <button type="button" onClick={() => setCinema((value) => !value)} aria-pressed={cinema}>{cinema ? "Back to story" : "Film view"}</button>
        </div>
      </div>
    </div>
  )
}
