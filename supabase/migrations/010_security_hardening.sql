-- ============================================================================
-- 010 — SEGURIDAD PROFESIONAL (PROMPT 12)
-- Santuario de Nuestra Señora de Cocharcas
--
-- Objetivos:
--   1. Eliminar politicas RLS legacy (003) mas permisivas que las de 009.
--      En Postgres las politicas permisivas se combinan con OR: basta una
--      politica abierta para exponer la tabla entera.
--   2. Blindar datos personales de solicitudes pastorales (nadie sin sesion
--      de editor/admin puede leerlas).
--   3. Corregir acceso publico accidental al bucket privado "documents".
--   4. Reemplazar las RPC de seguimiento que devolvian la fila COMPLETA
--      (nombre, correo, telefono, notas) por funciones que devuelven solo
--      numero de solicitud, estado y fecha.
--   5. Constraints de longitud/formato en tablas de insercion publica.
--   6. Indice para busqueda por tracking_hash.
--
-- Idempotente: puede ejecutarse varias veces sin error.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Limpieza de politicas legacy (migracion 003) mas permisivas
-- ---------------------------------------------------------------------------

-- CRITICO: lectura publica total de solicitudes con datos personales
drop policy if exists "Users can view their own mass requests" on public.mass_requests;
drop policy if exists "Users can view their own sacrament requests" on public.sacrament_requests;

-- Duplicadas / debilitadas (003 vs 009): el criterio nuevo es is_editor()/is_admin()
drop policy if exists "Anyone can insert mass requests" on public.mass_requests;
drop policy if exists "Admins can manage mass requests" on public.mass_requests;
drop policy if exists "Anyone can insert sacrament requests" on public.sacrament_requests;
drop policy if exists "Admins can manage sacrament requests" on public.sacrament_requests;

drop policy if exists "Users can view their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;

drop policy if exists "Anyone can view site settings" on public.site_settings;
drop policy if exists "Only admins can modify site settings" on public.site_settings;

drop policy if exists "Anyone can view published pages" on public.pages;
drop policy if exists "Admins can manage pages" on public.pages;

drop policy if exists "Anyone can view active news categories" on public.news_categories;
drop policy if exists "Admins can manage news categories" on public.news_categories;
drop policy if exists "Anyone can view published news" on public.news;
drop policy if exists "Admins can manage news" on public.news;

drop policy if exists "Anyone can view published events" on public.events;
drop policy if exists "Admins can manage events" on public.events;

drop policy if exists "Anyone can view active gallery categories" on public.gallery_categories;
drop policy if exists "Admins can manage gallery categories" on public.gallery_categories;
drop policy if exists "Anyone can view albums from active categories" on public.gallery_albums;
drop policy if exists "Admins can manage gallery albums" on public.gallery_albums;
drop policy if exists "Anyone can view visible gallery items" on public.gallery_items;
drop policy if exists "Admins can manage gallery items" on public.gallery_items;

drop policy if exists "Anyone can view active mass schedules" on public.mass_schedules;
drop policy if exists "Admins can manage mass schedules" on public.mass_schedules;
drop policy if exists "Anyone can view active sacraments" on public.sacraments;
drop policy if exists "Admins can manage sacraments" on public.sacraments;

-- Auditoria: la version 003 dejaba leer/escribir logs a cualquier perfil activo
drop policy if exists "Admins can view audit logs" on public.audit_logs;
drop policy if exists "Admins can insert audit logs" on public.audit_logs;

-- Roles: la version 003 permitia gestionar roles a cualquier perfil activo
drop policy if exists "Anyone can view roles" on public.roles;
drop policy if exists "Only super admins can manage roles" on public.roles;

-- Funcion legacy sin uso (009 define current_role_name)
drop function if exists public.get_user_role();

-- NOTA: las politicas de la tabla "sections" (003) se conservan porque esa
-- tabla no esta gestionada por las politicas 009.

-- ---------------------------------------------------------------------------
-- 2. Re-asegurar policies clave (idempotente, por si 009 no llego a correr)
-- ---------------------------------------------------------------------------

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

drop policy if exists "contact_messages_public_insert" on public.contact_messages;
create policy "contact_messages_public_insert" on public.contact_messages
  for insert with check (true);

drop policy if exists "contact_messages_admin_manage" on public.contact_messages;
create policy "contact_messages_admin_manage" on public.contact_messages
  for all using (public.is_editor()) with check (public.is_editor());

drop policy if exists "newsletter_subscribers_public_insert" on public.newsletter_subscribers;
create policy "newsletter_subscribers_public_insert" on public.newsletter_subscribers
  for insert with check (true);

drop policy if exists "newsletter_subscribers_admin_read" on public.newsletter_subscribers;
create policy "newsletter_subscribers_admin_read" on public.newsletter_subscribers
  for select using (public.is_editor());

-- Lectura publica limitada a contenido publicado/activo (guardarrailes)
drop policy if exists "pages_public_read" on public.pages;
create policy "pages_public_read" on public.pages
  for select using (status = 'published');

drop policy if exists "news_public_read" on public.news;
create policy "news_public_read" on public.news
  for select using (status = 'published');

drop policy if exists "events_public_read" on public.events;
create policy "events_public_read" on public.events
  for select using (status = 'published');

drop policy if exists "roles_public_read" on public.roles;
create policy "roles_public_read" on public.roles
  for select using (true);

