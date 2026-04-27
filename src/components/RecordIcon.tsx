import {
  Stethoscope, FlaskConical, Pill, ScanLine, Scissors,
  Syringe, AlertTriangle, Activity, FileText,
} from "lucide-react";
import { RecordType } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const map = {
  consultation: { Icon: Stethoscope, bg: "bg-primary/15", fg: "text-primary" },
  lab_result: { Icon: FlaskConical, bg: "bg-teal/15", fg: "text-teal" },
  prescription: { Icon: Pill, bg: "bg-accent/15", fg: "text-accent" },
  imaging: { Icon: ScanLine, bg: "bg-pink/15", fg: "text-pink" },
  surgery: { Icon: Scissors, bg: "bg-warning/15", fg: "text-warning" },
  vaccination: { Icon: Syringe, bg: "bg-success/15", fg: "text-success" },
  allergy: { Icon: AlertTriangle, bg: "bg-destructive/15", fg: "text-destructive" },
  vitals: { Icon: Activity, bg: "bg-primary/15", fg: "text-primary" },
  discharge_summary: { Icon: FileText, bg: "bg-muted", fg: "text-muted-foreground" },
} as const;

export function RecordIcon({ type, size = "md" }: { type: RecordType; size?: "sm" | "md" | "lg" }) {
  const { Icon, bg, fg } = map[type];
  const dims = size === "sm" ? "h-9 w-9" : size === "lg" ? "h-14 w-14" : "h-11 w-11";
  const iDims = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-7 w-7" : "h-5 w-5";
  return (
    <div className={cn("rounded-2xl flex items-center justify-center", bg, dims)}>
      <Icon className={cn(iDims, fg)} strokeWidth={2.2} />
    </div>
  );
}
