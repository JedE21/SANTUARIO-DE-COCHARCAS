-- ============================================================================
-- 015 — REDES SOCIALES DEL FOOTER (Facebook, Instagram, WhatsApp, TikTok)
-- Santuario de Nuestra Señora de Cocharcas
--
-- 1) Nueva columna tiktok_url en site_settings (editable en
--    Configuración → Contacto). WhatsApp ya existía como columna `whatsapp`.
-- 2) La columna whatsapp pasa a interpretarse también como enlace directo
--    (wa.me/<número>) desde el footer si contiene un teléfono.
-- 3) Semillas de ejemplo para que los iconos aparezcan desde el primer día.
--
-- Idempotente: puede ejecutarse varias veces sin daño.
-- ============================================================================

-- 1. Columna TikTok
alter table public.site_settings add column if not exists tiktok_url text;

-- 2. Semillas: solo si el campo está vacío (no pisa datos reales)
update public.site_settings set
  tiktok_url = coalesce(tiktok_url, 'https://www.tiktok.com/@santuariococharcas')
where tiktok_url is null;

-- ============================================================================
-- FIN. El footer muestra Facebook, Instagram, WhatsApp y TikTok, todos
-- editables desde Configuración → Contacto.
-- ============================================================================
