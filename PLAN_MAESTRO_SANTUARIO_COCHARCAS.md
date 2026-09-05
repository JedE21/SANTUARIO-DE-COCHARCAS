# PLAN MAESTRO — WEB OFICIAL DEL SANTUARIO DE COCHARCAS

## 1. Objetivo general

Crear una plataforma web **institucional, pastoral, histórica, cultural y turística** para el Santuario de Nuestra Señora de Cocharcas.

La plataforma tendrá dos grandes áreas:

### Área pública

- Información del Santuario.
- Historia.
- Nuestra Señora de Cocharcas.
- Patrimonio.
- Festividades.
- Noticias.
- Eventos.
- Galería.
- Información para visitantes.
- Ubicación y contacto.
- Solicitud de misas.
- Solicitud de sacramentos.
- Formularios pastorales.

### Área administrativa

El **Padre Alfredo**, encargado actual, será el administrador principal.

Podrá:

- Administrar contenido.
- Publicar noticias.
- Gestionar eventos.
- Administrar fotografías.
- Modificar la página principal.
- Gestionar solicitudes.
- Administrar información de contacto.
- Administrar páginas.
- Administrar avisos.
- Gestionar contenido SEO.
- Administrar información institucional.

El desarrollador del proyecto es:

> **Ing. de Sistemas José J. Echegaray Díaz; Cocharquino de corazón**

---

# 2. Arquitectura general

```text
                    INTERNET
                       │
                       ▼
                ┌─────────────┐
                │   NEXT.JS   │
                │   Frontend  │
                └──────┬──────┘
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
        ÁREA PÚBLICA          ADMIN
             │                   │
             └─────────┬─────────┘
                       ▼
                   SUPABASE
             ┌─────────┼─────────┐
             ▼         ▼         ▼
        PostgreSQL   Storage     Auth
             │
             ▼
            RLS
```

---

# 3. Stack tecnológico

## Frontend

- Next.js
- TypeScript
- App Router
- Server Components
- Client Components solamente cuando sean necesarios

## UI

- Tailwind CSS
- Design System propio

## Animaciones

- Motion

Usarlo para:

- Scroll reveal.
- Transiciones.
- Carruseles.
- Menús.
- Microinteracciones.
- Animaciones de entrada.

## Backend

Supabase:

- PostgreSQL.
- Authentication.
- Storage.
- Row Level Security.
- Edge Functions cuando sean necesarias.

## Validación

- Zod.

## Formularios

- React Hook Form + Zod, si resulta conveniente para el proyecto.

## Iconos

Una única librería consistente, preferentemente Lucide si ya está instalada.

## Hosting

- Vercel como primera opción.

---

# 4. Prompts principales

El proyecto completo se divide en **16 prompts**, desde PROMPT 00 hasta PROMPT 15.

```text
PROMPT 00 — Contexto maestro
PROMPT 01 — Arquitectura del proyecto
PROMPT 02 — Base de datos + Supabase
PROMPT 03 — Auth + roles + seguridad
PROMPT 04 — Design System
PROMPT 05 — Layout general
PROMPT 06 — Página principal
PROMPT 07 — Páginas institucionales
PROMPT 08 — Noticias + eventos + festividades + galería
PROMPT 09 — CMS completo
PROMPT 10 — Diseño premium + Motion
PROMPT 11 — SEO + performance + accesibilidad
PROMPT 12 — Seguridad profesional
PROMPT 13 — Sistema de solicitudes pastorales
PROMPT 14 — Panel administrativo profesional
PROMPT 15 — Auditoría final + producción
```

---

# 5. PROMPT 00 — CONTEXTO MAESTRO

Definir:

- Qué es el Santuario.
- Objetivo de la web.
- Público objetivo.
- Padre Alfredo como administrador.
- José J. Echegaray Díaz como desarrollador.
- Identidad visual.
- Alcance.
- Funcionalidades.
- Reglas técnicas.
- Reglas de contenido.

