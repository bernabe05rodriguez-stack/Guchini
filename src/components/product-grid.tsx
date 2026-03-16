"use client"

import { ProductCard } from "@/components/product-card"
import type { Sandwich, Drink } from "@/types/database"

interface ProductGridProps {
  products: (Sandwich | Drink)[]
  type: "sandwich" | "drink"
  compact?: boolean
  storeOpen?: boolean
  storeMessage?: string
}

export function ProductGrid({ products, type, compact = false, storeOpen = true, storeMessage = "" }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">
        No hay productos disponibles
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          type={type}
          compact={compact}
          storeOpen={storeOpen}
          storeMessage={storeMessage}
        />
      ))}
    </div>
  )
}
