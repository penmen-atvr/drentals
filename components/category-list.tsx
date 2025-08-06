import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, Aperture, Mic, Lightbulb, TriangleIcon as Tripod, Package } from "lucide-react"
import type { Category } from "@/lib/types"

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
    <section className="py-16 bg-zinc-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-heading text-3xl text-red-500 tracking-wide">BROWSE BY CATEGORY</h2>
          <div className="h-px bg-red-500 flex-grow ml-6"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => {
            const IconComponent = categoryIcons[category.name as keyof typeof categoryIcons] || Package

            return (
              <Link
                key={category.id}
                href={`/equipment?category=${category.id}`}
                className="transition-transform hover:-translate-y-1 duration-300"
              >
                <Card className="h-full bg-zinc-800 border-zinc-700 hover:border-red-500 transition-colors rounded-none">
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
                    <IconComponent className="h-10 w-10 mb-4 text-red-500" />
                    <h3 className="font-heading text-white uppercase tracking-wide text-sm">{category.name}</h3>
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
