import React from "react";
import { motion } from "framer-motion";

export default function PageWrapper({ children }) {
  return (
    <motion.div
      className="h-full w-full"
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.98 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
