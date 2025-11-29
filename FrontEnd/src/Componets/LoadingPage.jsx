import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function LoadingPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#BBBDBC]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        className="text-[#52AB98] "
      >
        <Loader2 size={40} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-2 text-xl font-semibold text-gray-700"
      >
        Loading, please wait...
      </motion.h1>
    </div>
  );
}
