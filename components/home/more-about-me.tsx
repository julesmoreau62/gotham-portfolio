import { WipeLink } from "@/components/fx/page-wipe"
import { Reveal } from "@/components/fx/reveal"
import { ArrowUpRight, SectionHead } from "@/components/ui/primitives"
import styles from "./more-about-me.module.css"

export function MoreAboutMe() {
  return (
    <section id="more-about-me" className="relative scroll-mt-14 px-5 py-20 md:px-8 md:py-28">
      <SectionHead index={5} kicker="Beyond the profile" title="More about ME" right={<span>Two sides of my story</span>} />
      <Reveal className="mt-6 max-w-2xl text-[17px] leading-relaxed text-mute">
        Sport and gaming have always been a big part of my life. Here are the things I spend time on,
        the challenges I enjoy, and a little more of the person behind the projects.
      </Reveal>
      <div className={styles.cards}>
        <article className={`${styles.card} ${styles.sports}`} aria-labelledby="sports-dna-title">
          <div className={styles.track} aria-hidden="true"><i /><i /><i /><i /></div>
          <div className={styles.topline}><span>01 / Off the screen</span><span className={styles.status}>Coming soon</span></div>
          <div className={styles.content}>
            <p className={styles.eyebrow}>The sports I’ve practised</p>
            <h3 id="sports-dna-title">Sports<br />DNA<span>.</span></h3>
            <p>My sporting journey, on the field and beyond.</p>
          </div>
          <div className={styles.bottomline}><span>My sporting story</span><span className={styles.soon}>Next chapter</span></div>
        </article>
        <WipeLink href="/about/games" className={`${styles.card} ${styles.games}`} data-cursor="open" aria-labelledby="gaming-story-title">
          <div className={styles.reticle} aria-hidden="true"><span /><i /></div>
          <div className={styles.topline}><span>02 / In the game</span><span className={styles.status}>Personal archive</span></div>
          <div className={styles.content}>
            <p className={styles.eyebrow}>Competition & creation</p>
            <h3 id="gaming-story-title">Games that<br />shaped me<span>_</span></h3>
            <p>From ranked matches to a Minecraft city of my own.</p>
          </div>
          <div className={styles.bottomline}><span>Explore my gaming story</span><ArrowUpRight className="h-5 w-5" /></div>
        </WipeLink>
      </div>
    </section>
  )
}
