"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn, formatCurrency, slugify } from "@/lib/utils"
import type { Equipment } from "@/lib/types"
import { Camera, ChevronRight } from "lucide-react"
import { useState } from "react"
import { getSafeImageUrl } from "@/lib/image-utils"
import { imageSizes } from "@/lib/performance"

export default function EquipmentCard({ equipment, priority = false }: { equipment: Equipment; priority?: boolean }) {
  // Ensure image URL is valid
  const imageUrl = getSafeImageUrl(equipment.mainImageUrl, 400, 300)

  return (
    <Link href={`/equipment/${equipment.id}-${slugify(equipment.name)}`} className="block transition-all duration-500 group h-full">
      <Card className={cn(
        "h-full bg-zinc-900 border-zinc-800 rounded-none transition-all duration-500 flex flex-col",
        "hover:border-red-500 group-hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-900",
        equipment.featured && "border-t-2 border-t-red-600"
      )}>
        <div className="relative overflow-hidden bg-zinc-950 aspect-[4/3]">
          {/* Strict image presentation with no transparency fades or opacity shifts */}
          <div className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-105">
            {equipment.mainImageUrl ? (
              <EquipmentCardImage
                src={imageUrl}
                alt={`${equipment.brand} ${equipment.name} ${equipment.model} for rent in Hyderabad`}
                priority={priority}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                <Camera className="h-12 w-12 text-zinc-700" aria-hidden="true" />
              </div>
            )}
          </div>
          
          {/* Solid Badges on the image corners */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-20">
            <Badge className="bg-zinc-950 text-white rounded-none font-mono text-[9px] sm:text-[10px] tracking-widest uppercase border border-zinc-800 shadow-xl">
              {equipment.brand}
            </Badge>
          </div>
          
          <div className="absolute top-2 right-2 flex flex-col items-end gap-1.5 z-20">
            {equipment.featured && (
              <Badge className="bg-red-600 rounded-none font-heading px-2 py-0.5 border-none text-[9px] sm:text-[10px]">FEATURED</Badge>
            )}
            {equipment.isKit && (
              <Badge className="bg-purple-600 rounded-none font-heading px-2 py-0.5 border-none text-[9px] sm:text-[10px]">BUNDLE</Badge>
            )}
            <Badge className="bg-zinc-800 rounded-none font-mono text-[8px] sm:text-[9px] text-zinc-300 border-none px-2 py-0.5 uppercase tracking-wider">
              {equipment.condition}
            </Badge>
          </div>
        </div>
        
        {/* Strictly solid content area beneath the image */}
        <CardContent className="p-3 sm:p-4 flex flex-col flex-grow bg-zinc-900 relative">
          <div className="mb-4">
            <h3 className="font-heading text-sm sm:text-base md:text-lg line-clamp-2 text-white group-hover:text-red-400 transition-colors duration-300 leading-tight mb-1">
              {equipment.name}
            </h3>
            <p className="text-[10px] sm:text-xs text-zinc-500 line-clamp-1 font-mono uppercase tracking-widest">{equipment.model}</p>
          </div>
          
          <div className="mt-auto pt-3 border-t border-zinc-800 flex items-end justify-between group-hover:border-red-900 transition-colors duration-300">
             <div className="flex flex-col">
                <span className="text-[8px] sm:text-[9px] text-red-500 font-mono tracking-widest uppercase mb-0.5 font-bold">DAILY RATE</span>
                <span className="font-heading text-lg sm:text-xl text-white tracking-tight drop-shadow-md">{formatCurrency(equipment.dailyRate)}</span>
             </div>
             <ChevronRight className="h-5 w-5 text-zinc-600 group-hover:text-red-500 group-hover:translate-x-1 transition-all duration-300 mb-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

// Component to handle image errors
function EquipmentCardImage({ src, alt, priority = false }: { src: string; alt: string; priority?: boolean }) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Camera className="h-16 w-16 text-zinc-600" aria-hidden="true" />
        <span className="sr-only">{alt}</span>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        fill
        className="object-cover"
        onError={() => setError(true)}
        priority={priority}
        sizes={imageSizes.equipmentCard.sizes}
        quality={80}
      />
    </div>
  )
}
