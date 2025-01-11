/**
 * src/pages/ParticipantManagementPage.tsx
 *
 * Example form for creating participants. Styled with a subtle motion effect.
 */

import { motion } from "framer-motion";
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
            // Example only.
            const response = await axios.post("/api/v2/participants", { name, trialId });
            setMessage("Participant created successfully!");
            console.log("Participant created:", response.data);
        } catch (error) {
            console.error("Error creating participant:", error);
            setMessage("Error creating participant.");
        }
    };

    return (
        <motion.div
            className="container mx-auto px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            <div className="max-w-md mx-auto card bg-white shadow-lg p-6 mt-10">
                <h2 className="text-2xl font-semibold mb-4 text-neutral">Participant Management</h2>
                {message && <p className="mb-2 text-gray-600">{message}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Participant Name"
                        className="input input-bordered w-full transition duration-300 ease-in-out transform hover:scale-105"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <input
                        type="text"
                        placeholder="Trial ID (NCTXXXXXXXX)"
                        className="input input-bordered w-full transition duration-300 ease-in-out transform hover:scale-105"
                        value={trialId}
                        onChange={(e) => setTrialId(e.target.value)}
                        required
                    />

                    <button type="submit" className="btn btn-ghost w-full transition duration-300 ease-in-out transform hover:scale-105">
                        Add Participant
                    </button>
                </form>
            </div>
        </motion.div>
    );
};

export default ParticipantManagementPage;
