"use client"

import { useRouter } from "next/navigation"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { useCart } from "@/contexts/cart-context"
import { formatPrice } from "@/lib/utils"

export function CartSheet() {
  const { items, removeItem, updateQuantity, total, isOpen, setIsOpen, itemCount } = useCart()
  const router = useRouter()

  const handleCheckout = () => {
    setIsOpen(false)
    router.push("/checkout")
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="right" className="flex flex-col bg-cream border-l-0 shadow-floating">
        <SheetHeader className="pb-4 border-b border-olive/10">
          <SheetTitle className="flex items-center gap-2.5 text-lg">
            <ShoppingBag className="h-5 w-5 text-olive" />
            Tu pedido ({itemCount})
          </SheetTitle>
          <SheetDescription>
            Revisá tus productos antes de pagar
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground py-12">
            <div className="w-20 h-20 rounded-full bg-olive/5 flex items-center justify-center mb-5">
              <ShoppingBag className="h-10 w-10 text-olive/20" />
            </div>
            <p className="text-lg font-display font-semibold text-foreground/60">Tu carrito está vacío</p>
            <p className="text-sm mt-1.5 text-muted-foreground">Agregá productos para empezar</p>
          </div>
        ) : (
          <>
            {/* Items list */}
            <div className="flex-1 overflow-y-auto space-y-3 py-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-3.5 flex items-center gap-3 shadow-elegant transition-all duration-300 hover:shadow-elevated"
                >
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                    <p className="text-sm text-olive font-medium">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Subtotal + delete */}
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-bold">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total + checkout button */}
            <div className="pt-5 space-y-4 border-t border-olive/10">
              <div className="flex justify-between items-center">
                <span className="text-lg font-display font-bold">Total</span>
                <span className="text-2xl font-bold text-olive">
                  {formatPrice(total)}
                </span>
              </div>

              <Button
                size="lg"
                className="w-full bg-mustard hover:bg-mustard-dark text-foreground font-bold text-base rounded-xl shadow-elegant hover:shadow-elevated active:scale-[0.98]"
                onClick={handleCheckout}
              >
                Ir a pagar
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
