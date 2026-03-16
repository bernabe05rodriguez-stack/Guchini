"use client"

import { CATALOG_PRODUCTS } from "@/lib/constants"
import { Sandwich, Plus } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { useCart } from "@/contexts/cart-context"
import { toast } from "sonner"

interface DbProduct {
  id: string
  name: string
  price: number
  available: boolean
  image_url: string | null
}

interface CatalogoSectionProps {
  dbProducts: DbProduct[]
  storeOpen: boolean
  storeMessage: string
}

export function CatalogoSection({ dbProducts, storeOpen, storeMessage }: CatalogoSectionProps) {
  const { addItem } = useCart()

  const handleAdd = (product: typeof CATALOG_PRODUCTS[0], db: DbProduct, half = false) => {
    if (!db.available) return
    if (!storeOpen) {
      toast.error(`Local cerrado. ${storeMessage}`)
      return
    }
    addItem({
      id: half ? `${db.id}-half` : db.id,
      type: "sandwich",
      name: half ? `${db.name} (Medio)` : db.name,
      price: half ? 7000 : db.price,
      image_url: product.image,
      isHalf: half || undefined,
    })
    toast.success(`${half ? "Medio " : ""}${db.name} agregado`)
  }

  return (
    <section id="productos" className="pt-24 md:pt-36 pb-10 md:pb-24 bg-cream">
      <div className="container px-4">
        {/* Header simple */}
        <div className="text-center mb-6 md:mb-14">
          <h2 className="text-2xl md:text-5xl font-display font-bold text-foreground">
            Nuestro Menú
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground mt-1 md:mt-3">
            Sanguches artesanales con pan focaccia
          </p>
        </div>

        {/* Cards - 1 col mobile, 2 col desktop */}
        <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-5">
          {CATALOG_PRODUCTS.map((product) => {
            const db = dbProducts.find(
              (p) => p.name.toLowerCase().includes(product.name.toLowerCase()) ||
                     product.name.toLowerCase().includes(p.name.toLowerCase())
            )

            return (
              <div
                key={product.name}
                className={`bg-white rounded-2xl overflow-hidden shadow-sm ${
                  db && !db.available ? "opacity-50 grayscale" : ""
                }`}
              >
                {/* Mobile: horizontal card / Desktop: vertical card */}
                <div className="flex md:flex-col">
                  {/* Image */}
                  <div className="relative w-28 h-28 shrink-0 md:w-full md:h-52 overflow-hidden">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-olive/5">
                        <Sandwich className="h-10 w-10 text-olive/20" />
                      </div>
                    )}
                    {product.badge && (
                      <span className="absolute top-2 left-2 text-[10px] font-medium text-white bg-green-600/90 px-2 py-0.5 rounded-full">
                        {product.badge}
                      </span>
                    )}
                    {db && !db.available && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-white font-semibold text-xs bg-black/60 px-2 py-0.5 rounded-full">
                          No disponible
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 p-3 md:p-4 flex flex-col justify-between min-w-0">
                    <div>
                      <h3 className="font-display font-bold text-base md:text-lg text-foreground">
                        {product.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    {db && (
                      <div className="flex items-center justify-between mt-2.5 md:mt-3">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-bold text-olive">{formatPrice(db.price)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleAdd(product, db, true)}
                            disabled={!db.available || !storeOpen}
                            className="h-9 px-3 rounded-full border border-olive/30 text-olive text-xs font-semibold hover:bg-olive/5 active:bg-olive/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            ½ {formatPrice(7000)}
                          </button>
                          <button
                            onClick={() => handleAdd(product, db)}
                            disabled={!db.available || !storeOpen}
                            className="h-9 w-9 rounded-full bg-olive text-white flex items-center justify-center hover:bg-olive-light active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
