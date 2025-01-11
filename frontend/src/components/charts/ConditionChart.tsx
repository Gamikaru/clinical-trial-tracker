import { ChartOptions } from "chart.js";
import "chart.js/auto";
import React from "react";
import { Pie } from "react-chartjs-2";
import { ConditionData } from "../../types";

interface ConditionChartProps {
  data: ConditionData;
  options: ChartOptions<"pie">;
}

const ConditionChart: React.FC<ConditionChartProps> = ({ data, options }) => {
  return <Pie data={data} options={options} redraw datasetIdKey="conditionPie" />;
};

export default React.memo(ConditionChart);