### Resultado

El agente entiende qué está construyendo antes de tocar código.

---

# 6. PROMPT 01 — ARQUITECTURA

Definir:

```text
Next.js
TypeScript
Tailwind
Supabase
PostgreSQL
Auth
Storage
RLS
Motion
```

Estructura aproximada:

```text
src/
├── app/
├── components/
├── lib/
├── hooks/
├── types/
├── services/
├── actions/
└── ...
```

### Resultado

Base profesional y escalable.

---

# 7. PROMPT 02 — BASE DE DATOS + SUPABASE

Tablas iniciales:

```text
profiles
site_settings
navigation_items
footer_settings
pages
home_sections
announcements
news
events
festivities
gallery_albums
gallery_images
sacrament_types
mass_requests
sacrament_requests
contact_messages
faqs
media
audit_logs
```

Definir:

- Relaciones.
- Índices.
- Constraints.
- Estados.
- Fechas.
- Slugs.
- Soft delete cuando corresponda.
- RLS.
- Storage.

### Resultado

Base de datos lista para crecer.

---

# 8. PROMPT 03 — AUTH + ROLES + SEGURIDAD

Roles:

```text
SUPER_ADMIN
ADMIN
EDITOR
```

Ejemplo:

```text
Padre Alfredo → ADMIN
Desarrollador → SUPER_ADMIN
```

Implementar:

- Supabase Auth.
- Protección de rutas.
- Middleware.
- Permisos.
- RLS.
- Auditoría.
- Seguridad de Storage.

### Regla

Nunca confiar únicamente en la interfaz para controlar permisos.

---

# 9. PROMPT 04 — DESIGN SYSTEM

La estética debe inspirarse en:

- Arquitectura colonial.
- Patrimonio.
- Espiritualidad.
- Piedra.
- Madera.
- Dorado envejecido.
- Tonos cálidos.
- Blanco cálido.

Evitar:

- Neón.
- Colores excesivamente saturados.
- Gradientes excesivos.
- Glassmorphism exagerado.
- Sombras gigantes.
- Animaciones innecesarias.

Componentes:

```text
Button
Card
Badge
SectionHeader
Container
Modal
Toast
Skeleton
EmptyState
```

Objetivo:

> Patrimonio histórico + espiritualidad + diseño moderno.

---

# 10. PROMPT 05 — LAYOUT GENERAL

Crear:

```text
Header
Navigation
MobileNavigation
Footer
AnnouncementBar
```

El footer debe incluir:

> Desarrollado por: Ing. de Sistemas José J. Echegaray Díaz; Cocharquino de corazón

La frase debe aparecer de manera elegante y no invasiva.

---

# 11. PROMPT 06 — PÁGINA PRINCIPAL

Estructura recomendada:

```text
Hero
↓
Introducción
↓
Nuestra Señora de Cocharcas
↓
Historia
↓
Patrimonio
↓
Festividad
↓
Noticias
↓
Eventos
↓
Galería
↓
Visita
↓
Solicitudes
↓
CTA final
↓
Footer
```

El Hero debe ser visualmente importante y utilizar fotografías reales cuando estén disponibles.

---

# 12. PROMPT 07 — PÁGINAS INSTITUCIONALES

Crear:

```text
/santuario
/historia
/nuestra-senora
/patrimonio
/festividades
/fe
/sacramentos
/visita
/contacto
```

Separar correctamente:

- Historia documentada.
- Tradición oral.
- Devoción popular.

No inventar datos históricos.

---

# 13. PROMPT 08 — NOTICIAS + EVENTOS + FESTIVIDADES + GALERÍA

## Noticias

Funciones:

- Crear.
- Editar.
- Publicar.
- Despublicar.
- Destacar.
- Gestionar slug.
- Imagen.
- SEO.

## Eventos

Campos:

- Fecha.
- Hora.
- Lugar.
- Descripción.
- Imagen.
- Estado.

