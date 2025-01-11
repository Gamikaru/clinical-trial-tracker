/**
 * src/pages/TrialDetailsPage.tsx
 *
 * A more polished trial details page with optional tabs to separate content logically,
 * including a new "Results" tab with a bar chart (if `trial.hasResults` is true).
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

/**
 * getStatusBadge - determines which DaisyUI badge to apply.
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

const TrialDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { trial, loading, error } = useTrialDetails(id || "");

  // Tab navigation state
  // We'll add "results" tab if the trial has results
  const [activeTab, setActiveTab] = useState<
    "overview" | "eligibility" | "interventions" | "results"
  >("overview");

  // Example chart data from participant flow, if any
  const [flowData, setFlowData] = useState<any>(null);

  useEffect(() => {
    if (trial && trial.resultsSection) {
      // We'll look for participantFlowModule => groups => flowGroupTitle vs total participants
      const flowModule = trial.resultsSection.participantFlowModule;
      if (flowModule?.groups?.length) {
        // For each group, we can try to see how many participants started (FlowAchievementNumSubjects, etc.)
        // We'll keep it simple and chart the groupTitle vs the # started
        const groupTitles: string[] = [];
        const groupParticipants: number[] = [];

        // The first "milestone" might be the "STARTED" milestone
        // We'll gather that from flowModule.periods?
        // If we want to keep it simpler: show all group titles with "FlowGroupId"?
        // We'll do a direct approach:
        const { groups, periods } = flowModule;

        // We gather a map of groupId -> # participants from the first milestone in the first period
        const startedMilestone = periods?.[0]?.milestones?.[0];
        // e.g. startedMilestone.achievements => array of FlowStats with groupId, numSubjects
        const achievements = startedMilestone?.achievements || [];

        // groupTitles can come from "flowModule.groups.title"
        groups.forEach((g: any) => {
          groupTitles.push(g.title || "Untitled Group");
          // find the achievement for that group
          const foundAch = achievements.find((a: any) => a.groupId === g.id);
          const numSubjects = parseInt(foundAch?.numSubjects || "0", 10);
          groupParticipants.push(numSubjects);
        });

        // Now define chart data
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
  }, [trial]);

  useEffect(() => {
    // debugging or side-effects if needed
    // console.log("Trial details with results section:", trial);
  }, [trial, loading, error]);

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

  // If the trial has results, let's show a "results" tab
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

        {/* Top Bar: Status, Has Results, NCT ID */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <div className="mb-4 md:mb-0">
            <span
              className={`badge ${getStatusBadge(trial.overallStatus)} mr-2`}
            >
              {trial.overallStatus}
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

          {/* “Back to Trials” Button */}
          <Link to="/trials" className="btn btn-secondary">
            Back to Trials
          </Link>
        </div>

        {/* Tab Buttons */}
        <div className="tabs mb-4">
          {tabs.map((tabKey) => (
            <button
              key={tabKey}
              className={`tab tab-bordered ${
                activeTab === tabKey ? "tab-active" : ""
              }`}
              onClick={() => setActiveTab(tabKey as typeof activeTab)}
            >
              {tabKey.charAt(0).toUpperCase() + tabKey.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-2">Description</h3>
              <p>{trial.description}</p>
            </motion.div>
          )}

          {activeTab === "eligibility" && (
            <motion.div
              key="eligibility"
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
              key="interventions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-2">Interventions</h3>
              <p>
                {trial.interventions && trial.interventions.length > 0
                  ? trial.interventions.join(", ")
                  : "N/A"}
              </p>
            </motion.div>
          )}

          {/* Results Tab: Only shown if hasResults === true */}
          {activeTab === "results" && trial.hasResults && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-4">Trial Results</h3>
              {/* We'll show a bar chart of participant flow group vs. # started */}
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
                        legend: {
                          position: "top",
                        },
                      },
                      scales: {
                        y: { beginAtZero: true },
                      },
                    }}
                  />
                </div>
              ) : (
                <p className="text-gray-500">
                  No participant flow data available to visualize.
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
