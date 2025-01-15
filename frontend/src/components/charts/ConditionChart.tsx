/**
 * src/components/charts/ConditionChart.tsx
 *
 * Renders a pie chart for conditions using Chart.js
 */

import { ChartOptions } from "chart.js";
import "chart.js/auto";
import React, { useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { ConditionData } from "../../types";

interface ConditionChartProps {
  data: ConditionData;
  options: ChartOptions<"pie">;
}

const ConditionChart: React.FC<ConditionChartProps> = ({ data, options }) => {
  useEffect(() => {
    console.log("[ConditionChart] Rendering with data:", data);
  }, [data]);

  return <Pie data={data} options={options} redraw datasetIdKey="conditionPie" />;
};

export default React.memo(ConditionChart);
