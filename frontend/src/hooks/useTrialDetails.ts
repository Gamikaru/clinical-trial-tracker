import axios from "axios";
import { useEffect, useState } from "react";

/**
 * Eligibility interface defines the structure of eligibility criteria.
 */
interface Eligibility {
  criteria: string;
  // Add other properties if needed
}

/**
 * TrialDetails interface defines the structure of a detailed clinical trial.
 */
interface TrialDetails {
  nctId: string;
  briefTitle: string;
  overallStatus: string;
  hasResults: boolean;
  description: string;
  eligibility?: Eligibility;
  interventions?: string[];
  // Add other properties as needed
}

/**
 * useTrialDetails hook fetches detailed information about a specific trial.
 * @param id - NCT ID of the trial
 * @returns trial details, loading state, and error message
 */
const useTrialDetails = (id: string) => {
  const [trial, setTrial] = useState<TrialDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrialDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/v2/studies/${id}`);
      setTrial(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch trial details.");
      setTrial(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTrialDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return { trial, loading, error };
};

export default useTrialDetails;
