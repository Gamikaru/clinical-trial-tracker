/**
 * src/hooks/useVisualizationData.ts
 *
 * Aggregates data for charts from your local endpoints.
 */

import { useEffect, useMemo, useState } from "react";
import { ConditionData, StatusData, TrendData } from "../types";
import useStudyStats from "./useStudyStats";
import useTrials from "./useTrials";

const useVisualizationData = () => {
    // get trials from local /api/filtered-studies
    const { trials, loading, error } = useTrials({ pageSize: 200 });
    // get size stats from local /api/stats/size
    const { stats, loading: statsLoading, error: statsError } = useStudyStats();

    const [statusData, setStatusData] = useState<StatusData | undefined>();
    const [conditionData, setConditionData] = useState<ConditionData | undefined>();
    const [trendData, setTrendData] = useState<TrendData | undefined>();

    // process the trials array into chart-friendly data
    const processed = useMemo(() => {
        if (!trials.length) {
            return { statusData: undefined, conditionData: undefined, trendData: undefined };
        }

        // 1) Build Status chart data
        const statusCounts: Record<string, number> = {};
        trials.forEach((t) => {
            const s = t.overallStatus || "UNKNOWN";
            statusCounts[s] = (statusCounts[s] || 0) + 1;
        });
        const sData: StatusData = {
            labels: Object.keys(statusCounts),
            datasets: [
                {
                    label: "# of Trials",
                    data: Object.values(statusCounts),
                    backgroundColor: ["#6A9EFD", "#434B56", "#C4C4C4", "#4A6E9D", "#98DEDE"],
                },
            ],
        };

        // 2) Build Condition chart data
        const condCounts: Record<string, number> = {};
        trials.forEach((t) => {
            const c = t.condition || "N/A";
            condCounts[c] = (condCounts[c] || 0) + 1;
        });
        const sorted = Object.entries(condCounts).sort((a, b) => b[1] - a[1]);
        const top10 = sorted.slice(0, 10);
        const cData: ConditionData = {
            labels: top10.map((x) => x[0]),
            datasets: [
                {
                    label: "# of Trials",
                    data: top10.map((x) => x[1]),
                    backgroundColor: ["#6A9EFD", "#434B56", "#C4C4C4", "#4A6E9D", "#98DEDE"],
                },
            ],
        };

        // 3) Build a simple Trend chart data
        // For demonstration, we randomize monthly data
        const dateCounts: Record<string, number> = {};
        trials.forEach(() => {
            const randomMonth = Math.floor(Math.random() * 12) + 1;
            const key = `2023-${String(randomMonth).padStart(2, "0")}`;
            dateCounts[key] = (dateCounts[key] || 0) + 1;
        });
        const sortedMonths = Object.keys(dateCounts).sort();
        const tData: TrendData = {
            labels: sortedMonths,
            datasets: [
                {
                    label: "Monthly Updates",
                    data: sortedMonths.map((m) => dateCounts[m]),
                    borderColor: "#4A6E9D",
                    tension: 0.1,
                },
            ],
        };

        return { statusData: sData, conditionData: cData, trendData: tData };
    }, [trials]);

    useEffect(() => {
        setStatusData(processed.statusData);
        setConditionData(processed.conditionData);
        setTrendData(processed.trendData);
    }, [processed]);

    const isLoading = loading || statsLoading;
    const isError = error || statsError;

    return {
        statusData,
        conditionData,
        trendData,
        isLoading,
        isError,
        stats, // from useStudyStats
    };
};

export default useVisualizationData;
