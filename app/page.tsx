import FeaturedEquipment from "@/components/featured-equipment"
import Hero from "@/components/hero"
import CategoryList from "@/components/category-list"
import HeroCarousel from "@/components/hero-carousel"
import { getCategories, getFeaturedEquipment } from "@/lib/data"
import { unstable_noStore } from "next/cache"
import { generateMetadata } from "@/lib/seo-config"
import type { Metadata } from "next"
import { Award, Users, Clock, Truck } from "lucide-react"
import SectionHeader from "@/components/section-header"
import Script from "next/script"

export const dynamic = "force-dynamic"

export const metadata: Metadata = generateMetadata({
  title: "D'RENTALS - A Cinema Camera Rental Company in Hyderabad",
  description:
    "D'RENTALS is Hyderabad's premier destination for professional cinema and DSLR camera rentals. We offer same-day delivery across the city, featuring industry-standard gear from RED, ARRI, Sony, and Canon.",
  keywords: [
    "camera rental hyderabad",
    "cinema equipment rental",
    "professional dslr rental",
    "film production gear hyderabad",
    "penmen studios rentals",
  ],
  path: "/",
  ogTitle: "D'RENTALS - A Cinema Camera Rental Company in Hyderabad",
  ogDescription:
    "Access top-quality cinema cameras, DSLRs, lenses, and accessories curated by Penmen Studios for industry professionals in Hyderabad, India. Same-day delivery available.",
})

export default async function Home() {
  unstable_noStore()

  const categories = await getCategories()
  const featuredEquipment = await getFeaturedEquipment()

  return (
    <>
      <div className="bg-zinc-950 min-h-screen">
        <HeroCarousel equipment={featuredEquipment} />
        <CategoryList categories={categories} />
        <FeaturedEquipment />
        <Hero />

        {/* Why Choose D'RENTALS Section */}
        <section className="py-16 bg-zinc-900 border-b border-zinc-800">
          <div className="container mx-auto px-4">
            <SectionHeader title="WHY CHOOSE D'RENTALS" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 border-2 border-red-600 bg-zinc-950">
                <div className="flex justify-center mb-4">
                  <Award className="h-12 w-12 text-red-500" />
                </div>
                <h3 className="font-heading text-xl text-white mb-3 text-center">PREMIUM EQUIPMENT</h3>
                <p className="text-zinc-400 text-center font-body">
                  Access a curated selection of professional-grade cinema cameras, lenses, and accessories from top brands.
                </p>
              </div>

              <div className="p-6 border-2 border-red-600 bg-zinc-950">
                <div className="flex justify-center mb-4">
                  <Truck className="h-12 w-12 text-red-500" />
                </div>
                <h3 className="font-heading text-xl text-white mb-3 text-center">CONVENIENT DELIVERY</h3>
                <p className="text-zinc-400 text-center font-body">
                  Enjoy hassle-free delivery and pickup services across Hyderabad, including Kukatpally and Dilsukhnagar.
                </p>
              </div>

              <div className="p-6 border-2 border-red-600 bg-zinc-950">
                <div className="flex justify-center mb-4">
                  <Users className="h-12 w-12 text-red-500" />
                </div>
                <h3 className="font-heading text-xl text-white mb-3 text-center">EXPERT SUPPORT</h3>
                <p className="text-zinc-400 text-center font-body">
                  Benefit from technical guidance and personalized recommendations from our experienced team.
                </p>
              </div>

              <div className="p-6 border-2 border-red-600 bg-zinc-950">
                <div className="flex justify-center mb-4">
                  <Clock className="h-12 w-12 text-red-500" />
                </div>
                <h3 className="font-heading text-xl text-white mb-3 text-center">FLEXIBLE RENTALS</h3>
                <p className="text-zinc-400 text-center font-body">
                  Choose from daily, weekly, or monthly rental options to suit your project&apos;s duration and budget.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
