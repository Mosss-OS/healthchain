import { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface Props {
  title: string;
  subtitle?: string;
  back?: boolean;
  action?: ReactNode;
  large?: boolean;
}

export function PageHeader({ title, subtitle, back, action, large }: Props) {
  const navigate = useNavigate();
  return (
    <div className="px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-2">
      <div className="flex items-center justify-between gap-3 h-11">
        {back ? (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-primary -ml-1"
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="text-[17px]">Back</span>
          </motion.button>
        ) : <span />}
        {!large && <h1 className="text-[17px] font-semibold">{title}</h1>}
        <div className="min-w-[28px] flex justify-end">{action}</div>
      </div>
      {large && (
        <div className="pt-2">
          <h1 className="text-[34px] font-bold tracking-tight leading-tight">{title}</h1>
          {subtitle && <p className="text-muted-foreground text-[15px] mt-1">{subtitle}</p>}
        </div>
      )}
    </div>
  );
}
