import { useEffect, useState } from "react";
import api from "../services/api";

interface Eligibility {
  criteria: string;
}

interface TrialDetails {
  nctId: string;
  briefTitle: string;
  overallStatus: string;
  hasResults: boolean;
  description: string;
  eligibility?: Eligibility;
  interventions?: string[];
}

const useTrialDetails = (id: string) => {
  const [trial, setTrial] = useState<TrialDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * fetchTrialDetails - calls /studies/{nctId}?format=json
   * and transforms the response into a custom shape.
   */
  const fetchTrialDetails = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    console.debug(`Fetching trial details for ID: ${id}`);
    try {
      // GET /studies/{nctId}?format=json&fields=...
      const response = await api.get(`/studies/${id}`, {
        params: {
          format: "json",
          fields:
            "NCTId,BriefTitle,OverallStatus,HasResults,protocolSection.descriptionModule,protocolSection.eligibilityModule,protocolSection.armsInterventionsModule",
        },
      });
      console.debug("API response received:", response);
      const data = response.data;

      // Basic validation
      if (!data?.protocolSection) {
        throw new Error("Invalid data format for trial details");
      }

      // Extract key fields
      const nctId = data?.protocolSection?.identificationModule?.nctId || "";
      const briefTitle =
        data?.protocolSection?.identificationModule?.briefTitle || "";
      const overallStatus =
        data?.protocolSection?.statusModule?.overallStatus || "UNKNOWN";
      const hasResults = data?.hasResults || false;

      // Description is often stored in protocolSection.descriptionModule.briefSummary
      const description =
        data?.protocolSection?.descriptionModule?.briefSummary || "No summary";

      // Eligibility is found under eligibilityModule. We store the "eligibilityCriteria" text.
      const eligibilityCriteria =
        data?.protocolSection?.eligibilityModule?.eligibilityCriteria || "";
      const eligibility: Eligibility = { criteria: eligibilityCriteria };

      // Interventions might appear under armsInterventionsModule.armGroupList[x].interventionList
      // We flatten all interventions into a simple string[].
      const interventions =
        data?.protocolSection?.armsInterventionsModule?.armGroupList?.reduce(
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

      const transformed: TrialDetails = {
        nctId,
        briefTitle,
        overallStatus,
        hasResults,
        description,
        eligibility,
        interventions,
      };

      console.debug("Transformed trial details:", transformed);
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
