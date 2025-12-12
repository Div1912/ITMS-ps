-- Create geometry_data table to store track geometry sensor readings
create table if not exists public.geometry_data (
  id uuid primary key default gen_random_uuid(),
  lateral_deviation numeric not null,
  vertical_deviation numeric not null,
  gauge numeric not null,
  twist numeric not null,
  curvature numeric not null,
  cant numeric not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS for security
alter table public.geometry_data enable row level security;

-- Allow anyone to insert geometry data (from Pi sensors)
create policy "geometry_insert_public"
  on public.geometry_data for insert
  with check (true);

-- Allow anyone to read geometry data
create policy "geometry_select_public"
  on public.geometry_data for select
  using (true);

-- Create index for faster queries on created_at
create index if not exists geometry_data_created_at_idx 
  on public.geometry_data (created_at desc);
