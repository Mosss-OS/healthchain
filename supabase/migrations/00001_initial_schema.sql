-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- profiles
create table profiles (
  id uuid primary key default uuid_generate_v4(),
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

-- healthcare_providers
create table healthcare_providers (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references profiles(id) on delete cascade,
  institution_name text not null,
  license_number text unique not null,
  specialty text not null,
  verified boolean default false,
  verification_tx_hash text,
  created_at timestamptz default now()
);

-- medical_records
create table medical_records (
  id uuid primary key default uuid_generate_v4(),
  patient_wallet text not null references profiles(wallet_address),
  provider_wallet text references profiles(wallet_address),
  record_type text not null check (record_type in (
    'consultation', 'lab_result', 'prescription', 'imaging',
    'surgery', 'vaccination', 'allergy', 'vitals', 'discharge_summary'
  )),
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
  id uuid primary key default uuid_generate_v4(),
  record_id uuid references medical_records(id) on delete cascade,
  patient_wallet text not null,
  grantee_wallet text not null,
  grantee_profile_id uuid references profiles(id),
  permission_type text not null check (permission_type in ('read', 'read_write')),
  tx_hash text,
  usdc_fee_paid numeric(20, 6) default 0,
  expires_at timestamptz,
  is_active boolean default true,
  granted_at timestamptz default now(),
  revoked_at timestamptz
);

-- access_requests
create table access_requests (
  id uuid primary key default uuid_generate_v4(),
  requester_wallet text not null,
  patient_wallet text not null,
  record_id uuid references medical_records(id),
  reason text not null,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  usdc_deposit numeric(20, 6) default 0,
  deposit_tx_hash text,
  response_tx_hash text,
  created_at timestamptz default now(),
  responded_at timestamptz
);

-- notifications
create table notifications (
  id uuid primary key default uuid_generate_v4(),
  user_wallet text not null,
  type text not null check (type in (
    'access_request', 'access_granted', 'access_revoked',
    'record_added', 'payment_received', 'appointment_reminder'
  )),
  title text not null,
  message text not null,
  data jsonb default '{}',
  read boolean default false,
  created_at timestamptz default now()
);

-- audit_log
create table audit_log (
  id uuid primary key default uuid_generate_v4(),
  actor_wallet text not null,
  action text not null,
  resource_type text,
  resource_id uuid,
  tx_hash text,
  ip_address text,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

-- appointments
create table appointments (
  id uuid primary key default uuid_generate_v4(),
  patient_wallet text not null,
  provider_wallet text not null,
  title text not null,
  description text,
  scheduled_at timestamptz not null,
  duration_minutes int default 30,
  status text default 'scheduled' check (status in (
    'scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled'
  )),
  meeting_link text,
  created_at timestamptz default now()
);

-- vitals
create table vitals (
  id uuid primary key default uuid_generate_v4(),
  patient_wallet text not null,
  recorded_by text,
  heart_rate int,
  systolic_bp int,
  diastolic_bp int,
  temperature numeric(4,1),
  oxygen_saturation int,
  weight_kg numeric(5,2),
  height_cm numeric(5,1),
  glucose_mgdl int,
  recorded_at timestamptz not null,
  notes text,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table medical_records enable row level security;
alter table access_permissions enable row level security;
alter table access_requests enable row level security;
alter table notifications enable row level security;
alter table vitals enable row level security;
alter table appointments enable row level security;

-- RLS Policies
-- Patients can only see their own records
create policy "patients_own_records" on medical_records
  for select using (patient_wallet = auth.jwt() ->> 'wallet_address');

-- Patients can only see their own profile
create policy "patients_own_profile" on profiles
  for all using (wallet_address = auth.jwt() ->> 'wallet_address');

-- Grantee can see records they have access to
create policy "grantee_access" on medical_records
  for select using (
    exists (
      select 1 from access_permissions
      where record_id = medical_records.id
      and grantee_wallet = auth.jwt() ->> 'wallet_address'
      and is_active = true
      and (expires_at is null or expires_at > now())
    )
  );

-- Users can see their own notifications
create policy "own_notifications" on notifications
  for all using (user_wallet = auth.jwt() ->> 'wallet_address');

-- Users can see their own vitals
create policy "own_vitals" on vitals
  for all using (patient_wallet = auth.jwt() ->> 'wallet_address');

-- Users can see their own appointments
create policy "own_appointments" on appointments
  for all using (
    patient_wallet = auth.jwt() ->> 'wallet_address'
    or provider_wallet = auth.jwt() ->> 'wallet_address'
  );
