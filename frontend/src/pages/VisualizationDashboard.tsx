import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Tooltip,
} from "chart.js";
import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import useStudyStats from "../hooks/useStudyStats";
import useTrialMetadata from "../hooks/useTrialMetaData";
import useTrials from "../hooks/useTrials";

// Register Chart.js once
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
);

const VisualizationDashboard: React.FC = () => {
    const [searchParams] = useState<any>({
        format: "json",
        pageSize: 50,
        fields: "NCTId,BriefTitle,OverallStatus,HasResults,protocolSection.statusModule.overallStatus", // Removed protocolSection.conditionsModule.conditionList
      });

  const { trials, loading, error } = useTrials(searchParams);
  const {
    metadata,
    loading: metaLoading,
    error: metaError,
  } = useTrialMetadata();
  const { stats, loading: statsLoading, error: statsError } = useStudyStats();

  const [statusData, setStatusData] = useState<any>(null);
  const [conditionData, setConditionData] = useState<any>(null);

  useEffect(() => {
    console.log("Trials data:", trials);
    if (trials.length > 0) {
      const statusCounts: Record<string, number> = {};
      trials.forEach((t) => {
        const status = t.overallStatus || "Unknown";
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });

      const statusLabels = Object.keys(statusCounts);
      const statusValues = Object.values(statusCounts);

      console.log("Status counts:", statusCounts);
      console.log("Status labels:", statusLabels);
      console.log("Status values:", statusValues);

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
          },
        ],
      });

      const conditionCounts: Record<string, number> = {};
      trials.forEach((t) => {
        const c = t.condition || "Unknown";
        conditionCounts[c] = (conditionCounts[c] || 0) + 1;
      });

      const sortedConditions = Object.entries(conditionCounts).sort(
        (a, b) => b[1] - a[1]
      );
      const top10 = sortedConditions.slice(0, 10);
      const conditionLabels = top10.map((x) => x[0]);
      const conditionValues = top10.map((x) => x[1]);

      console.log("Condition counts:", conditionCounts);
      console.log("Sorted conditions:", sortedConditions);
      console.log("Top 10 conditions:", top10);
      console.log("Condition labels:", conditionLabels);
      console.log("Condition values:", conditionValues);

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

  const isLoading = loading || metaLoading || statsLoading;
  const isError = error || metaError || statsError;

  console.log("Loading state:", isLoading);
  console.log("Error state:", isError);
  console.log("Metadata:", metadata);
  console.log("Stats:", stats);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">
        Visualization Dashboard
      </h1>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      ) : isError ? (
        <p className="text-red-500 text-center">
          {error || metaError || statsError}
        </p>
      ) : (
        <>
          <div className="card bg-base-100 shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Trials by Status</h2>
            {statusData ? (
              <Bar
                data={statusData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: "top" },
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

          <div className="card bg-base-100 shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Top 10 Conditions</h2>
            {conditionData ? (
              <Pie
                data={conditionData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: "right" },
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

export default VisualizationDashboard;
