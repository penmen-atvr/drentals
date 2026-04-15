import type { Metadata, Viewport } from "next"
import { Award, Users, Clock, MapPin, Mail, Shield } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import SafeImage from "@/components/safe-image"
import Breadcrumb from "@/components/breadcrumb"
import { generateMetadata, generateViewport } from "@/lib/seo-config"
import PageHeader from "@/components/page-header"
import Link from "next/link"

export const viewport: Viewport = generateViewport()

export const metadata: Metadata = generateMetadata({
  title: "About Us | Camera Rental Services in Hyderabad",
  description:
    "Learn about D'RENTALS by Penmen Studios and our mission to provide professional cinema equipment, DSLRs, 4K cameras, and accessories for filmmakers and production companies in Hyderabad, Kukatpally, and Dilsukhnagar.",
  keywords: [
    "camera rental company hyderabad",
    "dslr camera rentals in hyderabad",
    "red camera rental hyderabad",
    "gopro rental in hyderabad",
    "camera equipment rental in hyderabad",
    "film production services",
    "Penmen Studios",
    "Hyderabad film equipment",
    "camera rental kukatpally",
    "camera rental in dilsukhnagar",
  ],
  path: "/about",
  ogTitle: "About D'RENTALS | Professional Camera Equipment Provider in Hyderabad",
  ogDescription:
    "Discover the story behind D'RENTALS by Penmen Studios and our commitment to providing top-quality cinema and DSLR camera equipment for filmmakers in Hyderabad, India.",
})

