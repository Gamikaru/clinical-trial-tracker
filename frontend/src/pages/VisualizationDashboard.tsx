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
import TopConditionsChart from "../components/TopConditionsChart";
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
 *
 * @returns {JSX.Element} The rendered visualization dashboard.
 */
const VisualizationDashboard: React.FC = () => {
  // Define search parameters
  const [searchParams] = useState({
    format: "json",
    pageSize: 50,
    fields:
      "NCTId,BriefTitle,OverallStatus,HasResults,protocolSection.identificationModule.nctId,protocolSection.identificationModule.briefTitle,protocolSection.statusModule.overallStatus",
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
    if (trials.length > 0) {
      // Calculate counts for trial statuses
      const statusCounts: Record<string, number> = trials.reduce(
        (acc, trial) => {
          const status = trial.overallStatus || "Unknown";
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

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
              "rgba(199, 199, 199, 0.6)", // Extra color for potential additional statuses
            ],
            borderColor: [
              "rgba(54, 162, 235, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(255, 99, 132, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
              "rgba(199, 199, 199, 1)", // Matching border color
            ],
            borderWidth: 1,
          },
        ],
      });

      // Calculate counts for conditions
      const conditionCounts: Record<string, number> = trials.reduce(
        (acc, trial) => {
          const condition = trial.condition || "Unknown";
          acc[condition] = (acc[condition] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      // Get top 10 conditions
      const top10 = Object.entries(conditionCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

      // Set data for Pie Chart (Top 10 Conditions)
      setConditionData({
        labels: top10.map((x) => x[0]),
        datasets: [
          {
            label: "# of Trials",
            data: top10.map((x) => x[1]),
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
    } else {
      // Reset chart data if no trials
      setStatusData(undefined);
      setConditionData(undefined);
    }
  }, [trials]);

  // Combine loading states
  const isLoading = loading || metaLoading || statsLoading;
  // Combine error states
  const isError = error || metaError || statsError;

  /**
   * Memoizes chart options for the bar chart to optimize performance.
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
        mode: "index" as const,
        intersect: false,
      },
      onClick: (_, elements) => {
        if (elements.length > 0 && statusData?.labels) {
          const index = elements[0].index;
          const label = statusData.labels[index] || "Unknown";
          // Implement filtering or additional actions based on label
          console.log(`Clicked on status: ${label}`);
        }
      },
    }),
    [statusData]
  );

  /**
   * Memoizes chart options for the pie chart to optimize performance.
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
            label: (context) =>
              `${context.label}: ${context.parsed} Trials (${(
                (context.parsed / trials.length) *
                100
              ).toFixed(2)}%)`,
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
          <TrialsByStatusChart data={statusData} options={barOptions} />

          {/* Pie Chart: Top 10 Conditions */}
          <TopConditionsChart data={conditionData} options={pieOptions} />

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
