import { useEffect, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';

export function useAuth() {
  const { user, isAuthenticated, setUser, logout } = useAppStore();
  const { ready, authenticated, login, logout: privyLogout, user: privyUser } = usePrivy();
  const navigate = useNavigate();

  // Handle login success - register user in Supabase
  useEffect(() => {
    if (ready && authenticated && privyUser) {
      const registerUser = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/auth/register-user`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${await privyUser.getIdToken()}`,
            },
            body: JSON.stringify({
              email: privyUser.email,
              walletAddress: privyUser.wallet?.address,
              fullName: privyUser.email?.split('@')[0],
            }),
          });

          const { data, error } = await response.json();

          if (error) throw new Error(error);

          setUser(data);
          navigate('/dashboard', { replace: true });
        } catch (err) {
          console.error('Registration failed:', err);
        }
      };

      registerUser();
    }
  }, [ready, authenticated, privyUser, setUser, navigate]);

  const handleLogin = useCallback(() => {
    login();
  }, [login]);

  const handleLogout = useCallback(() => {
    privyLogout();
    logout();
    navigate('/', { replace: true });
  }, [privyLogout, logout, navigate]);

  return {
    user,
    isAuthenticated,
    isReady: ready,
    handleLogin,
    handleLogout,
    privyUser,
  };
}
