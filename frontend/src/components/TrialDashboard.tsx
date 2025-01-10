import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart,
    Legend,
    LinearScale,
    Tooltip,
} from "chart.js";
import React, { useState } from "react";
import useStudyStats from "../hooks/useStudyStats";
import useTrialMetadata from "../hooks/useTrialMetaData";
import useTrials, { Trial } from "../hooks/useTrials";
import Pagination from "./Pagination";

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
);

/**
 * TrialDashboard component displays a list of clinical trials with search and pagination functionalities.
 */
const TrialDashboard: React.FC = () => {
  // State for search parameters
  const [searchParams, setSearchParams] = useState<any>({
    pageSize: 10,
    page: 1,
    // Add other search parameters as needed
  });

  // Fetch trials based on search parameters
  const { trials, loading, error } = useTrials(searchParams);

  // Fetch metadata and stats
  const {
    metadata,
    loading: metaLoading,
    error: metaError,
  } = useTrialMetadata();
  const { stats, loading: statsLoading, error: statsError } = useStudyStats();

  /**
   * Handles the search form submission.
   * @param e Form event
   */
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const statusParam = formData.get("status") as string;
    const params: any = {
      pageSize: Number(formData.get("pageSize")) || 10,
      query: {
        cond: formData.get("condition") || "",
      },
      page: 1, // Reset to first page on new search
      // Extract and set other search parameters from form
    };
    if (statusParam) {
      params.filter = { overallStatus: statusParam };
    }
    setSearchParams(params);
  };

  /**
   * Handles page change for pagination.
   * @param page - Selected page number
   */
  const handlePageChange = (page: number) => {
    setSearchParams((prev: any) => ({ ...prev, page }));
  };

  return (
    <div className="container mx-auto px-4">
      <div className="card bg-base-100 shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-primary">
          Clinical Trials Dashboard
        </h1>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="label">
                <span className="label-text">Condition/Disease</span>
              </label>
              <input
                type="text"
                name="condition"
                placeholder="e.g., Cancer, Diabetes"
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Status</span>
              </label>
              <input
                type="text"
                name="status"
                placeholder="e.g., Recruiting, Completed"
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Page Size</span>
              </label>
              <input
                type="number"
                name="pageSize"
                min={1}
                max={100}
                defaultValue={10}
                className="input input-bordered w-full"
              />
            </div>
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-primary px-6">
              Search
            </button>
          </div>
        </form>

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
            <div className="overflow-x-auto">
              <table className="table w-full table-zebra">
                <thead>
                  <tr>
                    <th>NCT ID</th>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Results</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(trials) && trials.length > 0 ? (
                    trials.map((trial: Trial) => (
                      <tr key={trial.nctId}>
                        <td>{trial.nctId}</td>
                        <td>
                          <a
                            href={`/trials/${trial.nctId}`}
                            className="link-primary font-semibold"
                          >
                            {trial.briefTitle}
                          </a>
                        </td>
                        <td>
                          <span
                            className={`badge ${getStatusBadge(
                              trial.overallStatus
                            )}`}
                          >
                            {trial.overallStatus}
                          </span>
                        </td>
                        <td>
                          {trial.hasResults ? (
                            <span className="badge badge-success">Yes</span>
                          ) : (
                            <span className="badge badge-error">No</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center">
                        No trials found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination Controls */}
            <Pagination
              currentPage={searchParams.page || 1}
              totalPages={Math.ceil(
                (stats?.totalCount || 100) / (searchParams.pageSize || 10)
              )}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      {/* Metadata Section */}
      {Array.isArray(metadata) && metadata.length > 0 && (
        <div className="card bg-base-100 shadow-md p-6 mt-8">
          <h2 className="text-2xl font-semibold mb-4">Study Metadata</h2>
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
        </div>
      )}

      {/* Study Statistics Section */}
      {stats && (
        <div className="card bg-base-100 shadow-md p-6 mt-8">
          <h2 className="text-2xl font-semibold mb-4">Study Statistics</h2>
          <div>
            <p>
              <strong>Total Studies:</strong> {stats.totalCount}
            </p>
            <p>
              <strong>Average Size (Bytes):</strong> {stats.averageSizeBytes}
            </p>
            <h3 className="text-xl font-semibold mt-4">Largest Studies</h3>
            <ul className="list-disc list-inside">
              {(Array.isArray(stats.largestStudies)
                ? stats.largestStudies.slice(0, 10)
                : []
              ).map((study) => (
                <li key={study.id}>
                  {study.id}: {study.sizeBytes} Bytes
                </li>
              ))}
            </ul>
          </div>
        </div>
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

export default TrialDashboard;
