import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User, Stethoscope } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { GlassCard } from "@/components/GlassCard";
import { mockProviders } from "@/lib/mockData";
import { mockUser } from "@/lib/mockData";

export default function AddRecord() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const [recordType, setRecordType] = useState<string>("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [provider, setProvider] = useState("");

  const recordTypes = [
    { value: "consultation", label: "Consultation", icon: Stethoscope },
    { value: "lab_result", label: "Lab Result", icon: null },
    { value: "prescription", label: "Prescription", icon: null },
    { value: "imaging", label: "Imaging", icon: null },
    { value: "surgery", label: "Surgery", icon: null },
    { value: "vaccination", label: "Vaccination", icon: null },
    { value: "vitals", label: "Vitals", icon: null },
    { value: "discharge_summary", label: "Discharge Summary", icon: null },
  ];

  const handleUploadComplete = (result: { cid: string; url: string; key: string }) => {
    console.log('Upload complete:', result);
    // In real app: save cid, url, key to form state
  };

  const handleSubmit = () => {
    if (!recordType || !title || !date) {
      toast.error("Please fill in all required fields");
      return;
    }
    // In real app: upload to IPFS, then create record on blockchain
    toast.success("Record added successfully!");
    navigate("/records");
  };

  return (
    <div>
      <PageHeader
        title="Add New Record"
        subtitle="Step {step} of {totalSteps}"
        backTo="/records"
      />

      <div className="px-4 md:px-5 mt-4 md:mt-5 max-w-2xl mx-auto">
        {/* Progress */}
        <div className="flex gap-1.5 mb-6 md:mb-8">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i < step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Select Type */}
        {step === 1 && (
          <div className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold">Select Record Type</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
              {recordTypes.map((rt) => (
                <button
                  key={rt.value}
                  onClick={() => {
                    setRecordType(rt.value);
                    setStep(2);
                  }}
                  className={`p-3 md:p-4 rounded-xl border-2 transition-all min-h-[60px] md:min-h-[80px] ${
                    recordType === rt.value
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <p className="text-sm md:text-base font-semibold">{rt.label}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg md:text-xl font-bold">Record Details</h2>
            <GlassCard className="p-4 md:p-5 space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Annual Physical Exam"
                  className="mt-1 w-full glass rounded-xl px-4 py-2.5 md:py-3 text-sm md:text-base outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Date of Record</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 w-full glass rounded-xl px-4 py-2.5 md:py-3 text-sm md:text-base outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Provider</label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="mt-1 w-full glass rounded-xl px-4 py-2.5 md:py-3 text-sm md:text-base outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="">Select provider...</option>
                  {mockProviders.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} - {p.specialty}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Upload File (Optional)</label>
                <FileUpload onUploadComplete={handleUploadComplete} accept=".pdf,.jpg,.png,.dcm" />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add notes about this record..."
                  rows={4}
                  className="mt-1 w-full glass rounded-xl px-4 py-2.5 md:py-3 text-sm md:text-base outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                />
              </div>
            </GlassCard>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 glass rounded-xl py-2.5 md:py-3 text-sm md:text-base font-medium"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!title || !date}
                className="flex-1 bg-foreground text-background rounded-xl py-2.5 md:py-3 text-sm md:text-base font-medium disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Submit */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg md:text-xl font-bold">Review & Submit</h2>
            <GlassCard className="p-4 md:p-5 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Record Type</p>
                <p className="font-semibold text-sm md:text-base">{recordTypes.find((rt) => rt.value === recordType)?.label}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Title</p>
                <p className="font-semibold text-sm md:text-base">{title}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="font-semibold text-sm md:text-base">{new Date(date).toLocaleDateString()}</p>
              </div>
              {provider && (
                <div>
                  <p className="text-xs text-muted-foreground">Provider</p>
                  <p className="font-semibold text-sm md:text-base">{provider}</p>
                </div>
              )}
              {description && (
                <div>
                  <p className="text-xs text-muted-foreground">Description</p>
                  <p className="text-sm md:text-base">{description}</p>
                </div>
              )}
            </GlassCard>
            <div className="text-xs md:text-sm text-muted-foreground text-center">
              This record will be encrypted and stored on IPFS, then anchored on Base blockchain.
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 glass rounded-xl py-2.5 md:py-3 text-sm md:text-base font-medium"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-primary text-primary-foreground rounded-xl py-2.5 md:py-3 text-sm md:text-base font-semibold"
              >
                Add to HealthChain
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
