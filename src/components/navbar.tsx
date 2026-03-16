"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, MapPin } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useEffect, useState } from "react"

export function Navbar() {
  const { itemCount, setIsOpen } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [location, setLocation] = useState<string | null>(null)

  useEffect(() => {
    setLocation(localStorage.getItem("guchini-location"))
    const handler = () => setLocation(localStorage.getItem("guchini-location"))
    window.addEventListener("location-changed", handler)
    return () => window.removeEventListener("location-changed", handler)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const changeLocation = () => {
    localStorage.removeItem("guchini-location")
    window.dispatchEvent(new Event("location-changed"))
    window.location.reload()
  }

  const locationLabel = location === "chacras" ? "Chacras" : location === "lacasa" ? "La Casa" : null

  return (
    <nav className={`fixed top-0 z-50 w-full transition-all duration-300 bg-white ${
      scrolled ? "shadow-md" : "shadow-sm"
    }`}>
      <div className="container px-4 flex items-center justify-between h-14 md:h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image src="/logo.png" alt="Guchini" width={100} height={40} className="h-8 w-auto md:h-10" />
        </Link>

        {/* Location badge - always visible */}
        {locationLabel && (
          <button
            onClick={changeLocation}
            className="flex items-center gap-1 text-xs md:text-sm font-medium text-olive px-2.5 py-1.5 rounded-full bg-olive/5 active:bg-olive/10 transition-colors"
          >
            <MapPin className="h-3 w-3 md:h-3.5 md:w-3.5" />
            {locationLabel}
          </button>
        )}

        {/* Cart */}
        <button
          className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
          onClick={() => setIsOpen(true)}
        >
          <ShoppingCart className="h-5 w-5 text-foreground" />
          {itemCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-mustard text-[11px] font-bold flex items-center justify-center text-foreground">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  )
}
