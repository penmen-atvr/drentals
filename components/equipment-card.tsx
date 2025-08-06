"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import type { Equipment } from "@/lib/types"
import { Camera } from "lucide-react"
import { useState } from "react"
import { getSafeImageUrl } from "@/lib/image-utils"
import { imageSizes } from "@/lib/performance"

export default function EquipmentCard({ equipment, priority = false }: { equipment: Equipment; priority?: boolean }) {
  // Default placeholder for missing images
  const placeholderImage = "/placeholder.svg?height=300&width=400"

  // Ensure image URL is valid
  const imageUrl = getSafeImageUrl(equipment.main_image_url, 400, 300)

  return (
    <Link href={`/equipment/${equipment.id}`} className="block transition-transform hover:-translate-y-1 duration-300">
      <Card className="h-full overflow-hidden bg-zinc-900 border-zinc-800 rounded-none hover:border-red-500 transition-colors">
        <div className="aspect-[4/3] relative overflow-hidden bg-zinc-800">
          {equipment.main_image_url ? (
            <EquipmentCardImage
              src={imageUrl}
              alt={`${equipment.brand} ${equipment.name} - Professional cinema equipment for rent`}
              priority={priority}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Camera className="h-16 w-16 text-zinc-600" aria-hidden="true" />
              <span className="sr-only">{equipment.name} image not available</span>
            </div>
          )}
          {equipment.featured && (
            <Badge className="absolute top-2 right-2 bg-red-500 rounded-none font-heading">FEATURED</Badge>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="bg-transparent border-zinc-700 text-zinc-400 rounded-none font-mono">
              {equipment.brand}
            </Badge>
            <Badge variant="outline" className="bg-transparent border-zinc-700 text-zinc-400 rounded-none font-mono">
              {equipment.condition}
            </Badge>
          </div>
          <h3 className="font-heading text-lg mb-1 line-clamp-1 text-white">{equipment.name}</h3>
          <p className="text-sm text-zinc-400 line-clamp-1 font-mono">{equipment.model}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div>
            <p className="text-sm text-zinc-500 font-mono">DAILY RATE</p>
            <p className="font-heading text-red-400 text-base break-words">{formatCurrency(equipment.daily_rate)}</p>
          </div>
        </CardFooter>
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
