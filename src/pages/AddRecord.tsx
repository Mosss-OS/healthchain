import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Upload, ShieldCheck, Check } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { GlassCard } from "@/components/GlassCard";
import { RecordIcon } from "@/components/RecordIcon";
import { recordTypeMeta, RecordType } from "@/lib/mockData";

const types: RecordType[] = ["consultation", "lab_result", "prescription", "imaging", "vaccination", "vitals"];

export default function AddRecord() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [type, setType] = useState<RecordType | null>(null);
  const [title, setTitle] = useState("");
  const [provider, setProvider] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const next = () => setStep((s) => Math.min(4, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const submit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1800));
    setSubmitting(false);
    toast.success("Record added on-chain", { description: "Your record is now encrypted and anchored on Base." });
    navigate("/records");
  };

  return (
    <div>
      <PageHeader title="Add record" back />

      <div className="px-5">
        {/* Progress */}
        <div className="flex gap-1.5 mb-5">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {step === 1 && (
              <>
                <h2 className="text-2xl font-bold tracking-tight">What type of record?</h2>
                <div className="grid grid-cols-2 gap-3">
                  {types.map((t) => (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      className={`glass rounded-2xl p-4 text-left transition-all ${
                        type === t ? "ring-2 ring-primary shadow-glow" : ""
                      }`}
                    >
                      <RecordIcon type={t} />
                      <p className="font-semibold mt-3">{recordTypeMeta[t].label}</p>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-2xl font-bold tracking-tight">Record details</h2>
                <GlassCard className="p-5 space-y-4">
                  <Field label="Title">
                    <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Annual physical"
                      className="w-full bg-surface-muted rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40" />
                  </Field>
                  <Field label="Provider">
                    <input value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="Dr. Sarah Johnson"
                      className="w-full bg-surface-muted rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40" />
                  </Field>
                  <Field label="Date">
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-surface-muted rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40" />
                  </Field>
                </GlassCard>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="text-2xl font-bold tracking-tight">Upload file</h2>
                <label className="block">
                  <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                  <GlassCard className="p-10 text-center border-2 border-dashed border-primary/30 cursor-pointer">
                    {!file ? (
                      <>
                        <div className="h-14 w-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                          <Upload className="h-6 w-6 text-primary" />
                        </div>
                        <p className="font-semibold mt-4">Tap to upload</p>
                        <p className="text-sm text-muted-foreground">PDF, image or scan</p>
                      </>
                    ) : (
                      <>
                        <div className="h-14 w-14 mx-auto rounded-2xl bg-success/10 flex items-center justify-center">
                          <Check className="h-6 w-6 text-success" />
                        </div>
                        <p className="font-semibold mt-4 truncate">{file.name}</p>
                        <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</p>
                      </>
                    )}
                  </GlassCard>
                </label>
                {file && (
                  <div className="flex items-center gap-2 text-success text-sm">
                    <ShieldCheck className="h-4 w-4" /> File will be encrypted before upload
                  </div>
                )}
              </>
            )}

            {step === 4 && (
              <>
                <h2 className="text-2xl font-bold tracking-tight">Review & anchor</h2>
                <GlassCard className="p-5 space-y-3">
                  <Row label="Type" value={type ? recordTypeMeta[type].label : "—"} />
                  <Row label="Title" value={title || "—"} />
                  <Row label="Provider" value={provider || "—"} />
                  <Row label="Date" value={new Date(date).toLocaleDateString()} />
                  <Row label="File" value={file?.name || "—"} />
                </GlassCard>
                <p className="text-sm text-muted-foreground text-center">
                  This will encrypt your file, pin to IPFS, and anchor the hash on Base Sepolia.
                </p>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <button onClick={back} className="glass rounded-2xl px-6 py-4 font-semibold flex-1">Back</button>
          )}
          {step < 4 ? (
            <button
              onClick={next}
              disabled={(step === 1 && !type) || (step === 2 && (!title || !provider))}
              className="bg-primary text-primary-foreground rounded-2xl px-6 py-4 font-semibold flex-[2] disabled:opacity-40"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={submitting}
              className="bg-primary text-primary-foreground rounded-2xl px-6 py-4 font-semibold flex-[2] disabled:opacity-60"
            >
              {submitting ? "Anchoring on-chain…" : "Confirm & anchor"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
