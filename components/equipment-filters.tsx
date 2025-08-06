"use client"

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Category } from "@/lib/types"
import { createCleanUrl } from "@/lib/navigation-utils"

export default function EquipmentFilters({
  categories,
  selectedCategory,
}: {
  categories: Category[]
  selectedCategory?: number
}) {
  const router = useRouter()
  const pathname = usePathname()

  const handleCategoryChange = (categoryId?: number) => {
    // Create a clean URL without unnecessary parameters
    const url = categoryId ? createCleanUrl(pathname, { category: categoryId.toString() }) : pathname

    router.push(url)

    // Scroll to top after navigation
    window.scrollTo(0, 0)
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800 rounded-none">
      <CardHeader className="border-b border-zinc-800">
        <CardTitle className="text-white uppercase tracking-wide text-lg font-heading">Filters</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-heading mb-4 text-white uppercase tracking-wide text-sm">Categories</h3>
            <div className="space-y-2">
              <Button
                variant={!selectedCategory ? "default" : "outline"}
                className={`w-full justify-start rounded-none font-mono ${
                  !selectedCategory ? "bg-red-500 hover:bg-red-600" : "text-zinc-400 hover:text-white border-zinc-700"
                }`}
                onClick={() => handleCategoryChange(undefined)}
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
                  onClick={() => handleCategoryChange(category.id)}
                >
                  {category.name.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
