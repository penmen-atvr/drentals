import { getAllBrands } from "@/lib/data"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { unstable_noStore } from "next/cache"
import Breadcrumb from "@/components/breadcrumb"
import { generateMetadata } from "@/lib/seo-config"
import type { Metadata } from "next"
import PageHeader from "@/components/page-header"


export const metadata: Metadata = generateMetadata({
  title: "Equipment Brands",
  description:
    "Explore our collection of professional cinema equipment from top brands like RED, ARRI, Sony, Canon, and more available for rent in Hyderabad.",
  keywords: [
    "RED camera rental",
    "ARRI camera rental",
    "Sony camera rental",
    "Canon camera rental",
    "Blackmagic camera rental",
    "cinema equipment brands",
  ],
  path: "/brands",
  ogTitle: "Professional Cinema Equipment Brands | D'RENTALS",
  ogDescription:
    "Discover premium cinema equipment from leading brands like RED, ARRI, Sony, Canon, and more available for rent at D'RENTALS.",
})

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function BrandsPage() {
  unstable_noStore()

  const brands = await getAllBrands()

  return (
    <>
      <div className="bg-zinc-950 min-h-screen">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb items={[{ label: "Brands" }]} />

          <PageHeader
            label="EQUIPMENT BRANDS"
            title={<>BROWSE BY <span className="text-red-500">BRAND</span></>}
            description="Explore our collection of professional cinema equipment from industry-leading manufacturers, carefully selected for quality and performance."
          />

          <div className="py-16">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {brands.map((brand) => (
                <Link
                  key={brand}
                  href={`/brands/${encodeURIComponent(brand.toLowerCase())}`}
                  className="transition-transform hover:-translate-y-1 duration-300"
                >
                  <Card className="h-full bg-zinc-900 border-zinc-800 hover:border-red-500 transition-colors rounded-none">
                    <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
                      <h3 className="font-heading text-white uppercase tracking-wide">{brand}</h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

