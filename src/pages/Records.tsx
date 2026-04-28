import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, ShieldCheck, Link2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { GlassCard } from "@/components/GlassCard";
import { RecordIcon } from "@/components/RecordIcon";
import { mockRecords, recordTypeMeta, RecordType } from "@/lib/mockData";

const filters: { value: RecordType | "all"; label: string }[] = [
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
  const [filter, setFilter] = useState<RecordType | "all">("all");

  const filtered = mockRecords.filter((r) => {
    if (filter !== "all" && r.type !== filter) return false;
    if (q && !`${r.title} ${r.provider} ${r.institution}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <PageHeader title="Records" subtitle={`${mockRecords.length} on-chain records`} large />

       <div className="px-4 md:px-5 space-y-3 mt-3">
         {/* Search */}
         <div className="relative">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
           <input
             value={q}
             onChange={(e) => setQ(e.target.value)}
             placeholder="Search records, providers..."
             className="w-full glass rounded-full pl-11 pr-4 py-3 md:py-3.5 text-sm md:text-[15px] outline-none focus:ring-2 focus:ring-primary/40 min-h-[44px]"
           />
         </div>

          {/* Filter chips */}
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
         </div>

         {/* List */}
         <div className="space-y-2 pt-1 md:space-y-2.5">
           {filtered.map((r) => (
             <Link key={r.id} to={`/records/${r.id}`}>
               <GlassCard interactive className="p-3 md:p-4 flex gap-3 items-center min-h-[60px]">
                 <RecordIcon type={r.type} />
                 <div className="flex-1 min-w-0">
                   <div className="flex items-center justify-between gap-2">
                     <p className="font-semibold truncate text-sm md:text-base">{r.title}</p>
                     <span className="text-xs text-muted-foreground shrink-0">
                       {new Date(r.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                     </span>
                   </div>
                   <p className="text-xs text-muted-foreground truncate mt-0.5">
                     {r.provider} · {r.institution}
                   </p>
                   <div className="flex items-center gap-2 mt-1.5 md:mt-2">
                     <span className="inline-flex items-center gap-1 text-[10px] font-medium text-success bg-success/10 rounded-full px-2 py-0.5">
                       <ShieldCheck className="h-3 w-3" /> Encrypted
                     </span>
                     <span className="inline-flex items-center gap-1 text-[10px] font-medium text-primary bg-primary/10 rounded-full px-2 py-0.5">
                       <Link2 className="h-3 w-3" /> On-chain
                     </span>
                     <span className="text-[10px] text-muted-foreground ml-auto">
                       {recordTypeMeta[r.type].label}
                     </span>
                   </div>
                 </div>
               </GlassCard>
             </Link>
           ))}
           {filtered.length === 0 && (
             <GlassCard className="p-8 md:p-10 text-center">
               <Filter className="h-8 w-8 mx-auto text-muted-foreground" />
               <p className="mt-3 font-semibold">No records match</p>
               <p className="text-sm text-muted-foreground">Try a different search or filter.</p>
             </GlassCard>
           )}
        </div>
      </div>
    </div>
  );
}
