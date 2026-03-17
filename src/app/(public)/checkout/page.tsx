"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Clock, ShoppingBag, CreditCard, User, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/cart-context"
import { formatPrice } from "@/lib/utils"
import { toast } from "sonner"

export default function CheckoutPage() {
  const { items, total } = useCart()
  const router = useRouter()
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [estimatedWait, setEstimatedWait] = useState<number | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [location, setLocation] = useState<string | null>(null)

  useEffect(() => {
    if (items.length === 0) {
      router.push("/")
      return
    }

    setLocation(localStorage.getItem("guchini-location"))

    fetch("/api/orders/wait-time")
      .then(res => res.json())
      .then(data => setEstimatedWait(data.minutes))
      .catch(() => setEstimatedWait(12))
  }, [items.length, router])

  const handlePay = async () => {
    if (!name.trim()) {
      toast.error("Ingresá tu nombre")
      return
    }
    if (!email.trim() || !email.includes("@")) {
      toast.error("Ingresá un email válido")
      return
    }
    if (!phone.trim() || phone.trim().length < 8) {
      toast.error("Ingresá un número de teléfono válido")
      return
    }
    if (!location) {
      toast.error("Seleccioná un local primero")
      router.push("/")
      return
    }

    setLoading(true)
    try {
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(item => ({
            item_type: item.type,
            item_id: item.isHalf ? item.id.replace(/-half$/, "") : item.id,
            item_name: item.name,
            quantity: item.quantity,
            unit_price: item.price,
            is_half: item.isHalf || false,
          })),
          notes,
          estimated_wait_minutes: estimatedWait,
          location,
          customer_name: name.trim(),
          customer_email: email.trim(),
          customer_phone: phone.trim(),
        }),
      })

      if (!orderRes.ok) {
        const err = await orderRes.json()
        throw new Error(err.error || "Error al crear el pedido")
      }

      const order = await orderRes.json()

      const mpRes = await fetch("/api/mercadopago/create-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          orderNumber: order.order_number,
          customerName: name.trim(),
          customerEmail: email.trim(),
        }),
      })

      if (!mpRes.ok) {
        throw new Error("Error al conectar con MercadoPago")
      }

      const { init_point } = await mpRes.json()
      window.location.href = init_point
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error inesperado")
      setLoading(false)
    }
  }

  if (items.length === 0) return null

  const locationLabel = location === "chacras" ? "Chacras" : location === "lacasa" ? "La Casa" : "No seleccionado"

  return (
    <div className="container max-w-2xl py-10 md:py-16 space-y-6 animate-fade-in-up">
      <div className="text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">Confirmar pedido</h1>
        <p className="text-muted-foreground mt-1 text-sm">Completá tus datos para finalizar</p>
      </div>

      {/* Location */}
      <Card className="shadow-elegant border-olive/5">
        <CardContent className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Retiro en:</span>
            <span className="font-bold text-olive">{locationLabel}</span>
          </div>
        </CardContent>
      </Card>

      {/* Customer data form */}
      <Card className="shadow-elegant border-olive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5" />
            Tus datos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                placeholder="Tu nombre completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 transition-all duration-300 focus:shadow-elegant focus:border-olive/30"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 transition-all duration-300 focus:shadow-elegant focus:border-olive/30"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="261 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-10 transition-all duration-300 focus:shadow-elegant focus:border-olive/30"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order summary */}
      <Card className="shadow-elegant border-olive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShoppingBag className="h-5 w-5" />
            Resumen del pedido
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="flex justify-between items-center">
              <div>
                <span className="font-medium">{item.name}</span>
                <span className="text-muted-foreground ml-2">x{item.quantity}</span>
              </div>
              <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}

          <Separator />

          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total</span>
            <span className="text-olive">{formatPrice(total)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Estimated wait */}
      {estimatedWait !== null && (
        <Card className="shadow-elegant border-olive/10 bg-olive/5">
          <CardContent className="flex items-center gap-4 py-5">
            <div className="w-12 h-12 rounded-full bg-olive/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-olive" />
            </div>
            <div>
              <p className="font-medium text-sm text-muted-foreground">Tiempo estimado de espera</p>
              <p className="text-2xl font-bold text-olive font-display">~{estimatedWait} min</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      <Card className="shadow-elegant border-olive/5">
        <CardContent className="py-4 space-y-2">
          <Label htmlFor="notes">¿Alguna aclaración?</Label>
          <Textarea
            id="notes"
            placeholder="Ej: Sin cebolla, extra salsa..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={500}
            className="transition-all duration-300 focus:shadow-elegant focus:border-olive/30"
          />
        </CardContent>
      </Card>

      {/* Pay button */}
      <Button
        size="lg"
        className="w-full bg-mustard hover:bg-mustard-dark text-foreground font-bold text-lg h-14 gap-2 rounded-xl shadow-elegant hover:shadow-elevated active:scale-[0.98]"
        onClick={handlePay}
        disabled={loading}
      >
        {loading ? (
          <span className="animate-pulse">Procesando...</span>
        ) : (
          <>
            <CreditCard className="h-5 w-5" />
            Pagar con MercadoPago — {formatPrice(total)}
          </>
        )}
      </Button>
    </div>
  )
}
