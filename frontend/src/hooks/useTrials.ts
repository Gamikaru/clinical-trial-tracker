import { useEffect, useState } from "react";
import api from "../services/api";

// Define the Trial interface
export interface Trial {
    nctId: string;
    briefTitle: string;
    overallStatus: string;
    hasResults: boolean;
    condition?: string;
}

// Interface for the hook's return value
interface UseTrialsReturn {
    trials: Trial[];
    loading: boolean;
    error: string | null;
    nextPageToken: string | null;
    refetch: (additionalParams?: any) => void;
}

/**
 * useTrials - Custom hook for fetching ClinicalTrials.gov studies data.
 *  - Merges your "initialParams" with any subsequent calls to "refetch".
 *  - Transforms the raw study data into a simpler "Trial" interface.
 */
const useTrials = (initialParams: any): UseTrialsReturn => {
    const [trials, setTrials] = useState<Trial[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [nextPageToken, setNextPageToken] = useState<string | null>(null);

    const [params, setParams] = useState<any>({
        ...initialParams,
        // Increase the page size by default to fetch more trials for better chart data
        pageSize: initialParams?.pageSize ?? 100,
    });

    /**
     * Allows dynamic updates to the search parameters from outside.
     * Merges new params with existing ones and triggers a refetch.
     */
    const refetch = (additionalParams?: any) => {
        setParams((prev: any) => ({
            ...prev,
            ...additionalParams,
        }));
    };

    /**
     * Fetch trials from GET /studies.
     * Transforms them into an array of `Trial` objects with
     * a fallback for condition if none is provided.
     */
    const fetchTrials = async () => {
        setLoading(true);
        setError(null);
        console.debug("Fetching trials with params:", params);

        try {
            const response = await api.get("/studies", { params });
            const data = response.data;
            console.debug("API response (trials):", data);

            if (data && Array.isArray(data.studies)) {
                const transformed = data.studies.map((study: any) => {
                    const nctId =
                        study?.protocolSection?.identificationModule?.nctId || "";
                    const briefTitle =
                        study?.protocolSection?.identificationModule?.briefTitle || "";
                    const overallStatus =
                        study?.protocolSection?.statusModule?.overallStatus || "UNKNOWN";
                    const hasResults = study?.hasResults || false;

                    // Pull first condition from conditionList. Fallback to "No Condition Info" if empty.
                    const conditionList =
                        study?.protocolSection?.conditionsModule?.conditionList || [];
                    const firstCondition = conditionList[0] || "";
                    const condition = firstCondition.trim()
                        ? firstCondition
                        : "No Condition Info";

                    return {
                        nctId,
                        briefTitle,
                        overallStatus,
                        hasResults,
                        condition,
                    };
                });

                setTrials(transformed);
                setNextPageToken(data.nextPageToken || null);

                console.debug("Transformed trials array:", transformed);
            } else {
                throw new Error("Studies data is not an array or is missing.");
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

    /**
     * Refetch trials whenever `params` changes.
     */
    useEffect(() => {
        fetchTrials();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(params)]);

    return { trials, loading, error, nextPageToken, refetch };
};

export default useTrials;
