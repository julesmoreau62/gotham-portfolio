import { Btn, RegMarks } from "@/components/ui/primitives"

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <RegMarks />
      <div className="grid-fine absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="relative">
        <div className="label text-acid">Signal lost // error 404</div>
        <h1 className="display-black mt-4 text-[clamp(72px,20vw,260px)] leading-none outline-text">404</h1>
        <p className="mono mt-4 text-[13px] text-mute">This contract does not exist or has been reassigned.</p>
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
