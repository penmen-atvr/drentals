"use client"

import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import type { Category } from "@/lib/types"

export default function EquipmentFilters({
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

  const [localMinPrice, setLocalMinPrice] = useState(minPrice?.toString() || "")
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice?.toString() || "")

  useEffect(() => {
    setLocalMinPrice(minPrice?.toString() || "")
    setLocalMaxPrice(maxPrice?.toString() || "")
  }, [minPrice, maxPrice])

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
    <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-1 pb-4 custom-scrollbar">
      <Card className="bg-zinc-900 border-zinc-800 rounded-none">
        <CardHeader className="border-b border-zinc-800 py-3 px-4 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-white uppercase tracking-wide text-sm font-heading">Filters</CardTitle>
          {hasActiveFilters && (
            <button 
              onClick={clearAllFilters}
              className="text-[10px] text-red-500 hover:text-red-400 font-mono tracking-wider transition-colors"
            >
              CLEAR ALL
            </button>
          )}
        </CardHeader>
        <CardContent className="pt-4 px-3">
          <div className="space-y-5">
            
            {/* Sort By */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-heading text-white uppercase tracking-wide text-xs underline decoration-red-500 underline-offset-4">Sort By</h3>
                {sort && sort !== "none" && (
                  <button onClick={() => handleFilterChange({ sort: null })} className="text-[9px] text-zinc-500 hover:text-zinc-300 font-mono uppercase">Clear</button>
                )}
              </div>
              <Select value={sort || "none"} onValueChange={(val) => handleFilterChange({ sort: val === "none" ? null : val })}>
                <SelectTrigger className="w-full bg-zinc-950 border-zinc-800 text-zinc-300 rounded-none font-mono text-xs h-8">
                  <SelectValue placeholder="Sort order" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-zinc-800 rounded-none">
                  <SelectItem value="none" className="font-mono text-xs focus:bg-zinc-800 focus:text-white cursor-pointer">Default</SelectItem>
                  <SelectItem value="name_asc" className="font-mono text-xs focus:bg-zinc-800 focus:text-white cursor-pointer">Name: A to Z</SelectItem>
                  <SelectItem value="price_asc" className="font-mono text-xs focus:bg-zinc-800 focus:text-white cursor-pointer">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc" className="font-mono text-xs focus:bg-zinc-800 focus:text-white cursor-pointer">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Type */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-heading text-white uppercase tracking-wide text-xs underline decoration-red-500 underline-offset-4">View Type</h3>
                {isKitOnly && (
                  <button onClick={() => handleFilterChange({ kit: null })} className="text-[9px] text-zinc-500 hover:text-zinc-300 font-mono uppercase">Clear</button>
                )}
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                <Button
                  size="sm"
                  variant={!isKitOnly ? "default" : "outline"}
                  className={`w-full justify-start rounded-none font-mono text-xs h-7 ${
                    !isKitOnly ? "bg-red-500 hover:bg-red-600" : "text-zinc-400 hover:text-white border-zinc-700 hover:border-red-500 hover:bg-zinc-800"
                  }`}
                  onClick={() => handleFilterChange({ kit: null })}
                >
                  ALL EQUIPMENT
                </Button>
                <Button
                  size="sm"
                  variant={isKitOnly ? "default" : "outline"}
                  className={`w-full justify-start rounded-none font-mono text-xs h-7 ${
                    isKitOnly ? "bg-purple-600 hover:bg-purple-700 shadow-md" : "text-zinc-400 hover:text-white border-zinc-700 hover:border-purple-500 hover:bg-zinc-800"
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
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-heading text-white uppercase tracking-wide text-xs underline decoration-red-500 underline-offset-4">Brand</h3>
                  {selectedBrand && selectedBrand !== "all" && (
                    <button onClick={() => handleFilterChange({ brand: null })} className="text-[9px] text-zinc-500 hover:text-zinc-300 font-mono uppercase">Clear</button>
                  )}
                </div>
                <Select value={selectedBrand || "all"} onValueChange={(val) => handleFilterChange({ brand: val === "all" ? null : val })}>
                  <SelectTrigger className="w-full bg-zinc-950 border-zinc-800 text-zinc-300 rounded-none font-mono text-xs h-8">
                    <SelectValue placeholder="Select Brand" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-950 border-zinc-800 rounded-none max-h-60">
                    <SelectItem value="all" className="font-mono text-xs focus:bg-zinc-800 focus:text-white cursor-pointer">All Brands</SelectItem>
                    {brands.map((b) => (
                      <SelectItem key={b} value={b} className="font-mono text-xs focus:bg-zinc-800 focus:text-white cursor-pointer">
                        {b.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Price Range */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-heading text-white uppercase tracking-wide text-xs underline decoration-red-500 underline-offset-4">Daily Rate (₹)</h3>
                {(minPrice !== undefined || maxPrice !== undefined) && (
                  <button onClick={() => { setLocalMinPrice(""); setLocalMaxPrice(""); handleFilterChange({ minPrice: null, maxPrice: null }) }} className="text-[9px] text-zinc-500 hover:text-zinc-300 font-mono uppercase">Clear</button>
                )}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Input 
                  type="number" 
                  placeholder="Min" 
                  value={localMinPrice}
                  onChange={(e) => setLocalMinPrice(e.target.value)}
                  className="bg-zinc-950 border-zinc-800 rounded-none text-zinc-300 font-mono text-xs h-8"
                />
                <span className="text-zinc-500 text-xs">–</span>
                <Input 
                  type="number" 
                  placeholder="Max" 
                  value={localMaxPrice}
                  onChange={(e) => setLocalMaxPrice(e.target.value)}
                  className="bg-zinc-950 border-zinc-800 rounded-none text-zinc-300 font-mono text-xs h-8"
                />
              </div>
              <Button 
                size="sm"
                onClick={applyPriceFilter}
                className="w-full rounded-none font-mono text-xs bg-zinc-800 hover:bg-zinc-700 text-white h-7"
              >
                APPLY PRICE
              </Button>
            </div>

            {/* Categories */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-heading text-white uppercase tracking-wide text-xs underline decoration-red-500 underline-offset-4">Categories</h3>
                {selectedCategory && (
                  <button onClick={() => handleFilterChange({ categoryId: null })} className="text-[9px] text-zinc-500 hover:text-zinc-300 font-mono uppercase">Clear</button>
                )}
              </div>
              <div className="space-y-1.5">
                <Button
                  size="sm"
                  variant={!selectedCategory ? "default" : "outline"}
                  className={`w-full justify-start rounded-none font-mono text-xs h-7 ${
                    !selectedCategory ? "bg-red-500 hover:bg-red-600" : "text-zinc-400 hover:text-white border-zinc-700"
                  }`}
                  onClick={() => handleFilterChange({ categoryId: null })}
                >
                  ALL CATEGORIES
                </Button>
                {categories.map((category) => (
                  <Button
                    size="sm"
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    className={`w-full justify-start rounded-none font-mono text-xs h-7 ${
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
        </CardContent>
      </Card>
    </div>
  )
}
