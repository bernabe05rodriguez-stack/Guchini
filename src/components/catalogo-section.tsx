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
    <section id="productos" className="pt-10 md:pt-16 pb-10 md:pb-24 bg-cream">
      <div className="container px-4">
        {/* Header */}
        <div className="text-center mb-8 md:mb-16">
          <p className="text-xs md:text-sm font-medium tracking-[0.2em] uppercase text-olive/60 mb-2 md:mb-3">
            Seleccion artesanal
          </p>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">
            Nuestro Menu
          </h2>
          <div className="w-12 h-0.5 bg-mustard mx-auto mt-3 md:mt-5 rounded-full" />
          <p className="text-sm md:text-lg text-muted-foreground mt-3 md:mt-4 max-w-md mx-auto">
            Sanguches artesanales con pan focaccia
          </p>
        </div>

        {/* Cards */}
        <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-5">
          {CATALOG_PRODUCTS.map((product, index) => {
            const db = dbProducts.find(
              (p) => p.name.toLowerCase().includes(product.name.toLowerCase()) ||
                     product.name.toLowerCase().includes(p.name.toLowerCase())
            )

            return (
              <div
                key={product.name}
                className={`group bg-white rounded-2xl overflow-hidden shadow-elegant transition-all duration-500 hover:shadow-elevated hover:-translate-y-1 animate-fade-in-up ${
                  db && !db.available ? "opacity-50 grayscale" : ""
                }`}
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                {/* Mobile: horizontal / Desktop: vertical */}
                <div className="flex md:flex-col">
                  {/* Image */}
                  <div className="relative w-28 h-28 shrink-0 md:w-full md:h-56 overflow-hidden">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-olive/5">
                        <Sandwich className="h-10 w-10 text-olive/20" />
                      </div>
                    )}
                    {product.badge && (
                      <span className="absolute top-2.5 left-2.5 text-[10px] font-semibold text-white bg-olive/90 backdrop-blur-sm px-2.5 py-1 rounded-full tracking-wide uppercase">
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
                  <div className="flex-1 p-3.5 md:p-5 flex flex-col justify-between min-w-0">
                    <div>
                      <h3 className="font-display font-bold text-base md:text-lg text-foreground tracking-tight">
                        {product.name}
                      </h3>
                      <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
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
                            className="h-9 px-3 rounded-full border border-olive/30 text-olive text-xs font-semibold hover:bg-olive/5 active:bg-olive/10 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            ½ {formatPrice(7000)}
                          </button>
                          <button
                            onClick={() => handleAdd(product, db)}
                            disabled={!db.available || !storeOpen}
                            className="h-9 w-9 rounded-full bg-olive text-white flex items-center justify-center hover:bg-olive-light hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
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
