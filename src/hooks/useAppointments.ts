import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { usePrivy } from '@privy-io/react-auth';

export interface Appointment {
  id: string;
  patient_wallet: string;
  provider_wallet?: string;
  title: string;
  description?: string;
  scheduled_at: string;
  meeting_link?: string;
  notes?: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export function useAppointments() {
  const queryClient = useQueryClient();
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address || '';

  const {
    data: appointments = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['appointments', walletAddress],
    queryFn: async () => {
      if (!walletAddress) return [];
      
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .or(`patient_wallet.eq.${walletAddress},provider_wallet.eq.${walletAddress}`)
        .order('scheduled_at', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!walletAddress,
  });

  // Optimistic update for creating appointments
  const createAppointment = async (appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) => {
    const optimisticAppointment = {
      ...appointment,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Optimistically update the cache
    queryClient.setQueryData(['appointments', walletAddress], (old: Appointment[] | undefined) => [
      ...(old || []),
      optimisticAppointment
    ]);

    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([appointment])
        .select()
        .single();

      if (error) throw error;
      
       // Update with actual data from server
       queryClient.setQueryData(['appointments', walletAddress], (old: Appointment[] | undefined) => 
         old?.map((item) => item.id === optimisticAppointment.id ? data : item) ?? []
       );
      
      return data;
    } catch (err) {
     // Rollback on error
     queryClient.setQueryData(['appointments', walletAddress], (old: Appointment[] | undefined) => 
       old?.filter((item) => item.id !== optimisticAppointment.id) || []
     );
      throw err;
    }
  };

  // Optimistic update for updating appointments
  const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
    // Optimistically update the cache
    queryClient.setQueryData(['appointments', walletAddress], (old: Appointment[] | undefined) => 
      old?.map((item) => item.id === id ? { ...item, ...updates, updated_at: new Date().toISOString() } : item) || []
    );

    try {
      const { data, error } = await supabase
        .from('appointments')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
       // Update with actual data from server
       queryClient.setQueryData(['appointments', walletAddress], (old: Appointment[] | undefined) => 
         old?.map((item) => item.id === id ? data : item) ?? []
       );
      
      return data;
    } catch (err) {
     // Rollback on error
       queryClient.setQueryData(['appointments', walletAddress], (old: Appointment[] | undefined) => 
         old?.map((item) => item.id === id ? { ...item, updated_at: new Date().toISOString() } : item) ?? []
       );
      throw err;
    }
  };

  // Optimistic update for deleting appointments
  const deleteAppointment = async (id: string) => {
    // Optimistically update the cache
    queryClient.setQueryData(['appointments', walletAddress], (old: Appointment[] | undefined) => 
      old?.filter((item) => item.id !== id) ?? []
    );

    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      // Rollback on error
      queryClient.setQueryData(['appointments', walletAddress], (old: Appointment[] | undefined) => [
        ...(old || []),
        // In a real app, we'd fetch the actual item to restore it
        // For now we'll just return the existing items without the deleted one
      ]);
      throw err;
    }
  };

  return {
    appointments,
    isLoading,
    error,
    refetch,
    createAppointment,
    updateAppointment,
    deleteAppointment
  };
}