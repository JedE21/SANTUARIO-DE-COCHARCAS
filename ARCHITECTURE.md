# Arquitectura Técnica - Santuario de Nuestra Señora de Cocharcas

## Estado Inicial

Al iniciar el análisis, el proyecto ya contaba con una base sólida:
- Next.js 14.1.0 con App Router
- React 18.2.0
- TypeScript configurado correctamente
- Tailwind CSS con colores personalizados definidos
- Integración con Supabase (client, server y admin clients)
- Estructura de carpetas básica para rutas públicas y administrativas
- Dependencias esenciales instaladas (framer-motion, lucide-react, react-hook-form, zod, etc.)

## Arquitectura Elegida

Se decidió mantener y mejorar la estructura existente siguiendo las directrices del PROMPT 00, ya que ya estaba alineada con las mejores prácticas solicitadas. La arquitectura se basa en:

1. **Separación clara de responsabilidades** entre web pública, panel admin y componentes compartidos
2. **Uso correcto de Server vs Client Components** de Next.js
3. **Estrategia de acceso a datos** clara con Supabase
4. **Escalabilidad** para futuras funcionalidades (PWA, CMS avanzado, etc.)

## Estructura de Carpetas Final

```text
src/
├── app/
│   ├── (public)/
│   │   ├──page.tsx
│   │   ├──layout.tsx
│   │   ├──santuario/
│   │   │   ├──page.tsx
│   │   │   ├──historia/
│   │   │   │   └──page.tsx
│   │   │   ├──nuestra-senora/
│   │   │   │   └──page.tsx
│   │   │   ├──arquitectura/
│   │   │   │   └──page.tsx
│   │   │   ├──patrimonio/
│   │   │   │   └──page.tsx
│   │   │   └──archivo-historico/
│   │   │       └──page.tsx
│   │   ├──fe/
│   │   │   ├──page.tsx
│   │   │   ├──misas/
│   │   │   │   └──page.tsx
│   │   │   ├──sacramentos/
│   │   │   │   └──page.tsx
│   │   │   ├──solicitar-misa/
│   │   │   │   └──page.tsx
│   │   │   └──solicitar-sacramento/
│   │   │       └──page.tsx
│   │   ├──festividades/
│   │   │   ├──page.tsx
│   │   │   └──virgen-de-cocharcas/
│   │   │       └──page.tsx
│   │   ├──visita/
│   │   │   ├──page.tsx
│   │   │   └──como-llegar/
│   │   │       └──page.tsx
│   │   ├──noticias/
│   │   │   ├──page.tsx
│   │   │   └──[slug]/
│   │   │       └──page.tsx
│   │   ├──eventos/
│   │   │   ├──page.tsx
│   │   │   └──[slug]/
│   │   │       └──page.tsx
│   │   ├──galeria/
│   │   │   └──page.tsx
│   │   └──contacto/
│   │       └──page.tsx
│   │
│   ├──admin/
│   │   ├──layout.tsx
│   │   ├──login/
│   │   │   └──page.tsx
│   │   ├──dashboard/
│   │   │   └──page.tsx
│   │   ├──contenido/
│   │   │   ├──layout.tsx
│   │   │   ├──page.tsx
│   │   │   ├──inicio/
│   │   │   │   └──page.tsx
│   │   │   └──santuario/
│   │   │       └──page.tsx
│   │   ├──noticias/
│   │   │   ├──layout.tsx
│   │   │   ├──page.tsx
│   │   │   ├──nueva/
│   │   │   │   └──page.tsx
│   │   │   ├──[id]/
│   │   │   │   ├──page.tsx
│   │   │   │   └──editar/
│   │   │       └──page.tsx
│   │   │   └──eliminar/
│   │   │       └──page.tsx
│   │   ├──eventos/
│   │   │   ├──layout.tsx
│   │   │   ├──page.tsx
│   │   │   ├──nuevo/
│   │   │   │   └──page.tsx
│   │   │   ├──[id]/
│   │   │   │   ├──page.tsx
│   │   │   │   └──editar/
│   │   │   │       └──page.tsx
│   │   │   └──eliminar/
│   │   │       └──page.tsx
│   │   ├──galeria/
│   │   │   ├──layout.tsx
│   │   │   ├──page.tsx
│   │   │   ├──subir/
│   │   │   │   └──page.tsx
│   │   │   └──[id]/
│   │   │       ├──page.tsx
│   │   │       └──editar/
│   │   │           └──page.tsx
│   │   ├──pastoral/
│   │   │   ├──layout.tsx
│   │   │   ├──page.tsx
│   │   │   ├──misas/
│   │   │   │   ├──page.tsx
│   │   │   │   └_programar/
│   │   │   │       └──page.tsx
│   │   │   ├──sacramentos/
│   │   │   │   ├──page.tsx
│   │   │   │   └_otorgar/
│   │   │   │       └──page.tsx
│   │   │   └_solicitudes/
│   │   │       ├──layout.tsx
│   │   │       ├──page.tsx
│   │   │       ├──misas/
│   │   │       │   └──page.tsx
│   │   │       └_sacramentos/
│   │   │           └──page.tsx
│   │   ├──solicitudes/
│   │   │   ├──layout.tsx
│   │   │   ├──page.tsx
│   │   │   ├──misas/
│   │   │   │   └──page.tsx
│   │   │   └_sacramentos/
│   │   │       └──page.tsx
│   │   ├──usuarios/
│   │   │   ├──layout.tsx
│   │   │   ├──page.tsx
│   │   │   ├──nuevo/
│   │   │   │   └──page.tsx
│   │   │   ├──[id]/
│   │   │   │   ├──page.tsx
│   │   │   │   └_editar/
│   │   │   │       └──page.tsx
│   │   │   └_roles/
│   │   │       └──page.tsx
│   │   └_configuracion/
│   │       ├──layout.tsx
│   │       ├──page.tsx
│   │       ├──general/
│   │       │   └──page.tsx
│   │       └_seo/
│   │           └──page.tsx
│   │
│   ├──api/
│   │   └_route.ts
│   │
│   ├──layout.tsx
│   ├──globals.css
│   ├──sitemap.ts
│   └robots.ts
│
├──components/
│   ├──ui/                           # Componentes UI básicos (shadcn/ui)
│   │   ├──button.tsx
│   │   ├──input.tsx
│   │   ├──textarea.tsx
│   │   ├──select.tsx
│   │   ├──checkbox.tsx
│   │   ├──radio-group.tsx
│   │   ├──dropdown-menu.tsx
│   │   ├──tooltip.tsx
│   │   ├──sonner/
│   │   │   └──toaster.tsx
│   │   └_sonner/
│   │       └_toaster.tsx
│   │
│   ├──public/                       # Componentes específicos del sitio público
│   │   ├──layout/
│   │   │   ├──header.tsx
│   │   │   ├──footer.tsx
│   │   │   └_nav.tsx
│   │   ├──sections/
│   │   │   ├──hero.tsx
│   │   │   ├──features.tsx
│   │   │   ├──about.tsx
│   │   │   ├──testimonials.tsx
│   │   │   └_cta.tsx
│   │   ├──widgets/
│   │   │   ├──mass-schedule.tsx
│   │   │   ├──events-calendar.tsx
│   │   │   ├──news-carousel.tsx
│   │   │   └_gallery-slider.tsx
│   │   └_forms/
│   │       ├──contact-form.tsx
│   │       └_visit-request.tsx
│   │
│   ├──admin/                        # Componentes específicos del panel admin
│   │   ├──layout/
│   │   │   ├──sidebar.tsx
│   │   │   ├──navbar.tsx
│   │   │   └_breadcrumb.tsx
│   │   ├──forms/
│   │   │   ├──news-form.tsx
│   │   │   ├──event-form.tsx
│   │   │   ├──gallery-form.tsx
│   │   │   ├──user-form.tsx
│   │   │   └_settings-form.tsx
│   │   ├──tables/
│   │   │   ├──news-table.tsx
│   │   │   ├──events-table.tsx
│   │   │   ├──users-table.tsx
│   │   │   └_requests-table.tsx
│   │   ├──cards/
│   │   │   ├──stats-card.tsx
│   │   │   ├──recent-activity-card.tsx
│   │   │   └_quick-actions-card.tsx
│   │   └_hooks/
│   │       ├──use-admin.ts
│   │       └_use-protected-route.ts
│   │
│   ├──shared/                       # Componentes compartidos entre public y admin
│   │   ├──layout/
│   │   │   ├──container.tsx
│   │   │   ├──breadcrumb.tsx
│   │   │   └_pagination.tsx
│   │   ├──ui/
│   │   │   ├──badge.tsx
│   │   │   ├──avatar.tsx
│   │   │   ├──toggle.tsx
│   │   │   ├──progress.tsx
│   │   │   └_spinner.tsx
│   │   ├──forms/
│   │   │   ├──form-field.tsx
│   │   │   ├──form-label.tsx
│   │   │   ├──form-error.tsx
│   │   │   └_form-help-text.tsx
│   │   └_modals/
│   │       ├──confirm-modal.tsx
│   │       ├──alert-modal.tsx
│   │       └_image-preview-modal.tsx
│   │
│   ├──forms/                        # Formularios reutilizables con validación
│   │   ├──mass-request-form.tsx
│   │   ├──sacrament-request-form.tsx
│   │   ├──contact-form.tsx
│   │   ├──newsletter-form.tsx
│   │   └_search-form.tsx
│   │
│   ├──gallery/                      # Componentes específicos de galería
│   │   ├──gallery-grid.tsx
│   │   ├──gallery-filter.tsx
│   │   ├──image-lightbox.tsx
│   │   └_video-player.tsx
│   │
│   ├──news/                         # Componentes específicos de noticias
│   │   ├──news-card.tsx
│   │   ├──news-list.tsx
│   │   ├──news-tags.tsx
│   │   └_news-search.tsx
│   │
│   └_events/                        # Componentes específicos de eventos
│       ├──event-card.tsx
│   │   ├──event-list.tsx
│   │   ├──event-calendar.tsx
│   │   └_event-countdown.tsx
│
├──lib/
│   ├──supabase/
│   │   ├──client.ts                 # Cliente para operaciones del navegador
│   │   ├──server.ts                 # Cliente para Server Components y Server Actions
│   │   ├──admin.ts                  # Cliente con service role (solo servidor)
│   │   └_types/
│   │       ├──database.ts           # Tipos generados de Supabase
│   │       └_index.ts               # Exportaciones de tipos
│   │
│   ├──auth/                         # Lógica de autenticación
│   │   ├──session.ts
│   │   ├──providers.ts
│   │   ├──middleware.ts
│   │   └_roles.ts
│   │
│   ├──validations/                  # Esquemas de validación con Zod
│   │   ├──news.ts
│   │   ├──events.ts
│   │   ├──gallery.ts
│   │   ├──requests.ts
│   │   ├──users.ts
│   │   └_common.ts
│   │
│   ├──queries/                      # Consultas a Supabase (lecturas)
│   │   ├──news.ts
│   │   ├──events.ts
│   │   ├──gallery.ts
│   │   ├──requests.ts
│   │   ├──users.ts
│   │   └_sections.ts
│   │
│   ├──actions/                      # Server Actions (mutaciones)
│   │   ├──news.ts
│   │   ├──events.ts
│   │   ├──gallery.ts
│   │   ├──requests.ts
│   │   ├──users.ts
│   │   └_sections.ts
│   │
│   ├──utils/                        # Utilidades transversales
│   │   ├──date.ts
│   │   ├──string.ts
│   │   ├──image.ts
│   │   ├──slug.ts
│   │   ├──storage.ts
│   │   └_constants.ts
│   │
│   └_constants/                     # Constantes de la aplicación
│       ├──site.ts
│       ├──navigation.ts
│       ├──roles.ts
│       └_seo.ts
│
├──types/                            # Tipos de la aplicación (no generados por Supabase)
│   ├──news.ts
│   ├──events.ts
│   ├──gallery.ts
│   ├──requests.ts
│   ├──users.ts
│   ├──sections.ts
│   └_settings.ts
│
├──config/                           # Configuraciones de la aplicación
│   ├──site.ts
│   ├──menu.ts
│   └_seo.ts
│
├──scripts/                          # Scripts de utilidad
│   ├──seed.ts
│   └_migrate.ts
│
│   ├── styles/                            # Estilos globales y temáticos
    ├──globals.css
    ├──animations.css
    └_variables.css
```

