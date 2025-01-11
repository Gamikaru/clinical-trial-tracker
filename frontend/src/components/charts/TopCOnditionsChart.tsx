import { ChartData, ChartOptions } from "chart.js";
import "chart.js/auto";
import { motion } from "framer-motion";
import React from "react";
import { Pie } from "react-chartjs-2";

interface TopConditionsChartProps {
  data?: ChartData<"pie", number[], string>;
  options?: ChartOptions<"pie">;
}

const TopConditionsChart: React.FC<TopConditionsChartProps> = ({
  data = undefined,
  options = undefined,
}) => {
  return (
    <motion.div
      className="card p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-2xl font-semibold mb-4">Top 10 Conditions</h2>
      {data ? (
        <div className="relative" style={{ height: "400px" }}>
          <Pie
            data={data}
            options={options}
            redraw
            datasetIdKey="topConditionsPie"
          />
        </div>
      ) : (
        <p>No condition data available.</p>
      )}
    </motion.div>
  );
};

export default TopConditionsChart;
