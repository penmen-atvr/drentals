"use client"

import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import type { Category } from "@/lib/types"
import { SlidersHorizontal, X } from "lucide-react"

export default function MobileFilters({
  categories,
  brands,
  selectedCategory,
  isKitOnly,
  selectedBrand,
  minPrice,
  maxPrice,
  sort,
}: {
  categories: Category[]
  brands: string[]
  selectedCategory?: number
  isKitOnly?: boolean
  selectedBrand?: string
  minPrice?: number
  maxPrice?: number
  sort?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const [localMinPrice, setLocalMinPrice] = useState(minPrice?.toString() || "")
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice?.toString() || "")

  useEffect(() => {
    setLocalMinPrice(minPrice?.toString() || "")
    setLocalMaxPrice(maxPrice?.toString() || "")
  }, [minPrice, maxPrice])

  // Prevent background scrolling when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      document.documentElement.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
      document.documentElement.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
      document.documentElement.style.overflow = ""
    }
  }, [isOpen])

  const handleFilterChange = (params: { 
    categoryId?: number | null; 
    kit?: boolean | null;
    brand?: string | null;
    minPrice?: number | null;
    maxPrice?: number | null;
    sort?: string | null;
  }) => {
    const currentParams = new URLSearchParams(window.location.search)
    
    // Always reset to page 1 when filters change
    currentParams.delete('page')

    if (params.categoryId !== undefined) {
      if (params.categoryId !== null && params.categoryId !== 0) currentParams.set('category', params.categoryId.toString())
      else currentParams.delete('category')
    }
    
    if (params.kit !== undefined) {
      if (params.kit !== null) currentParams.set('kit', params.kit.toString())
      else currentParams.delete('kit')
    }

    if (params.brand !== undefined) {
      if (params.brand !== null && params.brand !== "all") currentParams.set('brand', params.brand)
      else currentParams.delete('brand')
    }

    if (params.minPrice !== undefined) {
      if (params.minPrice !== null && !isNaN(params.minPrice)) currentParams.set('minPrice', params.minPrice.toString())
      else currentParams.delete('minPrice')
    }

    if (params.maxPrice !== undefined) {
      if (params.maxPrice !== null && !isNaN(params.maxPrice)) currentParams.set('maxPrice', params.maxPrice.toString())
      else currentParams.delete('maxPrice')
    }

    if (params.sort !== undefined) {
      if (params.sort !== null && params.sort !== "none") currentParams.set('sort', params.sort)
      else currentParams.delete('sort')
    }

    const newQuery = currentParams.toString()
    const url = newQuery ? `${pathname}?${newQuery}` : pathname

    router.push(url, { scroll: false })
  }

  const applyPriceFilter = () => {
    const min = localMinPrice ? parseInt(localMinPrice) : null
    const max = localMaxPrice ? parseInt(localMaxPrice) : null
    handleFilterChange({ minPrice: min, maxPrice: max })
  }

  const clearAllFilters = () => {
    setLocalMinPrice("")
    setLocalMaxPrice("")
    router.push(pathname, { scroll: false })
  }

  const hasActiveFilters = selectedCategory || isKitOnly || selectedBrand || minPrice || maxPrice || sort

  return (
    <div className="lg:hidden mb-6">
      {/* Trigger Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full bg-zinc-900 border border-zinc-800 text-white font-heading py-6 rounded-none flex items-center justify-between"
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5" />
          FILTERS & SORT
        </span>
        
        {/* Badge to show active filters count */}
        {hasActiveFilters && (
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">Active</span>
        )}
      </Button>

      {/* Overlay Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-[100] transition-opacity" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-[300px] max-w-[85vw] bg-zinc-950 border-l border-zinc-900 z-[110] transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <h2 className="font-heading text-lg text-white uppercase tracking-wide">Filters</h2>
            {hasActiveFilters && (
              <button 
                onClick={clearAllFilters}
                className="text-xs text-red-500 hover:text-red-400 font-mono tracking-wider transition-colors"
              >
                CLEAR ALL
              </button>
            )}
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 text-zinc-400 hover:text-white transition-colors bg-zinc-900 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-8 pb-32 custom-scrollbar">
            {/* Sort By */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading text-white uppercase tracking-wide text-sm underline decoration-red-500 underline-offset-8">Sort By</h3>
                {sort && sort !== "none" && (
                  <button onClick={() => handleFilterChange({ sort: null })} className="text-[10px] text-zinc-500 hover:text-zinc-300 font-mono uppercase">Clear</button>
                )}
              </div>
              <Select value={sort || "none"} onValueChange={(val) => handleFilterChange({ sort: val === "none" ? null : val })}>
                <SelectTrigger className="w-full bg-zinc-900 border-zinc-800 text-zinc-300 rounded-none font-mono text-sm h-10">
                  <SelectValue placeholder="Sort order" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-zinc-800 rounded-none z-[120]">
                  <SelectItem value="none" className="font-mono text-sm focus:bg-zinc-800">Default</SelectItem>
                  <SelectItem value="name_asc" className="font-mono text-sm focus:bg-zinc-800">Name: A to Z</SelectItem>
                  <SelectItem value="price_asc" className="font-mono text-sm focus:bg-zinc-800">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc" className="font-mono text-sm focus:bg-zinc-800">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Type */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading text-white uppercase tracking-wide text-sm underline decoration-red-500 underline-offset-8">View Type</h3>
                {isKitOnly && (
                  <button onClick={() => handleFilterChange({ kit: null })} className="text-[10px] text-zinc-500 hover:text-zinc-300 font-mono uppercase">Clear</button>
                )}
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant={!isKitOnly ? "default" : "outline"}
                  className={`w-full justify-start rounded-none font-mono ${
                    !isKitOnly ? "bg-red-500 hover:bg-red-600" : "text-zinc-400 hover:text-white border-zinc-700 hover:border-red-500 hover:bg-zinc-900"
                  }`}
                  onClick={() => handleFilterChange({ kit: null })}
                >
                  ALL EQUIPMENT
                </Button>
                <Button
                  variant={isKitOnly ? "default" : "outline"}
                  className={`w-full justify-start rounded-none font-mono ${
                    isKitOnly ? "bg-purple-600 hover:bg-purple-700 shadow-md" : "text-zinc-400 hover:text-white border-zinc-700 hover:border-purple-500 hover:bg-zinc-900"
                  }`}
                  onClick={() => handleFilterChange({ kit: true })}
                >
                  KITS & BUNDLES
                </Button>
              </div>
            </div>

            {/* Brands */}
            {brands.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-heading text-white uppercase tracking-wide text-sm underline decoration-red-500 underline-offset-8">Brand</h3>
                  {selectedBrand && selectedBrand !== "all" && (
                    <button onClick={() => handleFilterChange({ brand: null })} className="text-[10px] text-zinc-500 hover:text-zinc-300 font-mono uppercase">Clear</button>
                  )}
                </div>
                <Select value={selectedBrand || "all"} onValueChange={(val) => handleFilterChange({ brand: val === "all" ? null : val })}>
                  <SelectTrigger className="w-full bg-zinc-900 border-zinc-800 text-zinc-300 rounded-none font-mono text-sm h-10">
                    <SelectValue placeholder="Select Brand" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-950 border-zinc-800 rounded-none z-[120] max-h-60">
                    <SelectItem value="all" className="font-mono text-sm focus:bg-zinc-800">All Brands</SelectItem>
                    {brands.map((b) => (
                      <SelectItem key={b} value={b} className="font-mono text-sm focus:bg-zinc-800">
                        {b.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Price Range */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading text-white uppercase tracking-wide text-sm underline decoration-red-500 underline-offset-8">Daily Rate (₹)</h3>
                {(minPrice !== undefined || maxPrice !== undefined) && (
                  <button onClick={() => { setLocalMinPrice(""); setLocalMaxPrice(""); handleFilterChange({ minPrice: null, maxPrice: null }) }} className="text-[10px] text-zinc-500 hover:text-zinc-300 font-mono uppercase">Clear</button>
                )}
              </div>
              <div className="flex items-center gap-2 mb-3">
                <Input 
                  type="number" 
                  placeholder="Min" 
                  value={localMinPrice}
                  onChange={(e) => setLocalMinPrice(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 rounded-none text-zinc-300 font-mono text-sm h-10"
                />
                <span className="text-zinc-500">-</span>
                <Input 
                  type="number" 
                  placeholder="Max" 
                  value={localMaxPrice}
                  onChange={(e) => setLocalMaxPrice(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 rounded-none text-zinc-300 font-mono text-sm h-10"
                />
              </div>
              <Button 
                onClick={applyPriceFilter}
                className="w-full rounded-none font-mono bg-zinc-800 hover:bg-zinc-700 text-white h-9"
              >
                APPLY PRICE
              </Button>
            </div>

            {/* Categories */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading text-white uppercase tracking-wide text-sm underline decoration-red-500 underline-offset-8">Categories</h3>
                {selectedCategory && (
                  <button onClick={() => handleFilterChange({ categoryId: null })} className="text-[10px] text-zinc-500 hover:text-zinc-300 font-mono uppercase">Clear</button>
                )}
              </div>
              <div className="space-y-2">
                <Button
                  variant={!selectedCategory ? "default" : "outline"}
                  className={`w-full justify-start rounded-none font-mono ${
                    !selectedCategory ? "bg-red-500 hover:bg-red-600" : "text-zinc-400 hover:text-white border-zinc-700"
                  }`}
                  onClick={() => handleFilterChange({ categoryId: null })}
                >
                  ALL CATEGORIES
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    className={`w-full justify-start rounded-none font-mono ${
                      selectedCategory === category.id
                        ? "bg-red-500 hover:bg-red-600"
                        : "text-zinc-400 hover:text-white border-zinc-700"
                    }`}
                    onClick={() => handleFilterChange({ categoryId: category.id })}
                  >
                    {category.name.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>
        </div>

        {/* Apply/Close Bar at Bottom */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950">
          <Button onClick={() => setIsOpen(false)} className="w-full bg-red-500 hover:bg-red-600 text-white font-mono rounded-none h-12">
            VIEW RESULTS
          </Button>
        </div>
      </div>
    </div>
  )
}