## Dependencias

Se mantuvieron las dependencias existentes y se agregaron algunas necesarias para completar la arquitectura:

### Dependencias existentes (mantener):
- `@supabase/supabase-js` ^2.39.0
- `class-variance-authority` ^0.7.0
- `clsx` ^2.1.0
- `framer-motion` ^11.0.0
- `lucide-react` ^0.300.0
- `next` 14.1.0
- `react` ^18.2.0
- `react-dom` ^18.2.0
- `react-hook-form` ^7.50.0
- `tailwind-merge` ^2.2.0
- `zod` ^3.22.0

### Dependencias de desarrollo existentes (mantener):
- `@types/node` ^20.11.0
- `@types/react` ^18.2.48
- `@types/react-dom` ^18.2.18
- `autoprefixer` ^10.4.17
- `eslint` ^8.56.0
- `eslint-config-next` 14.1.0
- `postcss` ^8.4.33
- `tailwindcss` ^3.4.1
- `typescript` ^5.3.3

### Nuevas dependencias recomendadas:
- `@tanstack/react-query` ^5.0.0 (para estado de servidor avanzado)
- `@headlessui/react` ^1.7.0 (componentes accesibles)
- `@radix-ui/react-icons` ^1.3.0 (iconos)
- `sonner` ^1.4.0 (sistema de notificaciones)
- `date-fns` ^3.3.0 (manipulación de fechas)
- `clsx` ^2.1.0 (ya estaba incluida)
- `tailwind-merge` ^2.2.0 (ya estaba incluida)

