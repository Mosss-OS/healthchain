import { Copy, ArrowDownLeft, ArrowUpRight, QrCode } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { GlassCard } from "@/components/GlassCard";
import { mockUser, usdcBalance, baseBalance } from "@/lib/mockData";

const transactions = [
  { id: "t1", type: "in", desc: "Access fee from Metro Health", amount: 2, date: "Apr 20" },
  { id: "t2", type: "out", desc: "Record anchor · gas", amount: 0.12, date: "Apr 20", asset: "ETH" },
  { id: "t3", type: "in", desc: "Access fee from Dr. Chen", amount: 5, date: "Apr 12" },
  { id: "t4", type: "out", desc: "Record anchor · gas", amount: 0.09, date: "Apr 12", asset: "ETH" },
];

export default function Wallet() {
  const short = `${mockUser.wallet.slice(0, 6)}…${mockUser.wallet.slice(-4)}`;
  return (
    <div>
      <PageHeader title="Wallet" large />

      <div className="px-5 space-y-4 mt-3">
        {/* Wallet card */}
        <GlassCard className="p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary" />
          <div className="relative text-primary-foreground">
            <div className="flex items-center justify-between">
              <p className="text-sm opacity-80">Base Sepolia · Embedded wallet</p>
              <button className="h-9 w-9 rounded-full bg-white/15 flex items-center justify-center backdrop-blur">
                <QrCode className="h-4 w-4" />
              </button>
            </div>
            <p className="text-[42px] font-bold tracking-tighter mt-4">${usdcBalance.toFixed(2)}</p>
            <p className="text-sm opacity-80">{usdcBalance.toFixed(2)} USDC</p>
            <button
              onClick={() => { navigator.clipboard.writeText(mockUser.wallet); toast.success("Address copied"); }}
              className="mt-4 inline-flex items-center gap-2 bg-white/15 backdrop-blur rounded-full px-3 py-1.5 text-xs font-medium"
            >
              {short} <Copy className="h-3 w-3" />
            </button>
          </div>
        </GlassCard>

        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-3">
          <ActionBtn label="Send"><ArrowUpRight className="h-5 w-5" /></ActionBtn>
          <ActionBtn label="Receive"><ArrowDownLeft className="h-5 w-5" /></ActionBtn>
          <ActionBtn label="Top-up"><span className="text-lg font-bold">+</span></ActionBtn>
        </div>

        {/* Balances */}
        <GlassCard className="divide-y divide-border">
          <BalanceRow symbol="USDC" name="USD Coin" amount={usdcBalance.toFixed(2)} fiat={`$${usdcBalance.toFixed(2)}`} color="bg-primary/15 text-primary" />
          <BalanceRow symbol="ETH" name="Ethereum" amount={baseBalance.toFixed(4)} fiat="$0.00" color="bg-muted text-foreground" />
        </GlassCard>

        {/* History */}
        <div>
          <h2 className="text-[15px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">History</h2>
          <GlassCard className="divide-y divide-border">
            {transactions.map((t) => (
              <div key={t.id} className="flex items-center gap-3 p-4">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  t.type === "in" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
                }`}>
                  {t.type === "in" ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{t.desc}</p>
                  <p className="text-xs text-muted-foreground">{t.date}</p>
                </div>
                <span className={`font-semibold text-sm ${t.type === "in" ? "text-success" : ""}`}>
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
      <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs ${color}`}>{symbol}</div>
      <div className="flex-1">
        <p className="font-semibold">{name}</p>
        <p className="text-xs text-muted-foreground">{amount} {symbol}</p>
      </div>
      <p className="font-semibold">{fiat}</p>
    </div>
  );
}
