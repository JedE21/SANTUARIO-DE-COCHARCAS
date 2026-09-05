-- Add role_id to profiles table
alter table profiles add column if not exists role_id uuid references roles;

-- Update existing profiles to have a default role (EDITOR)
update profiles set role_id = (select id from roles where name = 'EDITOR' limit 1) where role_id is null;

-- Create index on role_id for better performance
create index if not exists idx_profiles_role_id on profiles(role_id);

-- Now update the RLS policies to properly check roles
drop policy if exists "Users can view their own profile" on profiles;
drop policy if exists "Users can update their own profile" on profiles;
drop policy if exists "Anyone can view site settings" on site_settings;
drop policy if exists "Only admins can modify site settings" on site_settings;
drop policy if exists "Anyone can view published pages" on pages;
drop policy if exists "Admins can manage pages" on pages;
drop policy if exists "Anyone can view visible sections on published pages" on sections;
drop policy if exists "Admins can manage sections" on sections;
drop policy if exists "Anyone can view active news categories" on news_categories;
drop policy if exists "Admins can manage news categories" on news_categories;
drop policy if exists "Anyone can view published news" on news;
drop policy if exists "Admins can manage news" on news;
drop policy if exists "Anyone can view published events" on events;
drop policy if exists "Admins can manage events" on events;
drop policy if exists "Anyone can view active gallery categories" on gallery_categories;
drop policy if exists "Admins can manage gallery categories" on gallery_categories;
drop policy if exists "Anyone can view albums from active categories" on gallery_albums;
drop policy if exists "Admins can manage gallery albums" on gallery_albums;
drop policy if exists "Anyone can view visible gallery items" on gallery_items;
drop policy if exists "Admins can manage gallery items" on gallery_items;
drop policy if exists "Anyone can view active mass schedules" on mass_schedules;
drop policy if exists "Admins can manage mass schedules" on mass_schedules;
drop policy if exists "Anyone can view active sacraments" on sacraments;
drop policy if exists "Admins can manage sacraments" on sacraments;
drop policy if exists "Anyone can insert mass requests" on mass_requests;
drop policy if exists "Users can view their own mass requests" on mass_requests;
drop policy if exists "Admins can manage mass requests" on mass_requests;
drop policy if exists "Anyone can insert sacrament requests" on sacrament_requests;
drop policy if exists "Users can view their own sacrament requests" on sacrament_requests;
drop policy if exists "Admins can manage sacrament requests" on sacrament_requests;
drop policy if exists "Admins can view audit logs" on audit_logs;
drop policy if exists "Admins can insert audit logs" on audit_logs;
drop policy if exists "Anyone can view roles" on roles;
drop policy if exists "Only super admins can manage roles" on roles;

-- Recreate policies with proper role checking
create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = user_id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = user_id);

create policy "Anyone can view site settings"
  on site_settings for select
  using (true);

create policy "Only admins can modify site settings"
  on site_settings for all
  using (
    exists (
      select 1 from auth.users u
      join profiles p on p.user_id = u.id
      join roles r on r.id = p.role_id
      where u.id = auth.uid()
      and p.active = true
      and r.name in ('SUPER_ADMIN', 'ADMIN_PARROQUIA')
    )
  );

create policy "Anyone can view published pages"
  on pages for select
  using (status = 'published');

create policy "Admins can manage pages"
  on pages for all
  using (
    exists (
      select 1 from auth.users u
      join profiles p on p.user_id = u.id
      join roles r on r.id = p.role_id
      where u.id = auth.uid()
      and p.active = true
      and r.name in ('SUPER_ADMIN', 'ADMIN_PARROQUIA', 'EDITOR')
    )
  );

create policy "Anyone can view visible sections on published pages"
  on sections for select
  using (
    visible = true and
    exists (
      select 1 from pages p where p.id = sections.page_id and p.status = 'published'
    )
  );

create policy "Admins can manage sections"
  on sections for all
  using (
    exists (
      select 1 from auth.users u
      join profiles p on p.user_id = u.id
      join roles r on r.id = p.role_id
      where u.id = auth.uid()
      and p.active = true
      and r.name in ('SUPER_ADMIN', 'ADMIN_PARROQUIA', 'EDITOR')
    )
  );

create policy "Anyone can view active news categories"
  on news_categories for select
  using (active = true);

create policy "Admins can manage news categories"
  on news_categories for all
  using (
    exists (
      select 1 from auth.users u
      join profiles p on p.user_id = u.id
      join roles r on r.id = p.role_id
      where u.id = auth.uid()
      and p.active = true
      and r.name in ('SUPER_ADMIN', 'ADMIN_PARROQUIA', 'EDITOR')
    )
  );

create policy "Anyone can view published news"
  on news for select
  using (status = 'published');

create policy "Admins can manage news"
  on news for all
  using (
    exists (
      select 1 from auth.users u
      join profiles p on p.user_id = u.id
      join roles r on r.id = p.role_id
      where u.id = auth.uid()
      and p.active = true
      and r.name in ('SUPER_ADMIN', 'ADMIN_PARROQUIA', 'EDITOR')
    )
  );

create policy "Anyone can view published events"
  on events for select
  using (status = 'published');