## Decisiones Importantes

### 1. Estructura de Rutas
Se utilizó el App Router de Next.js con agrupación de rutas mediante `(public)` para separar claramente las rutas públicas de las administrativas. Esto permite:
- Layouts distintos para público y admin
- Mejor organización del código
- Facilidad para agregar grupaciones futuras (ej: `(api)`, `(auth)`)

### 2. Server Components vs Client Components
- **Server Components por defecto**: Para páginas que no requieren interactividad (páginas de noticias, eventos, galería, información estática)
- **Client Components solo cuando necesario**: Para formularios, componentes interactivos, estado local, efectos del navegador, mapas, etc.
- Esto optimiza el rendimiento reduciendo el JavaScript enviado al cliente

### 3. Estrategia de Acceso a Datos con Supabase
- **Browser Client**: Operaciones permitidas desde el cliente (lecturas públicas, autenticación)
- **Server Client**: Operaciones desde Server Components y Server Actions (lecturas protegidas, escritura segura)
- **Admin Client**: Operaciones administrativas exclusivamente del lado servidor (usando service role key)
- Nunca se expone la Service Role Key al navegador

### 4. Manejo de Estado
- **React Query** para estado de servidor avanzado (caché, invalidación, actualización en segundo plano)
- **useState** y **useReducer** para estado local de componentes
- **Context API** limitado a temas específicos (tema, idioma, etc.)

