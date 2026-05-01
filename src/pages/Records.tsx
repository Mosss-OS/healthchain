import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Search, Filter, ShieldCheck, Link2, Plus, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { GlassCard } from "@/components/GlassCard";
import { RecordIcon } from "@/components/RecordIcon";
import { usePrivy } from "@privy-io/react-auth";
import { useRecords } from "@/hooks/useRecords";

const filters: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "consultation", label: "Consult" },
  { value: "lab_result", label: "Labs" },
  { value: "prescription", label: "Rx" },
  { value: "imaging", label: "Imaging" },
  { value: "vaccination", label: "Vaccines" },
  { value: "vitals", label: "Vitals" },
];

export default function Records() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [error, setError] = useState<string | null>(null);
  
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address || '';
  
  const { records, isLoading, refetch } = useRecords();
  
  const filtered = records.filter((r) => {
    if (filter !== 'all' && r.record_type !== filter) return false;
    if (q && !r.title?.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const handleRefetch = async () => {
    setError(null);
    try {
      await refetch();
    } catch (err) {
      setError("Failed to refresh records");
      console.error("Failed to refetch records:", err);
    }
  };

  return (
    <div>
      <PageHeader title="Records" subtitle={`${records.length} total`} large />
      
      <div className="px-4 md:px-5 space-y-4 mt-3">
        {/* Search & Filter */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-1 px-1 pb-1">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`shrink-0 rounded-full px-3 md:px-4 py-1.5 text-xs md:text-sm font-medium transition-all min-h-[36px] md:min-h-[40px] ${
                filter === f.value
                  ? "bg-foreground text-background"
                  : "glass text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
          <button
            onClick={handleRefetch}
            className="ml-auto shrink-0 rounded-full px-3 md:px-4 py-1.5 text-xs md:text-sm font-medium bg-primary text-primary-foreground min-h-[36px] md:min-h-[40px]"
          >
            <RefreshCw className="h-3 w-3" />
          </button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search records..."
            className="w-full glass rounded-xl pl-10 pr-4 py-2.5 md:py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        
        {/* Records List */}
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <GlassCard key={i} className="p-4">
                <div className="h-6 w-6 rounded-lg bg-muted animate-pulse" />
                <div className="mt-2 h-4 w-32 rounded bg-muted animate-pulse" />
              </GlassCard>
            ))}
          </div>
        ) : error ? (
          <GlassCard className="p-8 text-center">
            <p className="text-destructive">{error}</p>
          </GlassCard>
        ) : filtered.length === 0 ? (
          <GlassCard className="p-8 text-center">
            <p className="text-muted-foreground">No records found</p>
            <Link
              to="/records/new"
              className="mt-3 inline-flex items-center gap-1 text-primary text-sm font-medium"
            >
              <Link2 className="h-4 w-4" />
              Add your first record
            </Link>
          </GlassCard>
        ) : (
          <div className="space-y-2">
            {filtered.map((record) => (
              <Link key={record.id} to={`/records/${record.id}`}>
                <GlassCard className="p-3 md:p-4 flex items-center gap-3 active:scale-[0.98] transition-transform">
                  <div className="shrink-0">
                    <RecordIcon type={record.record_type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm md:text-base truncate">{record.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {record.provider} · {record.institution}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {record.date_of_record}
                    </p>
                  </div>
                  {record.is_active ? (
                    <span className="shrink-0">
                      <ShieldCheck className="h-4 w-4 text-success" />
                    </span>
                  ) : null}
                </GlassCard>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
