import type { ReactNode } from "react"
import { LandPlot, Volleyball } from "lucide-react"
import {
  BOOKS, FEED, FEED_INTRO, INTRO, MUSIC, MUSIC_INTRO, NOW, ROUTE, SHELF_UPDATED, TEAMS, THREAD, WATCHING,
} from "@/lib/shelf"

/** Notes may contain [label](https://…) links; everything else is plain text. */
function withLinks(text: string): ReactNode[] {
  const out: ReactNode[] = []
  const re = /\[([^\]]+)\]\((https:\/\/[^)\s]+)\)/g
  let last = 0
  for (const m of text.matchAll(re)) {
    out.push(text.slice(last, m.index))
    out.push(<a key={m.index} href={m[2]} target="_blank" rel="noreferrer">{m[1]}</a>)
    last = m.index! + m[0].length
  }
  out.push(text.slice(last))
  return out
}

const hue = (h: number) => ({ ["--h" as string]: h })
const ICONS: Record<string, ReactNode> = { Golf: <LandPlot size={36} strokeWidth={1.5} />, Volleyball: <Volleyball size={36} strokeWidth={1.5} /> }

export function OffTheClock() {
  return (
    <article className="artifact otc">
      <div className="art-status">
        <span className="dot" style={{ background: "var(--text-3)" }} />
        <span>OFF</span>
        <span>·</span>
        <span>Updated {SHELF_UPDATED}</span>
      </div>
      <h2 className="art-title">Off the clock</h2>
      <p className="otc-lede">{INTRO}</p>

      {/* 1 — where I grew up */}
      <section className="otc-sec">
        <h3 className="otc-h"><span>01</span> Where I grew up</h3>
        <ol className="otc-route">
          {ROUTE.map((r, i) => (
            <li key={i} className={r.note === "today" ? "now" : undefined}>
              <span className="pin" aria-hidden />
              <span className="place">{r.place}</span>
              {r.note && <span className="note">{r.note}</span>}
            </li>
          ))}
        </ol>
      </section>

      {/* 2 — teams, from three seats */}
      <section className="otc-sec">
        <h3 className="otc-h"><span>02</span> In a team, from every seat</h3>
        <div className="otc-teams">
          {TEAMS.map((t) => (
            <div key={t.title} className="otc-team" style={hue(t.hue)}>
              <div className="side">{t.side}</div>
              <div className="otc-team-head">
                <div>
                  <div className="title">{t.title}</div>
                  <div className="meta">{t.meta}</div>
                </div>
                {t.img && <img src={t.img} alt="" className="logo" loading="lazy" />}
              </div>
              <p>{t.note}</p>
              <div className="when">{t.when}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 3 — these days */}
      <section className="otc-sec">
        <h3 className="otc-h"><span>03</span> These days</h3>
        <ul className="otc-now">
          {NOW.map((n) => (
            <li key={n.title} style={hue(n.hue)}>
              <div className={`tile${n.img ? " has-img" : ""}`} aria-hidden>
                {n.img ? <img src={n.img} alt="" loading="lazy" /> : (ICONS[n.title] ?? n.title[0])}
              </div>
              <div className="title">{n.title}</div>
              <p>{n.note}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 4 — books */}
      <section className="otc-sec">
        <h3 className="otc-h"><span>04</span> On my nightstand</h3>
        <ul className="otc-books">
          {BOOKS.map((b) => (
            <li key={b.title}>
              <img src={b.img} alt={`${b.title} cover`} className="cover" loading="lazy" />
              <div className="tag">{b.tag}</div>
              <div className="title">{b.title}</div>
              <div className="by">{b.by}</div>
              <p>{b.note}</p>
            </li>
          ))}
        </ul>
        <blockquote className="otc-thread">{THREAD}</blockquote>
      </section>

      {/* 5 — watching and keeping up */}
      <section className="otc-sec">
        <h3 className="otc-h"><span>05</span> Watching</h3>
        <ul className="otc-watch">
          {WATCHING.map((w) => (
            <li key={w.title}>
              <img src={w.img} alt="" loading="lazy" />
              <div>
                <div className="title">{w.title} <span>YouTube</span></div>
                <p>{withLinks(w.note)}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="otc-feed">
          <p className="lead">{FEED_INTRO}</p>
          {FEED.map((f) => (
            <div key={f.title} className="row">
              <span className={`badge${f.dark ? " dark" : ""}`} aria-hidden><img src={f.img} alt="" /></span>
              <p><strong>{f.title}.</strong> {withLinks(f.note)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6 — music */}
      <section className="otc-sec">
        <h3 className="otc-h"><span>06</span> On repeat</h3>
        <p className="otc-sub">{MUSIC_INTRO}</p>
        <ol className="otc-tracks">
          {MUSIC.map((m, i) => (
            <li key={m.title}>
              <span className="n">{String(i + 1).padStart(2, "0")}</span>
              <img src={m.img} alt="" loading="lazy" />
              <span className="txt">
                <span className="title">{m.title}</span>
                <span className="by">{m.by}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>
    </article>
  )
}
