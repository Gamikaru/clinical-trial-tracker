import { useEffect, useState } from "react";
import api from "../services/api";

export interface Trial {
  nctId: string;
  briefTitle: string;
  overallStatus: string;
  hasResults: boolean;
  condition?: string;
}

interface UseTrialsReturn {
  trials: Trial[];
  loading: boolean;
  error: string | null;
  nextPageToken: string | null;
  refetch: (additionalParams?: any) => void;
}

const useTrials = (initialParams: any): UseTrialsReturn => {
  const [trials, setTrials] = useState<Trial[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);

  const [params, setParams] = useState<any>(initialParams);

  /**
   * Allows dynamic updates to the search parameters from outside
   */
  const refetch = (additionalParams?: any) => {
    setParams((prev: any) => ({
      ...prev,
      ...additionalParams,
    }));
  };

  const fetchTrials = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching trials with params:", params);
      // GET /studies with the specified params
      const response = await api.get("/studies", { params });
      const data = response.data;
      console.log("API response:", data);

      if (data && Array.isArray(data.studies)) {
        const transformed = data.studies.map((study: any) => {
          const nctId =
            study?.protocolSection?.identificationModule?.nctId || "";
          const briefTitle =
            study?.protocolSection?.identificationModule?.briefTitle || "";
          const overallStatus =
            study?.protocolSection?.statusModule?.overallStatus || "UNKNOWN";
          const hasResults = study?.hasResults || false;

          // Pull first condition from conditionList
          const conditionList =
            study?.protocolSection?.conditionsModule?.conditionList?.map(
              (c: string) => c
            ) || [];
          const firstCondition = conditionList[0] || "";

          return {
            nctId,
            briefTitle,
            overallStatus,
            hasResults,
            condition: firstCondition,
          };
        });

        setTrials(transformed);
        setNextPageToken(data.nextPageToken || null);
      } else {
        throw new Error("Studies data is not an array");
      }
    } catch (err: any) {
      if (err.response) {
        console.error("API Error Response:", err.response.data);
        setError(err.response.data.message || "Failed to fetch trials.");
      } else {
        console.error("Error fetching trials:", err);
        setError(err.message || "Failed to fetch trials.");
      }
      setTrials([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  return { trials, loading, error, nextPageToken, refetch };
};

export default useTrials;
