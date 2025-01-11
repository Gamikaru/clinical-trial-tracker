import { useEffect, useMemo, useState } from "react";
import { ConditionData, StatusData, TrendData } from "../types";
import useStudyStats from "./useStudyStats";
import useTrialMetadata from "./useTrialMetaData";
import useTrials from "./useTrials";

/**
 * Custom hook to manage visualization data for the dashboard.
 */
const useVisualizationData = () => {
    const [searchParams] = useState({
        format: "json",
        pageSize: 1000, // Increased from 100 to 1000
        fields:
            "NCTId,BriefTitle,OverallStatus,HasResults,protocolSection.conditionsModule,protocolSection.statusModule.lastUpdatePostDateStruct.date",
        sort: "@relevance",
    });

    const { trials, loading, error } = useTrials(searchParams);
    const { metadata, loading: metaLoading, error: metaError } = useTrialMetadata();
    const { stats, loading: statsLoading, error: statsError } = useStudyStats();

    const [statusData, setStatusData] = useState<StatusData | undefined>();
    const [conditionData, setConditionData] = useState<ConditionData | undefined>();
    const [trendData, setTrendData] = useState<TrendData | undefined>();

    const processTrialsData = useMemo(() => {
        if (trials.length === 0) {
            return { statusData: undefined, conditionData: undefined, trendData: undefined };
        }

        console.log("Processing trials data for visualization...");

        /**
         * 1) Trials by Status
         */
        const statusCounts = trials.reduce<Record<string, number>>((acc, trial) => {
            const status = trial.overallStatus || "UNKNOWN";
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});
        console.log("Status Counts:", statusCounts);

        const statusData: StatusData = {
            labels: Object.keys(statusCounts),
            datasets: [
                {
                    label: "# of Trials",
                    data: Object.values(statusCounts),
                    backgroundColor: ["#6A9EFD", "#434B56", "#C4C4C4", "#4A6E9D", "#98DEDE"],
                    borderColor: ["#6A9EFD", "#434B56", "#C4C4C4", "#4A6E9D", "#98DEDE"],
                    borderWidth: 1,
                },
            ],
        };

        /**
         * 2) Top 10 Conditions
         */
        const conditionCounts = trials.reduce<Record<string, number>>((acc, trial) => {
            const cond = trial.condition?.trim() || "No Condition Info";
            acc[cond] = (acc[cond] || 0) + 1;
            return acc;
        }, {});
        console.log("Condition Counts:", conditionCounts);

        // Filter out "No Condition Info" from the chart
        const filteredConds = Object.entries(conditionCounts).filter(
            ([cond]) => cond !== "No Condition Info"
        );
        console.log("Filtered Conditions (excluding 'No Condition Info'):", filteredConds);

        let conditionData: ConditionData | undefined;
        if (filteredConds.length === 0) {
            conditionData = undefined;
            console.log("No valid conditions to display.");
        } else {
            const top10 = filteredConds.sort((a, b) => b[1] - a[1]).slice(0, 10);
            console.log("Top 10 Conditions:", top10);

            // Calculate total trials for accurate percentages
            const totalTrials = Object.values(statusCounts).reduce((a, b) => a + b, 0);

            conditionData = {
                labels: top10.map(([cond]) => cond),
                datasets: [
                    {
                        label: "# of Trials",
                        data: top10.map(([, count]) => count),
                        backgroundColor: [
                            "#6A9EFD",
                            "#434B56",
                            "#C4C4C4",
                            "#4A6E9D",
                            "#98DEDE",
                            "#6A9EFD",
                            "#434B56",
                            "#C4C4C4",
                            "#4A6E9D",
                            "#98DEDE",
                        ],
                        hoverOffset: 4,
                    },
                ],
            };
        }

        /**
         * 3) Monthly lastUpdatePostDate Trend
         */
        const dateCounts = trials.reduce<Record<string, number>>((acc, trial) => {
            const rawDate = trial.lastUpdatePostDate;
            if (!rawDate) return acc;
            const month = rawDate.slice(0, 7);
            acc[month] = (acc[month] || 0) + 1;
            return acc;
        }, {});
        console.log("Date Counts for Trend:", dateCounts);

        const sortedMonths = Object.keys(dateCounts).sort();
        const sortedVals = sortedMonths.map((m) => dateCounts[m]);
        console.log("Sorted Months:", sortedMonths);
        console.log("Sorted Values:", sortedVals);

        let trendData: TrendData | undefined;
        if (sortedMonths.length > 0) {
            trendData = {
                labels: sortedMonths,
                datasets: [
                    {
                        label: "# of Trials Updated",
                        data: sortedVals,
                        fill: false,
                        borderColor: "#4A6E9D",
                        tension: 0.1,
                    },
                ],
            };
        } else {
            trendData = undefined;
            console.log("No date data available for trend.");
        }

        return { statusData, conditionData, trendData };
    }, [trials]);

    useEffect(() => {
        const { statusData, conditionData, trendData } = processTrialsData;
        setStatusData(statusData);
        setConditionData(conditionData);
        setTrendData(trendData);
    }, [processTrialsData]);

    // Combine loading and error states
    const isLoading = loading || metaLoading || statsLoading;
    const isError = error || metaError || statsError;

    // Debugging logs for loading and error states
    useEffect(() => {
        if (isLoading) {
            console.log("Visualization data is loading...");
        }
        if (isError) {
            console.error("Error in visualization data:", isError);
        }
    }, [isLoading, isError]);

    return { statusData, conditionData, trendData, isLoading, isError, stats };
};

export default useVisualizationData;