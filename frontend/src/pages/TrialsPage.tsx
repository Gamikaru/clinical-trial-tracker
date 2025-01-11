/**
 * src/pages/TrialsPage.tsx
 *
 * Enhancements:
 *   - Updated styling to match Navbar for a minimal, subtle, smooth, modern, and chic appearance
 *   - Sorting functionality
 *   - Improved UI with additional buttons and better layout
 *   - Enhanced filter options
 *   - 'Load More' pagination using nextPageToken
 */

import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useTrials from "../hooks/useTrials";

const TrialsPage: React.FC = () => {
    const { trials, loading, error, nextPageToken, fetchNextPage } = useTrials({
        format: "json",
        pageSize: 20,
        fields:
            "NCTId,BriefTitle,OverallStatus,HasResults,protocolSection.conditionsModule",
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState<
        "briefTitle" | "overallStatus" | "condition"
    >("briefTitle");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const handleSort = (field: typeof sortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    const sortedTrials = [...trials].sort((a, b) => {
        const fieldA = a[sortField]?.toLowerCase() || "";
        const fieldB = b[sortField]?.toLowerCase() || "";
        if (fieldA < fieldB) return sortOrder === "asc" ? -1 : 1;
        if (fieldA > fieldB) return sortOrder === "asc" ? 1 : -1;
        return 0;
    });

    const filteredTrials = sortedTrials.filter((trial) => {
        const term = searchTerm.toLowerCase();
        return (
            trial.briefTitle.toLowerCase().includes(term) ||
            trial.overallStatus.toLowerCase().includes(term) ||
            (trial.condition && trial.condition.toLowerCase().includes(term))
        );
    });

    useEffect(() => {
        console.log("Trials data:", trials);
    }, [trials]);

    if (loading && trials.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return <p className="text-red-500 text-center mt-4">{error}</p>;
    }

    return (
        <motion.div
            className="container mx-auto px-4 py-8 bg-white text-gray-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <h1 className="text-3xl font-bold mb-6 text-center text-[#434B56]">
                Trials List
            </h1>

            <div className="flex flex-col md:flex-row items-center md:justify-between mb-6 space-y-4 md:space-y-0">
                <input
                    type="text"
                    className="input input-bordered w-full md:w-1/2 border-[#C4C4C4] text-gray-800"
                    placeholder="Search trials by title, status, or condition..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <div className="flex space-x-2">
                    <button
                        className="btn btn-ghost text-[#434B56] hover:text-[#6A9EFD] transition"
                        onClick={() => handleSort("briefTitle")}
                    >
                        Sort by Title {sortField === "briefTitle" && (sortOrder === "asc" ? "↑" : "↓")}
                    </button>
                    <button
                        className="btn btn-ghost text-[#434B56] hover:text-[#6A9EFD] transition"
                        onClick={() => handleSort("overallStatus")}
                    >
                        Sort by Status {sortField === "overallStatus" && (sortOrder === "asc" ? "↑" : "↓")}
                    </button>
                    <button
                        className="btn btn-ghost text-[#434B56] hover:text-[#6A9EFD] transition"
                        onClick={() => handleSort("condition")}
                    >
                        Sort by Condition {sortField === "condition" && (sortOrder === "asc" ? "↑" : "↓")}
                    </button>
                    <Link
                        to="/advanced-search"
                        className="btn btn-outline btn-ghost text-[#434B56] hover:text-[#6A9EFD] transition"
                    >
                        Advanced Search
                    </Link>
                </div>
            </div>

            {filteredTrials.length === 0 ? (
                <p className="text-center text-[#C4C4C4]">No trials match your search.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTrials.map((trial) => (
                        <motion.div
                            key={trial.nctId}
                            className="card bg-[#F9FAFB] shadow-md p-6 rounded-lg"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className="text-xl font-semibold mb-2 text-[#434B56]">
                                {trial.briefTitle}
                            </h2>
                            <p className="mb-2">
                                <strong>Status:</strong> {trial.overallStatus}
                            </p>
                            <p className="mb-4">
                                <strong>Condition:</strong> {trial.condition || "N/A"}
                            </p>
                            <Link
                                to={`/trials/${trial.nctId}`}
                                className="btn btn-ghost text-[#434B56] hover:text-[#6A9EFD] transition"
                            >
                                View Details
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}

            {nextPageToken && (
                <div className="mt-8 flex justify-center">
                    <button
                        className={`btn ${loading ? "btn-disabled" : "btn-outline"} text-[#434B56] border-[#C4C4C4] hover:bg-[#F1F5F9] transition`}
                        onClick={() => {
                            if (!loading) {
                                fetchNextPage();
                            }
                        }}
                    >
                        {loading ? "Loading..." : "Load More"}
                    </button>
                </div>
            )}
        </motion.div>
    );
};

export default TrialsPage;
