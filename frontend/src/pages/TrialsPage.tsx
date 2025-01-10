import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useTrials from "../hooks/useTrials";

const TrialsPage: React.FC = () => {
  const { trials, loading, error } = useTrials({
    format: "json",
    pageSize: 50,
    fields:
      "NCTId,BriefTitle,OverallStatus,HasResults,protocolSection.conditionsModule",
  });

  useEffect(() => {
    console.log("Trials data:", trials);
  }, [trials]);

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

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">
        Trials List
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trials.map((trial) => (
          <div key={trial.nctId} className="card bg-base-100 shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">{trial.briefTitle}</h2>
            <p className="mb-2">
              <strong>Status:</strong> {trial.overallStatus}
            </p>
            <p className="mb-4">
              <strong>Condition:</strong> {trial.condition || "N/A"}
            </p>
            <Link to={`/trials/${trial.nctId}`} className="btn btn-primary">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrialsPage;
