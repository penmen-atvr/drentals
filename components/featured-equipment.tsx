import { getFeaturedEquipment } from "@/lib/data"
import EquipmentCard from "./equipment-card"
import { unstable_noStore } from "next/cache"

export default async function FeaturedEquipment() {
  // Disable caching for this component
  unstable_noStore()

  const equipment = await getFeaturedEquipment()

  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-heading text-3xl text-red-500 tracking-wide">FEATURED EQUIPMENT</h2>
          <div className="h-px bg-red-500 flex-grow ml-6"></div>
        </div>
        {equipment.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {equipment.map((item, index) => (
              <EquipmentCard
                key={item.id}
                equipment={item}
                // Only prioritize the first 4 items that might be visible in the viewport
                priority={index < 4}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-zinc-400">No featured equipment available.</p>
          </div>
        )}
      </div>
    </section>
  )
}