## Festividades

Gestionar:

- Nombre.
- Fecha.
- Descripción.
- Programa.
- Imágenes.
- Estado.

## Galería

```text
Álbum
├── Imagen
├── Imagen
├── Imagen
└── ...
```

Cada imagen puede tener:

- Alt.
- Caption.
- Crédito.

---

# 14. PROMPT 09 — CMS COMPLETO

Todo el contenido institucional importante debe poder administrarse desde:

```text
/admin
```

El administrador podrá modificar:

- Home.
- Textos.
- Imágenes.
- Noticias.
- Eventos.
- Páginas.
- Contacto.
- Redes sociales.
- Avisos.
- SEO.
- Navegación.
- FAQ.

Flujo:

```text
Editar
↓
Guardar borrador
↓
Vista previa
↓
Publicar
↓
Revalidar página pública
```

No publicar automáticamente.

No convertir el proyecto en un page builder excesivamente complejo.

---

# 15. PROMPT 10 — DISEÑO PREMIUM + MOTION

Perfeccionar:

- Motion.
- Scroll reveal.
- Parallax sutil.
- Galerías.
- Lightbox.
- Microinteracciones.
- Responsive.
- Mobile menu.
- Skeletons.
- Loading states.
- Empty states.
- Error states.
- Página 404.
- Accesibilidad.

Regla principal:

> Menos efectos, más elegancia.

Respetar:

```text
prefers-reduced-motion
```

No sacrificar rendimiento por efectos visuales.

---

# 16. PROMPT 11 — SEO + PERFORMANCE + ACCESIBILIDAD

## SEO

Implementar:

```text
Metadata
Open Graph
Canonical
Sitemap
Robots
Structured Data
```

Metadata dinámica para:

- Noticias.
- Eventos.
- Páginas.
- Galerías cuando corresponda.

## Performance

Optimizar:

- Imágenes.
- Fuentes.
- JavaScript.
- Server Components.
- Lazy loading.
- Caché.
- Bundle size.

## Accesibilidad

Revisar:

- WCAG.
- Contraste.
- Navegación con teclado.
- Focus.
- Labels.
- Alt.
- Headings.
- ARIA.

---

# 17. PROMPT 12 — SEGURIDAD PROFESIONAL

Auditar:

```text
RLS
Auth
Middleware
API
Server Actions
Storage
Uploads
Forms
Rate limiting
CSRF
XSS
SQL Injection
HTML sanitization
```

Especial atención a:

- Solicitudes pastorales.
- Datos personales.
- Archivos subidos.
- Contenido HTML.
- Permisos administrativos.

Un usuario nunca debe poder consultar solicitudes de otra persona.

---

# 18. PROMPT 13 — SISTEMA DE SOLICITUDES PASTORALES

## Misas

Permitir:

- Solicitar misa.
- Intención.
- Fecha.
- Horario.
- Nombre del solicitante.
- Contacto.
- Observaciones.

## Sacramentos

Preparar tipos configurables:

```text
Bautismo
Matrimonio
Confirmación
Primera Comunión
```

No asumir que todos estarán disponibles permanentemente.

El administrador podrá configurar los sacramentos disponibles.

## Seguimiento

Generar código:

```text
COC-2026-00482
```

Estados:

```text
Recibida
En revisión
Aceptada
Rechazada
Atendida
Cancelada
```

Los usuarios solamente podrán consultar sus solicitudes mediante el mecanismo seguro diseñado.

---

# 19. PROMPT 14 — PANEL ADMINISTRATIVO

Dashboard:

```text
Dashboard

Contenido
├── Inicio
├── Páginas
├── Noticias
├── Eventos
├── Festividades
├── Galería
├── FAQ
└── Avisos

Pastoral
├── Misas
├── Sacramentos
└── Solicitudes

Multimedia
└── Biblioteca

Configuración
├── Sitio
├── Contacto
├── Navegación
├── SEO
└── Usuarios

Auditoría
└── Actividad
```

