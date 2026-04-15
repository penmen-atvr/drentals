"use client"

import { useState, useEffect } from "react"
import EquipmentCard from "./equipment-card"
import type { Equipment } from "@/lib/types"
import { Component } from "lucide-react"

interface EquipmentGridProps {
  equipment: Equipment[]
  hasNextPage?: boolean
  categoryId?: number
  isKit?: boolean
  searchQuery?: string
  brand?: string
}

export default function EquipmentGrid({ equipment, hasNextPage = false, categoryId, isKit, searchQuery, brand }: EquipmentGridProps) {
  const [items, setItems] = useState<Equipment[]>(equipment)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(hasNextPage)
  const [isLoading, setIsLoading] = useState(false)

  // Reset state if props change (user searched or changed categories)
  useEffect(() => {
    setItems(equipment)
    setPage(1)
    setHasMore(hasNextPage)
  }, [equipment, hasNextPage])

  const loadMore = async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    try {
      const nextPage = page + 1
      let url = `/api/equipment?page=${nextPage}&limit=12`
      if (categoryId) url += `&categoryId=${categoryId}`
      if (isKit) url += `&isKit=true`
      if (searchQuery) url += `&q=${encodeURIComponent(searchQuery)}`
      if (brand) url += `&brand=${encodeURIComponent(brand)}`

      const res = await fetch(url)
      if (!res.ok) throw new Error("Failed to fetch")
      const result = await res.json()

      setItems(prev => [...prev, ...result.data])
      setHasMore(result.hasNextPage)
      setPage(nextPage)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center border border-zinc-800/50 rounded-lg bg-zinc-900/20 backdrop-blur-sm">
        <Component className="w-16 h-16 text-zinc-700 mb-6" />
        <h3 className="text-2xl font-heading text-red-500 uppercase tracking-wide mb-3">No matching gear found</h3>
        <p className="text-zinc-500 max-w-md mx-auto">
          We couldn't track down any cameras or accessories matching your exact filters. Try tweaking your search query or exploring other categories.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-10">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {items.map((item) => (
          <EquipmentCard key={`${item.id}-${Math.random()}`} equipment={item} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="group relative overflow-hidden bg-zinc-900 border border-zinc-800 px-8 py-3 rounded-full flex items-center justify-center transition-all hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
            <span className="relative z-10 font-heading tracking-wider uppercase text-zinc-300 group-hover:text-red-500 transition-colors text-sm">
              {isLoading ? "Loading..." : "Load More Gear"}
            </span>
          </button>
        </div>
      )}
    </div>
  )
}
