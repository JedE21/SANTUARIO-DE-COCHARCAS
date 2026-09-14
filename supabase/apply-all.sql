-- ============================================================================
-- APLICAR TODAS LAS MIGRACIONES — Santuario de Cocharcas
--
-- Pega este archivo completo en el SQL Editor de Supabase y ejecútalo.
-- Es IDEMPOTENTE: puedes ejecutarlo varias veces sin romper nada.
--
-- Equivale a aplicar: 012 (slides) → 013 (historia) → 014 (footer + reparación).
-- Deja la base en el estado que espera el panel de administración: los cambios
-- de slides, historia, footer y navegación se guardarán de verdad.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Funciones de rol/auditoría usadas por las políticas RLS
-- ---------------------------------------------------------------------------
create or replace function public.current_role_name()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((
    select r.name
    from profiles p
    left join roles r on r.id = p.role_id
    where p.user_id = auth.uid()
      and p.active = true
    limit 1
  ), '');
$$;

create or replace function public.is_editor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_role_name() in ('SUPER_ADMIN', 'ADMIN_PARROQUIA', 'EDITOR', 'RESPONSABLE_PASTORAL');
$$;

-- ---------------------------------------------------------------------------
-- updated_at automático (moddatetime)
-- ---------------------------------------------------------------------------
create extension if not exists moddatetime with schema extensions;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- FOOTER: columnas editables nuevas
-- ---------------------------------------------------------------------------
alter table public.footer_settings add column if not exists signature_text text;
alter table public.footer_settings add column if not exists photos_credit_text text;
alter table public.footer_settings add column if not exists show_contact_data boolean not null default true;

update public.footer_settings set
  signature_text = coalesce(signature_text, 'Cocharquino de corazón.'),
  photos_credit_text = coalesce(photos_credit_text, 'Fotografías: Wikimedia Commons, licencias Creative Commons BY-SA.')
where signature_text is null or photos_credit_text is null;

-- ---------------------------------------------------------------------------
-- SLIDES: enum de secciones + tabla + RLS
-- ---------------------------------------------------------------------------
do $$ begin
  create type public.slide_section as enum (
    'home', 'santuario', 'fe-peregrinacion', 'festividades', 'historia', 'galeria'
  );
exception
  when duplicate_object then null;
end $$;

-- ALTER TYPE ... ADD VALUE se ejecuta en bloques separados (requisito de PG)
do $$ begin
  alter type public.slide_section add value if not exists 'eventos';
exception when others then null; end $$;

do $$ begin
  alter type public.slide_section add value if not exists 'noticias';
exception when others then null; end $$;

do $$ begin
  alter type public.slide_section add value if not exists 'visita';
exception when others then null; end $$;

do $$ begin
  alter type public.slide_section add value if not exists 'contacto';
exception when others then null; end $$;

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

create index if not exists idx_slides_section_order
  on public.slides (section, order_index asc);

drop trigger if exists trg_slides_updated_at on public.slides;
create trigger trg_slides_updated_at
  before update on public.slides
  for each row execute function moddatetime(updated_at);

alter table public.slides enable row level security;

drop policy if exists "slides_public_read" on public.slides;
create policy "slides_public_read" on public.slides
  for select using (is_active = true);

drop policy if exists "slides_admin_manage" on public.slides;
create policy "slides_admin_manage" on public.slides
  for all using (public.is_editor()) with check (public.is_editor());