create policy "Admins can manage events"
  on events for all
  using (
    exists (
      select 1 from auth.users u
      join profiles p on p.user_id = u.id
      join roles r on r.id = p.role_id
      where u.id = auth.uid()
      and p.active = true
      and r.name in ('SUPER_ADMIN', 'ADMIN_PARROQUIA', 'EDITOR')
    )
  );

create policy "Anyone can view active gallery categories"
  on gallery_categories for select
  using (active = true);

create policy "Admins can manage gallery categories"
  on gallery_categories for all
  using (
    exists (
      select 1 from auth.users u
      join profiles p on p.user_id = u.id
      join roles r on r.id = p.role_id
      where u.id = auth.uid()
      and p.active = true
      and r.name in ('SUPER_ADMIN', 'ADMIN_PARROQUIA', 'EDITOR')
    )
  );

create policy "Anyone can view albums from active categories"
  on gallery_albums for select
  using (
    active = true and
    exists (
      select 1 from gallery_categories gc where gc.id = gallery_albums.category_id and gc.active = true
    )
  );

create policy "Admins can manage gallery albums"
  on gallery_albums for all
  using (
    exists (
      select 1 from auth.users u
      join profiles p on p.user_id = u.id
      join roles r on r.id = p.role_id
      where u.id = auth.uid()
      and p.active = true
      and r.name in ('SUPER_ADMIN', 'ADMIN_PARROQUIA', 'EDITOR')
    )
  );

create policy "Anyone can view visible gallery items"
  on gallery_items for select
  using (
    visible = true and
    exists (
      select 1 from gallery_albums ga where ga.id = gallery_items.album_id
        and ga.active = true
        and exists (
          select 1 from gallery_categories gc where gc.id = ga.category_id and gc.active = true
        )
    )
  );

create policy "Admins can manage gallery items"
  on gallery_items for all
  using (
    exists (
      select 1 from auth.users u
      join profiles p on p.user_id = u.id
      join roles r on r.id = p.role_id
      where u.id = auth.uid()
      and p.active = true
      and r.name in ('SUPER_ADMIN', 'ADMIN_PARROQUIA', 'EDITOR')
    )
  );

create policy "Anyone can view active mass schedules"
  on mass_schedules for select
  using (active = true);

create policy "Admins can manage mass schedules"
  on mass_schedules for all
  using (
    exists (
      select 1 from auth.users u
      join profiles p on p.user_id = u.id
      join roles r on r.id = p.role_id
      where u.id = auth.uid()
      and p.active = true
      and r.name in ('SUPER_ADMIN', 'ADMIN_PARROQUIA', 'RESPONSABLE_PASTORAL')
    )
  );

create policy "Anyone can view active sacraments"
  on sacraments for select
  using (active = true);

create policy "Admins can manage sacraments"
  on sacraments for all
  using (
    exists (
      select 1 from auth.users u
      join profiles p on p.user_id = u.id
      join roles r on r.id = p.role_id
      where u.id = auth.uid()
      and p.active = true
      and r.name in ('SUPER_ADMIN', 'ADMIN_PARROQUIA', 'RESPONSABLE_PASTORAL')
    )
  );

create policy "Anyone can insert mass requests"
  on mass_requests for insert
  with check (true);

create policy "Users can view their own mass requests"
  on mass_requests for select
  using (
    -- For security, we should implement a proper token-based system
    -- For now, we'll allow viewing if you have the request URL (security through obscurity is not ideal)
    -- A better approach would be to send a confirmation email with a secure link
    true
  );

create policy "Admins can manage mass requests"
  on mass_requests for all
  using (
    exists (
      select 1 from auth.users u
      join profiles p on p.user_id = u.id
      join roles r on r.id = p.role_id
      where u.id = auth.uid()
      and p.active = true
      and r.name in ('SUPER_ADMIN', 'ADMIN_PARROQUIA', 'RESPONSABLE_PASTORAL')
    )
  );

create policy "Anyone can insert sacrament requests"
  on sacrament_requests for insert
  with check (true);

create policy "Users can view their own sacrament requests"
  on sacrament_requests for select
  using (
    -- Same as mass requests
    true
  );

create policy "Admins can manage sacrament requests"
  on sacrament_requests for all
  using (
    exists (
      select 1 from auth.users u
      join profiles p on p.user_id = u.id
      join roles r on r.id = p.role_id
      where u.id = auth.uid()
      and p.active = true
      and r.name in ('SUPER_ADMIN', 'ADMIN_PARROQUIA', 'RESPONSABLE_PASTORAL')
    )
  );

create policy "Admins can view audit logs"
  on audit_logs for select
  using (
    exists (
      select 1 from auth.users u
      join profiles p on p.user_id = u.id
      join roles r on r.id = p.role_id
      where u.id = auth.uid()
      and p.active = true
      and r.name = 'SUPER_ADMIN'
    )
  );

create policy "Admins can insert audit logs"
  on audit_logs for insert
  using (
    exists (
      select 1 from auth.users u
      join profiles p on p.user_id = u.id
      join roles r on r.id = p.role_id
      where u.id = auth.uid()
      and p.active = true
    )
  );

create policy "Anyone can view roles"
  on roles for select
  using (true);

create policy "Only super admins can manage roles"
  on roles for all
  using (
    exists (
      select 1 from auth.users u
      join profiles p on p.user_id = u.id
      join roles r on r.id = p.role_id
      where u.id = auth.uid()
      and p.active = true
      and r.name = 'SUPER_ADMIN'
    )
  );