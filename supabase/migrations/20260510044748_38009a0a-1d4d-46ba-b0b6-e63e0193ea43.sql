
-- Role enum
create type public.user_role as enum ('buyer', 'seller', 'dealer');

-- Profiles table (no FK to auth.users per guidelines; PK is the auth uid)
create table public.profiles (
  id uuid primary key,
  full_name text,
  location text,
  role public.user_role,
  -- Buyer
  buyer_interests text[],
  buyer_min_price integer,
  buyer_max_price integer,
  -- Seller
  seller_items text,
  -- Dealer
  dealer_inventory_notes text,
  onboarded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id) on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at trigger
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();
