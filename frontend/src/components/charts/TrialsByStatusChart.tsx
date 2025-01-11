/**
 * src/components/TrialsByStatusChart.tsx
 *
 * A bar chart to visualize trials grouped by status. Includes fade-in effect.
 */

import { ChartData, ChartOptions } from "chart.js";
import { motion } from "framer-motion";
import React from "react";
import { Bar } from "react-chartjs-2";

interface TrialsByStatusChartProps {
  data?: ChartData<"bar", number[], string>;
  options?: ChartOptions<"bar">;
}

const TrialsByStatusChart: React.FC<TrialsByStatusChartProps> = ({
  data,
  options,
}) => {
  return (
    <motion.div
      className="card p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-2xl font-semibold mb-4">Trials by Status</h2>
      {data?.datasets?.length ? (
        <div className="relative" style={{ height: "400px" }}>
          <Bar data={data} options={options} />
        </div>
      ) : (
        <p>No status data available.</p>
      )}
    </motion.div>
  );
};

export default TrialsByStatusChart;
