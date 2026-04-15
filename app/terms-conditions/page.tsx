import CanonicalUrl from "@/components/canonical-url"
import type { Metadata, Viewport } from "next"
import { generateMetadata, generateViewport } from "@/lib/seo-config"
import PageHeader from "@/components/page-header"

export const viewport: Viewport = generateViewport()

export const metadata: Metadata = generateMetadata({
  title: "Terms & Conditions | D'RENTALS",
  description: "Read the terms and conditions that govern your use of the D'RENTALS website, mobile app, and equipment rental services.",
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
          description="Rules and regulations governing our rental services and application."
        />

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="space-y-12 text-zinc-300 font-mono text-sm leading-relaxed">

              {/* Intro */}
              <p className="text-zinc-400 font-body text-base">
                These Terms &amp; Conditions (&quot;Terms&quot;) constitute a legally binding agreement
                between you and <strong className="text-white">Penmen Studios</strong> (operating under
                the brand <strong className="text-white">D&apos;RENTALS</strong>), governing your use of
                our website (<strong className="text-white">drentals.in</strong>), Android mobile
                application (&quot;D&apos;RENTALS App&quot;), and equipment rental services. By accessing
                or using any part of our services, you confirm that you have read, understood, and agree
                to be bound by these Terms.
              </p>

              {/* 1 */}
              <div>
                <h2 className="text-red-500 font-heading text-xl mb-4 tracking-wider">
                  1. AGREEMENT TO TERMS
                </h2>
                <p className="text-zinc-400 font-body text-base">
                  By accessing our website, installing or using our mobile application, or renting
                  equipment through D&apos;RENTALS, you agree to be bound by these Terms &amp; Conditions
                  and all applicable laws of India. If you do not agree with any part of these Terms,
                  you must discontinue use of our services immediately.
                </p>
              </div>

              {/* 2 */}
              <div>
                <h2 className="text-red-500 font-heading text-xl mb-4 tracking-wider">
                  2. ELIGIBILITY
                </h2>
                <ul className="space-y-2 list-disc pl-5 text-zinc-400 font-body text-base">
                  <li>You must be at least <strong className="text-white">18 years of age</strong> to use our services.</li>
                  <li>You must provide a valid government-issued photo ID for identity verification (KYC).</li>
                  <li>You must have a valid payment method (credit card, debit card, or UPI) in your own name.</li>
                  <li>
                    By using the D&apos;RENTALS App, you represent that you meet these requirements and
                    that you are not prohibited from using the service under applicable law.
                  </li>
                </ul>
              </div>

              {/* 3 */}
              <div>
                <h2 className="text-red-500 font-heading text-xl mb-4 tracking-wider">
                  3. MOBILE APPLICATION — GOOGLE PLAY
                </h2>
                <p className="text-zinc-400 font-body text-base mb-3">
                  Our Android app is distributed through the Google Play Store. In addition to these
                  Terms, your use of the app is also subject to:
                </p>
                <ul className="space-y-2 list-disc pl-5 text-zinc-400 font-body text-base">
                  <li>
                    <a
                      href="https://play.google.com/about/play-terms/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-500 hover:text-white transition-colors"
                    >
                      Google Play Terms of Service
                    </a>.
                  </li>
                  <li>Google Play&apos;s Developer Distribution Agreement as it applies to end-users.</li>
                </ul>
                <p className="mt-3 text-zinc-400 font-body text-base">
                  The app is provided &quot;as is&quot; and we reserve the right to update, modify, or
                  discontinue the app at any time. Updates distributed through Google Play are governed
                  by the then-current version of these Terms.
                </p>
              </div>

              {/* 4 */}
              <div>
                <h2 className="text-red-500 font-heading text-xl mb-4 tracking-wider">
                  4. RENTAL PERIOD &amp; BOOKING
                </h2>
                <ul className="space-y-2 list-disc pl-5 text-zinc-400 font-body text-base">
                  <li>
                    The rental period begins at the scheduled pickup or delivery time and ends once
                    equipment is returned and inspected by our technical team.
                  </li>
                  <li>
                    Late returns will be charged at the applicable daily rate for each additional day
                    or part thereof.
                  </li>
                  <li>
                    Bookings made through the app or website are subject to availability and confirmed
                    only upon payment and written/in-app confirmation from D&apos;RENTALS.
                  </li>
                </ul>
              </div>

              {/* 5 */}
              <div>
                <h2 className="text-red-500 font-heading text-xl mb-4 tracking-wider">
                  5. PAYMENT, DEPOSITS &amp; REFUNDS
                </h2>
                <ul className="space-y-2 list-disc pl-5 text-zinc-400 font-body text-base">
                  <li>Full rental payment is due at the time of booking confirmation.</li>
                  <li>
                    A refundable security deposit may be required for high-value equipment. The deposit
                    will be returned within 5–7 business days after the equipment is returned and
                    evaluated with no damage or loss.
                  </li>
                  <li>
                    Cancellations made more than 48 hours before the rental start time may be eligible
                    for a partial refund per our Return &amp; Cancellation Policy at{" "}
                    <strong className="text-white">drentals.in/return-policy</strong>.
                  </li>
                  <li>
                    All prices are quoted in Indian Rupees (INR) and are inclusive of applicable taxes
                    unless otherwise stated.
                  </li>
                </ul>
              </div>

              {/* 6 */}
              <div>
                <h2 className="text-red-500 font-heading text-xl mb-4 tracking-wider">
                  6. EQUIPMENT USE &amp; RESPONSIBILITY
                </h2>
                <ul className="space-y-2 list-disc pl-5 text-zinc-400 font-body text-base">
                  <li>
                    You are solely responsible for the safe and proper use of rented equipment from
                    the time of pickup/delivery until return.
                  </li>
                  <li>
                    Equipment must be returned in its original condition. You are liable for the full
                    replacement cost of any damage, loss, or theft occurring during the rental period.
                  </li>
                  <li>
                    You must not sublease, transfer, or lend equipment to any third party without our
                    prior written consent.
                  </li>
                  <li>
                    Equipment must only be used for lawful purposes and in accordance with the
                    manufacturer&apos;s instructions.
                  </li>
                </ul>
              </div>

              {/* 7 */}
              <div>
                <h2 className="text-red-500 font-heading text-xl mb-4 tracking-wider">
                  7. INTELLECTUAL PROPERTY
                </h2>
                <p className="text-zinc-400 font-body text-base">
                  All content on the D&apos;RENTALS website and app — including text, graphics, logos,
                  images, and software — is owned by or licensed to Penmen Studios and is protected by
                  applicable Indian and international copyright, trademark, and intellectual property
                  laws. You may not reproduce, distribute, modify, or create derivative works without
                  our express written permission.
                </p>
              </div>

              {/* 8 */}
              <div>
                <h2 className="text-red-500 font-heading text-xl mb-4 tracking-wider">
                  8. USER CONDUCT
                </h2>
                <p className="mb-3 text-zinc-400 font-body text-base">You agree not to:</p>
                <ul className="space-y-2 list-disc pl-5 text-zinc-400 font-body text-base">
                  <li>Provide false, inaccurate, or misleading information during registration or KYC.</li>
                  <li>Use the service for any unlawful purpose or in violation of any applicable regulations.</li>
                  <li>Attempt to reverse-engineer, decompile, or tamper with the app or website.</li>
                  <li>Interfere with or disrupt the integrity or performance of the platform.</li>
                  <li>Create multiple accounts to circumvent bans or restrictions.</li>
                </ul>
              </div>

              {/* 9 */}
              <div>
                <h2 className="text-red-500 font-heading text-xl mb-4 tracking-wider">
                  9. ACCOUNT TERMINATION
                </h2>
                <p className="text-zinc-400 font-body text-base">
                  We reserve the right to suspend or permanently terminate your account at our sole
                  discretion, without prior notice, if we believe you have violated these Terms,
                  engaged in fraudulent activity, or poses a risk to other users or equipment. Upon
                  termination, all rights granted to you under these Terms will immediately cease.
                  Outstanding payment obligations survive termination.
                </p>
              </div>

              {/* 10 */}
              <div>
                <h2 className="text-red-500 font-heading text-xl mb-4 tracking-wider">
                  10. LIMITATION OF LIABILITY
                </h2>
                <p className="text-zinc-400 font-body text-base">
                  To the fullest extent permitted by applicable law, D&apos;RENTALS and Penmen Studios
                  shall not be liable for any indirect, incidental, special, consequential, or punitive
                  damages — including loss of profits, data, goodwill, or production downtime — arising
                  from your use of our services, equipment malfunction, or events beyond our reasonable
                  control. Our aggregate liability to you for any claim shall not exceed the total rental
                  fees paid by you in the 3 months preceding the claim.
                </p>
              </div>

              {/* 11 */}
              <div>
                <h2 className="text-red-500 font-heading text-xl mb-4 tracking-wider">
                  11. DISCLAIMER OF WARRANTIES
                </h2>
                <p className="text-zinc-400 font-body text-base">
                  Our services and the mobile application are provided &quot;as is&quot; and &quot;as
                  available&quot; without warranties of any kind, either express or implied, including
                  but not limited to implied warranties of merchantability, fitness for a particular
                  purpose, or non-infringement. We do not warrant that the app will be error-free,
                  uninterrupted, or free of viruses or other harmful components.
                </p>
              </div>

              {/* 12 */}
              <div>
                <h2 className="text-red-500 font-heading text-xl mb-4 tracking-wider">
                  12. DISPUTE RESOLUTION
                </h2>
                <p className="text-zinc-400 font-body text-base">
                  In the event of any dispute arising from these Terms or your use of our services, you
                  agree to first attempt informal resolution by contacting us at{" "}
                  <a href="mailto:admin@penmenstudios.com" className="text-red-500 hover:text-white transition-colors">
                    admin@penmenstudios.com
                  </a>{" "}
                  and allowing us a reasonable period (30 days) to resolve the matter. If informal
                  resolution fails, both parties agree to seek resolution through arbitration under the
                  Arbitration and Conciliation Act, 1996 (India) before pursuing litigation.
                </p>
              </div>

              {/* 13 */}
              <div>
                <h2 className="text-red-500 font-heading text-xl mb-4 tracking-wider">
                  13. GOVERNING LAW &amp; JURISDICTION
                </h2>
                <p className="text-zinc-400 font-body text-base">
                  These Terms are governed by and construed in accordance with the laws of{" "}
                  <strong className="text-white">Telangana, India</strong>. Any disputes that proceed
                  to litigation shall be subject to the exclusive jurisdiction of the courts of{" "}
                  <strong className="text-white">Hyderabad, Telangana</strong>.
                </p>
              </div>

              {/* 14 */}
              <div>
                <h2 className="text-red-500 font-heading text-xl mb-4 tracking-wider">
                  14. CHANGES TO THESE TERMS
                </h2>
                <p className="text-zinc-400 font-body text-base">
                  We reserve the right to modify these Terms at any time. When changes are made, we
                  will update the &quot;Last Updated&quot; date and, for material changes, notify users
                  via email or in-app notification. Continued use of the services after changes are
                  posted constitutes acceptance of the revised Terms. We encourage you to review this
                  page periodically.
                </p>
              </div>

              {/* 15 */}
              <div>
                <h2 className="text-red-500 font-heading text-xl mb-4 tracking-wider">
                  15. CONTACT
                </h2>
                <address className="not-italic text-zinc-400 font-body text-base space-y-1">
                  <p>
                    <strong className="text-white">Penmen Studios</strong> (D&apos;RENTALS)
                  </p>
                  <p>Hyderabad, Telangana, India</p>
                  <p>
                    Email:{" "}
                    <a href="mailto:admin@penmenstudios.com" className="text-red-500 hover:text-white transition-colors">
                      admin@penmenstudios.com
                    </a>
                  </p>
                  <p>Website: <strong className="text-white">drentals.in</strong></p>
                </address>
              </div>

              <div className="pt-8 border-t border-zinc-900 mt-12">
                <p className="text-xs text-zinc-500 uppercase tracking-widest font-heading">
                  Last updated: 15 April 2026
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
