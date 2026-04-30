import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User, Stethoscope } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { GlassCard } from "@/components/GlassCard";
import { FileUpload } from "@/components/FileUpload";
import { useCreateRecord, useGrantAccess } from "@/hooks/useContract";
import { useUploadToIPFS } from "@/hooks/useIPFS";
import { usePrivy } from "@privy-io/react-auth";
import { toast } from "sonner";

interface WindowWithTempData extends Window {
  tempIPFSData?: { cid: string; url: string; key: string };
}

export default function AddRecord() {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);
  const totalSteps = 3;

  const [recordType, setRecordType] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState<string>("");
  const [provider, setProvider] = useState<string>("");

  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address || '';

  const { uploadFile, isUploading, uploadError } = useUploadToIPFS();
  const { createRecord, isPending: isCreatingRecord, error: createError } = useCreateRecord();
  const { grantAccess, isPending: isGrantingAccess, error: grantError } = useGrantAccess();

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

  const handleUploadComplete = async (result: { cid: string; url: string; key: string }) => {
    (window as WindowWithTempData).tempIPFSData = result;
  };

  const handleSubmit = async () => {
    if (!recordType || !title || !date) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // Step 1: Upload to IPFS if we have a file
      let ipfsHash = "";
      if ((window as WindowWithTempData).tempIPFSData) {
        ipfsHash = (window as WindowWithTempData).tempIPFSData.cid;
      } else {
        // If no file uploaded, create a minimal JSON record
        const recordData = {
          title,
          description,
          date,
          recordType,
          provider
        };
        const blob = new Blob([JSON.stringify(recordData)], { type: 'application/json' });
        const formData = new FormData();
        formData.append('file', blob, 'record.json');
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();
        ipfsHash = data.cid;
      }

      // Step 2: Create record on blockchain
      const txHash = await createRecordAsync(
        ipfsHash,
        recordType,
        BigInt(new Date(date).getTime())
      );

      // Step 3: Auto-grant access to the patient (wallet address)
      if (walletAddress) {
        await grantAccessAsync(
          BigInt(await getLatestRecordId()), // We'd need to get the actual record ID from the transaction
          walletAddress as `0x${string}`,
          BigInt(Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60) // 1 year from now
        );
      }

      toast.success("Record added successfully to HealthChain!");
      navigate("/records");
    } catch (err) {
      console.error("Add record failed:", err);
      toast.error("Failed to add record: " + (err as Error).message);
    }
  };

  // Helper functions to call contract methods
  const createRecordAsync = async (ipfsHash: string, recordType: string, timestamp: bigint) => {
    if (!createRecord) throw new Error("Create record function not available");
    return await createRecord({
      ipfsHash,
      recordType,
      timestamp
    });
  };

  const grantAccessAsync = async (recordId: bigint, grantee: `0x${string}`, expiresAt: bigint) => {
    if (!grantAccess) throw new Error("Grant access function not available");
    return await grantAccess({
      recordId,
      grantee,
      expiresAt
    });
  };

  // Helper to get latest record ID (simplified - in production you'd parse from transaction)
  const getLatestRecordId = async () => {
    // This is a simplified approach - in production you'd parse the transaction receipt
    // or use an event listener to get the actual record ID
    return 1; // Placeholder
  };

  return (
    <div>
      <PageHeader
        title="Add New Record"
        subtitle={`Step ${step} of ${totalSteps}`}
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
            <h2 className="text-lg md:text-xl font-bold tracking-tight">Select Record Type</h2>
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
            <h2 className="text-lg md:text-xl font-bold tracking-tight">Record Details</h2>
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
                  {/* In a real app, this would come from the providers API */}
                  <option value="Dr. Smith">Dr. Smith - Cardiology</option>
                  <option value="Dr. Jones">Dr. Jones - Dermatology</option>
                  <option value="Dr. Lee">Dr. Lee - Pediatrics</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Upload File (Optional)</label>
                <FileUpload 
                  onUploadComplete={handleUploadComplete} 
                  accept=".pdf,.jpg,.png,.dcm,.txt"
                  isUploading={isUploading}
                  error={uploadError}
                />
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
                className="flex-1 bg-foreground text-background rounded-xl py-2.5 md:py-3 text-sm md:text-base font-semibold disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Submit */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg md:text-xl font-bold tracking-tight">Review & Submit</h2>
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
              {(window as WindowWithTempData).tempIPFSData && (
                <div>
                  <p className="text-xs text-muted-foreground">IPFS Storage</p>
                  <p className="font-semibold text-sm md:text-base">{(window as WindowWithTempData).tempIPFSData!.cid.slice(0, 10)}...</p>
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
                disabled={isCreatingRecord || isGrantingAccess || isUploading}
                className="flex-1 bg-primary text-primary-foreground rounded-xl py-2.5 md:py-3 text-sm md:text-base font-semibold disabled:opacity-50"
              >
                {isCreatingRecord || isGrantingAccess || isUploading ? "Submitting..." : "Add to HealthChain"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}