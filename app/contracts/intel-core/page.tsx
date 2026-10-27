import { redirect } from "next/navigation"

/** Intel Core was replaced by Ono-Sendai (first Thesis Engine) in the fifth project slot. */
export default function LegacyIntelCorePage() {
  redirect("/contracts/ono-sendai")
}
