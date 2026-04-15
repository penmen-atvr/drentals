import { getCategories, getEquipmentPaginated } from "@/lib/data"
import EquipmentGrid from "@/components/equipment-grid"
import EquipmentFilters from "@/components/equipment-filters"
import MobileCategoryDropdown from "@/components/mobile-category-dropdown"
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
  searchParams: { category?: string; kit?: string; q?: string }
}) {
  unstable_noStore()

  const categories = await getCategories()
  const categoryId = searchParams.category ? Number.parseInt(searchParams.category) : undefined
  const isKit = searchParams.kit === 'true'
  const searchQuery = searchParams.q || undefined

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

            {/* Mobile Category Dropdown - Only visible on mobile */}
            <MobileCategoryDropdown categories={categories} selectedCategory={categoryId} />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Desktop Sidebar Filters - Hidden on mobile */}
              <div className="hidden lg:block lg:col-span-1">
                <EquipmentFilters categories={categories} selectedCategory={categoryId} isKitOnly={isKit} />
              </div>

              <div className="lg:col-span-3">
                <Suspense fallback={<EquipmentSkeleton />} key={`${categoryId}-${isKit}-${searchQuery}`}>
                  <EquipmentList categoryId={categoryId} isKit={isKit} searchQuery={searchQuery} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

async function EquipmentList({ categoryId, isKit, searchQuery }: { categoryId?: number, isKit?: boolean, searchQuery?: string }) {
  unstable_noStore()

  const result = await getEquipmentPaginated({ categoryId, isKit, searchQuery, page: 1, limit: 12 })
  const hasNextPage = result.total > 12

  return <EquipmentGrid 
    equipment={result.data} 
    hasNextPage={hasNextPage} 
    categoryId={categoryId} 
    isKit={isKit} 
    searchQuery={searchQuery} 
  />
}

