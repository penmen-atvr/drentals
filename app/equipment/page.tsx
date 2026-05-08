import { getCategories, getEquipmentPaginated, getAllBrands } from "@/lib/data"
import EquipmentGrid from "@/components/equipment-grid"
import EquipmentFilters from "@/components/equipment-filters"
import MobileFilters from "@/components/mobile-filters"
import EquipmentSearch from "@/components/equipment-search"
import { Suspense } from "react"
import { EquipmentSkeleton } from "@/components/skeletons"
import { unstable_noStore } from "next/cache"
import Breadcrumb from "@/components/breadcrumb"
import { generateMetadata } from "@/lib/seo-config"
import CanonicalUrl from "@/components/canonical-url"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = generateMetadata({
  title: "Camera & Equipment Catalog | Rent in Hyderabad",
  description:
    "Browse our extensive collection of professional cinema cameras, DSLRs, 4K cameras, lenses, and audio equipment for rent in Hyderabad. Daily, weekly, and monthly rental options with delivery service available.",
  keywords: [
    "dslr camera rentals in hyderabad",
    "5d camera rent in hyderabad",
    "canon 5d mark iv rent in hyderabad",
    "red camera rental hyderabad",
    "gopro for rent in hyderabad",
    "lens rental in hyderabad",
    "gimbal for rent in hyderabad",
    "camera rentals in hyderabad near me",
    "video camera for rent in hyderabad",
  ],
  path: "/equipment",
  ogTitle: "Professional Camera & Cinema Equipment Catalog | D'RENTALS Hyderabad",
  ogDescription:
    "Explore our comprehensive range of cinema cameras, DSLRs, 4K cameras, lenses, lighting, and audio equipment available for rent in Hyderabad. Find the perfect gear for your production.",
})

export default async function EquipmentPage({
  searchParams,
}: {
  searchParams: { category?: string; kit?: string; q?: string; brand?: string; minPrice?: string; maxPrice?: string; sort?: string; page?: string }
}) {
  unstable_noStore()

  const categories = await getCategories()
  const allBrands = await getAllBrands()
  
  const categoryId = searchParams.category ? Number.parseInt(searchParams.category) : undefined
  const isKit = searchParams.kit === 'true'
  const searchQuery = searchParams.q || undefined
  const brand = searchParams.brand || undefined
  const minPrice = searchParams.minPrice ? Number.parseInt(searchParams.minPrice) : undefined
  const maxPrice = searchParams.maxPrice ? Number.parseInt(searchParams.maxPrice) : undefined
  const sort = searchParams.sort || undefined
  const currentPage = searchParams.page ? Number.parseInt(searchParams.page) : 1

  // Find the selected category name if a category is selected
  const selectedCategory = categoryId ? categories.find((cat) => cat.id === categoryId) : undefined

  return (
    <>
      <div className="bg-zinc-950 min-h-screen">
        {/* Add canonical URL component to ensure filtered pages point to the main equipment page */}
        <CanonicalUrl overridePath="/equipment" />

        <div className="container mx-auto px-4 py-4">
          <Breadcrumb
            items={[{ label: "Equipment" }, ...(selectedCategory ? [{ label: selectedCategory.name }] : [])]}
          />

          <div className="py-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div className="flex items-center">
                <h1 className="text-3xl font-heading text-red-500 tracking-wide uppercase">
                  {searchQuery ? `Results for "${searchQuery}"` : selectedCategory ? selectedCategory.name : "Browse Equipment"}
                </h1>
                <div className="hidden md:block h-px bg-red-500/50 w-16 lg:w-32 ml-6"></div>
              </div>
              <div className="w-full md:w-auto">
                <EquipmentSearch />
              </div>
            </div>

            {/* Mobile Filters - Only visible on mobile */}
            <MobileFilters 
              categories={categories} 
              brands={allBrands}
              selectedCategory={categoryId} 
              isKitOnly={isKit} 
              selectedBrand={brand}
              minPrice={minPrice}
              maxPrice={maxPrice}
              sort={sort}
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Desktop Sidebar Filters - Hidden on mobile */}
              <div className="hidden lg:block lg:col-span-1">
                <EquipmentFilters 
                  categories={categories} 
                  brands={allBrands}
                  selectedCategory={categoryId} 
                  isKitOnly={isKit} 
                  selectedBrand={brand}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  sort={sort}
                />
              </div>

              <div className="lg:col-span-3">
                <Suspense fallback={<EquipmentSkeleton />} key={`${categoryId}-${isKit}-${searchQuery}-${brand}-${minPrice}-${maxPrice}-${sort}-${currentPage}`}>
                  <EquipmentList 
                    categoryId={categoryId} 
                    isKit={isKit} 
                    searchQuery={searchQuery}
                    brand={brand}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    sort={sort}
                    page={currentPage}
                  />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

async function EquipmentList({ 
  categoryId, 
  isKit, 
  searchQuery, 
  brand, 
  minPrice, 
  maxPrice, 
  sort, 
  page = 1 
}: { 
  categoryId?: number, 
  isKit?: boolean, 
  searchQuery?: string,
  brand?: string,
  minPrice?: number,
  maxPrice?: number,
  sort?: string,
  page?: number
}) {
  unstable_noStore()
  
  const limit = 12;
  const result = await getEquipmentPaginated({ categoryId, isKit, searchQuery, brand, minPrice, maxPrice, sort, page, limit })
  
  return <EquipmentGrid 
    equipment={result.data} 
    total={result.total}
    currentPage={page}
    limit={limit}
  />
}