### 5. Formularios y Validación
- **React Hook Form** para manejo de formularios
- **Zod** para esquemas de validación
- Validación tanto en cliente como en servidor (mediante Server Actions)

### 6. Autenticación y Autorización
- **Supabase Auth** para gestión de usuarios
- **Middleware** para proteger rutas administrativas
- **Roles definidos**: SUPER_ADMIN, ADMIN_PARROQUIA, EDITOR, RESPONSABLE_PASTORAL
- Protección de rutas en servidor ( middleware) y cliente (hooks personalizados)

### 7. Optimización de Imágenes
- **next/image** para todas las imágenes
- Optimización automática, tamaños responsive, lazy loading
- Placeholders difuminados para mejor experiencia de carga
- Configuración de dominios en next.config.js para imágenes externas

### 8. SEO y Rendimiento
- **metadata.ts** en cada segmento para metadata dinámica
- **sitemap.ts** generado dinámicamente desde Supabase
- **robots.txt** estático pero configurable
- **Open Graph** y **Twitter Cards** en componentes compartidos
- **JSON-LD** para datos estructurados
- **Lazy loading** de componentes no críticos
- **Code splitting** automático de Next.js

### 9. Manejo de Errores y Estados de Carga
- **error.tsx** en niveles apropiados de la jerarquía de rutas
- **loading.tsx** para estados de espera
- **not-found.tsx** para rutas inexistentes
- Estados de UI: loading, success, empty, error en todas las páginas dinámicas

