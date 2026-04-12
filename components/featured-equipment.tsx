import { getFeaturedEquipment } from "@/lib/data"
import EquipmentCard from "./equipment-card"
import { unstable_noStore } from "next/cache"
import SectionHeader from "@/components/section-header"

export default async function FeaturedEquipment() {
  unstable_noStore()
  const equipment = await getFeaturedEquipment()

  return (
    <section className="py-16 bg-zinc-950 border-b border-zinc-800">
      <div className="container mx-auto px-4">
        <SectionHeader title="FEATURED EQUIPMENT" />
        {equipment.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {equipment.map((item, index) => (
              <EquipmentCard
                key={item.id}
                equipment={item}
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
