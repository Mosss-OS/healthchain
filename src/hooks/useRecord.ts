import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { usePrivy } from '@privy-io/react-auth';

export interface MedicalRecord {
  id: string;
  patient_wallet: string;
  provider_wallet?: string;
  record_type: 'consultation' | 'lab_result' | 'prescription' | 'imaging' | 'surgery' | 'vaccination' | 'allergy' | 'vitals' | 'discharge_summary';
  title: string;
  description?: string;
  ipfs_hash?: string;
  blockchain_tx_hash?: string;
  on_chain_record_id?: string;
  encrypted_key?: string;
  metadata: Record<string, unknown>;
  date_of_record: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useRecord(id: string) {
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address || '';

  const {
    data: record,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['record', id, walletAddress],
    queryFn: async () => {
      if (!walletAddress || !id) throw new Error('Missing required parameters');
      
      const { data, error } = await supabase
        .from('medical_records')
        .select('*')
        .eq('id', id)
        .eq('patient_wallet', walletAddress) // Ensure the record belongs to the user
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!walletAddress && !!id,
  });

  return {
    record,
    isLoading,
    error,
    refetch
  };
}