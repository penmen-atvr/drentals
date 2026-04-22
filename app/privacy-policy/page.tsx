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

              {/* Intro */}
              <p className="text-zinc-400 font-body text-base">
                Your privacy is important to us. This Privacy Policy explains how{" "}
                <strong className="text-white">D&apos;RENTALS by Penmen Studios</strong> (&quot;we&quot;,
                &quot;us&quot;, or &quot;our&quot;) collects, uses, discloses and safeguards your
                information when you visit our website (<strong className="text-white">rentals.penmenstudios.com</strong>)
                or use our mobile application (&quot;D&apos;RENTALS App&quot;) available on Google Play,
                or rent equipment through our platform. Please read this policy carefully. If you disagree
                with its terms, please discontinue use of our services.
              </p>

              {/* 1 */}
              <div>
                <h2 className="text-red-500 font-heading text-xl mb-4 tracking-wider">
                  1. INFORMATION WE COLLECT
                </h2>
                <p className="mb-3">We collect the following categories of information:</p>
                <ul className="space-y-3 list-disc pl-5">
                  <li>
                    <strong className="text-white">Personal Identification Data</strong> — name, email
                    address, mobile number, and government-issued photo ID / KYC documents you provide
                    when creating an account, verifying identity, or placing a rental order.
                  </li>
                  <li>
                    <strong className="text-white">Financial Data</strong> — payment method details
                    (processed securely via our payment gateway; we do not store full card numbers).
                    Security deposit records are retained for the duration required by Indian law.
                  </li>
                  <li>
                    <strong className="text-white">Device &amp; Usage Data</strong> — IP address,
                    operating system version, device model, unique device identifiers (Android ID),
                    app version, crash logs, and pages / screens visited, collected automatically to
                    improve our platform and diagnose issues.
                  </li>
                  <li>
                    <strong className="text-white">Location Data</strong> — approximate location (city /
                    region) derived from IP address to show relevant rental hubs. We do{" "}
                    <em className="text-white not-italic">not</em> request precise GPS location.
                  </li>
                  <li>
                    <strong className="text-white">Communications Data</strong> — messages you send us
                    via enquiry forms, email, or WhatsApp for support purposes.
                  </li>
                </ul>
              </div>

              {/* 2 */}
              <div>
                <h2 className="text-red-500 font-heading text-xl mb-4 tracking-wider">
                  2. APP PERMISSIONS (ANDROID)
                </h2>
                <p className="mb-3">
                  Our Android application requests only the permissions necessary for core functionality:
                </p>
                <ul className="space-y-2 list-disc pl-5">
                  <li>
                    <strong className="text-white">INTERNET</strong> — Required to fetch equipment listings,
                    browse the catalog, and submit rental enquiries via WhatsApp.
                  </li>
                </ul>
                <p className="mt-3 text-zinc-400">
                  We do <em className="text-white not-italic">not</em> request access to your Camera,
                  Contacts, Call Logs, SMS, Microphone, precise GPS Location, or any device files.
                  If a future version of the app introduces additional permissions (such as Camera for
                  KYC document upload), this policy will be updated prior to that release.
                </p>
              </div>


              {/* 3 */}
              <div>
                <h2 className="text-red-500 font-heading text-xl mb-4 tracking-wider">
                  3. HOW WE USE YOUR INFORMATION
                </h2>
                <ol className="space-y-2 list-decimal pl-5">
                  <li>Process, verify, and manage equipment rentals, bookings, and payments.</li>
                  <li>Verify user identity and prevent fraud and misuse of the platform.</li>
                  <li>Respond to enquiries and provide customer support.</li>
                  <li>
                    Improve our mobile application, products, services, and website experience through
                    aggregated analytics.
                  </li>
                  <li>
                    Send transactional notifications (e.g., booking confirmation, rental due-date
                    reminders) via email or push notification.
                  </li>
                  <li>
                    Send promotional messages <strong className="text-white">only if you explicitly
                    opt-in</strong>. You may opt-out at any time.
                  </li>
                  <li>Comply with applicable Indian laws and regulations.</li>
                </ol>
              </div>

              {/* 4 */}
              <div>
                <h2 className="text-red-500 font-heading text-xl mb-4 tracking-wider">
                  4. SHARING OF INFORMATION
                </h2>
                <p className="mb-3">
                  We do <em className="text-white not-italic">not</em> sell, trade, or rent your personal
                  data to third parties. Limited sharing occurs only in the following circumstances:
                </p>
                <ul className="space-y-2 list-disc pl-5">
                  <li>
                    <strong className="text-white">Payment Gateways</strong> — to process transactions
                    securely (e.g., Razorpay). These providers are PCI-DSS compliant.
                  </li>
                  <li>
                    <strong className="text-white">Cloud Infrastructure</strong> — our backend runs on
                    Neon (serverless PostgreSQL) and Vercel, both of which operate under strict data
                    processing agreements.
                  </li>
                  <li>
                    <strong className="text-white">Analytics</strong> — aggregated, anonymised usage data
                    may be processed via privacy-preserving analytics tools.
                  </li>
                  <li>
                    <strong className="text-white">Legal Compliance</strong> — if required by law, court
                    order, or government authority.
                  </li>
                </ul>
                <p className="mt-3">All partners are bound by strict confidentiality obligations.</p>
              </div>

              {/* 5 */}
              <div>
                <h2 className="text-red-500 font-heading text-xl mb-4 tracking-wider">
                  5. DATA RETENTION
                </h2>
                <p>
                  We retain personal data only as long as necessary to fulfil the purposes outlined in
                  this policy or as required by Indian law (for example, GST/tax records must be retained
                  for a minimum of 6 years). Account information is retained for the duration of your
                  active account plus 12 months after closure, unless you submit a deletion request.
                  Anonymised or aggregated data may be retained indefinitely for analytical purposes.
                </p>
              </div>

              {/* 6 */}
              <div>
                <h2 className="text-red-500 font-heading text-xl mb-4 tracking-wider">
                  6. SECURITY
                </h2>
                <p>
                  We implement industry-standard safeguards including HTTPS/TLS encryption in transit,
                  password hashing (bcrypt), and access controls to protect your data. However, no method
                  of transmission over the Internet is 100% secure. In the event of a data breach that
                  is likely to result in high risk to your rights and freedoms, we will notify you without
                  undue delay in compliance with applicable data protection laws.
                </p>
              </div>

              {/* 7 */}
              <div>
                <h2 className="text-red-500 font-heading text-xl mb-4 tracking-wider">
                  7. COOKIES &amp; TRACKING
                </h2>
                <p>
                  Our website uses essential cookies strictly necessary for core functionality (session
                  management, security tokens). We do not use advertising or cross-site tracking cookies.
                  No third-party ad networks or tracking pixels are embedded in our site or app.
                </p>
              </div>

              {/* 8 */}
              <div>
                <h2 className="text-red-500 font-heading text-xl mb-4 tracking-wider">
                  8. CHILDREN&rsquo;S PRIVACY
                </h2>
                <p>
                  Our services are intended exclusively for users who are{" "}
                  <strong className="text-white">18 years of age or older</strong>. We do not knowingly
                  collect personal information from children under 13 (or the applicable age of digital
                  consent in your jurisdiction). If we become aware that we have inadvertently collected
                  such data, we will delete it promptly. Parents or guardians who believe their child has
                  provided us with personal data should contact us at{" "}
                  <a href="mailto:admin@penmenstudios.com" className="text-red-500 hover:text-white transition-colors">
                    admin@penmenstudios.com
                  </a>.
                </p>
              </div>

              {/* 9 */}
              <div>
                <h2 className="text-red-500 font-heading text-xl mb-4 tracking-wider">
                  9. YOUR RIGHTS
                </h2>
                <p className="mb-3">Subject to applicable law, you have the right to:</p>
                <ul className="space-y-2 list-disc pl-5">
                  <li>Access the personal data we hold about you.</li>
                  <li>Request correction of inaccurate or incomplete data.</li>
                  <li>Object to or restrict processing of your data.</li>
                  <li>Request deletion of your account and associated personal data (see below).</li>
                  <li>Withdraw consent at any time where processing is based on consent.</li>
                </ul>
                <p className="mt-3">
                  To exercise any of these rights, contact us at{" "}
                  <a href="mailto:admin@penmenstudios.com" className="text-red-500 hover:text-white transition-colors">
                    admin@penmenstudios.com
                  </a>.
                </p>
              </div>

              {/* 10 */}
              <div>
                <h2 className="text-red-500 font-heading text-xl mb-4 tracking-wider">
                  10. ACCOUNT &amp; DATA DELETION
                </h2>
                <p>
                  In compliance with Google Play Store Data Safety requirements, users have the right to
                  request the complete deletion of their account and associated personal data at any time.
                </p>
                <p className="mt-3 text-zinc-400">
                  To request data deletion, please email us at{" "}
                  <a href="mailto:admin@penmenstudios.com" className="text-red-500 hover:text-white transition-colors">
                    admin@penmenstudios.com
                  </a>{" "}
                  with the subject line <strong className="text-white">&quot;Account Deletion Request&quot;</strong>{" "}
                  and include the email address or phone number associated with your account.
                  We will process your request within{" "}
                  <strong className="text-white">7–14 business days</strong>, provided there are no
                  outstanding rental disputes, legal holds, or statutory retention obligations.
                </p>
                <p className="mt-3 text-zinc-400">
                  You may also submit a deletion request directly through the{" "}
                  <strong className="text-white">D&apos;RENTALS App</strong> via{" "}
                  <em>Settings &gt; Account &gt; Delete Account</em>.
                </p>
              </div>

              {/* 11 */}
              <div>
                <h2 className="text-red-500 font-heading text-xl mb-4 tracking-wider">
                  11. THIRD-PARTY LINKS &amp; SERVICES
                </h2>
                <p>
                  Our website and app may contain links to third-party websites (e.g., equipment
                  manufacturer sites). We are not responsible for the privacy practices of those sites
                  and encourage you to review their policies independently.
                </p>
              </div>

              {/* 12 */}
              <div>
                <h2 className="text-red-500 font-heading text-xl mb-4 tracking-wider">
                  12. CHANGES TO THIS POLICY
                </h2>
                <p>
                  We may revise this Privacy Policy periodically. When we make material changes, we will
                  update the &quot;Last Updated&quot; date below and, where required, notify you via
                  email or an in-app notification. The latest version is always available at{" "}
                  <strong className="text-white">rentals.penmenstudios.com/privacy-policy</strong>. Continued use of
                  our services after changes become effective constitutes acceptance of the revised policy.
                </p>
              </div>

              {/* 13 */}
              <div>
                <h2 className="text-red-500 font-heading text-xl mb-4 tracking-wider">
                  13. CONTACT US
                </h2>
                <p>
                  If you have any questions, concerns, or requests regarding this Privacy Policy, please
                  contact our Data Controller:
                </p>
                <address className="mt-3 not-italic text-zinc-400 space-y-1">
                  <p>
                    <strong className="text-white">Penmen Studios</strong>
                  </p>
                  <p>Hyderabad, Telangana, India</p>
                  <p>
                    Email:{" "}
                    <a href="mailto:admin@penmenstudios.com" className="text-red-500 hover:text-white transition-colors">
                      admin@penmenstudios.com
                    </a>
                  </p>
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
