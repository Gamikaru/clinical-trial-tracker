import { ChartData, ChartOptions } from "chart.js";
import React from "react";
import { Pie } from "react-chartjs-2";

interface TopConditionsChartProps {
  /** Data for the pie chart */
  data?: ChartData<"pie", number[], string>;
  /** Configuration options for the pie chart */
  options?: ChartOptions<"pie">;
}

/**
 * Renders a pie chart displaying the top 10 conditions by number of trials.
 *
 * @param {TopConditionsChartProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered pie chart.
 */
const TopConditionsChart: React.FC<TopConditionsChartProps> = ({
  data,
  options,
}) => {
  return (
    <div className="card bg-base-100 shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Top 10 Conditions</h2>
      {data ? (
        <div className="relative" style={{ height: "400px" }}>
          <Pie data={data} options={options} />
        </div>
      ) : (
        <p>No condition data available.</p>
      )}
    </div>
  );
};

TopConditionsChart.defaultProps = {
  data: undefined,
  options: undefined,
};

export default TopConditionsChart;
