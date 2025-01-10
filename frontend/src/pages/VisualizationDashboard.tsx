import {
    ArcElement,
    BarElement,
    CategoryScale,
    ChartData,
    Chart as ChartJS,
    ChartOptions,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from "chart.js";
import React, { useEffect, useMemo, useState } from "react";
import useStudyStats from "../hooks/useStudyStats";
import useTrialMetadata from "../hooks/useTrialMetaData";
import useTrials from "../hooks/useTrials";

// Importing optimized components
import StudyMetadataTable from "../components/StudyMetadataTable";
import StudyStatistics from "../components/StudyStatistics";
import SummaryCards from "../components/SummaryCards";
import TopConditionsChart from "../components/TopCOnditionsChart";
import TrialsByStatusChart from "../components/TrialsByStatusChart";

// Register Chart.js components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  Title
);

// Define interfaces for chart data
interface StatusData extends ChartData<"bar", number[], string> {}
interface ConditionData extends ChartData<"pie", number[], string> {}

/**
 * The main dashboard component that visualizes trial data.
 * It displays:
 *   - Summary cards (total studies, avg size, etc.)
 *   - Bar chart of trials by status
 *   - Pie chart of top 10 conditions
 *   - Study metadata table
 *   - Additional stats about studies (largest, average size, etc.)
 */
const VisualizationDashboard: React.FC = () => {
  // Define search parameters
  const [searchParams] = useState({
    format: "json",
    // NOTE: pageSize is overridden in useTrials if not specified
    // but we keep it here for clarity
    pageSize: 100,
    fields:
      "NCTId,BriefTitle,OverallStatus,HasResults,protocolSection.conditionsModule",
  });

  // Fetch data using custom hooks
  const { trials, loading, error } = useTrials(searchParams);
  const {
    metadata,
    loading: metaLoading,
    error: metaError,
  } = useTrialMetadata();
  const { stats, loading: statsLoading, error: statsError } = useStudyStats();

  // State for chart data
  const [statusData, setStatusData] = useState<StatusData | undefined>(
    undefined
  );
  const [conditionData, setConditionData] = useState<ConditionData | undefined>(
    undefined
  );

  /**
   * Processes trial data to generate datasets for the charts.
   */
  useEffect(() => {
    console.debug("Processing trial data for charts:", trials);

    if (trials.length > 0) {
      // 1) Calculate counts for trial statuses
      const statusCounts: Record<string, number> = trials.reduce(
        (acc, trial) => {
          const status = trial.overallStatus || "UNKNOWN";
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      console.debug("Status counts:", statusCounts);

      // Set data for Bar Chart (Trials by Status)
      setStatusData({
        labels: Object.keys(statusCounts),
        datasets: [
          {
            label: "# of Trials",
            data: Object.values(statusCounts),
            backgroundColor: [
              "rgba(54, 162, 235, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(255, 99, 132, 0.6)",
              "rgba(153, 102, 255, 0.6)",
              "rgba(255, 159, 64, 0.6)",
              "rgba(199, 199, 199, 0.6)",
            ],
            borderColor: [
              "rgba(54, 162, 235, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(255, 99, 132, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
              "rgba(199, 199, 199, 1)",
            ],
            borderWidth: 1,
          },
        ],
      });

      // 2) Calculate counts for conditions
      //    Convert blank or missing conditions to "No Condition Info"
      const conditionCounts: Record<string, number> = trials.reduce(
        (acc, trial) => {
          const condition = trial.condition?.trim() || "No Condition Info";
          acc[condition] = (acc[condition] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      console.debug("Raw condition counts:", conditionCounts);

      // Optionally filter out "No Condition Info" if you don't want them in the chart
      const filteredConditions = Object.entries(conditionCounts).filter(
        ([cond]) => cond !== "No Condition Info"
      );

      if (filteredConditions.length === 0) {
        console.warn("No valid conditions found. Pie chart will be empty.");
        setConditionData(undefined);
      } else {
        // Sort and pick top 10
        const top10 = filteredConditions
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10);

        console.debug("Top 10 condition entries:", top10);

        setConditionData({
          labels: top10.map(([cond]) => cond),
          datasets: [
            {
              label: "# of Trials",
              data: top10.map(([, count]) => count),
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
                "#C9CBCF",
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
              ],
              hoverOffset: 4,
            },
          ],
        });
      }
    } else {
      // Reset chart data if no trials
      console.info("No trials found. Clearing chart data.");
      setStatusData(undefined);
      setConditionData(undefined);
    }
  }, [trials]);

  // Combine loading states
  const isLoading = loading || metaLoading || statsLoading;
  // Combine error states
  const isError = error || metaError || statsError;

  /**
   * Memoized chart options for the bar chart (Trials by Status).
   */
  const barOptions: ChartOptions<"bar"> = useMemo(
    () => ({
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: {
          display: true,
          text: "Number of Trials by Status",
          font: { size: 18 },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Number of Trials",
          },
        },
        x: {
          title: {
            display: true,
            text: "Trial Status",
          },
        },
      },
      interaction: {
        mode: "index",
        intersect: false,
      },
      onClick: (_, elements) => {
        if (elements.length > 0 && statusData?.labels) {
          const index = elements[0].index;
          const label = statusData.labels[index] || "UNKNOWN";
          // For example, you could refetch or filter data by this status
          console.log(`Clicked on status: ${label}`);
        }
      },
    }),
    [statusData]
  );

  /**
   * Memoized chart options for the pie chart (Top 10 Conditions).
   */
  const pieOptions: ChartOptions<"pie"> = useMemo(
    () => ({
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: { position: "right" },
        title: {
          display: true,
          text: "Top 10 Conditions by Number of Trials",
          font: { size: 18 },
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const { label, parsed } = context;
              const totalTrials = trials.length;
              const percentage = ((parsed / totalTrials) * 100).toFixed(2);
              return `${label}: ${parsed} Trials (${percentage}%)`;
            },
          },
        },
      },
    }),
    [trials.length]
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Dashboard Title */}
      <h1 className="text-4xl font-bold mb-8 text-center text-primary">
        Visualization Dashboard
      </h1>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex justify-center items-center my-10">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {/* Error Message */}
      {isError && (
        <div className="my-10">
          <p className="text-red-500 text-center text-lg">
            {error || metaError || statsError}
          </p>
        </div>
      )}

      {/* Main Content */}
      {!isLoading && !isError && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Summary Cards */}
          <SummaryCards
            totalStudies={stats?.totalCount || 0}
            averageSizeBytes={stats?.averageSizeBytes || 0}
          />

          {/* Bar Chart: Trials by Status */}
          {statusData ? (
            <TrialsByStatusChart data={statusData} options={barOptions} />
          ) : (
            <div className="card bg-base-100 shadow-md p-4 flex items-center justify-center">
              <p>No status data available.</p>
            </div>
          )}

          {/* Pie Chart: Top 10 Conditions */}
          {conditionData ? (
            <TopConditionsChart data={conditionData} options={pieOptions} />
          ) : (
            <div className="card bg-base-100 shadow-md p-4 flex items-center justify-center">
              <p>No condition data available.</p>
            </div>
          )}

          {/* Study Metadata Table */}
          <StudyMetadataTable metadata={metadata || []} />

          {/* Study Statistics */}
          <StudyStatistics
            totalCount={stats?.totalCount || 0}
            averageSizeBytes={stats?.averageSizeBytes || 0}
            largestStudies={stats?.largestStudies || []}
          />
        </div>
      )}
    </div>
  );
};

export default VisualizationDashboard;
