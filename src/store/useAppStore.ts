import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Profile } from '@/lib/supabase';

interface AppState {
  user: Profile | null;
  isAuthenticated: boolean;
  setUser: (user: Profile | null) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'healthchain-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
