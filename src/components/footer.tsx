import { MapPin, Mail } from "lucide-react"
import { STORE_ADDRESS, STORE_EMAIL, PLATFORM_NAME } from "@/lib/constants"

export function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white/80 py-10 md:py-14">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl md:text-3xl font-display font-bold text-white">{PLATFORM_NAME}</h3>
            <p className="text-sm text-white/50 mt-3 leading-relaxed max-w-xs">
              Plataforma de pedidos online. Pedí, pagá y retirá sin esperar.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 md:mb-5">Contacto</h4>
            <div className="space-y-2 md:space-y-3 text-sm">
              <div className="flex items-center gap-3 text-white/50">
                <MapPin className="h-4 w-4 flex-shrink-0 text-white/30" />
                <span>{STORE_ADDRESS}</span>
              </div>
              <div className="flex items-center gap-3 text-white/50">
                <Mail className="h-4 w-4 flex-shrink-0 text-white/30" />
                <a href={`mailto:${STORE_EMAIL}`} className="hover:text-mustard transition-colors">
                  {STORE_EMAIL}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-white/10 text-center text-xs text-white/30">
          &copy; {new Date().getFullYear()} {PLATFORM_NAME}. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
