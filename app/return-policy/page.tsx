import CanonicalUrl from "@/components/canonical-url"
import type { Metadata, Viewport } from "next"
import { generateMetadata, generateViewport } from "@/lib/seo-config"
import PageHeader from "@/components/page-header"

export const viewport: Viewport = generateViewport()

export const metadata: Metadata = generateMetadata({
  title: "Return & Refund Policy | D'RENTALS",
  description: "Understand D'RENTALS' return, cancellation and refund rules for camera and lens rentals.",
  path: "/return-policy",
})

export default function ReturnPolicyPage() {
  return (
    <>
      <CanonicalUrl />
      <div className="bg-zinc-950 min-h-screen">
        <PageHeader
          label="LEGAL"
          title="RETURN & REFUND POLICY"
          description="Cancellations, returns, and damaged equipment guidelines."
        />

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="space-y-12 text-zinc-300 font-mono text-sm leading-relaxed">
              <div>
                <h2 className="text-red-500 font-heading text-xl mb-4 tracking-wider">
                  CANCELLATIONS
                </h2>
                <div className="space-y-4">
                  <div className="border border-zinc-800 p-4 bg-zinc-900/50">
                    <p className="font-bold text-white mb-1">Free Cancellation</p>
                    <p className="text-zinc-400 font-body text-base">Up to 24 hours before the scheduled pickup or delivery time.</p>
                  </div>
                  <div className="border border-red-900/30 p-4 bg-red-950/10">
                    <p className="font-bold text-white mb-1">Late Cancellation</p>
                    <p className="text-zinc-400 font-body text-base">50% charge will apply for cancellations made within 24 hours of booking time.</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-red-500 font-heading text-xl mb-4 tracking-wider">
                  EQUIPMENT ISSUES
                </h2>
                <p className="text-zinc-400 font-body text-base">
                  Please inspect all items immediately upon pickup or delivery. Report any defects, visual damage
                  or missing items within <strong className="text-white">2 hours</strong>. We will arrange a replacement (subject to
                  availability) or issue a full refund for the compromised item.
                </p>
              </div>

              <div>
                <h2 className="text-red-500 font-heading text-xl mb-4 tracking-wider">
                  EARLY RETURNS
                </h2>
                <p className="text-zinc-400 font-body text-base">
                  You are welcome to return equipment earlier than scheduled; however, rental fees are calculated 
                  and blocked out for the full booked period. They are non-refundable once the rental schedule has commenced.
                </p>
              </div>

              <div>
                <h2 className="text-red-500 font-heading text-xl mb-4 tracking-wider">
                  DAMAGE OR LOSS
                </h2>
                <p className="text-zinc-400 font-body text-base">
                  Renters hold total responsibility for any damage, loss, or theft during the rental period. 
                  Repair, recalibration, or replacement costs will be billed directly to the customer as per the signed 
                  rental agreement and equipment deposit clauses.
                </p>
              </div>

              <div>
                <h2 className="text-red-500 font-heading text-xl mb-4 tracking-wider">
                  REFUNDS
                </h2>
                <p className="text-zinc-400 font-body text-base">
                  Approved refunds are credited back to your original payment method within 5-7 business days 
                  depending on your issuing bank.
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
