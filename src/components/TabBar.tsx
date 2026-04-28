import { NavLink, useLocation } from "react-router-dom";
import { Home, FileText, Plus, Users, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const tabs = [
  { icon: Home, label: "Home", path: "/dashboard" },
  { icon: FileText, label: "Records", path: "/records" },
  { icon: Plus, label: "Add", path: "/records/new", primary: true },
  { icon: Users, label: "Providers", path: "/providers" },
  { icon: Wallet, label: "Wallet", path: "/wallet" },
];

export function TabBar() {
  const location = useLocation();
  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-50 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="mx-auto max-w-2xl px-4 pb-4 pt-2">
        <div className="glass-strong rounded-full shadow-float flex items-center justify-around px-2 py-2">
          {tabs.map((tab) => {
            const active = location.pathname === tab.path ||
              (tab.path !== "/dashboard" && location.pathname.startsWith(tab.path) && !tab.primary);
            const Icon = tab.icon;
            if (tab.primary) {
              return (
                <NavLink key={tab.path} to={tab.path} className="relative -mt-6">
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className="h-14 w-14 rounded-full bg-primary shadow-glow flex items-center justify-center text-primary-foreground"
                  >
                    <Icon className="h-6 w-6" strokeWidth={2.5} />
                  </motion.div>
                </NavLink>
              );
            }
            return (
              <NavLink key={tab.path} to={tab.path} className="flex-1">
                <motion.div
                  whileTap={{ scale: 0.92 }}
                  className={cn(
                    "flex flex-col items-center gap-0.5 py-2 rounded-full transition-colors",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
                  <span className="text-[10px] font-medium">{tab.label}</span>
                </motion.div>
              </NavLink>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
