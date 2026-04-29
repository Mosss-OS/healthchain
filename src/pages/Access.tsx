import { useState } from "react";
import { Clock, ShieldCheck, X, DollarSign, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { GlassCard } from "@/components/GlassCard";
import { usePrivy } from "@privy-io/react-auth";
import { useUSDCPayment, useUSDCBalance } from "@/hooks/useUSDCPayment";
import { useGrantAccess, useRevokeAccess } from "@/hooks/useContract";

interface PendingRequest {
  id: string;
  providerName: string;
  providerSpecialty: string;
  recordTitle: string;
  fee?: string;
  walletAddress: string;
}

export default function Access() {
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address || '';
  
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([
    { id: "p1", providerName: "Dr. Sarah Chen", providerSpecialty: "Cardiology", recordTitle: "Annual Physical", fee: "5", walletAddress: "0x1234567890abcdef1234567890abcdef12345678" },
  ]);
  
  const [activeGrants, setActiveGrants] = useState([
    { id: "g1", providerName: "Dr. Michael Roberts", providerSpecialty: "Dermatology", recordTitle: "Skin Check", expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() },
    { id: "g2", providerName: "Metro Health Center", providerSpecialty: "Lab", recordTitle: "Blood Work", expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString() },
  ]);

  const { payWithUSDC, isPending: isProcessingPayment, isSuccess: paymentSuccess } = useUSDCPayment();
  const { grantAccess, isPending: isGranting } = useGrantAccess();
  const { revokeAccess, isPending: isRevoking } = useRevokeAccess();
  const { balance } = useUSDCBalance(walletAddress as `0x${string}`);

  const formatUSDC = (val?: bigint) => {
    if (!val) return "0.00";
    return (Number(val) / 1e6).toFixed(2);
  };

  const handleApprove = async (request: PendingRequest, withPayment: boolean) => {
    if (withPayment && request.fee) {
      try {
        await payWithUSDC(request.walletAddress as `0x${string}`, request.fee);
        toast.success(`Paid ${request.fee} USDC and granted access!`);
      } catch (err) {
        toast.error("Payment failed. Please ensure you have enough USDC.");
        return;
      }
    }
    
    try {
      await grantAccess(
        BigInt(1),
        request.walletAddress as `0x${string}`,
        BigInt(Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60)
      );
      
      setActiveGrants(prev => [...prev, {
        id: request.id,
        providerName: request.providerName,
        providerSpecialty: request.providerSpecialty,
        recordTitle: request.recordTitle,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      }]);
      setPendingRequests(prev => prev.filter(r => r.id !== request.id));
      toast.success("Access granted on-chain");
    } catch (err) {
      toast.error("Failed to grant access");
    }
  };

  const handleDecline = (requestId: string) => {
    setPendingRequests(prev => prev.filter(r => r.id !== requestId));
    toast.success("Request declined");
  };

  const handleRevoke = async (grantId: string) => {
    try {
      await revokeAccess(BigInt(1), "0x1234567890abcdef1234567890abcdef12345678" as `0x${string}`);
      setActiveGrants(prev => prev.filter(g => g.id !== grantId));
      toast.success("Access revoked on-chain");
    } catch (err) {
      toast.error("Failed to revoke access");
    }
  };

  return (
    <div>
      <PageHeader title="Access control" subtitle="Who can see your records" large />
      
      <div className="px-4 md:px-5 space-y-3 md:space-y-4 mt-3">
        <GlassCard className="p-4 md:p-5 bg-gradient-primary text-primary-foreground">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-8 w-8 shrink-0" />
            <div>
              <p className="font-semibold text-base md:text-lg">You control every grant</p>
              <p className="text-primary-foreground/85 text-sm mt-1">
                All access is enforced on-chain. Revoke at any time with one transaction.
              </p>
            </div>
          </div>
        </GlassCard>

        {balance !== undefined && (
          <GlassCard className="p-3 md:p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-success" />
              <span className="text-sm text-muted-foreground">USDC Balance</span>
            </div>
            <span className="font-semibold">{formatUSDC(balance)} USDC</span>
          </GlassCard>
        )}

        <Section title="Pending requests">
          {pendingRequests.length === 0 ? (
            <GlassCard className="p-4 text-center">
              <p className="text-sm text-muted-foreground">No pending requests</p>
            </GlassCard>
          ) : (
            pendingRequests.map((g) => (
              <GlassCard key={g.id} className="p-3 md:p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate text-sm md:text-base">{g.providerName}</p>
                    <p className="text-xs text-muted-foreground truncate">{g.providerSpecialty} · {g.recordTitle}</p>
                    {g.fee && (
                      <p className="text-xs text-success mt-1 flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        Fee offered: {g.fee} USDC
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button
                    onClick={() => handleDecline(g.id)}
                    disabled={isProcessingPayment || isGranting}
                    className="glass rounded-xl py-2.5 min-h-[44px] text-sm font-semibold disabled:opacity-50"
                  >Decline</button>
                  <button
                    onClick={() => handleApprove(g, !!g.fee)}
                    disabled={isProcessingPayment || isGranting}
                    className="bg-foreground text-background rounded-xl py-2.5 min-h-[44px] text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-1"
                  >
                    {g.fee ? (
                      <>
                        <CheckCircle className="h-3 w-3" />
                        Accept + Pay
                      </>
                    ) : (
                      "Approve"
                    )}
                  </button>
                </div>
              </GlassCard>
            ))
          )}
        </Section>

        <Section title="Active grants">
          {activeGrants.length === 0 ? (
            <GlassCard className="p-4 text-center">
              <p className="text-sm text-muted-foreground">No active grants</p>
            </GlassCard>
          ) : (
            activeGrants.map((g) => (
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
                    onClick={() => handleRevoke(g.id)}
                    disabled={isRevoking}
                    className="h-10 w-10 md:h-9 md:w-9 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shrink-0 min-h-[40px] md:min-h-[36px] disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 pt-3 border-t border-border text-xs flex justify-between">
                  <span className="text-muted-foreground">Record</span>
                  <span className="font-medium truncate ml-2">{g.recordTitle}</span>
                </div>
              </GlassCard>
            ))
          )}
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