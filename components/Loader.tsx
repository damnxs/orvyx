"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function Loader({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]"
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.6, 0.01, 0.05, 0.95] }}
        >
          <motion.div
            className="eyebrow"
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            Awakening
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
