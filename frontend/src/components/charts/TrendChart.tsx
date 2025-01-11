import { ChartOptions } from "chart.js";
import "chart.js/auto";
import React from "react";
import { Line } from "react-chartjs-2";
import { TrendData } from "../../types";

interface TrendChartProps {
  data: TrendData;
  options: ChartOptions<"line">;
}

const TrendChart: React.FC<TrendChartProps> = ({ data, options }) => {
  return <Line data={data} options={options} redraw datasetIdKey="trendLine" />;
};

export default TrendChart;