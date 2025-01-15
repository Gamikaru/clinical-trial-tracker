/**
 * src/hooks/useTrialDetails.ts
 *
 * Fetches data for a single trial from GET /api/studies/{nctId}.
 */

import { useEffect, useState } from "react";
import api from "../services/api";

interface TrialDetails {
    nctId: string;
    briefTitle: string;
    overallStatus: string;
    hasResults: boolean;
    description?: string;
    eligibility?: { criteria?: string };
    interventions?: string[];
    resultsSection?: any; // or a more detailed shape
}

const useTrialDetails = (nctId: string) => {
    const [trial, setTrial] = useState<TrialDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTrialDetails = async () => {
        if (!nctId) return;
        setLoading(true);
        setError(null);

        try {
            console.log("[useTrialDetails] GET /api/studies/", nctId);
            const response = await api.get(`/api/studies/${nctId}`, {
                // example: request resultsSection
                params: {
                    fields: ["protocolSection.resultsSection"],
                },
            });
            setTrial(response.data);
        } catch (err: any) {
            console.error("[useTrialDetails] Error:", err);
            setError(err.message || "Failed to fetch trial details.");
            setTrial(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrialDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nctId]);

    return { trial, loading, error };
};

export default useTrialDetails;
