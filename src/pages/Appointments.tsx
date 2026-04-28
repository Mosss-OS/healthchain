import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Calendar, Clock, Video, MapPin } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { GlassCard } from "@/components/GlassCard";
import { mockAppointments } from "@/lib/mockData";

export default function Appointments() {
  const [filter, setFilter] = useState<"upcoming" | "past">("upcoming");

  const filtered = mockAppointments.filter((a) => {
    const aptDate = new Date(a.scheduled_at);
    const now = new Date();
    if (filter === "upcoming") {
      return aptDate >= now && (a.status === "scheduled" || a.status === "confirmed");
    }
    return aptDate < now || a.status === "completed" || a.status === "cancelled";
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "text-warning bg-warning/10";
      case "confirmed": return "text-success bg-success/10";
      case "completed": return "text-primary bg-primary/10";
      case "cancelled": return "text-destructive bg-destructive/10";
      default: return "text-muted-foreground bg-muted/10";
    }
  };

  return (
    <div>
      <PageHeader title="Appointments" subtitle={`${mockAppointments.length} total`} large />

      <div className="px-4 md:px-5 space-y-4 mt-3 md:space-y-5">
        {/* Filter */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-1 px-1 pb-1">
          {(["upcoming", "past"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 rounded-full px-3 md:px-4 py-1.5 text-xs md:text-sm font-medium transition-all min-h-[36px] md:min-h-[40px] ${
                filter === f
                  ? "bg-foreground text-background"
                  : "glass text-foreground"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
          <Link
            to="/appointments/new"
            className="ml-auto shrink-0 inline-flex items-center gap-1 rounded-full px-3 md:px-4 py-1.5 text-xs md:text-sm font-medium bg-primary text-primary-foreground min-h-[36px] md:min-h-[40px]"
          >
            <Plus className="h-3 w-3" />
            Book
          </Link>
        </div>

        {/* List */}
        <div className="space-y-2">
          {filtered.map((apt) => (
            <GlassCard key={apt.id} className="p-3 md:p-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl ${getStatusColor(apt.status)}`}>
                  {apt.meeting_link ? (
                    <Video className="h-4 w-4" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-sm md:text-base truncate">{apt.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${getStatusColor(apt.status)}`}>
                      {apt.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{apt.provider_name} · {apt.provider_specialty}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1.5">
                    <Clock className="h-3 w-3 shrink-0" />
                    {new Date(apt.scheduled_at).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {apt.meeting_link && <span className="ml-2 text-primary">Video call</span>}
                  </div>
                  {apt.notes && (
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{apt.notes}</p>
                  )}
                </div>
              </div>
            </GlassCard>
          ))}

          {filtered.length === 0 && (
            <GlassCard className="p-8 md:p-10 text-center">
              <Calendar className="h-8 w-8 mx-auto text-muted-foreground" />
              <p className="mt-3 font-semibold">No appointments</p>
              <p className="text-sm text-muted-foreground">
                {filter === "upcoming" ? "No upcoming appointments" : "No past appointments"}
              </p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
