"use client"

import { useState, useEffect } from "react"
import { BootSequence } from "@/components/boot-sequence"
import { ParticleNetwork } from "@/components/particle-network"
import { NoiseOverlay } from "@/components/noise-overlay"
import { HexCommandGrid } from "@/components/hex-command-grid"
import { useIsMobile } from "@/hooks/use-mobile"

export default function Page() {
  const isMobile = useIsMobile()
  const alreadyBooted = typeof window !== "undefined" && !!sessionStorage.getItem("booted")
  const [booting, setBooting] = useState(!alreadyBooted)
  const [mainVisible, setMainVisible] = useState(alreadyBooted)

  // Skip boot sequence on mobile
  useEffect(() => {
    if (isMobile) {
      setBooting(false)
      setMainVisible(true)
      sessionStorage.setItem("booted", "1")
    }
  }, [isMobile])

  const handleBootComplete = () => {
    setBooting(false)
    sessionStorage.setItem("booted", "1")
    // Small delay for the boot sequence exit animation to finish
    setTimeout(() => setMainVisible(true), 100)
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-background relative tactical-grid cursor-crosshair">
      {/* Plain-text portfolio content for crawlers and screen readers */}
      <div className="sr-only">
        <h2>Jules Moreau — Esports &amp; Sport Operations Portfolio</h2>
        <p>julesmoreau.eu | contact@julesmoreau.eu</p>

        <h2>Identity</h2>
        <p>Jules Moreau. Current role: M1 International Sport Administration student, Université de Lille (STAPS/ISA program). Location: Lille, France. Clearance: NATO Secret (French Navy Reserve, Second Maître / Petty Officer NCO). Status: Seeking internship in Esports Operations &amp; Event Management — April to August 2026. Target organizations: ESL FACEIT Group, BLAST, Twisted Minds, Talon Esports, Aspire Zone Foundation.</p>

        <h2>Profile Summary</h2>
        <p>Jules Moreau is a hybrid sport-management/esports strategist combining military precision, international mobility (French Guiana, New Caledonia, Congo), and hands-on production experience. Former French Navy Reserve NCO. Grandmaster-level Overwatch 2 player. Fluent in French (native) and English (C1). No formal coding background — builds production-grade tools through AI-augmented workflows.</p>

        <h2>Academic</h2>
        <p>Master&apos;s in Sport Sciences — International Sport Administration (ISA), Université de Lille (STAPS) — 2025–2027. Specialization: Esports management, sport governance, sustainability.</p>
        <p>Bachelor&apos;s in Sport Sciences — Sport Management, ULCO — 2022–2025.</p>

        <h2>Experience</h2>

        <h3>Head of Communications — ASN95 (AS Nortkerque football club)</h3>
        <p>Jan–Jun 2025, Hauts-de-France, France. Built complete digital presence from scratch (no prior content calendar, no visual guidelines). Created &quot;Les Pronos du Sultan&quot;: weekly sponsor prediction game with +467% CTR. Developed ASN95 Predict platform (beta, 88% complete): live rankings, user profiles, sponsor data layer. 15+ visuals per season across 3 recurring formats, 5+ sponsors integrated per visual. Match photography: 33 events covered, 500+ shots per match, 1,650+ edited photos across full season. Managed matchday operations, visual identity, sponsor activation.</p>

        <h3>Infrastructure Tech — Bolt Echafaudage (via French Guiana mission)</h3>
        <p>Aug 2025, Kourou, French Guiana. Kourou Beach Festival &amp; Tour de Guyane logistics. Heavy material handling (Telehandlers), VIP complex construction under strict timing constraints.</p>

        <h3>Sales &amp; Ops Support — Guyane Matériels</h3>
        <p>Jun–Jul 2025, French Guiana. Customer operations in tropical environment. Product photography asset production.</p>

        <h3>French Navy Reservist — Petty Officer (Second Maître)</h3>
        <p>Since Jul 2022, France. Ecole de Maîtrance: military rigor, crisis management, team leadership. NATO Secret clearance.</p>

        <h2>Projects</h2>

        <h3>BLAST Strategic Case Study — &quot;David vs. Goliath 2.0&quot;</h3>
        <p>Academic strategic analysis (23 pages). Frameworks: PESTEL, VRIO, SWOT. Key findings: BLAST faces critical asymmetry vs EFG (Saudi PIF-backed ESL, $1.5Bn valuation vs $11M cash). Valve 2025 regulation banning franchised partner leagues collapses BLAST&apos;s Louvre Agreement advantage. Strategic recommendation: India pivot via JV with Reliance — 600M mobile gamers, bypass EFG&apos;s Western saturation. 3-phase execution roadmap: H1 2026 (Mumbai hub), H2 2026 (D2C gamification, Watch-to-Earn), 2027 (break-even). CSR differentiation: &quot;Brand Safety Shield&quot; to attract Western sponsors avoiding EFG&apos;s Saudi PIF reputational risk. Output: Full dossier PDF + interactive HTML presentation on portfolio.</p>

        <h3>Sport Business Watch — AI Intelligence Dashboard</h3>
        <p>Automated intelligence pipeline (production). Tech stack: Python 3.11 + feedparser (crawling), GitHub Actions CRON (daily 06:00 UTC), OpenRouter to Gemini 2.0 Flash (AI filtering, 2-pass system), Notion API (Sport DB + Spatial DB), Next.js 14 dashboard, Netlify deployment. Scale: 35+ RSS sources, 6 geographic regions, 2 AI passes, 1x daily CRON. Cost: ~$1.17/month operational. Status: Fully operational — live at sport-business-watch.netlify.app.</p>

        <h3>ASI Multisports Tournament — Event Management</h3>
        <p>Field Operations (Comms Chief). December 2025, UFRSS Lille, 500+ personnel. Sports: Disc Golf, Wheelchair BBL, Laser Tag, Spikeball. Equipment: Sony a6400 (primary), GoPro x2 (action cam). Crisis management: 2 critical incidents resolved with zero event disruption. R-0200 FACILITY CONFLICT: Venue unavailable 2h before start, alternate gym secured in 45min, zero impact. R-0030 WEATHER HAZARD: Heavy rainfall, indoor fallback activated in 30min, 100% adaptability. Visual assets produced: Graphic charter, participant briefing (FR/EN bilingual), event poster.</p>

        <h3>Overwatch 2 Stats Dashboard</h3>
        <p>Personal tool (production). Tech: OverFast API, tactical/military aesthetic. Creator context: Grandmaster-level competitive player (former Top 500).</p>

        <h3>Personal Portfolio — julesmoreau.eu</h3>
        <p>Next.js single-page application. Aesthetic: Dark tactical/military &quot;GOTHAM system&quot;. Sections: Strategy (BLAST case study), Intel Core (Sport Business Watch), Field Ops (ASI Tournament), Signal (ASN95), Imagery (photography archive).</p>

        <h2>Photography Archive</h2>
        <p>Total files: 50+. Sectors: 3 (Corporate, Events, Sport). Field shots: 50+. Equipment: Sony a6400 (mirrorless APS-C), GoPro x2, edited in Lightroom + Premiere. Corporate: Industrial &amp; corporate photography, professional environments, product shots. Events: Tournament and event coverage, ASI Tournament, matchday operations, competition documentation. Sport: Action sports photography, football, golf, kitesurfing, volleyball — multiple events.</p>

        <h2>Skills &amp; Tools</h2>
        <p>Sport governance, esports business analysis, event operations, crisis management, sponsor activation, visual identity, content strategy, sport photography, Next.js, Python (AI-augmented), Notion API, GitHub Actions, Gemini AI, RSS aggregation, Lightroom, Premiere, Canva, Sony a6400.</p>

        <h2>Differentiators</h2>
        <p>International mobility: lived and worked in French Guiana, New Caledonia, Congo. Military background: NATO Secret clearance, crisis management, command under pressure. Esports depth: M1 thesis on LEC/GRP vs CS2 economic models (interviews with BLAST VP James Woollard). Production-grade builder: deploys real tools with no formal coding background. Grandmaster Overwatch 2 player: credibility inside competitive esports communities.</p>
      </div>

      {/* Ambient layers (disabled on mobile for performance) */}
      {!isMobile && <ParticleNetwork />}
      {!isMobile && <NoiseOverlay />}

      {/* Radial ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, hsl(217 91% 60% / 0.04) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, hsl(186 100% 50% / 0.03) 0%, transparent 50%)",
        }}
        aria-hidden="true"
      />

      {/* Boot sequence (disabled on mobile) */}
      {booting && !isMobile && <BootSequence onComplete={handleBootComplete} />}

      {/* Main interface */}
      <HexCommandGrid visible={mainVisible} skipTransitions={alreadyBooted} />
    </div>
  )
}
