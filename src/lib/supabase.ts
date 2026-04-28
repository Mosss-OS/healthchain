import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types based on the database schema
export interface Profile {
  id: string
  privy_user_id: string
  wallet_address: string
  email: string
  full_name?: string
  date_of_birth?: string
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say'
  blood_type?: string
  phone?: string
  address?: string
  role: 'patient' | 'provider' | 'admin'
  avatar_url?: string
  onboarded: boolean
  created_at: string
  updated_at: string
}

export interface MedicalRecord {
  id: string
  patient_wallet: string
  provider_wallet?: string
  record_type: 'consultation' | 'lab_result' | 'prescription' | 'imaging' | 'surgery' | 'vaccination' | 'allergy' | 'vitals' | 'discharge_summary'
  title: string
  description?: string
  ipfs_hash?: string
  blockchain_tx_hash?: string
  on_chain_record_id?: string
  encrypted_key?: string
  metadata: Record<string, unknown>
  date_of_record: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AccessPermission {
  id: string
  record_id: string
  patient_wallet: string
  grantee_wallet: string
  grantee_profile_id?: string
  permission_type: 'read' | 'read_write'
  tx_hash?: string
  usdc_fee_paid: number
  expires_at?: string
  is_active: boolean
  granted_at: string
  revoked_at?: string
}

export interface Provider {
  id: string
  profile_id: string
  institution_name: string
  license_number: string
  specialty: string
  verified: boolean
  verification_tx_hash?: string
  created_at: string
}

export interface Vital {
  id: string
  patient_wallet: string
  recorded_by?: string
  heart_rate?: number
  systolic_bp?: number
  diastolic_bp?: number
  temperature?: number
  oxygen_saturation?: number
  weight_kg?: number
  height_cm?: number
  glucose_mgdl?: number
  recorded_at: string
  notes?: string
  created_at: string
}
