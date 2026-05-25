"use client"

import { useState, useEffect } from "react"
import { ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Perform initial client-side check
    setIsVisible(window.scrollY > 300)
    setIsMobile(window.innerWidth < 768)

    const handleScroll = () => {
      setIsVisible(window.scrollY > 300)
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", handleResize)
    
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "fixed z-[60] p-3 bg-zinc-900 border border-zinc-800 text-red-500 transition-all duration-500 rounded-none shadow-float",
        "right-6 md:right-[88px]",
        "hover:bg-red-500 hover:text-white hover:border-red-500",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0 pointer-events-none"
      )}
      style={{
        bottom: isMobile ? "calc(5rem + env(safe-area-inset-bottom))" : "1.5rem"
      }}
      aria-label="Back to top"
    >
      <ArrowUp className="h-5 w-5" />
      <div className="absolute -bottom-1 -left-1 w-2 h-2 border-l border-b border-red-500" />
      <div className="absolute -top-1 -right-1 w-2 h-2 border-r border-t border-red-500" />
    </button>
  )
}
