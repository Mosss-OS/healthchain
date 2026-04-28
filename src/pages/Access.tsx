import { Clock, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { GlassCard } from "@/components/GlassCard";
import { mockGrants } from "@/lib/mockData";

export default function Access() {
  return (
    <div>
      <PageHeader title="Access control" subtitle="Who can see your records" large />
      
      <div className="px-4 md:px-5 space-y-3 md:space-y-4 mt-3">
        <GlassCard className="p-4 md:p-5 bg-gradient-primary text-primary-foreground">
          <ShieldCheck className="h-8 w-8" />
          <p className="mt-3 font-semibold text-base md:text-lg">You control every grant</p>
          <p className="text-primary-foreground/85 text-sm mt-1">
            All access is enforced on-chain. Revoke at any time with one transaction.
          </p>
        </GlassCard>

        <Section title="Active grants">
          {mockGrants.filter((g) => g.status === "active").map((g) => (
            <GlassCard key={g.id} className="p-3 md:p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate text-sm md:text-base">{g.providerName}</p>
                  <p className="text-xs text-muted-foreground truncate">{g.providerSpecialty}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <Clock className="h-3 w-3 shrink-0" />
                    Expires {new Date(g.expiresAt).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={() => toast.success("Access revoked on-chain")}
                  className="h-10 w-10 md:h-9 md:w-9 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shrink-0 min-h-[40px] md:min-h-[36px]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 pt-3 border-t border-border text-xs flex justify-between">
                <span className="text-muted-foreground">Record</span>
                <span className="font-medium truncate ml-2">{g.recordTitle}</span>
              </div>
            </GlassCard>
          ))}
        </Section>

        <Section title="Pending requests">
          {mockGrants.filter((g) => g.status === "pending").map((g) => (
            <GlassCard key={g.id} className="p-3 md:p-4">
              <p className="font-semibold text-sm md:text-base">{g.providerName}</p>
              <p className="text-xs text-muted-foreground">{g.providerSpecialty} · requests {g.recordTitle}</p>
              {g.fee ? <p className="text-xs text-primary mt-1">Fee offered: {g.fee} USDC</p> : null}
              <div className="grid grid-cols-2 gap-2 mt-3">
                <button
                  onClick={() => toast.error("Request declined")}
                  className="glass rounded-xl py-2.5 min-h-[44px] text-sm font-semibold"
                >Decline</button>
                <button
                  onClick={() => toast.success("Access granted on-chain")}
                  className="bg-foreground text-background rounded-xl py-2.5 min-h-[44px] text-sm font-semibold"
                >Approve</button>
              </div>
            </GlassCard>
          ))}
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-sm md:text-[15px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">{title}</h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
