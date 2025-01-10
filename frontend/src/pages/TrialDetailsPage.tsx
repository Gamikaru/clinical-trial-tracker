import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import useTrialDetails from "../hooks/useTrialDetails";

// Reuse the same badge color helper
const getStatusBadge = (status: string) => {
  console.log("getStatusBadge called with status:", status);
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
  console.log("useParams returned id:", id);
  const { trial, loading, error } = useTrialDetails(id || "");

  useEffect(() => {
    console.log("useTrialDetails hook returned:", { trial, loading, error });
  }, [trial, loading, error]);

  if (loading) {
    console.log("Loading state");
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    console.error("Error state:", error);
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (!trial) {
    console.warn("No trial found");
    return <p className="text-center">No trial found.</p>;
  }

  console.log("Rendering trial details:", trial);

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
          {/* Additional Info */}
          <div>
            <h3 className="text-xl font-semibold">Eligibility Criteria</h3>
            <p>{trial.eligibility?.criteria || "N/A"}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Interventions</h3>
            <p>
              {trial.interventions && trial.interventions.length > 0
                ? trial.interventions.join(", ")
                : "N/A"}
            </p>
          </div>
        </div>
        <div className="text-center mt-8">
          <Link to="/trials" className="btn btn-secondary px-6">
            Back to Trials
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrialDetailsPage;
