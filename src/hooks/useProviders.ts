import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { usePrivy } from '@privy-io/react-auth';

export interface Provider {
  id: string;
  profile_id: string;
  institution_name: string;
  license_number: string;
  specialty: string;
  verified: boolean;
  verification_tx_hash?: string;
  created_at: string;
  profiles?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export function useProviders(searchQuery?: string) {
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address || '';

  const {
    data: providers = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['providers', searchQuery, walletAddress],
    queryFn: async () => {
      if (!walletAddress) return [];
      
      let query = supabase
        .from('providers')
        .select(`
          *,
          profiles:profile_id (
            full_name,
            avatar_url
          )
        `)
        .eq('verified', true);

      if (searchQuery) {
        query = query.or(`specialty.ilike.%${searchQuery}%,institution_name.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!walletAddress,
  });

  return {
    providers,
    isLoading,
    error,
    refetch
  };
}