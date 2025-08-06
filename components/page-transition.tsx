"use client"

import { motion } from "framer-motion"
import { useEffect } from "react"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

interface PageTransitionProps {
  children: ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()

  // Reset scroll position when navigating to a new page
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname]) // Add pathname as dependency to trigger on route changes

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      {children}
    </motion.div>
  )
}
