// /**
//  * hooks/useStudies2.ts
//  *
//  * An alternative approach to fetch studies from GET /studies
//  * Instead of returning a simplified array of trials, it returns the raw structure:
//  * {
//  *   totalCount: number,
//  *   studies: [...],       // array of the original "Study" shape
//  *   nextPageToken?: string
//  * }
//  *
//  * This might be useful if you need more direct control over the data structure or pagination.
//  */

// import { useEffect, useState } from "react";
// import axios from "../services/api";

// interface Study {
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

// interface StudiesResponse {
//     totalCount: number;
//     studies: Study[];
//     nextPageToken?: string;
// }

// const useStudies2 = (queryParams: Record<string, any>) => {
//     const [data, setData] = useState<StudiesResponse | null>(null);
//     const [loading, setLoading] = useState<boolean>(false);
//     const [error, setError] = useState<string | null>(null);

//     /**
//      * fetchStudies - calls /studies with the given query params
//      */
//     const fetchStudies = async () => {
//         setLoading(true);
//         setError(null);
//         console.log("Fetching studies with queryParams:", queryParams);
//         try {
//             // GET /studies
//             const response = await axios.get("/studies", { params: queryParams });
//             console.log("Received response:", response.data);
//             setData(response.data);
//         } catch (err: any) {
//             console.error("Error fetching studies:", err);
//             setError(err.message || "Failed to fetch studies.");
//             setData(null);
//         } finally {
//             setLoading(false);
//             console.log("Loading state set to false");
//         }
//     };

//     /**
//      * Refetch whenever queryParams changes
//      */
//     useEffect(() => {
//         console.log("useEffect triggered with queryParams:", queryParams);
//         fetchStudies();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [JSON.stringify(queryParams)]);

//     return { data, loading, error };
// };

// export default useStudies2;
