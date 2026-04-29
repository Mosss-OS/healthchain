import { useState, useEffect } from "react";
import { Copy, ArrowDownLeft, ArrowUpRight, QrCode, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { GlassCard } from "@/components/GlassCard";
import { usePrivy } from "@privy-io/react-auth";
import { useUSDCBalance } from "@/hooks/useUSDCPayment";

const transactions = [
  { id: "t1", type: "in" as const, desc: "Access fee from Metro Health", amount: 2, date: "Apr 20" },
  { id: "t2", type: "out" as const, desc: "Record anchor · gas", amount: 0.12, date: "Apr 20", asset: "ETH" },
  { id: "t3", type: "in" as const, desc: "Access fee from Dr. Chen", amount: 5, date: "Apr 12" },
  { id: "t4", type: "out" as const, desc: "Record anchor · gas", amount: 0.09, date: "Apr 12", asset: "ETH" },
];

export default function Wallet() {
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address || '';
  
  const { balance, isError, refetch } = useUSDCBalance(walletAddress as `0x${string}`);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const formatUSDC = (val?: bigint) => {
    if (!val) return "0.00";
    return (Number(val) / 1e6).toFixed(2);
  };

  const shortAddress = walletAddress ? `${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}` : '';

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const formatBalance = formatUSDC(balance);

  return (
    <div>
      <PageHeader title="Wallet" large />

      <div className="px-4 md:px-5 space-y-4 mt-3">
        <GlassCard className="p-5 md:p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary" />
          <div className="relative text-primary-foreground">
            <div className="flex items-center justify-between">
              <p className="text-sm opacity-80">Base Sepolia · Embedded wallet</p>
              <button 
                onClick={handleRefresh}
                className="h-9 w-9 rounded-full bg-white/15 flex items-center justify-center backdrop-blur disabled:opacity-50"
                disabled={isRefreshing}
              >
                {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <QrCode className="h-4 w-4" />}
              </button>
            </div>
            {isError ? (
              <div className="mt-4">
                <p className="text-2xl font-bold">--</p>
                <p className="text-sm opacity-80">Unable to load balance</p>
              </div>
            ) : (
              <>
                <p className="text-[42px] font-bold tracking-tighter mt-4">${formatBalance}</p>
                <p className="text-sm opacity-80">{formatBalance} USDC</p>
              </>
            )}
            {walletAddress && (
              <button
                onClick={() => { navigator.clipboard.writeText(walletAddress); toast.success("Address copied"); }}
                className="mt-4 inline-flex items-center gap-2 bg-white/15 backdrop-blur rounded-full px-3 py-1.5 text-xs font-medium"
              >
                {shortAddress} <Copy className="h-3 w-3" />
              </button>
            )}
          </div>
        </GlassCard>

        <div className="grid grid-cols-3 gap-3">
          <ActionBtn label="Send"><ArrowUpRight className="h-5 w-5" /></ActionBtn>
          <ActionBtn label="Receive"><ArrowDownLeft className="h-5 w-5" /></ActionBtn>
          <ActionBtn label="Top-up"><span className="text-lg font-bold">+</span></ActionBtn>
        </div>

        <GlassCard className="divide-y divide-border">
          <BalanceRow 
            symbol="USDC" 
            name="USD Coin" 
            amount={formatBalance} 
            fiat={`$${formatBalance}`} 
            color="bg-primary/15 text-primary" 
          />
          <BalanceRow 
            symbol="ETH" 
            name="Ethereum (Gas)" 
            amount="--" 
            fiat="--" 
            color="bg-muted text-foreground" 
          />
        </GlassCard>

        <div>
          <h2 className="text-[15px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">History</h2>
          <GlassCard className="divide-y divide-border">
            {transactions.map((t) => (
              <div key={t.id} className="flex items-center gap-3 p-4">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                  t.type === "in" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
                }`}>
                  {t.type === "in" ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-sm md:text-base">{t.desc}</p>
                  <p className="text-xs text-muted-foreground">{t.date}</p>
                </div>
                <span className={`font-semibold text-sm shrink-0 ${t.type === "in" ? "text-success" : ""}`}>
                  {t.type === "in" ? "+" : "−"}{t.amount} {t.asset || "USDC"}
                </span>
              </div>
            ))}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

function ActionBtn({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <button className="glass rounded-2xl p-4 flex flex-col items-center gap-1.5 active:scale-95 transition-transform">
      <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
        {children}
      </div>
      <span className="text-xs font-semibold">{label}</span>
    </button>
  );
}

function BalanceRow({ symbol, name, amount, fiat, color }: { symbol: string; name: string; amount: string; fiat: string; color: string }) {
  return (
    <div className="flex items-center gap-3 p-4">
      <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${color}`}>{symbol}</div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm md:text-base">{name}</p>
        <p className="text-xs text-muted-foreground">{amount} {symbol}</p>
      </div>
      <p className="font-semibold text-sm shrink-0">{fiat}</p>
    </div>
  );
}