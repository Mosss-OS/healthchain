import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { usePrivy } from '@privy-io/react-auth';

export interface Notification {
  id: string;
  user_wallet: string;
  type: 'access_request' | 'access_granted' | 'record_added' | 'payment_received';
  title: string;
  message: string;
  time: string;
  read: boolean;
  created_at: string;
}

export function useNotifications() {
  const queryClient = useQueryClient();
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address || '';

  const {
    data: notifications = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['notifications', walletAddress],
    queryFn: async () => {
      if (!walletAddress) return [];
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_wallet', walletAddress)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!walletAddress,
  });

  // Mark notification as read
  const markAsRead = async (id: string) => {
    // Optimistically update the cache
    queryClient.setQueryData(['notifications', walletAddress], (old: Notification[] | undefined) => 
      old?.map((item) => item.id === id ? { ...item, read: true } : item) ?? []
    );

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      // Rollback on error
      queryClient.setQueryData(['notifications', walletAddress], (old: Notification[] | undefined) => 
        old?.map((item) => item.id === id ? { ...item, read: false } : item) ?? []
      );
      throw err;
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    // Optimistically update the cache
    queryClient.setQueryData(['notifications', walletAddress], (old: Notification[] | undefined) => 
      old?.map((item) => ({ ...item, read: true })) ?? []
    );

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_wallet', walletAddress)
      .eq('read', false);

    if (error) throw error;
  };

  return {
    notifications,
    isLoading,
    error,
    refetch,
    markAsRead,
    markAllAsRead,
  };
}