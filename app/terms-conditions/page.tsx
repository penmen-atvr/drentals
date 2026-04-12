import CanonicalUrl from "@/components/canonical-url"
import type { Metadata, Viewport } from "next"
import { generateMetadata, generateViewport } from "@/lib/seo-config"
import PageHeader from "@/components/page-header"

export const viewport: Viewport = generateViewport()

export const metadata: Metadata = generateMetadata({
  title: "Terms & Conditions | D'RENTALS",
  description: "Read the terms and conditions that govern your use of the D'RENTALS website and rental services.",
  path: "/terms-conditions",
})

export default function TermsConditionsPage() {
  return (
    <>
      <CanonicalUrl />
      <div className="bg-zinc-950 min-h-screen">
        <PageHeader
          label="LEGAL"
          title="TERMS & CONDITIONS"
          description="Rules and regulations governing our rental services."
        />

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="space-y-12 text-zinc-300 font-mono text-sm leading-relaxed">
              <div>
                <h2 className="text-red-500 font-heading text-xl mb-4 tracking-wider">
                  1. AGREEMENT
                </h2>
                <p className="text-zinc-400 font-body text-base">
                  By accessing our website or renting equipment, you agree to be bound by these Terms &amp; Conditions and all
                  applicable laws.
                </p>
              </div>

              <div>
                <h2 className="text-red-500 font-heading text-xl mb-4 tracking-wider">
                  2. ELIGIBILITY
                </h2>
                <p className="text-zinc-400 font-body text-base">
                  Customers must be 18 years or older with valid government ID and a matching credit/debit card.
                </p>
              </div>

              <div>
                <h2 className="text-red-500 font-heading text-xl mb-4 tracking-wider">
                  3. RENTAL PERIOD
                </h2>
                <p className="text-zinc-400 font-body text-base">
                  The rental period begins at the scheduled pickup or delivery time and ends once equipment is returned and
                  inspected by our technical team.
                </p>
              </div>

              <div>
                <h2 className="text-red-500 font-heading text-xl mb-4 tracking-wider">
                  4. PAYMENT & DEPOSITS
                </h2>
                <p className="text-zinc-400 font-body text-base">
                  Full payment is due at checkout. Security deposits may apply for high-value gear and will be held until
                  equipment is safely returned and evaluated.
                </p>
              </div>

              <div>
                <h2 className="text-red-500 font-heading text-xl mb-4 tracking-wider">
                  5. LIABILITY
                </h2>
                <p className="text-zinc-400 font-body text-base">
                  D'RENTALS is not liable for indirect or consequential damages, including loss of data or loss of profit,
                  arising from equipment malfunction or user error during the production.
                </p>
              </div>

              <div>
                <h2 className="text-red-500 font-heading text-xl mb-4 tracking-wider">
                  6. GOVERNING LAW
                </h2>
                <p className="text-zinc-400 font-body text-base">
                  These Terms are governed by the laws of Telangana, India. Any disputes will be subject to the exclusive
                  jurisdiction of the courts of Hyderabad.
                </p>
              </div>

              <div className="pt-8 border-t border-zinc-900 mt-12">
                <p className="text-xs text-zinc-500 uppercase tracking-widest font-heading">
                  Last updated: 12 April 2026
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
