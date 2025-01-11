/**
 * src/hooks/useTrialDetails.ts
 *
 * Fetch a single study from GET /studies/{nctId}?format=json
 * and parse relevant fields, including the resultsSection (participantFlowModule).
 *
 * This version is updated to include the data needed for charts/visualizations in
 * your TrialDetailsPage results tab.
 */

import { useEffect, useState } from "react";
import api from "../services/api";

// Extend or reuse your existing definitions
interface Eligibility {
    criteria?: string;
}

/**
 * Because you're showing participant flow data, you want a shape for that:
 */
interface ParticipantFlowModule {
    groups?: { id: string; title: string }[];
    periods?: {
        milestones?: {
            achievements?: { groupId: string; numSubjects: string }[];
        }[];
    }[];
}

/**
 * For the overall resultsSection, you might only fetch participantFlowModule for now.
 */
interface ResultsSection {
    participantFlowModule?: ParticipantFlowModule;
}

/**
 * Full trial details shape, including resultsSection if hasResults = true.
 */
export interface TrialDetails {
    id: string;              // or 'nctId' — up to you
    nctId: string;
    briefTitle: string;
    overallStatus: string;
    hasResults: boolean;
    description?: string;
    eligibility?: {
        criteria?: string;
    };
    interventions?: string[];
    resultsSection?: ResultsSection;  // <-- we store the results data here
}

const useTrialDetails = (id: string) => {
    const [trial, setTrial] = useState<TrialDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * fetchTrialDetails - calls /studies/{nctId}?format=json
     * and transforms the response into a custom shape, including resultsSection.
     */
    const fetchTrialDetails = async () => {
        if (!id) return;

        setLoading(true);
        setError(null);
        console.debug(`Fetching trial details for ID: ${id}`);

        try {
            // GET /studies/{nctId} with the 'format=json' and your chosen fields
            const response = await api.get(`/studies/${id}`, {
                params: {
                    format: "json",
                    // We add resultsSection so we can retrieve participantFlowModule, etc.
                    fields: [
                        "NCTId",
                        "BriefTitle",
                        "OverallStatus",
                        "HasResults",
                        "protocolSection.descriptionModule",        // for 'description'
                        "protocolSection.eligibilityModule",        // for 'eligibility'
                        "protocolSection.armsInterventionsModule",  // for 'interventions'
                        "resultsSection",                           // for participant flow data
                    ].join(","),
                },
            });

            console.debug("API response received:", response);
            const data = response.data;

            if (!data?.protocolSection) {
                throw new Error("Invalid data format for trial details");
            }

            /**
             * Extract key fields from the top-level & protocolSection
             */
            const nctId = data.protocolSection.identificationModule?.nctId || "";
            const briefTitle =
                data.protocolSection.identificationModule?.briefTitle || "";
            const overallStatus =
                data.protocolSection.statusModule?.overallStatus || "UNKNOWN";
            const hasResults = data?.hasResults || false;

            // Description from protocolSection.descriptionModule.briefSummary
            const description =
                data.protocolSection.descriptionModule?.briefSummary || "No summary";

            // Eligibility from protocolSection.eligibilityModule.eligibilityCriteria
            const eligibilityCriteria =
                data.protocolSection.eligibilityModule?.eligibilityCriteria || "";
            const eligibility = { criteria: eligibilityCriteria };

            // Interventions from armsInterventionsModule.armGroupList => flatten the interventionList
            const interventions =
                data.protocolSection.armsInterventionsModule?.armGroupList?.reduce(
                    (acc: string[], arm: any) => {
                        if (Array.isArray(arm?.interventionList)) {
                            arm.interventionList.forEach((intrv: any) => {
                                if (typeof intrv === "string") {
                                    acc.push(intrv);
                                } else if (intrv?.interventionName) {
                                    acc.push(intrv.interventionName);
                                }
                            });
                        }
                        return acc;
                    },
                    []
                ) || [];

            // We'll store the entire resultsSection for simpler chart usage
            const resultsSection = data.resultsSection || {};

            const transformed: TrialDetails = {
                id: nctId,
                nctId,
                briefTitle,
                overallStatus,
                hasResults,
                description,
                eligibility,
                interventions,
                resultsSection,
            };

            console.debug("Transformed trial details (with results):", transformed);
            setTrial(transformed);
        } catch (err: any) {
            console.error("Error fetching trial details:", err);
            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to fetch trial details."
            );
            setTrial(null);
        } finally {
            setLoading(false);
            console.debug("Fetching trial details completed.");
        }
    };

    useEffect(() => {
        fetchTrialDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return { trial, loading, error };
};

export default useTrialDetails;
