"use client"

import Image from "next/image"
import { useState } from "react"
import { Camera } from "lucide-react"

interface SafeImageProps {
  src: string
  alt: string
  fill?: boolean
  priority?: boolean
  className?: string
  sizes?: string
  width?: number
  height?: number
  quality?: number
}

export default function SafeImage({
  src,
  alt,
  fill = false,
  priority = false,
  className = "",
  sizes,
  width,
  height,
  quality = 80,
}: SafeImageProps) {
  const [error, setError] = useState(false)

  // Default sizes if not provided
  const defaultSizes = fill ? "(max-width: 768px) 100vw, 50vw" : undefined

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-zinc-800 ${fill ? "w-full h-full" : ""} ${className}`}>
        <Camera className="h-16 w-16 text-zinc-600" aria-hidden="true" />
        <span className="sr-only">{alt}</span>
      </div>
    )
  }

  return (
    <Image
      src={src || "/placeholder.svg"}
      alt={alt}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      className={className}
      onError={() => setError(true)}
      priority={priority}
      sizes={sizes || defaultSizes}
      quality={quality}
      loading={priority ? "eager" : "lazy"}
    />
  )
}
