/**
 * src/hooks/useTrials.ts
 *
 * Hook for fetching a paginated list of trials from the local Python endpoint:
 * GET /api/filtered-studies
 */

import { useEffect, useState } from "react";
import api from "../services/api";

/** Basic shape of a trial record. */
export interface Trial {
    nctId: string;
    briefTitle: string;
    overallStatus: string;
    condition?: string;
    hasResults: boolean;
}

interface UseTrialsReturn {
    trials: Trial[];
    loading: boolean;
    error: string | null;
    nextPageToken: string | null;
    fetchNextPage: () => void;
    resetResults: () => void;
}

interface TrialsHookParams {
    pageSize?: number;
    format?: string;
    [key: string]: any; // for additional advanced search props
}

const useTrials = (initialParams: TrialsHookParams = {}): UseTrialsReturn => {
    const [trials, setTrials] = useState<Trial[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [nextPageToken, setNextPageToken] = useState<string | null>(null);

    // Merge user-provided params with defaults
    const [params, setParams] = useState<TrialsHookParams>({
        format: "json",
        pageSize: 10,
        ...initialParams,
    });

    /**
     * Clears the local trial list and page token, so we can start fresh
     */
    const resetResults = () => {
        setTrials([]);
        setNextPageToken(null);
    };

    /**
     * fetchTrials - calls /api/filtered-studies with whatever query params are in `params`.
     */
    const fetchTrials = async (extraParams?: any) => {
        setLoading(true);
        setError(null);

        try {
            const finalParams = { ...params, ...extraParams };
            console.log("[useTrials] GET /api/filtered-studies with:", finalParams);

            const response = await api.get("/api/filtered-studies", {
                params: finalParams,
            });
            const data = response.data;

            if (data && Array.isArray(data.studies)) {
                // Transform raw data into local shape
                const newTrials: Trial[] = data.studies.map((item: any) => ({
                    nctId: item.nctId,
                    briefTitle: item.briefTitle,
                    overallStatus: item.overallStatus,
                    condition: item.condition || "",
                    hasResults: !!item.hasResults,
                }));

                setTrials((prev) => [...prev, ...newTrials]);
                setNextPageToken(data.nextPageToken || null);
            } else {
                throw new Error("Invalid response structure: no `studies` array.");
            }
        } catch (err: any) {
            console.error("[useTrials] Error:", err);
            setError(err.message || "Failed to fetch trials.");
        } finally {
            setLoading(false);
        }
    };

    /**
     * fetchNextPage - load next page if nextPageToken is present.
     */
    const fetchNextPage = () => {
        if (nextPageToken) {
            fetchTrials({ pageToken: nextPageToken });
        }
    };

    // On mount or whenever `params` changes, load new trials
    useEffect(() => {
        resetResults();
        fetchTrials();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(params)]);

    return {
        trials,
        loading,
        error,
        nextPageToken,
        fetchNextPage,
        resetResults,
    };
};

export default useTrials;