export default function AboutPage() {
  return (
    <>
      <div className="bg-zinc-950 min-h-screen">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb items={[{ label: "About" }]} />

          <PageHeader
            label="ABOUT US"
            title={<>THE <span className="text-red-500">D&apos;RENTALS</span> STORY</>}
          />

          <div className="py-16">
            {/* Mission Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="aspect-[4/3] relative rounded-none overflow-hidden border border-zinc-800 bg-zinc-800">
                  <SafeImage
                    src="https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?w=800&auto=format&fit=crop"
                    alt="Professional cinema camera equipment from D'RENTALS by Penmen Studios"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div>
                <h2 className="font-heading text-3xl text-white mb-6 tracking-wide">OUR MISSION</h2>
                <p className="text-zinc-300 mb-6 font-body">
                  D&apos;RENTALS by Penmen Studios was established with a clear vision: to provide filmmakers and content
                  creators with access to professional-grade cinema equipment without the prohibitive costs of
                  ownership.
                </p>
                <p className="text-zinc-300 mb-6 font-body">
                  Our team of industry professionals understands the technical and creative demands of modern
                  production. We curate our inventory to include the latest and most reliable equipment, ensuring that
                  your vision is never compromised by technical limitations.
                </p>
                <p className="text-zinc-300 font-body">
                  Based in Hyderabad, we serve production teams across India with our extensive catalog of cameras,
                  lenses, lighting, and audio equipment. Our military-grade attention to detail ensures that every piece
                  of equipment is meticulously maintained and tested before each rental.
                </p>
              </div>
            </div>

            <Separator className="my-16 bg-zinc-800" />

            {/* About the App Section */}
            <div className="mb-16">
              <h2 className="font-heading text-3xl text-white mb-6 tracking-wide text-center">
                THE D&apos;RENTALS APP
              </h2>
              <p className="text-zinc-300 max-w-3xl mx-auto font-body text-center mb-8">
                The D&apos;RENTALS Android app is your on-the-go companion for browsing our full equipment
                catalog, checking real-time availability, and submitting rental enquiries — all from your
                phone. Available for free on Google Play.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div className="p-5 border border-zinc-800 bg-zinc-900 text-center">
                  <p className="text-red-500 font-heading text-sm tracking-wider mb-2">PLATFORM</p>
                  <p className="text-white font-body">Android (Google Play)</p>
                </div>
                <div className="p-5 border border-zinc-800 bg-zinc-900 text-center">
                  <p className="text-red-500 font-heading text-sm tracking-wider mb-2">DEVELOPER</p>
                  <p className="text-white font-body">Penmen Studios</p>
                </div>
                <div className="p-5 border border-zinc-800 bg-zinc-900 text-center">
                  <p className="text-red-500 font-heading text-sm tracking-wider mb-2">TYPE</p>
                  <p className="text-white font-body">Free — Equipment Discovery</p>
                </div>
              </div>
            </div>

            <Separator className="my-16 bg-zinc-800" />

            {/* Why Choose Section */}
            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl text-white mb-6 tracking-wide">WHY CHOOSE D&apos;RENTALS</h2>
              <p className="text-zinc-300 max-w-3xl mx-auto font-body">
                At D&apos;RENTALS, we combine technical expertise with a passion for filmmaking. Our commitment to quality
                and service sets us apart in the industry.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              <div className="p-6 border border-zinc-800 bg-zinc-900 military-border">
                <div className="flex justify-center mb-4">
                  <Award className="h-12 w-12 text-red-500" />
                </div>
                <h3 className="font-heading text-xl text-white mb-3 text-center">PREMIUM EQUIPMENT</h3>
                <p className="text-zinc-400 text-center font-body">
                  Curated selection of professional-grade cinema equipment from industry-leading manufacturers.
                </p>
              </div>

              <div className="p-6 border border-zinc-800 bg-zinc-900 military-border">
                <div className="flex justify-center mb-4">
                  <Award className="h-12 w-12 text-red-500" />
                </div>
                <h3 className="font-heading text-xl text-white mb-3 text-center">EXPERT SUPPORT</h3>
                <p className="text-zinc-400 text-center font-body">
                  Technical guidance from experienced professionals who understand your production needs.
                </p>
              </div>

              <div className="p-6 border border-zinc-800 bg-zinc-900 military-border">
                <div className="flex justify-center mb-4">
                  <Users className="h-12 w-12 text-red-500" />
                </div>
                <h3 className="font-heading text-xl text-white mb-3 text-center">INDUSTRY EXPERIENCE</h3>
                <p className="text-zinc-400 text-center font-body">
                  Founded by filmmakers for filmmakers, with deep understanding of production workflows.
                </p>
              </div>

              <div className="p-6 border border-zinc-800 bg-zinc-900 military-border">
                <div className="flex justify-center mb-4">
                  <Clock className="h-12 w-12 text-red-500" />
                </div>
                <h3 className="font-heading text-xl text-white mb-3 text-center">FLEXIBLE TERMS</h3>
                <p className="text-zinc-400 text-center font-body">
                  Daily, weekly, and monthly rental options to accommodate projects of any duration.
                </p>
              </div>
            </div>

            <Separator className="my-16 bg-zinc-800" />

            {/* Company Info Section — Required for Play Store */}
            <div className="max-w-3xl mx-auto">
              <h2 className="font-heading text-3xl text-white mb-8 tracking-wide text-center">
                COMPANY INFORMATION
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 border border-zinc-800 bg-zinc-900 space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-white font-heading text-sm tracking-wider mb-1">LOCATION</p>
                      <p className="text-zinc-400 font-body text-sm">
                        Hyderabad, Telangana, India
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-white font-heading text-sm tracking-wider mb-1">EMAIL</p>
                      <a
                        href="mailto:admin@penmenstudios.com"
                        className="text-red-500 hover:text-white transition-colors font-body text-sm"
                      >
                        admin@penmenstudios.com
                      </a>
                    </div>
                  </div>
                </div>
                <div className="p-6 border border-zinc-800 bg-zinc-900 space-y-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-white font-heading text-sm tracking-wider mb-1">LEGAL PAGES</p>
                      <ul className="space-y-1 font-body text-sm">
                        <li>
                          <Link href="/privacy-policy" className="text-red-500 hover:text-white transition-colors">
                            Privacy Policy
                          </Link>
                        </li>
                        <li>
                          <Link href="/terms-conditions" className="text-red-500 hover:text-white transition-colors">
                            Terms &amp; Conditions
                          </Link>
                        </li>
                        <li>
                          <Link href="/return-policy" className="text-red-500 hover:text-white transition-colors">
                            Return &amp; Cancellation Policy
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
