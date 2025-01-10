import { ChartData, ChartOptions } from "chart.js";
import React from "react";
import { Bar } from "react-chartjs-2";

interface TrialsByStatusChartProps {
  /** Data for the bar chart */
  data?: ChartData<"bar", number[], string>;
  /** Configuration options for the bar chart */
  options?: ChartOptions<"bar">;
}

/**
 * Renders a bar chart displaying the number of trials by their status.
 *
 * @param {TrialsByStatusChartProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered bar chart.
 */
const TrialsByStatusChart: React.FC<TrialsByStatusChartProps> = ({
  data,
  options,
}) => {
  return (
    <div className="card bg-base-100 shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Trials by Status</h2>
      {data?.datasets?.length ? (
        <div className="relative" style={{ height: "400px" }}>
          <Bar data={data} options={options} />
        </div>
      ) : (
        <p>No status data available.</p>
      )}
    </div>
  );
};

export default TrialsByStatusChart;
