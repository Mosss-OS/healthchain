import { useEffect, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';

export function useAuth() {
  const { user, isAuthenticated, setUser, logout } = useAppStore();
  const { ready, authenticated, login, logout: privyLogout, user: privyUser } = usePrivy();
  const navigate = useNavigate();
  const hasNavigated = useRef(false);

  useEffect(() => {
    if (ready && authenticated && privyUser && !hasNavigated.current) {
      hasNavigated.current = true;
      
      const doRegistration = async () => {
        try {
          let token = '';
          try {
            if (privyUser.getAccessToken) {
              token = await privyUser.getAccessToken();
            } else if ((privyUser as unknown as Record<string, unknown>)['token']) {
              token = (privyUser as unknown as Record<string, unknown>)['token'] as string;
            }
          } catch (e) {
            console.warn('Could not get token:', e);
          }

          if (token) {
            try {
              const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/auth/register-user`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                  email: privyUser.email,
                  walletAddress: privyUser.wallet?.address,
                  fullName: privyUser.email?.split('@')[0],
                }),
              });
              const { data, error } = await response.json();
              if (!error) {
                setUser(data);
              }
            } catch (err) {
              console.error('Registration failed:', err);
            }
          }
        } catch (err) {
          console.error('Auth setup failed:', err);
        }
        
        navigate('/dashboard', { replace: true });
      };
      
      doRegistration();
    }
  }, [ready, authenticated, privyUser, setUser, navigate]);

  const handleLogin = useCallback(() => {
    if (authenticated || privyUser) {
      hasNavigated.current = false;
      navigate('/dashboard', { replace: true });
      return;
    }
    hasNavigated.current = false;
    login();
  }, [login, authenticated, privyUser, navigate]);

  const handleLogout = useCallback(() => {
    hasNavigated.current = false;
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
