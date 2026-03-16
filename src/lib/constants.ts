export const STORE_NAME = "Guchini"
export const STORE_TAGLINE = "Sándwiches artesanales"
export const PLATFORM_NAME = "TAKE"
export const STORE_ADDRESS = "San Lorenzo 577, M5502 Mendoza"
export const STORE_INSTAGRAM = "@guchini.ar"
export const STORE_TIKTOK = "@guchini.ar"
export const STORE_EMAIL = "guchini.ar@gmail.com"
export const STORE_HOURS = "Lun-Sáb 8:00-23:00"

// Horario del local: Lunes(1) a Sábado(6), 8:00 a 23:00 (hora Argentina UTC-3)
export function getStoreStatus(): { isOpen: boolean; message: string } {
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Argentina/Mendoza" }))
  const day = now.getDay() // 0=Dom, 1=Lun, ..., 6=Sáb
  const hour = now.getHours()
  const minutes = now.getMinutes()
  const currentMinutes = hour * 60 + minutes

  const OPEN = 8 * 60   // 8:00
  const CLOSE = 23 * 60 // 23:00

  // Domingo (0) = cerrado
  if (day === 0) {
    return { isOpen: false, message: "Abrimos mañana lunes a las 8:00" }
  }

  // Lunes a Sábado
  if (currentMinutes >= OPEN && currentMinutes < CLOSE) {
    return { isOpen: true, message: "" }
  }

  // Cerrado pero día hábil
  if (currentMinutes < OPEN) {
    const hoursLeft = Math.floor((OPEN - currentMinutes) / 60)
    const minsLeft = (OPEN - currentMinutes) % 60
    if (hoursLeft > 0) {
      return { isOpen: false, message: `Abrimos hoy a las 8:00 (en ${hoursLeft}h ${minsLeft > 0 ? minsLeft + "min" : ""})` }
    }
    return { isOpen: false, message: `Abrimos en ${minsLeft} minutos` }
  }

  // Después de las 23:00
  if (day === 6) {
    // Sábado de noche → abre lunes
    return { isOpen: false, message: "Abrimos el lunes a las 8:00" }
  }
  return { isOpen: false, message: "Abrimos mañana a las 8:00" }
}
export const STORE_MAPS_URL = "https://www.google.com/maps/place/San+Lorenzo+577,+M5502+Mendoza"
export const ORDER_PREFIX = "TAKE"

export const CATALOG_PRODUCTS = [
  {
    name: "Crudo",
    description: "Jamón crudo, queso sardo, tomate, rúcula, pesto de albahaca",
    badge: null,
    image: "/products/crudo.jpg",
  },
  {
    name: "La Patrona",
    description: "Milanesa de berenjena, queso sardo, cebolla pickle, tomate, rúcula, alioli",
    badge: "Veggie",
    image: "/products/la_patrona.jpg",
  },
  {
    name: "Guchicken",
    description: "Milanesa de pollo, queso gruyere, coleslaw, mostaneza",
    badge: null,
    image: "/products/guchicken.jpg",
  },
  {
    name: "Mortadela",
    description: "Mortadela con pistacho, stracciatella, queso sbrinz, pesto",
    badge: null,
    image: "/products/mortadela.jpg",
  },
]

