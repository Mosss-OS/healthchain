import { useState } from "react";
import { Search, BadgeCheck, Star } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { GlassCard } from "@/components/GlassCard";
import { mockProviders } from "@/lib/mockData";

const specialties = ["All", "General Practice", "Cardiology", "Neurology", "Pediatrics", "Oncology"];

export default function Providers() {
  const [q, setQ] = useState("");
  const [spec, setSpec] = useState("All");

  const list = mockProviders.filter((p) => {
    if (spec !== "All" && p.specialty !== spec) return false;
    if (q && !`${p.name} ${p.institution}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <PageHeader title="Providers" subtitle="Connect with verified doctors" large />

      <div className="px-5 space-y-3 mt-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search providers..."
            className="w-full glass rounded-full pl-11 pr-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-1 px-1 pb-1">
          {specialties.map((s) => (
            <button
              key={s}
              onClick={() => setSpec(s)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                spec === s ? "bg-foreground text-background" : "glass"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="space-y-2.5 pt-1">
          {list.map((p) => (
            <GlassCard key={p.id} interactive className="p-4 flex gap-3 items-center">
              <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                {p.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold truncate">{p.name}</p>
                  {p.verified && <BadgeCheck className="h-4 w-4 text-primary shrink-0" />}
                </div>
                <p className="text-xs text-muted-foreground truncate">{p.specialty} · {p.institution}</p>
                <div className="flex items-center gap-1 mt-1 text-xs">
                  <Star className="h-3 w-3 fill-warning text-warning" />
                  <span className="font-semibold">{p.rating}</span>
                </div>
              </div>
              <button className="bg-primary text-primary-foreground rounded-full px-4 py-2 text-sm font-semibold">
                Connect
              </button>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
