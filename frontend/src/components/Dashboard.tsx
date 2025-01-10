import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart,
    Legend,
    LinearScale,
    Tooltip,
} from "chart.js";
import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import useStudyStats from "../hooks/useStudyStats";
import useTrialMetadata from "../hooks/useTrialMetaData";
import useTrials, { Trial } from "../hooks/useTrials";

/**
 * Register Chart.js components
 */
Chart.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
);2

/**
 * Dashboard component displays charts and statistics about clinical trials.
 */
const Dashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useState<any>({
    pageSize: 100, // Increased page size for comprehensive data
    // Add other search parameters as needed
  });

  // Fetch trials based on search parameters
  const { trials, loading, error, refetch } = useTrials(searchParams);

  // Fetch metadata and stats
  const {
    metadata,
    loading: metaLoading,
    error: metaError,
  } = useTrialMetadata();
  const { stats, loading: statsLoading, error: statsError } = useStudyStats();

  // State for chart data
  const [statusData, setStatusData] = useState<any>(null);
  const [conditionData, setConditionData] = useState<any>(null);

  useEffect(() => {
    if (trials.length > 0) {
      // Aggregate data for status distribution
      const statusCounts: { [key: string]: number } = {};
      trials.forEach((trial: Trial) => {
        const status = trial.overallStatus;
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });

      const statusLabels = Object.keys(statusCounts);
      const statusValues = Object.values(statusCounts);

      setStatusData({
        labels: statusLabels,
        datasets: [
          {
            label: "# of Trials",
            data: statusValues,
            backgroundColor: [
              "rgba(54, 162, 235, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(255, 99, 132, 0.6)",
              "rgba(153, 102, 255, 0.6)",
              "rgba(255, 159, 64, 0.6)",
            ],
            borderColor: [
              "rgba(54, 162, 235, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(255, 99, 132, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
            ],
            borderWidth: 1,
          },
        ],
      });

      // Aggregate data for condition distribution
      const conditionCounts: { [key: string]: number } = {};
      trials.forEach((trial: Trial) => {
        const condition = trial.condition || "Unknown";
        conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
      });

      const conditionLabels = Object.keys(conditionCounts).slice(0, 10); // Top 10 conditions
      const conditionValues = conditionLabels.map(
        (label) => conditionCounts[label]
      );

      setConditionData({
        labels: conditionLabels,
        datasets: [
          {
            label: "# of Trials",
            data: conditionValues,
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
  }, [trials]);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">
        Clinical Trials Dashboard
      </h1>

      {loading || metaLoading || statsLoading ? (
        <div className="flex justify-center items-center">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      ) : error || metaError || statsError ? (
        <p className="text-red-500 text-center">
          {error || metaError || statsError}
        </p>
      ) : (
        <>
          {/* Trials by Status Chart */}
          <div className="card bg-base-100 shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Trials by Status</h2>
            {statusData ? (
              <Bar
                data={statusData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "top" as const,
                    },
                    title: {
                      display: true,
                      text: "Number of Trials by Status",
                    },
                  },
                }}
              />
            ) : (
              <p>No status data available.</p>
            )}
          </div>

          {/* Top Conditions Chart */}
          <div className="card bg-base-100 shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Top 10 Conditions</h2>
            {conditionData ? (
              <Pie
                data={conditionData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "right" as const,
                    },
                    title: {
                      display: true,
                      text: "Number of Trials by Condition",
                    },
                  },
                }}
              />
            ) : (
              <p>No condition data available.</p>
            )}
          </div>

          {/* Study Metadata Section */}
          <div className="card bg-base-100 shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Study Metadata</h2>
            {Array.isArray(metadata) ? (
              <div className="overflow-x-auto">
                <table className="table w-full table-zebra">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metadata.map((field) => (
                      <tr key={field.name}>
                        <td>{field.name}</td>
                        <td>{field.description}</td>
                        <td>{field.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No metadata available.</p>
            )}
          </div>

          {/* Study Statistics Section */}
          <div className="card bg-base-100 shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Study Statistics</h2>
            {stats ? (
              <div>
                <p>
                  <strong>Total Studies:</strong> {stats.totalCount}
                </p>
                <p>
                  <strong>Average Size (Bytes):</strong>{" "}
                  {stats.averageSizeBytes}
                </p>
                <h3 className="text-xl font-semibold mt-4">Largest Studies</h3>
                <ul className="list-disc list-inside">
                  {stats.largestStudies.slice(0, 5).map((study) => (
                    <li key={study.id}>
                      {study.id}: {study.sizeBytes} Bytes
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>No statistics available.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

/**
 * Helper function to assign badge colors based on status.
 * @param status - Overall status of the trial
 * @returns Corresponding badge class
 */
const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case "recruiting":
      return "badge-info";
    case "completed":
      return "badge-success";
    case "terminated":
    case "suspended":
    case "withdrawn":
      return "badge-error";
    default:
      return "badge-neutral";
  }
};

export default Dashboard;
