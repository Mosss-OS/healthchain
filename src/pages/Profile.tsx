import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Shield, Bell, Lock, FileText, LogOut, User } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import { PageHeader } from "@/components/PageHeader";
import { GlassCard } from "@/components/GlassCard";
import { mockUser } from "@/lib/mockData";
import { privyConfigured } from "@/lib/privy";

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
  const { logout, user } = usePrivy();
  const email = user?.email?.address ?? mockUser.email;

  const handleSignOut = async () => {
    if (privyConfigured) await logout();
    navigate("/", { replace: true });
  };

  return (
    <div>
      <PageHeader title="Profile" large />

      <div className="px-5 space-y-4 mt-3">
        <GlassCard className="p-6 flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold">
            {mockUser.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xl font-bold truncate">{mockUser.name}</p>
            <p className="text-sm text-muted-foreground truncate">{email}</p>
            <div className="flex gap-2 mt-2">
              <span className="text-[10px] font-medium bg-primary/10 text-primary rounded-full px-2 py-0.5">
                Blood {mockUser.bloodType}
              </span>
              <span className="text-[10px] font-medium bg-success/10 text-success rounded-full px-2 py-0.5">
                Verified
              </span>
            </div>
          </div>
        </GlassCard>

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
