"use client"

import { useState, useEffect } from "react"
import { MapPin } from "lucide-react"

const LOCATIONS = [
  { id: "chacras", name: "Chacras", description: "Chacras de Coria" },
  { id: "lacasa", name: "La Casa", description: "La Casa" },
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
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-olive/10 flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-8 w-8 text-olive" />
          </div>
          <h2 className="text-2xl font-display font-bold text-foreground">
            Elegí tu local
          </h2>
          <p className="text-muted-foreground mt-2">
            Seleccioná la ubicación donde querés retirar tu pedido
          </p>
        </div>

        <div className="space-y-3">
          {LOCATIONS.map((loc) => (
            <button
              key={loc.id}
              onClick={() => selectLocation(loc.id)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-border hover:border-olive hover:bg-olive/5 transition-all duration-200 group"
            >
              <div className="w-12 h-12 rounded-full bg-olive/10 group-hover:bg-olive/20 flex items-center justify-center shrink-0 transition-colors">
                <MapPin className="h-5 w-5 text-olive" />
              </div>
              <div className="text-left">
                <p className="font-bold text-lg text-foreground">{loc.name}</p>
                <p className="text-sm text-muted-foreground">{loc.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
