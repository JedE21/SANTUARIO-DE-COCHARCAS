-- Santuario de Cocharcas - complete web pipeline
-- Idempotent migration to fill remaining tables, columns and secure RLS.

create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------------
-- Helper / security functions
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

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

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_role_name() in ('SUPER_ADMIN', 'ADMIN_PARROQUIA');
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

-- Tracking token hashing function used by pastoral requests.
create or replace function public.request_tracking_hash(value text)
returns text
language sql
immutable
as $$
  select encode(sha256(value::bytea), 'hex');
$$;

-- Securely return requests that match an admin-provided tracking code.
create or replace function public.find_mass_request(tracking_code text)
returns setof mass_requests
language sql
stable
security definer
set search_path = public
as $$
  select *
  from mass_requests
  where tracking_hash = public.request_tracking_hash(tracking_code)
  limit 1;
$$;

create or replace function public.find_sacrament_request(tracking_code text)
returns setof sacrament_requests
language sql
stable
security definer
set search_path = public
as $$
  select *
  from sacrament_requests
  where tracking_hash = public.request_tracking_hash(tracking_code)
  limit 1;
$$;

-- ---------------------------------------------------------------------------
-- Roles & profiles
-- ---------------------------------------------------------------------------
create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  role_id uuid references public.roles(id) on delete set null,
  full_name text,
  phone text,
  avatar_url text,
  bio text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists role_id uuid references public.roles(id) on delete set null;
alter table public.profiles add column if not exists active boolean not null default true;

create index if not exists idx_profiles_user_id on public.profiles(user_id);
create index if not exists idx_profiles_role_id on public.profiles(role_id);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists roles_set_updated_at on public.roles;
create trigger roles_set_updated_at
before update on public.roles
for each row execute function public.set_updated_at();

insert into public.roles (name, description) values
  ('SUPER_ADMIN', 'Acceso total incluyendo usuarios y roles'),
  ('ADMIN_PARROQUIA', 'Administra contenido, pastorales y configuración'),
  ('EDITOR', 'Crea y edita contenido'),
  ('RESPONSABLE_PASTORAL', 'Gestiona misas, sacramentos y solicitudes')
on conflict (name) do nothing;

-- ---------------------------------------------------------------------------
-- Site settings, navigation, footer
-- ---------------------------------------------------------------------------
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  site_name text not null default 'Santuario de Nuestra Señora de Cocharcas',
  site_description text,
  address text,
  phone text,
  whatsapp text,
  email text,
  latitude text,
  longitude text,
  logo_url text,
  favicon_url text,
  responsible_name text,
  responsible_title text,
  responsible_bio text,
  responsible_photo_url text,
  facebook_url text,
  twitter_url text,
  instagram_url text,
  youtube_url text,
  footer_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists site_settings_singleton_idx on public.site_settings ((1));

