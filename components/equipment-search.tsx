"use client"

import { Search, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useDebounce } from "@/lib/hooks/use-debounce"

export default function EquipmentSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const initialQuery = searchParams.get("q") || ""
  const [query, setQuery] = useState(initialQuery)
  
  // Custom hook usage (assuming we can easily debounce natively if hook doesn't exist)
  // Let's implement an inline debounce effect to assure it functions flawlessly.
  
  const [debouncedQuery, setDebouncedQuery] = useState(query)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 400) // 400ms debounce
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    const currentParams = new URLSearchParams(window.location.search)
    if (debouncedQuery) {
      currentParams.set('q', debouncedQuery)
    } else {
      currentParams.delete('q')
    }
    
    // Only push if the query has actually changed from what is in the URL
    if (debouncedQuery !== (searchParams.get("q") || "")) {
      router.push(`/equipment?${currentParams.toString()}`)
    }
  }, [debouncedQuery, router, searchParams])

  return (
    <div className="relative group max-w-2xl w-full">
      <div className="absolute inset-0 bg-red-500/10 rounded-full blur-xl transition-all duration-500 group-hover:bg-red-500/20 group-hover:blur-2xl" />
      <div className="relative flex items-center bg-zinc-900/80 backdrop-blur-md border border-zinc-800/80 group-hover:border-red-500/50 rounded-full p-2 transition-all duration-300">
        <div className="pl-4 pr-2">
          <Search className="w-5 h-5 text-zinc-400 group-hover:text-red-500 transition-colors" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for cameras, lenses, or specific brands..."
          className="flex-1 bg-transparent border-none text-white placeholder:text-zinc-500 focus:outline-none focus:ring-0 text-base font-body py-2 px-2"
        />
        {query && (
          <button 
            onClick={() => setQuery("")}
            className="p-2 mr-2 bg-zinc-800 hover:bg-red-500/20 hover:text-red-500 text-zinc-400 rounded-full transition-all"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
