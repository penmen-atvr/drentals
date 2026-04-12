import CanonicalUrl from "@/components/canonical-url"
import type { Metadata, Viewport } from "next"
import { generateMetadata, generateViewport } from "@/lib/seo-config"
import PageHeader from "@/components/page-header"

export const viewport: Viewport = generateViewport()

export const metadata: Metadata = generateMetadata({
  title: "Privacy Policy | D'RENTALS",
  description:
    "Read how D'RENTALS collects, uses and protects your personal information when you rent cameras and equipment with us.",
  path: "/privacy-policy",
})

export default function PrivacyPolicyPage() {
  return (
    <>
      <CanonicalUrl />
      <div className="bg-zinc-950 min-h-screen">
        <PageHeader
          label="LEGAL"
          title="PRIVACY POLICY"
          description="How we collect, use, and protect your data."
        />

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="space-y-12 text-zinc-300 font-mono text-sm leading-relaxed">
              <p className="text-zinc-400 font-body text-base">
                Your privacy is important to us. This Privacy Policy explains how we collect, use,
                disclose and safeguard your information when you visit our website, use our mobile application, or rent
                equipment through D&apos;RENTALS.
              </p>

              <div>
                <h2 className="text-red-500 font-heading text-xl mb-4 tracking-wider">
                  INFORMATION WE COLLECT
                </h2>
                <ul className="space-y-2 list-disc pl-5">
                  <li>
                    <strong className="text-white">Personal Data</strong> (name, email, phone number, government ID/KYC documents) you
                    provide when creating an account, verifying identity, or placing an order.
                  </li>
                  <li>
                    <strong className="text-white">Usage Data</strong> (IP address, browser type, device identifiers,
                    pages visited) collected automatically to help us improve the platform.
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-red-500 font-heading text-xl mb-4 tracking-wider">
                  HOW WE USE INFORMATION
                </h2>
                <ol className="space-y-2 list-decimal pl-5">
                  <li>Process, verify, and manage equipment rentals and payments.</li>
                  <li>Respond to enquiries and provide customer support.</li>
                  <li>Improve our mobile application, products, services and website experience.</li>
                  <li>Send transactional alerts (e.g., rental due dates) and—if you opt-in—promotional messages.</li>
                </ol>
              </div>

              <div>
                <h2 className="text-red-500 font-heading text-xl mb-4 tracking-wider">
                  SHARING OF INFORMATION
                </h2>
                <p>
                  We do <em className="text-white not-italic">not</em> sell your data. Limited
                  sharing occurs with trusted third-party providers (payment gateways, delivery partners,
                  analytics tools) solely to fulfil orders or improve our software service. All partners are
                  bound by strict confidentiality obligations.
                </p>
              </div>

              <div>
                <h2 className="text-red-500 font-heading text-xl mb-4 tracking-wider">
                  ACCOUNT & DATA DELETION
                </h2>
                <p>
                  In compliance with app store Data Safety guidelines, users have the right to request the complete
                  deletion of their account and associated personal data at any time.
                </p>
                <p className="mt-2 text-zinc-400">
                  To request data deletion, please contact us at{" "}
                  <a href="mailto:admin@penmenstudios.com" className="text-red-500 hover:text-white transition-colors">
                    admin@penmenstudios.com
                  </a>
                  {" "}with the subject line &quot;Account Deletion Request&quot;. We will process your request within 5-7 business days, provided there are no outstanding rental disputes or legal holding requirements.
                </p>
              </div>

              <div>
                <h2 className="text-red-500 font-heading text-xl mb-4 tracking-wider">
                  CHANGES TO THIS POLICY
                </h2>
                <p>
                  We may revise this Privacy Policy periodically. The latest version is always
                  available on this page and is effective immediately upon posting.
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
