-- Storage setup for Santuario de Cocharcas

-- Create storage buckets
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('site-assets', 'site-assets', true, 52428800, '{image/jpeg,image/png,image/svg+xml,image/webp,application/pdf}'),
  ('news', 'news', true, 10485760, '{image/jpeg,image/png,image/webp}'),
  ('events', 'events', true, 10485760, '{image/jpeg,image/png,image/webp}'),
  ('gallery', 'gallery', true, 10485760, '{image/jpeg,image/png,image/webp}'),
  ('documents', 'documents', false, 52428800, '{application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain}')
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Storage policies for site-assets bucket
create policy "Anyone can view site assets"
  on storage.objects for select
  using (bucket_id = 'site-assets');

create policy "Admins can upload site assets"
  on storage.objects for insert
  with check (
    bucket_id = 'site-assets' and
    auth.role() = 'authenticated' and
    exists (
      select 1 from auth.users u
      join profiles p on p.user_id = u.id
      join roles r on r.id = p.role_id
      where u.id = auth.uid()
      and p.active = true
      and r.name in ('SUPER_ADMIN', 'ADMIN_PARROQUIA', 'EDITOR')
    )
  );

create policy "Admins can update site assets"
  on storage.objects for update
  using (
    bucket_id = 'site-assets' and
    auth.role() = 'authenticated' and
    exists (
      select 1 from auth.users u
      join profiles p on p.user_id = u.id
      join roles r on r.id = p.role_id
      where u.id = auth.uid()
      and p.active = true
      and r.name in ('SUPER_ADMIN', 'ADMIN_PARROQUIA', 'EDITOR')
    )
  );

create policy "Admins can delete site assets"
  on storage.objects for delete
  using (
    bucket_id = 'site-assets' and
    auth.role() = 'authenticated' and
    exists (
      select 1 from auth.users u
      join profiles p on p.user_id = u.id
      join roles r on r.id = p.role_id
      where u.id = auth.uid()
      and p.active = true
      and r.name in ('SUPER_ADMIN', 'ADMIN_PARROQUIA', 'EDITOR')
    )
  );

-- Storage policies for news bucket
create policy "Anyone can view news images"
  on storage.objects for select
  using (bucket_id = 'news');

create policy "Admins can manage news images"
  on storage.objects for all
  using (
    bucket_id = 'news' and
    auth.role() = 'authenticated' and
    exists (
      select 1 from auth.users u
      join profiles p on p.user_id = u.id
      join roles r on r.id = p.role_id
      where u.id = auth.uid()
      and p.active = true
      and r.name in ('SUPER_ADMIN', 'ADMIN_PARROQUIA', 'EDITOR')
    )
  );

-- Storage policies for events bucket
create policy "Anyone can view events images"
  on storage.objects for select
  using (bucket_id = 'events');

create policy "Admins can manage events images"
  on storage.objects for all
  using (
    bucket_id = 'events' and
    auth.role() = 'authenticated' and
    exists (
      select 1 from auth.users u
      join profiles p on p.user_id = u.id
      join roles r on r.id = p.role_id
      where u.id = auth.uid()
      and p.active = true
      and r.name in ('SUPER_ADMIN', 'ADMIN_PARROQUIA', 'EDITOR')
    )
  );

-- Storage policies for gallery bucket
create policy "Anyone can view gallery images"
  on storage.objects for select
  using (bucket_id = 'gallery');

create policy "Admins can manage gallery images"
  on storage.objects for all
  using (
    bucket_id = 'gallery' and
    auth.role() = 'authenticated' and
    exists (
      select 1 from auth.users u
      join profiles p on p.user_id = u.id
      join roles r on r.id = p.role_id
      where u.id = auth.uid()
      and p.active = true
      and r.name in ('SUPER_ADMIN', 'ADMIN_PARROQUIA', 'EDITOR')
    )
  );

-- Storage policies for documents bucket (private)
create policy "Admins can view documents"
  on storage.objects for select
  using (
    bucket_id = 'documents' and
    auth.role() = 'authenticated' and
    exists (
      select 1 from auth.users u
      join profiles p on p.user_id = u.id
      join roles r on r.id = p.role_id
      where u.id = auth.uid()
      and p.active = true
      and r.name in ('SUPER_ADMIN', 'ADMIN_PARROQUIA')
    )
  );

create policy "Admins can upload documents"
  on storage.objects for insert
  with check (
    bucket_id = 'documents' and
    auth.role() = 'authenticated' and
    exists (
      select 1 from auth.users u
      join profiles p on p.user_id = u.id
      join roles r on r.id = p.role_id
      where u.id = auth.uid()
      and p.active = true
      and r.name in ('SUPER_ADMIN', 'ADMIN_PARROQUIA')
    )
  );

create policy "Admins can update documents"
  on storage.objects for update
  using (
    bucket_id = 'documents' and
    auth.role() = 'authenticated' and
    exists (
      select 1 from auth.users u
      join profiles p on p.user_id = u.id
      join roles r on r.id = p.role_id
      where u.id = auth.uid()
      and p.active = true
      and r.name in ('SUPER_ADMIN', 'ADMIN_PARROQUIA')
    )
  );

create policy "Admins can delete documents"
  on storage.objects for delete
  using (
    bucket_id = 'documents' and
    auth.role() = 'authenticated' and
    exists (
      select 1 from auth.users u
      join profiles p on p.user_id = u.id
      join roles r on r.id = p.role_id
      where u.id = auth.uid()
      and p.active = true
      and r.name in ('SUPER_ADMIN', 'ADMIN_PARROQUIA')
    )
  );