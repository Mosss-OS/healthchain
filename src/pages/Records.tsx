import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Search, Filter, ShieldCheck, Link2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { GlassCard } from "@/components/GlassCard";
import { RecordIcon } from "@/components/RecordIcon";
import { useGetRecord, useGetPatientRecords, useHasAccess } from "@/hooks/useContract";
import { usePrivy } from "@privy-io/react-auth";
import { toast } from "sonner";

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
  const [records, setRecords] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address || '';
  
  const { data: patientRecords, isError: recordsError, refetch: refetchPatientRecords } = useGetPatientRecords(
    walletAddress as `0x${string}`
  );
  
  const { refetch: refetchRecord } = useGetRecord();
  
  useEffect(() => {
    if (walletAddress) {
      setLoading(true);
      refetchPatientRecords()
        .then(() => {
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          setError("Failed to load records");
          console.error("Failed to load patient records:", err);
        });
    }
  }, [walletAddress, refetchPatientRecords]);
  
  useEffect(() => {
    if (patientRecords && patientRecords.length > 0) {
      // Fetch details for each record
      const fetchRecordDetails = async () => {
        const detailedRecords = [];
        for (const recordId of patientRecords) {
          try {
            // We need to use useGetRecord for each record - this is simplified
            // In a real app, you might want to batch these requests
            const recordData: any = await new Promise((resolve) => {
              // This is a simplified approach - in reality you'd use useQuery or similar
              const interval = setInterval(() => {
                // This is just a placeholder - real implementation would use proper state management
                if (Math.random() > 0.5) { // Simulate success
                  clearInterval(interval);
                  resolve([
                    recordId,
                    walletAddress,
                    "QmTest...",
                    "consultation",
                    BigInt(Date.now()),
                    true
                  ]);
                }
              }, 100);
            });
            
            detailedRecords.push({
              id: recordData[0].toString(),
              patient_wallet: recordData[1],
              ipfs_hash: recordData[2],
              record_type: recordData[3],
              timestamp: recordData[4].toString(),
              is_active: recordData[5],
              title: `${recordData[3]} Record`,
              provider: "Dr. Example",
              institution: "HealthChain Clinic",
              date: new Date(Number(recordData[4])).toISOString().split('T')[0]
            });
          } catch (err) {
            console.error(`Failed to fetch record ${recordId}:`, err);
          }
        }
        setRecords(detailedRecords);
      };
      
      fetchRecordDetails();
    }
  }, [patientRecords]);
  
  // Mock data fallback for development
  if (!walletAddress || !patientRecords) {
    // Use mock data when no wallet or no records
    const mockRecords = [
      {
        id: "1",
        title: "Annual Physical Exam",
        provider: "Dr. Smith",
        institution: "HealthChain Clinic",
        date: "2024-01-15",
        type: "consultation",
        ipfs_hash: "QmTest123",
        is_active: true
      },
      {
        id: "2",
        title: "Blood Work Results",
        provider: "Dr. Jones",
        institution: "HealthChain Lab",
        date: "2024-01-10",
        type: "lab_result",
        ipfs_hash: "QmTest456",
        is_active: true
      }
    ];
    
    // Apply filters and search to mock data
    const filteredMock = mockRecords.filter((r) => {
      if (filter !== "all" && r.type !== filter) return false;
      if (q && !`${r.title} ${r.provider} ${r.institution}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
    
    setRecords(filteredMock);
    setLoading(false);
    return (
      <div>
        <PageHeader title="Records" subtitle={`${records.length} on-chain records`} large />
        
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
            {records.map((r) => (
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
                        {r.type === "consultation" ? "Consultation" : 
                         r.type === "lab_result" ? "Lab Result" :
                         r.type === "prescription" ? "Prescription" :
                         r.type === "imaging" ? "Imaging" :
                         r.type === "vaccination" ? "Vaccination" :
                         r.type === "vitals" ? "Vitals" :
                         "Discharge Summary"}
                      </span>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            ))}
            {records.length === 0 && (
              <GlassCard className="p-8 md:p-10 text-center">
                <Filter className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="mt-3 font-semibold">No records found</p>
                <p className="text-sm text-muted-foreground">Add your first medical record to get started.</p>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // Real data view
  return (
    <div>
      <PageHeader title="Records" subtitle={`${records.length} on-chain records`} large />
      
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      
      {loading && (
        <div className="p-8 text-center">
          <p className="text-sm text-muted-foreground">Loading your records from the blockchain...</p>
        </div>
      )}
      
      {!loading && !error && (
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
            {records.map((r) => (
              <Link key={r.id} to={`/records/${r.id}`}>
                <GlassCard interactive className="p-3 md:p-4 flex gap-3 items-center min-h-[60px]">
                  <RecordIcon type={r.record_type} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold truncate text-sm md:text-base">{r.title}</p>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {new Date(Number(r.timestamp)).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {r.patient_wallet === walletAddress ? "You" : r.patient_wallet.slice(0, 6) + "..." + r.patient_wallet.slice(-4)} · {r.institution || "Unknown"}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 md:mt-2">
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-success bg-success/10 rounded-full px-2 py-0.5">
                        <ShieldCheck className="h-3 w-3" /> Encrypted
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-primary bg-primary/10 rounded-full px-2 py-0.5">
                        <Link2 className="h-3 w-3" /> On-chain
                      </span>
                      <span className="text-[10px] text-muted-foreground ml-auto">
                        {r.record_type === "consultation" ? "Consultation" : 
                         r.record_type === "lab_result" ? "Lab Result" :
                         r.record_type === "prescription" ? "Prescription" :
                         r.record_type === "imaging" ? "Imaging" :
                         r.record_type === "vaccination" ? "Vaccination" :
                         r.record_type === "vitals" ? "Vitals" :
                         "Discharge Summary"}
                      </span>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            ))}
            {records.length === 0 && (
              <GlassCard className="p-8 md:p-10 text-center">
                <Filter className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="mt-3 font-semibold">No records found</p>
                <p className="text-sm text-muted-foreground">You haven't created any medical records yet.</p>
                <div className="mt-4">
                  <Link to="/records/new" className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
                    Add First Record
                  </Link>
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
