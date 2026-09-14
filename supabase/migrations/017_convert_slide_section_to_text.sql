-- ============================================================================
-- 017 — Convertir slide_section de enum a text
-- Santuario de Nuestra Señora de Cocharcas
--
-- El enum slide_section causaba errores al insertar slides con secciones
-- nuevas (noticias, visita, contacto). Cambiar a TEXT elimina el problema
-- permanentemente: cualquier valor de sección será aceptado.
-- ============================================================================

-- Convertir la columna directamente de enum a text (PostgreSQL lo permite)
alter table public.slides
  alter column section type text using section::text;

-- ============================================================================
-- FIN. La columna section ahora es TEXT: acepta cualquier valor.
-- ============================================================================