"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Equipment } from "@/lib/types"
import { getSafeImageUrl } from "@/lib/image-utils"

interface HeroCarouselProps {
  equipment: Equipment[]
}

export default function HeroCarousel({ equipment }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % equipment.length)
  }, [equipment.length])

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + equipment.length) % equipment.length)
  }, [equipment.length])

  const goToSlide = useCallback((slideIndex: number) => {
    setCurrentIndex(slideIndex)
  }, [])

  useEffect(() => {
    if (equipment.length > 1) {
      const interval = setInterval(goToNext, 5000) // Auto-play every 5 seconds
      return () => clearInterval(interval)
    }
  }, [equipment.length, goToNext])

  if (!equipment || equipment.length === 0) {
    return null // Or a placeholder if no equipment is available
  }

  const currentEquipment = equipment[currentIndex]
  const imageUrl = getSafeImageUrl(currentEquipment.main_image_url, 1440, 600)

  return (
    <div className="relative w-full max-w-[1440px] mx-auto overflow-hidden bg-black aspect-[16/9] min-h-[400px] md:aspect-[16/7] lg:aspect-[16/6]">
      <div className="absolute inset-0">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={`${currentEquipment.brand} ${currentEquipment.name}`}
          fill
          priority={true}
          className="object-cover object-center transition-opacity duration-1000 ease-in-out"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 75vw, 1440px"
          quality={85}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
      </div>

      {/* Adjusted top padding (pt-*) and vertical alignment (justify-center md:justify-end) */}
      <div className="relative z-10 flex flex-col items-start justify-center h-full px-4 pb-4 pt-20 sm:px-6 sm:pb-6 sm:pt-24 md:px-10 md:pb-10 md:pt-28 lg:px-16 lg:pb-16 lg:pt-36 md:justify-end">
        <div className="max-w-3xl text-white">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-7xl mb-2 sm:mb-4 leading-tight">
            <span className="bg-red-500 text-white px-2 py-1 text-sm sm:text-base md:text-lg font-bold mb-1 sm:mb-2 inline-block">
              {currentEquipment.brand}
            </span>
            <br /> {/* New line for the item name */}
            <span className="text-white inline-block">{currentEquipment.name}</span>
          </h2>
          {/* Removed the description paragraph */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              asChild
              size="default" // Changed from "lg"
              className="bg-red-500 hover:bg-red-600 text-white rounded-none px-5 py-3 text-sm font-heading" // Adjusted padding and text size
            >
              <Link href={`/equipment/${currentEquipment.id}`}>VIEW DETAILS</Link>
            </Button>
            <Button
              asChild
              size="default" // Changed from "lg"
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-none px-5 py-3 text-sm font-heading bg-transparent" // Adjusted padding and text size
            >
              <Link href="/equipment">VIEW ALL EQUIPMENT</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {equipment.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevious}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full p-1 sm:p-2 z-20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full p-1 sm:p-2 z-20"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
          </Button>
        </>
      )}

      {/* Navigation Dots */}
      {equipment.length > 1 && (
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex space-x-1 sm:space-x-2 z-20">
          {equipment.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full transition-all duration-300 ${
                currentIndex === index ? "bg-red-500 w-4 sm:w-6" : "bg-white/50 hover:bg-white"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
