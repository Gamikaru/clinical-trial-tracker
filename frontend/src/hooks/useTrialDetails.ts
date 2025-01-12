/**
 * src/hooks/useTrialDetails.ts
 *
 * Fetch a single study from GET /api/studies/{nctId}?fields=...
 * The data is fetched from your local Python backend.
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
    resultsSection?: any; // or a typed object if you wish
}

const useTrialDetails = (nctId: string) => {
    const [trial, setTrial] = useState<TrialDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTrialDetails = async () => {
        if (!nctId) return;
        setLoading(true);
        setError(null);
        console.log(`[useTrialDetails] Fetching /api/studies/${nctId}`);
        try {
            // e.g. GET /api/studies/NCT04000165?fields=...
            const response = await api.get(`/api/studies/${nctId}`, {
                params: {
                    fields: ["protocolSection.resultsSection"], // example optional fields
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
