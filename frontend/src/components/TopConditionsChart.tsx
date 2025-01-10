import { ChartData, ChartOptions } from "chart.js";
import React from "react";
import { Pie } from "react-chartjs-2";

interface TopConditionsChartProps {
  data: ChartData<"pie", number[], string>;
  options: ChartOptions<"pie">;
}

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

export default TopConditionsChart;
