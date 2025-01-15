/**
 * src/pages/TrialDetailsPage.tsx
 *
 * Shows details of a single trial, fetched from /api/studies/{nctId}.
 * Also includes an optional "Results" tab if `hasResults = true`.
 */

import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useTrialDetails from "../hooks/useTrialDetails";

// CHART IMPORTS
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Title as ChartTitle,
    Legend,
    LinearScale,
    Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend
);

/** Helper for status styling */
const getStatusBadge = (status: string | undefined) => {
  if (!status) return "badge-neutral";
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
const TrialDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { trial, loading, error } = useTrialDetails(id || "");

  const [activeTab, setActiveTab] = useState<
    "overview" | "eligibility" | "interventions" | "results"
  >("overview");
  const [flowData, setFlowData] = useState<any>(null);

  // Example participant flow chart creation
  useEffect(() => {
    if (trial?.resultsSection) {
      const flowModule = trial.resultsSection.participantFlowModule;
      if (flowModule?.groups?.length) {
        const groupTitles: string[] = [];
        const groupParticipants: number[] = [];

        const { groups, periods } = flowModule;
        // e.g. the first milestone might be "STARTED" => achievements => groupId => numSubjects
        const startedMilestone = periods?.[0]?.milestones?.find(
          (m: any) => m.type === "STARTED"
        );
        if (startedMilestone) {
          startedMilestone.achievements.forEach((ach: any) => {
            // find the group info
            const group = groups.find((g: any) => g.id === ach.groupId);
            if (group) {
              groupTitles.push(group.title || "Unnamed Group");
              const num = parseInt(ach.numSubjects || "0", 10);
              groupParticipants.push(num);
            }
          });

          // Build chart data
          setFlowData({
            labels: groupTitles,
            datasets: [
              {
                label: "Participants Started",
                data: groupParticipants,
                backgroundColor: "rgba(54,162,235,0.6)",
                borderColor: "rgba(54,162,235,1)",
                borderWidth: 1,
              },
            ],
          });
        }
      }
    }
  }, [trial]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  if (error) {
    return <p className="text-red-500 text-center mt-4">{error}</p>;
  }
  if (!trial) {
    return <p className="text-center mt-4">No trial found.</p>;
  }

  const tabs = ["overview", "eligibility", "interventions"];
  if (trial.hasResults) {
    tabs.push("results");
  }

  return (
    <motion.div
      className="container mx-auto px-4 mt-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="card bg-base-100 shadow-md p-8">
        {/* Title */}
        <h2 className="text-3xl font-bold mb-6 text-center text-primary">
          {trial.briefTitle}
        </h2>

        {/* Top bar: status, hasResults, NCT ID */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <div className="mb-4 md:mb-0">
            <span
              className={`badge ${getStatusBadge(trial.overallStatus)} mr-2`}
            >
              {trial.overallStatus || "Unknown Status"}
            </span>
            {trial.hasResults ? (
              <span className="badge badge-success">Has Results</span>
            ) : (
              <span className="badge badge-error">No Results</span>
            )}
            <p className="mt-2 text-sm text-gray-500">
              <strong>NCT ID:</strong> {trial.nctId}
            </p>
          </div>

          <Link to="/trials" className="btn btn-secondary">
            Back to Trials
          </Link>
        </div>

        {/* Tab Buttons */}
        <div className="tabs mb-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`tab tab-bordered ${
                activeTab === tab ? "tab-active" : ""
              }`}
              onClick={() => setActiveTab(tab as typeof activeTab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-2">Description</h3>
              <p>{trial.description || "No Description"}</p>
            </motion.div>
          )}

          {activeTab === "eligibility" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-2">
                Eligibility Criteria
              </h3>
              <p>{trial.eligibility?.criteria || "N/A"}</p>
            </motion.div>
          )}

          {activeTab === "interventions" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-2">Interventions</h3>
              <p>
                {trial.interventions && trial.interventions.length
                  ? trial.interventions.join(", ")
                  : "N/A"}
              </p>
            </motion.div>
          )}

          {activeTab === "results" && trial.hasResults && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-4">Trial Results</h3>
              {flowData ? (
                <div style={{ maxWidth: "700px", margin: "0 auto" }}>
                  <Bar
                    data={flowData}
                    options={{
                      responsive: true,
                      plugins: {
                        title: {
                          display: true,
                          text: "Participant Flow (Started)",
                          font: { size: 18 },
                        },
                        legend: { position: "top" },
                      },
                      scales: {
                        y: { beginAtZero: true },
                      },
                    }}
                  />
                </div>
              ) : (
                <p className="text-gray-500">
                  No participant flow data available.
                </p>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TrialDetailsPage;
