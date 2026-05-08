import { theme } from "@/lib/theme"
import React from "react"

interface SectionHeaderProps {
  title: string
  subtitle?: string
  className?: string
}

export default function SectionHeader({ title, subtitle, className }: SectionHeaderProps) {
  return (
    <div className={`${theme.sectionHeader.wrapper} ${className ?? ""}`}>
      <div>
        <h2 className={theme.sectionHeader.title}>{title}</h2>
        {subtitle && <p className="text-zinc-400 font-mono text-sm mt-1 uppercase tracking-widest">{subtitle}</p>}
      </div>
      <div className={theme.sectionHeader.line} />
    </div>
  )
}
