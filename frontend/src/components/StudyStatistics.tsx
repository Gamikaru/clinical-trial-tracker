/**
 * src/components/StudyStatistics.tsx
 *
 * Displays study statistics (count, average size, largest studies).
 * Includes a slight fade-up effect on load.
 */

import { motion } from "framer-motion";
import React from "react";
import { LargestStudy } from "../types";
import SummaryCard from "./shared/SummaryCard";

interface StudyStatisticsProps {
  /** Total number of studies */
  totalCount?: number;
  /** Average size of studies in bytes */
  averageSizeBytes?: number;
  /** List of the largest studies */
  largestStudies?: LargestStudy[];
}

const StudyStatistics: React.FC<StudyStatisticsProps> = ({
  totalCount = 0,
  averageSizeBytes = 0,
  largestStudies = [],
}) => {
  return (
    <motion.div
      className="card p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-2xl font-semibold mb-4">Study Statistics</h2>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mb-4">
        <SummaryCard title="Total Studies" value={totalCount} />
        <SummaryCard
          title="Average Size"
          value={`${averageSizeBytes.toLocaleString()} Bytes`}
        />
      </div>
      <h3 className="text-xl font-semibold mb-2">Largest Studies</h3>
      <ul className="list-disc list-inside">
        {largestStudies.slice(0, 5).map((study) => (
          <li key={study.id}>
            <strong>{study.id}:</strong> {study.sizeBytes.toLocaleString()}{" "}
            Bytes
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default StudyStatistics;
