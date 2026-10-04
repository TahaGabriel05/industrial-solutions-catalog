alter table public.catalog_products
  add column if not exists stock integer,
  add column if not exists images text[] not null default '{}',
  add column if not exists technical_sheet_path text,
  add column if not exists badges text[] not null default '{}',
  add column if not exists badge_images text[] not null default '{}',
  add column if not exists hidden boolean not null default false;
alter table public.catalog_categories
  add column if not exists description text not null default '',
  add column if not exists description_fr text not null default '',
  add column if not exists sort_order integer,
  add column if not exists hidden boolean not null default false;

create table public.site_settings (
  id text primary key default 'site',
  logo_path text,
  favicon_path text,
  updated_at timestamptz not null default now()
);
grant select on public.site_settings to anon, authenticated;
grant insert, update, delete on public.site_settings to authenticated;
grant all on public.site_settings to service_role;
alter table public.site_settings enable row level security;
create policy "Anyone can view site settings" on public.site_settings for select to anon, authenticated using (true);
create policy "Admins manage site settings" on public.site_settings for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));