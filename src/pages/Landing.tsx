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
  FileText,
  Database,
  CreditCard,
  Users,
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

const images = {
  hero: "https://img.freepik.com/free-vector/medical-records-concept-illustration_114360-4262.jpg?w=800",
  blockchain: "https://img.freepik.com/free-vector/blockchain-technology-concept-illustration_114360-11997.jpg?w=600",
  encryption: "https://img.freepik.com/free-vector/security-concept-illustration_114360-13287.jpg?w=600",
  records: "https://img.freepik.com/free-photo/medical-banner-with-doctor-holding-tablet_23-2149641611.jpg?w=600",
};

export default function Landing() {
  const navigate = useNavigate();
  const { handleLogin, isReady, isAuthenticated } = useAuth();

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
    <div className="min-h-screen bg-background max-w-[70%] mx-auto md:max-w-full">
       {/* Nav */}
       <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-3 md:px-5 md:pt-4" style={{ maxWidth: 'inherit', margin: '0 auto', left: 0, right: 0 }}>
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
             <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
             </span>
             Now live on Base Sepolia
           </motion.div>
           <motion.h1
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.1 }}
             className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight"
           >
             Own your <span className="text-primary">medical records</span>
           </motion.h1>
           <motion.p
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.2 }}
             className="mt-4 md:mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto"
           >
             Decentralized, patient-owned health records on Base L2. 
             Encrypted on IPFS, anchored on blockchain. You control who sees your data.
           </motion.p>
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.3 }}
             className="mt-6 md:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
           >
             <button
               onClick={onLoginClick}
               className="w-full sm:w-auto bg-primary text-primary-foreground rounded-full px-6 py-3 md:py-3.5 font-semibold text-sm md:text-base min-h-[52px] md:min-h-[48px] hover:opacity-90 transition flex items-center justify-center gap-2"
             >
               Get Started
               <ArrowRight className="h-4 w-4" />
             </button>
             <Link
               to="/dashboard"
               className="w-full sm:w-auto glass rounded-full px-6 py-3 md:py-3.5 font-semibold text-sm md:text-base min-h-[52px] md:min-h-[48px] flex items-center justify-center"
             >
               View Demo
             </Link>
           </motion.div>
           
           {/* Hero Image */}
           <motion.div
             initial={{ opacity: 0, y: 40 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.4 }}
             className="mt-10 md:mt-14 relative"
           >
             <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-border/50">
               <img 
                 src={images.records} 
                 alt="HealthChain Medical Records Dashboard"
                 className="w-full h-auto object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
             </div>
           </motion.div>
         </div>
       </section>

       {/* Stats */}
       <section className="py-8 md:py-12 px-4 md:px-5 bg-muted/30">
         <div className="mx-auto max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
           {stats.map((stat, i) => (
             <motion.div
               key={stat.l}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.4, delay: i * 0.1 }}
               viewport={{ once: true }}
               className="text-center"
             >
               <p className="text-2xl md:text-3xl font-bold text-primary">{stat.v}</p>
               <p className="text-xs md:text-sm text-muted-foreground mt-1">{stat.l}</p>
             </motion.div>
           ))}
         </div>
       </section>

       {/* Features with Images */}
       <section className="py-12 md:py-20 px-4 md:px-5">
         <div className="mx-auto max-w-5xl">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="text-center mb-10 md:mb-14"
           >
             <h2 className="text-2xl md:text-3xl font-bold">How it works</h2>
             <p className="text-muted-foreground mt-2 md:mt-3">Your health data, your rules</p>
           </motion.div>
           
           <div className="grid md:grid-cols-2 gap-6 md:gap-8">
             {[
               { 
                 title: "Upload & Encrypt", 
                 desc: "Upload medical records that are encrypted locally before being stored on IPFS. Only you hold the keys.",
                 icon: Lock,
                 img: images.encryption
               },
               { 
                 title: "Anchor on Blockchain", 
                 desc: "Your record metadata is anchored on Base L2, creating an immutable audit trail of all access grants.",
                 icon: Database,
                 img: images.blockchain
               },
               { 
                 title: "Control Access", 
                 desc: "Grant temporary or permanent access to healthcare providers. Revoke anytime with one tap.",
                 icon: Users,
                 img: images.records
               },
               { 
                 title: "Pay with USDC", 
                 desc: "Accept payment in USDC for access to your records. Get paid instantly, no intermediaries.",
                 icon: CreditCard,
                 img: images.records
               },
             ].map((item, i) => (
               <motion.div
                 key={item.title}
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.5, delay: i * 0.1 }}
                 viewport={{ once: true }}
               >
                 <GlassCard className="p-4 md:p-6 h-full">
                   <div className="rounded-xl overflow-hidden mb-4">
                     <img 
                       src={item.img} 
                       alt={item.title}
                       className="w-full h-40 object-cover"
                     />
                   </div>
                   <div className="flex items-center gap-3 mb-3">
                     <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                       <item.icon className="h-5 w-5 text-primary" />
                     </div>
                     <h3 className="font-bold text-lg">{item.title}</h3>
                   </div>
                   <p className="text-muted-foreground text-sm">{item.desc}</p>
                 </GlassCard>
               </motion.div>
             ))}
           </div>
         </div>
       </section>

       {/* CTA */}
       <section className="py-12 md:py-16 px-4 md:px-5">
         <GlassCard className="mx-auto max-w-3xl p-8 md:p-12 text-center bg-gradient-to-br from-primary/10 to-primary/5">
           <h2 className="text-2xl md:text-3xl font-bold">Take control of your health data</h2>
           <p className="text-muted-foreground mt-3 md:mt-4">
             Join thousands of patients who own their medical records.
           </p>
           <button
             onClick={onLoginClick}
             className="mt-6 md:mt-8 bg-primary text-primary-foreground rounded-full px-8 py-3 md:py-4 font-semibold text-sm md:text-base min-h-[52px] hover:opacity-90 transition flex items-center justify-center gap-2 mx-auto"
           >
             Start Now
             <ArrowRight className="h-4 w-4" />
           </button>
         </GlassCard>
       </section>

       {/* Footer */}
       <footer className="py-8 px-4 md:px-5 border-t">
         <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
           <div className="flex items-center gap-2">
             <Activity className="h-4 w-4 text-primary" />
             <span className="font-semibold">HealthChain</span>
           </div>
           <p>© 2024 HealthChain. Built on Base L2.</p>
         </div>
       </footer>
    </div>
  );
}