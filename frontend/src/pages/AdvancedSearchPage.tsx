import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import useTrials from "../hooks/useTrials";
import { AdvancedSearchParams } from "../types";

const AdvancedSearchPage: React.FC = () => {
    const [searchParams, setSearchParams] = useState<AdvancedSearchParams>({});
    const [submitted, setSubmitted] = useState<boolean>(false);

    const { trials, loading, error, nextPageToken, fetchNextPage, resetResults } =
        useTrials({
            format: "json",
            pageSize: 10,
            ...searchParams,
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        resetResults();
    };

    useEffect(() => {
        if (submitted) {
            resetResults();
        }
    }, [searchParams]);

    return (
        <motion.div
            className="container mx-auto px-4 mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            style={{ backgroundColor: "#f5f5f5", color: "#333" }}
        >
            <h1 className="text-3xl font-bold mt-6 mb-4 text-center" style={{ color: "#333" }}>
                Advanced Search
            </h1>

            <p className="text-center mb-8" style={{ color: "#666" }}>
                Use the fields below to narrow down clinical trials based on condition,
                sponsor, location, and recruitment status.
            </p>

            <form
                onSubmit={handleSubmit}
                className="card shadow-md p-6 mb-6"
                style={{ backgroundColor: "#fff", borderColor: "#ccc" }}
            >
                {/* Condition Field */}
                <label className="block mb-2 font-semibold">Condition</label>
                <input
                    type="text"
                    className="input input-bordered w-full mb-4"
                    placeholder="e.g. cancer"
                    value={searchParams.condition || ""}
                    onChange={(e) =>
                        setSearchParams((prev) => ({ ...prev, condition: e.target.value }))
                    }
                    style={{ borderColor: "#ccc", color: "#333" }}
                />

                {/* Sponsor Field */}
                <label className="block mb-2 font-semibold">Sponsor</label>
                <input
                    type="text"
                    className="input input-bordered w-full mb-4"
                    placeholder="e.g. Pfizer"
                    value={searchParams.sponsor || ""}
                    onChange={(e) =>
                        setSearchParams((prev) => ({ ...prev, sponsor: e.target.value }))
                    }
                    style={{ borderColor: "#ccc", color: "#333" }}
                />

                {/* Location Fields */}
                <div className="flex flex-wrap gap-4 mb-4">
                    <div className="w-full sm:w-1/3">
                        <label className="block mb-2 font-semibold">
                            Latitude (optional)
                        </label>
                        <input
                            type="number"
                            step="any"
                            className="input input-bordered w-full"
                            placeholder="e.g. 39.0035707"
                            onChange={(e) =>
                                setSearchParams((prev) => ({
                                    ...prev,
                                    location: {
                                        ...prev.location,
                                        latitude: parseFloat(e.target.value),
                                    },
                                }))
                            }
                            style={{ borderColor: "#ccc", color: "#333" }}
                        />
                    </div>
                    <div className="w-full sm:w-1/3">
                        <label className="block mb-2 font-semibold">
                            Longitude (optional)
                        </label>
                        <input
                            type="number"
                            step="any"
                            className="input input-bordered w-full"
                            placeholder="e.g. -77.1013313"
                            onChange={(e) =>
                                setSearchParams((prev) => ({
                                    ...prev,
                                    location: {
                                        ...prev.location,
                                        longitude: parseFloat(e.target.value),
                                    },
                                }))
                            }
                            style={{ borderColor: "#ccc", color: "#333" }}
                        />
                    </div>
                    <div className="w-full sm:w-1/3">
                        <label className="block mb-2 font-semibold">
                            Radius (e.g. 50mi)
                        </label>
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            placeholder="e.g. 50mi or 100km"
                            onChange={(e) =>
                                setSearchParams((prev) => ({
                                    ...prev,
                                    location: {
                                        ...prev.location,
                                        radius: e.target.value,
                                    },
                                }))
                            }
                            style={{ borderColor: "#ccc", color: "#333" }}
                        />
                    </div>
                </div>

                {/* Statuses (checkboxes) */}
                <label className="block mb-2 font-semibold">Recruitment Status</label>
                <div className="flex flex-wrap gap-4 mb-4">
                    {[
                        "NOT_YET_RECRUITING",
                        "RECRUITING",
                        "COMPLETED",
                        "SUSPENDED",
                        "TERMINATED",
                    ].map((stat) => (
                        <label
                            key={stat}
                            className="inline-flex items-center cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                className="checkbox checkbox-sm mr-2"
                                onChange={(e) => {
                                    const checked = e.target.checked;
                                    setSearchParams((prev) => {
                                        const existing = prev.status || [];
                                        if (checked) {
                                            return { ...prev, status: [...existing, stat] };
                                        } else {
                                            return {
                                                ...prev,
                                                status: existing.filter((s) => s !== stat),
                                            };
                                        }
                                    });
                                }}
                                style={{ borderColor: "#ccc", color: "#333" }}
                            />
                            {stat.replace("_", " ")}
                        </label>
                    ))}
                </div>

                <button type="submit" className="btn btn-ghost" style={{ borderColor: "#333", color: "#333" }}>
                    Search
                </button>
            </form>

            <div className="my-4 text-sm" style={{ color: "#666" }}>
                <strong>Active Filters: </strong>
                {searchParams.condition && (
                    <span>Condition = {searchParams.condition}; </span>
                )}
                {searchParams.sponsor && (
                    <span>Sponsor = {searchParams.sponsor}; </span>
                )}
                {searchParams.location?.latitude && (
                    <span>
                        Geo = distance(
                        {searchParams.location.latitude},{searchParams.location.longitude},
                        {searchParams.location.radius}) ;{" "}
                    </span>
                )}
                {searchParams.status?.length ? (
                    <span>Status = {searchParams.status.join(", ")} </span>
                ) : null}
            </div>

            {submitted && (
                <div className="mt-6">
                    {loading && (
                        <div className="flex justify-center items-center h-64">
                            <span className="loading loading-spinner loading-lg"></span>
                        </div>
                    )}

                    {error && <p className="text-red-500 text-center">{error}</p>}

                    {!loading && !error && (
                        <>
                            {trials.length === 0 ? (
                                <p className="text-center" style={{ color: "#666" }}>
                                    No trials found matching your filters.
                                </p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {trials.map((trial) => (
                                        <motion.div
                                            key={trial.nctId}
                                            className="card shadow-md p-6"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4 }}
                                            style={{ backgroundColor: "#fff", borderColor: "#ccc" }}
                                        >
                                            <h2 className="text-xl font-semibold mb-2" style={{ color: "#333" }}>
                                                {trial.briefTitle}
                                            </h2>
                                            <p className="mb-2" style={{ color: "#666" }}>
                                                <strong>Status:</strong> {trial.overallStatus}
                                            </p>
                                            <p className="mb-4" style={{ color: "#666" }}>
                                                <strong>Condition:</strong> {trial.condition || "N/A"}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {nextPageToken && (
                                <div className="mt-6 flex justify-center">
                                    <button onClick={fetchNextPage} className="btn btn-ghost" style={{ borderColor: "#333", color: "#333" }}>
                                        Load More
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </motion.div>
    );
};

export default AdvancedSearchPage;
