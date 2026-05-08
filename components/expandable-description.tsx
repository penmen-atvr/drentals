"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

export default function ExpandableDescription({ description }: { description: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent background scrolling when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      document.documentElement.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
      document.documentElement.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
      document.documentElement.style.overflow = ""
    }
  }, [isOpen])

  if (!description) return null

  const maxLength = 150
  const isLong = description.length > maxLength
  const truncatedText = isLong ? `${description.slice(0, maxLength)}...` : description

  return (
    <>
      <div className="relative">
        <p className="text-zinc-400 font-body leading-relaxed">
          {truncatedText}
        </p>
        {isLong && (
          <button
            onClick={() => setIsOpen(true)}
            className="text-red-500 font-mono text-xs uppercase tracking-widest mt-2 hover:text-red-400 transition-colors flex items-center gap-1"
          >
            Read More
          </button>
        )}
      </div>

      {/* Bottom-Up Dialog Overlay */}
      {mounted && isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Dialog Panel */}
          <div 
            className="relative bg-zinc-950 w-full sm:w-[500px] sm:max-w-full max-h-[85vh] sm:rounded-xl border border-zinc-800 flex flex-col animate-in slide-in-from-bottom duration-300"
            role="dialog"
            aria-modal="true"
            aria-labelledby="description-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <h2 id="description-title" className="font-heading text-xl text-white uppercase tracking-wide">
                Description
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-zinc-400 hover:text-white transition-colors bg-zinc-900 rounded-full"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 overflow-y-auto">
              <p className="text-zinc-300 font-body leading-relaxed whitespace-pre-wrap">
                {description}
              </p>
            </div>
            
            {/* Safe area padding for mobile bottom */}
            <div className="h-6 sm:hidden" />
          </div>
        </div>
      )}
    </>
  )
}
