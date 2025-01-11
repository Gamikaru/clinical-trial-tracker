/**
 * src/hooks/useTrials.ts
 *
 * Updated to include fetchNextPage and resetResults methods, plus dedup logic
 * to avoid duplicate keys in the React list.
 */

import { useEffect, useState } from "react";
import api from "../services/api";

// Extend or reuse your existing Trial interface
export interface Trial {
    nctId: string;
    briefTitle: string;
    overallStatus: string;
    orgStudyId?: string;
    secondaryIds?: string[];
    startDate?: string;
    lastUpdatePostDate?: string;
    hasResults: boolean;
    condition?: string;
}

interface UseTrialsReturn {
    trials: Trial[];
    loading: boolean;
    error: string | null;
    nextPageToken: string | null;
    refetch: (additionalParams?: any) => void;
    fetchNextPage: () => void;
    resetResults: () => void;
}

const useTrials = (initialParams: any): UseTrialsReturn => {
    const [trials, setTrials] = useState<Trial[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [nextPageToken, setNextPageToken] = useState<string | null>(null);

    // Merge user-provided params with defaults
    const [params, setParams] = useState<any>({
        format: "json",
        pageSize: initialParams?.pageSize ?? 50,
        fields:
            "NCTId," +
            "protocolSection.identificationModule.orgStudyIdInfo.id," +
            "protocolSection.identificationModule.secondaryIdInfos.id," +
            "protocolSection.identificationModule.briefTitle," +
            "protocolSection.statusModule.overallStatus," +
            "protocolSection.statusModule.startDateStruct.date," +
            "protocolSection.statusModule.lastUpdatePostDateStruct.date," +
            "protocolSection.conditionsModule," +
            "HasResults",
        ...initialParams,
    });

    /**
     * refetch: let external code override or update params
     * and clear existing data so we start fresh.
     */
    const refetch = (additionalParams?: any) => {
        setTrials([]);
        setNextPageToken(null);
        setParams((prev: any) => ({
            ...prev,
            ...additionalParams,
        }));
    };

    /**
     * fetchTrials: call /studies
     */
    const fetchTrials = async (extraParams?: any) => {
        setLoading(true);
        setError(null);
        try {
            const finalParams = { ...params, ...extraParams };
            console.debug("useTrials: calling GET /studies with params:", finalParams);

            const response = await api.get("/studies", { params: finalParams });
            const data = response.data;

            if (data && Array.isArray(data.studies)) {
                // Transform raw data to local shape
                const newTrials = data.studies.map((study: any) => {
                    const nctId = study?.protocolSection?.identificationModule?.nctId || "";
                    const orgStudyId =
                        study?.protocolSection?.identificationModule?.orgStudyIdInfo?.id || "";
                    const secIdInfos =
                        study?.protocolSection?.identificationModule?.secondaryIdInfos || [];
                    const secondaryIds = secIdInfos.map((sec: any) => sec?.id || "");
                    const briefTitle =
                        study?.protocolSection?.identificationModule?.briefTitle || "";
                    const overallStatus =
                        study?.protocolSection?.statusModule?.overallStatus || "UNKNOWN";
                    const startDate =
                        study?.protocolSection?.statusModule?.startDateStruct?.date || null;
                    const lastUpdatePostDate =
                        study?.protocolSection?.statusModule?.lastUpdatePostDateStruct?.date ||
                        null;
                    const conditionList =
                        study?.protocolSection?.conditionsModule?.conditions || [];
                    const condition = conditionList[0] || "No Condition Info";
                    const hasResults = study?.hasResults || false;

                    return {
                        nctId,
                        orgStudyId,
                        secondaryIds,
                        briefTitle,
                        overallStatus,
                        startDate,
                        lastUpdatePostDate,
                        hasResults,
                        condition,
                    };
                });

                // Deduplicate by nctId (important if next page re-sends duplicates)
                setTrials((prev) => {
                    const merged = [...prev, ...newTrials];
                    const uniqueByNCT = merged.reduce((acc, trial) => {
                        if (!acc.some((t: Trial) => t.nctId === trial.nctId)) {
                            acc.push(trial);
                        }
                        return acc;
                    }, [] as Trial[]);
                    return uniqueByNCT;
                });

                setNextPageToken(data.nextPageToken || null);
            } else {
                throw new Error("Data did not contain a valid 'studies' array.");
            }
        } catch (err: any) {
            if (err.response) {
                console.error("API Error Response:", err.response.data);
                setError(err.response.data.message || "Failed to fetch trials.");
            } else {
                console.error("Error fetching trials:", err);
                setError(err.message || "Failed to fetch trials.");
            }
            // Clear trials if there's an error
            setTrials([]);
        } finally {
            setLoading(false);
        }
    };

    /**
     * fetchNextPage - load the next page of trials if nextPageToken is present
     */
    const fetchNextPage = () => {
        if (nextPageToken) {
            fetchTrials({ pageToken: nextPageToken });
        }
    };

    /**
     * resetResults - clears existing trials and nextPageToken
     */
    const resetResults = () => {
        setTrials([]);
        setNextPageToken(null);
    };

    // On mount or whenever params changes, fetch the first page
    useEffect(() => {
        fetchTrials();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(params)]);

    return {
        trials,
        loading,
        error,
        nextPageToken,
        refetch,
        fetchNextPage,
        resetResults,
    };
};

export default useTrials;
