import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { TabBar } from "./TabBar";

export function AppLayout() {
  const location = useLocation();
  return (
    <div className="min-h-screen pb-28 max-w-[100%] md:max-w-[90%] lg:max-w-[70%] mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
      <TabBar />
    </div>
  );
}
