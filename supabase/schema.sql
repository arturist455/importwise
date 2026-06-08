-- ============================================================
-- ImportWise.ie — Supabase schema
-- Paste this whole file into Supabase -> SQL Editor -> Run
-- ============================================================

-- ---------- TABLES ----------
create table if not exists public.cars (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz default now(),
  make        text not null,
  model       text not null,
  year        int,
  price       numeric default 0,
  mileage     int default 0,
  origin      text default 'Japan',           -- Japan | UK
  status      text default 'in_stock',         -- in_stock | to_order | sold
  fuel        text,
  gearbox     text,
  engine      text,
  power       text,
  color       text,
  co2         int,
  nox         int,
  delivery    text,
  description text,
  images      text[] default '{}',
  sort        int default 0
);

create table if not exists public.reviews (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name       text not null,
  rating     int not null check (rating between 1 and 5),
  body       text not null,
  published  boolean default true
);

create table if not exists public.enquiries (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  type       text default 'contact',           -- enquiry | reservation | source | contact
  car_id     uuid,
  car_label  text,
  name       text,
  contact    text,
  message    text,
  payload    jsonb
);

-- ---------- ROW LEVEL SECURITY ----------
alter table public.cars      enable row level security;
alter table public.reviews   enable row level security;
alter table public.enquiries enable row level security;

-- CARS: everyone can read; only logged-in admin can change
create policy "cars_public_read"   on public.cars for select using (true);
create policy "cars_admin_insert"  on public.cars for insert to authenticated with check (true);
create policy "cars_admin_update"  on public.cars for update to authenticated using (true);
create policy "cars_admin_delete"  on public.cars for delete to authenticated using (true);

-- REVIEWS: public reads published ones; anyone can post; admin manages
create policy "reviews_public_read"  on public.reviews for select using (published = true);
create policy "reviews_admin_read"   on public.reviews for select to authenticated using (true);
create policy "reviews_public_post"  on public.reviews for insert to anon, authenticated with check (rating between 1 and 5);
create policy "reviews_admin_update" on public.reviews for update to authenticated using (true);
create policy "reviews_admin_delete" on public.reviews for delete to authenticated using (true);

-- ENQUIRIES: anyone can submit; only admin can read
create policy "enquiries_public_insert" on public.enquiries for insert to anon, authenticated with check (true);
create policy "enquiries_admin_read"    on public.enquiries for select to authenticated using (true);

-- ---------- STORAGE (car photos) ----------
insert into storage.buckets (id, name, public)
values ('car-photos', 'car-photos', true)
on conflict (id) do nothing;

create policy "carphotos_public_read"  on storage.objects for select using (bucket_id = 'car-photos');
create policy "carphotos_admin_insert" on storage.objects for insert to authenticated with check (bucket_id = 'car-photos');
create policy "carphotos_admin_update" on storage.objects for update to authenticated using (bucket_id = 'car-photos');
create policy "carphotos_admin_delete" on storage.objects for delete to authenticated using (bucket_id = 'car-photos');

-- ---------- SEED DATA (delete later from the Admin dashboard) ----------
insert into public.cars (make, model, year, price, mileage, origin, status, fuel, gearbox, engine, power, color, co2, nox, delivery, description, sort) values
('Toyota','Land Cruiser Prado',2020,59000,58000,'Japan','in_stock','Diesel','Automatic','2.8L D-4D','201 bhp','Pearl White',200,55,'','Inspected JDM Prado with verified history. Customs and VRT handled.',10),
('Lexus','RX450h',2021,54000,39000,'Japan','in_stock','Hybrid','Automatic','3.5L Hybrid','308 bhp','Sonic Silver',150,14,'','Full-spec hybrid SUV, one owner. Registered and NCT-ready.',20),
('Land Rover','Range Rover Sport',2021,82000,41000,'UK','in_stock','Diesel','Automatic','3.0L D300','296 bhp','Santorini Black',190,50,'','UK-sourced, full service history. VRT and customs handled.',30),
('Audi','A4 TDI',2021,34000,52000,'UK','in_stock','Diesel','Automatic','2.0L TDI','188 bhp','Navarra Blue',130,45,'','S line spec, clean history, ready to drive.',40),
('BMW','M3',2020,68000,33000,'UK','in_stock','Petrol','Automatic','3.0L Twin-Turbo','503 bhp','Alpine White',230,40,'','Competition spec, full BMW service history.',50),
('Toyota','Yaris',2022,21500,27000,'Japan','in_stock','Hybrid','Automatic','1.5L Hybrid','114 bhp','Scarlet Red',100,9,'','Efficient hybrid hatch, low road-tax band.',60),
('Honda','Civic Type R',2020,41500,19500,'UK','in_stock','Petrol','Manual','2.0L VTEC Turbo','316 bhp','Championship White',182,28,'','One owner, factory standard. 6-month warranty.',70),
('Toyota','Supra',2021,64000,22000,'Japan','to_order','Petrol','Automatic','3.0L Turbo','335 bhp','Prominence Red',170,38,'9-11 weeks','A90 Supra, top trim. Turnkey landed price incl. shipping, customs & VRT.',80),
('Nissan','Skyline GT-R R34',1999,98000,76000,'Japan','to_order','Petrol','Manual','2.6L Twin-Turbo','276 bhp','Bayside Blue',280,65,'10-12 weeks','Iconic RB26DETT. Turnkey price includes shipping, customs and VRT.',90),
('Subaru','Impreza WRX STI',2018,37000,48000,'Japan','to_order','Petrol','Manual','2.5L Boxer Turbo','300 bhp','WR Blue',242,35,'8-10 weeks','Clean JDM STI, unmodified. Delivered to your door in Ireland.',100),
('Land Rover','Defender',2022,72000,28000,'UK','to_order','Diesel','Automatic','3.0L D300','296 bhp','Gondwana Stone',230,48,'1-2 weeks','UK Defender, fast turnaround. VRT calculated and included.',110),
('BMW','X5',2019,56000,64000,'UK','sold','Diesel','Automatic','3.0L Diesel','261 bhp','Carbon Black',175,52,'','Delivered to a customer in Galway. A past result.',120);

insert into public.reviews (name, rating, body) values
('Daithi O.',5,'Smooth import from Japan, kept me updated the whole way. Car arrived exactly as described.'),
('Marta K.',5,'Handled all the VRT and customs paperwork. No surprises on price. Would use again.');
