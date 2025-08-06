import CanonicalUrl from "@/components/canonical-url"
import type { Metadata } from "next"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Privacy Policy • d'Rentals Camera Hire",
  description:
    "Read how d'Rentals collects, uses and protects your personal information when you rent cameras and equipment with us.",
}

export default function PrivacyPolicyPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-10 space-y-6">
      <CanonicalUrl />
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <Separator />

      <section className="prose prose-invert">
        <p>
          Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose and safeguard your
          information when you visit our website or rent equipment through d&apos;Rentals.
        </p>

        <h2>Information We Collect</h2>
        <ul>
          <li>
            <strong>Personal&nbsp;Data</strong> (name, email, phone) you provide when creating an account or placing an
            order.
          </li>
          <li>
            <strong>Usage&nbsp;Data</strong> (IP address, browser type, pages visited) collected automatically to help
            us improve the site.
          </li>
        </ul>

        <h2>How We Use Information</h2>
        <ol>
          <li>Process and manage equipment rentals and payments.</li>
          <li>Respond to enquiries and provide customer support.</li>
          <li>Improve our products, services and website experience.</li>
          <li>Send transactional and—if you opt-in—promotional messages.</li>
        </ol>

        <h2>Sharing of Information</h2>
        <p>
          We do <em>not</em> sell your data. Limited sharing occurs with trusted providers (payment gateways, delivery
          partners, analytics tools) solely to fulfil orders or improve our service. All partners are bound by
          confidentiality obligations.
        </p>

        <h2>Your Rights</h2>
        <p>
          You may access, amend or delete your personal data by emailing&nbsp;
          <a href="mailto:admin@penmenstudios.com">admin@penmenstudios.com</a>.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may revise this Privacy Policy periodically. The latest version is always available on this page and is
          effective immediately upon posting.
        </p>

        <p className="text-sm text-muted-foreground">Last updated: 23&nbsp;July&nbsp;2025</p>
      </section>
    </main>
  )
}