-- ---------------------------------------------------------------------------
-- HISTORIA: tablas + RLS
-- ---------------------------------------------------------------------------
create table if not exists public.historia_content (
  id uuid primary key default gen_random_uuid(),
  hero_title text,
  hero_description text,
  origins_title text,
  origins_text text,
  origins_quote text,
  origins_image_url text,
  origins_image_alt text,
  periods_title text,
  periods_description text,
  archive_title text,
  archive_text text,
  archive_image_url text,
  archive_image_alt text,
  status text not null default 'published'
    check (status in ('draft', 'published', 'archived')),
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists idx_historia_content_single
  on public.historia_content ((true));

drop trigger if exists trg_historia_content_updated_at on public.historia_content;
create trigger trg_historia_content_updated_at
  before update on public.historia_content
  for each row execute function moddatetime(updated_at);

alter table public.historia_content enable row level security;

drop policy if exists "historia_content_public_read" on public.historia_content;
create policy "historia_content_public_read" on public.historia_content
  for select using (status = 'published');

drop policy if exists "historia_content_admin_manage" on public.historia_content;
create policy "historia_content_admin_manage" on public.historia_content
  for all using (public.is_editor()) with check (public.is_editor());

create table if not exists public.historia_timeline (
  id uuid primary key default gen_random_uuid(),
  year text not null,
  title text not null,
  description text,
  image_url text,
  image_alt text,
  position integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_historia_timeline_position
  on public.historia_timeline (position asc);

drop trigger if exists trg_historia_timeline_updated_at on public.historia_timeline;
create trigger trg_historia_timeline_updated_at
  before update on public.historia_timeline
  for each row execute function moddatetime(updated_at);

alter table public.historia_timeline enable row level security;

drop policy if exists "historia_timeline_public_read" on public.historia_timeline;
create policy "historia_timeline_public_read" on public.historia_timeline
  for select using (is_active = true);

drop policy if exists "historia_timeline_admin_manage" on public.historia_timeline;
create policy "historia_timeline_admin_manage" on public.historia_timeline
  for all using (public.is_editor()) with check (public.is_editor());

-- ---------------------------------------------------------------------------
-- SEMILLAS: slides (solo si la tabla está vacía)
-- ---------------------------------------------------------------------------
insert into public.slides (section, title, description, image_url, button_text, button_url, order_index, is_active)
select * from (values
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
  ('santuario'::public.slide_section, 'Fachada del Santuario',
   'Portada principal de piedra tallada, siglo XVII.',
   '/images/santuario/santuario-plaza.jpg', 'Conocer la arquitectura', '/santuario/arquitectura', 0, true),
  ('santuario'::public.slide_section, 'Torres y cúpulas',
   'Silueta del templo entre los cerros de Chincheros.',
   '/images/santuario/santuario-exterior.jpg', 'Historia del templo', '/santuario/historia', 1, true),
  ('santuario'::public.slide_section, 'Patrimonio del santuario',
   'Arte religioso y memoria que se conserva.',
   '/images/santuario/pintura-detalle.jpg', 'Ver el patrimonio', '/santuario/patrimonio', 2, true),
  ('fe-peregrinacion'::public.slide_section, 'Caminos de fe',
   'Peregrinos que llegan cada año al santuario.',
   '/images/santuario/santuario-exterior.jpg', 'Planifica tu visita', '/visita', 0, true),
  ('fe-peregrinacion'::public.slide_section, 'Oración y devoción',
   'La casa de la Virgen, abierta a todos los pueblos.',
   '/images/santuario/santuario-plaza.jpg', 'Vida de fe', '/fe', 1, true),
  ('festividades'::public.slide_section, 'Fiesta de la Virgen de Cocharcas',
   'Cada 8 de septiembre, el pueblo celebra a su patrona.',
   '/images/santuario/pintura-colonial.jpg', 'Ver festividades', '/festividades', 0, true),
  ('festividades'::public.slide_section, 'Procesión y devoción popular',
   'Danzas, música y fe que reúne a generaciones.',
   '/images/santuario/pintura-detalle.jpg', 'Conocer el programa', '/festividades', 1, true),
  ('historia'::public.slide_section, 'Cuatro siglos de devoción',
   'Desde la llegada de la imagen hasta el santuario de piedra.',
   '/images/santuario/santuario-exterior.jpg', 'Conocer la historia', '/santuario/historia', 0, true),
  ('historia'::public.slide_section, 'El óleo de 1751',
   'Testimonio del arte colonial andino.',
   '/images/santuario/pintura-colonial.jpg', 'Ver el patrimonio', '/santuario/patrimonio', 1, true),
  ('galeria'::public.slide_section, 'El santuario en imágenes',
   'Vistas del templo, las celebraciones y la comunidad.',
   '/images/santuario/santuario-plaza.jpg', 'Explorar la galería', '/galeria', 0, true),
  ('galeria'::public.slide_section, 'La Virgen de Cocharcas',
   'Imagen venerada en Apurímac desde 1598.',
   '/images/santuario/virgen-cocharcas.jpg', 'Conocer a la Virgen', '/santuario/nuestra-senora', 1, true),
  ('eventos'::public.slide_section, 'Agenda del santuario',
   'Encuentros litúrgicos, peregrinaciones y actividades comunitarias.',
   '/images/santuario/santuario-exterior.jpg', 'Ver la agenda', '/eventos', 0, true),
  ('eventos'::public.slide_section, 'Fiesta y tradición',
   'La comunidad celebrando su fe a lo largo del año.',
   '/images/santuario/pintura-detalle.jpg', 'Festividades', '/festividades', 1, true),
  ('noticias'::public.slide_section, 'Novedades del santuario',
   'Noticias pastorales, culturales y patrimoniales de la comunidad.',
   '/images/santuario/santuario-plaza.jpg', 'Leer las noticias', '/noticias', 0, true),
  ('noticias'::public.slide_section, 'Memoria que se comparte',
   'La vida del pueblo contada desde su santuario.',
   '/images/santuario/pintura-colonial.jpg', 'Ver el archivo', '/santuario/archivo-historico', 1, true),
  ('visita'::public.slide_section, 'Ven a Cocharcas',
   'Información esencial para peregrinos y visitantes del santuario.',
   '/images/santuario/santuario-exterior.jpg', 'Planifica tu visita', '/visita', 0, true),
  ('visita'::public.slide_section, 'Un pueblo que recibe al peregrino',
   'Hospedaje, rutas y horarios para tu llegada.',
   '/images/santuario/santuario-plaza.jpg', 'Cómo llegar', '/visita', 1, true),
  ('contacto'::public.slide_section, 'Escríbenos',
   'Estamos para orientarte en tu visita y en tus solicitudes pastorales.',
   '/images/santuario/santuario-plaza.jpg', 'Solicitudes pastorales', '/solicitudes', 0, true),
  ('contacto'::public.slide_section, 'La casa de la Virgen, abierta a todos',
   'Consulta, sugiere o acompaña la misión del santuario.',
   '/images/santuario/virgen-cocharcas.jpg', 'Planifica tu visita', '/visita', 1, true)
) as seed
where not exists (select 1 from public.slides limit 1);

-- ---------------------------------------------------------------------------
-- SEMILLAS: historia (solo si las tablas están vacías)
-- ---------------------------------------------------------------------------
insert into public.historia_content (
  hero_title, hero_description,
  origins_title, origins_text, origins_quote, origins_image_url, origins_image_alt,
  periods_title, periods_description,
  archive_title, archive_text, archive_image_url, archive_image_alt,
  status
)
select
  'Cuatro siglos de devoción',
  'Un legado que perdura a través de los siglos, desde la llegada de la imagen hasta el santuario de piedra de hoy.',
  'Una imagen que llegó a pie',
  'La historia de Nuestra Señora de Cocharcas se remonta a finales del siglo XVI, cuando el indígena Francisco Tito Yupanqui, inspirado por la devoción a la Virgen de Copacabana, decidió crear una réplica de la imagen sagrada. Tras un arduo viaje de más de 800 kilómetros a pie desde Potosí, logró traer la imagen a estas tierras, donde fue recibida con gran alegría y devoción por la población local.',
  'Este acto de fe marcó el comienzo de lo que hoy es uno de los centros religiosos más importantes de los Andes peruanos.',
  '/images/santuario/virgen-cocharcas.jpg',
  'Imagen de Nuestra Señora de Cocharcas traída por Francisco Tito Yupanqui',
  'Etapas del santuario',
  'De la primera capilla de adobe al templo de piedra que hoy recibe a los peregrinos.',
  'La memoria escrita',
  E'El santuario posee un valioso archivo histórico que incluye documentos del siglo XVII, como libros de bautismos, matrimonios y defunciones, así como correspondencia eclesiástica y registros administrativos que permiten reconstruir la vida de la comunidad a lo largo de los siglos.\n\nActualmente, el archivo se encuentra en proceso de organización y digitalización para su conservación y puesta a disposición de investigadores y del público interesado.',
  '/images/santuario/pintura-detalle.jpg',
  'Documentos y arte colonial del archivo histórico del santuario',
  'published'
where not exists (select 1 from public.historia_content limit 1);

insert into public.historia_timeline (year, title, description, image_url, image_alt, position, is_active)
select * from (values
  ('1598', 'Llegada de la imagen de la Virgen de Cocharcas',
   'Según la tradición, el indígena Francisco Tito Yupanqui trajo una réplica de la Virgen de Copacabana a estas tierras después de un arduo viaje a pie desde Potosí.',
   '/images/santuario/virgen-cocharcas.jpg', 'Imagen de la Virgen de Cocharcas', 1, true),
  ('1600', 'Construcción de la primera capilla',
   'Los fieles construyeron una primera capilla de adobe y paja para venerar la imagen traída.',
   null, null, 2, true),
  ('1650', 'Edificación de la iglesia actual',
   'Se comenzó la construcción de la iglesia de piedra que actualmente se conserva.',
   '/images/santuario/santuario-exterior.jpg', 'Fachada del santuario de piedra', 3, true),
  ('1700', 'Primeros documentos parroquiales',
   'Se iniciaron los registros de bautismos, matrimonios y defunciones.',
   null, null, 4, true)
) as seed
where not exists (select 1 from public.historia_timeline limit 1);

-- ---------------------------------------------------------------------------
-- NAVEGACIÓN: ítem «Historia» entre El Santuario y Fe
-- ---------------------------------------------------------------------------
insert into public.navigation_items (id, label, href, position, visible)
values ('00000000-0000-0000-0000-000000000012', 'Historia', '/santuario/historia', 3, true)
on conflict (id) do update
set label = excluded.label,
    href = excluded.href,
    position = excluded.position,
    visible = excluded.visible;

update public.navigation_items set position = 4  where href = '/fe' and position = 3;
update public.navigation_items set position = 5  where href = '/festividades' and position = 4;
update public.navigation_items set position = 6  where href = '/noticias' and position = 5;
update public.navigation_items set position = 7  where href = '/eventos' and position = 6;
update public.navigation_items set position = 8  where href = '/galeria' and position = 7;
update public.navigation_items set position = 9  where href = '/visita' and position = 8;
update public.navigation_items set position = 10 where href = '/contacto' and position = 9;

-- ---------------------------------------------------------------------------
-- REDES SOCIALES: columna tiktok_url + semillas (migración 015)
-- ---------------------------------------------------------------------------
alter table public.site_settings add column if not exists tiktok_url text;

update public.site_settings set
  tiktok_url = coalesce(tiktok_url, 'https://www.tiktok.com/@santuariococharcas')
where tiktok_url is null;

-- ---------------------------------------------------------------------------
-- AGREGAR SECCIONES FALTANTES AL ENUM (migración 016)
-- ---------------------------------------------------------------------------
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

-- ============================================================================
-- FIN. El panel de administración ya puede guardar todos los cambios.
-- ============================================================================
