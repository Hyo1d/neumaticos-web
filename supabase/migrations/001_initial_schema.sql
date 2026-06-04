create extension if not exists pgcrypto;

create table if not exists brands (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  logo_url text,
  is_active boolean default true
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  icon text,
  is_active boolean default true
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  brand_id uuid references brands(id),
  category_id uuid references categories(id),
  description text,
  width integer,
  aspect_ratio integer,
  rim_size integer,
  load_index text,
  speed_rating text,
  price numeric(10,2) not null,
  price_compare numeric(10,2),
  stock integer default 0,
  images text[],
  tags text[],
  is_featured boolean default false,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  user_id uuid references auth.users(id),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  shipping_method text,
  shipping_address jsonb,
  payment_method text,
  payment_status text default 'pending',
  payment_id text,
  subtotal numeric(10,2),
  shipping_cost numeric(10,2) default 0,
  discount numeric(10,2) default 0,
  total numeric(10,2),
  status text default 'pending',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  quantity integer not null,
  unit_price numeric(10,2) not null,
  product_snapshot jsonb
);

create table if not exists discount_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  type text not null,
  value numeric(10,2) not null,
  min_amount numeric(10,2),
  max_uses integer,
  used_count integer default 0,
  expires_at timestamptz,
  is_active boolean default true
);

create table if not exists site_config (
  key text primary key,
  value jsonb not null
);

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

alter table products enable row level security;
alter table brands enable row level security;
alter table categories enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table discount_codes enable row level security;
alter table site_config enable row level security;

drop policy if exists "public read brands" on brands;
create policy "public read brands" on brands for select using (is_active = true);
drop policy if exists "admin all brands" on brands;
create policy "admin all brands" on brands for all using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "public read categories" on categories;
create policy "public read categories" on categories for select using (is_active = true);
drop policy if exists "admin all categories" on categories;
create policy "admin all categories" on categories for all using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "public read products" on products;
create policy "public read products" on products for select using (is_active = true);
drop policy if exists "admin all products" on products;
create policy "admin all products" on products for all using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "user read own orders" on orders;
create policy "user read own orders" on orders for select using (auth.uid() = user_id);
drop policy if exists "admin all orders" on orders;
create policy "admin all orders" on orders for all using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "admin all order items" on order_items;
create policy "admin all order items" on order_items for all using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "admin all discounts" on discount_codes;
create policy "admin all discounts" on discount_codes for all using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "public read config" on site_config;
create policy "public read config" on site_config for select using (true);
drop policy if exists "admin write config" on site_config;
create policy "admin write config" on site_config for all using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "public read product images" on storage.objects;
create policy "public read product images" on storage.objects for select using (bucket_id = 'product-images');
drop policy if exists "admin all product images" on storage.objects;
create policy "admin all product images" on storage.objects for all using (bucket_id = 'product-images' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
