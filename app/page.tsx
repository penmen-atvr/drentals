import FeaturedEquipment from "@/components/featured-equipment"
import Hero from "@/components/hero"
import CategoryList from "@/components/category-list"
import HeroCarousel from "@/components/hero-carousel"
import { getDynamicHomeSections, type HomeSection } from "@/lib/dynamic-homepage"
import { unstable_noStore } from "next/cache"
import { generateMetadata } from "@/lib/seo-config"
import type { Metadata } from "next"
import { Award, Users, Clock, Truck } from "lucide-react"
import SectionHeader from "@/components/section-header"
import EquipmentCard from "@/components/equipment-card"
import type { Equipment } from "@/lib/types"

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

  const sections = await getDynamicHomeSections()

  return (
    <>
      <div className="bg-zinc-950 min-h-screen">
        {sections.map((section) => {
          if (section.type === "hero") {
            return <HeroCarousel key={section.id} equipment={section.items as unknown as Equipment[]} />
          }
          
          if (section.type === "category_strip") {
            return <CategoryList key={section.id} categories={section.items as any[]} />
          }
          
          if (section.type === "equipment_carousel" || section.type === "kit_grid") {
            return (
              <section key={section.id} className="py-16 bg-zinc-950 border-b border-zinc-800">
                <div className="container mx-auto px-4">
                  <SectionHeader title={section.title} subtitle={section.subtitle || undefined} />
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                    {section.items.map((item: any, index: number) => (
                      <EquipmentCard
                        key={item.id}
                        equipment={item as Equipment}
                        priority={index < 4}
                      />
                    ))}
                  </div>
                </div>
              </section>
            )
          }

          if (section.type === "brand_strip") {
            // Duplicate array multiple times to ensure seamless infinite scroll
            const marqueeItems = [...section.items, ...section.items, ...section.items, ...section.items]
            
            return (
              <section key={section.id} className="py-20 bg-zinc-950 border-b border-zinc-900 overflow-hidden">
                <div className="container mx-auto px-4 mb-10">
                  <SectionHeader title={section.title} subtitle={section.subtitle || undefined} />
                </div>
                <div className="relative w-full flex overflow-hidden group py-4">
                  {/* Left & Right gradient masks for smooth fade effect */}
                  <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
                  <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />
                  
                  <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
                    {marqueeItems.map((brandObj: any, index: number) => (
                      <div 
                        key={index} 
                        className="mx-4 md:mx-6 px-8 py-5 border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 transition-colors flex items-center justify-center min-w-[220px]"
                      >
                        <span className="text-xl md:text-3xl font-heading text-zinc-500 hover:text-white transition-colors uppercase tracking-widest">
                          {brandObj.brand}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )
          }

          return null
        })}

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
