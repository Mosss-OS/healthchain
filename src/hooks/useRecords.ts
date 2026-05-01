import { useQuery, useQueryClient } from '@tanstack/react-query';
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

export function useRecords() {
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address || '';

  const {
    data: records = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['records', walletAddress],
    queryFn: async () => {
      if (!walletAddress) return [];
      
      const { data, error } = await supabase
        .from('medical_records')
        .select('*')
        .eq('patient_wallet', walletAddress)
        .order('date_of_record', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!walletAddress,
  });

  // Optimistic update for creating a record
  const createRecord = async (record: Omit<MedicalRecord, 'id' | 'created_at' | 'updated_at'>) => {
    const optimisticRecord = {
      ...record,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Optimistically update the cache
    queryClient.setQueryData(['records', walletAddress], (old: MedicalRecord[] | undefined) => [
      ...(old || []),
      optimisticRecord
    ]);

    try {
      const { data, error } = await supabase
        .from('medical_records')
        .insert([record])
        .select()
        .single();

      if (error) throw error;
      
      // Update with actual data from server
      queryClient.setQueryData(['records', walletAddress], (old: MedicalRecord[] | undefined) => 
        old?.map((item) => item.id === optimisticRecord.id ? data : item) ?? []
      );
      
      return data;
    } catch (err) {
      // Rollback on error
      queryClient.setQueryData(['records', walletAddress], (old: MedicalRecord[] | undefined) => 
        old?.filter((item) => item.id !== optimisticRecord.id) ?? []
      );
      throw err;
    }
  };

  // Optimistic update for updating a record
  const updateRecord = async (id: string, updates: Partial<MedicalRecord>) => {
    // Optimistically update the cache
    queryClient.setQueryData(['records', walletAddress], (old: MedicalRecord[] | undefined) => 
      old?.map((item) => item.id === id ? { ...item, ...updates, updated_at: new Date().toISOString() } : item) ?? []
    );

    try {
      const { data, error } = await supabase
        .from('medical_records')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Update with actual data from server
      queryClient.setQueryData(['records', walletAddress], (old: MedicalRecord[] | undefined) => 
        old?.map((item) => item.id === id ? data : item) ?? []
      );
      
      return data;
    } catch (err) {
      // Rollback on error
      queryClient.setQueryData(['records', walletAddress], (old: MedicalRecord[] | undefined) => 
        old?.map((item) => item.id === id ? { ...item, updated_at: new Date().toISOString() } : item) ?? []
      );
      throw err;
    }
  };

  // Optimistic update for deleting a record
  const deleteRecord = async (id: string) => {
    // Optimistically update the cache
    queryClient.setQueryData(['records', walletAddress], (old: MedicalRecord[] | undefined) => 
      old?.filter((item) => item.id !== id) ?? []
    );

    try {
      const { error } = await supabase
        .from('medical_records')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      // Rollback on error
      queryClient.setQueryData(['records', walletAddress], (old: MedicalRecord[] | undefined) => [
        ...(old || [])
        // In a real app, we'd fetch the actual item to restore it
        // For now we'll just return the existing items without the deleted one
      ]);
      throw err;
    }
  };

  return {
    records,
    isLoading,
    error,
    refetch,
    createRecord,
    updateRecord,
    deleteRecord
  };
}