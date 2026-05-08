"use client"

import { useRouter, usePathname } from "next/navigation"
import EquipmentCard from "./equipment-card"
import type { Equipment } from "@/lib/types"
import { PackageSearch, ChevronLeft, ChevronRight } from "lucide-react"

interface EquipmentGridProps {
  equipment: Equipment[]
  total?: number
  currentPage?: number
  limit?: number
}

export default function EquipmentGrid({ equipment, total, currentPage, limit }: EquipmentGridProps) {
  const router = useRouter()
  const pathname = usePathname()

  if (equipment.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center border border-zinc-800/50 rounded-lg bg-zinc-900/20 backdrop-blur-sm">
        <PackageSearch className="w-16 h-16 text-zinc-700 mb-6" />
        <h3 className="text-2xl font-heading text-red-500 uppercase tracking-wide mb-3">No matching gear found</h3>
        <p className="text-zinc-500 max-w-md mx-auto">
          We couldn&apos;t track down any cameras or accessories matching your exact filters. Try tweaking your search query or exploring other categories.
        </p>
      </div>
    )
  }

  const hasPagination = total !== undefined && limit !== undefined && currentPage !== undefined
  const totalPages = hasPagination ? Math.ceil(total! / limit!) : 0

  const handlePageChange = (newPage: number) => {
    if (!hasPagination || newPage < 1 || newPage > totalPages || newPage === currentPage) return

    const currentParams = new URLSearchParams(window.location.search)
    currentParams.set('page', newPage.toString())
    const newQuery = currentParams.toString()
    const url = newQuery ? `${pathname}?${newQuery}` : pathname
    
    // Push the new URL and scroll to the top of the grid
    router.push(url, { scroll: true })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col space-y-12">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {equipment.map((item) => (
          <EquipmentCard key={item.id} equipment={item} />
        ))}
      </div>

      {hasPagination && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8 border-t border-zinc-800/50">
          <button
            onClick={() => handlePageChange(currentPage! - 1)}
            disabled={currentPage === 1}
            className="p-2 border border-zinc-800 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-1 mx-2">
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNumber = i + 1;
              // Simple logic to show limited pages if there are many
              if (
                totalPages > 7 && 
                pageNumber !== 1 && 
                pageNumber !== totalPages && 
                Math.abs(pageNumber - currentPage!) > 1
              ) {
                // Show ellipsis if there's a gap
                if (pageNumber === 2 || pageNumber === totalPages - 1) {
                  return <span key={pageNumber} className="text-zinc-600 px-1">...</span>
                }
                return null;
              }

              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`w-10 h-10 flex items-center justify-center font-mono text-sm rounded-md transition-colors ${
                    currentPage! === pageNumber 
                      ? "bg-red-500 text-white border-red-500" 
                      : "border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
                  }`}
                >
                  {pageNumber}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage! + 1)}
            disabled={currentPage === totalPages}
            className="p-2 border border-zinc-800 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Extra breathing room so fast-scrolling users can reach pagination comfortably */}
      <div className="pb-16 md:pb-24" />
    </div>
  )
}
