import { Btn, RegMarks } from "@/components/ui/primitives"

/* A missing page is a sealed room of Villa Straylight, the Tessier-Ashpool
   family home in Neuromancer. Even Wintermute, their AI, can't find it. */
const LOG = [
  ["$", "locate --this-page"],
  ["!", "TESSIER-ASHPOOL S.A. · access denied"],
  ["!", "wintermute: no trace of it either"],
] as const

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <RegMarks />
      <div className="grid-fine absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="relative">
        <div className="label text-acid">Villa Straylight // error 404</div>
        <h1 className="display-black mt-4 text-[clamp(72px,20vw,260px)] leading-none outline-text">404</h1>
        <div className="mono mx-auto mt-6 grid w-fit gap-1.5 border border-line border-l-2 border-l-acid px-5 py-4 text-left text-[12px] text-mute" aria-hidden="true">
          {LOG.map(([sign, line]) => <span key={line}><span className={sign === "$" ? "text-acid" : "text-[#ff7a6b]"}>{sign}</span> {line}</span>)}
        </div>
        <p className="mt-6 text-[15px] text-ink">This room of Villa Straylight was sealed by the Tessier-Ashpool family. Even Wintermute couldn&apos;t find it.</p>
        <p lang="fr" className="mono mt-2 text-[12px] text-mute">Cette pièce de la Villa Straylight a été scellée par les Tessier-Ashpool. Même Wintermute ne l’a pas trouvée.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Btn href="/" tone="acid">
            Return to base
          </Btn>
          <Btn href="/#contracts" tone="ghost">
            All contracts
          </Btn>
        </div>
      </div>
    </main>
  )
}
