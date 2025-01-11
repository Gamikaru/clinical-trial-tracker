/**
 * src/components/SummaryCard.tsx
 *
 * A reusable card for displaying summary info with a subtle hover effect.
 */

import { motion } from "framer-motion";
import React from "react";

interface SummaryCardProps {
  title: string;
  value: string | number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value }) => {
  return (
    <motion.div
      className="card bg-base-100 p-6 flex flex-col items-center hover:shadow-xl transition-shadow"
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-3xl font-bold">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
    </motion.div>
  );
};

export default SummaryCard;
