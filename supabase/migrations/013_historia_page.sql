-- ============================================================================
-- 013 — HISTORIA (página pública /santuario/historia)
-- Santuario de Nuestra Señora de Cocharcas
--
-- Contenido editable de la Historia de la Virgen de Cocharcas y del
-- santuario, más la línea de tiempo de hitos históricos:
--   historia_content  → registro único con textos e imágenes de la página
--   historia_timeline → hitos (año, título, descripción, imagen opcional)
--
-- También agrega el ítem «Historia» al menú principal (entre El Santuario y
-- Fe) y extiende el enum slide_section con las secciones que usan otros
-- carruseles del sitio (eventos, noticias, visita, contacto), para que la
-- tabla `slides` sea homogénea con src/lib/slides.ts.
--
-- Idempotente: puede ejecutarse varias veces.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Extender el enum de secciones de slides (idempotente)
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- 2. Tabla historia_content (registro único)
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

comment on table public.historia_content is
  'Contenido editable de la pagina Historia (/santuario/historia): hero, historia de la Virgen de Cocharcas, periodos y archivo historico.';

-- Solo un registro de contenido
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

-- ---------------------------------------------------------------------------
-- 3. Tabla historia_timeline (hitos históricos)
-- ---------------------------------------------------------------------------
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

comment on table public.historia_timeline is
  'Hitos de la linea de tiempo de la pagina Historia (ano, titulo, descripcion, imagen opcional).';

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
-- 4. Datos iniciales: contenido + hitos (solo si las tablas están vacías)
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
-- 5. Ítem «Historia» en el menú principal (entre El Santuario y Fe)
-- ---------------------------------------------------------------------------
insert into public.navigation_items (id, label, href, position, visible)
values ('00000000-0000-0000-0000-000000000012', 'Historia', '/santuario/historia', 3, true)
on conflict (id) do update
set label = excluded.label,
    href = excluded.href,
    position = excluded.position,
    visible = excluded.visible;

-- Reacomoda las posiciones de los ítems siguientes (Fe en adelante)
update public.navigation_items set position = 4  where href = '/fe';
update public.navigation_items set position = 5  where href = '/festividades';
update public.navigation_items set position = 6  where href = '/noticias';
update public.navigation_items set position = 7  where href = '/eventos';
update public.navigation_items set position = 8  where href = '/galeria';
update public.navigation_items set position = 9  where href = '/visita';
update public.navigation_items set position = 10 where href = '/contacto';