drop policy if exists "audit_logs_admin_read" on public.audit_logs;
create policy "audit_logs_admin_read" on public.audit_logs
  for select using (public.is_admin());

-- ---------------------------------------------------------------------------
-- 3. Storage: el bucket "documents" NUNCA es publico
-- ---------------------------------------------------------------------------

drop policy if exists "site_assets_public_read" on storage.objects;
create policy "site_assets_public_read" on storage.objects
  for select using (bucket_id in ('site-assets', 'news', 'events', 'gallery'));

drop policy if exists "documents_editor_read" on storage.objects;
create policy "documents_editor_read" on storage.objects
  for select using (bucket_id = 'documents' and public.is_editor());

-- Escritura/borrado de storage: solo personal autenticado con rol editorial
drop policy if exists "admin_upload_storage" on storage.objects;
create policy "admin_upload_storage" on storage.objects
  for insert with check (auth.role() = 'authenticated' and public.is_editor());

drop policy if exists "admin_update_storage" on storage.objects;
create policy "admin_update_storage" on storage.objects
  for update using (auth.role() = 'authenticated' and public.is_editor());

drop policy if exists "admin_delete_storage" on storage.objects;
create policy "admin_delete_storage" on storage.objects
  for delete using (auth.role() = 'authenticated' and public.is_editor());

-- ---------------------------------------------------------------------------
-- 4. RPC de seguimiento: reemplazo minimizado (sin PII)
-- ---------------------------------------------------------------------------
-- Las funciones legacy devolvian select * (nombre, correo, telefono, notas,
-- admin_notes) a cualquiera con el codigo. Se eliminan y se crean versiones
-- que solo exponen numero de solicitud, estado y fecha.

drop function if exists public.find_mass_request(text);
drop function if exists public.find_sacrament_request(text);

create or replace function public.track_mass_request(tracking_code text)
returns table (
  request_number text,
  status text,
  requested_date date,
  preferred_time time,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select r.request_number, r.status, r.requested_date, r.preferred_time, r.created_at
  from public.mass_requests r
  where r.tracking_hash = public.request_tracking_hash(trim(tracking_code))
  limit 1;
$$;

create or replace function public.track_sacrament_request(tracking_code text)
returns table (
  request_number text,
  status text,
  requested_date date,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select r.request_number, r.status, r.requested_date, r.created_at
  from public.sacrament_requests r
  where r.tracking_hash = public.request_tracking_hash(trim(tracking_code))
  limit 1;
$$;

-- Solo los roles que llegan por la API pueden invocarlas
revoke all on function public.track_mass_request(text) from public;
revoke all on function public.track_sacrament_request(text) from public;
grant execute on function public.track_mass_request(text) to anon, authenticated;
grant execute on function public.track_sacrament_request(text) to anon, authenticated;

-- El hash de seguimiento es util interno: no debe ser invocable desde la API
revoke execute on function public.request_tracking_hash(text) from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 5. Constraints de longitud/formato en tablas de insercion publica
-- ---------------------------------------------------------------------------

alter table public.mass_requests drop constraint if exists mass_requests_lengths;
alter table public.mass_requests add constraint mass_requests_lengths check (
  char_length(requester_name) between 2 and 120
  and (requester_email is null or char_length(requester_email) <= 160)
  and (phone is null or char_length(phone) <= 40)
  and (intention_type is null or char_length(intention_type) <= 60)
  and (intention is null or char_length(intention) <= 1000)
  and (notes is null or char_length(notes) <= 1000)
  and char_length(request_number) <= 40
  and (tracking_hash is null or tracking_hash ~ '^[0-9a-f]{64}$')
);

alter table public.sacrament_requests drop constraint if exists sacrament_requests_lengths;
alter table public.sacrament_requests add constraint sacrament_requests_lengths check (
  char_length(requester_name) between 2 and 120
  and (requester_email is null or char_length(requester_email) <= 160)
  and (phone is null or char_length(phone) <= 40)
  and (notes is null or char_length(notes) <= 1000)
  and char_length(request_number) <= 40
  and (tracking_hash is null or tracking_hash ~ '^[0-9a-f]{64}$')
);

alter table public.contact_messages drop constraint if exists contact_messages_lengths;
alter table public.contact_messages add constraint contact_messages_lengths check (
  char_length(name) between 2 and 120
  and char_length(email) <= 160
  and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  and (phone is null or char_length(phone) <= 40)
  and (subject is null or char_length(subject) <= 160)
  and char_length(message) between 10 and 2000
);

alter table public.newsletter_subscribers drop constraint if exists newsletter_email_format;
alter table public.newsletter_subscribers add constraint newsletter_email_format check (
  char_length(email) <= 160 and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
);

-- ---------------------------------------------------------------------------
-- 6. Indices para el seguimiento por codigo
-- ---------------------------------------------------------------------------

create index if not exists idx_mass_requests_tracking_hash
  on public.mass_requests(tracking_hash);

create index if not exists idx_sacrament_requests_tracking_hash
  on public.sacrament_requests(tracking_hash);

-- ============================================================================
-- FIN DE LA MIGRACION 010
-- Regla de oro cumplida: un visitante nunca puede leer solicitudes ajenas;
-- el seguimiento solo devuelve numero, estado y fecha.
-- ============================================================================