Dashboard con:

- Noticias publicadas.
- Eventos.
- Fotos.
- Solicitudes pendientes.
- Actividad reciente.

El panel debe priorizar productividad sobre decoración.

---

# 20. PROMPT 15 — AUDITORÍA FINAL + PRODUCCIÓN

Realizar revisión completa.

## Código

```text
npm run lint
```

TypeScript.

```text
npm run build
```

Corregir errores reales.

## Seguridad

Revisar:

- RLS.
- Auth.
- Storage.
- Routes.
- Forms.
- Permissions.

## Performance

Revisar:

- Imágenes.
- JavaScript.
- CSS.
- Fuentes.
- Caché.
- Client Components.

## SEO

Revisar:

- Metadata.
- Sitemap.
- Robots.
- Canonical.
- Open Graph.
- Structured Data.

## UX

Probar:

- Mobile.
- Tablet.
- Desktop.
- Accesibilidad.

## Funcionalidad

Probar:

```text
Home
Noticias
Eventos
Galería
Historia
Patrimonio
Solicitudes
Misas
Sacramentos
Contacto
Login
Admin
CMS
```

---

# 21. MAPA FINAL DE LA WEB

```text
/
│
├── /santuario
├── /nuestra-senora
├── /historia
├── /patrimonio
├── /festividades
├── /fe
├── /sacramentos
│
├── /noticias
│   └── /[slug]
│
├── /eventos
│   └── /[slug]
│
├── /galeria
│   └── /[slug]
│
├── /visita
│
├── /solicitudes
│   ├── /misa
│   ├── /sacramentos
│   └── /seguimiento
│
└── /contacto
```

---

# 22. PANEL ADMINISTRATIVO FINAL

```text
/admin
│
├── dashboard
│
├── contenido
│   ├── inicio
│   ├── paginas
│   ├── noticias
│   ├── eventos
│   ├── festividades
│   ├── galeria
│   ├── faq
│   └── avisos
│
├── pastoral
│   ├── misas
│   ├── sacramentos
│   └── solicitudes
│
├── multimedia
│   └── biblioteca
│
├── configuracion
│   ├── sitio
│   ├── contacto
│   ├── navegacion
│   └── seo
│
└── auditoria
```

---

# 23. MODELO DE DATOS FINAL

```text
profiles
roles

site_settings
navigation_items
footer_settings

home_sections
pages

news
events
festivities

gallery_albums
gallery_images
media

announcements
faqs

sacrament_types
mass_requests
sacrament_requests
contact_messages

audit_logs
```

Preparar arquitectura para futuras tablas:

```text
notifications
analytics
donations
volunteers
pilgrimages
```

---

# 24. EXPERIENCIA DEL VISITANTE

Una persona llega desde Google y encuentra:

> Santuario de Nuestra Señora de Cocharcas

Después puede descubrir:

- Historia.
- Nuestra Señora.
- Patrimonio.
- Festividades.
- Noticias.
- Eventos.
- Galería.
- Información pastoral.
- Ubicación.
- Contacto.

La experiencia debe ser clara tanto para:

- visitantes locales;
- peregrinos;
- turistas;
- investigadores;
- devotos;
- público general.

---

# 25. PARTE PASTORAL

Crear una sección clara:

## Vida pastoral

```text
Misas
Sacramentos
Confesiones
Celebraciones
Intenciones
Solicitudes
```

Todo horario y disponibilidad deberá poder ser administrado.

No inventar horarios.

---

# 26. PARTE CULTURAL

Crear:

## Patrimonio

```text
Arquitectura
Historia
Arte religioso
Archivo histórico
Restauración
Tradiciones
Peregrinación
```

La información histórica debe estar respaldada por fuentes confiables.

---

# 27. PARTE TURÍSTICA

Crear:

## Planifica tu visita

