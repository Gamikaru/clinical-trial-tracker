import React from "react";
import { Link, useParams } from "react-router-dom";
import useTrialDetails from "../hooks/useTrialDetails";

/**
 * TrialDetails component displays detailed information about a specific trial.
 */
const TrialDetailsComponent: React.FC = () => {
  // Renamed to avoid naming conflict with interface
  const { id } = useParams<{ id: string }>();
  const { trial, loading, error } = useTrialDetails(id || "");

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (!trial) {
    return <p className="text-center">No trial found.</p>;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="card bg-base-100 shadow-md p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-primary">
          Trial Details
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold">NCT ID</h3>
            <p>{trial.nctId}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Title</h3>
            <p>{trial.briefTitle}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Status</h3>
            <span className={`badge ${getStatusBadge(trial.overallStatus)}`}>
              {trial.overallStatus}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Description</h3>
            <p>{trial.description}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Has Results</h3>
            {trial.hasResults ? (
              <span className="badge badge-success">Yes</span>
            ) : (
              <span className="badge badge-error">No</span>
            )}
          </div>
          {/* Additional Trial Information */}
          <div>
            <h3 className="text-xl font-semibold">Eligibility Criteria</h3>
            <p>{trial.eligibility?.criteria || "N/A"}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Interventions</h3>
            <p>{trial.interventions?.join(", ") || "N/A"}</p>
          </div>
        </div>
        <div className="text-center mt-8">
          <Link to="/" className="btn btn-secondary px-6">
            Back to Dashboard
          </Link>
        </div>
      </div>
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

export default TrialDetailsComponent; // Updated export
