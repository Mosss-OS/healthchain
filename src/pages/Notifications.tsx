import { useState } from "react";
import { Bell, UserPlus, CheckCircle2, DollarSign, FileText, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { GlassCard } from "@/components/GlassCard";
import { useNotifications } from "@/hooks/useNotifications";

const iconMap = {
  access_request: { Icon: UserPlus, color: "text-primary bg-primary/10" },
  access_granted: { Icon: CheckCircle2, color: "text-success bg-success/10" },
  record_added: { Icon: FileText, color: "text-accent bg-accent/10" },
  payment_received: { Icon: DollarSign, color: "text-teal bg-teal/10" },
};

export default function Notifications() {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const { notifications, isLoading, error, refetch, markAsRead, markAllAsRead } = useNotifications();

  const filtered = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const handleNotificationClick = async (id: string, read: boolean) => {
    if (!read) {
      try {
        await markAsRead(id);
      } catch (err) {
        console.error("Failed to mark as read:", err);
      }
    }
  };

  return (
    <div>
      <PageHeader title="Notifications" back>
        {notifications.some((n) => !n.read) && (
          <button
            onClick={handleMarkAllRead}
            className="text-xs md:text-sm text-primary font-medium min-h-[44px] flex items-center"
          >
            Mark all read
          </button>
        )}
      </PageHeader>

      <div className="px-5 space-y-2.5">
        {/* Filter */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-1 px-1 pb-1">
          {(["all", "unread"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 rounded-full px-3 md:px-4 py-1.5 text-xs md:text-sm font-medium transition-all min-h-[36px] md:min-h-[40px] ${
                filter === f
                  ? "bg-foreground text-background"
                  : "glass text-foreground"
              }`}
            >
              {f === "all" ? "All" : "Unread"}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-2.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <GlassCard key={i} className="p-4 flex gap-3 items-start">
                <div className="h-10 w-10 rounded-full bg-muted animate-pulse shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                  <div className="mt-1 h-3 w-48 bg-muted animate-pulse rounded" />
                  <div className="mt-1 h-3 w-20 bg-muted animate-pulse rounded" />
                </div>
              </GlassCard>
            ))}
          </div>
        ) : error ? (
          <GlassCard className="p-10 text-center">
            <p className="text-destructive">Failed to load notifications</p>
          </GlassCard>
        ) : (
          <>
            {filtered.map((n) => {
              const { Icon, color } = iconMap[n.type] || { Icon: Bell, color: "text-muted-foreground bg-muted/10" };
              return (
                <GlassCard 
                  key={n.id} 
                  className={`p-4 flex gap-3 items-start ${!n.read ? "opacity-100" : "opacity-60"}`}
                  onClick={() => handleNotificationClick(n.id, n.read)}
                >
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
            {filtered.length === 0 && (
              <GlassCard className="p-10 text-center">
                <Bell className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="mt-3 font-semibold">All caught up</p>
              </GlassCard>
            )}
          </>
        )}
      </div>
    </div>
  );
}
