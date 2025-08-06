import CanonicalUrl from "@/components/canonical-url"
import type { Metadata } from "next"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Terms & Conditions • d'Rentals Camera Hire",
  description: "Read the terms and conditions that govern your use of the d'Rentals website and rental services.",
}

export default function TermsConditionsPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-10 space-y-6">
      <CanonicalUrl />
      <h1 className="text-3xl font-bold">Terms &amp; Conditions</h1>
      <Separator />

      <section className="prose prose-invert">
        <h2>1. Agreement</h2>
        <p>
          By accessing our website or renting equipment, you agree to be bound by these Terms &amp; Conditions and all
          applicable laws.
        </p>

        <h2>2. Eligibility</h2>
        <p>Customers must be 18 years or older with valid government ID and a matching credit/debit card.</p>

        <h2>3. Rental Period</h2>
        <p>
          The rental period begins at the scheduled pickup or delivery time and ends once equipment is returned and
          inspected.
        </p>

        <h2>4. Payment</h2>
        <p>Full payment is due at checkout. Security deposits may apply for high-value gear.</p>

        <h2>5. Liability</h2>
        <p>
          d&apos;Rentals is not liable for indirect or consequential damages arising from equipment malfunction or user
          error.
        </p>

        <h2>6. Governing Law</h2>
        <p>These Terms are governed by the laws of Telangana, India.</p>

        <p className="text-sm text-muted-foreground">Last updated: 23&nbsp;July&nbsp;2025</p>
      </section>
    </main>
  )
}
