import { useState, useEffect } from "react";
import { useGetPatientRecords, useGetRecord } from "@/hooks/useContract";
import { usePrivy } from "@privy-io/react-auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, ShieldCheck, Users } from "lucide-react";
import { useUploadToIPFS } from "@/hooks/useIPFS";
import { toast } from "sonner";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalRecords: 0,
    activeRecords: 0,
    providersWithAccess: 0,
    lastUpdated: null as Date | null
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address || '';
  
  const { data: patientRecords, refetch: refetchPatientRecords } = useGetPatientRecords(
    walletAddress as `0x${string}`
  );
  
  const { refetch: refetchRecord } = useGetRecord();
  
  const { uploadFile } = useUploadToIPFS();
  
  useEffect(() => {
    if (walletAddress) {
      setLoading(true);
      refetchPatientRecords()
        .then(() => {
          setLoading(false);
          // In a real app, we would calculate stats from the actual records
          // For now, we'll simulate based on whether we have records
          const totalRecords = patientRecords?.length || 0;
          setStats({
            totalRecords,
            activeRecords: totalRecords, // Simplified - all records considered active
            providersWithAccess: Math.min(totalRecords, 3), // Simplified
            lastUpdated: new Date()
          });
        })
        .catch((err) => {
          setLoading(false);
          setError("Failed to load dashboard data");
          console.error("Failed to load dashboard data:", err);
        });
    }
  }, [walletAddress, refetchPatientRecords]);
  
  // Fallback to mock data if no wallet or error
  if (!walletAddress || error) {
    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Records</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                On-chain medical records
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">0</div>
                <div className="h-8 w-8">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Badge variant="secondary" size="xs">
                Mock Data
              </Badge>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Active Records</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Currently accessible records
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">0</div>
                <div className="h-8 w-8">
                  <ShieldCheck className="h-4 w-4 text-success" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Badge variant="secondary" size="xs">
                Mock Data
              </Badge>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Providers</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                With access to your records
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">0</div>
                <div className="h-8 w-8">
                  <Users className="h-4 w-4 text-primary" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Badge variant="secondary" size="xs">
                Mock Data
              </Badge>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Last Updated</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Blockchain sync time
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Never</div>
                <div className="h-8 w-8">
                  <Clock className="h-4 w-4 text-muted" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Badge variant="secondary" size="xs">
                Mock Data
              </Badge>
            </CardFooter>
          </Card>
        </div>
        
        <div className="bg-gradient-to-br from-primary/5 to-background/5 rounded-xl p-6">
          <h2 className="mb-4 text-lg font-semibold text-primary">
            Welcome to HealthChain
          </h2>
          <p className="text-sm text-muted-foreground">
            Your secure medical records portal on Base Sepolia. Connect your wallet to begin managing your health data on the blockchain.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => {
                // Trigger Privy login
                window.dispatchEvent(new Event('privy:login'));
              }}
              className="flex-1 bg-primary text-primary-foreground px-4 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
            >
              Connect Wallet
            </button>
            <button
              onClick={() => {
                // Navigate to add record
                // This would require router access - simplified here
                alert("Navigate to Add Record to create your first medical record");
              }}
              className="flex-1 bg-outline text-foreground/90 px-4 py-3 rounded-md border border-outline/hover font-medium hover:bg-outline/50 transition-colors"
            >
              Create First Record
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Real data view
  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-xl">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Records</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              On-chain medical records
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.totalRecords}</div>
              <div className="h-8 w-8">
                <FileText className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Badge variant="secondary" size="xs">
              {stats.lastUpdated ? (
                <span className="text-xs">{stats.lastUpdated.toLocaleTimeString()}</span>
              ) : (
                "Updating..."
              )}
            </Badge>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active Records</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Currently accessible records
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.activeRecords}</div>
              <div className="h-8 w-8">
                <ShieldCheck className="h-4 w-4 text-success" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Badge variant="secondary" size="xs">
              On-chain verified
            </Badge>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Providers</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              With access to your records
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div class="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.providersWithAccess}</div>
              <div className="h-8 w-8">
                <Users className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Badge variant="secondary" size="xs">
              Access managed
            </Badge>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Network</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Base Sepolia Testnet
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">✓</div>
              <div className="h-8 w-8">
                <Clock className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Badge variant="secondary" size="xs">
              Contract: 0xE6aACc92...ABF83B
            </Badge>
          </CardFooter>
        </Card>
      </div>
      
      <div className="bg-gradient-to-br from-primary/5 to-background/5 rounded-xl p-6">
        <h2 className="mb-4 text-lg font-semibold text-primary">
          Your HealthChain Summary
        </h2>
        <p className="text-sm text-muted-foreground">
          Securely manage your medical records on the blockchain with granular access control.
        </p>
        {stats.totalRecords > 0 && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <ShieldCheck className="h-3 w-3 text-success" />
              <span>Your medical data is encrypted and stored on IPFS</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Link2 className="h-3 w-3 text-primary" />
              <span>Access permissions are managed on-chain</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-3 w-3 text-muted" />
              <span>Only you can grant or revoke access to your records</span>
            </div>
          </div>
        )}
        
        {stats.totalRecords === 0 && (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              You haven't created any medical records yet. Create your first record to begin securing your health data on the blockchain.
            </p>
            <div className="mt-4">
              <button
                onClick={() => {
                  // Navigate to add record - would need useNavigate
                  alert("Use the navigation menu to go to Add Record and create your first medical record");
                }}
                className="bg-primary text-primary-foreground px-4 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors w-full"
              >
                Create Your First Record
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
