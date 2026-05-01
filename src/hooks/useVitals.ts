import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { usePrivy } from '@privy-io/react-auth';

export interface Vital {
  id: string;
  patient_wallet: string;
  recorded_by?: string;
  heart_rate?: number;
  systolic_bp?: number;
  diastolic_bp?: number;
  temperature?: number;
  oxygen_saturation?: number;
  weight_kg?: number;
  height_cm?: number;
  glucose_mgdl?: number;
  recorded_at: string;
  notes?: string;
  created_at: string;
}

export function useVitals() {
  const queryClient = useQueryClient();
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address || '';

  const {
    data: vitals = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['vitals', walletAddress],
    queryFn: async () => {
      if (!walletAddress) return [];
      
      const { data, error } = await supabase
        .from('vitals')
        .select('*')
        .eq('patient_wallet', walletAddress)
        .order('recorded_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!walletAddress,
  });

  // Optimistic update for creating vitals
  const createVital = async (vital: Omit<Vital, 'id' | 'created_at'>) => {
    const optimisticVital = {
      ...vital,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
    };

    // Optimistically update the cache
    queryClient.setQueryData(['vitals', walletAddress], (old: Vital[] | undefined) => [
      ...(old || []),
      optimisticVital
    ]);

    try {
      const { data, error } = await supabase
        .from('vitals')
        .insert([vital])
        .select()
        .single();

      if (error) throw error;
      
      // Update with actual data from server
      queryClient.setQueryData(['vitals', walletAddress], (old: Vital[] | undefined) => 
        old?.map((item) => item.id === optimisticVital.id ? data : item) ?? []
      );
      
      return data;
    } catch (err) {
      // Rollback on error
      queryClient.setQueryData(['vitals', walletAddress], (old: Vital[] | undefined) => 
        old?.filter((item) => item.id !== optimisticVital.id) ?? []
      );
      throw err;
    }
  };

  return {
    vitals,
    isLoading,
    error,
    refetch,
    createVital,
  };
}