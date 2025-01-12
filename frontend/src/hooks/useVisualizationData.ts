/**
 * src/hooks/useVisualizationData.ts
 *
 * Example hook that fetches data from your new Python endpoints for charts:
 * - e.g., GET /api/filtered-studies
 * - Then transforms it for chart.js usage.
 */

import { useEffect, useMemo, useState } from "react";
import { ConditionData, StatusData, TrendData } from "../types";
import useStudyStats from "./useStudyStats";
import useTrials from "./useTrials";

/**
 * This is an example hook that calls the local "useTrials" plus "useStudyStats"
 * and shapes the data for your charts (status, conditions, trends, etc.).
 */
const useVisualizationData = () => {
  const [searchParams] = useState({
    pageSize: 200,
  });

  // Example usage of your custom hooks
  const { trials, loading, error } = useTrials(searchParams);
  const { stats, loading: statsLoading, error: statsError } = useStudyStats();

  const [statusData, setStatusData] = useState<StatusData | undefined>();
  const [conditionData, setConditionData] = useState<ConditionData | undefined>();
  const [trendData, setTrendData] = useState<TrendData | undefined>();

  const processTrialsData = useMemo(() => {
    if (trials.length === 0) {
      return { statusData: undefined, conditionData: undefined, trendData: undefined };
    }

    // Example: Aggregating by status
    const statusCounts: Record<string, number> = {};
    trials.forEach((t) => {
      const status = t.overallStatus || "UNKNOWN";
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    const statusData: StatusData = {
      labels: Object.keys(statusCounts),
      datasets: [
        {
          label: "# of Trials",
          data: Object.values(statusCounts),
          backgroundColor: ["#6A9EFD", "#434B56", "#C4C4C4"],
        },
      ],
    };

    // Example: Top conditions
    const conditionCounts: Record<string, number> = {};
    trials.forEach((t) => {
      const c = t.condition || "N/A";
      conditionCounts[c] = (conditionCounts[c] || 0) + 1;
    });
    const sortedConds = Object.entries(conditionCounts).sort((a, b) => b[1] - a[1]);
    const top10 = sortedConds.slice(0, 10);
    const conditionData: ConditionData = {
      labels: top10.map((x) => x[0]),
      datasets: [
        {
          label: "# of Trials",
          data: top10.map((x) => x[1]),
          backgroundColor: ["#6A9EFD", "#434B56", "#C4C4C4", "#4A6E9D", "#98DEDE"],
          hoverOffset: 4,
        },
      ],
    };

    // Example: Simple monthly "trend" data (placeholder)
    // In reality, you might do a date-based iteration
    const dateCounts: Record<string, number> = {};
    trials.forEach((t) => {
      // placeholder: we won't do actual date parsing, but you'd likely parse lastUpdatePostDate or startDate
      const randomMonth = Math.floor(Math.random() * 12) + 1; // random approach for demonstration
      const key = `2023-${String(randomMonth).padStart(2, "0")}`;
      dateCounts[key] = (dateCounts[key] || 0) + 1;
    });
    const sortedMonths = Object.keys(dateCounts).sort();
    const trendData: TrendData = {
      labels: sortedMonths,
      datasets: [
        {
          label: "Updates",
          data: sortedMonths.map((m) => dateCounts[m]),
          fill: false,
          borderColor: "#4A6E9D",
          tension: 0.1,
        },
      ],
    };

    return { statusData, conditionData, trendData };
  }, [trials]);

  useEffect(() => {
    setStatusData(processTrialsData.statusData);
    setConditionData(processTrialsData.conditionData);
    setTrendData(processTrialsData.trendData);
  }, [processTrialsData]);

  const isLoading = loading || statsLoading;
  const isError = error || statsError;

  return {
    statusData,
    conditionData,
    trendData,
    isLoading,
    isError,
    stats,
  };
};

export default useVisualizationData;
