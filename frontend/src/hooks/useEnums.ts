// import { useEffect, useState } from "react";
// import axios from "../services/api";

// interface EnumValue {
//     value: string;
//     legacyValue: string;
//     exceptions: Record<string, string>;
// }

// interface EnumType {
//     type: string;
//     pieces: string[];
//     values: EnumValue[];
// }

// const useEnums = () => {
//     const [enums, setEnums] = useState<EnumType[] | null>(null);
//     const [loading, setLoading] = useState<boolean>(false);
//     const [error, setError] = useState<string | null>(null);

//     /**
//      * fetchEnums - calls /studies/enums
//      * If successful, we store the array of EnumType in state.
//      */
//     const fetchEnums = async () => {
//         console.log("fetchEnums: start fetching enums");
//         setLoading(true);
//         setError(null);
//         try {
//             // GET /studies/enums
//             const response = await axios.get("/studies/enums");
//             console.log("fetchEnums: received response", response.data);
//             setEnums(response.data);
//         } catch (err: any) {
//             console.error("fetchEnums: error occurred", err);
//             setError(err.message || "Failed to fetch enums.");
//             setEnums(null);
//         } finally {
//             setLoading(false);
//             console.log("fetchEnums: finished fetching enums");
//         }
//     };

//     /**
//      * Fetch on initial mount
//      */
//     useEffect(() => {
//         console.log("useEffect: component mounted, fetching enums");
//         fetchEnums();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);

//     return { enums, loading, error };
// };

// export default useEnums;
