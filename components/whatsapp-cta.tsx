"use client"

import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import type { Equipment } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"

interface WhatsAppCTAProps {
  equipment: Equipment
}

export default function WhatsAppCTA({ equipment }: WhatsAppCTAProps) {
  const generateWhatsAppMessage = () => {
    // Create a well-formatted message with equipment details
    const details = `*Inquiry for Equipment ID: ${equipment.id}*
    
*Item:* ${equipment.name}
*Daily Rate:* ${formatCurrency(equipment.dailyRate)}`;

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
      <MessageSquare className="h-5 w-5" />
      ENQUIRE VIA WHATSAPP
    </Button>
  )
}
