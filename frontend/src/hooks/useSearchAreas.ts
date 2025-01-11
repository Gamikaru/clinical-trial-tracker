// /**
//  * hooks/useSearchAreas.ts
//  *
//  * Fetches an array of "search docs" and their "search areas" from GET /studies/search-areas
//  * This includes info about area names, parameters, UI labels, etc.
//  *
//  * Example response shape (simplified):
//  * [
//  *   {
//  *     "name": "BasicSearch Doc",
//  *     "areas": [
//  *       {
//  *         "name": "ConditionSearch",
//  *         "param": "cond",
//  *         "uiLabel": "Conditions or disease",
//  *         "parts": [...]
//  *       }
//  *     ]
//  *   }
//  * ]
//  */

// import { useEffect, useState } from "react";
// import axios from "../services/api";

// interface SearchArea {
//   name: string; // e.g. "ConditionSearch"
//   param: string; // e.g. "cond"
//   uiLabel: string; // e.g. "Conditions or disease"
//   // add other relevant fields if needed
// }

// const useSearchAreas = () => {
//   const [searchAreas, setSearchAreas] = useState<SearchArea[] | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   /**
//    * fetchSearchAreas - calls /studies/search-areas
//    */
//   const fetchSearchAreas = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       // GET /studies/search-areas
//       const response = await axios.get("/studies/search-areas");
//       setSearchAreas(response.data);
//     } catch (err: any) {
//       setError(err.message || "Failed to fetch search areas.");
//       setSearchAreas(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /**
//    * Fetch on mount
//    */
//   useEffect(() => {
//     fetchSearchAreas();
//   }, []);

//   return { searchAreas, loading, error };
// };

// export default useSearchAreas;
