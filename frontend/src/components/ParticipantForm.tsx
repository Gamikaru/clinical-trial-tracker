// /**
//  * components/ParticipantForm.tsx
//  *
//  * Example form that POSTs a new participant to your own (internal) /api/v2/participants.
//  * Note that the official ClinicalTrials.gov Data API does NOT provide a write endpoint
//  * for participant data. This is presumably your own backend route for demonstration.
//  */

// import axios from "axios";
// import React, { useState } from "react";

// const ParticipantForm: React.FC = () => {
//   const [name, setName] = useState("");
//   const [trialId, setTrialId] = useState<string>("");
//   const [message, setMessage] = useState<string | null>(null);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("Submitting participant:", { name, trialId });
//     try {
//       // Example only. Adjust the endpoint to your actual backend route.
//       const response = await axios.post("/api/v2/participants", {
//         name,
//         trialId,
//       });
//       setMessage("Participant created successfully!");
//       console.log("Participant created:", response.data);
//     } catch (error) {
//       console.error("Error creating participant:", error);
//       setMessage("Error creating participant.");
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto card bg-base-100 shadow-md p-6">
//       <h2 className="text-xl font-semibold mb-4">Add Participant</h2>
//       {message && <p className="mb-2">{message}</p>}
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="text"
//           placeholder="Name"
//           className="input input-bordered w-full"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//         />
//         <input
//           type="text"
//           placeholder="Trial ID (NCTXXXXXXXX)"
//           className="input input-bordered w-full"
//           value={trialId}
//           onChange={(e) => setTrialId(e.target.value)}
//           required
//         />
//         <button type="submit" className="btn btn-primary w-full">
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ParticipantForm;
