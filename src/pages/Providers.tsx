import { useState } from "react";
import { Search, Stethoscope, MapPin, Star, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { GlassCard } from "@/components/GlassCard";
import { useProviders } from "@/hooks/useProviders";

export default function Providers() {
  const [q, setQ] = useState("");
  const { providers, isLoading, error, refetch } = useProviders(q);
  const filtered = providers.filter((p) => {
    if (!q) return true;
    const query = q.toLowerCase();
    return (
      p.profiles?.full_name?.toLowerCase().includes(query) ||
      p.specialty?.toLowerCase().includes(query) ||
      p.institution_name?.toLowerCase().includes(query)
    );
  });

  const handleRefetch = async () => {
    try {
      await refetch();
    } catch (err) {
      console.error("Failed to refetch providers:", err);
    }
  };

  return (
    <div>
      <PageHeader title="Providers" subtitle={`${providers.length} verified`} large>
        <button
          onClick={handleRefetch}
          className="text-xs md:text-sm text-primary font-medium min-h-[44px] flex items-center"
        >
          Refresh
        </button>
      </PageHeader>

      <div className="px-4 md:px-5 space-y-4 mt-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, specialty, or institution..."
            className="w-full glass rounded-xl pl-10 pr-4 py-2.5 md:py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {/* List */}
        <div className="space-y-2">
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <GlassCard key={i} className="p-3 md:p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted animate-pulse shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                    <div className="mt-1 h-3 w-48 bg-muted animate-pulse rounded" />
                  </div>
                  <div className="text-right shrink-0">
                    <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                    <div className="mt-1 h-3 w-12 bg-muted animate-pulse rounded" />
                  </div>
                </GlassCard>
              ))}
            </div>
          ) : error ? (
            <GlassCard className="p-8 text-center">
              <p className="text-destructive">Failed to load providers</p>
            </GlassCard>
          ) : filtered.length === 0 ? (
            <GlassCard className="p-8 text-center">
              <p className="text-muted-foreground">No providers found</p>
            </GlassCard>
          ) : (
            filtered.map((p) => (
              <GlassCard key={p.id} className="p-3 md:p-4 flex items-center gap-3 active:scale-[0.98] transition-transform">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-primary">
                    {p.profiles?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'DR'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm md:text-base truncate">{p.profiles?.full_name || 'Unknown Provider'}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Stethoscope className="h-3 w-3 shrink-0" />
                    {p.specialty}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <MapPin className="h-3 w-3 shrink-0" />
                    {p.institution_name}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  {p.verified && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
                      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Verified
                    </span>
                  )}
                </div>
              </GlassCard>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
