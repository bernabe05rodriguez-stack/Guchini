"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { MapPin } from "lucide-react"

const LOCATIONS = [
  { id: "chacras", name: "Chacras", description: "Itala 3475, Chacras de Coria" },
  { id: "lacasa", name: "La Casa", description: "San Lorenzo 577, Ciudad" },
] as const

const LOCATION_KEY = "guchini-location"

export type LocationId = (typeof LOCATIONS)[number]["id"]

export function getStoredLocation(): LocationId | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(LOCATION_KEY) as LocationId | null
}

export function LocationSelector() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(LOCATION_KEY)
    if (!stored) setShow(true)
  }, [])

  const selectLocation = (id: LocationId) => {
    localStorage.setItem(LOCATION_KEY, id)
    setShow(false)
    window.dispatchEvent(new Event("location-changed"))
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-floating max-w-sm w-full p-8 animate-scale-in">
        <div className="text-center mb-8">
          <Image src="/logo.png" alt="Guchini" width={160} height={60} className="h-14 w-auto mx-auto mb-5" />
          <h2 className="text-2xl font-display font-bold text-foreground tracking-tight">
            Elegí tu local
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            ¿Dónde retirás tu pedido?
          </p>
        </div>

        <div className="space-y-3">
          {LOCATIONS.map((loc) => (
            <button
              key={loc.id}
              onClick={() => selectLocation(loc.id)}
              className="w-full flex items-center gap-4 p-5 rounded-2xl border-2 border-border hover:border-olive hover:bg-olive/5 active:bg-olive/10 transition-all duration-300 hover:shadow-elegant group"
            >
              <div className="w-12 h-12 rounded-full bg-olive/10 flex items-center justify-center shrink-0 group-hover:bg-olive/20 transition-colors duration-300">
                <MapPin className="h-5 w-5 text-olive" />
              </div>
              <div className="text-left">
                <p className="font-bold text-lg text-foreground font-display">{loc.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{loc.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
