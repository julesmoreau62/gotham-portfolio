import { Harness } from "@/components/harness"
import { PROJECTS } from "@/lib/projects"

export default function Home() {
  return (
    <>
      <Harness />
      {/* Plain-text summary for crawlers and no-JS visitors. */}
      <noscript>
        <div style={{ padding: 24 }}>
          <h1>Jules Moreau: digital transformation and AI for sport organisations</h1>
          <p>Open to an internship, February to June 2027. Contact: jules.moreau1@outlook.com</p>
          <ul>
            {PROJECTS.map((p) => (
              <li key={p.id}>
                <a href={`/p/${p.id}`}>{p.title}</a>: {p.summary}
              </li>
            ))}
          </ul>
        </div>
      </noscript>
    </>
  )
}
