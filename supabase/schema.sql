-- HealthChain Supabase Database Schema

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 1. Profiles table (linked to Privy users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  privy_user_id text unique,
  wallet_address text unique,
  email text,
  full_name text,
  date_of_birth date,
  gender text check (gender in ('male', 'female', 'other', 'prefer_not_to_say')),
  blood_type text,
  phone text,
  address text,
  role text default 'patient' check (role in ('patient', 'provider', 'admin')),
  avatar_url text,
  onboarded boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Policies for profiles
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- 2. Medical Records table
create table if not exists public.medical_records (
  id uuid default gen_random_uuid() primary key,
  patient_wallet text not null,
  provider_wallet text,
  record_type text not null check (record_type in ('consultation', 'lab_result', 'prescription', 'imaging', 'surgery', 'vaccination', 'allergy', 'vitals', 'discharge_summary')),
  title text not null,
  description text,
  ipfs_hash text,
  blockchain_tx_hash text,
  on_chain_record_id text,
  encrypted_key text,
  metadata jsonb default '{}'::jsonb,
  date_of_record date not null,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table public.medical_records enable row level security;

-- Policies for medical_records
create policy "Patients can view own records" on public.medical_records
  for select using (patient_wallet = auth.jwt() ->> 'wallet_address'::text);

create policy "Patients can insert own records" on public.medical_records
  for insert with check (patient_wallet = auth.jwt() ->> 'wallet_address'::text);

create policy "Patients can update own records" on public.medical_records
  for update using (patient_wallet = auth.jwt() ->> 'wallet_address'::text);

-- 3. Access Permissions table
create table if not exists public.access_permissions (
  id uuid default gen_random_uuid() primary key,
  record_id text not null,
  patient_wallet text not null,
  grantee_wallet text not null,
  grantee_profile_id uuid references public.profiles(id),
  permission_type text default 'read' check (permission_type in ('read', 'read_write')),
  tx_hash text,
  usdc_fee_paid numeric default 0,
  expires_at timestamp with time zone,
  is_active boolean default true,
  granted_at timestamp with time zone default timezone('utc'::text, now()),
  revoked_at timestamp with time zone
);

-- Enable RLS
alter table public.access_permissions enable row level security;

-- Policies for access_permissions
create policy "Patients can manage own grants" on public.access_permissions
  for all using (patient_wallet = auth.jwt() ->> 'wallet_address'::text);

create policy "Grantees can view their grants" on public.access_permissions
  for select using (grantee_wallet = auth.jwt() ->> 'wallet_address'::text);

-- 4. Appointments table
create table if not exists public.appointments (
  id uuid default gen_random_uuid() primary key,
  patient_wallet text not null,
  provider_wallet text,
  title text not null,
  description text,
  scheduled_at timestamp with time zone not null,
  meeting_link text,
  notes text,
  status text default 'scheduled' check (status in ('scheduled', 'confirmed', 'completed', 'cancelled')),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table public.appointments enable row level security;

-- Policies for appointments
create policy "Users can view own appointments" on public.appointments
  for select using (
    patient_wallet = auth.jwt() ->> 'wallet_address'::text or 
    provider_wallet = auth.jwt() ->> 'wallet_address'::text
  );

create policy "Patients can manage own appointments" on public.appointments
  for all using (patient_wallet = auth.jwt() ->> 'wallet_address'::text);

-- 5. Vitals table
create table if not exists public.vitals (
  id uuid default gen_random_uuid() primary key,
  patient_wallet text not null,
  recorded_by text,
  heart_rate integer,
  systolic_bp integer,
  diastolic_bp integer,
  temperature numeric(4,1),
  oxygen_saturation integer,
  weight_kg numeric(5,2),
  height_cm numeric(5,2),
  glucose_mgdl integer,
  recorded_at timestamp with time zone default now(),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table public.vitals enable row level security;

-- Policies for vitals
create policy "Patients can manage own vitals" on public.vitals
  for all using (patient_wallet = auth.jwt() ->> 'wallet_address'::text);

-- 6. Notifications table
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_wallet text not null,
  type text not null check (type in ('access_request', 'access_granted', 'record_added', 'payment_received')),
  title text not null,
  message text not null,
  time text,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table public.notifications enable row level security;

-- Policies for notifications
create policy "Users can view own notifications" on public.notifications
  for select using (user_wallet = auth.jwt() ->> 'wallet_address'::text);

create policy "Users can update own notifications" on public.notifications
  for update using (user_wallet = auth.jwt() ->> 'wallet_address'::text);

-- 7. Providers table
create table if not exists public.providers (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.profiles(id),
  institution_name text,
  license_number text,
  specialty text,
  verified boolean default false,
  verification_tx_hash text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table public.providers enable row level security;

-- Policies for providers
create policy "Anyone can view verified providers" on public.providers
  for select using (verified = true);

create policy "Providers can update own profile" on public.providers
  for update using (profile_id = auth.uid());

-- Indexes for performance
create index if not exists idx_medical_records_patient on public.medical_records(patient_wallet);
create index if not exists idx_medical_records_active on public.medical_records(is_active);
create index if not exists idx_access_permissions_patient on public.access_permissions(patient_wallet);
create index if not exists idx_access_permissions_grantee on public.access_permissions(grantee_wallet);
create index if not exists idx_appointments_patient on public.appointments(patient_wallet);
create index if not exists idx_appointments_scheduled on public.appointments(scheduled_at);
create index if not exists idx_vitals_patient on public.vitals(patient_wallet);
create index if not exists idx_notifications_user on public.notifications(user_wallet);
create index if not exists idx_notifications_unread on public.notifications(read) where read = false;

-- Functions to update updated_at automatically
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply updated_at triggers
create trigger handle_updated_at before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger handle_updated_at before update on public.medical_records
  for each row execute function public.handle_updated_at();

create trigger handle_updated_at before update on public.appointments
  for each row execute function public.handle_updated_at();
