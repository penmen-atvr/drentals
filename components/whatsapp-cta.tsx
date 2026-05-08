"use client"

import { Button } from "@/components/ui/button"
import type { Equipment } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"

interface WhatsAppCTAProps {
  equipment: Equipment
}

export default function WhatsAppCTA({ equipment }: WhatsAppCTAProps) {
  const generateWhatsAppMessage = () => {
    // Build kit components section if applicable
    let kitSection = ""
    if (equipment.isKit && equipment.kitComponents && equipment.kitComponents.length > 0) {
      const componentLines = equipment.kitComponents
        .map((c: any) => `  • ${c.item?.name}${c.item?.model ? ` (${c.item.model})` : ""} x${c.quantity}`)
        .join("\n")
      kitSection = `\n*Bundle Includes:*\n${componentLines}`
    }

    const details = `*Inquiry for Equipment ID: ${equipment.id}*

*Item:* ${equipment.name}${equipment.brand ? `\n*Brand:* ${equipment.brand}` : ""}${equipment.model ? `\n*Model:* ${equipment.model}` : ""}${equipment.categoryName ? `\n*Category:* ${equipment.categoryName}` : ""}
*Daily Rate:* ${formatCurrency(equipment.dailyRate)}${kitSection}`

    const message = `${details}\n\nHello, I'm interested in renting this equipment from D'RENTALS. Please provide information about availability and booking process.\n\n[Inquiry sent via D'RENTALS Website]`

    // Format the phone number (remove any non-digit characters)
    const phoneNumber = "917794872701" // Format: country code + number without +

    // Create WhatsApp URL with pre-filled message
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank")
  }

  return (
    <Button
      onClick={generateWhatsAppMessage}
      className="w-full bg-green-600 hover:bg-green-700 text-white rounded-none px-8 py-7 text-sm font-heading flex items-center justify-center gap-3 tracking-widest transition-all duration-300 shadow-float relative"
    >
      <div className="absolute -top-1 -right-1 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5 relative z-10"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.12 1.529 5.847L0 24l6.335-1.654A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.017-1.375l-.36-.214-3.733.978.995-3.648-.235-.374A9.778 9.778 0 012.182 12C2.182 6.564 6.564 2.182 12 2.182S21.818 6.564 21.818 12 17.436 21.818 12 21.818z" />
      </svg>
      ENQUIRE VIA WHATSAPP
    </Button>
  )
}
