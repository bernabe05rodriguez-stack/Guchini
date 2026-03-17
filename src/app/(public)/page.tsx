export const dynamic = "force-dynamic"

import { prisma } from "@/lib/db"
import { CatalogoSection } from "@/components/catalogo-section"
import { ProductGrid } from "@/components/product-grid"
import { getStoreStatus, STORE_NAME, STORE_TAGLINE } from "@/lib/constants"

export default async function HomePage() {
  const [sandwiches, drinks] = await Promise.all([
    prisma.sandwich.findMany({ where: { available: true }, orderBy: { displayOrder: "asc" } }),
    prisma.drink.findMany({ where: { available: true }, orderBy: { displayOrder: "asc" } }),
  ])

  const { isOpen: storeOpen, message: storeMessage } = getStoreStatus()

  const sandwichData = sandwiches.map(s => ({
    id: s.id,
    name: s.name,
    price: Number(s.price),
    image_url: s.imageUrl,
    available: s.available,
  }))

  const drinkData = drinks.map(d => ({
    id: d.id,
    name: d.name,
    description: d.description,
    price: Number(d.price),
    image_url: d.imageUrl,
    available: d.available,
    display_order: d.displayOrder,
  }))

  return (
    <>
      {/* Hero Banner */}
      <section className="relative h-44 md:h-60 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: "url('/hero-bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-[#F5F0E8]" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight drop-shadow-lg">
            {STORE_NAME}
          </h1>
          <p className="text-sm md:text-base text-white/80 mt-2 font-body tracking-wide">
            {STORE_TAGLINE}
          </p>
        </div>
      </section>

      <CatalogoSection dbProducts={sandwichData} storeOpen={storeOpen} storeMessage={storeMessage} />

      {/* Section divider */}
      <div className="bg-cream">
        <div className="container px-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-olive/10" />
            <span className="text-olive/30 text-xs tracking-[0.3em] uppercase font-medium">& tambien</span>
            <div className="flex-1 h-px bg-olive/10" />
          </div>
        </div>
      </div>

      {/* Bebidas */}
      <section className="py-12 md:py-24 bg-cream">
        <div className="container px-4">
          <div className="text-center mb-6 md:mb-12">
            <p className="text-xs md:text-sm font-medium tracking-[0.2em] uppercase text-olive/60 mb-2 md:mb-3">
              Para acompañar
            </p>
            <h2 className="text-2xl md:text-4xl font-display font-bold text-foreground">
              Bebidas
            </h2>
            <div className="w-12 h-0.5 bg-mustard mx-auto mt-3 md:mt-4 rounded-full" />
          </div>
          <ProductGrid products={drinkData} type="drink" storeOpen={storeOpen} storeMessage={storeMessage} />
        </div>
      </section>
    </>
  )
}
