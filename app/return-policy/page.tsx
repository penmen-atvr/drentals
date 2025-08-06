import CanonicalUrl from "@/components/canonical-url"
import type { Metadata } from "next"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Return & Refund Policy • d'Rentals Camera Hire",
  description: "Understand d'Rentals' return, cancellation and refund rules for camera and lens rentals.",
}

export default function ReturnPolicyPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-10 space-y-6">
      <CanonicalUrl />
      <h1 className="text-3xl font-bold">Return &amp; Refund Policy</h1>
      <Separator />

      <section className="prose prose-invert">
        <h2>Cancellations</h2>
        <p>
          • Free cancellation up to 24 hours before the scheduled pickup/delivery time.
          <br />• 50 % charge for cancellations within 24 hours.
        </p>

        <h2>Equipment Issues</h2>
        <p>
          Inspect items on delivery. Report defects or missing items within 2 hours for a replacement (subject to
          availability) or a full refund.
        </p>

        <h2>Early Returns</h2>
        <p>
          You can return equipment early; however, rental fees are calculated for the full booked period and are
          non-refundable once the rental has begun.
        </p>

        <h2>Damage or Loss</h2>
        <p>
          Renters are responsible for any damage or loss during the rental period. Repair or replacement costs will be
          billed per the signed rental agreement.
        </p>

        <h2>Refunds</h2>
        <p>Approved refunds are credited to your original payment method within 5-7 business days.</p>

        <p className="text-sm text-muted-foreground">Last updated: 23&nbsp;July&nbsp;2025</p>
      </section>
    </main>
  )
}
