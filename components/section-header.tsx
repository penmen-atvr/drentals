import { theme } from "@/lib/theme"
import React from "react"

interface SectionHeaderProps {
  title: string
  className?: string
}

export default function SectionHeader({ title, className }: SectionHeaderProps) {
  return (
    <div className={`${theme.sectionHeader.wrapper} ${className ?? ""}`}>
      <h2 className={theme.sectionHeader.title}>{title}</h2>
      <div className={theme.sectionHeader.line} />
    </div>
  )
}
