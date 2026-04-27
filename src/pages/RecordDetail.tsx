import { useParams, Link } from "react-router-dom";
import { ShieldCheck, Link2, Share2, ExternalLink, Calendar, User, Building2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { GlassCard } from "@/components/GlassCard";
import { RecordIcon } from "@/components/RecordIcon";
import { mockRecords, recordTypeMeta } from "@/lib/mockData";

export default function RecordDetail() {
  const { id } = useParams();
  const record = mockRecords.find((r) => r.id === id);

  if (!record) {
    return (
      <div>
        <PageHeader title="Not found" back />
        <div className="px-5"><GlassCard className="p-8 text-center">Record not found.</GlassCard></div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Record" back />

      <div className="px-5 space-y-4">
        <GlassCard className="p-6">
          <div className="flex items-start gap-4">
            <RecordIcon type={record.type} size="lg" />
            <div className="flex-1 min-w-0">
              <span className="text-xs font-medium text-muted-foreground">
                {recordTypeMeta[record.type].label}
              </span>
              <h1 className="text-2xl font-bold tracking-tight leading-tight mt-0.5">{record.title}</h1>
            </div>
          </div>
          <p className="mt-4 text-[15px] text-foreground/80 leading-relaxed">{record.description}</p>
        </GlassCard>

        <GlassCard className="divide-y divide-border">
          {[
            { Icon: User, label: "Provider", value: record.provider },
            { Icon: Building2, label: "Institution", value: record.institution },
            { Icon: Calendar, label: "Date", value: new Date(record.date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) },
          ].map((row) => (
            <div key={row.label} className="flex items-center gap-3 p-4">
              <row.Icon className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">{row.label}</p>
                <p className="font-medium">{row.value}</p>
              </div>
            </div>
          ))}
        </GlassCard>

        <GlassCard className="p-5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Security</p>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success bg-success/10 rounded-full px-3 py-1.5">
              <ShieldCheck className="h-3.5 w-3.5" /> End-to-end encrypted
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 rounded-full px-3 py-1.5">
              <Link2 className="h-3.5 w-3.5" /> Anchored on Base
            </span>
          </div>
          <div className="mt-4 space-y-2 text-xs font-mono">
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground shrink-0">IPFS</span>
              <span className="truncate">{record.ipfsHash}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground shrink-0">Tx</span>
              <a className="truncate text-primary inline-flex items-center gap-1" href="#">
                {record.txHash} <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-2 gap-3">
          <Link to="/access" className="bg-foreground text-background rounded-2xl py-4 text-center font-semibold inline-flex items-center justify-center gap-2">
            <Share2 className="h-4 w-4" /> Share access
          </Link>
          <button className="glass rounded-2xl py-4 font-semibold">View file</button>
        </div>
      </div>
    </div>
  );
}
