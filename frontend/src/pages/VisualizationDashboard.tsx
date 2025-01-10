/**
 * src/pages/VisualizationDashboard.tsx
 *
 * Showcases multiple charts with a cohesive Vial-like aesthetic.
 * We use framer-motion to animate each chart block.
 */

import {
    ArcElement,
    BarElement,
    CategoryScale,
    ChartData,
    Chart as ChartJS,
    ChartOptions,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

import React, { useEffect, useMemo, useState } from "react";
import useStudyStats from "../hooks/useStudyStats";
import useTrialMetadata from "../hooks/useTrialMetaData";
import useTrials from "../hooks/useTrials";

import { motion } from "framer-motion";
import StudyMetadataTable from "../components/StudyMetadataTable";
import StudyStatistics from "../components/StudyStatistics";
import SummaryCards from "../components/SummaryCards";
import TopConditionsChart from "../components/TopCOnditionsChart"; // <-- Ensure your file is EXACTLY named "TopConditionsChart.tsx"
import TrialsByStatusChart from "../components/TrialsByStatusChart";

// Register Chart.js components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  Title,
  LineElement,
  PointElement
);

// We'll define these interface types for clarity
interface StatusData extends ChartData<"bar", number[], string> {}
interface ConditionData extends ChartData<"pie", number[], string> {}
interface TrendData extends ChartData<"line", number[], string> {}

const VisualizationDashboard: React.FC = () => {
  // We'll request lastUpdatePostDateStruct.date for the line chart
  const [searchParams] = useState({
    format: "json",
    pageSize: 100,
    fields:
      "NCTId,BriefTitle,OverallStatus,HasResults,protocolSection.conditionsModule,protocolSection.statusModule.lastUpdatePostDateStruct.date",
    sort: "@relevance",
  });

  // Hook usage
  const { trials, loading, error } = useTrials(searchParams);
  const {
    metadata,
    loading: metaLoading,
    error: metaError,
  } = useTrialMetadata();
  const { stats, loading: statsLoading, error: statsError } = useStudyStats();

  // Chart data states
  const [statusData, setStatusData] = useState<StatusData | undefined>();
  const [conditionData, setConditionData] = useState<
    ConditionData | undefined
  >();
  const [trendData, setTrendData] = useState<TrendData | undefined>();

  useEffect(() => {
    // Only compute chart data if we have any trials
    if (trials.length > 0) {
      /**
       * 1) Trials by Status
       */
      const statusCounts = trials.reduce<Record<string, number>>(
        (acc, trial) => {
          const status = trial.overallStatus || "UNKNOWN";
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        },
        {}
      );
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

      /**
       * 2) Top 10 Conditions
       */
      const conditionCounts = trials.reduce<Record<string, number>>(
        (acc, trial) => {
          const cond = trial.condition?.trim() || "No Condition Info";
          acc[cond] = (acc[cond] || 0) + 1;
          return acc;
        },
        {}
      );
      // Filter out "No Condition Info" from the chart
      const filteredConds = Object.entries(conditionCounts).filter(
        ([cond]) => cond !== "No Condition Info"
      );
      if (filteredConds.length === 0) {
        setConditionData(undefined);
      } else {
        const top10 = filteredConds.sort((a, b) => b[1] - a[1]).slice(0, 10);
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

      /**
       * 3) Monthly lastUpdatePostDate Trend
       */
      const dateCounts = trials.reduce<Record<string, number>>((acc, trial) => {
        // Depending on your hook’s data shape, you might store lastUpdatePostDate
        // in trial.lastUpdatePostDate:
        const rawDate = trial.lastUpdatePostDate;
        if (!rawDate) return acc;
        // e.g. "2024-01-10" => "2024-01"
        const month = rawDate.slice(0, 7);
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {});

      const sortedMonths = Object.keys(dateCounts).sort();
      const sortedVals = sortedMonths.map((m) => dateCounts[m]);
      if (sortedMonths.length > 0) {
        setTrendData({
          labels: sortedMonths,
          datasets: [
            {
              label: "# of Trials Updated",
              data: sortedVals,
              fill: false,
              borderColor: "rgba(75,192,192,1)",
              tension: 0.1,
            },
          ],
        });
      } else {
        setTrendData(undefined);
      }
    } else {
      // If no trials, clear chart data
      setStatusData(undefined);
      setConditionData(undefined);
      setTrendData(undefined);
    }
  }, [trials]);

  /**
   * Chart Options
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
          title: { display: true, text: "Number of Trials" },
        },
        x: {
          title: { display: true, text: "Trial Status" },
        },
      },
      interaction: {
        mode: "index",
        intersect: false,
      },
    }),
    []
  );

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
              const percent = ((parsed / totalTrials) * 100).toFixed(2);
              return `${label}: ${parsed} Trials (${percent}%)`;
            },
          },
        },
      },
    }),
    [trials.length]
  );

  const lineOptions: ChartOptions<"line"> = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: "Monthly Updates Trend" },
      },
      interaction: { mode: "index", intersect: false },
      scales: {
        x: { title: { display: true, text: "Month" } },
        y: { title: { display: true, text: "Number of Trials" } },
      },
    }),
    []
  );

  // Combine states
  const isLoading = loading || metaLoading || statsLoading;
  const isError = error || metaError || statsError;

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="text-4xl font-bold mb-8 text-center text-primary">
        Visualization Dashboard
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Explore aggregated statistics of clinical trials, including how many are
        active, top researched conditions, and how often studies are updated
        monthly.
      </p>

      {isLoading && (
        <div className="flex justify-center items-center my-10">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {isError && (
        <div className="my-10">
          <p className="text-red-500 text-center text-lg">
            {error || metaError || statsError}
          </p>
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

          {/* 2) Bar Chart: Trials by Status */}
          {statusData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <TrialsByStatusChart data={statusData} options={barOptions} />
            </motion.div>
          )}

          {/* 3) Pie Chart: Top 10 Conditions */}
          {conditionData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <TopConditionsChart data={conditionData} options={pieOptions} />
            </motion.div>
          )}

          {/* 4) Monthly Updates Trend (Line Chart) */}
          {trendData && trendData.labels && trendData.labels.length > 0 && (
            <motion.div
              className="card bg-base-100 shadow-md p-4 flex flex-col gap-4 justify-center col-span-1 lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-2xl font-semibold text-center">
                Monthly Update Trend
              </h2>
              <div style={{ height: "400px" }}>
                <Line data={trendData} options={lineOptions} />
              </div>
            </motion.div>
          )}

          {/* 5) Study Metadata Table */}
          <motion.div
            className="col-span-1 lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <StudyMetadataTable metadata={metadata || []} />
          </motion.div>

          {/* 6) Additional Study Statistics */}
          <motion.div
            className="col-span-1 lg:col-span-2"
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
