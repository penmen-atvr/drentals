"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Category } from "@/lib/types"
import { cn } from "@/lib/utils"
import { createCleanUrl } from "@/lib/navigation-utils"

export default function MobileCategoryDropdown({
  categories,
  selectedCategory,
}: {
  categories: Category[]
  selectedCategory?: number
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Find the selected category name or use "All Categories" as default
  const selectedCategoryName = selectedCategory
    ? categories.find((cat) => cat.id === selectedCategory)?.name || "Category"
    : "All Categories"

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const handleCategoryChange = (categoryId?: number) => {
    // Create a clean URL without unnecessary parameters
    const url = categoryId ? createCleanUrl(pathname, { category: categoryId.toString() }) : pathname

    router.push(url)
    setIsOpen(false)

    // Scroll to top after navigation
    window.scrollTo(0, 0)
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="relative lg:hidden mb-6" ref={dropdownRef}>
      <div className="military-border">
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between bg-zinc-900 border-zinc-800 text-white font-heading py-6 rounded-none"
          onClick={toggleDropdown}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span>CATEGORY: {selectedCategoryName.toUpperCase()}</span>
          {isOpen ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
        </Button>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-zinc-900 border-2 border-red-500 shadow-lg rounded-none max-h-60 overflow-auto">
          <div className="py-1">
            <button
              className={cn(
                "w-full text-left px-4 py-3 text-sm font-mono",
                !selectedCategory ? "bg-red-500 text-white" : "text-zinc-400 hover:bg-zinc-800",
              )}
              onClick={() => handleCategoryChange(undefined)}
            >
              ALL CATEGORIES
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                className={cn(
                  "w-full text-left px-4 py-3 text-sm font-mono",
                  selectedCategory === category.id ? "bg-red-500 text-white" : "text-zinc-400 hover:bg-zinc-800",
                )}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
