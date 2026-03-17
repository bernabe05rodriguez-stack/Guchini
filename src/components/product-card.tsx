"use client"

import Image from "next/image"
import { Plus, GlassWater } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { useCart } from "@/contexts/cart-context"
import type { Sandwich as SandwichType, Drink } from "@/types/database"
import { toast } from "sonner"
import { CATALOG_PRODUCTS } from "@/lib/constants"

const FALLBACK_IMAGES: Record<string, string> = Object.fromEntries(
  CATALOG_PRODUCTS.map(p => [p.name.toLowerCase(), p.image])
)

interface ProductCardProps {
  product: SandwichType | Drink
  type: "sandwich" | "drink"
  compact?: boolean
  storeOpen?: boolean
  storeMessage?: string
}

export function ProductCard({ product, type, storeOpen = true, storeMessage = "" }: ProductCardProps) {
  const { addItem } = useCart()

  const imageUrl = product.image_url || FALLBACK_IMAGES[product.name.toLowerCase()] || null

  const handleAdd = () => {
    if (!product.available) return
    if (!storeOpen) {
      toast.error(`Local cerrado. ${storeMessage}`)
      return
    }
    addItem({
      id: product.id,
      type,
      name: product.name,
      price: Number(product.price),
      image_url: product.image_url,
    })
    toast.success(`${product.name} agregado`)
  }

  return (
    <div className={`group bg-white rounded-2xl overflow-hidden shadow-elegant transition-all duration-500 hover:shadow-elevated hover:-translate-y-1 ${!product.available ? "opacity-50 grayscale" : ""}`}>
      {/* Image */}
      <div className="relative h-36 md:h-48 bg-cream/30 overflow-hidden flex items-center justify-center p-3">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, 33vw"
            className="object-contain p-2 transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <GlassWater className="h-10 w-10 text-olive/20" />
        )}
        {!product.available && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-semibold text-xs bg-black/60 px-2 py-0.5 rounded-full">
              No disponible
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-3.5 pb-3.5 pt-1.5">
        <h3 className="font-display font-bold text-sm md:text-base text-foreground text-center truncate">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-2.5">
          <span className="text-base font-bold text-olive">
            {formatPrice(Number(product.price))}
          </span>
          <button
            onClick={handleAdd}
            disabled={!product.available || !storeOpen}
            className="h-8 w-8 rounded-full bg-olive text-white flex items-center justify-center hover:bg-olive-light hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
