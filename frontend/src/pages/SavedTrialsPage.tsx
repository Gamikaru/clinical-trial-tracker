/**
 * src/pages/SavedTrialsPage.tsx
 *
 * Displays the saved trials from localStorage with updated styling.
 */

import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

interface SavedTrial {
  nctId: string;
  title: string;
  overallStatus: string;
}

const SavedTrialsPage: React.FC = () => {
  const [savedTrials, setSavedTrials] = useState<SavedTrial[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("savedTrials");
    if (stored) {
      setSavedTrials(JSON.parse(stored));
    }
  }, []);

  const removeTrial = (nctId: string) => {
    const updated = savedTrials.filter((t) => t.nctId !== nctId);
    setSavedTrials(updated);
    localStorage.setItem("savedTrials", JSON.stringify(updated));
  };

  return (
    <motion.div
      className="container mx-auto px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="card bg-base-100 shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-primary">
          Saved Trials
        </h1>
        {savedTrials.length === 0 ? (
          <p className="text-center">No saved trials found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full table-zebra">
              <thead>
                <tr>
                  <th>NCT ID</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {savedTrials.map((trial) => (
                  <tr key={trial.nctId}>
                    <td>{trial.nctId}</td>
                    <td>{trial.title}</td>
                    <td>{trial.overallStatus}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => removeTrial(trial.nctId)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SavedTrialsPage;
