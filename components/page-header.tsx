import { theme } from "@/lib/theme"
import React from "react"

interface PageHeaderProps {
  label?: string
  title: React.ReactNode
  description?: string
  children?: React.ReactNode
}

export default function PageHeader({ label, title, description, children }: PageHeaderProps) {
  return (
    <div className={theme.pageHeader.wrapper}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          {label && (
            <div className={theme.pageHeader.label}>
              <span className={theme.pageHeader.labelText}>{label}</span>
            </div>
          )}
          <h1 className={theme.pageHeader.title}>{title}</h1>
          {description && (
            <p className={theme.pageHeader.description}>{description}</p>
          )}
          {children && <div className="mt-6">{children}</div>}
        </div>
      </div>
    </div>
  )
}
