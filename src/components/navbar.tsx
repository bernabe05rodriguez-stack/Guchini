"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, MapPin, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { useEffect, useState } from "react"

export function Navbar() {
  const { itemCount, setIsOpen } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)
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
    <nav className={`fixed top-0 z-50 w-full transition-all duration-500 bg-white/95 backdrop-blur-md ${
      scrolled ? "shadow-sm" : ""
    }`}>
      <div className="container flex items-center justify-between py-2 md:py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="TAKE" width={72} height={72} className="rounded-full md:w-[112px] md:h-[112px]" />
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Location badge */}
          {locationLabel && (
            <button
              onClick={changeLocation}
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-olive hover:text-olive-light transition-colors px-3 py-1.5 rounded-full bg-olive/5 hover:bg-olive/10"
            >
              <MapPin className="h-3.5 w-3.5" />
              {locationLabel}
            </button>
          )}

          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-olive/5"
            onClick={() => setIsOpen(true)}
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-mustard text-xs font-bold flex items-center justify-center text-foreground">
                {itemCount}
              </span>
            )}
          </Button>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-border/50 shadow-lg">
          <div className="container py-3 space-y-1">
            {locationLabel && (
              <button
                onClick={changeLocation}
                className="flex items-center gap-2 text-sm font-medium text-olive w-full py-2"
              >
                <MapPin className="h-4 w-4" />
                {locationLabel} — Cambiar local
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
