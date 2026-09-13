-- ============================================================================
-- 012 — SISTEMA DE SLIDES POR SECCIÓN
-- Santuario de Nuestra Señora de Cocharcas
--
-- Una sola tabla `slides` reutilizable para todas las secciones con carrusel:
--   home | santuario | fe-peregrinacion | festividades | historia | galeria
--
-- Las imágenes viven en Supabase Storage (bucket "gallery"); la tabla solo
-- guarda la URL. Los textos (title/description/button_*) alimentan el
-- carrusel público. Orden por order_index ASC; ocultos con is_active=false.
--
-- Idempotente: puede ejecutarse varias veces.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Tipo enumerado de secciones (extensible con ALTER TYPE si se agregan)
-- ---------------------------------------------------------------------------
do $$ begin
  create type public.slide_section as enum (
    'home',
    'santuario',
    'fe-peregrinacion',
    'festividades',
    'historia',
    'galeria'
  );
exception
  when duplicate_object then null;
end $$;

-- ---------------------------------------------------------------------------
-- 2. Tabla slides
-- ---------------------------------------------------------------------------
create table if not exists public.slides (
  id uuid primary key default gen_random_uuid(),
  section public.slide_section not null,
  title text not null default '',
  description text,
  image_url text not null,
  button_text text,
  button_url text,
  order_index integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.slides is
  'Slides de carruseles por sección (home, santuario, fe-peregrinacion, festividades, historia, galeria). Imagenes en Storage, solo URL aqui.';

-- Índices: filtro por sección activo + orden estable
create index if not exists idx_slides_section_order
  on public.slides (section, order_index asc);

-- ---------------------------------------------------------------------------
-- 3. updated_at automático (reutiliza moddatetime de la migración 002)
-- ---------------------------------------------------------------------------
drop trigger if exists trg_slides_updated_at on public.slides;
create trigger trg_slides_updated_at
  before update on public.slides
  for each row execute function moddatetime(updated_at);

-- ---------------------------------------------------------------------------
-- 4. RLS: lectura pública solo de slides activos; gestión con sesión editor
-- ---------------------------------------------------------------------------
alter table public.slides enable row level security;

drop policy if exists "slides_public_read" on public.slides;
create policy "slides_public_read" on public.slides
  for select using (is_active = true);

drop policy if exists "slides_admin_manage" on public.slides;
create policy "slides_admin_manage" on public.slides
  for all using (public.is_editor()) with check (public.is_editor());

-- ---------------------------------------------------------------------------
-- 5. Datos iniciales de demostración
--    SOLO imágenes locales ya existentes o Wikimedia Commons (licencia
--    Creative Commons BY-SA). Sin fotografías inventadas.
-- ---------------------------------------------------------------------------
insert into public.slides (section, title, description, image_url, button_text, button_url, order_index, is_active)
select * from (values
  -- HOME (el hero actual consume estas imágenes; el componente SectionSlider las usa)
  ('home'::public.slide_section, 'Santuario de Nuestra Señora de Cocharcas',
   'Fe, historia y tradición en el corazón de los Andes.',
   '/images/santuario/santuario-exterior.jpg', null, null, 0, true),
  ('home'::public.slide_section, 'Fachada del templo',
   'Piedra tallada entre los cerros de Apurímac.',
   '/images/santuario/santuario-plaza.jpg', null, null, 1, true),
  ('home'::public.slide_section, 'Nuestra Señora de Cocharcas',
   'Detalle del óleo colonial que guarda la memoria del pueblo.',
   '/images/santuario/pintura-detalle.jpg', null, null, 2, true),
  ('home'::public.slide_section, 'La imagen de la Virgen',
   'Devoción mariana que atraviesa generaciones.',
   '/images/santuario/pintura-colonial.jpg', null, null, 3, true),

  -- SANTUARIO
  ('santuario'::public.slide_section, 'Fachada del Santuario',
   'Portada principal de piedra tallada, siglo XVII.',
   '/images/santuario/santuario-plaza.jpg', 'Conocer la arquitectura', '/santuario/arquitectura', 0, true),
  ('santuario'::public.slide_section, 'Torres y cúpulas',
   'Silueta del templo entre los cerros de Chincheros.',
   '/images/santuario/santuario-exterior.jpg', 'Historia del templo', '/santuario/historia', 1, true),
  ('santuario'::public.slide_section, 'Patrimonio del santuario',
   'Arte religioso y memoria que se conserva.',
   '/images/santuario/pintura-detalle.jpg', 'Ver el patrimonio', '/santuario/patrimonio', 2, true),

  -- FE Y PEREGRINACIÓN
  ('fe-peregrinacion'::public.slide_section, 'Caminos de fe',
   'Peregrinos que llegan cada año al santuario.',
   '/images/santuario/santuario-exterior.jpg', 'Planifica tu visita', '/visita', 0, true),
  ('fe-peregrinacion'::public.slide_section, 'Oración y devoción',
   'La casa de la Virgen, abierta a todos los pueblos.',
   '/images/santuario/santuario-plaza.jpg', 'Vida de fe', '/fe', 1, true),

  -- FESTIVIDADES
  ('festividades'::public.slide_section, 'Fiesta de la Virgen de Cocharcas',
   'Cada 8 de septiembre, el pueblo celebra a su patrona.',
   '/images/santuario/pintura-colonial.jpg', 'Ver festividades', '/festividades', 0, true),
  ('festividades'::public.slide_section, 'Procesión y devoción popular',
   'Danzas, música y fe que reúne a generaciones.',
   '/images/santuario/pintura-detalle.jpg', 'Conocer el programa', '/festividades', 1, true),

  -- HISTORIA
  ('historia'::public.slide_section, 'Cuatro siglos de devoción',
   'Desde la llegada de la imagen hasta el santuario de piedra.',
   '/images/santuario/santuario-exterior.jpg', 'Conocer la historia', '/santuario/historia', 0, true),
  ('historia'::public.slide_section, 'El óleo de 1751',
   'Testimonio del arte colonial andino.',
   '/images/santuario/pintura-colonial.jpg', 'Ver el patrimonio', '/santuario/patrimonio', 1, true),

  -- GALERÍA
  ('galeria'::public.slide_section, 'El santuario en imágenes',
   'Vistas del templo, las celebraciones y la comunidad.',
   '/images/santuario/santuario-plaza.jpg', 'Explorar la galería', '/galeria', 0, true),
  ('galeria'::public.slide_section, 'La Virgen de Cocharcas',
   'Imagen venerada en Apurímac desde 1598.',
   '/images/santuario/virgen-cocharcas.jpg', 'Conocer a la Virgen', '/santuario/nuestra-senora', 1, true)
) as seed
where not exists (select 1 from public.slides limit 1);
