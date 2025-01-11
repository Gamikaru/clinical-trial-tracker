// /**
//  * hooks/useStudy.ts
//  *
//  * Fetch a single study from GET /studies/{nctId}
//  * This returns the raw structure of the study as-is.
//  * If you need a more "transformed" shape, see useTrialDetails.
//  */

// import { useEffect, useState } from "react";
// import axios from "../services/api";

// interface SingleStudyResponse {
//     protocolSection: {
//         identificationModule: {
//             nctId: string;
//             briefTitle: string;
//         };
//         statusModule: {
//             overallStatus: string;
//         };
//     };
//     hasResults: boolean;
// }

// const useStudy = (nctId: string) => {
//     const [study, setStudy] = useState<SingleStudyResponse | null>(null);
//     const [loading, setLoading] = useState<boolean>(false);
//     const [error, setError] = useState<string | null>(null);

//     const fetchStudy = async () => {
//         console.log("Fetching study with nctId:", nctId);
//         setLoading(true);
//         setError(null);
//         try {
//             // GET /studies/{nctId}
//             const response = await axios.get(`/studies/${nctId}`);
//             console.log("Study fetched successfully:", response.data);
//             setStudy(response.data);
//         } catch (err: any) {
//             console.error("Error fetching study:", err);
//             setError(err.message || "Failed to fetch study.");
//             setStudy(null);
//         } finally {
//             setLoading(false);
//             console.log("Fetch study completed. Loading:", loading);
//         }
//     };

//     useEffect(() => {
//         if (nctId) {
//             console.log("useEffect triggered with nctId:", nctId);
//             fetchStudy();
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [nctId]);

//     return { study, loading, error };
// };

// export default useStudy;
