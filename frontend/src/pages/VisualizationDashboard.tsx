/**
 * src/pages/VisualizationDashboard.tsx
 *
 * Show charts for status, condition, trends, plus summary cards & study stats.
 */

import { motion } from "framer-motion";
import React from "react";
import ConditionChart from "../components/charts/ConditionChart";
import StatusChart from "../components/charts/StatusChart";
import TrendChart from "../components/charts/TrendChart";
import SummaryCards from "../components/shared/SummaryCards";
import StudyStatistics from "../components/StudyStatistics";
import useVisualizationData from "../hooks/useVisualizationData";

const VisualizationDashboard: React.FC = () => {
  const { statusData, conditionData, trendData, isLoading, isError, stats } =
    useVisualizationData();

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Visualization Dashboard
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Explore aggregated statistics of clinical trials, including how many are
        active, top researched conditions, and monthly update trends.
      </p>

      {isLoading && (
        <div className="flex justify-center items-center my-10">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {isError && (
        <div className="my-10">
          <p className="text-red-500 text-center text-lg">{isError}</p>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 1) Summary Cards */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <SummaryCards
              totalStudies={stats?.totalCount || 0}
              averageSizeBytes={stats?.averageSizeBytes || 0}
            />
          </motion.div>

          {/* 2) Status Chart */}
          {statusData && (
            <motion.div
              className="card bg-white shadow-md p-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div style={{ height: "420px" }}>
                <StatusChart
                  data={statusData}
                  options={{
                    maintainAspectRatio: false,
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
              </div>
            </motion.div>
          )}

          {/* 3) Condition Chart */}
          {conditionData && (
            <motion.div
              className="card bg-white shadow-md p-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div style={{ height: "420px" }}>
                <ConditionChart
                  data={conditionData}
                  options={{
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                      legend: { position: "right" },
                      title: {
                        display: true,
                        text: "Top 10 Conditions by # of Trials",
                      },
                    },
                  }}
                />
              </div>
            </motion.div>
          )}

          {/* 4) Trend Chart */}
          {trendData && trendData.labels && trendData.labels.length > 0 && (
            <motion.div
              className="card bg-white shadow-md p-4 lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
                Monthly Updates Trend
              </h2>
              <div style={{ height: "420px" }}>
                <TrendChart
                  data={trendData}
                  options={{
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                      legend: { position: "top" },
                      title: { display: true, text: "Monthly Updates" },
                    },
                  }}
                />
              </div>
            </motion.div>
          )}

          {/* 5) Study Statistics */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <StudyStatistics
              totalCount={stats?.totalCount || 0}
              averageSizeBytes={stats?.averageSizeBytes || 0}
              largestStudies={stats?.largestStudies || []}
            />
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default VisualizationDashboard;
