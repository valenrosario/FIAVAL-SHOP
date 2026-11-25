-- fiaval shop: pegá todo este archivo en Supabase > SQL Editor y tocá "Run".
-- Se puede correr más de una vez sin romper nada.

create extension if not exists pgcrypto;

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  position int not null default 0
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  price numeric(12,2) not null default 0,
  compare_at_price numeric(12,2),
  category_id uuid references categories(id) on delete set null,
  images text[] not null default '{}',
  colors jsonb not null default '[]',
  sizes text[] not null default '{}',
  stock int,
  is_new boolean not null default false,
  featured boolean not null default true,
  active boolean not null default true,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  number bigint generated always as identity (start with 1001) unique,
  created_at timestamptz not null default now(),
  customer_name text not null,
  phone text not null,
  delivery text not null default 'retiro',
  address text not null default '',
  notes text not null default '',
  items jsonb not null default '[]',
  total numeric(12,2) not null default 0,
  status text not null default 'nuevo'
);

create table if not exists settings (
  id int primary key default 1,
  data jsonb not null default '{}'
);
insert into settings (id, data) values (1, '{}') on conflict (id) do nothing;

-- Solo el servidor de la tienda (con la clave service_role) puede leer y escribir.
alter table categories enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table settings enable row level security;

-- Carpeta pública para las fotos de productos y del banner.
insert into storage.buckets (id, name, public)
values ('imagenes', 'imagenes', true)
on conflict (id) do update set public = true;

-- Categorías de inicio (podés cambiarlas desde el panel).
insert into categories (name, slug, position) values
  ('Cuadernos', 'cuadernos', 1),
  ('Agendas', 'agendas', 2),
  ('Escolar', 'escolar', 3),
  ('Oficina', 'oficina', 4),
  ('Arte', 'arte', 5),
  ('Stickers', 'stickers', 6),
  ('Impresiones', 'impresiones', 7),
  ('Tarjetas', 'tarjetas', 8)
on conflict (slug) do nothing;
