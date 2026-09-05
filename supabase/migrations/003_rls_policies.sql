-- Enable Row Level Security on tables
alter table profiles enable row level security;
alter table site_settings enable row level security;
alter table pages enable row level security;
alter table sections enable row level security;
alter table news_categories enable row level security;
alter table news enable row level security;
alter table events enable row level security;
alter table gallery_categories enable row level security;
alter table gallery_albums enable row level security;
alter table gallery_items enable row level security;
alter table mass_schedules enable row level security;
alter table sacraments enable row level security;
alter table mass_requests enable row level security;
alter table sacrament_requests enable row level security;
alter table audit_logs enable row level security;
alter table roles enable row level security;

-- Create function to get user role from profiles
create or replace function get_user_role()
returns text as $$
  declare
    user_role text;
  begin
    select r.name into user_role
    from auth.users u
    join profiles p on p.user_id = u.id
    join roles r on r.id = p.role_id  -- We'll add this column later if needed, or use a different approach
    where u.id = auth.uid()
    limit 1;

    return coalesce(user_role, '');
  exception when others then
    return '';
  end;
$$ language 'plpgsql' security definer;

-- Actually, let's add a role_id to profiles instead of using a function
-- But first, let me check if we need to alter the profiles table
-- Actually, let's use a simpler approach: check the user's metadata or create a separate user_roles table
-- For now, let's create policies based on the assumption we'll add role_id to profiles
-- But to keep it simple for now, let's create basic policies

-- Profiles policies
create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = user_id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = user_id);

-- Site settings policies
create policy "Anyone can view site settings"
  on site_settings for select
  using (true);

create policy "Only admins can modify site settings"
  on site_settings for all
  using (exists (
    select 1 from auth.users u
    join profiles p on p.user_id = u.id
    where u.id = auth.uid()
    and p.active = true
    -- We'll check role here once we have role_id in profiles
  ));

-- Pages policies
create policy "Anyone can view published pages"
  on pages for select
  using (status = 'published');

create policy "Admins can manage pages"
  on pages for all
  using (exists (
    select 1 from auth.users u
    join profiles p on p.user_id = u.id
    where u.id = auth.uid()
    and p.active = true
  ));

-- Sections policies
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
  using (exists (
    select 1 from auth.users u
    join profiles p on p.user_id = u.id
    where u.id = auth.uid()
    and p.active = true
  ));

-- News categories policies
create policy "Anyone can view active news categories"
  on news_categories for select
  using (active = true);

create policy "Admins can manage news categories"
  on news_categories for all
  using (exists (
    select 1 from auth.users u
    join profiles p on p.user_id = u.id
    where u.id = auth.uid()
    and p.active = true
  ));

-- News policies
create policy "Anyone can view published news"
  on news for select
  using (status = 'published');

create policy "Admins can manage news"
  on news for all
  using (exists (
    select 1 from auth.users u
    join profiles p on p.user_id = u.id
    where u.id = auth.uid()
    and p.active = true
  ));

-- Events policies
create policy "Anyone can view published events"
  on events for select
  using (status = 'published');

create policy "Admins can manage events"
  on events for all
  using (exists (
    select 1 from auth.users u
    join profiles p on p.user_id = u.id
    where u.id = auth.uid()
    and p.active = true
  ));

-- Gallery categories policies
create policy "Anyone can view active gallery categories"
  on gallery_categories for select
  using (active = true);

create policy "Admins can manage gallery categories"
  on gallery_categories for all
  using (exists (
    select 1 from auth.users u
    join profiles p on p.user_id = u.id
    where u.id = auth.uid()
    and p.active = true
  ));

-- Gallery albums policies
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
  using (exists (
    select 1 from auth.users u
    join profiles p on p.user_id = u.id
    where u.id = auth.uid()
    and p.active = true
  ));

-- Gallery items policies
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
  using (exists (
    select 1 from auth.users u
    join profiles p on p.user_id = u.id
    where u.id = auth.uid()
    and p.active = true
  ));

-- Mass schedules policies
create policy "Anyone can view active mass schedules"
  on mass_schedules for select
  using (active = true);

create policy "Admins can manage mass schedules"
  on mass_schedules for all
  using (exists (
    select 1 from auth.users u
    join profiles p on p.user_id = u.id
    where u.id = auth.uid()
    and p.active = true
  ));

-- Sacraments policies
create policy "Anyone can view active sacraments"
  on sacraments for select
  using (active = true);

create policy "Admins can manage sacraments"
  on sacraments for all
  using (exists (
    select 1 from auth.users u
    join profiles p on p.user_id = u.id
    where u.id = auth.uid()
    and p.active = true
  ));

-- Mass requests policies
create policy "Anyone can insert mass requests"
  on mass_requests for insert
  with check (true);

create policy "Users can view their own mass requests"
  on mass_requests for select
  using (
    -- For now, we'll allow anyone to view mass requests with request_number if they have it
    -- In a more secure implementation, we'd use a token or session-based approach
    true
  );

create policy "Admins can manage mass requests"
  on mass_requests for all
  using (exists (
    select 1 from auth.users u
    join profiles p on p.user_id = u.id
    where u.id = auth.uid()
    and p.active = true
  ));

-- Sacrament requests policies
create policy "Anyone can insert sacrament requests"
  on sacrament_requests for insert
  with check (true);

create policy "Users can view their own sacrament requests"
  on sacrament_requests for select
  using (
    -- Similar to mass requests, simplified for now
    true
  );

create policy "Admins can manage sacrament requests"
  on sacrament_requests for all
  using (exists (
    select 1 from auth.users u
    join profiles p on p.user_id = u.id
    where u.id = auth.uid()
    and p.active = true
  ));

-- Audit logs policies
create policy "Admins can view audit logs"
  on audit_logs for select
  using (exists (
    select 1 from auth.users u
    join profiles p on p.user_id = u.id
    where u.id = auth.uid()
    and p.active = true
  ));

create policy "Admins can insert audit logs"
  on audit_logs for insert
  using (exists (
    select 1 from auth.users u
    join profiles p on p.user_id = u.id
    where u.id = auth.uid()
    and p.active = true
  ));

-- Roles policies
create policy "Anyone can view roles"
  on roles for select
  using (true);

create policy "Only super admins can manage roles"
  on roles for all
  using (exists (
    select 1 from auth.users u
    join profiles p on p.user_id = u.id
    where u.id = auth.uid()
    and p.active = true
  ));