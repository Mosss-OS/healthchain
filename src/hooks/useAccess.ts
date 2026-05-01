import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { usePrivy } from '@privy-io/react-auth';

export interface AccessGrant {
  id: string;
  record_id: string;
  patient_wallet: string;
  grantee_wallet: string;
  grantee_profile_id?: string;
  permission_type: 'read' | 'read_write';
  tx_hash?: string;
  usdc_fee_paid: number;
  expires_at?: string;
  is_active: boolean;
  granted_at: string;
  revoked_at?: string;
  records?: {
    title: string;
    record_type: string;
  };
  profiles?: {
    full_name?: string;
    email?: string;
  };
}

export function useAccessGrants() {
  const queryClient = useQueryClient();
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address || '';

  const {
    data: grants = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['access_grants', walletAddress],
    queryFn: async () => {
      if (!walletAddress) return [];
      
      const { data, error } = await supabase
        .from('access_permissions')
        .select(`
          *,
          records:record_id (title, record_type),
          profiles:grantee_profile_id (full_name, email)
        `)
        .eq('patient_wallet', walletAddress)
        .order('granted_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!walletAddress,
  });

  // Revoke access
  const revokeAccess = async (id: string) => {
    // Optimistically update the cache
    queryClient.setQueryData(['access_grants', walletAddress], (old: AccessGrant[] | undefined) => 
      old?.map((item) => item.id === id ? { ...item, is_active: false, revoked_at: new Date().toISOString() } : item) ?? []
    );

    try {
      const { error } = await supabase
        .from('access_permissions')
        .update({ is_active: false, revoked_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      // Rollback on error
      queryClient.setQueryData(['access_grants', walletAddress], (old: AccessGrant[] | undefined) => 
        old?.map((item) => item.id === id ? { ...item, is_active: true, revoked_at: undefined } : item) ?? []
      );
      throw err;
    }
  };

  return {
    grants,
    isLoading,
    error,
    refetch,
    revokeAccess,
  };
}