```text
Ubicación
Cómo llegar
Qué visitar
Festividades
Galería
Contacto
Información pastoral
```

Futuras opciones:

```text
Hospedaje
Restaurantes
Transporte
Guías
```

Solo cuando exista información oficial o confiable.

---

# 28. REGLAS HISTÓRICAS Y DE CONTENIDO

No inventar información.

Cuando exista una tradición:

distinguir entre:

```text
Fuente documental
Tradición oral
Devoción popular
```

No presentar una tradición como un hecho histórico demostrado.

Todo contenido histórico importante debe poder asociarse a una fuente o referencia.

---

# 29. FOTOGRAFÍA

Priorizar fotografías reales del:

- Santuario.
- Virgen.
- Plaza.
- Arquitectura.
- Festividades.
- Procesiones.
- Peregrinos.
- Paisajes.
- Comunidad.
- Patrimonio.

No llenar la web de imágenes generadas por IA.

Todas las imágenes importantes deben tener:

```text
alt
caption opcional
crédito opcional
```

---

# 30. FUTURAS VERSIONES

## V2

```text
Donaciones
Calendario pastoral
Registro de peregrinos
Voluntariado
Streaming de misas
Boletines
```

## V3

```text
Aplicación móvil
Sistema de peregrinaciones
```

La arquitectura actual debe permitir estas ampliaciones sin rehacer todo el sistema.

---

# 31. ORDEN EXACTO DE EJECUCIÓN

```text
PROMPT 00
     ↓
PROMPT 01
     ↓
PROMPT 02
     ↓
PROMPT 03
     ↓
PROMPT 04
     ↓
PROMPT 05
     ↓
PROMPT 06
     ↓
PROMPT 07
     ↓
PROMPT 08
     ↓
PROMPT 09
     ↓
PROMPT 10
     ↓
PROMPT 11
     ↓
PROMPT 12
     ↓
PROMPT 13
     ↓
PROMPT 14
     ↓
PROMPT 15
     ↓
PRODUCCIÓN
```

---

# 32. REGLA PARA DEEPSEEK/CODEX

En **cada prompt**, el agente debe comenzar inspeccionando el estado actual del proyecto.

Debe respetar:

> **INSPECCIONA PRIMERO EL ESTADO ACTUAL DEL PROYECTO Y CONTINÚA SOBRE LO EXISTENTE. NO REINICIALICES EL PROYECTO NI BORRES IMPLEMENTACIONES FUNCIONALES.**

No debe:

- Reinicializar Next.js.
- Borrar componentes funcionales.
- Duplicar tablas.
- Duplicar componentes.
- Cambiar tecnologías sin justificación.
- Romper Supabase.
- Romper RLS.
- Romper el CMS.
- Romper las solicitudes.
- Hardcodear contenido que ya es administrable.
- Exponer datos privados.
- Utilizar Service Role Key en el cliente.
- Introducir dependencias innecesarias.

---

# 33. OBJETIVO FINAL

El resultado debe sentirse:

**ELEGANTE**

**ESPIRITUAL**

**HISTÓRICO**

**CULTURAL**

**MODERNO**

**PROFESIONAL**

**RÁPIDO**

**ACCESIBLE**

**ESCALABLE**

La web debe representar dignamente al Santuario de Nuestra Señora de Cocharcas y, al mismo tiempo, permitir que el Padre Alfredo pueda administrarla sin depender del desarrollador para los cambios cotidianos.

---

# 34. IDENTIDAD DEL PROYECTO

### Encargado pastoral

**Padre Alfredo**

### Desarrollador

**Ing. de Sistemas José J. Echegaray Díaz**

### Firma del proyecto

> **Desarrollado por: Ing. de Sistemas José J. Echegaray Díaz; Cocharquino de corazón**

### Filosofía

> Preservar la historia, fortalecer la fe y acercar el Santuario de Cocharcas al mundo mediante la tecnología.

