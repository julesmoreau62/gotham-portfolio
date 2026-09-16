"use client"

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react"
import MuxVideo from "@mux/mux-video-react"
import Image from "next/image"
import { ArrowDown, ArrowUpRight, Pause, Play, Volume2, VolumeX, X } from "lucide-react"
import { TopBar } from "@/components/home/top-bar"
import { WipeLink } from "@/components/fx/page-wipe"
import { GAMES, GAMES_BACKGROUND_POSTER, GAMES_MUX_PLAYBACK_ID } from "@/lib/games"
import { GamesEntrance } from "./games-entrance"
import styles from "./games.module.css"

type Playback = "loading" | "playing" | "paused" | "error"

export function GamesPage() {
  const videoRef = useRef<HTMLVideoElement | undefined>(undefined)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const minecraftCardRef = useRef<HTMLElement>(null)
  const minecraftFeatureRef = useRef<HTMLElement>(null)
  const wantsPlayback = useRef(false)
  const playAttempt = useRef(0)
  const [introDone, setIntroDone] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [ready, setReady] = useState(false)
  const [posterReady, setPosterReady] = useState(false)
  const [playback, setPlayback] = useState<Playback>("loading")
  const [muted, setMuted] = useState(true)
  const [cinema, setCinema] = useState(false)
  const [minecraftOpen, setMinecraftOpen] = useState(false)

  const revealPage = useCallback(() => setRevealed(true), [])

  const finishIntro = useCallback(() => {
    setRevealed(true)
    setIntroDone(true)
    window.requestAnimationFrame(() => headingRef.current?.focus({ preventScroll: true }))
  }, [])

  const play = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    wantsPlayback.current = true
    const attempt = ++playAttempt.current
    setPlayback("loading")
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

  const showMinecraft = useCallback(() => {
    setMinecraftOpen(true)
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => minecraftFeatureRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }))
    })
  }, [])

  const hideMinecraft = useCallback(() => {
    setMinecraftOpen(false)
    window.requestAnimationFrame(() => minecraftCardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }))
  }, [])
  const activePlayback = playback === "playing" || playback === "loading"
  const status = {
    loading: "Film loading",
    playing: "CS2 / My highlights",
    paused: "Film paused",
    error: "Film unavailable",
  }[playback]

  return (
    <div className={styles.page} data-cinema={cinema} data-revealed={revealed}>
      <div className={styles.background} aria-hidden="true">
        <div className={styles.fallback}><span>PLAY.</span><span>CREATE.</span><span>REPEAT.</span></div>
        {/* Mux already serves a resized, cached WebP; a raw img also preserves its native load event. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.poster}
          src={GAMES_BACKGROUND_POSTER}
          alt=""
          data-hidden={ready}
          decoding="async"
          fetchPriority="high"
          onLoad={() => setPosterReady(true)}
        />
        <MuxVideo
          ref={videoRef}
          className={styles.video}
          data-ready={ready}
          playbackId={GAMES_MUX_PLAYBACK_ID}
          streamType="on-demand"
          capRenditionToPlayerSize
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

      {!introDone && <GamesEntrance settled={ready || posterReady || playback === "paused" || playback === "error"} onReveal={revealPage} onComplete={finishIntro} />}

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
              {GAMES.map((game) => game.id === "minecraft" ? (
                <button key={game.id} type="button" onClick={showMinecraft} aria-expanded={minecraftOpen} aria-controls="minecraft-city">
                  {game.title}<ArrowDown size={12} />
                </button>
              ) : <a key={game.id} href={`#${game.id}`}>{game.title}<ArrowDown size={12} /></a>)}
            </nav>
            <div className={styles.gameCards}>
              {GAMES.map((game, index) => (
                <article key={game.id} id={game.id} ref={game.id === "minecraft" ? minecraftCardRef : undefined} className={styles.gameCard} style={{ "--game-accent": game.accent } as CSSProperties}>
                  <div
                    className={styles.gameIdentity}
                    data-game={game.id}
                    data-card-image={(game.id === "overwatch" || game.id === "counter-strike") || undefined}
                    data-minecraft={game.id === "minecraft" || undefined}
                  >
                    {game.id === "overwatch" && (
                      <Image
                        className={`${styles.gameCardImage} ${styles.overwatchCardImage}`}
                        src="/assets/games/OW/Capture d'écran 2026-09-16 115505.png"
                        alt=""
                        fill
                        sizes="(max-width: 639px) 100vw, 45vw"
                      />
                    )}
                    {game.id === "counter-strike" && (
                      <Image
                        className={`${styles.gameCardImage} ${styles.counterStrikeCardImage}`}
                        src="/assets/games/CS/Capture d'écran 2026-09-16 115844.png"
                        alt=""
                        fill
                        sizes="(max-width: 639px) 100vw, 45vw"
                      />
                    )}
                    {game.id === "osu" && (
                      <video
                        className={styles.osuCardVideo}
                        src="/assets/games/osu!/0915(6).mp4"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        disablePictureInPicture
                        aria-hidden="true"
                        tabIndex={-1}
                      />
                    )}
                    {game.id === "minecraft" && (
                      <Image
                        className={styles.minecraftCardImage}
                        src="/assets/games/Minecraft/web/old-city-aerial.webp"
                        alt=""
                        fill
                        sizes="(max-width: 639px) 100vw, 45vw"
                      />
                    )}
                    <span className={styles.gameIndex}>0{index + 1} / {game.category}</span>
                    <span className={styles.gameCode} aria-hidden="true">{game.code}</span>
                    <h3>{game.id === "minecraft" ? (
                      <button type="button" className={styles.minecraftTitleButton} onClick={showMinecraft} aria-expanded={minecraftOpen} aria-controls="minecraft-city">
                        {game.title}
                      </button>
                    ) : game.title}</h3>
                    <div className={styles.tags}>{game.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  </div>
                  <div className={styles.gameStory}>
                    <div className={styles.gameStat}><strong>{game.stat}</strong><span>{game.statLabel}</span></div>
                    <p>{game.text}</p>
                    <div className={styles.gameNote}><span aria-hidden="true">↳</span> {game.note}</div>
                    {game.id === "minecraft" && (
                      <button type="button" className={styles.minecraftCta} onClick={showMinecraft} aria-expanded={minecraftOpen} aria-controls="minecraft-city">
                        {minecraftOpen ? "City revealed" : "Explore the city"}<ArrowDown size={13} />
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {minecraftOpen && <section ref={minecraftFeatureRef} id="minecraft-city" className={styles.minecraftFeature} aria-labelledby="minecraft-city-title">
              <button type="button" className={styles.minecraftClose} onClick={hideMinecraft} aria-label="Close the Minecraft city">
                Close city <X size={14} />
              </button>
              <div className={styles.minecraftIntro}>
                <div>
                  <p className={styles.minecraftKicker}>Personal build / Ongoing world</p>
                  <h2 id="minecraft-city-title">Built<br /><span>block by block.</span></h2>
                </div>
                <div className={styles.minecraftManifesto}>
                  <p>This city has been shaped by hand for more than 250 hours. No mods are used beyond WorldEdit, the project&apos;s only building aid.</p>
                  <p>Every building is a one-off. Different eras, materials and scales come together as one connected place — planned as a city, not a collection of isolated builds.</p>
                </div>
              </div>

              <div className={styles.minecraftMetrics} aria-label="Minecraft project facts">
                <div><strong>250+</strong><span>Hours invested</span></div>
                <div><strong>01</strong><span>Builder</span></div>
                <div><strong>WE</strong><span>WorldEdit only</span></div>
                <div><strong>Unique</strong><span>Every building</span></div>
              </div>

              <figure className={`${styles.minecraftShot} ${styles.minecraftHeroShot}`}>
                <Image src="/assets/games/Minecraft/web/old-city-aerial.webp" alt="Aerial night view of the hand-built old city with the modern skyline beyond the bay" fill sizes="(max-width: 639px) 100vw, 92vw" />
                <figcaption><span>01 / City overview</span><strong>Two eras. One world.</strong></figcaption>
              </figure>

              <div className={styles.minecraftPlan}>
                <figure className={styles.minecraftMap}>
                  <Image src="/assets/games/Minecraft/web/city-map.webp" alt="In-game map showing the full scale and districts of the Minecraft city" fill sizes="(max-width: 799px) 100vw, 46vw" />
                </figure>
                <div className={styles.minecraftPlanCopy}>
                  <span>02 / The masterplan</span>
                  <h3>Thinking beyond<br />one building.</h3>
                  <p>The map connects dense historical streets, waterfront districts, residential areas and a growing business skyline. Roads, bridges, canals and sightlines turn individual builds into a coherent urban project.</p>
                  <div className={styles.minecraftTool}><strong>WorldEdit</strong><span>The only building aid used</span></div>
                </div>
              </div>

              <div className={styles.minecraftGallery} aria-label="Minecraft city districts">
                <figure className={`${styles.minecraftShot} ${styles.galleryWide}`}>
                  <Image src="/assets/games/Minecraft/web/skyline.webp" alt="Modern Minecraft skyline made from individually designed skyscrapers" fill sizes="(max-width: 799px) 100vw, 58vw" />
                  <figcaption><span>03 / Business district</span><strong>A skyline without repeats.</strong></figcaption>
                </figure>
                <figure className={`${styles.minecraftShot} ${styles.galleryNarrow}`}>
                  <Image src="/assets/games/Minecraft/web/street-level.webp" alt="Street-level view looking up between unique modern towers" fill sizes="(max-width: 799px) 100vw, 34vw" />
                  <figcaption><span>04 / Street level</span><strong>Scale from below.</strong></figcaption>
                </figure>
                <figure className={`${styles.minecraftShot} ${styles.galleryNarrow}`}>
                  <Image src="/assets/games/Minecraft/web/residential.webp" alt="Green residential street with individually designed houses" fill sizes="(max-width: 799px) 100vw, 34vw" />
                  <figcaption><span>05 / Residential</span><strong>No copy-paste homes.</strong></figcaption>
                </figure>
                <figure className={`${styles.minecraftShot} ${styles.galleryWide}`}>
                  <Image src="/assets/games/Minecraft/web/canal-district.webp" alt="Night view along the canal district lined with detailed buildings" fill sizes="(max-width: 799px) 100vw, 58vw" />
                  <figcaption><span>06 / Canal district</span><strong>Built around the water.</strong></figcaption>
                </figure>
              </div>

              <div className={styles.minecraftClosing}>
                <figure className={styles.minecraftClosingImage}>
                  <Image src="/assets/games/Minecraft/web/old-to-new.webp" alt="View from the wooden old city toward the illuminated modern skyscrapers" fill sizes="(max-width: 799px) 100vw, 56vw" />
                </figure>
                <div>
                  <span>Long-term project</span>
                  <p>More than a collection of builds: a city where every district has a place in the wider plan.</p>
                  <strong>Still building →</strong>
                </div>
              </div>
            </section>}

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