### 10. Internacionalización (i18n) Preparada
- Estructura preparada para futura implementación de i18n
- Textos extraídos a constantes donde aplica
- Rutas preparadas para soportar prefijos de idioma (/es/, /en/, etc.)

### 11. Preparación para PWA
- Manifest y service worker configurables mediante next-pwa
- Estrategia de cacheo para trabajos en segundo plano
- Componentes diseñados para funcionar offline cuando sea apropiado

## Archivos Creados o Modificados

### Archivos creados:
1. `ARCHITECTURE.md` - Este documento
2. Estructura completa de carpetas bajo `src/` como se detalla arriba
3. Archivos de ejemplo para establecer la estructura (page.tsx vacío en cada ruta)

### Archivos modificados:
1. **package.json** - Actualizada para reflejar dependencias recomendadas
2. **tsconfig.json** - Verificada y mantenida
3. **next.config.js** - Añadidos dominios para imágenes y configuración de seguridad
4. **tailwind.config.js** - Mantenida con posibilidad de extender
5. **src/app/layout.tsx** - Mejorada para incluir fuentes y metadata básica
6. **src/app/globals.css** - Mejorada con variables CSS y utilities
7. **src/lib/supabase/** - Verificados y mejorados los archivos existentes
8. **src/types/database.ts** - Mantenido como referencia a tipos generados

### Archivos que se crearán en fases posteriores:
- Todos los archivos page.tsx específicos para cada ruta
- Componentes UI y de dominio
- Librerías de utilidades,validaciones,queries,actions
- Tipos de dominio en src/types/
- Configuraciones en src/config/
- Scripts en src/scripts/
- Estilos en src/styles/

## Verificación

Se ejecutaron las siguientes verificaciones:
1. **Lint**: `npm run lint` - Pasó sin errores
2. **TypeScript**: `npx tsc --noEmit` - Pasó sin errores
3. **Build**: `npm run build` - Pasó exitosamente
4. **Dev server**: `npm run dev` - Inició correctamente en http://localhost:3000

El proyecto continúa arrancando correctamente y todas las importaciones son válidas.

## Próximos Pasos (Fase 2)

Con esta arquitectura establecida, el siguiente paso sería:
1. Definir el esquema de base de datos en Supabase (PROMPT 02)
2. Implementar la autenticación y protección de rutas
3. Desarrollar los componentes compartidos y UI básicos
4. Crear las primeras páginas públicas (home, santuario, fe)
5. Desarrollar el panel de autenticación de administrador
---

# Seguridad profesional (PROMPT 12)

## Capas de seguridad implementadas

| Capa | Implementacion |
|------|----------------|
| Autenticacion panel | Cookie `admin_session` firmada con HMAC-SHA256 (`ADMIN_SESSION_SECRET`). TTL 8h, httpOnly, sameSite=lax, secure en produccion |
| Verificacion | Middleware (Edge) + layout del panel + cada server action administrativa (defensa en profundidad) |
| Roles | `signIn` verifica profile activo y rol en {SUPER_ADMIN, ADMIN_PARROQUIA, EDITOR, RESPONSABLE_PASTORAL} via service role |
| Server actions admin | Whitelist de tablas (`ADMIN_TABLES`) + sanitizacion de nombres de columna + columnas bloqueadas |
| Rate limiting | En memoria por IP: login 5/5min, seguimiento 10/5min, formularios 5/10min, newsletter 3/10min, escrituras admin 60/min |
| Anti-bots | Honeypot `_hp` en formularios publicos (exito falso silencioso) |
| Validacion | Zod en `src/lib/validations/schemas.ts`: longitudes maximas, formatos de fecha/hora/correo |
| Codigos de seguimiento | CSPRNG 72 bits (`crypto.randomBytes`), formato `MS-XXXXX-XXXXX-XXXXX`; solo se almacena su hash SHA-256 |
| Seguimiento publico | RPC `track_mass_request`/`track_sacrament_request` devuelven SOLO numero, estado y fecha (sin PII) |
| RLS | Migracion 010: elimina politicas legacy permisivas; solicitudes pastorales sin SELECT publico |
| Storage | Bucket `documents` restringido a editorial; buckets publicos: site-assets, news, events, gallery |
| Headers | CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy |
| Auditoria | `audit_logs` para login/logout/insert/update/delete (tabla protegida, lectura solo admin) |
| Secretos | `.gitignore` completo; `ADMIN_SESSION_SECRET` documentado en `.env.example` |

## Archivos clave de seguridad

- `src/lib/security/session.ts` - tokens HMAC (Edge + Node)
- `src/lib/security/guards.ts` - requireAdminPage/requireAdminAction, clientIp, auditLog
- `src/lib/security/rate-limit.ts` - ventana deslizante en memoria
- `src/lib/queries-admin.ts` - consultas del panel (solo servidor, con guardia)
- `supabase/migrations/010_security_hardening.sql` - endurecimiento RLS/Storage/RPC/constraints

## Notas operativas

- Rate limit en memoria cubre una instancia; para multi-instancia migrar a Upstash sin cambiar la API.
- Rotar `ADMIN_SESSION_SECRET` invalida todas las sesiones activas (logout global).
- La service role key jamas sale del servidor: solo `queries-admin.ts` y `actions.ts` la usan.

---

# Sistema de solicitudes pastorales (PROMPT 13)

## Flujo

Publico: /solicitudes/misa o /solicitudes/sacramentos -> formulario con
validacion Zod + honeypot + rate limit -> inserta en BD (RLS insert publico)
-> recibe codigo de seguimiento (72 bits CSPRNG).

Seguimiento: /solicitudes/seguimiento -> RPC track_mass_request /
track_sacrament_request -> solo numero, estado, fecha y hora (sin PII).

Panel: /admin/pastoral/solicitudes -> SolicitudesManager -> filtros por tipo
y estado, detalle completo, cambio de estado y notas internas via la action
updateRequestStatus (sesion firmada + whitelist + auditoria).

## Estados

pending(Recibida) | reviewing(En revision) | confirmed(Aceptada) |
rejected(Rechazada) | completed(Atendida) | cancelled(Cancelada)
Definidos una sola vez en src/lib/constants/request-status.ts.

## Numeracion

Generada por la BD con secuencias (sin colisiones, no editable desde la app):
COC-MSA-AAAA-00001 (misas) y COC-SRA-AAAA-00001 (sacramentos).
Migracion: 011_solicitudes_pastorales.sql.

## Sacramentos configurables

El admin activa/desactiva la disponibilidad de cada sacramento
(tabla sacraments.active) desde /admin/pastoral/sacramentos; el formulario
publico solo muestra los activos. Horarios de misa igualmente administrables.


---

# Panel administrativo profesional (PROMPT 14)

## Estructura final del panel

- Dashboard: contadores (noticias, eventos, fotos, horarios, solicitudes pendientes),
  ultimas solicitudes pendientes y actividad reciente.
- Contenido: inicio, paginas, noticias, eventos, festividades, galeria, FAQ, avisos.
- Pastoral: misas, sacramentos, solicitudes (gestor completo con estados y notas).
- Multimedia > Biblioteca: subida de imagenes al bucket gallery (JPG/PNG/WebP, max 10 MB),
  registro en tabla media, copiar URL y eliminar (storage + fila).
- Configuracion: sitio, contacto, navegacion, SEO, usuarios.
  Usuarios: listado con rol/estado; crear usuario, cambiar rol y activar/desactivar
  (solo SUPER_ADMIN, con proteccion anti autobloqueo).
- Auditoria > Actividad: ultimas 100 acciones (logins, altas, ediciones, estados).

## Reglas del panel

- Todo page del panel pasa por la guarda de sesion firmada (layout + middleware).
- Lecturas privadas via queries-admin.ts (sesion + service role).
- Escrituras via server actions con guard + whitelist + audit_logs.
- La gestion de usuarios exige rol SUPER_ADMIN en la sesion.
