import FeaturedEquipment from "@/components/featured-equipment"
import Hero from "@/components/hero"
import CategoryList from "@/components/category-list"
import HeroCarousel from "@/components/hero-carousel"
import MobileAppPromo from "@/components/mobile-app-promo"
import { getDynamicHomeSections, type HomeSection } from "@/lib/dynamic-homepage"
import { unstable_noStore } from "next/cache"
import Link from "next/link"
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
          
          if (section.type === "equipment_carousel") {
            return (
              <section key={section.id} className="py-24 bg-zinc-950 border-b border-zinc-800">
                <div className="container mx-auto px-4">
                  <SectionHeader title={section.title} subtitle={section.subtitle || undefined} />
                  <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 gap-4 sm:gap-6">
                    {section.items.map((item: any, index: number) => (
                      <div key={item.id} className="min-w-[280px] w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] snap-start shrink-0">
                        <EquipmentCard
                          equipment={item as Equipment}
                          priority={index < 4}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )
          }

          if (section.type === "kit_grid") {
            return (
              <section key={section.id} className="py-24 bg-zinc-950 border-b border-zinc-800">
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
              <section key={section.id} className="py-12 md:py-16 bg-zinc-950 border-y border-zinc-900 overflow-hidden relative">
                {/* Subtle Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
                
                <div className="container mx-auto px-4 mb-8 md:mb-10 relative z-10 flex flex-col items-center text-center">
                  <div className="inline-block mb-3 px-3 py-1 border border-zinc-800 bg-zinc-950/80 backdrop-blur-sm">
                    <span className="text-zinc-400 font-mono text-xs tracking-widest">INDUSTRY STANDARD</span>
                  </div>
                  <h2 className="font-heading text-3xl sm:text-4xl text-white tracking-wide uppercase">
                    {section.title}
                  </h2>
                </div>

                <div className="relative w-full flex flex-col gap-4 md:gap-8 overflow-hidden group py-4">
                  {/* Left & Right gradient masks for smooth fade effect */}
                  <div className="absolute left-0 top-0 bottom-0 w-24 md:w-64 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
                  <div className="absolute right-0 top-0 bottom-0 w-24 md:w-64 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />
                  
                  {/* Row 1: Moving Left */}
                  <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
                    {marqueeItems.map((brandObj: any, index: number) => (
                      <div key={`row1-${index}`} className="flex items-center px-8 md:px-16">
                        <Link href={`/brands/${brandObj.brand.toLowerCase()}`} className="group/brand block">
                          <span className="text-5xl md:text-7xl lg:text-8xl font-heading text-zinc-800 group-hover/brand:text-white transition-all duration-300 uppercase tracking-tighter drop-shadow-sm group-hover/brand:drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                            {brandObj.brand}
                          </span>
                        </Link>
                        <span className="mx-8 md:mx-16 text-zinc-900 text-4xl md:text-6xl font-heading italic opacity-50">/</span>
                      </div>
                    ))}
                  </div>

                  {/* Row 2: Moving Right (reverse) */}
                  <div className="flex w-max animate-marquee-reverse group-hover:[animation-play-state:paused] ml-[-50%]">
                    {[...marqueeItems].reverse().map((brandObj: any, index: number) => (
                      <div key={`row2-${index}`} className="flex items-center px-8 md:px-16">
                        <Link href={`/brands/${brandObj.brand.toLowerCase()}`} className="group/brand block">
                          <span className="text-5xl md:text-7xl lg:text-8xl font-heading text-zinc-800 group-hover/brand:text-red-600 transition-all duration-300 uppercase tracking-tighter drop-shadow-sm group-hover/brand:drop-shadow-[0_0_20px_rgba(220,38,38,0.5)]">
                            {brandObj.brand}
                          </span>
                        </Link>
                        <span className="mx-8 md:mx-16 text-zinc-900 text-4xl md:text-6xl font-heading italic opacity-50">/</span>
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

        <MobileAppPromo />

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
