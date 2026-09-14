-- ============================================================================
-- 016 — Agregar secciones faltantes al enum slide_section
-- Santuario de Nuestra Señora de Cocharcas
--
-- Las secciones 'noticias', 'visita' y 'contacto' están en el código
-- pero no se agregaron al enum de la BD. Esto causa error al crear slides.
-- ============================================================================

do $$ begin
  alter type public.slide_section add value if not exists 'noticias';
exception
  when duplicate_object then null;
end $$;

do $$ begin
  alter type public.slide_section add value if not exists 'visita';
exception
  when duplicate_object then null;
end $$;

do $$ begin
  alter type public.slide_section add value if not exists 'contacto';
exception
  when duplicate_object then null;
end $$;
