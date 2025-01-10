import { useEffect, useState } from "react";
import axios from "../services/api";

/**
 * Trial interface defines the structure of a clinical trial object.
 */
export interface Trial {
  nctId: string;
  briefTitle: string;
  overallStatus: string;
  hasResults: boolean;
  condition?: string; // Optional property
  // Add other properties as needed
}

/**
 * useTrials hook fetches a list of trials based on search parameters.
 * @param searchParams - Parameters to filter trials
 * @returns trials data, loading state, error message, and refetch function
 */
const useTrials = (searchParams: any) => {
  const [trials, setTrials] = useState<Trial[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrials = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/studies', { params: searchParams });
      console.log("Trials Response:", response.data);
      if (response.data && Array.isArray(response.data.studies)) {
        setTrials(response.data.studies);
      } else {
        throw new Error("Studies data is not an array");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch trials.");
      setTrials([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(searchParams)]); // Re-fetch when searchParams change

  return { trials, loading, error, refetch: fetchTrials };
};

export default useTrials;
