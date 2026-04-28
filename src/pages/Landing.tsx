import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Zap,
  Lock,
  Activity,
  ArrowRight,
  CheckCircle2,
  Mail,
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { privyConfigured } from "@/lib/privy";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const features = [
  { icon: Shield, title: "Blockchain Secured", desc: "Every record anchored on Base L2 with cryptographic proof." },
  { icon: Lock, title: "End-to-End Encrypted", desc: "Files stored on IPFS, encrypted with your keys only." },
  { icon: Zap, title: "Instant Access Control", desc: "Grant or revoke provider access in a single tap." },
  { icon: Activity, title: "Live Health Insights", desc: "Vitals, labs and trends unified in one timeline." },
];

const stats = [
  { v: "99.8%", l: "Uptime" },
  { v: "<500ms", l: "Latency" },
  { v: "0", l: "Breaches" },
  { v: "10k+", l: "Records" },
];

export default function Landing() {
  const navigate = useNavigate();
  const { handleLogin, isReady } = useAuth();

  useEffect(() => {
    if (isReady && isAuthenticated) navigate("/dashboard", { replace: true });
  }, [isReady, isAuthenticated, navigate]);

  const onLoginClick = () => {
    if (!privyConfigured) {
      toast.message("Privy not configured", {
        description:
          "Add VITE_PRIVY_APP_ID to your environment to enable email login. Continuing as guest.",
      });
      navigate("/dashboard");
      return;
    }
    handleLogin();
  };

  return (
    <div className="min-h-screen bg-background">
       {/* Nav */}
       <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-3 md:px-5 md:pt-4">
         <div className="mx-auto max-w-5xl glass rounded-full px-4 py-2 md:px-5 md:py-2.5 flex items-center justify-between shadow-sm">
           <div className="flex items-center gap-2">
             <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center">
               <Activity className="h-4 w-4 text-primary-foreground" strokeWidth={2.8} />
             </div>
             <span className="font-bold text-base md:text-[17px] tracking-tight">HealthChain</span>
           </div>
           <button
             onClick={handleLogin}
             className="text-sm font-semibold bg-foreground text-background rounded-full px-4 py-2 min-h-[44px] md:py-1.5 hover:opacity-90 transition"
           >
             Sign in
           </button>
         </div>
       </nav>

       {/* Hero */}
       <section className="pt-32 pb-12 px-4 md:pt-36 md:pb-16 md:px-5">
         <div className="mx-auto max-w-5xl text-center">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
             className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 text-xs font-medium text-muted-foreground mb-4 md:mb-6"
           >
             <span className="h-2 w-2 rounded-full bg-success animate-pulse-glow" />
             Live on Base Sepolia
           </motion.div>
           <motion.h1
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.7, delay: 0.1 }}
             className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]"
           >
             Your health records,<br />
             <span className="text-primary">owned by you.</span>
           </motion.h1>
           <motion.p
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.7, delay: 0.2 }}
             className="mt-4 text-base md:text-lg md:mt-6 text-muted-foreground max-w-2xl mx-auto px-2"
           >
             A decentralized medical records platform. Encrypted on IPFS.
             Anchored on Base. Accessible only with your consent.
           </motion.p>
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.7, delay: 0.3 }}
             className="mt-8 md:mt-10 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 px-4"
           >
             <button
               onClick={onLoginClick}
               className="group inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-6 py-3.5 min-h-[44px] w-full sm:w-auto font-semibold hover:opacity-90 transition text-sm md:text-base"
             >
               <Mail className="h-4 w-4" />
               Continue with email
               <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
             </button>
             <a
               href="#features"
               className="glass rounded-full px-6 py-3.5 min-h-[44px] w-full sm:w-auto font-semibold hover:bg-surface-muted transition-colors text-center text-sm md:text-base"
             >
               Learn more
             </a>
           </motion.div>

           {/* Floating preview */}
           <motion.div
             initial={{ opacity: 0, y: 40 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.9, delay: 0.4 }}
             className="mt-10 md:mt-16 relative max-w-md mx-auto px-4 md:px-0"
           >
             <GlassCard className="p-4 md:p-6 text-left">
               <div className="flex items-center justify-between mb-3 md:mb-4">
                 <div>
                   <p className="text-xs text-muted-foreground">Overall Health Score</p>
                   <p className="text-3xl md:text-4xl font-bold mt-1">
                     87<span className="text-base md:text-lg text-muted-foreground">/100</span>
                   </p>
                 </div>
                 <div className="relative h-12 w-12 md:h-16 md:w-16">
                   <div className="absolute inset-0 rounded-full border-4 border-muted" />
                   <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary rotate-45" />
                 </div>
               </div>
               <div className="grid grid-cols-3 gap-2 md:gap-3 pt-3 md:pt-4 border-t border-border">
                 <div><p className="text-[10px] text-muted-foreground">Heart</p><p className="font-semibold text-sm">68 bpm</p></div>
                 <div><p className="text-[10px] text-muted-foreground">BP</p><p className="font-semibold text-sm">118/76</p></div>
                 <div><p className="text-[10px] text-muted-foreground">SpO₂</p><p className="font-semibold text-sm">98%</p></div>
               </div>
             </GlassCard>
           </motion.div>
        </div>
      </section>

       {/* Features */}
       <section id="features" className="px-4 md:px-5 py-16 md:py-20">
         <div className="mx-auto max-w-5xl">
           <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-center mb-8 md:mb-12">
             Built for <span className="text-primary">trust</span>.
           </h2>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
             {features.map((f, i) => (
               <motion.div
                 key={f.title}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.5, delay: i * 0.08 }}
               >
                 <GlassCard className="p-4 md:p-6 h-full">
                   <div className="h-10 w-10 md:h-11 md:w-11 rounded-2xl bg-primary flex items-center justify-center mb-3 md:mb-4">
                     <f.icon className="h-4 w-4 md:h-5 md:w-5 text-primary-foreground" strokeWidth={2.4} />
                   </div>
                   <h3 className="text-lg md:text-xl font-semibold mb-1">{f.title}</h3>
                   <p className="text-sm text-muted-foreground">{f.desc}</p>
                 </GlassCard>
               </motion.div>
             ))}
           </div>
         </div>
       </section>

       {/* Stats */}
       <section className="px-4 md:px-5 py-10 md:py-12">
         <div className="mx-auto max-w-4xl glass rounded-2xl md:rounded-3xl p-6 md:p-8">
           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 text-center">
             {stats.map((s) => (
               <div key={s.l}>
                 <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary">{s.v}</p>
                 <p className="text-xs md:text-sm text-muted-foreground mt-1">{s.l}</p>
               </div>
             ))}
           </div>
         </div>
       </section>

       {/* CTA */}
       <section className="px-4 md:px-5 py-16 md:py-20">
         <div className="mx-auto max-w-4xl relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] bg-primary p-8 md:p-10 md:p-16 text-center shadow-float">
           <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground tracking-tight">
             Take back your<br />medical history.
           </h2>
           <p className="mt-3 md:mt-4 text-primary-foreground/85 text-base md:text-lg max-w-xl mx-auto px-2">
             Join thousands owning their health data on-chain.
           </p>
           <button
             onClick={handleLogin}
             className="inline-flex items-center gap-2 mt-6 md:mt-8 bg-background text-foreground rounded-full px-6 md:px-7 py-3.5 md:py-4 font-semibold hover:scale-[1.02] transition-transform min-h-[44px] text-sm md:text-base"
           >
             Launch HealthChain <ArrowRight className="h-4 w-4" />
           </button>
           <div className="mt-6 md:mt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-3 md:gap-4 text-primary-foreground/80 text-sm">
             {["No credit card", "Email login only", "HIPAA-aware design"].map((t) => (
               <span key={t} className="inline-flex items-center gap-1.5">
                 <CheckCircle2 className="h-4 w-4" />
                 {t}
               </span>
             ))}
           </div>
         </div>
       </section>

      <footer className="px-5 py-10 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-2 mb-3">
          <img 
            src="https://res.cloudinary.com/dv0tt80vn/image/upload/v1747391409/chub_yf9id1_d3d76e.png" 
            alt="HealthChain" 
            className="h-8 w-auto opacity-80" 
          />
        </div>
        © 2026 HealthChain · Base Sepolia · Decentralized health, human first.
      </footer>
    </div>
  );
}
