import { MapPin, Mail, Clock, Instagram } from "lucide-react"
import { STORE_ADDRESS, STORE_EMAIL, STORE_INSTAGRAM, STORE_TIKTOK, STORE_HOURS, PLATFORM_NAME, STORE_NAME } from "@/lib/constants"

export function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white/80">
      {/* Top decorative border */}
      <div className="h-px bg-gradient-to-r from-transparent via-mustard/40 to-transparent" />

      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
              {STORE_NAME}
            </h3>
            <p className="text-xs tracking-[0.15em] uppercase text-white/30 mt-1">
              by {PLATFORM_NAME}
            </p>
            <p className="text-sm text-white/40 mt-4 leading-relaxed max-w-xs">
              Sanguches artesanales con pan focaccia. Pedí online, pagá y retirá sin esperar.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold text-white/50 uppercase tracking-[0.2em] mb-4 md:mb-6">
              Contacto
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-white/50">
                <MapPin className="h-4 w-4 flex-shrink-0 text-mustard/50" />
                <span>{STORE_ADDRESS}</span>
              </div>
              <div className="flex items-center gap-3 text-white/50">
                <Mail className="h-4 w-4 flex-shrink-0 text-mustard/50" />
                <a href={`mailto:${STORE_EMAIL}`} className="hover:text-mustard transition-colors duration-300">
                  {STORE_EMAIL}
                </a>
              </div>
              <div className="flex items-center gap-3 text-white/50">
                <Clock className="h-4 w-4 flex-shrink-0 text-mustard/50" />
                <span>{STORE_HOURS}</span>
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-xs font-bold text-white/50 uppercase tracking-[0.2em] mb-4 md:mb-6">
              Seguinos
            </h4>
            <div className="space-y-3 text-sm">
              <a
                href={`https://instagram.com/${STORE_INSTAGRAM.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-white/50 hover:text-mustard transition-colors duration-300 group"
              >
                <Instagram className="h-4 w-4 text-mustard/50 group-hover:text-mustard transition-colors" />
                <span>{STORE_INSTAGRAM}</span>
              </a>
              <a
                href={`https://tiktok.com/${STORE_TIKTOK.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-white/50 hover:text-mustard transition-colors duration-300 group"
              >
                <span className="h-4 w-4 flex-shrink-0 flex items-center justify-center text-mustard/50 text-xs font-bold group-hover:text-mustard transition-colors">TT</span>
                <span>{STORE_TIKTOK}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 md:mt-14 pt-6 md:pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-white/20">
          <span>&copy; {new Date().getFullYear()} {PLATFORM_NAME}. Todos los derechos reservados.</span>
          <span>Mendoza, Argentina</span>
        </div>
      </div>
    </footer>
  )
}
