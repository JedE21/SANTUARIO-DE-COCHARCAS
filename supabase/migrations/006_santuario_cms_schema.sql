-- Santuario de Cocharcas CMS schema
-- This migration adds the site-specific content tables used by the web app.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

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

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  image_url text,
  location text,
  start_date date not null,
  end_date date,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  author_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  alt_text text,
  image_url text not null,
  position integer not null default 0,
  visible boolean not null default true,
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
  phone text,
  email text,
  intention_type text,
  intention text,
  requested_date date not null,
  preferred_time time,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'reviewing', 'confirmed', 'rejected', 'completed')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sacrament_requests (
  id uuid primary key default gen_random_uuid(),
  request_number text not null unique default ('SR-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
  sacrament_id uuid references public.sacraments(id) on delete set null,
  requester_name text not null,
  phone text,
  email text,
  requested_date date not null,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'reviewing', 'confirmed', 'rejected', 'completed')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists site_settings_singleton_idx on public.site_settings ((1));
create index if not exists news_status_published_at_idx on public.news (status, published_at desc);
create index if not exists events_status_start_date_idx on public.events (status, start_date);
create index if not exists mass_schedules_active_day_idx on public.mass_schedules (active, day_of_week, time);
create index if not exists gallery_items_visible_position_idx on public.gallery_items (visible, position);
create index if not exists sacraments_active_position_idx on public.sacraments (active, position);

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

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

drop trigger if exists mass_schedules_set_updated_at on public.mass_schedules;
create trigger mass_schedules_set_updated_at
before update on public.mass_schedules
for each row execute function public.set_updated_at();

drop trigger if exists gallery_items_set_updated_at on public.gallery_items;
create trigger gallery_items_set_updated_at
before update on public.gallery_items
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

alter table public.site_settings enable row level security;
alter table public.news_categories enable row level security;
alter table public.news enable row level security;
alter table public.events enable row level security;
alter table public.mass_schedules enable row level security;
alter table public.gallery_items enable row level security;
alter table public.sacraments enable row level security;
alter table public.mass_requests enable row level security;
alter table public.sacrament_requests enable row level security;

create policy "site_settings_public_read"
  on public.site_settings
  for select
  using (true);

create policy "news_categories_public_read"
  on public.news_categories
  for select
  using (active = true);

create policy "news_public_read"
  on public.news
  for select
  using (status = 'published');

create policy "events_public_read"
  on public.events
  for select
  using (status = 'published');

create policy "mass_schedules_public_read"
  on public.mass_schedules
  for select
  using (active = true);

create policy "gallery_items_public_read"
  on public.gallery_items
  for select
  using (visible = true);

create policy "sacraments_public_read"
  on public.sacraments
  for select
  using (active = true);

create policy "mass_requests_public_insert"
  on public.mass_requests
  for insert
  with check (true);

create policy "sacrament_requests_public_insert"
  on public.sacrament_requests
  for insert
  with check (true);

insert into public.site_settings (
  site_name,
  site_description,
  address,
  phone,
  whatsapp,
  email,
  latitude,
  longitude,
  logo_url,
  favicon_url,
  responsible_name,
  responsible_title,
  responsible_bio,
  responsible_photo_url,
  facebook_url,
  twitter_url,
  instagram_url,
  youtube_url,
  footer_text
)
select
  'Santuario de Nuestra Señora de Cocharcas',
  'Santuario mariano, memoria histórica y vida de fe en el corazón de Apurímac.',
  'Cocharcas, Chincheros, Apurímac, Perú',
  '+51 XXX XXX XXX',
  '+51 XXX XXX XXX',
  'info@santuariococharcas.pe',
  null,
  null,
  '/images/cocharcas-hero.svg',
  '/images/cocharcas-hero.svg',
  'Pbro. Alfredo Prado',
  'Responsable Parroquial',
  'Acompañamiento pastoral y coordinación de la vida litúrgica y comunitaria del santuario.',
  '/images/cocharcas-avatar.svg',
  null,
  null,
  null,
  null,
  'Cocharquino de corazón.'
where not exists (select 1 from public.site_settings);

insert into public.news_categories (name, slug, description, position, active)
values
  ('Pastoral', 'pastoral', 'Noticias y actividades pastorales.', 1, true),
  ('Festividades', 'festividades', 'Celebraciones y jornadas especiales.', 2, true),
  ('Patrimonio', 'patrimonio', 'Memoria histórica y conservación.', 3, true)
on conflict (slug) do nothing;

insert into public.sacraments (name, slug, description, requirements, image_url, active, position)
values
  ('Bautismo', 'bautismo', 'Preparación para recibir el sacramento del Bautismo.', 'Partida de nacimiento, DNI de padrinos y apoderados.', '/images/cocharcas-sacrament.svg', true, 1),
  ('Confirmación', 'confirmacion', 'Acompañamiento catequético para la Confirmación.', 'Catequesis previa y coordinación pastoral.', '/images/cocharcas-sacrament.svg', true, 2),
  ('Matrimonio', 'matrimonio', 'Orientación para la celebración del sacramento del Matrimonio.', 'Partidas de bautismo y entrevista pastoral.', '/images/cocharcas-sacrament.svg', true, 3)
on conflict (slug) do nothing;

insert into public.news (title, slug, excerpt, content, cover_image_url, category_id, status, published_at)
values
  (
    'Preparativos para la próxima peregrinación',
    'preparativos-proxima-peregrinacion',
    'La comunidad organiza los detalles para recibir a los peregrinos.',
    'La parroquia y los mayordomos vienen coordinando los servicios pastorales, la limpieza del templo y la atención a los visitantes.',
    '/images/cocharcas-news.svg',
    (select id from public.news_categories where slug = 'pastoral' limit 1),
    'published',
    now() - interval '2 days'
  ),
  (
    'Se acerca la festividad principal',
    'se-acerca-festividad-principal',
    'Los grupos de apoyo afinan el programa litúrgico y cultural.',
    'La celebración reunirá a fieles, danzantes y familias de la provincia con actos litúrgicos y manifestaciones de fe.',
    '/images/cocharcas-news.svg',
    (select id from public.news_categories where slug = 'festividades' limit 1),
    'published',
    now() - interval '1 day'
  ),
  (
    'Archivo histórico en proceso de conservación',
    'archivo-historico-proceso-conservacion',
    'Se avanza en el resguardo y digitalización de documentos antiguos.',
    'El santuario continúa organizando sus libros y documentos para facilitar la investigación y la memoria comunitaria.',
    '/images/cocharcas-news.svg',
    (select id from public.news_categories where slug = 'patrimonio' limit 1),
    'published',
    now()
  )
on conflict (slug) do nothing;

insert into public.events (title, slug, description, image_url, location, start_date, end_date, status)
values
  (
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
    'Fiesta principal del santuario',
    'fiesta-principal-santuario',
    'Celebración central con procesión, música y participación de la comunidad.',
    '/images/cocharcas-event.svg',
    'Santuario de Nuestra Señora de Cocharcas',
    (current_date + interval '30 days')::date,
    (current_date + interval '32 days')::date,
    'published'
  )
on conflict (slug) do nothing;

insert into public.mass_schedules (day_of_week, time, place, description, active)
values
  ('domingo', '07:00'::time, 'Capilla Principal', 'Misa dominical de madrugada', true),
  ('domingo', '09:00'::time, 'Capilla Principal', 'Misa dominical con participación coral', true),
  ('domingo', '11:00'::time, 'Capilla Principal', 'Misa dominical principal', true),
  ('lunes a viernes', '18:00'::time, 'Capilla Principal', 'Misa vespertina diaria', true),
  ('sábado', '18:00'::time, 'Capilla Principal', 'Misa de anticipación dominical', true)
on conflict do nothing;

insert into public.gallery_items (title, description, alt_text, image_url, position, visible)
values
  ('Vista del santuario', 'La fachada principal al atardecer.', 'Vista del santuario de Cocharcas', '/images/cocharcas-gallery.svg', 1, true),
  ('Celebración comunitaria', 'Fieles reunidos en una jornada de oración.', 'Celebración comunitaria en Cocharcas', '/images/cocharcas-gallery.svg', 2, true),
  ('Detalles patrimoniales', 'Elementos arquitectónicos y artísticos del templo.', 'Detalles patrimoniales del santuario', '/images/cocharcas-gallery.svg', 3, true),
  ('Peregrinación', 'Caminata de peregrinos hacia el santuario.', 'Peregrinación hacia Cocharcas', '/images/cocharcas-gallery.svg', 4, true),
  ('Retablo principal', 'Vista del retablo y el altar mayor.', 'Retablo principal del santuario', '/images/cocharcas-gallery.svg', 5, true),
  ('Imagen venerada', 'La imagen de Nuestra Señora de Cocharcas.', 'Imagen venerada de Nuestra Señora de Cocharcas', '/images/cocharcas-gallery.svg', 6, true)
on conflict do nothing;

insert into public.news_categories (name, slug, description, position, active)
select 'Historia', 'historia', 'Notas históricas y conservación.', 4, true
where not exists (select 1 from public.news_categories where slug = 'historia');
