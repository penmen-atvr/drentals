"use client"

import { useState, useEffect } from "react"

export default function WhatsAppFloat() {
  const [visible, setVisible] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  // Show the button after a short delay on page load
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1500)
    return () => clearTimeout(t)
  }, [])

  // Show tooltip once on arrival, fade out after 4s
  useEffect(() => {
    if (!visible) return
    const t1 = setTimeout(() => setShowTooltip(true), 500)
    const t2 = setTimeout(() => setShowTooltip(false), 4500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [visible])

  const handleClick = () => {
    const msg = encodeURIComponent("Hi D'RENTALS! I'm interested in renting cinema equipment. Can you help me?\n\n[Inquiry sent via D'RENTALS Website]")
    window.open(`https://wa.me/917794872701?text=${msg}`, "_blank")
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
      }`}
    >
      {/* Tooltip bubble */}
      <div
        className={`transition-all duration-300 ${
          showTooltip ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        <div className="bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 shadow-xl max-w-[200px]">
          <p className="text-white text-sm font-semibold leading-tight">Chat with us!</p>
          <p className="text-zinc-400 text-xs mt-0.5">We respond instantly 📸</p>
          {/* Arrow pointing down-right */}
          <div className="absolute bottom-[-8px] right-6 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-zinc-700" />
        </div>
      </div>

      {/* Main button */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label="Chat on WhatsApp"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
        style={{ backgroundColor: "#25D366" }}
      >
        {/* Pulse ring */}
        <span
          className="absolute inset-0 rounded-full animate-ping opacity-30"
          style={{ backgroundColor: "#25D366" }}
        />
        {/* WhatsApp SVG icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          className="w-7 h-7 relative z-10"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.12 1.529 5.847L0 24l6.335-1.654A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.017-1.375l-.36-.214-3.733.978.995-3.648-.235-.374A9.778 9.778 0 012.182 12C2.182 6.564 6.564 2.182 12 2.182S21.818 6.564 21.818 12 17.436 21.818 12 21.818z" />
        </svg>
      </button>
    </div>
  )
}
