/**
 * src/hooks/useTrials.ts
 *
 * Provides a custom hook to fetch trial data from your local Python backend,
 * calling `GET /api/filtered-studies` instead of the old external endpoint.
 */

import { useEffect, useState } from "react";
import api from "../services/api";

/**
 * Shape of a single trial record.
 */
export interface Trial {
    nctId: string;
    briefTitle: string;
    overallStatus: string;
    condition?: string;
    hasResults: boolean;
}

/**
 * useTrialsReturn interface for the hook return object.
 */
interface UseTrialsReturn {
    trials: Trial[];
    loading: boolean;
    error: string | null;
    nextPageToken: string | null;
    fetchNextPage: () => void;
    resetResults: () => void;
}

/**
 * Props for controlling initial parameters, e.g. pageSize, condition, etc.
 * You can add more as needed.
 */
interface TrialsHookProps {
    format?: string;
    pageSize?: number;
    condition?: string; // if you want to pass a condition
    [key: string]: any; // for flexible additional params
}

const useTrials = (initialParams: TrialsHookProps = {}): UseTrialsReturn => {
    const [trials, setTrials] = useState<Trial[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [nextPageToken, setNextPageToken] = useState<string | null>(null);

    // Merge user-provided params with defaults
    const [params, setParams] = useState<TrialsHookProps>({
        ...initialParams,
    });

    /**
     * Resets the local trial list & page token.
     */
    const resetResults = () => {
        setTrials([]);
        setNextPageToken(null);
    };

    /**
     * fetchTrials - calls our Python backend endpoint /api/filtered-studies
     * with whatever query params are in `params`.
     */
    const fetchTrials = async (extraParams?: any) => {
        setLoading(true);
        setError(null);
        try {
            const mergedParams = { ...params, ...extraParams };
            console.log("[useTrials] Fetching from /api/filtered-studies with:", mergedParams);

            const response = await api.get("/api/filtered-studies", {
                params: mergedParams,
            });
            const data = response.data;

            // The structure returned by your Python endpoint is:
            // {
            //   count: number,
            //   studies: [...],
            //   nextPageToken: string | null
            // }
            if (data && Array.isArray(data.studies)) {
                // We'll shape them into the local structure if needed
                const newTrials = data.studies.map((study: any): Trial => {
                    return {
                        nctId: study.nctId,
                        briefTitle: study.briefTitle,
                        overallStatus: study.overallStatus,
                        condition: study.condition,
                        hasResults: study.hasResults,
                    };
                });

                // Merge with existing
                setTrials((prev) => [...prev, ...newTrials]);
                setNextPageToken(data.nextPageToken || null);
            } else {
                throw new Error("Response did not contain a valid 'studies' array.");
            }
        } catch (err: any) {
            console.error("[useTrials] Error fetching trials:", err);
            setError(err.message || "Failed to fetch trials.");
        } finally {
            setLoading(false);
        }
    };

    /**
     * fetchNextPage - loads the next page if nextPageToken is present
     */
    const fetchNextPage = () => {
        if (nextPageToken) {
            fetchTrials({ pageToken: nextPageToken });
        }
    };

    // On mount or whenever `params` changes, fetch
    useEffect(() => {
        resetResults(); // Optional: clear existing results
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
