import { motion } from "framer-motion";
import React from "react";
import ConditionChart from "../components/charts/ConditionChart";
import StatusChart from "../components/charts/StatusChart";
import TrendChart from "../components/charts/TrendChart";
import SummaryCards from "../components/shared/SummaryCards";
import StudyStatistics from "../components/StudyStatistics";
import useVisualizationData from "../hooks/useVisualizationData";

/**
 * VisualizationDashboard Component
 *
 * Displays various charts and statistics related to clinical trials.
 */
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

                    {/* 2) Bar Chart: Trials by Status */}
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
                                            legend: { position: "top", labels: { font: { size: 14 } } },
                                            title: {
                                                display: true,
                                                text: "Number of Trials by Status",
                                                font: { size: 18 },
                                            },
                                            tooltip: {
                                                callbacks: {
                                                    label: (context) => {
                                                        const label = context.label || "";
                                                        const value = context.parsed.y || 0;
                                                        return `${label}: ${value} Trials`;
                                                    },
                                                },
                                            },
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                title: { display: true, text: "Number of Trials" },
                                                ticks: {
                                                    // Automatically adjust max based on data
                                                    callback: (value) => value.toLocaleString(),
                                                },
                                            },
                                            x: {
                                                title: { display: true, text: "Trial Status" },
                                                ticks: {
                                                    color: '#333',
                                                    font: {
                                                        size: 12,
                                                    },
                                                },
                                            },
                                        },
                                        interaction: { mode: "index", intersect: false },
                                    }}
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* 3) Pie Chart: Top 10 Conditions */}
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
                                            legend: { position: "right", labels: { font: { size: 14 } } },
                                            title: {
                                                display: true,
                                                text: "Top 10 Conditions by Number of Trials",
                                                font: { size: 18 },
                                            },
                                            tooltip: {
                                                callbacks: {
                                                    label: (context) => {
                                                        const { label, parsed } = context;
                                                        const totalTrials =
                                                            statusData?.datasets[0].data.reduce(
                                                                (a, b) => a + b,
                                                                0
                                                            ) || 1;
                                                        const percent = (
                                                            (parsed / totalTrials) *
                                                            100
                                                        ).toFixed(2);
                                                        return `${label}: ${parsed} Trials (${percent}%)`;
                                                    },
                                                },
                                            },
                                        },
                                    }}
                                />
                            </div>
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
                            <h2 className="text-2xl font-semibold text-center text-gray-800">
                                Monthly Update Trend
                            </h2>
                            <div style={{ height: "420px" }}>
                                <TrendChart
                                    data={trendData}
                                    options={{
                                        maintainAspectRatio: false,
                                        responsive: true,
                                        plugins: {
                                            legend: { position: "top", labels: { font: { size: 14 } } },
                                            title: { display: true, text: "Monthly Updates Trend", font: { size: 18 } },
                                            tooltip: {
                                                callbacks: {
                                                    label: (context) => {
                                                        const label = context.label || "";
                                                        const value = context.parsed.y || 0;
                                                        return `${label}: ${value} Trials`;
                                                    },
                                                },
                                            },
                                        },
                                        interaction: { mode: "index", intersect: false },
                                        scales: {
                                            x: { title: { display: true, text: "Month" } },
                                            y: {
                                                title: { display: true, text: "Number of Trials" },
                                                ticks: {
                                                    callback: (value) => value.toLocaleString(),
                                                },
                                            },
                                        },
                                    }}
                                />
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
                        {/* Uncomment and pass the necessary props when StudyMetadataTable is ready */}
                        {/* <StudyMetadataTable metadata={metadata || []} /> */}
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