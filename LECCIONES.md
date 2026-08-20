# Guchini — Lecciones aprendidas

> ⏸️ **Guchini está archivado y no se va a revivir.** El repo se conserva por el trabajo que se hizo,
> no porque el proyecto siga. Este archivo, en cambio, **sí sirve**: es el mismo stack que va a usar
> **Katsuda** (Next.js + Prisma + Postgres + MercadoPago + EasyPanel), así que estos bugs ya pagados
> son los que Katsuda se va a encontrar. Por eso no se borró.


> Movidas desde `_lecciones.md` del vault de Obsidian el 2026-08-20: ese archivo se carga entero
> al inicio de cada sesión y había crecido demasiado. Lo específico de cada proyecto vive ahora
> al lado de su código. Las lecciones **generales** (deploy/EasyPanel, diseño, Claude Code)
> siguen en el vault: `Obsidian/Berna Notebook/_lecciones.md`.

---

### Guchini - Next.js + Prisma + EasyPanel
- *prisma db push --accept-data-loss es OBLIGATORIO en Docker*: Sin el flag, `prisma db push` pide confirmación interactiva. En Docker (no-TTY) falla silenciosamente → DB desincronizada → queries fallan con "column X does not exist". El `|| true` del CMD hace que el server arranque pero con schema viejo
- *npx prisma NO funciona en Docker runner stage*: Al copiar solo `node_modules/.prisma`, `@prisma` y `prisma` (sin `.bin/`), `npx prisma` no resuelve el binario. Usar `node node_modules/prisma/build/index.js` como ruta directa al CLI
- *Order number con count() colisiona*: `prisma.order.count()` + 1 genera números duplicados si se borran órdenes. Usar `findFirst({ orderBy: { createdAt: "desc" } })` para obtener el último número real y sumarle 1
- *JWT secret vacío rompe TODA la auth*: `jose` no puede firmar con una key vacía. Si se quita el fallback del JWT secret y la env var no está, login/register/Google OAuth devuelven 500. SIEMPRE mantener un fallback funcional
- *Middleware Next.js NO protege API routes*: El matcher `/admin/:path*` solo protege páginas `/admin/*`, NO `/api/admin/*`. Cada handler de API admin necesita su propio check de `getAdminFromCookie()`
- *Validar precios server-side siempre*: El frontend envía `unit_price` al crear orden. Sin validación, un usuario puede manipular precios via DevTools. Buscar precio real en DB y usarlo
- *Deploy EasyPanel tarda 3-5 min*: Docker build + push completo. Para verificar si deployó, checkear si un endpoint nuevo existe (404 = código viejo)
- *EasyPanel Bad Gateway durante deploy*: El panel devuelve 502 mientras está buildeando. Esperar ~15s y reintentar
- *Tailwind vs shadcn Button*: Clases como `bg-olive` no overridean `bg-primary` del variant default. Usar `style={{}}` inline para forzar
- *MercadoPago notification_url localhost = error CPT01*: MP rechaza preferences con notification_url localhost. Omitir el campo si no es URL pública
- *Horario automático server-side*: `getStoreStatus()` calcula abierto/cerrado por hora Argentina. No depende de DB, se evalúa en cada request
- *Secciones bg-white = texto invisible*: En Guchini, secciones con `bg-white` hacen que `text-foreground` resuelva a blanco (invisible). Usar `bg-cream` como las demás secciones (catalogo, historia, etc.) para que los colores del tema funcionen correctamente
- *EasyPanel dominio custom via API*: `POST domains.createDomain` requiere campo `id` (cuid). Después actualizar `NEXT_PUBLIC_BASE_URL` con `POST services.app.updateEnv` y redeploy. DNS: registros A apuntando a IP del servidor
- *EasyPanel SSL custom domain*: `certificateResolver` queda vacío al crear dominio via API → cert self-signed. Fix: `domains.updateDomain` con `certificateResolver: "letsencrypt"` + `traefik.restart`
- *PowerShell paréntesis en git paths*: `git add src/app/(public)/page.tsx` falla porque PS interpreta `()`. Envolver en comillas simples: `git add 'src/app/(public)/page.tsx'`
- *Next.js compila TODOS los .tsx, no solo los importados*: Un archivo .tsx que no se importa desde ninguna página igual se compila en el build. Si tiene imports rotos (ej: exportó eliminado de constants.ts), el build falla. Solución: eliminar archivos muertos, no dejarlos "sin usar"
- *Import no usado = error en build*: ESLint con `@typescript-eslint/no-unused-vars` falla el build si hay imports sin usar (ej: `import { STORE_NAME }` que no se referencia). Siempre limpiar imports al refactorizar
