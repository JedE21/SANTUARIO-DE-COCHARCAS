-- ============================================================================
-- 011 — SISTEMA DE SOLICITUDES PASTORALES (PROMPT 13)
-- Santuario de Nuestra Señora de Cocharcas
--
--   1. Estados completos del flujo pastoral:
--        pending(Recibida) -> reviewing(En revision) -> confirmed(Aceptada)
--        rejected(Rechazada) | completed(Atendida) | cancelled(Cancelada)
--   2. Numeracion secuencial sin colisiones:
--        COC-MSA-2026-00001  (misas)
--        COC-SRA-2026-00001  (sacramentos)
--      generada por la base de datos (secuencias), no por la app.
--
-- Idempotente: puede ejecutarse varias veces.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Estados: incluir 'cancelled' en ambas tablas
-- ---------------------------------------------------------------------------

alter table public.mass_requests drop constraint if exists mass_requests_status_check;
alter table public.mass_requests
  add constraint mass_requests_status_check
  check (status in ('pending', 'reviewing', 'confirmed', 'rejected', 'completed', 'cancelled'));

alter table public.sacrament_requests drop constraint if exists sacrament_requests_status_check;
alter table public.sacrament_requests
  add constraint sacrament_requests_status_check
  check (status in ('pending', 'reviewing', 'confirmed', 'rejected', 'completed', 'cancelled'));

-- ---------------------------------------------------------------------------
-- 2. Secuencias para numero de solicitud (cero colisiones por construccion)
-- ---------------------------------------------------------------------------

create sequence if not exists public.mass_request_number_seq start 1;
create sequence if not exists public.sacrament_request_number_seq start 1;

-- Continuar la secuencia por encima de numeros ya usados (proyecto antiguo).
-- Si no hay filas, la primera solicitud saldra como ...00001.
do $$
declare
  max_mass int;
  max_sac int;
begin
  select max(nullif(right(request_number, 5), '')::int) into max_mass
    from public.mass_requests where request_number ~ '\d{5}$';
  select max(nullif(right(request_number, 5), '')::int) into max_sac
    from public.sacrament_requests where request_number ~ '\d{5}$';
  perform setval('public.mass_request_number_seq', greatest(1, coalesce(max_mass, 1)), max_mass is not null);
  perform setval('public.sacrament_request_number_seq', greatest(1, coalesce(max_sac, 1)), max_sac is not null);
end $$;

-- ---------------------------------------------------------------------------
-- 3. La base de datos genera el numero si la app no envia uno
-- ---------------------------------------------------------------------------

alter table public.mass_requests
  alter column request_number
  set default ('COC-MSA-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.mass_request_number_seq')::text, 5, '0'));

alter table public.sacrament_requests
  alter column request_number
  set default ('COC-SRA-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.sacrament_request_number_seq')::text, 5, '0'));

-- Permisos de secuencia para quienes insertan desde la API publica
grant usage, select on sequence public.mass_request_number_seq to anon, authenticated, service_role;
grant usage, select on sequence public.sacrament_request_number_seq to anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- 4. Indice para los filtros del panel (por estado y fecha de registro)
-- ---------------------------------------------------------------------------

create index if not exists idx_mass_requests_status on public.mass_requests(status);
create index if not exists idx_sacrament_requests_status on public.sacrament_requests(status);