create table if not exists public.navigation_items (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  href text not null,
  position integer not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.footer_settings (
  id uuid primary key default gen_random_uuid(),
  about_text text,
  show_newsletter boolean not null default true,
  newsletter_text text,
  copyright_text text,
  developer_text text default 'Ing. de Sistemas José J. Echegaray Díaz; Cocharquino de corazón',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists footer_settings_singleton_idx on public.footer_settings ((1));

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

drop trigger if exists navigation_items_set_updated_at on public.navigation_items;
create trigger navigation_items_set_updated_at
before update on public.navigation_items
for each row execute function public.set_updated_at();

drop trigger if exists footer_settings_set_updated_at on public.footer_settings;
create trigger footer_settings_set_updated_at
before update on public.footer_settings
for each row execute function public.set_updated_at();

insert into public.navigation_items (id, label, href, position, visible)
values
  ('00000000-0000-0000-0000-000000000001', 'Inicio', '/', 1, true),
  ('00000000-0000-0000-0000-000000000002', 'El Santuario', '/santuario', 2, true),
  ('00000000-0000-0000-0000-000000000003', 'Fe', '/fe', 3, true),
  ('00000000-0000-0000-0000-000000000004', 'Festividades', '/festividades', 4, true),
  ('00000000-0000-0000-0000-000000000005', 'Noticias', '/noticias', 5, true),
  ('00000000-0000-0000-0000-000000000006', 'Eventos', '/eventos', 6, true),
  ('00000000-0000-0000-0000-000000000007', 'Galería', '/galeria', 7, true),
  ('00000000-0000-0000-0000-000000000008', 'Visita', '/visita', 8, true),
  ('00000000-0000-0000-0000-000000000009', 'Contacto', '/contacto', 9, true)
on conflict (id) do update
set label = excluded.label,
    href = excluded.href,
    position = excluded.position,
    visible = excluded.visible;

insert into public.footer_settings (id, about_text, newsletter_text, copyright_text, developer_text)
values (
  '00000000-0000-0000-0000-000000000010',
  'Santuario mariano, memoria histórica y vida de fe en el corazón de Apurímac.',
  'Recibe noticias y avisos de la comunidad.',
  '© 2026 Santuario de Nuestra Señora de Cocharcas · Todos los derechos reservados',
  'Ing. de Sistemas José J. Echegaray Díaz; Cocharquino de corazón'
)
on conflict (id) do update
set about_text = excluded.about_text,
    newsletter_text = excluded.newsletter_text,
    copyright_text = excluded.copyright_text,
    developer_text = excluded.developer_text;

insert into public.site_settings (
  site_name,
  site_description,
  address,
  phone,
  whatsapp,
  email,
  logo_url,
  favicon_url,
  responsible_name,
  responsible_title,
  footer_text
)
select
  'Santuario de Nuestra Señora de Cocharcas',
  'Santuario mariano, memoria histórica y vida de fe en el corazón de Apurímac.',
  'Cocharcas, Chincheros, Apurímac, Perú',
  '+51 XXX XXX XXX',
  '+51 XXX XXX XXX',
  'info@santuariococharcas.pe',
  '/images/cocharcas-hero.svg',
  '/images/cocharcas-hero.svg',
  'Pbro. Alfredo Prado',
  'Responsable Parroquial',
  'Cocharquino de corazón.'
where not exists (select 1 from public.site_settings);

-- ---------------------------------------------------------------------------
-- Pages, home sections, announcements, FAQs
-- ---------------------------------------------------------------------------
create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  content text,
  image_url text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.pages add column if not exists content text;
alter table public.pages add column if not exists image_url text;
alter table public.pages add column if not exists seo_title text;
alter table public.pages add column if not exists seo_description text;

create table if not exists public.home_sections (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  title text not null,
  description text,
  content text,
  image_url text,
  visible boolean not null default true,
  position integer not null default 0,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  link_url text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text,
  active boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists pages_set_updated_at on public.pages;
create trigger pages_set_updated_at
before update on public.pages
for each row execute function public.set_updated_at();

drop trigger if exists home_sections_set_updated_at on public.home_sections;
create trigger home_sections_set_updated_at
before update on public.home_sections
for each row execute function public.set_updated_at();

drop trigger if exists announcements_set_updated_at on public.announcements;
create trigger announcements_set_updated_at
before update on public.announcements
for each row execute function public.set_updated_at();

drop trigger if exists faqs_set_updated_at on public.faqs;
create trigger faqs_set_updated_at
before update on public.faqs
for each row execute function public.set_updated_at();

drop trigger if exists contact_messages_set_updated_at on public.contact_messages;
create trigger contact_messages_set_updated_at
before update on public.contact_messages
for each row execute function public.set_updated_at();

insert into public.pages (slug, title, description, content, status)
select 'santuario', 'El Santuario', 'Historia, arquitectura y patrimonio del templo.',
       'Contenido institucional del Santuario de Nuestra Señora de Cocharcas.', 'published'
where not exists (select 1 from public.pages where slug = 'santuario');

insert into public.pages (slug, title, description, content, status)
select 'historia', 'Historia', 'Historia documentada y devoción popular.',
       'Historia y tradición del santuario.', 'published'
where not exists (select 1 from public.pages where slug = 'historia');

insert into public.faqs (question, answer, category, active, position)
values
  ('¿Dónde queda el Santuario?', 'Queda en el distrito de Cocharcas, provincia de Chincheros, región Apurímac, Perú.', 'Visita', true, 1),
  ('¿Cómo se solicita una misa?', 'Puedes usar el formulario en la sección Vida de Fe o escribirnos por la página de contacto.', 'Pastoral', true, 2),
  ('¿Qué documentos se necesitan para el bautismo?', 'Es necesario presentar documentos según la orientación pastoral. Usa el formulario de sacramento para recibir indicaciones.', 'Sacramentos', true, 3),
  ('¿Puedo peregrinar cualquier día?', 'El templo está abierto a los visitantes; te recomendamos revisar los horarios y avisos de la sección Visita.', 'Visita', true, 4)
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- News / Events / Festivities
-- ---------------------------------------------------------------------------
create table if not exists public.news_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  position integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  cover_image_url text,
  category_id uuid references public.news_categories(id) on delete set null,
  author_id uuid references auth.users(id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.news add column if not exists is_featured boolean not null default false;
alter table public.news add column if not exists seo_title text;
alter table public.news add column if not exists seo_description text;

create index if not exists news_is_featured_idx on public.news(is_featured);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  image_url text,
  location text,
  start_date date not null,
  end_date date,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  author_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.events add column if not exists seo_title text;
alter table public.events add column if not exists seo_description text;

create table if not exists public.festivities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  program text,
  start_date date,
  end_date date,
  cover_image_url text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists news_categories_set_updated_at on public.news_categories;
create trigger news_categories_set_updated_at
before update on public.news_categories
for each row execute function public.set_updated_at();

drop trigger if exists news_set_updated_at on public.news;
create trigger news_set_updated_at
before update on public.news
for each row execute function public.set_updated_at();

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at
before update on public.events
for each row execute function public.set_updated_at();

drop trigger if exists festivities_set_updated_at on public.festivities;
create trigger festivities_set_updated_at
before update on public.festivities
for each row execute function public.set_updated_at();

insert into public.news_categories (id, name, slug, description, position, active)
values
  ('00000000-0000-0000-0000-000000000101', 'Pastoral', 'pastoral', 'Noticias y actividades pastorales.', 1, true),
  ('00000000-0000-0000-0000-000000000102', 'Festividades', 'festividades', 'Celebraciones y jornadas especiales.', 2, true),
  ('00000000-0000-0000-0000-000000000103', 'Patrimonio', 'patrimonio', 'Memoria histórica y conservación.', 3, true),
  ('00000000-0000-0000-0000-000000000104', 'Historia', 'historia', 'Notas históricas y archivo.', 4, true)
on conflict (slug) do update
set name = excluded.name, description = excluded.description, active = excluded.active;

insert into public.news (
  id, title, slug, excerpt, content, cover_image_url, category_id, status, published_at, is_featured
)
values
  (
    '00000000-0000-0000-0000-000000000201',
    'Preparativos para la próxima peregrinación',
    'preparativos-proxima-peregrinacion',
    'La comunidad organiza los detalles para recibir a los peregrinos.',
    'La parroquia y los mayordomos vienen coordinando los servicios pastorales, la limpieza del templo y la atención a los visitantes.',
    '/images/cocharcas-news.svg',
    '00000000-0000-0000-0000-000000000101',
    'published',
    now() - interval '2 days',
    true
  ),
  (
    '00000000-0000-0000-0000-000000000202',
    'Se acerca la festividad principal',
    'se-acerca-festividad-principal',
    'Los grupos de apoyo afinan el programa litúrgico y cultural.',
    'La celebración reunirá a fieles, danzantes y familias de la provincia con actos litúrgicos y manifestaciones de fe.',
    '/images/cocharcas-news.svg',
    '00000000-0000-0000-0000-000000000102',
    'published',
    now() - interval '1 day',
    true
  ),
  (
    '00000000-0000-0000-0000-000000000203',
    'Archivo histórico en proceso de conservación',
    'archivo-historico-proceso-conservacion',
    'Se avanza en el resguardo y digitalización de documentos antiguos.',
    'El santuario continúa organizando sus libros y documentos para facilitar la investigación y la memoria comunitaria.',
    '/images/cocharcas-news.svg',
    '00000000-0000-0000-0000-000000000103',
    'published',
    now(),
    false
  )
on conflict (slug) do update
set title = excluded.title, excerpt = excluded.excerpt, content = excluded.content, status = excluded.status;

insert into public.events (id, title, slug, description, image_url, location, start_date, end_date, status)
values
  (
    '00000000-0000-0000-0000-000000000301',
    'Jornada de oración y peregrinación',
    'jornada-oracion-peregrinacion',
    'Encuentro comunitario con adoración, confesiones y misa solemne.',
    '/images/cocharcas-event.svg',
    'Santuario de Nuestra Señora de Cocharcas',
    (current_date + interval '14 days')::date,
    (current_date + interval '14 days')::date,
    'published'
  ),
  (
    '00000000-0000-0000-0000-000000000302',
    'Fiesta principal del santuario',
    'fiesta-principal-santuario',
    'Celebración central con procesión, música y participación de la comunidad.',
    '/images/cocharcas-event.svg',
    'Santuario de Nuestra Señora de Cocharcas',
    (current_date + interval '30 days')::date,
    (current_date + interval '32 days')::date,
    'published'
  )
on conflict (slug) do update
set title = excluded.title, description = excluded.description, status = excluded.status;

insert into public.festivities (id, name, slug, description, program, start_date, end_date, cover_image_url, status)
select
  '00000000-0000-0000-0000-000000000401',
  'Fiesta principal de Nuestra Señora de Cocharcas',
  'fiesta-principal',
  'Celebración central mariana que reúne a fieles, danzantes y peregrinos.',
  'Programa litúrgico y cultural por confirmar según el calendario parroquial.',
  '2026-09-08'::date,
  '2026-09-12'::date,
  '/images/cocharcas-hero.svg',
  'published'
where not exists (select 1 from public.festivities where slug = 'fiesta-principal');

-- ---------------------------------------------------------------------------
-- Gallery
-- ---------------------------------------------------------------------------
create table if not exists public.gallery_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  position integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_albums (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.gallery_categories(id) on delete cascade,
  title text not null,
  slug text not null unique,
  description text,
  cover_image_url text,
  position integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  album_id uuid references public.gallery_albums(id) on delete set null,
  title text not null default 'Imagen',
  description text,
  alt_text text,
  image_url text not null,
  position integer not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.gallery_items add column if not exists album_id uuid references public.gallery_albums(id) on delete set null;
alter table public.gallery_items alter column title set default 'Imagen';

drop trigger if exists gallery_categories_set_updated_at on public.gallery_categories;
create trigger gallery_categories_set_updated_at
before update on public.gallery_categories
for each row execute function public.set_updated_at();

drop trigger if exists gallery_albums_set_updated_at on public.gallery_albums;
create trigger gallery_albums_set_updated_at
before update on public.gallery_albums
for each row execute function public.set_updated_at();

drop trigger if exists gallery_items_set_updated_at on public.gallery_items;
create trigger gallery_items_set_updated_at
before update on public.gallery_items
for each row execute function public.set_updated_at();

insert into public.gallery_categories (id, name, slug, description, position, active)
values
  ('00000000-0000-0000-0000-000000000501', 'Templo', 'templo', 'Vistas y detalles del santuario.', 1, true),
  ('00000000-0000-0000-0000-000000000502', 'Festividades', 'festividades', 'Celebraciones y procesiones.', 2, true),
  ('00000000-0000-0000-0000-000000000503', 'Comunidad', 'comunidad', 'Vida comunitaria y pastoral.', 3, true)
on conflict (slug) do update set name = excluded.name, description = excluded.description;

insert into public.gallery_albums (id, category_id, title, slug, description, cover_image_url, position, active)
values
  ('00000000-0000-0000-0000-000000000601', '00000000-0000-0000-0000-000000000501', 'El Santuario', 'el-santuario', 'Vistas del templo.', '/images/cocharcas-gallery.svg', 1, true),
  ('00000000-0000-0000-0000-000000000602', '00000000-0000-0000-0000-000000000502', 'Fiestas', 'fiestas', 'Fiestas y celebraciones.', '/images/cocharcas-gallery.svg', 2, true),
  ('00000000-0000-0000-0000-000000000603', '00000000-0000-0000-0000-000000000503', 'Comunidad', 'comunidad', 'Vida de la comunidad.', '/images/cocharcas-gallery.svg', 3, true)
on conflict (slug) do update set title = excluded.title, description = excluded.description;

insert into public.gallery_items (id, album_id, title, description, alt_text, image_url, position, visible)
select t.id::uuid, a.id, initcap(t.title), t.description, t.alt_text, t.image_url, t.position, true
from (values
  ('00000000-0000-0000-0000-000000000701'::uuid, '/images/cocharcas-gallery.svg', 'Vista del santuario', 'La fachada principal al atardecer.', 'Vista del santuario de Cocharcas', 1),
  ('00000000-0000-0000-0000-000000000702'::uuid, '/images/cocharcas-gallery.svg', 'Celebración comunitaria', 'Fieles reunidos en una jornada de oración.', 'Celebración comunitaria en Cocharcas', 2),
  ('00000000-0000-0000-0000-000000000703'::uuid, '/images/cocharcas-gallery.svg', 'Detalles patrimoniales', 'Elementos arquitectónicos y artísticos del templo.', 'Detalles patrimoniales del santuario', 3),
  ('00000000-0000-0000-0000-000000000704'::uuid, '/images/cocharcas-gallery.svg', 'Peregrinación', 'Caminata de peregrinos hacia el santuario.', 'Peregrinación hacia Cocharcas', 4),
  ('00000000-0000-0000-0000-000000000705'::uuid, '/images/cocharcas-gallery.svg', 'Retablo principal', 'Vista del retablo y el altar mayor.', 'Retablo principal del santuario', 5),
  ('00000000-0000-0000-0000-000000000706'::uuid, '/images/cocharcas-gallery.svg', 'Imagen venerada', 'La imagen de Nuestra Señora de Cocharcas.', 'Imagen venerada de Nuestra Señora de Cocharcas', 6)
) as t(id, image_url, title, description, alt_text, position)
cross join (select a.id from public.gallery_albums a where a.slug = 'el-santuario' limit 1) a
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Pastoral: schedules, sacraments and secure requests
-- ---------------------------------------------------------------------------
create table if not exists public.mass_schedules (
  id uuid primary key default gen_random_uuid(),
  day_of_week text not null,
  time time not null,
  place text,
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sacraments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  requirements text,
  image_url text,
  active boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mass_requests (
  id uuid primary key default gen_random_uuid(),
  request_number text not null unique default ('MS-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
  requester_name text not null,
  requester_email text,
  phone text,
  intention_type text,
  intention text,
  requested_date date not null,
  preferred_time time,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'reviewing', 'confirmed', 'rejected', 'completed')),
  admin_notes text,
  tracking_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.mass_requests add column if not exists requester_email text;
alter table public.mass_requests add column if not exists phone text;
alter table public.mass_requests add column if not exists intention_type text;
alter table public.mass_requests add column if not exists intention text;
alter table public.mass_requests add column if not exists requested_date date not null default current_date;
alter table public.mass_requests add column if not exists preferred_time time;
alter table public.mass_requests add column if not exists notes text;
alter table public.mass_requests add column if not exists tracking_hash text;

create table if not exists public.sacrament_requests (
  id uuid primary key default gen_random_uuid(),
  request_number text not null unique default ('SR-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
  sacrament_id uuid references public.sacraments(id) on delete set null,
  requester_name text not null,
  requester_email text,
  phone text,
  requested_date date not null,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'reviewing', 'confirmed', 'rejected', 'completed')),
  admin_notes text,
  tracking_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.sacrament_requests add column if not exists requester_email text;
alter table public.sacrament_requests add column if not exists phone text;
alter table public.sacrament_requests add column if not exists requested_date date not null default current_date;
alter table public.sacrament_requests add column if not exists tracking_hash text;

create table if not exists public.sacrament_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  active boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null,
  bucket text,
  mime_type text,
  size_bytes bigint,
  alt_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists mass_schedules_set_updated_at on public.mass_schedules;
create trigger mass_schedules_set_updated_at
before update on public.mass_schedules
for each row execute function public.set_updated_at();

drop trigger if exists sacraments_set_updated_at on public.sacraments;
create trigger sacraments_set_updated_at
before update on public.sacraments
for each row execute function public.set_updated_at();

drop trigger if exists mass_requests_set_updated_at on public.mass_requests;
create trigger mass_requests_set_updated_at
before update on public.mass_requests
for each row execute function public.set_updated_at();

drop trigger if exists sacrament_requests_set_updated_at on public.sacrament_requests;
create trigger sacrament_requests_set_updated_at
before update on public.sacrament_requests
for each row execute function public.set_updated_at();

drop trigger if exists sacrament_types_set_updated_at on public.sacrament_types;
create trigger sacrament_types_set_updated_at
before update on public.sacrament_types
for each row execute function public.set_updated_at();

drop trigger if exists media_set_updated_at on public.media;
create trigger media_set_updated_at
before update on public.media
for each row execute function public.set_updated_at();

drop trigger if exists newsletter_subscribers_set_updated_at on public.newsletter_subscribers;
create trigger newsletter_subscribers_set_updated_at
before update on public.newsletter_subscribers
for each row execute function public.set_updated_at();

insert into public.sacrament_types (id, name, description, active, position)
values
  ('00000000-0000-0000-0000-000000000801', 'Bautismo', 'Preparación para recibir el Bautismo.', true, 1),
  ('00000000-0000-0000-0000-000000000802', 'Confirmación', 'Acompañamiento catequético.', true, 2),
  ('00000000-0000-0000-0000-000000000803', 'Matrimonio', 'Orientación para el sacramento.', true, 3),
  ('00000000-0000-0000-0000-000000000804', 'Primera Comunión', 'Preparación eucarística.', true, 4)
on conflict (name) do update set description = excluded.description, active = excluded.active;

insert into public.sacraments (id, name, slug, description, requirements, image_url, active, position)
values
  ('00000000-0000-0000-0000-000000000901', 'Bautismo', 'bautismo', 'Preparación para recibir el sacramento del Bautismo.', 'Partida de nacimiento, DNI de padrinos y apoderados.', '/images/cocharcas-sacrament.svg', true, 1),
  ('00000000-0000-0000-0000-000000000902', 'Confirmación', 'confirmacion', 'Acompañamiento catequético para la Confirmación.', 'Catequesis previa y coordinación pastoral.', '/images/cocharcas-sacrament.svg', true, 2),
  ('00000000-0000-0000-0000-000000000903', 'Matrimonio', 'matrimonio', 'Orientación para la celebración del Matrimonio.', 'Partidas de bautismo y entrevista pastoral.', '/images/cocharcas-sacrament.svg', true, 3),
  ('00000000-0000-0000-0000-000000000904', 'Primera Comunión', 'primera-comunion', 'Preparación para la Primera Comunión.', 'Catequesis previa y partida de bautismo.', '/images/cocharcas-sacrament.svg', true, 4)
on conflict (slug) do update set name = excluded.name, description = excluded.description, requirements = excluded.requirements;

insert into public.mass_schedules (id, day_of_week, time, place, description, active)
values
  ('00000000-0000-0000-0000-000000000a01', 'Domingo', '07:00'::time, 'Capilla Principal', 'Misa dominical de madrugada', true),
  ('00000000-0000-0000-0000-000000000a02', 'Domingo', '09:00'::time, 'Capilla Principal', 'Misa dominical con participación coral', true),
  ('00000000-0000-0000-0000-000000000a03', 'Domingo', '11:00'::time, 'Capilla Principal', 'Misa dominical principal', true),
  ('00000000-0000-0000-0000-000000000a04', 'Lunes a viernes', '18:00'::time, 'Capilla Principal', 'Misa vespertina diaria', true),
  ('00000000-0000-0000-0000-000000000a05', 'Sábado', '18:00'::time, 'Capilla Principal', 'Misa de anticipación dominical', true)
on conflict (id) do update set day_of_week = excluded.day_of_week, time = excluded.time, place = excluded.place, description = excluded.description;

insert into public.faqs (id, question, answer, category, active, position)
values
  ('00000000-0000-0000-0000-000000000b01', '¿Cómo rastreo mi solicitud?', 'Usa el código que recibiste al enviar el formulario en la sección Solicitudes / Seguimiento.', 'Pastoral', true, 1)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Audit logs
-- ---------------------------------------------------------------------------
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_logs_created_at on public.audit_logs(created_at desc);
create index if not exists idx_audit_logs_user_id on public.audit_logs(user_id);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.roles enable row level security;
alter table public.profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.navigation_items enable row level security;
alter table public.footer_settings enable row level security;
alter table public.pages enable row level security;
alter table public.home_sections enable row level security;
alter table public.announcements enable row level security;
alter table public.faqs enable row level security;
alter table public.contact_messages enable row level security;
alter table public.news_categories enable row level security;
alter table public.news enable row level security;
alter table public.events enable row level security;
alter table public.festivities enable row level security;
alter table public.gallery_categories enable row level security;
alter table public.gallery_albums enable row level security;
alter table public.gallery_items enable row level security;
alter table public.mass_schedules enable row level security;
alter table public.sacraments enable row level security;
alter table public.sacrament_types enable row level security;
alter table public.mass_requests enable row level security;
alter table public.sacrament_requests enable row level security;
alter table public.media enable row level security;
alter table public.audit_logs enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- Public reads
drop policy if exists "profiles_public_view_own" on public.profiles;
create policy "profiles_public_view_own" on public.profiles
  for select using (auth.uid() = user_id);

drop policy if exists "profiles_admin_read_all" on public.profiles;
create policy "profiles_admin_read_all" on public.profiles
  for select using (public.is_admin() or auth.uid() = user_id);

drop policy if exists "profiles_admin_update_all" on public.profiles;
create policy "profiles_admin_update_all" on public.profiles
  for update using (public.is_admin() or auth.uid() = user_id);

drop policy if exists "roles_public_read" on public.roles;
create policy "roles_public_read" on public.roles
  for select using (true);

drop policy if exists "site_settings_public_read" on public.site_settings;
create policy "site_settings_public_read" on public.site_settings
  for select using (true);

drop policy if exists "navigation_items_public_read" on public.navigation_items;
create policy "navigation_items_public_read" on public.navigation_items
  for select using (visible = true);

drop policy if exists "footer_settings_public_read" on public.footer_settings;
create policy "footer_settings_public_read" on public.footer_settings
  for select using (true);

drop policy if exists "pages_public_read" on public.pages;
create policy "pages_public_read" on public.pages
  for select using (status = 'published');

drop policy if exists "home_sections_public_read" on public.home_sections;
create policy "home_sections_public_read" on public.home_sections
  for select using (visible = true);

drop policy if exists "announcements_public_read" on public.announcements;
create policy "announcements_public_read" on public.announcements
  for select using (status = 'published');

drop policy if exists "faqs_public_read" on public.faqs;
create policy "faqs_public_read" on public.faqs
  for select using (active = true);

drop policy if exists "news_categories_public_read" on public.news_categories;
create policy "news_categories_public_read" on public.news_categories
  for select using (active = true);

drop policy if exists "news_public_read" on public.news;
create policy "news_public_read" on public.news
  for select using (status = 'published');

drop policy if exists "events_public_read" on public.events;
create policy "events_public_read" on public.events
  for select using (status = 'published');

drop policy if exists "festivities_public_read" on public.festivities;
create policy "festivities_public_read" on public.festivities
  for select using (status = 'published');

drop policy if exists "gallery_categories_public_read" on public.gallery_categories;
create policy "gallery_categories_public_read" on public.gallery_categories
  for select using (active = true);

drop policy if exists "gallery_albums_public_read" on public.gallery_albums;
create policy "gallery_albums_public_read" on public.gallery_albums
  for select using (active = true);

drop policy if exists "gallery_items_public_read" on public.gallery_items;
create policy "gallery_items_public_read" on public.gallery_items
  for select using (visible = true);

drop policy if exists "mass_schedules_public_read" on public.mass_schedules;
create policy "mass_schedules_public_read" on public.mass_schedules
  for select using (active = true);

drop policy if exists "sacraments_public_read" on public.sacraments;
create policy "sacraments_public_read" on public.sacraments
  for select using (active = true);

drop policy if exists "sacrament_types_public_read" on public.sacrament_types;
create policy "sacrament_types_public_read" on public.sacrament_types
  for select using (active = true);

drop policy if exists "media_public_read" on public.media;
create policy "media_public_read" on public.media
  for select using (true);

drop policy if exists "newsletter_subscribers_public_insert" on public.newsletter_subscribers;
create policy "newsletter_subscribers_public_insert" on public.newsletter_subscribers
  for insert with check (true);

drop policy if exists "newsletter_subscribers_admin_read" on public.newsletter_subscribers;
create policy "newsletter_subscribers_admin_read" on public.newsletter_subscribers
  for select using (public.is_editor());

-- Admin write policies
do $$
declare table_name text;
begin
  foreach table_name in array array['site_settings','navigation_items','footer_settings','pages','home_sections','announcements','faqs','news_categories','news','events','festivities','gallery_categories','gallery_albums','gallery_items','mass_schedules','sacraments','sacrament_types','media'] loop
    execute format('drop policy if exists "%s_admin_manage" on public.%I;', table_name, table_name);
    execute format('create policy "%s_admin_manage" on public.%I for all using (public.is_editor()) with check (public.is_editor());', table_name, table_name);
  end loop;
end $$;

drop policy if exists "contact_messages_public_insert" on public.contact_messages;
create policy "contact_messages_public_insert" on public.contact_messages
  for insert with check (true);

drop policy if exists "contact_messages_admin_manage" on public.contact_messages;
create policy "contact_messages_admin_manage" on public.contact_messages
  for all using (public.is_editor()) with check (public.is_editor());

-- Pastoral requests: public insert + secure tracking.
drop policy if exists "mass_requests_public_insert" on public.mass_requests;
create policy "mass_requests_public_insert" on public.mass_requests
  for insert with check (true);

drop policy if exists "mass_requests_public_select" on public.mass_requests;
create policy "mass_requests_public_select" on public.mass_requests
  for select using (false);

drop policy if exists "mass_requests_admin_manage" on public.mass_requests;
create policy "mass_requests_admin_manage" on public.mass_requests
  for all using (public.is_editor()) with check (public.is_editor());

drop policy if exists "sacrament_requests_public_insert" on public.sacrament_requests;
create policy "sacrament_requests_public_insert" on public.sacrament_requests
  for insert with check (true);

drop policy if exists "sacrament_requests_public_select" on public.sacrament_requests;
create policy "sacrament_requests_public_select" on public.sacrament_requests
  for select using (false);

drop policy if exists "sacrament_requests_admin_manage" on public.sacrament_requests;
create policy "sacrament_requests_admin_manage" on public.sacrament_requests
  for all using (public.is_editor()) with check (public.is_editor());

drop policy if exists "audit_logs_admin_read" on public.audit_logs;
create policy "audit_logs_admin_read" on public.audit_logs
  for select using (public.is_admin());

drop policy if exists "profiles_admin_insert" on public.profiles;
create policy "profiles_admin_insert" on public.profiles
  for insert with check (public.is_admin() or auth.uid() = user_id);

drop policy if exists "sacrament_types_admin_manage" on public.sacrament_types;
create policy "sacrament_types_admin_manage" on public.sacrament_types
  for all using (public.is_editor()) with check (public.is_editor());

-- Storage: keep public buckets viewable, authenticated admins manage.
drop policy if exists "site_assets_public_read" on storage.objects;
create policy "site_assets_public_read" on storage.objects
  for select using (bucket_id = 'site-assets' or bucket_id = 'news' or bucket_id = 'events' or bucket_id = 'gallery' or bucket_id = 'documents');

drop policy if exists "admin_upload_storage" on storage.objects;
create policy "admin_upload_storage" on storage.objects
  for insert with check (
    auth.role() = 'authenticated'
    and public.is_editor()
  );

drop policy if exists "admin_update_storage" on storage.objects;
create policy "admin_update_storage" on storage.objects
  for update using (
    auth.role() = 'authenticated'
    and public.is_editor()
  );

drop policy if exists "admin_delete_storage" on storage.objects;
create policy "admin_delete_storage" on storage.objects
  for delete using (
    auth.role() = 'authenticated'
    and public.is_editor()
  );
