-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Roles table
create table roles (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Profiles table (linked to auth.users)
create table profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null unique,
  full_name text,
  phone text,
  avatar_url text,
  bio text,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Site settings table
create table site_settings (
  id uuid primary key default uuid_generate_v4(),
  site_name text default 'Santuario de Nuestra Señora de Cocharcas',
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
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Pages table for administrable pages
create table pages (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  description text,
  status text check (status in ('draft', 'published', 'archived')) default 'draft',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Sections table for modular content
create table sections (
  id uuid primary key default uuid_generate_v4(),
  page_id uuid references pages on delete cascade not null,
  type text not null,
  title text,
  subtitle text,
  content text,
  image_url text,
  position integer default 0,
  visible boolean default true,
  settings jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- News categories table
create table news_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  position integer default 0,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- News table
create table news (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  cover_image_url text,
  category_id uuid references news_categories,
  author_id uuid references profiles,
  status text check (status in ('draft', 'published', 'archived')) default 'draft',
  published_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Events table
create table events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  description text,
  image_url text,
  location text,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone,
  status text check (status in ('draft', 'published', 'archived')) default 'draft',
  author_id uuid references profiles,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Gallery categories table
create table gallery_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  position integer default 0,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Gallery albums table
create table gallery_albums (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references gallery_categories on delete cascade not null,
  title text not null,
  slug text unique not null,
  description text,
  cover_image_url text,
  position integer default 0,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Gallery items table
create table gallery_items (
  id uuid primary key default uuid_generate_v4(),
  album_id uuid references gallery_albums on delete cascade not null,
  title text,
  description text,
  alt_text text,
  image_url text not null,
  position integer default 0,
  visible boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Mass schedules table
create table mass_schedules (
  id uuid primary key default uuid_generate_v4(),
  day_of_week text check (day_of_week in ('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday')) not null,
  time time not null,
  place text,
  description text,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Sacraments table
create table sacraments (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  requirements text,
  image_url text,
  active boolean default true,
  position integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Mass requests table
create table mass_requests (
  id uuid primary key default uuid_generate_v4(),
  request_number text unique not null,
  requester_name text not null,
  phone text,
  email text,
  intention_type text,
  intention text,
  requested_date date not null,
  preferred_time time,
  notes text,
  status text check (status in ('pending', 'reviewing', 'confirmed', 'rejected', 'completed')) default 'pending',
  admin_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Sacrament requests table
create table sacrament_requests (
  id uuid primary key default uuid_generate_v4(),
  request_number text unique not null,
  sacrament_id uuid references sacraments not null,
  requester_name text not null,
  phone text,
  email text,
  requested_date date not null,
  notes text,
  status text check (status in ('pending', 'reviewing', 'confirmed', 'rejected', 'completed')) default 'pending',
  admin_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Audit logs table
create table audit_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better performance
create index idx_profiles_user_id on profiles(user_id);
create index idx_pages_slug on pages(slug);
create index idx_pages_status on pages(status);
create index idx_sections_page_id on sections(page_id);
create index idx_sections_visible on sections(visible);
create index idx_news_slug on news(slug);
create index idx_news_status on news(status);
create index idx_news_published_at on news(published_at);
create index idx_news_category_id on news(category_id);
create index idx_events_slug on events(slug);
create index idx_events_status on events(status);
create index idx_events_start_date on events(start_date);
create index idx_gallery_categories_slug on gallery_categories(slug);
create index idx_gallery_albums_slug on gallery_albums(slug);
create index idx_gallery_albums_category_id on gallery_albums(category_id);
create index idx_gallery_items_album_id on gallery_items(album_id);
create index idx_mass_requests_request_number on mass_requests(request_number);
create index idx_mass_requests_status on mass_requests(status);
create index idx_mass_requests_requested_date on mass_requests(requested_date);
create index idx_sacrament_requests_request_number on sacrament_requests(request_number);
create index idx_sacrament_requests_status on sacrament_requests(status);
create index idx_sacrament_requests_sacrament_id on sacrament_requests(sacrament_id);
create index idx_sacrament_requests_requested_date on sacrament_requests(requested_date);
create index idx_audit_logs_user_id on audit_logs(user_id);
create index idx_audit_logs_created_at on audit_logs(created_at);

-- Create updated_at triggers
create trigger update_profiles_updated_at before update on profiles
  for each row execute procedure moddatetime (updated_at);

create trigger update_site_settings_updated_at before update on site_settings
  for each row execute procedure moddatetime (updated_at);

create trigger update_pages_updated_at before update on pages
  for each row execute procedure moddatetime (updated_at);

create trigger update_sections_updated_at before update on sections
  for each row execute procedure moddatetime (updated_at);

create trigger update_news_categories_updated_at before update on news_categories
  for each row execute procedure moddatetime (updated_at);

create trigger update_news_updated_at before update on news
  for each row execute procedure moddatetime (updated_at);

create trigger update_events_updated_at before update on events
  for each row execute procedure moddatetime (updated_at);

create trigger update_gallery_categories_updated_at before update on gallery_categories
  for each row execute procedure moddatetime (updated_at);

create trigger update_gallery_albums_updated_at before update on gallery_albums
  for each row execute procedure moddatetime (updated_at);

create trigger update_gallery_items_updated_at before update on gallery_items
  for each row execute procedure moddatetime (updated_at);

create trigger update_mass_schedules_updated_at before update on mass_schedules
  for each row execute procedure moddatetime (updated_at);

create trigger update_sacraments_updated_at before update on sacraments
  for each row execute procedure moddatetime (updated_at);

create trigger update_mass_requests_updated_at before update on mass_requests
  for each row execute procedure moddatetime (updated_at);

create trigger update_sacrament_requests_updated_at before update on sacrament_requests
  for each row execute procedure moddatetime (updated_at);

-- Insert default roles
insert into roles (name, description) values
  ('SUPER_ADMIN', 'Full system access including user and role management'),
  ('ADMIN_PARROQUIA', 'Administration of content, events, galleries, and pastoral requests'),
  ('EDITOR', 'Content creation and editing for news, galleries, and events'),
  ('RESPONSABLE_PASTORAL', 'Management of mass schedules, sacraments, and pastoral requests')
on conflict (name) do nothing;

-- Insert default site settings
insert into site_settings (site_name, site_description) values
  ('Santuario de Nuestra Señora de Cocharcas', 'Santuario de Nuestra Señora de Cocharcas - Cocharcas, Chincheros, Apurímac, Perú')
on conflict do nothing;