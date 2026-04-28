import { Link } from "react-router-dom";
import { Bell, Copy, Heart, Activity, Droplet, Thermometer, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { GlassCard } from "@/components/GlassCard";
import { RecordIcon } from "@/components/RecordIcon";
import { mockUser, mockRecords, mockNotifications, usdcBalance } from "@/lib/mockData";

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
};

const vitals = [
  { icon: Heart, label: "Heart rate", value: "68", unit: "bpm", color: "text-pink bg-pink/10" },
  { icon: Activity, label: "Blood pressure", value: "118/76", unit: "mmHg", color: "text-primary bg-primary/10" },
  { icon: Droplet, label: "SpO₂", value: "98", unit: "%", color: "text-teal bg-teal/10" },
  { icon: Thermometer, label: "Temperature", value: "36.7", unit: "°C", color: "text-warning bg-warning/10" },
];

export default function Dashboard() {
  const recent = mockRecords.slice(0, 3);
  const unread = mockNotifications.filter((n) => !n.read).length;
  const date = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
  const short = `${mockUser.wallet.slice(0, 6)}…${mockUser.wallet.slice(-4)}`;

  return (
    <div className="px-5 pt-[max(1rem,env(safe-area-inset-top))] space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between pt-2">
        <div>
          <p className="text-muted-foreground text-sm">{date}</p>
          <h1 className="text-[32px] font-bold leading-tight tracking-tight mt-1">
            {greeting()},<br />{mockUser.name.split(" ")[0]} 👋
          </h1>
          <button
            onClick={() => { navigator.clipboard.writeText(mockUser.wallet); toast.success("Wallet copied"); }}
            className="mt-3 inline-flex items-center gap-1.5 glass rounded-full px-3 py-1.5 text-xs font-medium"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            {short}
            <Copy className="h-3 w-3 opacity-60" />
          </button>
        </div>
        <Link to="/notifications" className="relative h-11 w-11 glass rounded-full flex items-center justify-center">
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
          )}
        </Link>
      </div>

      {/* Health score */}
      <GlassCard className="p-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-pink" />
        <div className="relative text-primary-foreground">
          <p className="text-sm opacity-80">Overall Health Score</p>
          <div className="flex items-end justify-between mt-2">
            <div>
              <p className="text-6xl font-bold tracking-tighter">{mockUser.healthScore}</p>
              <p className="text-sm opacity-80 mt-1">Great condition · up 3 this week</p>
            </div>
            <div className="relative h-24 w-24">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle cx="50" cy="50" r="42" strokeWidth="8" className="fill-none stroke-white/20" />
                <motion.circle
                  cx="50" cy="50" r="42" strokeWidth="8" strokeLinecap="round"
                  className="fill-none stroke-white"
                  initial={{ strokeDasharray: "0 264" }}
                  animate={{ strokeDasharray: `${(mockUser.healthScore / 100) * 264} 264` }}
                  transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
              </svg>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Vitals */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-[22px] font-bold tracking-tight">Vitals</h2>
          <Link to="/records" className="text-primary text-sm font-medium">See all</Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {vitals.map((v) => (
            <GlassCard key={v.label} className="p-4">
              <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${v.color}`}>
                <v.icon className="h-4 w-4" strokeWidth={2.4} />
              </div>
              <p className="text-xs text-muted-foreground mt-3">{v.label}</p>
              <p className="text-2xl font-bold mt-0.5">
                {v.value}<span className="text-sm text-muted-foreground font-normal ml-1">{v.unit}</span>
              </p>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Wallet quick */}
      <GlassCard className="p-5 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">USDC balance</p>
          <p className="text-2xl font-bold mt-0.5">${usdcBalance.toFixed(2)}</p>
        </div>
        <Link to="/wallet" className="bg-foreground text-background rounded-full px-4 py-2 text-sm font-semibold">
          Open wallet
        </Link>
      </GlassCard>

      {/* Recent records */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-[22px] font-bold tracking-tight">Recent records</h2>
          <Link to="/records" className="text-primary text-sm font-medium">See all</Link>
        </div>
        <GlassCard className="divide-y divide-border overflow-hidden">
          {recent.map((r) => (
            <Link key={r.id} to={`/records/${r.id}`} className="flex items-center gap-3 p-4 active:bg-muted/50 transition-colors">
              <RecordIcon type={r.type} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{r.title}</p>
                <p className="text-xs text-muted-foreground truncate">{r.provider} · {new Date(r.date).toLocaleDateString()}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </GlassCard>
      </div>
    </div>
  );
}
