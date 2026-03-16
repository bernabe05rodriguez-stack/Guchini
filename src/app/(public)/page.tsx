export const dynamic = "force-dynamic"

import { prisma } from "@/lib/db"
import { CatalogoSection } from "@/components/catalogo-section"
import { ProductGrid } from "@/components/product-grid"
import { getStoreStatus } from "@/lib/constants"

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
      <CatalogoSection dbProducts={sandwichData} storeOpen={storeOpen} storeMessage={storeMessage} />

      {/* Bebidas */}
      <section className="py-10 md:py-20 bg-white">
        <div className="container px-4">
          <div className="text-center mb-5 md:mb-10">
            <h2 className="text-2xl md:text-4xl font-display font-bold text-foreground">
              Bebidas
            </h2>
          </div>
          <ProductGrid products={drinkData} type="drink" storeOpen={storeOpen} storeMessage={storeMessage} />
        </div>
      </section>
    </>
  )
}
