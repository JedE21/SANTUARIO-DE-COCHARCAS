create extension if not exists "pgcrypto";

create table if not exists public.site_sections (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  content text,
  visible boolean not null default true,
  position integer not null default 0,
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
  intention text,
  preferred_date date,
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
  requester_email text,
  sacrament_type text,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'reviewing', 'confirmed', 'rejected', 'completed')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists site_sections_visible_position_idx on public.site_sections (visible, position);
create index if not exists sacraments_active_position_idx on public.sacraments (active, position);
create index if not exists mass_requests_status_created_at_idx on public.mass_requests (status, created_at desc);
create index if not exists sacrament_requests_status_created_at_idx on public.sacrament_requests (status, created_at desc);

drop trigger if exists site_sections_set_updated_at on public.site_sections;
create trigger site_sections_set_updated_at
before update on public.site_sections
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

alter table public.site_sections enable row level security;
alter table public.sacraments enable row level security;
alter table public.mass_requests enable row level security;
alter table public.sacrament_requests enable row level security;

create policy "site_sections_public_read"
  on public.site_sections
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

insert into public.sacraments (name, slug, description, requirements, image_url, active, position)
values
  ('Baptism', 'bautismo', 'Preparation to receive the sacrament of Baptism.', 'Birth certificate and guardian information.', '/images/cocharcas-sacrament.svg', true, 1),
  ('Confirmation', 'confirmacion', 'Catechetical preparation for Confirmation.', 'Previous catechesis and pastoral coordination.', '/images/cocharcas-sacrament.svg', true, 2),
  ('Marriage', 'matrimonio', 'Guidance for the celebration of Matrimony.', 'Baptism certificates and pastoral interview.', '/images/cocharcas-sacrament.svg', true, 3)
on conflict (slug) do nothing;

insert into public.site_sections (title, slug, content, visible, position)
values
  ('Historia', 'historia', 'Contenido historico del santuario.', true, 1),
  ('Arquitectura', 'arquitectura', 'Descripcion de la arquitectura y patrimonio.', true, 2),
  ('Nuestra Senora', 'nuestra-senora', 'Informacion sobre la advocacion mariana.', true, 3),
  ('Patrimonio', 'patrimonio', 'Memoria y conservacion del patrimonio.', true, 4),
  ('Visita', 'visita', 'Informacion practica para peregrinos y visitantes.', true, 5)
on conflict (slug) do nothing;
