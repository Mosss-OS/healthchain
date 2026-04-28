import { usePrivy } from "@privy-io/react-auth";
import { Navigate, useLocation } from "react-router-dom";
import { privyConfigured } from "@/lib/privy";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { ready, authenticated } = usePrivy();
  const location = useLocation();

  // If Privy isn't configured yet (dev), don't block the app.
  if (!privyConfigured) return <>{children}</>;

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass rounded-full h-10 w-10 animate-pulse-glow" />
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
