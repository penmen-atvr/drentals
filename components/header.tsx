"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Home, Grid, Tag, Phone } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { scrollToTop } from "@/lib/navigation-utils"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const bottomMenuButtonRef = useRef<HTMLButtonElement>(null)

  // Close mobile menu when pathname changes (page navigation)
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Handle clicks outside the mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        (!menuButtonRef.current || !menuButtonRef.current.contains(event.target as Node)) &&
        (!bottomMenuButtonRef.current || !bottomMenuButtonRef.current.contains(event.target as Node))
      ) {
        setMobileMenuOpen(false)
      }
    }

    // Add event listener when mobile menu is open
    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    // Clean up event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [mobileMenuOpen])

  // Prevent body scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
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
  }, [mobileMenuOpen])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  const isActive = (path: string) => {
    // Special handling for /blog and /blog/[slug]
    if (path === "/blog") {
      return pathname.startsWith("/blog")
    }
    return pathname === path
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/equipment", label: "Equipment" },
    { href: "/brands", label: "Brands" },
    { href: "/areas", label: "Areas" },
    { href: "/blog", label: "Blog" }, // Added Blog link
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-900 border-b border-zinc-800">
        <div className="container mx-auto px-4 py-2 md:py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group" onClick={() => pathname === "/" && scrollToTop()}>
            <Image 
              src="/icon.png" 
              alt="D'RENTALS Logo" 
              width={36} 
              height={36} 
              className="rounded-lg object-contain w-8 h-8 md:w-9 md:h-9"
              priority
            />
            <div className="flex flex-col justify-center">
              <span className="font-heading text-lg md:text-xl tracking-wider uppercase text-white group-hover:text-red-500 transition-colors leading-none">D&apos;RENTALS</span>
              <span className="text-[10px] md:text-xs text-zinc-400 font-mono tracking-tight group-hover:text-zinc-300 transition-colors leading-none mt-0.5 md:mt-1">by Penmen Studios</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-zinc-400 hover:text-white transition-colors text-sm uppercase tracking-wider font-body font-bold py-1",
                  isActive(link.href) && "text-white"
                )}
                onClick={() => pathname === link.href && scrollToTop()}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500" />
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile Call Button */}
          <a
            href="tel:917794872701"
            className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
            aria-label="Call Us"
          >
            <Phone className="h-6 w-6" />
          </a>

        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        ref={mobileMenuRef}
        className={cn(
          "fixed inset-0 bg-zinc-950 z-[60] flex flex-col pt-20 px-4 md:hidden transition-transform duration-300 ease-in-out",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
        aria-hidden={!mobileMenuOpen}
      >
        {/* Close button for mobile menu */}
        <button
          className="absolute top-4 right-4 text-white p-2 focus:outline-none"
          onClick={closeMobileMenu}
          aria-label="Close menu"
        >
          <X className="h-6 w-6" />
        </button>

        <nav className="flex flex-col items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-zinc-400 hover:text-white transition-colors text-lg uppercase tracking-wider font-body font-bold py-2",
                isActive(link.href) && "text-white border-b-2 border-red-500",
              )}
              onClick={() => {
                closeMobileMenu()
                if (pathname === link.href) scrollToTop()
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto mb-8 border-t border-zinc-800 pt-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-3">
              <Image 
                src="/icon.png" 
                alt="D'RENTALS Logo" 
                width={32} 
                height={32} 
                className="rounded-lg object-contain"
              />
              <span className="font-heading text-xl text-white">D&apos;RENTALS</span>
            </div>
            <p className="text-zinc-400 text-sm font-mono">
              Professional cinema equipment rental
              <br />
              by Penmen Studios
            </p>
          </div>
        </div>
        </div>
      </header>

      {/* Overlay to capture clicks outside the menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-[45] md:hidden" onClick={closeMobileMenu} aria-hidden="true" />
      )}

      {/* Mobile Bottom Navigation */}
      <div 
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-900 border-t border-zinc-800 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex justify-around items-center h-16 px-2">
          <Link href="/" className={cn("flex flex-col items-center justify-center w-full h-full text-zinc-500 hover:text-white transition-colors", isActive("/") && "text-white")} onClick={() => pathname === "/" && scrollToTop()}>
            <Home className="h-5 w-5 mb-1" />
            <span className="text-[10px] font-heading tracking-wider uppercase">Home</span>
          </Link>
          
          <Link href="/equipment" className={cn("flex flex-col items-center justify-center w-full h-full text-zinc-500 hover:text-white transition-colors", isActive("/equipment") && "text-white")} onClick={() => pathname === "/equipment" && scrollToTop()}>
            <Grid className="h-5 w-5 mb-1" />
            <span className="text-[10px] font-heading tracking-wider uppercase">Gear</span>
          </Link>
          
          <div className="relative -top-5 flex flex-col items-center justify-center w-full">
            <a 
              href="https://wa.me/917794872701?text=Hi%20D%27RENTALS!%20I%27m%20interested%20in%20renting%20cinema%20equipment." 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg shadow-green-900/20 border-4 border-zinc-950 active:scale-95 transition-transform"
              aria-label="Chat on WhatsApp"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="h-7 w-7 text-white fill-white" viewBox="0 0 16 16">
                <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
              </svg>
            </a>
          </div>
          
          <Link href="/brands" className={cn("flex flex-col items-center justify-center w-full h-full text-zinc-500 hover:text-white transition-colors", isActive("/brands") && "text-white")} onClick={() => pathname === "/brands" && scrollToTop()}>
            <Tag className="h-5 w-5 mb-1" />
            <span className="text-[10px] font-heading tracking-wider uppercase">Brands</span>
          </Link>
          
          <button ref={bottomMenuButtonRef} onClick={toggleMobileMenu} className={cn("flex flex-col items-center justify-center w-full h-full text-zinc-500 hover:text-white transition-colors", mobileMenuOpen && "text-white")}>
            {mobileMenuOpen ? <X className="h-5 w-5 mb-1" /> : <Menu className="h-5 w-5 mb-1" />}
            <span className="text-[10px] font-heading tracking-wider uppercase">{mobileMenuOpen ? "Close" : "Menu"}</span>
          </button>
        </div>
      </div>
    </>
  )
}
