import { redirect } from "next/navigation"

/** Intel Core was replaced by Thesis Engine in the fifth project slot. */
export default function LegacyIntelCorePage() {
  redirect("/contracts/thesis-engine")
}
