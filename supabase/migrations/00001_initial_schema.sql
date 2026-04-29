-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Alternative: enable pgcrypto for gen_random_uuid
create extension if not exists "pgcrypto";

-- profiles
create table profiles (
  id uuid primary key default gen_random_uuid(),
  privy_user_id text unique not null,
  wallet_address text unique not null,
  email text unique not null,
  full_name text,
  date_of_birth date,
  gender text check (gender in ('male', 'female', 'other', 'prefer_not_to_say')),
  blood_type text,
  phone text,
  address text,
  role text not null default 'patient' check (role in ('patient', 'provider', 'admin')),
  avatar_url text,
  onboarded boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- medical_records
create table medical_records (
  id uuid primary key default gen_random_uuid(),
  patient_wallet text not null,
  provider_wallet text,
  record_type text not null check (record_type in ('consultation', 'lab_result', 'prescription', 'imaging', 'surgery', 'vaccination', 'allergy', 'vitals', 'discharge_summary')),
  title text not null,
  description text,
  ipfs_hash text,
  blockchain_tx_hash text,
  on_chain_record_id text,
  encrypted_key text,
  metadata jsonb default '{}',
  date_of_record timestamptz not null,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- access_permissions
create table access_permissions (
  id uuid primary key default gen_random_uuid(),
  record_id uuid not null references medical_records(id) on delete cascade,
  patient_wallet text not null,
  grantee_wallet text not null,
  grantee_profile_id uuid,
  permission_type text not null check (permission_type in ('read', 'read_write')),
  tx_hash text,
  usdc_fee_paid numeric default 0,
  expires_at timestamptz,
  is_active boolean default true,
  granted_at timestamptz default now(),
  revoked_at timestamptz
);

-- providers
create table providers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  institution_name text not null,
  license_number text not null,
  specialty text not null,
  verified boolean default false,
  verification_tx_hash text,
  created_at timestamptz default now()
);

-- vitals
create table vitals (
  id uuid primary key default gen_random_uuid(),
  patient_wallet text not null,
  recorded_by text,
  heart_rate integer,
  systolic_bp integer,
  diastolic_bp integer,
  temperature numeric(3,1),
  oxygen_saturation integer,
  weight_kg numeric(5,2),
  height_cm numeric(5,2),
  glucose_mgdl integer,
  recorded_at timestamptz not null,
  notes text,
  created_at timestamptz default now()
);

-- appointments
create table appointments (
  id uuid primary key default gen_random_uuid(),
  patient_wallet text not null,
  provider_wallet text not null,
  appointment_type text not null check (appointment_type in ('consultation', 'follow_up', 'emergency', 'procedure', 'checkup')),
  scheduled_at timestamptz not null,
  duration_minutes integer not null default 30,
  status text not null default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled', 'no_show')),
  reason text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- health_metrics
create table health_metrics (
  id uuid primary key default gen_random_uuid(),
  patient_wallet text not null,
  metric_type text not null check (metric_type in ('weight', 'blood_pressure', 'heart_rate', 'temperature', 'oxygen_saturation', 'glucose')),
  value numeric not null,
  unit text not null,
  recorded_at timestamptz not null,
  notes text,
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table profiles enable row level security;
alter table medical_records enable row level security;
alter table access_permissions enable row level security;
alter table providers enable row level security;
alter table vitals enable row level security;
alter table appointments enable row level security;
alter table health_metrics enable row level security;

-- Create profiles policies
create policy "Profiles are viewable by own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Profiles are updatable by own profile"
  on profiles for update
  using (auth.uid() = id);

-- Create medical_records policies
create policy "Medical records are viewable by patient or grantee"
  on medical_records for select
  using (
    patient_wallet = current_setting('request.jwt.claims', true)::json ->> 'wallet_address'
    OR id IN (
      SELECT record_id FROM access_permissions 
      WHERE grantee_wallet = current_setting('request.jwt.claims', true)::json ->> 'wallet_address'
      AND is_active = true
      AND (expires_at IS NULL OR expires_at > now())
    )
  );

create policy "Medical records are updatable by patient"
  on medical_records for update
  using (patient_wallet = current_setting('request.jwt.claims', true)::json ->> 'wallet_address');

create policy "Medical records are insertable by patient"
  on medical_records for insert
  with check (patient_wallet = current_setting('request.jwt.claims', true)::json ->> 'wallet_address');

-- Create access_permissions policies
create policy "Access permissions are viewable by patient or grantee"
  on access_permissions for select
  using (
    patient_wallet = current_setting('request.jwt.claims', true)::json ->> 'wallet_address'
    OR grantee_wallet = current_setting('request.jwt.claims', true)::json ->> 'wallet_address'
  );

create policy "Access permissions are updatable by patient"
  on access_permissions for update
  using (patient_wallet = current_setting('request.jwt.claims', true)::json ->> 'wallet_address');

create policy "Access permissions are insertable by patient"
  on access_permissions for insert
  with check (patient_wallet = current_setting('request.jwt.claims', true)::json ->> 'wallet_address');

-- Create providers policies
create policy "Providers are viewable by own profile"
  on providers for select
  using (profile_id = auth.uid());

create policy "Providers are updatable by own profile"
  on providers for update
  using (profile_id = auth.uid());

-- Create vitals policies
create policy "Vitals are viewable by patient or recorder"
  on vitals for select
  using (
    patient_wallet = current_setting('request.jwt.claims', true)::json ->> 'wallet_address'
    OR recorded_by = current_setting('request.jwt.claims', true)::json ->> 'wallet_address'
  );

create policy "Vitals are updatable by patient or recorder"
  on vitals for update
  using (
    patient_wallet = current_setting('request.jwt.claims', true)::json ->> 'wallet_address'
    OR recorded_by = current_setting('request.jwt.claims', true)::json ->> 'wallet_address'
  );

create policy "Vitals are insertable by patient or recorder"
  on vitals for insert
  with check (
    patient_wallet = current_setting('request.jwt.claims', true)::json ->> 'wallet_address'
    OR recorded_by = current_setting('request.jwt.claims', true)::json ->> 'wallet_address'
  );

-- Create appointments policies
create policy "Appointments are viewable by patient or provider"
  on appointments for select
  using (
    patient_wallet = current_setting('request.jwt.claims', true)::json ->> 'wallet_address'
    OR provider_wallet = current_setting('request.jwt.claims', true)::json ->> 'wallet_address'
  );

create policy "Appointments are updatable by patient or provider"
  on appointments for update
  using (
    patient_wallet = current_setting('request.jwt.claims', true)::json ->> 'wallet_address'
    OR provider_wallet = current_setting('request.jwt.claims', true)::json ->> 'wallet_address'
  );

create policy "Appointments are insertable by patient or provider"
  on appointments for insert
  with check (
    patient_wallet = current_setting('request.jwt.claims', true)::json ->> 'wallet_address'
    OR provider_wallet = current_setting('request.jwt.claims', true)::json ->> 'wallet_address'
  );

-- Create health_metrics policies
create policy "Health metrics are viewable by patient"
  on health_metrics for select
  using (patient_wallet = current_setting('request.jwt.claims', true)::json ->> 'wallet_address');

create policy "Health metrics are updatable by patient"
  on health_metrics for update
  using (patient_wallet = current_setting('request.jwt.claims', true)::json ->> 'wallet_address');

create policy "Health metrics are insertable by patient"
  on health_metrics for insert
  with check (patient_wallet = current_setting('request.jwt.claims', true)::json ->> 'wallet_address');
