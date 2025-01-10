/**
 * src/pages/ParticipantManagementPage.tsx
 *
 * Demonstrates how you might manage participants in your own backend.
 * The official ClinicalTrials.gov API does NOT provide a write endpoint for participant data.
 */

import React, { useState } from "react";
import axios from "../services/api";

const ParticipantManagementPage: React.FC = () => {
  const [name, setName] = useState("");
  const [trialId, setTrialId] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      // Example only. Update to your actual backend route if needed.
      const response = await axios.post("/api/v2/participants", { name, trialId });
      setMessage("Participant created successfully!");
      console.log("Participant created:", response.data);
    } catch (error) {
      console.error("Error creating participant:", error);
      setMessage("Error creating participant.");
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-md mx-auto card bg-base-100 shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Participant Management</h2>
        {message && <p className="mb-2">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Participant Name */}
          <input
            type="text"
            placeholder="Participant Name"
            className="input input-bordered w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* Trial ID */}
          <input
            type="text"
            placeholder="Trial ID (NCTXXXXXXXX)"
            className="input input-bordered w-full"
            value={trialId}
            onChange={(e) => setTrialId(e.target.value)}
            required
          />

          <button type="submit" className="btn btn-primary w-full">
            Add Participant
          </button>
        </form>
      </div>
    </div>
  );
};

export default ParticipantManagementPage;
