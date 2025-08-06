import EquipmentCard from "./equipment-card"
import type { Equipment } from "@/lib/types"

export default function EquipmentGrid({ equipment }: { equipment: Equipment[] }) {
  if (equipment.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-400">No equipment found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {equipment.map((item) => (
        <EquipmentCard key={item.id} equipment={item} />
      ))}
    </div>
  )
}
