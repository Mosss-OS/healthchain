import { Bell, UserPlus, CheckCircle2, DollarSign, FileText } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { GlassCard } from "@/components/GlassCard";
import { mockNotifications } from "@/lib/mockData";

const iconMap = {
  access_request: { Icon: UserPlus, color: "text-primary bg-primary/10" },
  access_granted: { Icon: CheckCircle2, color: "text-success bg-success/10" },
  record_added: { Icon: FileText, color: "text-accent bg-accent/10" },
  payment_received: { Icon: DollarSign, color: "text-teal bg-teal/10" },
};

export default function Notifications() {
  return (
    <div>
      <PageHeader title="Notifications" back />

      <div className="px-5 space-y-2.5">
        {mockNotifications.map((n) => {
          const { Icon, color } = iconMap[n.type];
          return (
            <GlassCard key={n.id} className="p-4 flex gap-3 items-start">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold">{n.title}</p>
                  {!n.read && <span className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />}
                </div>
                <p className="text-sm text-muted-foreground">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
              </div>
            </GlassCard>
          );
        })}
        {mockNotifications.length === 0 && (
          <GlassCard className="p-10 text-center">
            <Bell className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="mt-3 font-semibold">All caught up</p>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
