import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, Aperture, Mic, Lightbulb, TriangleIcon as Tripod, Package } from "lucide-react"
import type { Category } from "@/lib/types"
import SectionHeader from "@/components/section-header"

const categoryIcons = {
  Cameras: Camera,
  Lenses: Aperture,
  "Tripods & Supports": Tripod,
  Lighting: Lightbulb,
  Audio: Mic,
  Accessories: Package,
}

export default function CategoryList({ categories }: { categories: Category[] }) {
  return (
    <section className="py-16 bg-zinc-900 border-b border-zinc-800">
      <div className="container mx-auto px-4">
        <SectionHeader title="BROWSE BY CATEGORY" />
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2 sm:gap-4">
          {categories.map((category) => {
            const IconComponent = categoryIcons[category.name as keyof typeof categoryIcons] || Package

            return (
              <Link
                key={category.id}
                href={`/equipment?category=${category.id}`}
                className="block h-full transition-transform hover:-translate-y-1 duration-300 group group/card"
              >
                <Card className="h-full w-full aspect-square bg-zinc-950 border-zinc-800 hover:border-red-600 hover:bg-zinc-900 transition-all duration-300 rounded-none relative overflow-hidden">
                  <CardContent className="flex flex-col items-center justify-center p-2 sm:p-6 text-center h-full relative z-10">
                    <IconComponent className="h-6 w-6 sm:h-10 sm:w-10 mb-2 sm:mb-4 text-red-500" />
                    <h3 className="font-heading text-white uppercase tracking-wide text-[9px] sm:text-sm leading-tight">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
