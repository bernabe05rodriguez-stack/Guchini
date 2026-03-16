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
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center mb-6">
          <Image src="/logo.png" alt="Guchini" width={160} height={60} className="h-12 w-auto mx-auto mb-4" />
          <h2 className="text-xl font-display font-bold text-foreground">
            Elegí tu local
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            ¿Dónde retirás tu pedido?
          </p>
        </div>

        <div className="space-y-3">
          {LOCATIONS.map((loc) => (
            <button
              key={loc.id}
              onClick={() => selectLocation(loc.id)}
              className="w-full flex items-center gap-3 p-4 rounded-2xl border-2 border-border hover:border-olive hover:bg-olive/5 active:bg-olive/10 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-full bg-olive/10 flex items-center justify-center shrink-0">
                <MapPin className="h-4 w-4 text-olive" />
              </div>
              <div className="text-left">
                <p className="font-bold text-base text-foreground">{loc.name}</p>
                <p className="text-xs text-muted-foreground">{loc.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
