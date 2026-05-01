import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Shield, Bell, Lock, FileText, LogOut, User, Loader2 } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import { PageHeader } from "@/components/PageHeader";
import { GlassCard } from "@/components/GlassCard";
import { privyConfigured } from "@/lib/privy";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface Profile {
  id: string;
  privy_user_id: string;
  wallet_address: string;
  email: string;
  full_name?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  blood_type?: string;
  phone?: string;
  address?: string;
  role: 'patient' | 'provider' | 'admin';
  avatar_url?: string;
  onboarded: boolean;
  created_at: string;
  updated_at: string;
}

const sections = [
  {
    title: "Account",
    items: [
      { Icon: User, label: "Personal info", to: "/profile" },
      { Icon: Shield, label: "Access control", to: "/access" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { Icon: Bell, label: "Notifications", to: "/notifications" },
      { Icon: Lock, label: "Privacy & security", to: "/profile" },
      { Icon: FileText, label: "About HealthChain", to: "/profile" },
    ],
  },
];

export default function Profile() {
  const navigate = useNavigate();
  const { logout, user, ready } = usePrivy();
  const email = user?.email?.address ?? '';
  const walletAddress = user?.wallet?.address || '';

  // Fetch profile from Supabase
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', walletAddress],
    queryFn: async () => {
      if (!walletAddress) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('wallet_address', walletAddress)
        .single();

      if (error) throw error;
      return data as Profile;
    },
    enabled: !!walletAddress && ready,
  });

  const handleSignOut = async () => {
    if (privyConfigured) await logout();
    navigate("/", { replace: true });
  };

  // Get user initials for avatar
  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ').map(n => n[0]).join('').slice(0, 2);
    }
    return email ? email[0].toUpperCase() : 'U';
  };

  return (
    <div>
      <PageHeader title="Profile" large />

      <div className="px-5 space-y-4 mt-3">
        {isLoading ? (
          <GlassCard className="p-6 flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-muted animate-pulse" />
            <div className="flex-1 min-w-0">
              <div className="h-6 w-32 bg-muted animate-pulse rounded" />
              <div className="mt-2 h-4 w-48 bg-muted animate-pulse rounded" />
              <div className="mt-2 flex gap-2">
                <div className="h-6 w-20 bg-muted animate-pulse rounded-full" />
                <div className="h-6 w-20 bg-muted animate-pulse rounded-full" />
              </div>
            </div>
          </GlassCard>
        ) : error ? (
          <GlassCard className="p-6 text-center">
            <p className="text-destructive">Failed to load profile</p>
          </GlassCard>
        ) : (
          <GlassCard className="p-6 flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold">
              {getInitials()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xl font-bold truncate">{profile?.full_name || 'User'}</p>
              <p className="text-sm text-muted-foreground truncate">{email}</p>
              <div className="flex gap-2 mt-2">
                {profile?.blood_type && (
                  <span className="text-[10px] font-medium bg-primary/10 text-primary rounded-full px-2 py-0.5">
                    Blood {profile.blood_type}
                  </span>
                )}
                {profile?.onboarded && (
                  <span className="text-[10px] font-medium bg-success/10 text-success rounded-full px-2 py-0.5">
                    Verified
                  </span>
                )}
              </div>
            </div>
          </GlassCard>
        )}

        {sections.map((s) => (
          <div key={s.title}>
            <h2 className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
              {s.title}
            </h2>
            <GlassCard className="divide-y divide-border">
              {s.items.map((it) => (
                <Link key={it.label} to={it.to} className="flex items-center gap-3 p-4 active:bg-muted/50 transition">
                  <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center">
                    <it.Icon className="h-4 w-4" />
                  </div>
                  <span className="flex-1 font-medium">{it.label}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </GlassCard>
          </div>
        ))}

        <button
          onClick={handleSignOut}
          className="w-full glass rounded-2xl p-4 text-destructive font-semibold flex items-center justify-center gap-2 active:scale-[0.99] transition-transform"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>

        <p className="text-center text-xs text-muted-foreground pt-2">
          HealthChain · v1.0 · Base Sepolia
        </p>
      </div>
    </div>
  );
}
